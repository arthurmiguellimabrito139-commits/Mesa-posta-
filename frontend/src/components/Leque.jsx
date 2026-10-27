// Os dois cartões sobrepostos do template: o recibo e o cartão terracota.
// Ao passar o mouse, eles se abrem em leque ("Hover to fan").
import styled from 'styled-components';
import { Brilho, CodigoDeBarras, IconeSolBranco } from './Icones.jsx';
import { Eyebrow } from './ui.js';

const Palco = styled.div`
  display: grid;
  justify-items: center;
  gap: 1.5rem;
  padding: 1.5rem 0 0.5rem;
`;

const Par = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 25rem));
  justify-content: center;
  width: 100%;

  & > * { transition: transform 0.45s cubic-bezier(.2, .8, .2, 1); }
  /* o cartão terracota fica por cima e cobre só a borda do recibo, como no template */
  & > *:first-child { transform: rotate(-4deg) translateX(0.6rem); }
  & > *:last-child { transform: rotate(4deg) translateX(-0.6rem); z-index: 1; }

  &:hover > *:first-child { transform: rotate(-7deg) translate(-1.5rem, 0.5rem); }
  &:hover > *:last-child { transform: rotate(7deg) translate(1.5rem, 0.5rem); }

  /* no celular: um embaixo do outro, cartão terracota primeiro (como no mobile-design) */
  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 26rem);
    gap: 1rem;
    & > *:first-child { order: 2; transform: rotate(-1.5deg); }
    & > *:last-child { order: 1; transform: rotate(1.5deg); }
    &:hover > *:first-child { transform: rotate(-1.5deg); }
    &:hover > *:last-child { transform: rotate(1.5deg); }
  }

  @media print {
    & > * { transform: none !important; }
  }
`;

const Dica = styled.p`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font: 500 0.625rem/1 ${({ theme }) => theme.fontes.mono};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.n600};

  @media (max-width: 760px) { display: none; }
`;

export function Leque({ children }) {
  return (
    <Palco>
      <Par>{children}</Par>
      <Dica className="nao-imprimir"><Brilho /> Passe o mouse para abrir <Brilho /></Dica>
    </Palco>
  );
}

// ---------- o recibo ----------
const Papel = styled.article`
  align-self: center;
  background-color: ${({ theme }) => theme.cores.n50};
  background-image: repeating-linear-gradient(transparent 0 23px, hsla(33, 20%, 50%, 0.05) 23px 24px);
  color: ${({ theme }) => theme.cores.n900};
  border-radius: 1rem;
  padding: 1.6rem 1.5rem 1.4rem;
  box-shadow: 0 24px 44px -20px hsla(25, 40%, 20%, 0.45);
  min-width: 0;

  /* no desktop a borda direita fica embaixo do cartão terracota: deixa ela livre */
  @media (min-width: 761px) {
    padding-right: 3rem;
  }
`;

const TopoRecibo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px dashed ${({ theme }) => theme.cores.n400};

  h3 { font-size: 1.45rem; margin-top: 0.35rem; }
  .no {
    font: 400 0.6875rem/1.5 ${({ theme }) => theme.fontes.mono};
    text-align: right;
    color: ${({ theme }) => theme.cores.n600};
    white-space: pre-line;
  }
`;

const Colunas = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px dashed ${({ theme }) => theme.cores.n400};
  text-align: center;

  strong { display: block; font: 400 2rem/1.15 ${({ theme }) => theme.fontes.titulo}; margin: 0.3rem 0 0.15rem; }
  small { font-size: 0.75rem; color: ${({ theme }) => theme.cores.n700}; }
  small::first-letter { text-transform: uppercase; }
`;

const Linhas = styled.div`
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.cores.n700};

  div { display: flex; justify-content: space-between; gap: 1rem; }
  span:last-child {
    font: 400 0.8rem ${({ theme }) => theme.fontes.mono};
    text-align: right;
    overflow-wrap: anywhere;
  }
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  padding-top: 0.9rem;
  strong { font: 400 1.7rem ${({ theme }) => theme.fontes.titulo}; }
`;

const PeRecibo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  margin-top: 1.1rem;
`;

/**
 * colunas: [{ rotulo, valor, detalhe }, { ... }]
 * linhas: [[texto, valor], ...]
 */
export function Recibo({ eyebrow, titulo, numero, colunas, linhas, total, rodape }) {
  return (
    <Papel>
      <TopoRecibo>
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h3>{titulo}</h3>
        </div>
        <span className="no">{numero}</span>
      </TopoRecibo>

      <Colunas>
        {colunas.map((c) => (
          <div key={c.rotulo}>
            <Eyebrow>{c.rotulo}</Eyebrow>
            <strong>{c.valor}</strong>
            <small>{c.detalhe}</small>
          </div>
        ))}
      </Colunas>

      <Linhas>
        {linhas.map(([texto, valor]) => (
          <div key={texto}><span>{texto}</span><span>{valor}</span></div>
        ))}
      </Linhas>

      <Total>
        <Eyebrow>{total.rotulo}</Eyebrow>
        <strong>{total.valor}</strong>
      </Total>

      <PeRecibo>
        <Eyebrow>{rodape}</Eyebrow>
        <CodigoDeBarras />
      </PeRecibo>
    </Papel>
  );
}

// ---------- o cartão terracota ----------
const Terracota = styled.article`
  position: relative;
  min-height: 25rem;
  display: flex;
  flex-direction: column;
  border-radius: 1.1rem;
  padding: 1.6rem 1.6rem 1.8rem;
  color: ${({ theme }) => theme.cores.n50};
  background: linear-gradient(160deg, ${({ theme }) => theme.cores.terracota400} 0%, ${({ theme }) => theme.cores.terracota600} 55%, ${({ theme }) => theme.cores.terracota700} 100%);
  box-shadow: 0 30px 50px -18px hsla(15, 70%, 30%, 0.55);
  min-width: 0;

  ${Eyebrow} {
    color: ${({ theme }) => theme.cores.sol50};
    border-top: 1px dashed hsla(40, 60%, 98%, 0.45);
    padding-top: 1rem;
  }

  .sol { position: absolute; top: 2.6rem; right: 1.4rem; }

  em {
    display: block;
    margin-top: 2.5rem;
    font: italic 400 1.2rem/1.3 ${({ theme }) => theme.fontes.titulo};
    color: ${({ theme }) => theme.cores.sol200};
  }
  h3 {
    font-size: clamp(2.2rem, 4vw, 2.75rem);
    font-style: italic;
    line-height: 1.1;
    margin-top: 0.35rem;
    overflow-wrap: anywhere;
  }
  p { margin-top: 1.25rem; line-height: 1.6; max-width: 30ch; }

  .pe { margin-top: auto; padding-top: 1.5rem; }
  .pe small {
    font: 500 0.625rem/1 ${({ theme }) => theme.fontes.mono};
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  .pe strong { display: block; font: 400 1.4rem ${({ theme }) => theme.fontes.titulo}; margin-top: 0.35rem; }
`;

export function CartaoTerracota({ eyebrow, chamada, titulo, texto, rotuloPe, valorPe }) {
  return (
    <Terracota>
      <Eyebrow>{eyebrow}</Eyebrow>
      <span className="sol"><IconeSolBranco /></span>
      <em>{chamada}</em>
      <h3>{titulo}</h3>
      {texto && <p>{texto}</p>}
      {valorPe && (
        <div className="pe">
          <small>{rotuloPe}</small>
          <strong>{valorPe}</strong>
        </div>
      )}
    </Terracota>
  );
}
