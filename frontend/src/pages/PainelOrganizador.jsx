// Painel do organizador: vê o salão, coloca/move/remove convidados,
// adiciona e remove mesas, distribui automaticamente e edita o evento.
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAviso } from '../components/Aviso.jsx';
import { Barra, CartaoInfo, LinhaDeCartoes } from '../components/CartaoInfo.jsx';
import { Contador } from '../components/Contador.jsx';
import { IconeMesa, IconePessoas, IconeRelogio } from '../components/Icones.jsx';
import { Janela } from '../components/Janela.jsx';
import { LegendaSalao, Salao } from '../components/Salao.jsx';
import {
  Acoes, Botao, Cabecalho, CabecalhoCartao, Campo, Cartao, Entrada, Eyebrow, Formulario, Grade,
  MensagemErro, Meta, Pagina, Pilula, Selecao, TituloCartao, Vazio,
} from '../components/ui.js';
import { livresNaMesa, resumoDoEvento, useEvento } from '../hooks/useEvento.js';
import * as api from '../services/api.js';
import { atualizarEventoGuardado, esquecerEvento, guardarEvento, meusEventos, tokenDoEvento } from '../services/storage.js';
import { dataCurta, dataLonga, plural, separarUltimaPalavra } from '../utils/format.js';
import { NaoEncontrado } from './NaoEncontrado.jsx';

// ---------- estilos da página ----------
const Trabalho = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(19rem, 1fr);
  gap: 1.5rem;
  align-items: start;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

const Coluna = styled.div`
  display: grid;
  gap: 1.5rem;
  min-width: 0;
`;

const Faixa = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  padding: 0.6rem 0.85rem;
  border-radius: 0.6rem;
  background: ${({ theme }) => theme.cores.sol50};
  font-size: 0.8125rem;
`;

const Lista = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
  max-height: 24rem;
  overflow-y: auto;
`;

const Pessoa = styled.li`
  display: grid;
  grid-template-columns: 2.1rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.65rem;
  padding: 0.5rem 0.6rem;
  border-radius: 0.6rem;
  background: ${({ theme }) => theme.cores.n0};
  border: 1px solid ${({ theme }) => theme.cores.n400};

  ${({ $ativa, theme }) => $ativa && css`
    border-color: ${theme.cores.terracota600};
    box-shadow: 0 0 0 2px hsla(15, 74%, 41%, 0.15);
  `}

  .inicial {
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: ${({ theme }) => theme.cores.n200};
    font: 500 0.8rem ${({ theme }) => theme.fontes.mono};
    text-transform: uppercase;
  }
  .quem { min-width: 0; }
  .quem b { display: block; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .quem span { font-size: 0.75rem; color: ${({ theme }) => theme.cores.n600}; overflow-wrap: anywhere; }
  .ops { display: flex; gap: 0.3rem; align-items: center; }
  select { font-size: 0.75rem; padding: 0.3rem 0.4rem; border-radius: 99px; border: 1px solid ${({ theme }) => theme.cores.n400}; background: ${({ theme }) => theme.cores.n50}; max-width: 7.5rem; }

  @media (max-width: 520px) {
    grid-template-columns: 2.1rem minmax(0, 1fr);
    .ops { grid-column: 2; flex-wrap: wrap; }
  }
`;

const LinhaFim = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed ${({ theme }) => theme.cores.n400};
`;

const Compartilhar = styled.div`
  display: grid;
  gap: 0.5rem;
  code {
    display: block;
    padding: 0.55rem 0.7rem;
    border-radius: 0.5rem;
    background: ${({ theme }) => theme.cores.n200};
    font: 400 0.75rem ${({ theme }) => theme.fontes.mono};
    overflow-wrap: anywhere;
  }
