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
| `/` | organizador | cria o evento (nome, data, horário, local, mesas, cadeiras) |
| `/e/:code/admin` | organizador | salão, convidados, colocar/mover/remover, distribuir, adicionar/remover mesa, editar/apagar evento |
| `/e/:code` | convidado | escolhe a mesa e confirma o nome |
| `/e/:code/reserva/:pessoaId` | convidado | comprovante (a tela do template), imprimir, adicionar ao calendário |

## Pastas

```
src/
  main.jsx            ThemeProvider, Router, avisos
  App.jsx             rotas
  styles/             theme.js (cores e fontes do style-guide) e GlobalStyle.js
  services/
    api.js            todas as chamadas ao back-end (manda o x-admin-token)
    storage.js        eventos e reservas guardados no navegador (localStorage)
  hooks/
    useEvento.js      carrega o evento e atualiza depois de cada ação
    useMeusEventos.js lista da sidebar
  components/         Layout (sidebar), Salao (mesas e cadeiras), Leque (recibo + cartão), CartaoInfo, ui.js...
  pages/              CriarEvento, PainelOrganizador, PaginaConvidado, Confirmacao, NaoEncontrado
  utils/              datas em pt-BR e o arquivo .ics do calendário
```

## Como funciona o organizador

Ao criar o evento, o back-end devolve o `adminToken`. O front guarda esse token no `localStorage` e manda no header `x-admin-token` em toda ação de organizador.

Para gerenciar de outro aparelho: **Editar → Link de organizador**. O token vai depois do `#` no link, e essa parte nunca é enviada ao servidor.
