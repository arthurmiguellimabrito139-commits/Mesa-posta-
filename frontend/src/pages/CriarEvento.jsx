// Tela inicial: o organizador monta o salão (nome, data, mesas e cadeiras)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAviso } from '../components/Aviso.jsx';
import { Contador } from '../components/Contador.jsx';
import { IconeSolBranco } from '../components/Icones.jsx';
import {
  Botao, Cabecalho, Campo, Cartao, Entrada, Eyebrow, Formulario, Grade, MensagemErro, Meta, Pagina,
} from '../components/ui.js';
import { criarEvento } from '../services/api.js';
import { avisarMudanca } from '../services/storage.js';
import { dataLonga } from '../utils/format.js';

const Colunas = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: 2rem;
  align-items: start;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

// Prévia: o cartão terracota do template mostrando o salão que vai nascer
const Previa = styled.div`
  position: sticky;
  top: 2rem;
  display: grid;
  gap: 1.1rem;
  padding: 1.7rem 1.6rem;
  border-radius: 1.1rem;
  color: ${({ theme }) => theme.cores.n50};
  background: linear-gradient(160deg, ${({ theme }) => theme.cores.terracota400}, ${({ theme }) => theme.cores.terracota600} 55%, ${({ theme }) => theme.cores.terracota700});
  box-shadow: 0 30px 50px -18px hsla(15, 70%, 30%, 0.55);
  transform: rotate(1.5deg);

  ${Eyebrow} { color: ${({ theme }) => theme.cores.sol50}; border-top: 1px dashed hsla(40, 60%, 98%, 0.45); padding-top: 1rem; }
  .sol { position: absolute; right: 1.4rem; top: 2.6rem; }
  em { font: italic 400 1.15rem ${({ theme }) => theme.fontes.titulo}; color: ${({ theme }) => theme.cores.sol200}; margin-top: 1rem; }
  h3 { font-size: 2.1rem; font-style: italic; line-height: 1.1; overflow-wrap: anywhere; }

  @media (max-width: 1000px) { position: relative; top: 0; transform: none; }
`;

const MiniSalao = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;

  span {
    position: relative;
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 50%;
    border: 1.5px solid hsla(45, 100%, 74%, 0.85);
    display: grid;
    place-items: center;
    font: 500 0.625rem ${({ theme }) => theme.fontes.mono};
  }
`;

const Totais = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-top: 1px solid hsla(40, 60%, 98%, 0.35);
  padding-top: 0.9rem;

  small { font: 500 0.625rem ${({ theme }) => theme.fontes.mono}; letter-spacing: 0.18em; text-transform: uppercase; }
  strong { font: 400 1.7rem ${({ theme }) => theme.fontes.titulo}; }
`;

const hoje = () => new Date().toISOString().slice(0, 10);

export function CriarEvento() {
  const navegar = useNavigate();
  const avisar = useAviso();

  const [form, setForm] = useState({ nome: '', data: '', horario: '20:00', local: '' });
  const [mesas, setMesas] = useState(10);
  const [cadeiras, setCadeiras] = useState(8);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    if (!form.nome.trim()) return setErro('Dê um nome ao evento.');
    if (!form.data) return setErro('Escolha a data do evento.');

    setErro('');
    setEnviando(true);
    try {
      const { code } = await criarEvento({
        ...form,
        nome: form.nome.trim(),
        quantidadeMesas: mesas,
        cadeirasPorMesa: cadeiras,
      });
      avisarMudanca(); // atualiza a lista "Organizando" da sidebar
      avisar('Evento criado! Agora é só chamar os convidados.');
      navegar(`/e/${code}/admin`);
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Pagina>
      <Cabecalho>
        <div>
          <Eyebrow>Novo evento · Passo 1</Eyebrow>
          <h1>Monte o seu <em>salão.</em></h1>
          <Meta>Escolha quantas mesas e cadeiras a festa vai ter. Depois você compartilha o link e cada convidado escolhe o lugar.</Meta>
        </div>
      </Cabecalho>

      <Colunas>
        <Cartao>
          <Formulario onSubmit={enviar} noValidate>
            <Campo>
              <label htmlFor="nome">Nome do evento</label>
              <Entrada id="nome" maxLength={80} placeholder="Ex.: Casamento Ana e Pedro" value={form.nome} onChange={mudar('nome')} required />
            </Campo>

            <Grade $colunas={3}>
              <Campo>
                <label htmlFor="data">Data</label>
                <Entrada id="data" type="date" min={hoje()} value={form.data} onChange={mudar('data')} required />
              </Campo>
              <Campo>
                <label htmlFor="horario">Horário</label>
                <Entrada id="horario" type="time" value={form.horario} onChange={mudar('horario')} />
              </Campo>
              <Campo>
                <label htmlFor="local">Local</label>
                <Entrada id="local" maxLength={80} placeholder="Salão, sítio, casa…" value={form.local} onChange={mudar('local')} />
              </Campo>
            </Grade>

            <Grade>
              <Campo>
                <label htmlFor="mesas">Número de mesas</label>
                <Contador id="mesas" rotulo="mesas" valor={mesas} min={1} max={80} onChange={setMesas} />
              </Campo>
              <Campo>
                <label htmlFor="cadeiras">Cadeiras por mesa</label>
                <Contador id="cadeiras" rotulo="cadeiras" valor={cadeiras} min={2} max={16} onChange={setCadeiras} />
              </Campo>
            </Grade>

            {erro && <MensagemErro role="alert">{erro}</MensagemErro>}

            <div>
              <Botao type="submit" $variante="escuro" disabled={enviando}>
                {enviando ? 'Criando…' : 'Criar evento'}
              </Botao>
            </div>
          </Formulario>
        </Cartao>

        <Previa aria-label="Prévia do salão">
          <Eyebrow>Prévia do salão</Eyebrow>
          <span className="sol"><IconeSolBranco /></span>
          <em>{form.data ? dataLonga(form.data) : 'Uma festa em breve,'}</em>
          <h3>{form.nome.trim() || 'Sua festa.'}</h3>
          <MiniSalao>
            {Array.from({ length: Math.min(mesas, 24) }, (_, i) => <span key={i}>{i + 1}</span>)}
            {mesas > 24 && <span>+{mesas - 24}</span>}
          </MiniSalao>
          <Totais>
            <small>{mesas} mesas × {cadeiras} cadeiras</small>
            <strong>{mesas * cadeiras} lugares</strong>
          </Totais>
        </Previa>
      </Colunas>
    </Pagina>
  );
}
