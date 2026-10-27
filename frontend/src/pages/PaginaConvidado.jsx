// Página que o convidado abre pelo link: escolhe a mesa e confirma o nome
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAviso } from '../components/Aviso.jsx';
import { CartaoTerracota, Leque, Recibo } from '../components/Leque.jsx';
import { LegendaSalao, Salao } from '../components/Salao.jsx';
import {
  Acoes, Botao, Cabecalho, CabecalhoCartao, Campo, Cartao, Entrada, Eyebrow, Formulario, Grade,
  MensagemErro, Meta, Pagina, TituloCartao, Vazio,
} from '../components/ui.js';
import { livresNaMesa, resumoDoEvento, useEvento } from '../hooks/useEvento.js';
import { reservar } from '../services/api.js';
import { guardarReserva, tokenDoEvento } from '../services/storage.js';
import { dataCurta, dataLonga, diaDaSemana, numeroReserva, plural, separarUltimaPalavra } from '../utils/format.js';
import { NaoEncontrado } from './NaoEncontrado.jsx';

const Trabalho = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(18rem, 1fr);
  gap: 1.5rem;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const Escolha = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.9rem;
  border-radius: 0.6rem;
  background: ${({ theme, $tem }) => ($tem ? theme.cores.sol50 : theme.cores.n200)};

  strong { font: 400 1.35rem ${({ theme }) => theme.fontes.titulo}; display: block; }
  small { color: ${({ theme }) => theme.cores.n600}; }
`;

const Marcar = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  cursor: pointer;
  input { accent-color: ${({ theme }) => theme.cores.terracota600}; width: 1rem; height: 1rem; }
`;

