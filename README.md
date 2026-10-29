# 🪑 Mesa Posta

Aplicação web para organizar **mesas e lugares de festas e eventos**. O organizador cria uma conta, monta o salão (quantas mesas e quantas cadeiras por mesa) e compartilha um link. Cada convidado abre o link, escolhe onde vai sentar e recebe um comprovante. O organizador acompanha tudo num painel: coloca, move e remove convidados, ou distribui automaticamente quem ainda está sem mesa.

![Painel do organizador](docs/painel-organizador.png)

## ✨ Funcionalidades

**Organizador**
- Cadastro e login com e-mail e senha (JWT)
- Lista dos seus eventos, acessível de qualquer aparelho
- Cria o evento com nome, data, horário, local, número de mesas e cadeiras por mesa
- Vê o salão com as cadeiras ocupadas de cada mesa
- Adiciona convidados direto numa mesa ou na lista "sem mesa"
- Move e remove convidados
- Distribui automaticamente quem está sem mesa, sempre na mesa com mais lugares livres
- Adiciona e remove mesas (quem estava na mesa removida volta para "sem mesa")
- Edita e apaga o evento

**Convidado** (não precisa de conta)
- Abre o link do evento, escolhe uma mesa com lugar livre e confirma o nome
- Recebe um comprovante com o número da reserva
- Pode imprimir o comprovante e adicionar a festa ao calendário (arquivo `.ics`)

| Página do convidado | Comprovante |
|---|---|
| ![Página do convidado](docs/pagina-convidado.png) | ![Comprovante](docs/comprovante.png) |

## 🛠️ Tecnologias

| Camada | Tecnologias |
|---|---|
| Front-end | React 18, Vite, React Router, styled-components |
| Back-end | Node.js, Express 5, `jsonwebtoken`, `bcryptjs` |
| Banco de dados | MySQL, com SQL puro via `mysql2` (sem ORM) |

## 🏗️ Arquitetura

O back-end segue o padrão **MVC com camada de repository**:

```
requisição → routes → middlewares → controller → models (regras) → repository (SQL) → MySQL
```

| Camada | Responsabilidade |
|---|---|
| `models/` | Classes `Usuario`, `Evento`, `Mesa` e `Pessoa`, com as regras do domínio: criar mesas, checar lotação, esconder contatos |
| `repositories/` | Todo o SQL: salva e carrega os objetos do banco |
| `controllers/` | Recebem a requisição, usam models e repositories e respondem em JSON |
| `middlewares/` | `autenticar` (valida o JWT), `autenticarOpcional` (rotas públicas) e `somenteOrganizador` (confere o dono do evento) |
| `routes/` | Ligam cada URL ao middleware e ao controller |

**Regras de negócio que valem destacar**
- Uma mesa nunca recebe mais pessoas do que tem cadeiras: a regra mora na classe `Mesa` (`addPessoa`), e todas as rotas passam por ela.
- Criar o evento com as mesas e a distribuição automática rodam em **transações**: ou salva tudo, ou nada.
- A distribuição coloca cada pessoa na mesa com mais lugares livres, espalhando os convidados pelo salão.

## 🔐 Segurança

- **Senhas** guardadas só como hash do `bcrypt` (com *salt*). A classe `Usuario` não carrega o hash, então ele nunca aparece numa resposta da API.
- **JWT** assinado com `HS256`, com validade, e verificado com o algoritmo fixado.
- **Permissão no servidor:** criar evento exige login, e toda ação de gerenciamento exige ser o **dono** do evento. O dono vem do token, nunca de um dado enviado pela tela.
- **Dados dos convidados:** e-mail e telefone só aparecem para o dono do evento. A página pública mostra apenas o salão e os nomes.
- **SQL injection:** todas as consultas usam parâmetros (`?`). Na edição do evento, os nomes de coluna vêm de uma lista fixa (*whitelist*).
- **Erros:** falhas inesperadas respondem uma mensagem genérica; o detalhe fica só no log do servidor.
- **Login sem pistas:** a mesma mensagem para e-mail ou senha errados, para não revelar quais e-mails têm conta.
- **Segredos** (senha do banco e `JWT_SECRET`) ficam no `.env`, fora do git. O servidor nem sobe sem um `JWT_SECRET` de pelo menos 32 caracteres.

## 🚀 Como rodar

**Pré-requisitos:** Node.js 18 ou superior e MySQL 8.

### 1. Clonar

```bash
git clone https://github.com/arthurmiguellimabrito139-commits/Mesa-posta-.git
cd Mesa-posta-
```

### 2. Banco de dados

No MySQL Workbench (File → Open SQL Script → ⚡), execute nesta ordem:

1. `backend/database/schema.sql`: cria o banco e as tabelas
2. `backend/database/migracao-usuarios.sql`: cria a tabela de usuários e liga cada evento ao seu dono

### 3. Back-end

```bash
cd backend
npm install
cp .env.example .env      # no Windows: copy .env.example .env
```

Preencha o `.env`:

```
PORT=3333
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mesa_posta
DB_USER=root
DB_PASS=sua_senha
JWT_SECRET=um_texto_grande_e_aleatorio
JWT_EXPIRES_IN=3d
```

Para gerar um `JWT_SECRET` seguro:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

```bash
npm run dev
```

