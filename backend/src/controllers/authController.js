import bcrypt from 'bcryptjs';
import { salvarUsuario, buscarPorEmail, buscarPorId } from '../repositories/usuarioRepository.js';
import jwt from 'jsonwebtoken';
import { erroInterno } from '../utils/erros.js';
function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '3d' },
  );
}

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
    res.status(201).json({ token: gerarToken(usuario), usuario });
  } catch (erro) {
    erroInterno(res, erro);
  }
}

export async function login(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase() || '';
    const senha = req.body.senha || '';

    const encontrado = await buscarPorEmail(email);
    const senhaCerta = encontrado && (await bcrypt.compare(senha, encontrado.senhaHash));

    if (!senhaCerta) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    res.json({ token: gerarToken(encontrado.usuario), usuario: encontrado.usuario });
  } catch (erro) {
    erroInterno(res, erro);
  }
}

export async function eu(req, res) {
  try {
    const usuario = await buscarPorId(req.usuario.id);
    if (!usuario) {
      return res.status(401).json({ erro: 'Conta não encontrada.' });
    }
    res.json(usuario);
  } catch (erro) {
    erroInterno(res, erro);
  }
}