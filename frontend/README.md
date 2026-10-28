# Mesa Posta — Front-end

React + Vite + styled-components, no visual do template (sidebar, recibo, cartão terracota, cards numerados).

## Rodando

O back-end precisa estar rodando na porta 3333.

```powershell
cd frontend
npm install
npm run dev
```

Abra http://localhost:5173

O `vite.config.js` repassa tudo que começa com `/api` para `http://localhost:3333`, então o front não precisa saber o endereço do back-end.

## Telas

| Rota | Quem usa | O que faz |
|---|---|---|
| `/entrar` e `/cadastro` | organizador | login e criação de conta |
| `/` | organizador (logado) | cria o evento (nome, data, horário, local, mesas, cadeiras) |
| `/e/:code/admin` | dono do evento (logado) | salão, convidados, colocar/mover/remover, distribuir, adicionar/remover mesa, editar/apagar evento |
| `/e/:code` | convidado | escolhe a mesa e confirma o nome |
| `/e/:code/reserva/:pessoaId` | convidado | comprovante (a tela do template), imprimir, adicionar ao calendário |

## Pastas

```
src/
  main.jsx            ThemeProvider, Router, avisos
  App.jsx             rotas
  styles/             theme.js (cores e fontes do style-guide) e GlobalStyle.js
  services/
    api.js            todas as chamadas ao back-end (manda o JWT no header Authorization)
    sessao.js         token e usuário logado (localStorage)
    storage.js        reservas feitas como convidado (localStorage)
  hooks/
    useEvento.js      carrega o evento e atualiza depois de cada ação
    useMeusEventos.js lista da sidebar
    useAuth.jsx       contexto de login: usuario, entrar, cadastrar, sair
  components/         Layout (sidebar), Salao (mesas e cadeiras), Leque (recibo + cartão), CartaoInfo, ui.js...
  pages/              CriarEvento, PainelOrganizador, PaginaConvidado, Confirmacao, NaoEncontrado
  utils/              datas em pt-BR e o arquivo .ics do calendário
```

## Como funciona o login

1. Em `/entrar` ou `/cadastro`, o back-end devolve `{ token, usuario }`.
2. O `sessao.js` guarda isso no navegador, e o `useAuth` deixa o usuário disponível para todo o app.
3. O `api.js` manda `Authorization: Bearer <token>` em toda chamada.
4. As telas do organizador ficam dentro de `<RotaProtegida>`: sem login, a pessoa vai para `/entrar` e, depois de entrar, volta para onde estava.
5. Se a API responder 401 (token vencido), a sessão é apagada e o app pede login de novo.

Convidados não precisam de conta: a página do convite e o comprovante continuam públicos.
