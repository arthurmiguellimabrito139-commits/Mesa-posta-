// Todas as chamadas ao back-end ficam aqui.
// As rotas são as do seu eventoRoutes.js.
import { tokenDoEvento } from './storage.js';

// Em desenvolvimento o Vite repassa "/api" para http://localhost:3333 (vite.config.js).
// Em produção, defina VITE_API_URL no .env do front.
const BASE = import.meta.env.VITE_API_URL || '/api';

async function chamar(metodo, caminho, { corpo, code } = {}) {
  const headers = {};
  if (corpo) headers['Content-Type'] = 'application/json';

  // Rotas de organizador precisam do token no header (middleware somenteOrganizador)
  const token = code && tokenDoEvento(code);
  if (token) headers['x-admin-token'] = token;

  let resposta;
  try {
    resposta = await fetch(BASE + caminho, {
      method: metodo,
      headers,
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new Error('Não consegui falar com o servidor. O back-end está rodando?');
  }

  if (resposta.status === 204) return null; // DELETE do evento não devolve nada

  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    const erro = new Error(dados?.erro || `Erro ${resposta.status}`);
    erro.status = resposta.status;
    throw erro;
  }
  return dados;
}

// ---------- evento ----------
// devolve { id, code, adminToken }
export const criarEvento = (dados) => chamar('POST', '/eventos', { corpo: dados });

// devolve o Evento com mesas (cada uma com pessoas) e semMesa
export const buscarEvento = (code) => chamar('GET', `/eventos/${code}`);

export const editarEvento = (code, campos) => chamar('PATCH', `/eventos/${code}`, { corpo: campos, code });

export const excluirEvento = (code) => chamar('DELETE', `/eventos/${code}`, { code });

// ---------- mesas (organizador) ----------
export const adicionarMesa = (code, cadeiras) =>
  chamar('POST', `/eventos/${code}/mesas`, { corpo: { cadeiras }, code });

export const removerMesa = (code, mesaId) =>
  chamar('DELETE', `/eventos/${code}/mesas/${mesaId}`, { code });

// ---------- pessoas ----------
// mesaId opcional: sem ele, a pessoa fica "sem mesa"
export const reservar = (code, { nome, email, telefone, mesaId }) =>
  chamar('POST', `/eventos/${code}/pessoas`, { corpo: { nome, email, telefone, mesaId }, code });

// mesaId null = tira da mesa
export const moverPessoa = (code, pessoaId, mesaId) =>
  chamar('PATCH', `/eventos/${code}/pessoas/${pessoaId}`, { corpo: { mesaId }, code });

export const cancelarPessoa = (code, pessoaId) =>
  chamar('DELETE', `/eventos/${code}/pessoas/${pessoaId}`, { code });

// devolve { colocadas, naoCouberam, evento }
export const distribuir = (code) => chamar('POST', `/eventos/${code}/distribuir`, { code });
