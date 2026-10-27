// Modal simples: fundo escuro + cartão no meio. Fecha no X, no Esc ou clicando fora.
import { useEffect } from 'react';
import styled from 'styled-components';
import { IconeFechar } from './Icones.jsx';
import { Eyebrow } from './ui.js';

const Fundo = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  background: hsla(33, 15%, 15%, 0.45);
  display: grid;
  place-items: center;
  padding: 1rem;
  overflow-y: auto;
`;

const Caixa = styled.div`
  width: min(32rem, 100%);
  background: ${({ theme }) => theme.cores.n50};
  border-radius: ${({ theme }) => theme.raio};
  padding: 1.5rem;
  box-shadow: 0 30px 60px -20px hsla(25, 40%, 15%, 0.5);
  display: grid;
  gap: 1.25rem;
`;

const Topo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;

  h2 { font-size: 1.6rem; margin-top: 0.3rem; }

  button {
    border: 1px solid ${({ theme }) => theme.cores.n400};
    background: none;
    border-radius: 0.4rem;
    width: 2.1rem;
    height: 2.1rem;
    display: grid;
    place-items: center;
    cursor: pointer;
  }
`;

export function Janela({ titulo, subtitulo, aoFechar, children }) {
  useEffect(() => {
    const tecla = (e) => e.key === 'Escape' && aoFechar();
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [aoFechar]);

  return (
    <Fundo onMouseDown={(e) => e.target === e.currentTarget && aoFechar()}>
      <Caixa role="dialog" aria-modal="true" aria-label={titulo}>
        <Topo>
          <div>
            {subtitulo && <Eyebrow>{subtitulo}</Eyebrow>}
            <h2>{titulo}</h2>
          </div>
          <button type="button" onClick={aoFechar} aria-label="Fechar"><IconeFechar /></button>
        </Topo>
        {children}
      </Caixa>
    </Fundo>
  );
}
