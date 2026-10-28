// Todas as chamadas ao back-end ficam aqui.
import { limparSessao, tokenAtual } from './sessao.js';

// Em desenvolvimento o Vite repassa "/api" para http://localhost:3333 (vite.config.js).
// Em produção, defina VITE_API_URL no .env do front.
const BASE = import.meta.env.VITE_API_URL || '/api';

async function chamar(metodo, caminho, corpo) {
  const headers = {};
  if (corpo) headers['Content-Type'] = 'application/json';

  // Se tem alguém logado, manda o JWT. O back-end decide se a rota precisa dele.
  const token = tokenAtual();
  if (token) headers.Authorization = `Bearer ${token}`;

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

  // 401 com token = sessão vencida ou inválida: desloga (o app manda para o login)
  if (resposta.status === 401 && token) limparSessao();

  if (resposta.status === 204) return null;

  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    const erro = new Error(dados?.erro || `Erro ${resposta.status}`);
    erro.status = resposta.status;
    throw erro;
  }
  return dados;
}

// ---------- conta ----------
// os dois devolvem { token, usuario }
export const cadastrar = (dados) => chamar('POST', '/auth/cadastro', dados);
export const entrar = (dados) => chamar('POST', '/auth/login', dados);
export const quemSouEu = () => chamar('GET', '/auth/eu');

// ---------- evento ----------
export const meusEventos = () => chamar('GET', '/eventos');               // logado
export const criarEvento = (dados) => chamar('POST', '/eventos', dados);  // logado -> { id, code }
export const buscarEvento = (code) => chamar('GET', `/eventos/${code}`);  // público
export const editarEvento = (code, campos) => chamar('PATCH', `/eventos/${code}`, campos);
export const excluirEvento = (code) => chamar('DELETE', `/eventos/${code}`);

// ---------- mesas (dono do evento) ----------
export const adicionarMesa = (code, cadeiras) => chamar('POST', `/eventos/${code}/mesas`, { cadeiras });
export const removerMesa = (code, mesaId) => chamar('DELETE', `/eventos/${code}/mesas/${mesaId}`);

// ---------- pessoas ----------
// reservar é público (convidado); sem mesaId a pessoa fica "sem mesa"
export const reservar = (code, { nome, email, telefone, mesaId }) =>
  chamar('POST', `/eventos/${code}/pessoas`, { nome, email, telefone, mesaId });

// mesaId null = tira da mesa
export const moverPessoa = (code, pessoaId, mesaId) => chamar('PATCH', `/eventos/${code}/pessoas/${pessoaId}`, { mesaId });
export const cancelarPessoa = (code, pessoaId) => chamar('DELETE', `/eventos/${code}/pessoas/${pessoaId}`);

// devolve { colocadas, naoCouberam, evento }
export const distribuir = (code) => chamar('POST', `/eventos/${code}/distribuir`);
