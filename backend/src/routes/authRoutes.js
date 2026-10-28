import { Router } from 'express';
import { cadastrar } from '../controllers/authController.js';

const router = Router();

router.post('/cadastro', cadastrar);

export default router;