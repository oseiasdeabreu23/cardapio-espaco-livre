# Cardápio Digital — Churrascaria Espaço Livre

Cardápio mobile-first em **Next.js 14 (App Router) + TypeScript + Tailwind + Supabase**, acessado por QR Code na mesa.

- **Versão atual:** `1.0.0` (definida em `lib/version.ts`)
- Backend Supabase (auth + Postgres + RLS)
- Admin com permissões granulares, backup/restore e gestão de usuários
- Sistema de **licença obrigatória** com verificação horária no painel externo

---

## ⚠️ O que precisa ser feito ao voltar

### 1. Adicionar variáveis de ambiente

Edite `.env.local` e adicione:

```env
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
CRON_SECRET=alguma-string-aleatoria-longa-de-32-chars
```

- **`SUPABASE_SERVICE_ROLE_KEY`**: pegue em Supabase → Project Settings → API → `service_role` (não confunda com `anon`).
- **`CRON_SECRET`**: gere uma string aleatória (ex: `openssl rand -hex 32`). Será usada pelo Vercel Cron pra autenticar.

Sem essas vars o endpoint `/api/license/refresh` retorna 500. O resto do programa funciona normal.

Depois de deployar na Vercel, replicar ambas as vars em **Project Settings → Environment Variables**.

### 2. Ativar a licença pela primeira vez

1. `npm run dev`
2. Faça login no admin como **owner**
3. Clique no link **Licença** no header (só aparece pro dono)
4. Preencha: CPF/CNPJ + chave de API + clique em "Ativar licença"
5. O programa chama o painel em `https://painel-licencas-rho.vercel.app/api/licenses/validate`
6. Se voltar `valido: true`, libera tudo. Se não, mostra o motivo.

### 3. Testar bloqueio

Antes de ativar a licença, qualquer URL (cardápio público, admin, etc.) é redirecionada pra `/license-blocked`. Apenas estas rotas continuam acessíveis:

- `/license-blocked` — tela de bloqueio
- `/admin/login` — formulário de login
- `/admin/license` — gestão de licença (só owner)
- `/api/license/*` — endpoint do cron

---

## Como rodar localmente

Requer Node.js 18.17+.

```bash
npm install
npm run dev
```

Abra http://localhost:3000 (layout otimizado para 480px — use DevTools mobile).

Scripts:

```bash
npm run build      # build de produção
npm start          # serve a build
npm run type-check # tsc --noEmit
npm run lint       # next lint
```

---

## Funcionalidades atuais

### Cardápio público (`/`)
- Hero com banner do restaurante e chip "Aberto/Fechado"
- Busca + categorias com chips sticky
- Items com foto, preço, descrição expansível ("ver mais")
- Tipos de preço: único, P/G (pizza), 1kg/500g/300g (churrasco)

### Admin (`/admin`)
- Login com email/senha (Supabase Auth)
- Toggle aberto/fechado + mensagem customizada
- CRUD de categorias e itens
- Upload de imagens pro Supabase Storage
- Backup/restore (só owner)
- Gestão de usuários com permissões granulares

### Permissões disponíveis (`lib/supabase/types.ts`)
- `manage_users`
- `create_categories` / `delete_categories`
- `edit_item_text` / `edit_item_prices`
- `upload_images`
- `toggle_open_status` / `edit_closed_message`

O **owner** (definido na tabela `profiles` com `is_owner = true`) tem acesso a tudo e é o único que pode gerir backup e licença.

### Sistema de licença (NOVO em v1.0.0)
- Tabela `license` (singleton, RLS só pro owner) + view `license_public` (leitura anon, sem expor `api_key`)
- Tipos: CPF (`pessoa_fisica`) ou CNPJ (`empresa`)
- Verificação horária via **Vercel Cron** (`vercel.json`) chamando `/api/license/refresh`
- Bloqueio total se `valido !== true` ou `status !== 'ativo'`
- Sem tolerância — qualquer falha (rede, 401, status diferente) já bloqueia
- Botão "Verificar agora" em `/admin/license` força revalidação manual

