// Estrutura de todas as páginas: sidebar à esquerda (como no template) + conteúdo.
// No celular, a sidebar vira uma barra no topo com botão de menu.
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth.jsx';
import { useMeusEventos } from '../hooks/useMeusEventos.js';
import { dataCurta, diasAte } from '../utils/format.js';
import { IconeFechar, IconeIngresso, IconeMais, IconeMenu, IconeMesa, IconeSol } from './Icones.jsx';
import { Botao, Eyebrow } from './ui.js';

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

// Quem está logado + botão de sair (ou o convite para entrar)
const Conta = styled.div`
  margin-top: auto;
  flex-direction: column;
  gap: 0.6rem;
  display: flex;
  padding: 0.85rem;
  border-radius: 0.8rem;
  border: 1px solid ${({ theme }) => theme.cores.n400};
  background: ${({ theme }) => theme.cores.n50};

  .quem { display: flex; align-items: center; gap: 0.6rem; min-width: 0; }
  .avatar {
    width: 2.1rem;
    height: 2.1rem;
    flex-shrink: 0;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: ${({ theme }) => theme.cores.terracota600};
    color: ${({ theme }) => theme.cores.n50};
    font: 400 1rem ${({ theme }) => theme.fontes.titulo};
  }
  .nome { font-weight: 500; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .email { font-size: 0.75rem; color: ${({ theme }) => theme.cores.n600}; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dados { min-width: 0; }
  p { font-size: 0.8125rem; color: ${({ theme }) => theme.cores.n700}; }
  .botoes { display: flex; gap: 0.4rem; }
  .botoes > * { flex: 1; }
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
  const { usuario, sair } = useAuth();
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
          {!usuario && <NadaAinda>Entre para ver seus eventos.</NadaAinda>}
          {usuario && eventos.length === 0 && <NadaAinda>Nenhum evento ainda.</NadaAinda>}
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

        <Conta>
          {usuario ? (
            <>
              <div className="quem">
                <span className="avatar" aria-hidden="true">{usuario.nome.charAt(0).toUpperCase()}</span>
                <span className="dados">
                  <span className="nome">{usuario.nome}</span>
                  <span className="email">{usuario.email}</span>
                </span>
              </div>
              <Botao type="button" $tamanho="pequeno" onClick={sair}>Sair</Botao>
            </>
          ) : (
            <>
              <p>Organiza uma festa? Entre para criar e gerenciar seus eventos.</p>
              <div className="botoes">
                <Botao as={NavLink} to="/entrar" $tamanho="pequeno" $variante="escuro">Entrar</Botao>
                <Botao as={NavLink} to="/cadastro" $tamanho="pequeno">Criar conta</Botao>
              </div>
            </>
          )}
        </Conta>

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
