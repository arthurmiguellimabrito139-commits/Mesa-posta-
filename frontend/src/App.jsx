// Mapa de telas do app
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { CriarEvento } from './pages/CriarEvento.jsx';
import { PainelOrganizador } from './pages/PainelOrganizador.jsx';
import { PaginaConvidado } from './pages/PaginaConvidado.jsx';
import { Confirmacao } from './pages/Confirmacao.jsx';
import { NaoEncontrado } from './pages/NaoEncontrado.jsx';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* organizador cria a festa */}
        <Route path="/" element={<CriarEvento />} />
        {/* organizador gerencia mesas e convidados (precisa do adminToken) */}
        <Route path="/e/:code/admin" element={<PainelOrganizador />} />
        {/* link que o organizador manda para os convidados */}
        <Route path="/e/:code" element={<PaginaConvidado />} />
        {/* comprovante da reserva (a tela do template) */}
        <Route path="/e/:code/reserva/:pessoaId" element={<Confirmacao />} />
        <Route path="*" element={<NaoEncontrado />} />
      </Route>
    </Routes>
  );
}
