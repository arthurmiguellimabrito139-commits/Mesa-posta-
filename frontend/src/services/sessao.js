// Sessão do organizador logado: o JWT e os dados básicos do usuário, no navegador.
const CHAVE = 'mesa-posta:sessao';
export const SESSAO_MUDOU = 'mesa-posta:sessao-mudou';

export function lerSessao() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || null;
  } catch {
    return null;
  }
}

export function salvarSessao({ token, usuario }) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify({ token, usuario }));
  } catch { /* sem armazenamento: a sessão vale só até recarregar */ }
  window.dispatchEvent(new Event(SESSAO_MUDOU));
}

export function limparSessao() {
  try {
    localStorage.removeItem(CHAVE);
  } catch { /* nada a fazer */ }
  window.dispatchEvent(new Event(SESSAO_MUDOU));
}

export const tokenAtual = () => lerSessao()?.token || null;