**Status possíveis retornados pelo painel:**

| `status` | Comportamento |
|---|---|
| `ativo` | Libera tudo |
| `vencido` / `pendente` / `suspenso` / `bloqueado` / `cancelado` | Bloqueia |
| `nao_encontrado` | Bloqueia ("documento não cadastrado") |
| `limite_excedido` | Bloqueia ("limite de máquinas atingido") |

---

## Estrutura do projeto

```
app/
  layout.tsx                   # html, fonte, viewport
  page.tsx                     # cardápio público
  license-blocked/             # tela quando licença inválida
  admin/
    layout.tsx                 # header com v1.0.0 + links
    page.tsx                   # dashboard
    login/                     # /admin/login
    license/                   # /admin/license (só owner)
    backup/                    # /admin/backup (só owner)
    users/                     # /admin/users
    category/                  # editar categoria
    _components/               # forms e listas
    _actions/                  # server actions
      auth.ts
      backup.ts
      categories.ts
      items.ts
      license.ts               # ativar/revalidar
      settings.ts
      upload.ts
      users.ts
  api/
    license/refresh/           # endpoint do Vercel Cron
components/                    # componentes do cardápio público
lib/
  version.ts                   # APP_VERSION = '1.0.0'
  menu.ts / menu-data.ts       # dados do cardápio
  permissions.ts               # helpers de permissão
  license/
    types.ts                   # tipos + URL do painel chumbada
    panel-client.ts            # HTTP client pro painel
    repo.ts                    # leitura/escrita Supabase
    check.ts                   # orquestrador (call painel + grava)
    guard.ts                   # decisão liberado/bloqueado
    format.ts                  # CPF/CNPJ + máscaras + labels
  supabase/
    client.ts                  # browser client
    server.ts                  # server client (sessão)
    admin.ts                   # service-role client (cron)
    middleware.ts              # gate de auth + licença
    types.ts                   # tipos compartilhados
middleware.ts                  # entry point do middleware
vercel.json                    # Vercel Cron horário
```

---

## Banco de dados (Supabase)

Projeto: `wxhqhyavwgjcqiolokzp`

**Tabelas:**
- `categories` — categorias do cardápio
- `items` — itens
- `settings` — chave/valor (is_open, closed_message)
- `profiles` — perfis admin (owner + permissions)
- `license` — singleton, RLS owner-only

**Views:**
- `license_public` — leitura pública só com campos seguros (sem `api_key`)

**Funções RPC:**
- `create_admin_user`, `update_admin_permissions`, `delete_admin_user`, `set_admin_password`

---

## Deploy na Vercel

1. `git push` para o GitHub
2. Importe o repo em https://vercel.com/new
3. **Adicione as 4 envs:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` ← novo
   - `CRON_SECRET` ← novo
4. Deploy

O `vercel.json` já configura o cron horário automaticamente.

---

## Como gerar o QR Code

Após o deploy, pegue a URL final (ex: `https://espaco-livre.vercel.app`):

```bash
npx qrcode "https://espaco-livre.vercel.app" -o mesa.png -w 1024
```

Ou online: https://qrcode-monkey.com/ (alta resolução, acabamento fosco, ≥4×4 cm).

> Se mudar o domínio depois, **regenere o QR** — os antigos param de funcionar.

---

## Histórico de versões

### v1.0.0 (atual)
- Sistema de licença CPF/CNPJ com verificação horária via Vercel Cron
- Painel externo: `https://painel-licencas-rho.vercel.app`
- Bloqueio total quando licença não ativa (público + admin)
- Versão exibida no header do admin e na tela de licença
- Migrations: `create_license_table`, `create_license_public_view`
- Truncamento de descrição com "ver mais" / "ver menos"
- Backup/restore + gestão granular de usuários
