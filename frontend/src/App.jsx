// Mapa de telas do app
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { RotaProtegida } from './components/RotaProtegida.jsx';
import { CriarEvento } from './pages/CriarEvento.jsx';
import { Entrar } from './pages/Entrar.jsx';
import { PainelOrganizador } from './pages/PainelOrganizador.jsx';
import { PaginaConvidado } from './pages/PaginaConvidado.jsx';
import { Confirmacao } from './pages/Confirmacao.jsx';
import { NaoEncontrado } from './pages/NaoEncontrado.jsx';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* conta do organizador */}
        <Route path="/entrar" element={<Entrar modo="entrar" />} />
        <Route path="/cadastro" element={<Entrar modo="cadastro" />} />

        {/* organizador (precisa de login) */}
        <Route path="/" element={<RotaProtegida><CriarEvento /></RotaProtegida>} />
        <Route path="/e/:code/admin" element={<RotaProtegida><PainelOrganizador /></RotaProtegida>} />

        {/* convidado (sem login) */}
        <Route path="/e/:code" element={<PaginaConvidado />} />
        <Route path="/e/:code/reserva/:pessoaId" element={<Confirmacao />} />

        <Route path="*" element={<NaoEncontrado />} />
      </Route>
    </Routes>
  );
}
