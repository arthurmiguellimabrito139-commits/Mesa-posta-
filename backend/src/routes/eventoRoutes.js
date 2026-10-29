import { Router } from 'express';
import { criarEvento, buscarEvento, editarEvento, apagarEvento, meusEventos } from '../controllers/eventoController.js';
import { adicionarMesa, removerMesa } from '../controllers/mesaController.js';
import { reservar, moverPessoa, cancelar, distribuir } from '../controllers/pessoaController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { somenteOrganizador } from '../middlewares/somenteOrganizador.js';
import { autenticar, autenticarOpcional } from '../middlewares/autenticar.js';

const router = Router();

// dois porteiros em sequência: 1º está logado? 2º é o dono deste evento?
const organizador = [autenticar, somenteOrganizador];

// ---------- públicas: convidados, sem login ----------
router.get('/:code', buscarEvento);
router.post('/:code/pessoas', reservar);

// ---------- precisa estar logado ----------
router.get('/', autenticar, meusEventos);
router.post('/', autenticar, criarEvento);
router.get('/:code', autenticarOpcional, buscarEvento);

// ---------- precisa ser o dono do evento ----------
router.patch('/:code', organizador, editarEvento);
router.delete('/:code', organizador, apagarEvento);
router.post('/:code/mesas', organizador, adicionarMesa);
router.delete('/:code/mesas/:mesaId', organizador, removerMesa);
router.patch('/:code/pessoas/:pessoaId', organizador, moverPessoa);
router.delete('/:code/pessoas/:pessoaId', organizador, cancelar);
router.post('/:code/distribuir', organizador, distribuir);

export default router;