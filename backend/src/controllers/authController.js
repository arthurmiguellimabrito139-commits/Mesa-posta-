import bcrypt from 'bcryptjs';
import { salvarUsuario, buscarPorEmail } from '../repositories/usuarioRepository.js';

// confere o formato: algo@algo.algo, sem espaços
const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// POST /api/auth/cadastro  { nome, email, senha }
export async function cadastrar(req, res) {
  try {
    const nome = req.body.nome?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const senha = req.body.senha || '';

    // 1. validar
    if (!nome) {
      return res.status(400).json({ erro: 'Informe o seu nome.' });
    }
    if (!emailValido(email || '')) {
      return res.status(400).json({ erro: 'E-mail inválido.' });
    }
    if (senha.length < 6) {
      return res.status(400).json({ erro: 'A senha precisa ter pelo menos 6 caracteres.' });
    }

    // 2. e-mail já usado?
    if (await buscarPorEmail(email)) {
      return res.status(409).json({ erro: 'Já existe uma conta com esse e-mail.' });
    }

    // 3. senha → hash (nunca salvar a senha pura)
    const senhaHash = await bcrypt.hash(senha, 10);

    // 4. salvar e responder
    const usuario = await salvarUsuario(nome, email, senhaHash);
    res.status(201).json({ usuario });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}