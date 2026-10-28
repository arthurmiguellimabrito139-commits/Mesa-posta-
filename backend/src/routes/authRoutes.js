import { Router } from 'express';
import { cadastrar, login, eu } from '../controllers/authController.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = Router();

router.post('/cadastro', cadastrar);
router.post('/login', login);
router.get('/eu', autenticar, eu);
export default router;
