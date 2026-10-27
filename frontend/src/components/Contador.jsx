// Campo numérico com botões − e + (usado para mesas e cadeiras)
import styled from 'styled-components';

const Caixa = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.cores.n400};
  border-radius: 0.55rem;
  background: ${({ theme }) => theme.cores.n0};
  overflow: hidden;

  button {
    border: 0;
    background: none;
    width: 2.6rem;
    height: 2.8rem;
    cursor: pointer;
    font-size: 1.15rem;
    color: ${({ theme }) => theme.cores.terracota600};
    &:hover:not(:disabled) { background: ${({ theme }) => theme.cores.n200}; }
    &:disabled { opacity: 0.35; cursor: not-allowed; }
  }

  input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: none;
    text-align: center;
    font: 400 1.45rem ${({ theme }) => theme.fontes.titulo};
    font-variant-numeric: tabular-nums;
    -moz-appearance: textfield;
    &::-webkit-inner-spin-button, &::-webkit-outer-spin-button { appearance: none; margin: 0; }
    &:focus { outline: none; }
  }
`;

export function Contador({ id, valor, min, max, onChange, rotulo }) {
  const limitar = (n) => Math.min(max, Math.max(min, Number.isNaN(n) ? min : n));

  return (
    <Caixa>
      <button type="button" aria-label={`Diminuir ${rotulo}`} disabled={valor <= min} onClick={() => onChange(limitar(valor - 1))}>−</button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={valor}
        onChange={(e) => onChange(e.target.value === '' ? min : limitar(parseInt(e.target.value, 10)))}
      />
      <button type="button" aria-label={`Aumentar ${rotulo}`} disabled={valor >= max} onClick={() => onChange(limitar(valor + 1))}>+</button>
    </Caixa>
  );
}
