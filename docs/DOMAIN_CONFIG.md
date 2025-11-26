# 🌐 CONFIGURAÇÃO DOMÍNIO CUSTOMIZADO

## 📋 Domínio: giselsegalvao.com.br/quizflowpro

---

## ✅ Configurações Aplicadas

### 1. vite.config.ts
```typescript
base: process.env.NODE_ENV === 'production' ? '/quizflowpro/' : '/'
```
- Todos assets apontarão para `/quizflowpro/assets/...`
- Funcionará no subpath do domínio

### 2. vercel.json
```json
"rewrites": [
  {
    "source": "/quizflowpro/api/:path*",
    "destination": "https://backend.railway.app/api/:path*"
  },
  {
    "source": "/quizflowpro/(.*)",
    "destination": "/quizflowpro/index.html"
  }
]
```
- APIs funcionarão em `/quizflowpro/api/*`
- SPA funcionará em `/quizflowpro/*`

### 3. Redirects Atualizados
Todos redirects legados agora incluem `/quizflowpro` prefix:
- `/quizflowpro/editor-pro` → `/quizflowpro/editor`
- `/quizflowpro/admin/dashboard` → `/quizflowpro/admin`

---

## 🚀 Deploy com Domínio Customizado

### PASSO 1: Deploy Vercel Normal
```bash
# Após railway deploy
./scripts/complete-vercel-deploy.sh
```

### PASSO 2: Configurar Domínio na Vercel

**Via Dashboard:**
1. Acesse: https://vercel.com/seu-projeto/settings/domains
2. Adicione: `giselsegalvao.com.br`
3. Vercel fornecerá CNAME/A record

**Configure no DNS:**
```
Tipo: CNAME
Nome: @ (ou www)
Valor: cname.vercel-dns.com
```

### PASSO 3: Configurar Subpath (Opcional)

Se quiser que o projeto fique APENAS em `/quizflowpro`:

1. Na Vercel, em Settings > General
2. Root Directory: `.` (deixar vazio)
3. Build Command: `npm run build`
4. Output Directory: `dist`

O `base` no Vite já está configurado para `/quizflowpro/`.

---

## 🔧 Configurações Necessárias

### Supabase Auth URLs
```
Site URL: https://giselsegalvao.com.br/quizflowpro
Redirect URLs:
- https://giselsegalvao.com.br/quizflowpro/auth
- https://giselsegalvao.com.br/quizflowpro/auth/callback
- http://localhost:5173/auth (dev)
- http://localhost:5173/auth/callback (dev)
```

### Environment Variables (Vercel)
```bash
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=ey...
NODE_ENV=production
```

---

## 📱 URLs Funcionais

### Produção
```
Homepage:  https://giselsegalvao.com.br/quizflowpro
Auth:      https://giselsegalvao.com.br/quizflowpro/auth
Editor:    https://giselsegalvao.com.br/quizflowpro/editor
Quiz:      https://giselsegalvao.com.br/quizflowpro/quiz
Admin:     https://giselsegalvao.com.br/quizflowpro/admin
API:       https://giselsegalvao.com.br/quizflowpro/api/health
```

### Local (Dev)
```
Homepage:  http://localhost:5173/
Auth:      http://localhost:5173/auth
Editor:    http://localhost:5173/editor
```
*Nota: Em dev, o `base` é `/` para facilitar desenvolvimento*

---

## ✅ Checklist de Deploy

### Pré-Deploy
- [x] `base` configurado no vite.config.ts
- [x] Rewrites atualizados no vercel.json
- [x] Redirects com prefix `/quizflowpro`
- [x] Script atualizado com domínio

### Deploy
- [ ] Backend no Railway deployado
- [ ] Frontend na Vercel deployado
- [ ] Domínio customizado adicionado na Vercel
- [ ] DNS configurado (CNAME)
- [ ] Supabase Auth URLs atualizadas
- [ ] Smoke tests executados

### Pós-Deploy
- [ ] Testar: https://giselsegalvao.com.br/quizflowpro
- [ ] Testar Auth: login/signup
- [ ] Testar APIs: /api/health
- [ ] Testar Editor: criar funnel
- [ ] Testar Quiz: responder completo

---

## 🐛 Troubleshooting

### "404 - Not Found"
**Causa:** Vercel não reconhece subpath  
**Solução:** Verificar `base` no vite.config.ts e rebuild

### "Assets não carregam (404)"
**Causa:** Paths incorretos  
**Solução:** Verificar que build foi feito com `NODE_ENV=production`

### "API retorna HTML"
**Causa:** Rewrite não funcionando  
**Solução:** Verificar ordem dos rewrites no vercel.json (API deve vir primeiro)

### "Auth redirect error"
**Causa:** URLs incorretas no Supabase  
**Solução:** Atualizar exatamente como documentado acima

### "Funciona em localhost mas não em produção"
**Causa:** `base` diferente  
**Solução:** Testar build local: `npm run build && npx serve dist`

---

## 📊 Comparação URLs

| Ambiente | Base Path | Homepage | API |
|----------|-----------|----------|-----|
| **Local** | `/` | `localhost:5173/` | `localhost:5173/api/health` |
| **Produção** | `/quizflowpro/` | `giselsegalvao.com.br/quizflowpro` | `giselsegalvao.com.br/quizflowpro/api/health` |
| **Backend** | N/A | - | Railway: `/api/health` |

---

## 🎯 Testar Subpath Localmente

Para testar o subpath antes do deploy:

```bash
# Build com NODE_ENV=production
NODE_ENV=production npm run build

# Servir com base path
npx serve dist -l 8080 -s

# Acessar:
# http://localhost:8080/quizflowpro
```

**Nota:** Você verá 404 em `http://localhost:8080/` (normal), deve acessar `/quizflowpro`.

---

## 📞 Recursos

**Vercel Docs:**
- Custom Domains: https://vercel.com/docs/concepts/projects/custom-domains
- Rewrites: https://vercel.com/docs/project-configuration#rewrites

**Vite Docs:**
- Base Path: https://vitejs.dev/config/shared-options.html#base

**Supabase Docs:**
- Auth Redirect URLs: https://supabase.com/docs/guides/auth/redirect-urls

---

**Status:** ✅ Configurado para giselsegalvao.com.br/quizflowpro
