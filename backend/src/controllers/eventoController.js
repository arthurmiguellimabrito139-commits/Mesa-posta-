import Evento from '../models/Evento.js';
import { salvarEvento, carregarEvento, atualizarEvento, excluirEvento} from '../repositories/eventoRepository.js';

export async function criarEvento(req, res) {
  try {
    const { nome, data, horario, local, quantidadeMesas, cadeirasPorMesa } = req.body;

    if (!nome || !data) {
      return res.status(400).json({ erro: 'Nome e data são obrigatórios.' });
    }

    const evento = new Evento(null, nome, data, horario, local);
    evento.criarMesas(Number(quantidadeMesas), Number(cadeirasPorMesa));

    const { code, adminToken } = await salvarEvento(evento);

    res.status(201).json({ id: evento.id, code, adminToken });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

export async function buscarEvento(req, res) {
  try {
    const evento = await carregarEvento(req.params.code.toUpperCase());
    if (!evento) {
      return res.status(404).json({ erro: 'Evento não encontrado.' });
    }
    res.json(evento);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

export async function editarEvento(req, res) {
  try {
    const code = req.params.code.toUpperCase();
    const { nome, data, horario, local } = req.body;

    if (nome !== undefined && !nome.trim()) {
      return res.status(400).json({ erro: 'O nome não pode ficar vazio.' });
    }

    const alteradas = await atualizarEvento(code, { nome, data, horario, local });
    if (alteradas === 0) {
      return res.status(404).json({ erro: 'Evento não encontrado ou nada para alterar.' });
    }

    // devolve o evento atualizado, igual ao GET
    res.json(await carregarEvento(code));
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

export async function apagarEvento(req, res) {
  try {
    const apagadas = await excluirEvento(req.params.code.toUpperCase());
    if (apagadas === 0) {
      return res.status(404).json({ erro: 'Evento não encontrado.' });
    }
    res.status(204).end();
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}