A API sobe em `http://localhost:3333`. Para testar: `http://localhost:3333/api/health`.

### 4. Front-end

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Abra `http://localhost:5173`. Em desenvolvimento, o Vite repassa as chamadas de `/api` para o back-end na porta 3333.

## 📡 API

🔑 = precisa estar logado (`Authorization: Bearer <token>`) · 🔒 = precisa ser o dono do evento

**Conta** (`/api/auth`)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/cadastro` | `{ nome, email, senha }` → `{ token, usuario }` |
| `POST` | `/login` | `{ email, senha }` → `{ token, usuario }` |
| `GET` | `/eu` 🔑 | Dados do usuário logado |

**Eventos** (`/api/eventos`)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` 🔑 | Eventos do usuário logado |
| `POST` | `/` 🔑 | Cria o evento com as mesas → `{ id, code }` |
| `GET` | `/:code` | Evento com as mesas, as pessoas de cada mesa e a lista `semMesa`. Contatos só para o dono |
| `PATCH` | `/:code` 🔒 | Edita nome, data, horário ou local |
| `DELETE` | `/:code` 🔒 | Apaga o evento (mesas e pessoas vão junto) |
| `POST` | `/:code/mesas` 🔒 | Adiciona uma mesa: `{ cadeiras }` |
| `DELETE` | `/:code/mesas/:mesaId` 🔒 | Remove uma mesa; as pessoas dela ficam sem mesa |
| `POST` | `/:code/pessoas` | Reserva: `{ nome, email?, telefone?, mesaId? }` |
| `PATCH` | `/:code/pessoas/:pessoaId` 🔒 | Move a pessoa: `{ mesaId }` (`null` = sem mesa) |
| `DELETE` | `/:code/pessoas/:pessoaId` 🔒 | Remove a pessoa do evento |
| `POST` | `/:code/distribuir` 🔒 | Coloca automaticamente quem está sem mesa |

Erros sempre voltam como `{ "erro": "mensagem" }`:

| Status | Quando |
|---|---|
| `400` | Dado inválido |
| `401` | Não logado, ou token inválido/vencido |
| `403` | Logado, mas não é o dono do evento |
| `404` | Evento, mesa ou pessoa não encontrados |
| `409` | Mesa cheia, ou e-mail já cadastrado |
| `500` | Erro inesperado (mensagem genérica) |

## 🗄️ Banco de dados

```
usuarios (organizadores)
  └── events (a festa)
        └── event_tables (as mesas, com N cadeiras)
              └── pessoas (cada linha ocupa uma cadeira; mesa_id NULL = sem mesa)
```

- Apagar um **usuário** apaga os eventos dele, e apagar um **evento** apaga as mesas e as pessoas (`ON DELETE CASCADE`)
- Apagar uma **mesa** devolve as pessoas para "sem mesa" (`ON DELETE SET NULL`)
- O próprio banco valida: de 2 a 16 cadeiras por mesa (`CHECK`), e-mail único (`UNIQUE`) e número de mesa único por evento (`UNIQUE (event_id, number)`)

## 📁 Estrutura

```
Mesa-posta-/
├── backend/
│   ├── database/              schema.sql e migracao-usuarios.sql
│   └── src/
│       ├── server.js          confere o .env e o banco, depois sobe o servidor
│       ├── app.js             Express, middlewares e rotas
│       ├── config/db.js       pool de conexões do MySQL
│       ├── models/            Usuario, Evento, Mesa, Pessoa
│       ├── repositories/      SQL de usuários, eventos, mesas e pessoas
│       ├── controllers/       auth, evento, mesa, pessoa
│       ├── middlewares/       autenticar, somenteOrganizador
│       ├── routes/            authRoutes, eventoRoutes
│       └── utils/             erros.js
└── frontend/
    └── src/
        ├── pages/             Entrar (login e cadastro), CriarEvento, PainelOrganizador, PaginaConvidado, Confirmacao
        ├── components/        Layout, Salao, Leque, CartaoInfo, RotaProtegida...
        ├── services/          api.js, sessao.js (JWT) e storage.js
        ├── hooks/             useAuth, useEvento, useMeusEventos
        └── styles/            tema e estilos globais
```

## 🧭 Roadmap

- [x] CRUD de eventos, mesas e pessoas, com lotação e distribuição automática
- [x] Cadastro e login com JWT
- [x] Eventos ligados ao dono, com rotas de gerenciamento protegidas
- [x] Contatos dos convidados visíveis só para o organizador
- [x] Erros internos sem detalhes para o usuário
- [ ] Validação completa no servidor (quantidade de mesas e cadeiras, data, tamanho dos campos)
- [ ] Limite de tentativas no login (*rate limiting*)
- [ ] Código do evento mais longo, difícil de adivinhar
- [ ] CORS restrito ao front e headers de segurança (`helmet`)
- [ ] Travar a mesa na reserva (`SELECT ... FOR UPDATE`), para duas pessoas não pegarem o último lugar ao mesmo tempo
- [ ] Testes automatizados
- [ ] Deploy (front na Vercel, API no Render, MySQL na Aiven)

## 🎨 Créditos

Visual inspirado no desafio [Hotel booking confirmation page](https://www.frontendmentor.io) do Frontend Mentor.

## 👤 Autor

**Arthur Miguel Lima Brito**, estudante de Ciência da Computação na UFG.
