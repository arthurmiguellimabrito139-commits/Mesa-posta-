// Comprovante da reserva: é a tela do template (recibo + cartão terracota + 3 cards)
import { useParams } from 'react-router-dom';
import { useAviso } from '../components/Aviso.jsx';
import { CartaoInfo, LinhaDado, LinhaDeCartoes } from '../components/CartaoInfo.jsx';
import { IconeLocal, IconeMesa, IconeRelogio } from '../components/Icones.jsx';
import { CartaoTerracota, Leque, Recibo } from '../components/Leque.jsx';
import { Acoes, Botao, Cabecalho, Eyebrow, Pagina, Pilula, Vazio } from '../components/ui.js';
import { useEvento } from '../hooks/useEvento.js';
import { baixarConvite } from '../utils/calendario.js';
import { dataCurta, dataLonga, diaDaSemana, numeroPessoa, numeroReserva, primeiroNome } from '../utils/format.js';
import { NaoEncontrado } from './NaoEncontrado.jsx';

// Procura a pessoa no evento: em alguma mesa ou no "sem mesa"
function acharPessoa(evento, id) {
  for (const mesa of evento.mesas) {
    const pessoa = mesa.pessoas.find((p) => p.id === id);
    if (pessoa) return { pessoa, mesa };
  }
  const pessoa = evento.semMesa?.find((p) => p.id === id);
  return pessoa ? { pessoa, mesa: null } : null;
}

export function Confirmacao() {
  const { code: codeUrl, pessoaId } = useParams();
  const code = codeUrl.toUpperCase();
  const avisar = useAviso();
  const { evento, carregando, erro } = useEvento(code);

  if (carregando) return <Vazio>Carregando o comprovante…</Vazio>;
  if (erro?.status === 404) return <NaoEncontrado titulo="Este evento" />;
  if (erro) return <Vazio>{erro.message}</Vazio>;

  const encontrada = acharPessoa(evento, Number(pessoaId));
  if (!encontrada) {
    return <NaoEncontrado titulo="Esta reserva" texto="Ela pode ter sido cancelada pelo organizador." />;
  }

  const { pessoa, mesa } = encontrada;
  const numero = `${numeroReserva(code)}\n${numeroPessoa(pessoa.id)}`;
  const nomeMesa = mesa ? `Mesa ${mesa.number}` : 'A definir';

  async function copiarCodigo() {
    try {
      await navigator.clipboard.writeText(`${numeroReserva(code)}-${numeroPessoa(pessoa.id)}`);
      avisar('Código copiado!');
    } catch {
      avisar('Não consegui copiar.', { erro: true });
    }
  }

  return (
    <Pagina>
      <Cabecalho>
        <div>
          <Eyebrow>Reserva · Confirmada</Eyebrow>
          <h1>Bem-vindo(a), <em>{primeiroNome(pessoa.nome)}.</em></h1>
        </div>
        <Acoes className="nao-imprimir">
          <Botao type="button" onClick={() => window.print()}>Imprimir comprovante</Botao>
          <Botao
            type="button"
            $variante="escuro"
            onClick={() => baixarConvite({
              titulo: evento.nome,
              data: evento.data,
              horario: evento.horario,
              local: evento.local || '',
              descricao: `Sua mesa: ${nomeMesa}. Reserva ${numeroReserva(code)}-${numeroPessoa(pessoa.id)}.`,
            })}
          >
            Adicionar ao calendário
          </Botao>
        </Acoes>
      </Cabecalho>

      <Leque>
        <Recibo
          eyebrow="Comprovante"
          titulo="Sua reserva"
          numero={`№ ${numero}`}
          colunas={[
            { rotulo: 'Data', valor: dataCurta(evento.data), detalhe: `${diaDaSemana(evento.data)} · ${evento.horario}` },
            { rotulo: 'Mesa', valor: mesa ? mesa.number : '—', detalhe: mesa ? `${mesa.seats} lugares` : 'o organizador escolhe' },
          ]}
          linhas={[
            ['Evento', evento.nome],
            ['Convidado', pessoa.nome],
            ['Contato', pessoa.email || pessoa.telefone || '—'],
          ]}
          total={{ rotulo: 'Seu lugar', valor: nomeMesa }}
          rodape="Confirmado · Mesa Posta"
        />
        <CartaoTerracota
          eyebrow="Cartão de boas-vindas"
          chamada="Um recado da festa,"
          titulo={`${primeiroNome(pessoa.nome)}.`}
          texto="Que bom que você vem! Guarde este comprovante e, se quiser, adicione a festa ao seu calendário para não esquecer."
          rotuloPe="Evento"
          valorPe={evento.nome}
        />
      </Leque>

      <LinhaDeCartoes>
        <CartaoInfo
          icone={<IconeRelogio />} rotulo="Chegada" numero="01" cor="hsl(15, 74%, 41%)"
          titulo={`A partir das ${evento.horario}`}
          sub={dataLonga(evento.data)}
        >
          <p>Chegue com uns minutos de folga. Na entrada, é só dizer o seu nome.</p>
        </CartaoInfo>

        <CartaoInfo
          icone={<IconeMesa />} rotulo="Sua mesa" numero="02" cor="hsl(230, 49%, 56%)"
          titulo={nomeMesa}
          sub={mesa ? `${mesa.pessoas.length} de ${mesa.seats} lugares ocupados` : 'O organizador vai te colocar numa mesa'}
        >
          <LinhaDado><span>Convidado</span><span>{pessoa.nome}</span></LinhaDado>
          <LinhaDado>
            <span>Código</span>
            <div>{numeroReserva(code)}-{numeroPessoa(pessoa.id)} <Pilula type="button" onClick={copiarCodigo} className="nao-imprimir">Copiar</Pilula></div>
          </LinhaDado>
        </CartaoInfo>

        <CartaoInfo
          icone={<IconeLocal />} rotulo="Local" numero="03" cor="hsl(340, 48%, 52%)"
          titulo={evento.local || 'A confirmar'}
          sub={evento.nome}
        >
          <p>Qualquer mudança de local ou horário aparece aqui. Vale abrir o comprovante de novo perto da data.</p>
        </CartaoInfo>
      </LinhaDeCartoes>
    </Pagina>
  );
}
