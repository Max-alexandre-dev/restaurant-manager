
# 🧪 Desafio Técnico Reeve — Restaurant Manager (Next.js + TypeScript + shadcn/ui)

Construa um mini sistema de **gerenciamento de restaurantes** com **autenticação local** (sem banco, sem backend externo). Após login, a pessoa usuária acessa um **dashboard** com CRUD de restaurantes. Todo o estado/persistência deve ser **local** (ex.: `localStorage`). O projeto deve usar **Next.js (App Router)**, **TypeScript** e **shadcn/ui`. O deploy deve ser feito na **Vercel**.

---

## 🔧 Requisitos

**Tecnologia**
- Next.js (App Router) + TypeScript
- Tailwind CSS
- shadcn/ui (ex.: Button, Input, Card, Table, Dialog/Sheet, Badge, Toast)
- Sem banco de dados e sem API externa (tudo local)

**Autenticação (local)**
- Tela de **login** (usuário e senha fixos via `.env` ou hardcoded)
- Ao autenticar, salvar um **token** simples (ex.: string) no `localStorage`
- **Proteção de rotas**: páginas internas só acessíveis autenticado
- Botão **Sair** (limpa token e redireciona pro login)

**Dashboard — Restaurantes**
- Listar restaurantes em **tabela**
- **Criar / Editar / Remover** (CRUD em memória, persistido no `localStorage`)
- **Buscar/Filtrar** por nome/cozinha/cidade
- **Ordenar** por nome e/ou avaliação
- Campos sugeridos:
  - `name` (string, obrigatório)
  - `cuisine` (string, obrigatório)
  - `city` (string, obrigatório)
  - `rating` (número 0–5, obrigatório)
  - `open` (boolean — aberto/fechado)
  - `createdAt` (ISO string — gerar automaticamente)

**UX/UI**
- Layout responsivo
- Feedbacks de ação (toasts/estados de loading, confirmação ao deletar)
- Validação amigável de formulário

**Deploy**
- Publicar na **Vercel**
- Incluir URL pública no README

---

## 📦 Entregáveis

- Link do **repositório público**
- Link do **deploy na Vercel**
- **README** com:
  - Passos de setup e execução
  - Credenciais de exemplo (login)
  - Decisões técnicas
  - (Opcional) próximos passos/limitações

---

## 🧭 Escopo mínimo (MVP)

- [ ] Login local (usuário/senha fixos)  
- [ ] Rota protegida com dashboard  
- [ ] Listagem + criação + edição + exclusão  
- [ ] Persistência via `localStorage`  
- [ ] Busca/filtração e ordenação  
- [ ] UI com shadcn/ui  
- [ ] Deploy na Vercel  

---

## 🧱 Regras & Restrições

- ❌ Não usar banco de dados, ORM ou APIs externas
- ❌ Não é necessário autenticação “real” (OAuth/JWT). Pode ser local.
- ✅ Pode usar libs leves (ex.: Zod para validação, Zustand/Context para estado)
- ✅ Pode colocar usuário/senha em `.env` (ex.: `NEXT_PUBLIC_APP_USER`, `NEXT_PUBLIC_APP_PASS`) ou hardcoded (documente no README)

---

## ▶️ Como rodar localmente

1) **Clonar & instalar**
```bash
git clone <seu-repo>.git
cd <seu-repo>
npm i