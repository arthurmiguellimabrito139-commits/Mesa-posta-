// Peças pequenas reaproveitadas em todas as telas
import styled, { css } from 'styled-components';

// "BOOKING · CONFIRMED" do template: texto pequeno, mono, espaçado
export const Eyebrow = styled.p`
  font: 500 0.6875rem/1.2 ${({ theme }) => theme.fontes.mono};
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${({ theme, $cor }) => $cor || theme.cores.n600};
`;

export const Botao = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  border-radius: 99px;
  padding: 0.65rem 1.15rem;
  font-weight: 500;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.cores.n400};
  background: ${({ theme }) => theme.cores.n50};
  color: ${({ theme }) => theme.cores.n900};
  transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;

  &:hover { border-color: ${({ theme }) => theme.cores.terracota600}; }
  &:active { transform: translateY(1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }

  ${({ $variante, theme }) => $variante === 'escuro' && css`
    background: ${theme.cores.n900};
    border-color: ${theme.cores.n900};
    color: ${theme.cores.n50};
    &:hover { background: ${theme.cores.terracota600}; border-color: ${theme.cores.terracota600}; }
  `}

  ${({ $variante, theme }) => $variante === 'perigo' && css`
    color: ${theme.cores.rosa};
    &:hover { background: ${theme.cores.rosa}; border-color: ${theme.cores.rosa}; color: ${theme.cores.n50}; }
  `}

  ${({ $tamanho }) => $tamanho === 'pequeno' && css`
    padding: 0.35rem 0.75rem;
    font-size: 0.8125rem;
  `}
`;

// Botãozinho mono (o "COPY" do card de Wi-Fi)
export const Pilula = styled.button`
  border: 1px solid ${({ theme }) => theme.cores.n400};
  background: ${({ theme }) => theme.cores.n50};
  border-radius: 99px;
  font: 500 0.5625rem/1 ${({ theme }) => theme.fontes.mono};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  color: ${({ theme }) => theme.cores.n700};
  white-space: nowrap;

  &:hover {
    border-color: ${({ theme, $perigo }) => ($perigo ? theme.cores.rosa : theme.cores.terracota600)};
    color: ${({ theme, $perigo }) => ($perigo ? theme.cores.rosa : theme.cores.terracota600)};
  }
`;

export const Cartao = styled.section`
  background: ${({ theme }) => theme.cores.n50};
  border: 1px solid ${({ theme }) => theme.cores.n400};
  border-radius: ${({ theme }) => theme.raio};
  padding: 1.25rem;
  box-shadow: ${({ theme }) => theme.sombra};
  min-width: 0;
`;

export const TituloCartao = styled.h2`
  font-size: 1.45rem;
  margin-top: 0.3rem;
`;

export const CabecalhoCartao = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

// ---------- formulários ----------
export const Formulario = styled.form`
  display: grid;
  gap: 0.9rem;
`;

export const Campo = styled.div`
  display: grid;
  gap: 0.35rem;
  min-width: 0;

  label {
    font: 500 0.625rem/1 ${({ theme }) => theme.fontes.mono};
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.cores.n600};
  }
`;

const estiloEntrada = css`
  width: 100%;
  min-width: 0;
  border: 1px solid ${({ theme }) => theme.cores.n400};
  background: ${({ theme }) => theme.cores.n0};
  border-radius: 0.55rem;
  padding: 0.6rem 0.75rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.cores.terracota600};
    box-shadow: 0 0 0 3px hsla(15, 74%, 41%, 0.15);
  }
`;

export const Entrada = styled.input`${estiloEntrada}`;
export const Selecao = styled.select`${estiloEntrada}`;

export const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $colunas = 2 }) => $colunas}, minmax(0, 1fr));
  gap: 0.75rem;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const MensagemErro = styled.p`
  color: ${({ theme }) => theme.cores.rosa};
  font-size: 0.8125rem;
`;

export const Vazio = styled.p`
  color: ${({ theme }) => theme.cores.n600};
  text-align: center;
  padding: 1.25rem 0.5rem;
  font-size: 0.8125rem;
`;

// ---------- cabeçalho da página ("Bienvenue, Lucia.") ----------
export const Cabecalho = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;

  h1 {
    font-size: clamp(2.1rem, 4.2vw, 2.75rem);
    line-height: 1.1;
    margin-top: 0.55rem;
  }

  h1 em {
    color: ${({ theme }) => theme.cores.terracota600};
  }
`;

export const Meta = styled.p`
  color: ${({ theme }) => theme.cores.n600};
  margin-top: 0.4rem;
  &::first-letter { text-transform: uppercase; }
`;

export const Acoes = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.mobile}) {
    width: 100%;
    & > * { flex: 1; }
  }
`;

// Área principal de cada página
export const Pagina = styled.div`
  display: grid;
  gap: 2rem;
  align-content: start;
  min-width: 0;
`;
