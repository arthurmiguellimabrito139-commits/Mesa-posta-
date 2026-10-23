import express from 'express';
import cors from 'cors';
// import eventRoutes from './routes/eventRoutes.js';

export const app = express();

app.use(cors());
app.use(express.json());


app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// app.use('/api/events', eventRoutes);