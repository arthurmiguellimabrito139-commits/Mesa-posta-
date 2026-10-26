import Evento from './backend/src/models/Evento.js';
import { salvarEvento } from './backend/src/repositories/eventoRepository.js';

const festa = new Evento(null, 'Casamento Ana e Pedro', '2026-12-05', '19:30', 'Sítio');
festa.criarMesas(5, 8);

const resultado = await salvarEvento(festa);
console.log('Salvo! id:', festa.id, resultado);
process.exit(0);