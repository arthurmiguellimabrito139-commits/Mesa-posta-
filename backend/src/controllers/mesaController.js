import { carregarEvento } from '../repositories/eventoRepository.js';
import { salvarMesa, excluirMesa} from '../repositories/mesaRepository.js';

export async function adicionarMesa(req, res) {
  try {
    const cadeiras = Number(req.body.cadeiras);
    if (!Number.isInteger(cadeiras) || cadeiras < 2 || cadeiras > 16) {
      return res.status(400).json({ erro: 'A mesa deve ter de 2 a 16 cadeiras.' });
    }

    const evento = await carregarEvento(req.params.code.toUpperCase());
    if (!evento) {
      return res.status(404).json({ erro: 'Evento não encontrado.' });
    }

    evento.criarMesas(1, cadeiras);               
    const novaMesa = evento.mesas.at(-1);         
    await salvarMesa(novaMesa);

    res.status(201).json(novaMesa);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

 export async function removerMesa(req, res) {
  try {
    const code = req.params.code.toUpperCase();
    const apagadas = await excluirMesa(code, req.params.mesaId);

    if (apagadas === 0) {
      return res.status(404).json({ erro: 'Mesa não encontrada neste evento.' });
    }

    // devolve o evento atualizado: as pessoas da mesa agora aparecem em "semMesa"
    res.json(await carregarEvento(code));
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}