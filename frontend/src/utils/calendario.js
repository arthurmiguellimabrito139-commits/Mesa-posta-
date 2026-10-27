// Gera um arquivo .ics ("Adicionar ao calendário") e baixa no navegador.
// Funciona no Google Agenda, Outlook e no calendário do celular.
import { paraData } from './format.js';

const doisDigitos = (n) => String(n).padStart(2, '0');

function formatoIcs(data) {
  return `${data.getFullYear()}${doisDigitos(data.getMonth() + 1)}${doisDigitos(data.getDate())}T${doisDigitos(data.getHours())}${doisDigitos(data.getMinutes())}00`;
}

export function baixarConvite({ titulo, data, horario = '20:00', local = '', descricao = '' }) {
  const inicio = paraData(data);
  const [h, m] = horario.split(':').map(Number);
  inicio.setHours(h || 20, m || 0);
  const fim = new Date(inicio.getTime() + 5 * 60 * 60 * 1000); // 5 horas de festa

  const limpar = (t) => String(t).replace(/[,;\\]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mesa Posta//PT-BR',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@mesa-posta`,
    `DTSTAMP:${formatoIcs(new Date())}`,
    `DTSTART:${formatoIcs(inicio)}`,
    `DTEND:${formatoIcs(fim)}`,
    `SUMMARY:${limpar(titulo)}`,
    `LOCATION:${limpar(local)}`,
    `DESCRIPTION:${limpar(descricao)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mesa-posta.ics';
  link.click();
  URL.revokeObjectURL(url);
}
