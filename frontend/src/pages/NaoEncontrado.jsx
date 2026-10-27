import { Link } from 'react-router-dom';
import { Botao, Cabecalho, Eyebrow, Meta, Pagina } from '../components/ui.js';

export function NaoEncontrado({ titulo = 'Essa página', texto = 'O endereço pode estar errado, ou o evento foi apagado.' }) {
  return (
    <Pagina>
      <Cabecalho>
        <div>
          <Eyebrow>Erro · 404</Eyebrow>
          <h1>{titulo} <em>sumiu.</em></h1>
          <Meta>{texto}</Meta>
        </div>
      </Cabecalho>
      <div>
        <Botao as={Link} to="/" $variante="escuro">Criar um evento</Botao>
      </div>
    </Pagina>
  );
}
