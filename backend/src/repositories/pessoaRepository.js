import { db } from '../config/db.js';

// Grava uma pessoa nova (mesaId null = "sem mesa")
export async function salvarPessoa(pessoa, eventoId, mesaId, conn = db) {
  const [resultado] = await conn.execute(
    `INSERT INTO pessoas (event_id, mesa_id, nome, email, telefone)
     VALUES (?, ?, ?, ?, ?)`,
    [eventoId, mesaId ?? null, pessoa.nome, pessoa.email ?? null, pessoa.telefone ?? null],
  );
  pessoa.id = resultado.insertId;
  return pessoa;
}

// Muda a pessoa de mesa (mesaId null = tira da mesa)
export async function atualizarMesa(pessoaId, eventoId, mesaId, conn = db) {
  const [resultado] = await conn.execute(
    'UPDATE pessoas SET mesa_id = ? WHERE id = ? AND event_id = ?',
    [mesaId ?? null, pessoaId, eventoId],
  );
  return resultado.affectedRows;
}

// Remove a pessoa do evento
export async function excluirPessoa(pessoaId, eventoId) {
  const [resultado] = await db.execute(
    'DELETE FROM pessoas WHERE id = ? AND event_id = ?',
    [pessoaId, eventoId],
  );
  return resultado.affectedRows;
}