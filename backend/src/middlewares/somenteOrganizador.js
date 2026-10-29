import { buscarDono } from '../repositories/eventoRepository.js';
import { erroInterno } from '../utils/erros.js';

// Roda DEPOIS do autenticar: confere se o usuário logado é o dono do evento da URL
export async function somenteOrganizador(req, res, next) {
  try {
    const dono = await buscarDono(req.params.code.toUpperCase());

    if (dono === undefined) {
      return res.status(404).json({ erro: 'Evento não encontrado.' });
    }
    if (dono !== req.usuario.id) {
      return res.status(403).json({ erro: 'Só o organizador pode fazer isso.' });
    }

    next();
  } catch (erro) {
    erroInterno(res, erro);
  }
}