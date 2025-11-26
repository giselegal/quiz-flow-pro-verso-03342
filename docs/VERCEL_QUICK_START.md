# 🚀 QUICK START - VERCEL DEPLOYMENT

## ⚡ Deploy Rápido (3 comandos)

```bash
# 1. Migrar automaticamente (cria vercel.json + backup)
./scripts/migrate-to-vercel.sh

# 2. Deploy preview para teste
vercel

# 3. Deploy produção
vercel --prod
```

---

## 📋 Opções de Deploy

### Opção A: Migração Automatizada (Recomendado)
```bash
# Script completo: backup + vercel.json + CLI install + deploy
./scripts/migrate-to-vercel.sh
```

**O que faz:**
- ✅ Backup do `netlify.toml`
- ✅ Cria `vercel.json` otimizado
- ✅ Instala Vercel CLI
- ✅ Valida build
- ✅ Pergunta se quer fazer deploy

---

### Opção B: Deploy Direto (vercel.json já existe)
```bash
# Deploy com wizard interativo
./scripts/deploy-vercel.sh
```

**Escolha:**
1. Production (`--prod`)
2. Preview (teste)

---

### Opção C: Manual (Controle total)
```bash
# Instalar CLI
npm install -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod
```

---

## 🔧 Configuração Pós-Deploy

### 1. Variáveis de Ambiente

**Via CLI:**
```bash
vercel env add VITE_SUPABASE_URL
# Cole: https://your-supabase-project.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Via Dashboard:**
1. Acesse: https://vercel.com/[seu-projeto]/settings/environment-variables
2. Adicione as variáveis
3. Redeploy: `vercel --prod`

---

### 2. Supabase Auth URLs

1. Acesse: https://supabase.com/dashboard/project/your-supabase-project-ref/auth/url-configuration

2. **Site URL:**
   ```
   https://seu-projeto.vercel.app
   ```

3. **Additional Redirect URLs:**
   ```
   https://seu-projeto.vercel.app/auth
   https://seu-projeto.vercel.app/auth/callback
   http://localhost:5173/auth
   http://localhost:5173/auth/callback
   ```

---

## ✅ Validação

### Smoke Tests
```bash
# Substituir pela URL real do deploy
STAGING_URL=https://seu-projeto.vercel.app ./scripts/smoke-tests.sh
```

**Testes executados:**
- Homepage (200)
- Auth routes (200)
- Editor routes (200)
- Quiz routes (200)
- Admin routes (200)
- Static assets (JS/CSS)

---

## 📊 Comparação de Comandos

| Tarefa | Netlify | Vercel |
|--------|---------|--------|
| Install CLI | `npm i -g netlify-cli` | `npm i -g vercel` |
| Login | `netlify login` | `vercel login` |
| Preview | `netlify deploy` | `vercel` |
| Production | `netlify deploy --prod` | `vercel --prod` |
| Env vars | `netlify env:set KEY value` | `vercel env add KEY` |
| Logs | `netlify logs` | `vercel logs` |

---

## 🐛 Troubleshooting

### "No vercel.json found"
```bash
# Criar automaticamente
./scripts/migrate-to-vercel.sh
```

### "Build failed"
```bash
# Validar build local
npm run build

# Verificar dist/
ls -la dist/
```

### "Environment variables not working"
```bash
# Adicionar via CLI
vercel env add VITE_SUPABASE_URL

# Ou via dashboard e redeploy
vercel --prod --force
```

### "Redirect not working"
- Vercel usa 1 rewrite para SPAs: `/(.*) → /index.html`
- Redirects legacy já configurados em `vercel.json`

---

## 📦 Arquivos Criados

```
vercel.json                    # Configuração Vercel (30 linhas)
scripts/deploy-vercel.sh       # Deploy one-click (100 linhas)
scripts/migrate-to-vercel.sh   # Migração completa (180 linhas)
docs/MIGRATION_NETLIFY_TO_VERCEL.md  # Análise detalhada
```

---

## 🎯 Next Steps

### Imediato
1. ✅ Deploy preview: `vercel`
2. ✅ Testar URL gerada
3. ✅ Configurar env vars
4. ✅ Deploy prod: `vercel --prod`

### Curto Prazo
1. Smoke tests completos
2. Comparar performance (Netlify vs Vercel)
3. Atualizar DNS (se custom domain)
4. Monitorar métricas

---

## 💡 Dicas

### Preview URLs
Cada commit gera URL única:
```
https://seu-projeto-git-branch-user.vercel.app
```

### Múltiplos Ambientes
```bash
# Preview (staging)
vercel

# Production
vercel --prod
```

### Rollback
```bash
# Listar deploys
vercel ls

# Promover deploy anterior
vercel promote [deployment-url]
```

### Analytics (Paid)
```bash
# Ver analytics
vercel analytics
```

---

## 📞 Recursos

**Documentação:**
- Vercel Docs: https://vercel.com/docs
- Vercel CLI: https://vercel.com/docs/cli
- Vite on Vercel: https://vercel.com/docs/frameworks/vite

**Dashboard:**
- Projects: https://vercel.com/dashboard
- Analytics: https://vercel.com/analytics
- Logs: https://vercel.com/logs

---

**Status:** ✅ Pronto para deploy
