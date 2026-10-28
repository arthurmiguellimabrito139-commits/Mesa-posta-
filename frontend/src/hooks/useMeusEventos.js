// Listas da sidebar: eventos do usuário logado (da API) e reservas feitas neste navegador
import { useCallback, useEffect, useState } from 'react';
import { meusEventos } from '../services/api.js';
import { EVENTO_MUDOU, minhasReservas } from '../services/storage.js';
import { useAuth } from './useAuth.jsx';

export function useMeusEventos() {
  const { usuario } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [reservas, setReservas] = useState(minhasReservas());

  const carregar = useCallback(async () => {
    setReservas(minhasReservas());
    if (!usuario) return setEventos([]);
    try {
      setEventos(await meusEventos());
    } catch {
      setEventos([]);
    }
  }, [usuario]);

  useEffect(() => {
    carregar();
    window.addEventListener(EVENTO_MUDOU, carregar);
    return () => window.removeEventListener(EVENTO_MUDOU, carregar);
  }, [carregar]);

  return { eventos, reservas };
}
