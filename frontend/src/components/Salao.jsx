// A planta do salão: cada mesa é um círculo com as cadeiras em volta.
// Cadeira pintada = ocupada. Mesa cheia fica amarela.
import styled, { css } from 'styled-components';
import { livresNaMesa } from '../hooks/useEvento.js';

const Planta = styled.div`
  background: ${({ theme }) => theme.cores.n0};
  border: 1px dashed ${({ theme }) => theme.cores.n400};
  border-radius: 0.8rem;
  padding: 1rem;
  display: grid;
  gap: 1.1rem;
`;

const Palco = styled.div`
  text-align: center;
  border-radius: 0.5rem;
  padding: 0.55rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.cores.terracota500}, ${({ theme }) => theme.cores.terracota700});
  color: ${({ theme }) => theme.cores.n50};
  font: 500 0.6875rem/1 ${({ theme }) => theme.fontes.mono};
  letter-spacing: 0.24em;
  text-transform: uppercase;
`;

const Mesas = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
  gap: 1rem 0.75rem;

  @media (max-width: 520px) {
    grid-template-columns: repeat(auto-fill, minmax(6.4rem, 1fr));
  }
`;

const Mesa = styled.button`
  position: relative;
  aspect-ratio: 1;
  border: 0;
  padding: 0;
  background: none;
  border-radius: 50%;
  cursor: pointer;

  &:disabled { cursor: not-allowed; opacity: 0.4; }

  .tampo {
    position: absolute;
    inset: 22%;
    border-radius: 50%;
    display: grid;
    place-content: center;
    gap: 0.15rem;
    text-align: center;
    background: ${({ theme }) => theme.cores.n50};
    border: 1.5px solid ${({ theme }) => theme.cores.n600};
    transition: transform 0.15s, background 0.15s, border-color 0.15s;
  }
  .tampo b { font: 400 1.25rem/1 ${({ theme }) => theme.fontes.titulo}; }
  .tampo small {
    font: 400 0.625rem/1 ${({ theme }) => theme.fontes.mono};
    letter-spacing: 0.04em;
    color: ${({ theme }) => theme.cores.n600};
  }

  &:hover:not(:disabled) .tampo { transform: scale(1.05); }

  ${({ $selecionada, theme }) => $selecionada && css`
    .tampo { background: ${theme.cores.terracota600}; border-color: ${theme.cores.terracota600}; color: ${theme.cores.n50}; }
    .tampo small { color: ${theme.cores.sol200}; }
  `}

  ${({ $destaque, theme }) => $destaque && css`
    .tampo { border: 2px dashed ${theme.cores.verde}; }
  `}
`;

const Cadeira = styled.i`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 13%;
  aspect-ratio: 1;
  margin: -6.5% 0 0 -6.5%;
  border-radius: 50%;
  border: 1.5px solid ${({ theme }) => theme.cores.n600};
  background: ${({ theme }) => theme.cores.n0};
  transition: background 0.2s;

  ${({ $ocupada, $cheia, theme }) => $ocupada && css`
    background: ${$cheia ? theme.cores.sol500 : theme.cores.terracota500};
    border-color: ${$cheia ? theme.cores.sol500 : theme.cores.terracota500};
  `}
`;

const Legenda = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.cores.n600};

  span { display: inline-flex; align-items: center; gap: 0.35rem; }
  i {
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
    border: 1.5px solid ${({ theme }) => theme.cores.n600};
    background: ${({ theme }) => theme.cores.n0};
  }
  i.ocupada { background: ${({ theme }) => theme.cores.terracota500}; border-color: ${({ theme }) => theme.cores.terracota500}; }
  i.cheia { background: ${({ theme }) => theme.cores.sol500}; border-color: ${({ theme }) => theme.cores.sol500}; }
`;

export function LegendaSalao() {
  return (
    <Legenda>
      <span><i /> Livre</span>
      <span><i className="ocupada" /> Ocupada</span>
      <span><i className="cheia" /> Mesa cheia</span>
    </Legenda>
  );
}

/**
 * mesas: lista do back-end ({ id, number, seats, pessoas })
 * selecionadaId: id da mesa em destaque
 * aoEscolher(mesa): clique numa mesa
 * desabilitar(mesa): true = não dá para clicar (ex.: cheia, para o convidado)
 * destacar(mesa): true = borda verde (ex.: cabe a pessoa que está sendo colocada)
 */
export function Salao({ mesas, selecionadaId, aoEscolher, desabilitar = () => false, destacar = () => false }) {
  return (
    <Planta>
      <Palco>Pista · Palco</Palco>
      <Mesas>
        {mesas.map((mesa) => {
          const ocupadas = mesa.pessoas.length;
          const cheia = ocupadas >= mesa.seats;
          const livres = livresNaMesa(mesa);
          return (
            <Mesa
              key={mesa.id}
              type="button"
              onClick={() => aoEscolher(mesa)}
              disabled={desabilitar(mesa)}
              $selecionada={mesa.id === selecionadaId}
              $destaque={destacar(mesa)}
              aria-pressed={mesa.id === selecionadaId}
              aria-label={`Mesa ${mesa.number}: ${livres} de ${mesa.seats} lugares livres`}
            >
              {Array.from({ length: mesa.seats }, (_, i) => {
                // espalha as cadeiras num círculo: ângulo = fração da volta
                const angulo = (i / mesa.seats) * 2 * Math.PI - Math.PI / 2;
                const x = Math.cos(angulo) * 41;
                const y = Math.sin(angulo) * 41;
                return (
                  <Cadeira
                    key={i}
                    style={{ transform: `translate(${x * 7.7}%, ${y * 7.7}%)` }}
                    $ocupada={i < ocupadas}
                    $cheia={cheia}
                  />
                );
              })}
              <span className="tampo">
                <b>{mesa.number}</b>
                <small>{ocupadas}/{mesa.seats}</small>
              </span>
            </Mesa>
          );
        })}
      </Mesas>
    </Planta>
  );
}
