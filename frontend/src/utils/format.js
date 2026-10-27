// Datas chegam do back-end como "2026-12-05" (texto).
// new Date("2026-12-05") seria meia-noite em UTC e, no Brasil, viraria o dia 4!
// Por isso montamos a data no fuso local.
export function paraData(texto) {
  if (!texto) return null;
  const [ano, mes, dia] = String(texto).slice(0, 10).split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

// "5 dez"
export function dataCurta(texto) {
  const d = paraData(texto);
  if (!d) return '';
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '').replace(' de ', ' ');
}

// "sábado, 5 de dezembro"
export function dataLonga(texto) {
  const d = paraData(texto);
  if (!d) return '';
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
}

// "sábado"
export function diaDaSemana(texto) {
  const d = paraData(texto);
  return d ? d.toLocaleDateString('pt-BR', { weekday: 'long' }) : '';
}

// Quantos dias faltam (0 = hoje, negativo = já passou)
export function diasAte(texto) {
  const d = paraData(texto);
  if (!d) return null;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.round((d - hoje) / 86_400_000);
}

export function primeiroNome(nome = '') {
  return nome.trim().split(/\s+/)[0] || nome;
}

// "Casamento Ana e Pedro" -> ["Casamento Ana e", "Pedro"] (a última palavra vai em itálico)
export function separarUltimaPalavra(texto = '') {
  const partes = texto.trim().split(/\s+/);
  if (partes.length < 2) return ['', texto];
  return [partes.slice(0, -1).join(' '), partes.at(-1)];
}

export const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

// Número do comprovante: MP-A980F1 / 0007
export const numeroReserva = (code) => `MP-${code}`;
export const numeroPessoa = (id) => String(id).padStart(4, '0');
