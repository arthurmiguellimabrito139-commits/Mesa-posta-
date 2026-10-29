import { db } from '../config/db.js';
import crypto from 'node:crypto';
import Evento from '../models/Evento.js';
import Mesa from '../models/Mesa.js';
import Pessoa from '../models/Pessoa.js';

// Cria o evento e as mesas numa transação: ou salva tudo, ou nada
export async function salvarEvento(evento, usuarioId) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const code = crypto.randomBytes(3).toString('hex').toUpperCase(); // ex: "A3F9C1"
    const adminToken = crypto.randomBytes(24).toString('hex');       // não é mais usado; a coluna ainda é NOT NULL

    const [resultado] = await conn.execute(
      `INSERT INTO events (usuario_id, code, admin_token, name, date, time, location)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [usuarioId, code, adminToken, evento.nome, evento.data, evento.horario || '20:00', evento.local ?? null],
    );

    const eventoId = resultado.insertId;

    for (const mesa of evento.mesas) {
      await conn.execute(
        'INSERT INTO event_tables (event_id, number, seats) VALUES (?, ?, ?)',
        [eventoId, mesa.number, mesa.seats],
      );
    }

    await conn.commit();

    // objeto e banco passam a ter o mesmo id
    evento.id = eventoId;
    evento.mesas.forEach((mesa) => { mesa.eventId = eventoId; });

    return { code };
  } catch (erro) {
    await conn.rollback();
    throw erro;
  } finally {
    conn.release();
  }
}

// Monta o Evento com as mesas e as pessoas de cada mesa
export async function carregarEvento(code) {
  // 1. o evento
  const [eventos] = await db.execute(
    'SELECT id, code, name, date, time, location FROM events WHERE code = ?',
    [code],
  );
  if (eventos.length === 0) return null;

  const e = eventos[0];
  const evento = new Evento(e.id, e.name, e.date, e.time, e.location);
  evento.code = e.code;

  // 2. as mesas
  const [mesas] = await db.execute(
    'SELECT id, number, seats FROM event_tables WHERE event_id = ? ORDER BY number',
    [evento.id],
  );
  for (const m of mesas) {
    evento.mesas.push(new Mesa(m.id, evento.id, m.number, m.seats));
  }

  // 3. as pessoas, cada uma na sua mesa
  const [pessoas] = await db.execute(
    'SELECT id, mesa_id, nome, email, telefone FROM pessoas WHERE event_id = ?',
    [evento.id],
  );
  for (const p of pessoas) {
    const pessoa = new Pessoa(p.id, p.nome, p.email, p.telefone);
    const mesa = evento.mesas.find((m) => m.id === p.mesa_id);
    if (mesa) {
      mesa.addPessoa(pessoa);
    } else {
      evento.semMesa.push(pessoa); // mesa_id NULL = ainda sem mesa
    }
  }

  return evento;
}

// Edita só os campos enviados. Os nomes de coluna vêm desta lista fixa (protege contra SQL injection)
export async function atualizarEvento(code, campos) {
  const colunas = {
    nome: 'name',
    data: 'date',
    horario: 'time',
    local: 'location',
  };

  const chaves = Object.keys(campos).filter((c) => colunas[c] && campos[c] !== undefined);
  if (chaves.length === 0) return 0;

  const set = chaves.map((c) => `${colunas[c]} = ?`).join(', ');
  const valores = chaves.map((c) => campos[c]);

  const [resultado] = await db.execute(
    `UPDATE events SET ${set} WHERE code = ?`,
    [...valores, code],
  );
  return resultado.affectedRows; // 0 = não achou
}

export async function excluirEvento(code) {
  const [resultado] = await db.execute('DELETE FROM events WHERE code = ?', [code]);
  return resultado.affectedRows; // 1 = apagou, 0 = não existia
}

// Dono do evento: undefined = evento não existe | null = sem dono | número = id do dono
export async function buscarDono(code) {
  const [linhas] = await db.execute('SELECT usuario_id FROM events WHERE code = ?', [code]);
  if (linhas.length === 0) return undefined;
  return linhas[0].usuario_id;
}

// "Meus eventos": os eventos do usuário logado, do mais próximo para o mais distante
export async function listarEventosDoUsuario(usuarioId) {
  const [linhas] = await db.execute(
    `SELECT code, name AS nome, date AS data, time AS horario, location AS local
       FROM events
      WHERE usuario_id = ?
      ORDER BY date`,
    [usuarioId],
  );
  return linhas;
}