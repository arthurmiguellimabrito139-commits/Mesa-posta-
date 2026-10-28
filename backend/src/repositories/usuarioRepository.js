import { db } from '../config/db.js';
import Usuario from '../models/Usuario.js';

// Grava o usuário. Recebe a senha JÁ em hash.
export async function salvarUsuario(nome, email, senhaHash) {
  const [resultado] = await db.execute(
    'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
    [nome, email, senhaHash],
  );
  return new Usuario(resultado.insertId, nome, email);
}

// Procura pelo e-mail. Devolve null se não existir.
export async function buscarPorEmail(email) {
  const [linhas] = await db.execute(
    'SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ?',
    [email],
  );
  if (linhas.length === 0) return null;
  const u = linhas[0];
  return { usuario: new Usuario(u.id, u.nome, u.email), senhaHash: u.senha_hash };
}

export async function buscarPorId(id) {
  const [linhas] = await db.execute('SELECT id, nome, email FROM usuarios WHERE id = ?', [id]);
  if (linhas.length === 0) return null;
  const u = linhas[0];
  return new Usuario(u.id, u.nome, u.email);
}