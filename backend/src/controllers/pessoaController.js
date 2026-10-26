import Pessoa from '../models/Pessoa.js';
import { db } from '../config/db.js';
import { carregarEvento } from '../repositories/eventoRepository.js';
import { salvarPessoa, atualizarMesa, excluirPessoa } from '../repositories/pessoaRepository.js';

// ───── auxiliares ─────

// Procura a pessoa no evento: em alguma mesa ou no "sem mesa"
function acharPessoa(evento, pessoaId) {
  for (const mesa of evento.mesas) {
    const pessoa = mesa.pessoas.find((p) => p.id === pessoaId);
    if (pessoa) return { pessoa, mesaAtual: mesa };
  }
  const pessoa = evento.semMesa.find((p) => p.id === pessoaId);
  return pessoa ? { pessoa, mesaAtual: null } : null;
}

async function eventoDaUrl(req, res) {
  const evento = await carregarEvento(req.params.code.toUpperCase());
  if (!evento) res.status(404).json({ erro: 'Evento não encontrado.' });
  return evento;
}

// ───── POST /api/eventos/:code/pessoas ─────
export async function reservar(req, res) {
  try {
    const { nome, email, telefone, mesaId } = req.body;
    if (!nome?.trim()) {
      return res.status(400).json({ erro: 'Informe o nome.' });
    }

    const evento = await eventoDaUrl(req, res);
    if (!evento) return;

    const pessoa = new Pessoa(null, nome.trim(), email, telefone);

    if (mesaId) {
      const mesa = evento.mesas.find((m) => m.id === Number(mesaId));
      if (!mesa) {
        return res.status(404).json({ erro: 'Mesa não encontrada neste evento.' });
      }
      try {
        mesa.addPessoa(pessoa); // regra de lotação da classe Mesa
      } catch (erroDaMesa) {
        return res.status(409).json({ erro: erroDaMesa.message });
      }
    }

    await salvarPessoa(pessoa, evento.id, mesaId ? Number(mesaId) : null);
    res.status(201).json(pessoa);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

// ───── PATCH /api/eventos/:code/pessoas/:pessoaId  body: { mesaId } ─────
// mesaId = número → muda para essa mesa | mesaId = null → tira da mesa
export async function moverPessoa(req, res) {
  try {
    const evento = await eventoDaUrl(req, res);
    if (!evento) return;

    const encontrada = acharPessoa(evento, Number(req.params.pessoaId));
    if (!encontrada) {
      return res.status(404).json({ erro: 'Pessoa não encontrada neste evento.' });
    }
    const { pessoa, mesaAtual } = encontrada;

    const novaMesaId = req.body.mesaId ? Number(req.body.mesaId) : null;

    if (novaMesaId) {
      if (mesaAtual?.id === novaMesaId) {
        return res.json(await carregarEvento(evento.code)); // já está nessa mesa
      }
      const destino = evento.mesas.find((m) => m.id === novaMesaId);
      if (!destino) {
        return res.status(404).json({ erro: 'Mesa não encontrada neste evento.' });
      }
      try {
        destino.addPessoa(pessoa); // confere se cabe
      } catch (erroDaMesa) {
        return res.status(409).json({ erro: erroDaMesa.message });
      }
    }

    await atualizarMesa(pessoa.id, evento.id, novaMesaId);
    res.json(await carregarEvento(evento.code));
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

// ───── DELETE /api/eventos/:code/pessoas/:pessoaId ─────
export async function cancelar(req, res) {
  try {
    const evento = await eventoDaUrl(req, res);
    if (!evento) return;

    const apagadas = await excluirPessoa(Number(req.params.pessoaId), evento.id);
    if (apagadas === 0) {
      return res.status(404).json({ erro: 'Pessoa não encontrada neste evento.' });
    }
    res.json(await carregarEvento(evento.code));
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

// ───── POST /api/eventos/:code/distribuir ─────
// Coloca quem está "sem mesa" nas mesas com mais lugares livres
export async function distribuir(req, res) {
  const conn = await db.getConnection();
  try {
    const evento = await eventoDaUrl(req, res);
    if (!evento) return;

    await conn.beginTransaction();

    let colocadas = 0;
    const naoCouberam = [];

    for (const pessoa of evento.semMesa) {
      // a mesa com MAIS lugares livres (espalha as pessoas)
      const mesa = evento.mesas
        .filter((m) => m.lugaresDisponiveis() > 0)
        .sort((a, b) => b.lugaresDisponiveis() - a.lugaresDisponiveis())[0];

      if (!mesa) {
        naoCouberam.push(pessoa.nome);
        continue;
      }

      mesa.addPessoa(pessoa);
      await atualizarMesa(pessoa.id, evento.id, mesa.id, conn);
      colocadas++;
    }

    await conn.commit();
    res.json({ colocadas, naoCouberam, evento: await carregarEvento(evento.code) });
  } catch (erro) {
    await conn.rollback();
    res.status(500).json({ erro: erro.message });
  } finally {
    conn.release();
  }
}