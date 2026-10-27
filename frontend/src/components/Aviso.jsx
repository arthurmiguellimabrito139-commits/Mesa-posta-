// "Toast": mensagem rápida que aparece embaixo e some sozinha.
// Uso em qualquer componente:  const avisar = useAviso();  avisar('Salvo!');
import { createContext, useCallback, useContext, useRef, useState } from 'react';
import styled from 'styled-components';

const ContextoAviso = createContext(() => {});

const Caixa = styled.div`
  position: fixed;
  left: 50%;
  bottom: 1.25rem;
  transform: translateX(-50%);
  z-index: 50;
  max-width: calc(100vw - 2rem);
  padding: 0.65rem 1.1rem;
  border-radius: 99px;
  text-align: center;
  font-weight: 500;
  box-shadow: ${({ theme }) => theme.sombra};
  background: ${({ theme, $erro }) => ($erro ? theme.cores.rosa : theme.cores.n900)};
  color: ${({ theme }) => theme.cores.n50};
`;

export function ProvedorAviso({ children }) {
  const [aviso, setAviso] = useState(null);
  const timer = useRef();

  const avisar = useCallback((texto, { erro = false } = {}) => {
    clearTimeout(timer.current);
    setAviso({ texto, erro });
    timer.current = setTimeout(() => setAviso(null), 3200);
  }, []);

  return (
    <ContextoAviso.Provider value={avisar}>
      {children}
      {aviso && (
        <Caixa role="status" aria-live="polite" $erro={aviso.erro} className="nao-imprimir">
          {aviso.texto}
        </Caixa>
      )}
    </ContextoAviso.Provider>
  );
}

export const useAviso = () => useContext(ContextoAviso);
