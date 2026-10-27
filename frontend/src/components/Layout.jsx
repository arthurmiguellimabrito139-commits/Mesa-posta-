// Estrutura de todas as páginas: sidebar à esquerda (como no template) + conteúdo.
// No celular, a sidebar vira uma barra no topo com botão de menu.
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useMeusEventos } from '../hooks/useMeusEventos.js';
import { dataCurta, diasAte } from '../utils/format.js';
import { IconeFechar, IconeIngresso, IconeMais, IconeMenu, IconeMesa, IconeSol } from './Icones.jsx';
import { Eyebrow } from './ui.js';

const Grade = styled.div`
  display: grid;
  grid-template-columns: 16.25rem minmax(0, 1fr);
  min-height: 100vh;

  @media (max-width: ${({ theme }) => theme.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Lateral = styled.aside`
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  border-right: 1px solid ${({ theme }) => theme.cores.n400};
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;

  @media (max-width: ${({ theme }) => theme.mobile}) {
    position: static;
    height: auto;
    overflow: visible;
    border-right: 0;
    border-bottom: 1px solid ${({ theme }) => theme.cores.n400};
    padding: 1rem;

    & > *:not(:first-child) { display: none; }
    &[data-aberto='true'] > *:not(:first-child) { display: flex; }
  }
`;

const Marca = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;

  span {
    font-family: ${({ theme }) => theme.fontes.titulo};
    font-size: 1.3rem;
    line-height: 1.05;
  }
  i { display: block; color: ${({ theme }) => theme.cores.terracota600}; }
`;

const LinhaMarca = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.cores.n400};

  @media (max-width: ${({ theme }) => theme.mobile}) {
    padding-bottom: 0;
    border-bottom: 0;
    & > button { display: grid; }
  }
`;

const BotaoMenu = styled.button`
  display: none;
  margin-left: auto;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid ${({ theme }) => theme.cores.n400};
  border-radius: 0.4rem;
  background: none;
  cursor: pointer;
`;

const Secao = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  ${Eyebrow} { padding: 0 0.8rem 0.35rem; }
`;

const Item = styled(NavLink)`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.7rem;
  padding: 0.62rem 0.8rem;
  border-radius: 0.6rem;
  text-decoration: none;
  font-weight: 500;
  border: 1px solid transparent;

  &:hover { background: ${({ theme }) => theme.cores.n50}; }
  &.active {
    background: ${({ theme }) => theme.cores.n0};
    box-shadow: ${({ theme }) => theme.sombra};
  }
  &:focus-visible { outline: none; border-color: ${({ theme }) => theme.cores.terracota600}; }

  .nome { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .data {
    font: 400 0.625rem/1 ${({ theme }) => theme.fontes.mono};
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.cores.n600};
    text-transform: uppercase;
  }
`;

const NadaAinda = styled.p`
  padding: 0.3rem 0.8rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.cores.n600};
`;

// O card amarelo "Today in Cassis 27°" vira a contagem para o próximo evento
const CartaoSol = styled.div`
  margin-top: auto;
  position: relative;
  overflow: hidden;
  flex-direction: column;
  border-radius: 0.9rem;
  padding: 1rem;
  background: ${({ theme }) => theme.cores.sol300};
  color: ${({ theme }) => theme.cores.n900};

  &::after {
    content: '';
    position: absolute;
    right: -1.6rem;
    top: -1.9rem;
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, ${({ theme }) => theme.cores.sol200}, ${({ theme }) => theme.cores.sol500} 70%);
  }

  ${Eyebrow} { color: ${({ theme }) => theme.cores.n700}; }
  strong {
    display: block;
    font: 400 2rem/1.1 ${({ theme }) => theme.fontes.titulo};
    margin: 0.45rem 0 0.15rem;
  }
  p { position: relative; z-index: 1; }
`;

const Rodape = styled.div`
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px dashed ${({ theme }) => theme.cores.n400};
  padding-top: 0.9rem;
  font: 400 0.625rem/1.6 ${({ theme }) => theme.fontes.mono};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.n600};
  display: flex;
`;

const Principal = styled.main`
  padding: 2rem clamp(1rem, 3.2vw, 2.5rem) 3.5rem;
  min-width: 0;
`;

function textoContagem(dias) {
  if (dias === 0) return 'É hoje!';
  if (dias === 1) return 'Amanhã';
  return `${dias} dias`;
}

export function Layout() {
  const { eventos, reservas } = useMeusEventos();
  const [aberto, setAberto] = useState(false);
  const local = useLocation();

  useEffect(() => setAberto(false), [local.pathname]); // fecha o menu ao navegar

  // próximo evento (organizando ou reservado) que ainda não passou
  const proximos = [...eventos.map((e) => ({ nome: e.nome, data: e.data })), ...reservas.map((r) => ({ nome: r.evento, data: r.data }))]
    .map((e) => ({ ...e, dias: diasAte(e.data) }))
    .filter((e) => e.dias !== null && e.dias >= 0)
    .sort((a, b) => a.dias - b.dias);
  const proximo = proximos[0];

  return (
    <Grade>
      <Lateral data-aberto={aberto} className="nao-imprimir">
        <LinhaMarca>
          <Marca to="/" end>
            <IconeSol />
            <span><i>Mesa</i>Posta</span>
          </Marca>
          <BotaoMenu type="button" onClick={() => setAberto(!aberto)} aria-label={aberto ? 'Fechar menu' : 'Abrir menu'} aria-expanded={aberto}>
            {aberto ? <IconeFechar /> : <IconeMenu />}
          </BotaoMenu>
        </LinhaMarca>

        <Secao aria-label="Ações">
          <Item to="/" end>
            <IconeMais />
            <span className="nome">Criar evento</span>
          </Item>
        </Secao>

        <Secao aria-label="Eventos que organizo">
          <Eyebrow>Organizando</Eyebrow>
          {eventos.length === 0 && <NadaAinda>Nenhum evento ainda.</NadaAinda>}
          {eventos.map((e) => (
            <Item key={e.code} to={`/e/${e.code}/admin`}>
              <IconeMesa />
              <span className="nome">{e.nome}</span>
              <span className="data">{dataCurta(e.data)}</span>
            </Item>
          ))}
        </Secao>

        {reservas.length > 0 && (
          <Secao aria-label="Minhas reservas">
            <Eyebrow>Minhas reservas</Eyebrow>
            {reservas.map((r) => (
              <Item key={`${r.code}-${r.pessoaId}`} to={`/e/${r.code}/reserva/${r.pessoaId}`}>
                <IconeIngresso />
                <span className="nome">{r.evento}</span>
                <span className="data">{dataCurta(r.data)}</span>
              </Item>
            ))}
          </Secao>
        )}

        <CartaoSol>
          <Eyebrow>Próximo evento</Eyebrow>
          <strong>{proximo ? textoContagem(proximo.dias) : '—'}</strong>
          <p>{proximo ? proximo.nome : 'Nada marcado ainda'}</p>
        </CartaoSol>

        <Rodape>
          <span>Mesa Posta · Est. 2026</span>
          <span>Mesas · cadeiras · convidados</span>
        </Rodape>
      </Lateral>

      <Principal>
        <Outlet />
      </Principal>
    </Grade>
  );
}
