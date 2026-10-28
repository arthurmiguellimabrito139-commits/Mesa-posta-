import { app } from './app.js';
import { db } from './config/db.js';

const PORT = process.env.PORT || 3333;


 try {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET ausente ou curto demais no .env (use pelo menos 32 caracteres).');
  }

  await db.query('SELECT 1');
  console.log('✅ MySQL conectado');

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
} catch (err) {
  console.error('❌ Não consegui iniciar o servidor:');
  console.error(err.message);
  process.exit(1);
}