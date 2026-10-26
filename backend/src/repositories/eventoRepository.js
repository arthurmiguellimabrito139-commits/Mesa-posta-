import { db } from '../config/db.js';
import crypto from 'node:crypto';
import Evento from '../models/Evento.js';
import Mesa from '../models/Mesa.js';
import Pessoa from '../models/Pessoa.js';


export async function salvarEvento(evento) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const code = crypto.randomBytes(3).toString('hex').toUpperCase(); // ex: "A3F9C1"
    const adminToken = crypto.randomBytes(24).toString('hex');

    const [resultado] = await conn.execute(
      `INSERT INTO events (code, admin_token, name, date, time, location)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [code, adminToken, evento.nome, evento.data, evento.horario || null, evento.local ?? null],
    );

    const eventoId = resultado.insertId;

    for (const mesa of evento.mesas) {
      await conn.execute(
        `INSERT INTO event_tables (event_id, number, seats) VALUES (?, ?, ?)`,
        [eventoId, mesa.number, mesa.seats],
      );
    }

    await conn.commit();

    // 4. objeto e banco passam a ter o mesmo id
    evento.id = eventoId;
    evento.mesas.forEach((mesa) => { mesa.eventId = eventoId; });

    return { code, adminToken };
  } catch (erro) {
    await conn.rollback();
    throw erro;
  } finally {
    conn.release();
  }
}

export async function carregarEvento(code) {
  // 1. o evento
  const [eventos] = await db.execute(
    'SELECT id, code, name, date, time, location FROM events WHERE code = ?',
    [code],
  );
  if (eventos.length === 0) return null;   // não achou

  const e = eventos[0];
  const evento = new Evento(e.id, e.name, e.date, e.time, e.location);
  evento.code = e.code;

  // 2. as mesas do evento
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
      evento.semMesa.push(pessoa);   // mesa_id NULL = ainda sem mesa
    }
  }

  return evento;
}

export async function atualizarEvento(code, campos) {
  // "tradutor": nome na classe/front → coluna no banco
  // Só o que está aqui pode ser editado (code e admin_token ficam de fora)
  const colunas = {
    nome: 'name',
    data: 'date',
    horario: 'time',
    local: 'location',
  };

  // pega só os campos que vieram E que podem ser editados
  const chaves = Object.keys(campos).filter((c) => colunas[c] && campos[c] !== undefined);
  if (chaves.length === 0) return 0;

  // monta "name = ?, location = ?" com as chaves que vieram
  const set = chaves.map((c) => `${colunas[c]} = ?`).join(', ');
  const valores = chaves.map((c) => campos[c]);

  const [resultado] = await db.execute(
    `UPDATE events SET ${set} WHERE code = ?`,
    [...valores, code],
  );
  return resultado.affectedRows; // quantas linhas foram alteradas (0 = não achou)
}

export async function excluirEvento(code) {
  const [resultado] = await db.execute('DELETE FROM events WHERE code = ?', [code]);
  return resultado.affectedRows; // 1 = apagou, 0 = não existia
}

