// Lista de eventos/reservas guardados no navegador, sempre atualizada
import { useEffect, useState } from 'react';
import { EVENTO_MUDOU, meusEventos, minhasReservas } from '../services/storage.js';

export function useMeusEventos() {
  const [lista, setLista] = useState({ eventos: meusEventos(), reservas: minhasReservas() });

  useEffect(() => {
    const atualizar = () => setLista({ eventos: meusEventos(), reservas: minhasReservas() });
    window.addEventListener(EVENTO_MUDOU, atualizar);
    window.addEventListener('storage', atualizar); // outra aba mudou
    return () => {
      window.removeEventListener(EVENTO_MUDOU, atualizar);
      window.removeEventListener('storage', atualizar);
    };
  }, []);

  return lista;
}
