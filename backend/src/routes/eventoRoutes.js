import { Router } from 'express';
import { criarEvento, buscarEvento, editarEvento, apagarEvento } from '../controllers/eventoController.js';
import { adicionarMesa, removerMesa } from '../controllers/mesaController.js';
import { reservar, moverPessoa, cancelar, distribuir } from '../controllers/pessoaController.js';
import { somenteOrganizador } from '../middlewares/somenteOrganizador.js';

const router = Router();

// ---------- públicas: qualquer um com o link ----------
router.post('/', criarEvento);
router.get('/:code', buscarEvento);
router.post('/:code/pessoas', reservar);

// ---------- só o organizador ----------
router.patch('/:code', somenteOrganizador, editarEvento);
router.delete('/:code', somenteOrganizador, apagarEvento);
router.post('/:code/mesas', somenteOrganizador, adicionarMesa);
router.delete('/:code/mesas/:mesaId', somenteOrganizador, removerMesa);
router.patch('/:code/pessoas/:pessoaId', somenteOrganizador, moverPessoa);
router.delete('/:code/pessoas/:pessoaId', somenteOrganizador, cancelar);
router.post('/:code/distribuir', somenteOrganizador, distribuir);

export default router;