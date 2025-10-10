# Portas e URLs no ambiente de desenvolvimento

Este projeto usa as portas abaixo no ambiente de desenvolvimento:

- Frontend (Vite): http://localhost:5173
- Backend (Express API + WS): http://localhost:3001
- Vite Preview (build estático): http://localhost:4173
- Legacy (compat): http://localhost:8080 → redireciona para 5173 com 307 preservando path e query

Observações:
- Use 5173 como URL padrão durante o desenvolvimento (ex.: http://localhost:5173/editor).
- Um redirecionador leve roda em 8080 durante `npm run dev`/`Executar servidor de desenvolvimento` para manter links antigos funcionando.
- Em CI e nos testes e2e, prefira parametrizar a URL base via variável de ambiente `E2E_BASE_URL` (padrão: http://localhost:5173).

Dicas:
- Proxy /api no Vite aponta para 3001; não é necessário referenciar a porta 3001 no frontend.
- Para preview do build local: `npm run build && npm run preview` (porta 4173).
