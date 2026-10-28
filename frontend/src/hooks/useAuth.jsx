// Contexto de login: qualquer componente sabe quem está logado com  const { usuario } = useAuth();
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as api from '../services/api.js';
import { SESSAO_MUDOU, lerSessao, limparSessao, salvarSessao } from '../services/sessao.js';

const ContextoAuth = createContext(null);

export function ProvedorAuth({ children }) {
  const [usuario, setUsuario] = useState(() => lerSessao()?.usuario || null);
  const [conferindo, setConferindo] = useState(() => Boolean(lerSessao()));

  // a sessão pode mudar por fora (401 na API, outra aba): acompanha
  useEffect(() => {
    const atualizar = () => setUsuario(lerSessao()?.usuario || null);
    window.addEventListener(SESSAO_MUDOU, atualizar);
    window.addEventListener('storage', atualizar);
    return () => {
      window.removeEventListener(SESSAO_MUDOU, atualizar);
      window.removeEventListener('storage', atualizar);
    };
  }, []);

  // ao abrir o app, confere se o token guardado ainda vale
  useEffect(() => {
    if (!lerSessao()) return;
    api.quemSouEu()
      .then((u) => salvarSessao({ token: lerSessao().token, usuario: u }))
      .catch(() => {}) // se deu 401, o api.js já limpou a sessão
      .finally(() => setConferindo(false));
  }, []);

  const entrar = useCallback(async (email, senha) => {
    const sessao = await api.entrar({ email, senha });
    salvarSessao(sessao);
    return sessao.usuario;
  }, []);

  const cadastrar = useCallback(async (nome, email, senha) => {
    const sessao = await api.cadastrar({ nome, email, senha });
    salvarSessao(sessao);
    return sessao.usuario;
  }, []);

  const sair = useCallback(() => limparSessao(), []);

  return (
    <ContextoAuth.Provider value={{ usuario, conferindo, entrar, cadastrar, sair }}>
      {children}
    </ContextoAuth.Provider>
  );
}

export const useAuth = () => useContext(ContextoAuth);