`;

const ZonaPerigo = styled.div`
  border-top: 1px dashed ${({ theme }) => theme.cores.n400};
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  p { font-size: 0.8125rem; color: ${({ theme }) => theme.cores.n600}; max-width: 30ch; }
`;

const inicial = (nome) => nome.trim().charAt(0) || '?';

async function copiar(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}

// ---------- página ----------
export function PainelOrganizador() {
  const { code: codeUrl } = useParams();
  const code = codeUrl.toUpperCase();
  const local = useLocation();
  const navegar = useNavigate();
  const avisar = useAviso();

  // Link de organizador vem com "#token=..." (para abrir em outro aparelho).
  // O "#" nunca é enviado ao servidor; aqui guardamos o token e limpamos a URL.
  useEffect(() => {
    const token = new URLSearchParams(local.hash.slice(1)).get('token');
    if (token) {
      const existente = meusEventos().find((e) => e.code === code);
      guardarEvento({ code, adminToken: token, nome: existente?.nome || 'Evento', data: existente?.data || '' });
      navegar(`/e/${code}/admin`, { replace: true });
    }
  }, [local.hash, code, navegar]);

  const temChave = Boolean(tokenDoEvento(code)) || local.hash.includes('token=');
  if (!temChave) return <SemChave code={code} />;
  return <Painel code={code} avisar={avisar} navegar={navegar} />;
}

function SemChave({ code }) {
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState('');
  const navegar = useNavigate();

  function entrar(e) {
    e.preventDefault();
    // aceita o link inteiro ou só o token
    const token = valor.includes('token=') ? valor.split('token=')[1].trim() : valor.trim();
    if (token.length < 20) return setErro('Isso não parece uma chave de organizador.');
    guardarEvento({ code, adminToken: token, nome: 'Evento', data: '' });
    navegar(0); // recarrega a página já com a chave
  }

  return (
    <Pagina>
      <Cabecalho>
        <div>
          <Eyebrow>Evento · {code}</Eyebrow>
          <h1>Área do <em>organizador.</em></h1>
          <Meta>Este navegador não tem a chave deste evento. Se você é convidado, a sua página é outra.</Meta>
        </div>
        <Acoes>
          <Botao as={Link} to={`/e/${code}`} $variante="escuro">Ir para a página do convidado</Botao>
        </Acoes>
      </Cabecalho>
      <Cartao style={{ maxWidth: '34rem' }}>
        <Formulario onSubmit={entrar}>
          <Campo>
            <label htmlFor="chave">Link ou chave de organizador</label>
            <Entrada id="chave" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Cole aqui o link de organizador" />
          </Campo>
          {erro && <MensagemErro>{erro}</MensagemErro>}
          <div><Botao type="submit">Entrar como organizador</Botao></div>
        </Formulario>
      </Cartao>
    </Pagina>
  );
}

function Painel({ code, avisar, navegar }) {
  const { evento, carregando, erro, executar } = useEvento(code);
  const [selecionadaId, setSelecionadaId] = useState(null);
  const [colocando, setColocando] = useState(null); // pessoa esperando escolher mesa
  const [ocupado, setOcupado] = useState(false);
  const [editando, setEditando] = useState(false);

  // mantém nome/data atualizados na sidebar
  useEffect(() => {
    if (evento) atualizarEventoGuardado(code, { nome: evento.nome, data: evento.data });
  }, [evento, code]);

  if (carregando) return <Vazio>Carregando o salão…</Vazio>;
  if (erro?.status === 404) return <NaoEncontrado titulo="Este evento" />;
  if (erro) return <Vazio>{erro.message}</Vazio>;

  const resumo = resumoDoEvento(evento);
  const mesaSelecionada = evento.mesas.find((m) => m.id === selecionadaId);
  const [comeco, ultima] = separarUltimaPalavra(evento.nome);
  const linkConvidado = `${window.location.origin}/e/${code}`;

  // roda uma ação na API, mostra o aviso e trata erros num lugar só
  async function acao(fn, sucesso) {
    setOcupado(true);
    try {
      const resultado = await executar(fn);
      if (sucesso) avisar(typeof sucesso === 'function' ? sucesso(resultado) : sucesso);
      return resultado;
    } catch (e) {
      avisar(e.status === 403 ? 'A chave de organizador deste navegador não vale para este evento.' : e.message, { erro: true });
      return null;
    } finally {
      setOcupado(false);
    }
  }

  function clicarMesa(mesa) {
    if (colocando) {
      if (livresNaMesa(mesa) <= 0) return avisar(`A Mesa ${mesa.number} está cheia.`, { erro: true });
      const pessoa = colocando;
      setColocando(null);
      setSelecionadaId(mesa.id);
      return acao(() => api.moverPessoa(code, pessoa.id, mesa.id), `${pessoa.nome} foi para a Mesa ${mesa.number}.`);
    }
    setSelecionadaId(mesa.id === selecionadaId ? null : mesa.id);
  }

  const distribuirTodos = () =>
    acao(() => api.distribuir(code), (r) =>
      r.naoCouberam?.length
        ? `${plural(r.colocadas, 'pessoa colocada', 'pessoas colocadas')}. Sem lugar: ${r.naoCouberam.join(', ')}.`
        : `${plural(r.colocadas, 'pessoa colocada', 'pessoas colocadas')} nas mesas.`);

  return (
    <Pagina>
      <Cabecalho>
        <div>
          <Eyebrow>Evento · Organizador</Eyebrow>
          <h1>{comeco} <em>{ultima}.</em></h1>
          <Meta>
            {[dataLonga(evento.data), evento.horario, evento.local].filter(Boolean).join(' · ')}
          </Meta>
        </div>
        <Acoes>
          <Botao type="button" onClick={async () => avisar((await copiar(linkConvidado)) ? 'Link do convidado copiado!' : linkConvidado)}>
            Copiar link do convidado
          </Botao>
          <Botao type="button" onClick={() => setEditando(true)}>Editar</Botao>
          <Botao type="button" $variante="escuro" onClick={distribuirTodos} disabled={ocupado || resumo.semMesa === 0}>
            Distribuir automaticamente
          </Botao>
        </Acoes>
      </Cabecalho>

      <LinhaDeCartoes>
        <CartaoInfo
          icone={<IconeMesa />} rotulo="Mesas" numero="01" cor="hsl(15, 74%, 41%)"
          titulo={plural(resumo.mesas, 'mesa', 'mesas')}
          sub={`${resumo.cadeiras} cadeiras no total · ${plural(resumo.cheias, 'mesa cheia', 'mesas cheias')}`}
        />
        <CartaoInfo
          icone={<IconePessoas />} rotulo="Convidados" numero="02" cor="hsl(230, 49%, 56%)"
          titulo={`${resumo.ocupadas} sentados`}
          sub={`${plural(resumo.livres, 'lugar livre', 'lugares livres')}`}
        >
          <Barra $porcento={resumo.cadeiras ? (resumo.ocupadas / resumo.cadeiras) * 100 : 0} $cor="hsl(230, 49%, 56%)"><i /></Barra>
        </CartaoInfo>
        <CartaoInfo
          icone={<IconeRelogio />} rotulo="Sem mesa" numero="03" cor="hsl(340, 48%, 52%)"
          titulo={resumo.semMesa ? plural(resumo.semMesa, 'esperando', 'esperando') : 'Todos sentados'}
          sub={resumo.semMesa ? 'Coloque à mão ou use "Distribuir"' : `Dia ${dataCurta(evento.data)}, ${evento.horario}`}
        />
      </LinhaDeCartoes>

      <Trabalho>
        {/* ----- salão ----- */}
        <Cartao>
          <CabecalhoCartao>
            <div>
              <Eyebrow>Planta</Eyebrow>
              <TituloCartao>Salão</TituloCartao>
            </div>
            <LegendaSalao />
          </CabecalhoCartao>

          {colocando && (
            <Faixa role="status">
              <span>Clique numa mesa com lugar para <b>{colocando.nome}</b>.</span>
              <Pilula type="button" onClick={() => setColocando(null)}>Cancelar</Pilula>
            </Faixa>
          )}

          {evento.mesas.length ? (
            <Salao
              mesas={evento.mesas}
              selecionadaId={selecionadaId}
              aoEscolher={clicarMesa}
              desabilitar={(m) => Boolean(colocando) && livresNaMesa(m) <= 0}
              destacar={(m) => Boolean(colocando) && livresNaMesa(m) > 0}
            />
          ) : (
            <Vazio>Nenhuma mesa. Adicione uma no painel ao lado.</Vazio>
          )}
        </Cartao>

        {/* ----- painel lateral ----- */}
        <Coluna>
          <PainelMesa
            mesa={mesaSelecionada}
            mesas={evento.mesas}
            ocupado={ocupado}
            aoMover={(pessoa, mesaId) => {
              const destino = evento.mesas.find((m) => m.id === mesaId);
              acao(() => api.moverPessoa(code, pessoa.id, mesaId), mesaId ? `${pessoa.nome} foi para a Mesa ${destino?.number}.` : `${pessoa.nome} ficou sem mesa.`);
            }}
            aoRemoverPessoa={(pessoa) => acao(() => api.cancelarPessoa(code, pessoa.id), `${pessoa.nome} saiu da lista.`)}
            aoRemoverMesa={(mesa) => {
              setSelecionadaId(null);
              acao(() => api.removerMesa(code, mesa.id), mesa.pessoas.length
                ? `Mesa ${mesa.number} removida. ${plural(mesa.pessoas.length, 'pessoa ficou', 'pessoas ficaram')} sem mesa.`
                : `Mesa ${mesa.number} removida.`);
            }}
          />

          <Cartao>
            <CabecalhoCartao>
              <div>
                <Eyebrow>Lista de espera</Eyebrow>
                <TituloCartao>Sem mesa · {resumo.semMesa}</TituloCartao>
              </div>
            </CabecalhoCartao>
            {resumo.semMesa === 0 ? (
              <Vazio>Ninguém esperando lugar.</Vazio>
            ) : (
              <Lista>
                {evento.semMesa.map((p) => (
                  <Pessoa key={p.id} $ativa={colocando?.id === p.id}>
                    <span className="inicial">{inicial(p.nome)}</span>
                    <span className="quem"><b>{p.nome}</b><span>{p.email || p.telefone || 'sem contato'}</span></span>
                    <span className="ops">
                      <Pilula type="button" onClick={() => setColocando(colocando?.id === p.id ? null : p)} disabled={ocupado}>
                        {colocando?.id === p.id ? 'Escolhendo…' : 'Colocar'}
                      </Pilula>
                      <Pilula type="button" $perigo onClick={() => acao(() => api.cancelarPessoa(code, p.id), `${p.nome} saiu da lista.`)} disabled={ocupado}>
                        Remover
                      </Pilula>
                    </span>
                  </Pessoa>
                ))}
              </Lista>
            )}
          </Cartao>

          <NovoConvidado
            mesas={evento.mesas}
            mesaSugerida={mesaSelecionada}
            ocupado={ocupado}
            aoSalvar={(dados) => acao(() => api.reservar(code, dados), `${dados.nome} adicionado(a).`)}
          />

          <NovaMesa ocupado={ocupado} aoSalvar={(cadeiras) => acao(() => api.adicionarMesa(code, cadeiras), `Mesa com ${cadeiras} cadeiras adicionada.`)} />
        </Coluna>
      </Trabalho>

      {editando && (
        <EditarEvento
          evento={evento}
          code={code}
          aoFechar={() => setEditando(false)}
          aoSalvar={async (campos) => {
            const ok = await acao(() => api.editarEvento(code, campos), 'Evento atualizado.');
            if (ok) setEditando(false);
          }}
          aoExcluir={async () => {
            try {
              await api.excluirEvento(code);
              esquecerEvento(code);
              avisar('Evento apagado.');
              navegar('/');
            } catch (e) {
              avisar(e.message, { erro: true });
            }
          }}
        />
      )}
    </Pagina>
  );
}

// ---------- mesa selecionada ----------
function PainelMesa({ mesa, mesas, ocupado, aoMover, aoRemoverPessoa, aoRemoverMesa }) {
  if (!mesa) {
    return (
      <Cartao>
        <Eyebrow>Mesa</Eyebrow>
        <TituloCartao>Nenhuma selecionada</TituloCartao>
        <Vazio>Clique numa mesa do salão para ver quem está nela.</Vazio>
      </Cartao>
    );
  }

  const livres = livresNaMesa(mesa);
  return (
    <Cartao>
      <CabecalhoCartao>
        <div>
          <Eyebrow>{livres ? plural(livres, 'lugar livre', 'lugares livres') : 'Mesa cheia'}</Eyebrow>
          <TituloCartao>Mesa {mesa.number} · {mesa.pessoas.length}/{mesa.seats}</TituloCartao>
        </div>
      </CabecalhoCartao>

      {mesa.pessoas.length === 0 ? (
        <Vazio>Mesa vazia.</Vazio>
      ) : (
        <Lista>
          {mesa.pessoas.map((p) => (
            <Pessoa key={p.id}>
              <span className="inicial">{inicial(p.nome)}</span>
              <span className="quem"><b>{p.nome}</b><span>{p.email || p.telefone || 'sem contato'}</span></span>
              <span className="ops">
                <select
                  aria-label={`Mover ${p.nome}`}
                  value=""
                  disabled={ocupado}
                  onChange={(e) => aoMover(p, e.target.value === 'nenhuma' ? null : Number(e.target.value))}
                >
                  <option value="" disabled>Mover…</option>
                  <option value="nenhuma">Sem mesa</option>
                  {mesas.filter((m) => m.id !== mesa.id && livresNaMesa(m) > 0).map((m) => (
                    <option key={m.id} value={m.id}>Mesa {m.number} ({livresNaMesa(m)} livres)</option>
                  ))}
                </select>
                <Pilula type="button" $perigo onClick={() => aoRemoverPessoa(p)} disabled={ocupado}>Remover</Pilula>
              </span>
            </Pessoa>
          ))}
        </Lista>
      )}

      <LinhaFim>
        <small>{mesa.pessoas.length ? 'Ao remover, quem está aqui fica sem mesa.' : 'Mesa sem ninguém.'}</small>
        <Botao type="button" $variante="perigo" $tamanho="pequeno" onClick={() => aoRemoverMesa(mesa)} disabled={ocupado}>
          Remover mesa
        </Botao>
      </LinhaFim>
    </Cartao>
  );
}

// ---------- adicionar convidado ----------
function NovoConvidado({ mesas, mesaSugerida, ocupado, aoSalvar }) {
  const vazio = { nome: '', email: '', telefone: '', mesaId: '' };
  const [form, setForm] = useState(vazio);
  const [erro, setErro] = useState('');

  // ao clicar numa mesa, ela vira a sugestão do formulário
  useEffect(() => {
    if (mesaSugerida && livresNaMesa(mesaSugerida) > 0) setForm((f) => ({ ...f, mesaId: String(mesaSugerida.id) }));
  }, [mesaSugerida]);

  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    if (!form.nome.trim()) return setErro('Informe o nome.');
    setErro('');
    const ok = await aoSalvar({
      nome: form.nome.trim(),
      email: form.email.trim() || undefined,
      telefone: form.telefone.trim() || undefined,
      mesaId: form.mesaId ? Number(form.mesaId) : undefined,
    });
    if (ok) setForm({ ...vazio, mesaId: form.mesaId });
  }

  return (
    <Cartao>
      <Eyebrow>Lista de convidados</Eyebrow>
      <TituloCartao style={{ marginBottom: '1rem' }}>Adicionar convidado</TituloCartao>
      <Formulario onSubmit={enviar} noValidate>
        <Campo>
          <label htmlFor="cv-nome">Nome</label>
          <Entrada id="cv-nome" maxLength={80} value={form.nome} onChange={mudar('nome')} placeholder="Ex.: Ana Souza" />
        </Campo>
        <Grade>
          <Campo>
            <label htmlFor="cv-email">E-mail</label>
            <Entrada id="cv-email" type="email" maxLength={120} value={form.email} onChange={mudar('email')} />
          </Campo>
          <Campo>
            <label htmlFor="cv-tel">Telefone</label>
            <Entrada id="cv-tel" type="tel" maxLength={20} value={form.telefone} onChange={mudar('telefone')} />
          </Campo>
        </Grade>
        <Campo>
          <label htmlFor="cv-mesa">Mesa</label>
          <Selecao id="cv-mesa" value={form.mesaId} onChange={mudar('mesaId')}>
            <option value="">Sem mesa (distribuir depois)</option>
            {mesas.map((m) => (
              <option key={m.id} value={m.id} disabled={livresNaMesa(m) <= 0}>
                Mesa {m.number} — {livresNaMesa(m) > 0 ? plural(livresNaMesa(m), 'livre', 'livres') : 'cheia'}
              </option>
            ))}
          </Selecao>
        </Campo>
        {erro && <MensagemErro>{erro}</MensagemErro>}
        <div><Botao type="submit" disabled={ocupado}>Adicionar</Botao></div>
      </Formulario>
    </Cartao>
  );
}

// ---------- adicionar mesa ----------
function NovaMesa({ ocupado, aoSalvar }) {
  const [cadeiras, setCadeiras] = useState(8);
  return (
    <Cartao>
      <Eyebrow>Salão</Eyebrow>
      <TituloCartao style={{ marginBottom: '1rem' }}>Adicionar mesa</TituloCartao>
      <Formulario onSubmit={(e) => { e.preventDefault(); aoSalvar(cadeiras); }}>
        <Campo>
          <label htmlFor="nm-cadeiras">Cadeiras</label>
          <Contador id="nm-cadeiras" rotulo="cadeiras" valor={cadeiras} min={2} max={16} onChange={setCadeiras} />
        </Campo>
        <div><Botao type="submit" disabled={ocupado}>Adicionar mesa</Botao></div>
      </Formulario>
    </Cartao>
  );
}

// ---------- editar / compartilhar / apagar ----------
function EditarEvento({ evento, code, aoFechar, aoSalvar, aoExcluir }) {
  const [form, setForm] = useState({ nome: evento.nome, data: evento.data, horario: evento.horario || '', local: evento.local || '' });
  const [confirmar, setConfirmar] = useState(false);
  const [erro, setErro] = useState('');
  const avisar = useAviso();
  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const linkOrganizador = `${window.location.origin}/e/${code}/admin#token=${tokenDoEvento(code)}`;

  return (
    <Janela titulo="Editar evento" subtitulo={`Evento · ${code}`} aoFechar={aoFechar}>
      <Formulario
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.nome.trim()) return setErro('O nome não pode ficar vazio.');
          if (!form.data) return setErro('Escolha a data.');
          aoSalvar({ ...form, nome: form.nome.trim() });
        }}
      >
        <Campo>
          <label htmlFor="ed-nome">Nome</label>
          <Entrada id="ed-nome" maxLength={80} value={form.nome} onChange={mudar('nome')} />
        </Campo>
        <Grade $colunas={3}>
          <Campo>
            <label htmlFor="ed-data">Data</label>
            <Entrada id="ed-data" type="date" value={form.data} onChange={mudar('data')} />
          </Campo>
          <Campo>
            <label htmlFor="ed-hora">Horário</label>
            <Entrada id="ed-hora" type="time" value={form.horario} onChange={mudar('horario')} />
          </Campo>
          <Campo>
            <label htmlFor="ed-local">Local</label>
            <Entrada id="ed-local" maxLength={80} value={form.local} onChange={mudar('local')} />
          </Campo>
        </Grade>
        {erro && <MensagemErro>{erro}</MensagemErro>}
        <div><Botao type="submit" $variante="escuro">Salvar alterações</Botao></div>
      </Formulario>

      <Compartilhar>
        <Eyebrow>Link de organizador</Eyebrow>
        <code>{linkOrganizador}</code>
        <small>Abra este link em outro aparelho para gerenciar o evento de lá. Não mande para convidados.</small>
        <div>
          <Pilula type="button" onClick={async () => avisar((await copiar(linkOrganizador)) ? 'Link de organizador copiado!' : 'Não consegui copiar.')}>
            Copiar
          </Pilula>
        </div>
      </Compartilhar>

      <ZonaPerigo>
        <p>Apagar o evento remove todas as mesas e convidados. Não dá para desfazer.</p>
        <Botao type="button" $variante={confirmar ? 'escuro' : 'perigo'} onClick={() => (confirmar ? aoExcluir() : setConfirmar(true))}>
          {confirmar ? 'Clique de novo para apagar' : 'Apagar evento'}
        </Botao>
      </ZonaPerigo>
    </Janela>
  );
}
