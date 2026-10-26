import { app } from './app.js';
import { db } from './config/db.js';

const PORT = process.env.PORT || 3333;

try {

  await db.query('SELECT 1');
  console.log('✅ MySQL conectado');

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
} catch (err) {
  console.error('❌ Não consegui conectar no banco. Confira o .env');
  console.error(err.message);
  process.exit(1);
}