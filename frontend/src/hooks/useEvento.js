// Carrega um evento do back-end e expõe:
//  - evento, carregando, erro
//  - recarregar()
//  - executar(acao): roda uma chamada à API e, se ela devolver o evento
//    atualizado, troca o estado sozinho (moverPessoa, removerMesa, distribuir...)
import { useCallback, useEffect, useState } from 'react';
import { buscarEvento } from '../services/api.js';

export function useEvento(code) {
  const [evento, setEvento] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const recarregar = useCallback(async () => {
    try {
      const dados = await buscarEvento(code);
      setEvento(dados);
      setErro(null);
    } catch (e) {
      setErro(e);
    } finally {
      setCarregando(false);
    }
  }, [code]);

  useEffect(() => {
    setCarregando(true);
    recarregar();
  }, [recarregar]);

  const executar = useCallback(async (acao) => {
    const resultado = await acao();
    // algumas rotas devolvem o evento direto, o distribuir devolve { evento }
    const novo = resultado?.mesas ? resultado : resultado?.evento;
    if (novo?.mesas) setEvento(novo);
    else await recarregar();
    return resultado;
  }, [recarregar]);

  return { evento, carregando, erro, recarregar, executar };
}

// Conta lugares a partir do JSON do back-end (cada pessoa ocupa uma cadeira)
export function resumoDoEvento(evento) {
  if (!evento) return { mesas: 0, cadeiras: 0, ocupadas: 0, livres: 0, semMesa: 0, cheias: 0 };
  const cadeiras = evento.mesas.reduce((s, m) => s + m.seats, 0);
  const ocupadas = evento.mesas.reduce((s, m) => s + m.pessoas.length, 0);
  return {
    mesas: evento.mesas.length,
    cadeiras,
    ocupadas,
    livres: cadeiras - ocupadas,
    semMesa: evento.semMesa?.length || 0,
    cheias: evento.mesas.filter((m) => m.pessoas.length >= m.seats).length,
  };
}

export const livresNaMesa = (mesa) => mesa.seats - mesa.pessoas.length;
