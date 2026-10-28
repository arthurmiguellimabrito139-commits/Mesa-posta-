// Guarda no navegador as reservas que você fez como convidado
// (convidado não tem conta, então é assim que o app lembra do seu comprovante).

const CHAVE_RESERVAS = 'mesa-posta:reservas';
export const EVENTO_MUDOU = 'mesa-posta:mudou'; // avisa a sidebar para recarregar as listas

function ler(chave) {
  try {
    return JSON.parse(localStorage.getItem(chave)) || [];
  } catch {
    return [];
  }
}

export const avisarMudanca = () => window.dispatchEvent(new Event(EVENTO_MUDOU));

export const minhasReservas = () => ler(CHAVE_RESERVAS);

export function guardarReserva({ code, pessoaId, nome, evento, data }) {
  const lista = minhasReservas().filter((r) => !(r.code === code && r.pessoaId === pessoaId));
  try {
    localStorage.setItem(CHAVE_RESERVAS, JSON.stringify([...lista, { code, pessoaId, nome, evento, data }]));
  } catch { /* sem armazenamento */ }
  avisarMudanca();
}
