// Os cards numerados de baixo do template (Arrival 01, Wifi 02, Breakfast 03)
import styled from 'styled-components';

const Caixa = styled.article`
  background: ${({ theme }) => theme.cores.n50};
  border: 1px solid ${({ theme }) => theme.cores.n400};
  border-radius: ${({ theme }) => theme.raio};
  padding: 1.25rem 1.25rem 1.5rem;
  box-shadow: ${({ theme }) => theme.sombra};
  display: grid;
  gap: 0.35rem;
  align-content: start;
  min-width: 0;
`;

const Topo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.4rem;

  .icone {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.6rem;
    display: grid;
    place-items: center;
    color: ${({ theme }) => theme.cores.n0};
    background: ${({ $cor }) => $cor};
    flex-shrink: 0;
  }
  .rotulo {
    font: 500 0.8125rem/1 ${({ theme }) => theme.fontes.mono};
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${({ $cor }) => $cor};
  }
  .numero {
    margin-left: auto;
    font: italic 400 1.6rem/1 ${({ theme }) => theme.fontes.titulo};
    color: ${({ $cor }) => $cor};
  }
`;

const Titulo = styled.h3`
  font-size: 1.55rem;
  line-height: 1.2;
  overflow-wrap: anywhere;
`;

const Sub = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.cores.n600};
  &::first-letter { text-transform: uppercase; }
`;

const Corpo = styled.div`
  margin-top: 0.85rem;
  color: ${({ theme }) => theme.cores.n800};
  display: grid;
  gap: 0.5rem;
`;

// Linha cinza "NETWORK ............ Le Soleil · Guest"
export const LinhaDado = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  background: ${({ theme }) => theme.cores.n200};
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;

  span:first-child {
    font: 500 0.6875rem/1 ${({ theme }) => theme.fontes.mono};
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.cores.n600};
  }
  & > span:last-child, & > div:last-child { display: flex; align-items: center; gap: 0.5rem; text-align: right; }
`;

// Barra de progresso fininha (lugares ocupados)
export const Barra = styled.div`
  height: 0.4rem;
  border-radius: 99px;
  background: ${({ theme }) => theme.cores.n200};
  overflow: hidden;

  i {
    display: block;
    height: 100%;
    width: ${({ $porcento }) => $porcento}%;
    background: ${({ $cor }) => $cor};
    border-radius: inherit;
    transition: width 0.3s;
  }
`;

export function CartaoInfo({ icone, rotulo, numero, cor, titulo, sub, children }) {
  return (
    <Caixa>
      <Topo $cor={cor}>
        <span className="icone">{icone}</span>
        <span className="rotulo">{rotulo}</span>
        <span className="numero">{numero}</span>
      </Topo>
      <Titulo>{titulo}</Titulo>
      {sub && <Sub>{sub}</Sub>}
      {children && <Corpo>{children}</Corpo>}
    </Caixa>
  );
}

export const LinhaDeCartoes = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;
