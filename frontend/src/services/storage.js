// Guarda no navegador (localStorage):
//  - os eventos que você criou, com o adminToken (a "chave" do organizador)
//  - as reservas que você fez como convidado
// Como não existe login, é assim que o app lembra de você.

const CHAVE_EVENTOS = 'mesa-posta:eventos';
const CHAVE_RESERVAS = 'mesa-posta:reservas';
export const EVENTO_MUDOU = 'mesa-posta:mudou'; // avisa a sidebar para recarregar a lista

function ler(chave) {
  try {
    return JSON.parse(localStorage.getItem(chave)) || [];
  } catch {
    return []; // modo privado, armazenamento bloqueado...
  }
}

function gravar(chave, lista) {
  try {
    localStorage.setItem(chave, JSON.stringify(lista));
  } catch {
    /* sem armazenamento: o app continua funcionando, só não lembra depois */
  }
  window.dispatchEvent(new Event(EVENTO_MUDOU));
}

// ---------- eventos que eu organizo ----------
export const meusEventos = () => ler(CHAVE_EVENTOS);

export function guardarEvento({ code, adminToken, nome, data }) {
  const lista = meusEventos().filter((e) => e.code !== code);
  gravar(CHAVE_EVENTOS, [...lista, { code, adminToken, nome, data }]);
}

export function atualizarEventoGuardado(code, campos) {
  gravar(CHAVE_EVENTOS, meusEventos().map((e) => (e.code === code ? { ...e, ...campos } : e)));
}

export function esquecerEvento(code) {
  gravar(CHAVE_EVENTOS, meusEventos().filter((e) => e.code !== code));
}

export function tokenDoEvento(code) {
  return meusEventos().find((e) => e.code === code)?.adminToken || null;
}

// ---------- reservas que eu fiz como convidado ----------
export const minhasReservas = () => ler(CHAVE_RESERVAS);

export function guardarReserva({ code, pessoaId, nome, evento, data }) {
  const lista = minhasReservas().filter((r) => !(r.code === code && r.pessoaId === pessoaId));
  gravar(CHAVE_RESERVAS, [...lista, { code, pessoaId, nome, evento, data }]);
}
