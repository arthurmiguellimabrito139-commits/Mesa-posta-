import crypto from 'node:crypto';
import { buscarToken } from '../repositories/eventoRepository.js';
import { erroInterno } from '../utils/erros.js';
export async function somenteOrganizador(req, res, next) {
  try {
    const tokenRecebido = req.get('x-admin-token') || '';
    const tokenCerto = await buscarToken(req.params.code.toUpperCase());

    if (!tokenCerto) {
      return res.status(404).json({ erro: 'Evento não encontrado.' });
    }

    if (!tokensIguais(tokenRecebido, tokenCerto)) {
      return res.status(403).json({ erro: 'Só o organizador pode fazer isso.' });
    }

    next(); // passou: segue para o controller
  } catch (erro) {
    erroInterno(res, erro);
  }
}

// Compara em tempo constante
function tokensIguais(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}