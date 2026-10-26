import { Router } from 'express';
import { criarEvento, buscarEvento, editarEvento, apagarEvento} from '../controllers/eventoController.js';
import { adicionarMesa, removerMesa} from '../controllers/mesaController.js';
import { reservar, moverPessoa, cancelar, distribuir } from '../controllers/pessoaController.js';

// -------------- pessoas rotas ------------------
router.post('/:code/pessoas', reservar);
router.patch('/:code/pessoas/:pessoaId', moverPessoa);
router.delete('/:code/pessoas/:pessoaId', cancelar);
router.post('/:code/distribuir', distribuir);

const router = Router();

// ---------- eventos e mesas rotas --------------
router.post('/', criarEvento);
router.get('/:code', buscarEvento);
router.delete('/:code', apagarEvento);
router.post('/', editarEvento)
router.post('/:code/mesas', adicionarMesa);
router.delete('/:code/mesas/:mesaId', removerMesa);

export default router;
