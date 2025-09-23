## Usuario e Senha
- Para logar no aplicativo deve usar os usuarios **admin** e **admin123** que são injetados por variaveis e ambiente pela vercel.


**UX/UI**
- Layout responsivo
- Feedbacks de ação (toasts/estados de loading, confirmação ao deletar)
- Validação amigável de formulário

**Deploy**
- Publicar na **Vercel**
- Incluir URL pública no README **https://restaurant-manager-ten.vercel.app/**

---

## 🧭 Escopo mínimo (MVP)

- [x] Login local (usuário/senha fixos)  
- [x] Rota protegida com dashboard  
- [x] Listagem + criação + edição + exclusão  
- [x] Persistência via `localStorage`  
- [x] Busca/filtração e ordenação  
- [x] UI com shadcn/ui  
- [x] Deploy na Vercel  

---

## 🧱 Regras & Restrições

- ✅ Pode usar libs leves (ex.: Zod para validação, Zustand/Context para estado)
- ✅ Pode colocar usuário/senha em `.env` (ex.: `NEXT_PUBLIC_APP_USER`, `NEXT_PUBLIC_APP_PASS`) ou hardcoded (documente no README)

---

## ▶️ Como rodar localmente

1) **Clonar & instalar**
```bash
git clone <seu-repo>.git
cd <seu-repo>
npm i
npm run dev