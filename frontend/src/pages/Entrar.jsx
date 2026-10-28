// Páginas de login (/entrar) e cadastro (/cadastro): o mesmo componente, dois modos
import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAviso } from '../components/Aviso.jsx';
import { CartaoTerracota } from '../components/Leque.jsx';
import {
  Botao, Cabecalho, Campo, Cartao, Entrada, Eyebrow, Formulario, MensagemErro, Meta, Pagina,
} from '../components/ui.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { primeiroNome } from '../utils/format.js';

const Colunas = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 26rem) minmax(0, 24rem);
  gap: 2.5rem;
  align-items: start;

  & > article { transform: rotate(2deg); }

  @media (max-width: 1000px) {
    grid-template-columns: minmax(0, 30rem);
    & > article { display: none; }
  }
`;

const Rodape = styled.p`
  margin-top: 1.1rem;
  padding-top: 1rem;
  border-top: 1px dashed ${({ theme }) => theme.cores.n400};
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.cores.n600};

  a { color: ${({ theme }) => theme.cores.terracota600}; font-weight: 500; }
`;

const OlhoSenha = styled.div`
  position: relative;
  input { padding-right: 4.5rem; }
  button {
    position: absolute;
    right: 0.4rem;
    top: 50%;
    transform: translateY(-50%);
    border: 0;
    background: none;
    cursor: pointer;
    font: 500 0.625rem ${({ theme }) => theme.fontes.mono};
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.cores.n600};
    padding: 0.4rem;
  }
`;

export function Entrar({ modo = 'entrar' }) {
  const cadastro = modo === 'cadastro';
  const { usuario, entrar, cadastrar } = useAuth();
  const [busca] = useSearchParams();
  const navegar = useNavigate();
  const avisar = useAviso();

  // depois de entrar, volta para onde a pessoa queria ir (ex.: o painel de um evento)
  const voltar = busca.get('voltar') || '/';

  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to={voltar} replace />;

  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    if (cadastro && !form.nome.trim()) return setErro('Informe o seu nome.');
    if (!form.email.trim()) return setErro('Informe o e-mail.');
    if (form.senha.length < (cadastro ? 6 : 1)) {
      return setErro(cadastro ? 'A senha precisa ter pelo menos 6 caracteres.' : 'Informe a senha.');
    }

    setErro('');
    setEnviando(true);
    try {
      const u = cadastro
        ? await cadastrar(form.nome.trim(), form.email.trim(), form.senha)
        : await entrar(form.email.trim(), form.senha);
      avisar(cadastro ? `Conta criada! Bem-vindo(a), ${primeiroNome(u.nome)}.` : `Olá de novo, ${primeiroNome(u.nome)}!`);
      navegar(voltar, { replace: true });
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setEnviando(false);
    }
  }

  const linkTroca = `${cadastro ? '/entrar' : '/cadastro'}${busca.get('voltar') ? `?voltar=${encodeURIComponent(voltar)}` : ''}`;

  return (
    <Pagina>
      <Cabecalho>
        <div>
          <Eyebrow>{cadastro ? 'Organizador · Nova conta' : 'Organizador · Entrar'}</Eyebrow>
          <h1>{cadastro ? <>Crie sua <em>conta.</em></> : <>Bem-vindo(a) de <em>volta.</em></>}</h1>
          <Meta>
            {cadastro
              ? 'Com uma conta, seus eventos ficam salvos e você gerencia de qualquer aparelho.'
              : 'Entre para criar eventos e gerenciar as mesas dos seus convidados.'}
          </Meta>
        </div>
      </Cabecalho>

      <Colunas>
        <Cartao>
          <Formulario onSubmit={enviar} noValidate>
            {cadastro && (
              <Campo>
                <label htmlFor="nome">Seu nome</label>
                <Entrada id="nome" autoComplete="name" maxLength={80} value={form.nome} onChange={mudar('nome')} />
              </Campo>
            )}
            <Campo>
              <label htmlFor="email">E-mail</label>
              <Entrada id="email" type="email" autoComplete="email" maxLength={120} value={form.email} onChange={mudar('email')} />
            </Campo>
            <Campo>
              <label htmlFor="senha">Senha</label>
              <OlhoSenha>
                <Entrada
                  id="senha"
                  type={verSenha ? 'text' : 'password'}
                  autoComplete={cadastro ? 'new-password' : 'current-password'}
                  value={form.senha}
                  onChange={mudar('senha')}
                />
                <button type="button" onClick={() => setVerSenha(!verSenha)} aria-label={verSenha ? 'Esconder senha' : 'Mostrar senha'}>
                  {verSenha ? 'Esconder' : 'Mostrar'}
                </button>
              </OlhoSenha>
            </Campo>

            {erro && <MensagemErro role="alert">{erro}</MensagemErro>}

            <Botao type="submit" $variante="escuro" disabled={enviando}>
              {enviando ? 'Aguarde…' : cadastro ? 'Criar conta' : 'Entrar'}
            </Botao>
          </Formulario>

          <Rodape>
            {cadastro ? 'Já tem conta? ' : 'Ainda não tem conta? '}
            <Link to={linkTroca}>{cadastro ? 'Entrar' : 'Criar conta'}</Link>
          </Rodape>
        </Cartao>

        <CartaoTerracota
          eyebrow="Mesa Posta"
          chamada="Organize sua festa,"
          titulo="mesa por mesa."
          texto="Monte o salão, compartilhe o link e deixe cada convidado escolher o lugar. Convidados não precisam de conta."
          rotuloPe="Para convidados"
          valorPe="Sem cadastro, só o link"
        />
      </Colunas>
    </Pagina>
  );
}