export function PaginaConvidado() {
  const { code: codeUrl } = useParams();
  const code = codeUrl.toUpperCase();
  const navegar = useNavigate();
  const avisar = useAviso();
  const { evento, carregando, erro, recarregar } = useEvento(code);

  const [mesaId, setMesaId] = useState(null);
  const [semPreferencia, setSemPreferencia] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', telefone: '' });
  const [falha, setFalha] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (carregando) return <Vazio>Carregando o convite…</Vazio>;
  if (erro?.status === 404) return <NaoEncontrado titulo="Este convite" texto="Confira o link com quem te convidou." />;
  if (erro) return <Vazio>{erro.message}</Vazio>;

  const resumo = resumoDoEvento(evento);
  const mesa = evento.mesas.find((m) => m.id === mesaId);
  const [comeco, ultima] = separarUltimaPalavra(evento.nome);
  const souOrganizador = Boolean(tokenDoEvento(code));
  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function confirmar(e) {
    e.preventDefault();
    if (!form.nome.trim()) return setFalha('Informe o seu nome.');
    if (!mesa && !semPreferencia) return setFalha('Escolha uma mesa no salão (ou deixe o organizador escolher).');

    setFalha('');
    setEnviando(true);
    try {
      const pessoa = await reservar(code, {
        nome: form.nome.trim(),
        email: form.email.trim() || undefined,
        telefone: form.telefone.trim() || undefined,
        mesaId: semPreferencia ? undefined : mesa.id,
      });
      guardarReserva({ code, pessoaId: pessoa.id, nome: pessoa.nome, evento: evento.nome, data: evento.data });
      navegar(`/e/${code}/reserva/${pessoa.id}`);
    } catch (problema) {
      setFalha(problema.message);
      // 409 = alguém pegou o último lugar antes: atualiza o salão
      if (problema.status === 409) {
        setMesaId(null);
        recarregar();
        avisar('Essa mesa acabou de lotar. Escolha outra.', { erro: true });
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Pagina>
      <Cabecalho>
        <div>
          <Eyebrow>Convite · Escolha seu lugar</Eyebrow>
          <h1>{comeco} <em>{ultima}.</em></h1>
          <Meta>{[dataLonga(evento.data), evento.horario, evento.local].filter(Boolean).join(' · ')}</Meta>
        </div>
        {souOrganizador && (
          <Acoes>
            <Botao as={Link} to={`/e/${code}/admin`}>Voltar ao painel</Botao>
          </Acoes>
        )}
      </Cabecalho>

      <Leque>
        <Recibo
          eyebrow="Convite"
          titulo="Sua noite"
          numero={`№ ${numeroReserva(code)}\nCONVITE`}
          colunas={[
            { rotulo: 'Data', valor: dataCurta(evento.data), detalhe: `${diaDaSemana(evento.data)} · ${evento.horario}` },
            { rotulo: 'Lugares', valor: resumo.livres, detalhe: `livres de ${resumo.cadeiras}` },
          ]}
          linhas={[
            ['Mesas no salão', resumo.mesas],
            ['Convidados confirmados', resumo.ocupadas + resumo.semMesa],
            ['Local', evento.local || 'a confirmar'],
          ]}
          total={{ rotulo: 'Seu lugar', valor: mesa ? `Mesa ${mesa.number}` : '—' }}
          rodape="Mesa Posta · Reservas"
        />
        <CartaoTerracota
          eyebrow="Cartão de boas-vindas"
          chamada="Tem um lugar esperando por você,"
          titulo={evento.local ? `em ${evento.local}.` : 'na nossa festa.'}
          texto="Escolha a sua mesa no salão abaixo e confirme o seu nome. Leva menos de um minuto."
          rotuloPe="Quando"
          valorPe={`${dataLonga(evento.data)}, ${evento.horario}`}
        />
      </Leque>

      <Trabalho>
        <Cartao>
          <CabecalhoCartao>
            <div>
              <Eyebrow>Passo 1</Eyebrow>
              <TituloCartao>Escolha a mesa</TituloCartao>
            </div>
            <LegendaSalao />
          </CabecalhoCartao>
          {evento.mesas.length ? (
            <Salao
              mesas={evento.mesas}
              selecionadaId={semPreferencia ? null : mesaId}
              aoEscolher={(m) => { setMesaId(m.id); setSemPreferencia(false); }}
              desabilitar={(m) => livresNaMesa(m) <= 0}
            />
          ) : (
            <Vazio>O organizador ainda não montou as mesas.</Vazio>
          )}
        </Cartao>

        <Cartao as="aside">
          <Eyebrow>Passo 2</Eyebrow>
          <TituloCartao style={{ marginBottom: '1rem' }}>Seus dados</TituloCartao>
          <Formulario onSubmit={confirmar} noValidate>
            <Escolha $tem={Boolean(mesa) && !semPreferencia}>
              <div>
                <small>Mesa escolhida</small>
                <strong>
                  {semPreferencia ? 'O organizador escolhe' : mesa ? `Mesa ${mesa.number}` : 'Nenhuma ainda'}
                </strong>
              </div>
              {mesa && !semPreferencia && <small>{plural(livresNaMesa(mesa), 'lugar livre', 'lugares livres')}</small>}
            </Escolha>

            <Marcar>
              <input type="checkbox" checked={semPreferencia} onChange={(e) => setSemPreferencia(e.target.checked)} />
              Não tenho preferência, o organizador escolhe
            </Marcar>

            <Campo>
              <label htmlFor="cv-nome">Seu nome</label>
              <Entrada id="cv-nome" maxLength={80} autoComplete="name" value={form.nome} onChange={mudar('nome')} />
            </Campo>
            <Grade>
              <Campo>
                <label htmlFor="cv-email">E-mail</label>
                <Entrada id="cv-email" type="email" maxLength={120} autoComplete="email" value={form.email} onChange={mudar('email')} />
              </Campo>
              <Campo>
                <label htmlFor="cv-tel">Telefone</label>
                <Entrada id="cv-tel" type="tel" maxLength={20} autoComplete="tel" value={form.telefone} onChange={mudar('telefone')} />
              </Campo>
            </Grade>

            {falha && <MensagemErro role="alert">{falha}</MensagemErro>}

            <Botao type="submit" $variante="escuro" disabled={enviando}>
              {enviando ? 'Reservando…' : 'Confirmar reserva'}
            </Botao>
          </Formulario>
        </Cartao>
      </Trabalho>
    </Pagina>
  );
}
