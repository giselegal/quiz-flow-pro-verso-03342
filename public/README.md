# 📁 Public Directory

Este diretório contém arquivos estáticos servidos diretamente pelo Vite.

## ⚠️ Importante

- **NÃO** coloque `index.html` aqui - Vite usa `/index.html` na raiz do projeto
- Arquivos aqui são copiados para `/dist` durante o build
- Acesse via URL absoluta: `/arquivo.ext`

## 📂 Estrutura

```
public/
├── templates/           # Templates JSON (quiz21-complete.json)
├── supabase-fallback-system.js
└── require-shim.js
```

## 🚫 Arquivos Removidos

- ~~`public/index.html`~~ → Use `/index.html` (raiz) ✅
