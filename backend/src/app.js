import express from 'express';
import cors from 'cors';
import eventoRoutes from './routes/eventoRoutes.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/eventos', eventoRoutes);