## Usuario e Senha 
- Para logar no aplicativo deve usar os usuarios admin e admin123 que são injetados por variaveis e ambiente pela vercel.

## 📦 Entregáveis

- Link do **repositório público**
- Link para acessar **deploy na Vercel**  https://restaurant-manager-ten.vercel.app/
- **README** com:
  - Passos de setup e execução
  - Credenciais de exemplo (login)
  - Decisões técnicas
  - (Opcional) próximos passos/limitações

---

## 🧭 Escopo mínimo (MVP)

- [x] Login local (usuário/senha fixos)  
- [x] Rota protegida com dashboard "Usado middleware"  
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


