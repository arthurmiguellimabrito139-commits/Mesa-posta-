import express from 'express';
import cors from 'cors';
import eventoRoutes from './routes/eventoRoutes.js';
import authRoutes from './routes/authRoutes.js';
export const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/eventos', eventoRoutes);