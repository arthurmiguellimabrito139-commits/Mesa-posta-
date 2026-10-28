// Envolve as telas que precisam de login. Sem login, manda para /entrar
// e guarda para onde a pessoa queria ir (para voltar depois de entrar).
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Vazio } from './ui.js';

export function RotaProtegida({ children }) {
  const { usuario, conferindo } = useAuth();
  const local = useLocation();

  if (conferindo && !usuario) return <Vazio>Conferindo sua sessão…</Vazio>;
  if (!usuario) {
    return <Navigate to={`/entrar?voltar=${encodeURIComponent(local.pathname)}`} replace />;
  }
  return children;
}
