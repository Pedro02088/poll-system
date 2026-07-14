# Sistema de Enquetes (Poll System)

Aplicação web completa de enquetes (polls) com front-end e back-end separados.
Usuários podem se cadastrar, criar enquetes com múltiplas opções, votar e
acompanhar os resultados **atualizando em tempo real**, sem recarregar a página.

Desenvolvido como desafio técnico, com foco em organização de código, separação
de responsabilidades e boas práticas.

---

## Tecnologias

**Back-end**
- Laravel 12 (PHP 8.2+)
- MySQL
- Autenticação via Sessions
- API REST
- Server-Sent Events (SSE) para tempo real

**Front-end**
- React 19 + Vite
- React Router
- Axios
- Tailwind CSS
- Chart.js (gráfico de resultado)

---

## Funcionalidades

### Obrigatórias
- Cadastro, login e logout de usuários
- Proteção de rotas (só autenticados criam enquetes e votam)
- Criar enquete (título, descrição opcional, 2 a 8 opções, expiração opcional)
- Listar, visualizar, editar e excluir enquetes (editar/excluir só pelo criador)
- Votação com **um voto por usuário por enquete**
- Resultados em **tempo real** via SSE (atualizam sozinhos em todas as telas)

### Diferenciais implementados
- Barras de resultado animadas + gráfico de rosca (Chart.js), com destaque para a opção líder
- Busca de enquetes e ordenação por mais votadas
- Rate limiting nos votos
- Validação forte de e-mail (formato + DNS)
- Compartilhamento de enquete por link
- Histórico de votos do usuário
- Recuperação de senha por e-mail (token com expiração, fluxo nativo do Laravel)
- Notificações por e-mail (confirmação de voto ao votante + aviso ao dono da enquete), enviadas via fila

---

## Estrutura do projeto

```
poll-system/
├── backend/         API em Laravel 12
├── frontend/        Interface em React + Vite
├── .env.example     Modelo das variáveis de ambiente
├── .gitignore
└── README.md
```

---

## Pré-requisitos

- PHP 8.2 ou superior
- Composer
- Node.js 18+
- MySQL 8+

---

## Como instalar e executar

### 1. Clonar o repositório
```bash
git clone https://github.com/Pedro02088/poll-system.git
cd poll-system
```

### 2. Back-end
```bash
cd backend
composer install
cp .env.example .env          # ajuste as credenciais do banco
php artisan key:generate
php artisan migrate
php artisan serve
```
O back-end sobe em `http://127.0.0.1:8000`.

Crie o banco antes de migrar:
```sql
CREATE DATABASE enquetes;
```

Para as notificações por e-mail (voto confirmado, aviso ao dono e recuperação de
senha) funcionarem, configure um provedor SMTP de teste — recomendamos o
[Mailtrap](https://mailtrap.io) (sandbox gratuito). Preencha as variáveis
`MAIL_*` no `backend/.env` com as credenciais da sua caixa sandbox.

As notificações de voto são **enfileiradas** (não bloqueiam a resposta do
voto). Rode o worker em um terceiro terminal, junto com os dois servidores:
```bash
cd backend
php artisan queue:work
```
Sem o worker rodando, os votos continuam funcionando normalmente — só os
e-mails ficam pendentes na tabela `jobs` até o worker processá-los.

### 3. Front-end
```bash
cd frontend
npm install
cp .env.example .env          # ajuste a URL da API se necessário
npm run dev
```
O front-end sobe em `http://localhost:5173`.

> Rode os dois servidores ao mesmo tempo, em terminais separados.

---

## Variáveis de ambiente

**backend/.env** (principais)
```
DB_DATABASE=enquetes
DB_USERNAME=root
DB_PASSWORD=sua_senha
SESSION_DRIVER=database
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:5173
FRONTEND_URL=http://localhost:5173

QUEUE_CONNECTION=database

MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=seu_usuario_mailtrap
MAIL_PASSWORD=sua_senha_mailtrap
MAIL_FROM_ADDRESS="nao-responda@enlace.com"
MAIL_FROM_NAME="Enlace"
```

**frontend/.env**
```
VITE_API_URL=http://localhost:8000/api
```

---

## API (principais rotas)

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/api/register` | Cadastro | Não |
| POST | `/api/login` | Login | Não |
| POST | `/api/logout` | Logout | Sim |
| POST | `/api/forgot-password` | Envia link de recuperação por e-mail | Não |
| POST | `/api/reset-password` | Redefine a senha (com token do e-mail) | Não |
| GET | `/api/me` | Usuário logado | Sim |
| GET | `/api/polls` | Lista enquetes | Não |
| POST | `/api/polls` | Cria enquete | Sim |
| GET | `/api/polls/{id}` | Detalhe da enquete | Não |
| PUT | `/api/polls/{id}` | Edita (só dono) | Sim |
| DELETE | `/api/polls/{id}` | Exclui (só dono) | Sim |
| POST | `/api/polls/{id}/vote` | Vota | Sim |
| GET | `/api/polls/{id}/stream` | Resultados em tempo real (SSE) | Sim |
| GET | `/api/my-votes` | Histórico de votos | Sim |

Uma collection do Postman com todas as rotas está em `/docs/poll-system.postman_collection.json`.

---

## Banco de dados

Cinco tabelas principais:

- **users** — usuários (nome, e-mail único, senha com hash)
- **polls** — enquetes (pertencem a um usuário)
- **options** — opções de resposta (pertencem a uma enquete, 2 a 8)
- **votes** — votos (usuário + enquete + opção, com restrição única em user_id+poll_id)
- **sessions** — sessões de autenticação (gerenciada pelo Laravel)

Todas as chaves estrangeiras usam `ON DELETE CASCADE`. O diagrama está em
`/docs/diagrama-banco.png`.

---

## Decisões técnicas

- **Laravel 12 em modo enxuto:** sem starter kits (Breeze/Jetstream), apenas o
  necessário. O front-end React separado consome a API, então telas Blade não
  fazem sentido aqui.
- **Sessions em vez de JWT:** para uma aplicação web com front e back no mesmo
  domínio de desenvolvimento, sessions são mais simples e seguras por padrão
  (cookie HttpOnly, criptografado pelo Laravel), sem gerenciamento manual de token.
- **SSE em vez de WebSocket:** o tempo real aqui é unidirecional
  (servidor -> cliente). SSE é nativo do navegador (EventSource), simples de
  servir com PHP e suficiente para o escopo, evitando a complexidade de um
  servidor WebSocket dedicado.
- **Camadas separadas:** Controllers magros, validação em Form Requests,
  autorização em Policies, regra de voto único garantida também no banco
  (unique composta).
- **Sem Repositories:** o Eloquent já é uma boa camada de acesso a dados;
  adicionar Repository neste escopo seria over-engineering.

---

## Segurança

- Senhas com hash (bcrypt)
- Proteção contra SQL Injection (Eloquent / prepared statements)
- Proteção contra XSS (escape automático do React) e CSRF (Laravel)
- Rate limiting nos votos
- Validação forte de e-mail (formato + verificação de DNS)
- Autorização por Policy (só o criador edita/exclui)

---

## Possíveis melhorias

- Enquetes anônimas
- Paginação na listagem
- Testes automatizados (PHPUnit / Vitest)
- Deploy (Railway/Render + Vercel)

---

## Screenshots

> _(espaço reservado — adicionar prints das telas de login, lista, criação e
> resultados em tempo real)_
