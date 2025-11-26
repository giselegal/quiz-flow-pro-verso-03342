# 🚀 DEPLOY OPTIONS - STAGING

Você tem **2 opções** equivalentes para fazer deploy em staging. Ambas estão 100% configuradas e prontas para uso.

---

## 🎯 Escolha Sua Plataforma

| Aspecto | Netlify | Vercel | Recomendação |
|---------|---------|--------|--------------|
| **Velocidade de build** | 2-3 min | 1-2 min | 🏆 Vercel |
| **Edge network** | Boa | Excelente | 🏆 Vercel |
| **Free tier** | 300 build min | 6000 build min | 🏆 Vercel |
| **Configuração** | 108 linhas | 30 linhas | 🏆 Vercel |
| **DX (UX dev)** | Ótima | Ótima | Empate |
| **Facilidade** | Fácil | Fácil | Empate |

**💡 Sugestão:** Teste **Vercel** primeiro (mais rápido e moderno). Se tiver problemas, Netlify está pronto como backup.

---

## 📦 OPÇÃO A: Vercel (Recomendado)

### Deploy Rápido (1 comando)
```bash
./scripts/migrate-to-vercel.sh
```

Isso faz:
- ✅ Backup automático do `netlify.toml`
- ✅ Cria `vercel.json` otimizado
- ✅ Instala Vercel CLI
- ✅ Valida build
- ✅ Faz deploy (pergunta prod/preview)

### Deploy Manual
```bash
# Instalar CLI
npm install -g vercel

# Deploy preview
vercel

# Deploy production
vercel --prod
```

### Documentação
- **Quick Start:** `docs/VERCEL_QUICK_START.md`
- **Análise completa:** `docs/MIGRATION_NETLIFY_TO_VERCEL.md`

---

## 📦 OPÇÃO B: Netlify

### Deploy Rápido (1 comando)
```bash
./scripts/deploy-netlify.sh
```

Isso faz:
- ✅ Valida build
- ✅ Instala Netlify CLI
- ✅ Faz login
- ✅ Faz deploy (pergunta prod/preview)

### Deploy Manual
```bash
# Instalar CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy preview
netlify deploy --dir=dist

# Deploy production
netlify deploy --dir=dist --prod
```

### Documentação
- **Guia completo:** `docs/DEPLOY_GUIDE_STAGING.md`

---

## ⚙️ Configurações Pós-Deploy (Ambas Plataformas)

### 1. Variáveis de Ambiente

**Vercel:**
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

**Netlify:**
Via dashboard: https://app.netlify.com/sites/YOUR-SITE/settings/deploys#environment

---

### 2. Supabase Auth URLs

Acesse: https://supabase.com/dashboard/project/your-supabase-project-ref/auth/url-configuration

Adicione sua URL de deploy:
```
# Vercel
https://seu-projeto.vercel.app
https://seu-projeto.vercel.app/auth
https://seu-projeto.vercel.app/auth/callback

# Netlify
https://seu-projeto.netlify.app
https://seu-projeto.netlify.app/auth
https://seu-projeto.netlify.app/auth/callback
```

---

### 3. Aplicar RLS Policies (Uma vez apenas)

```bash
# Gera instruções para aplicar no Supabase Dashboard
./scripts/apply-rls-manual.sh
```

Ou acesse direto: https://supabase.com/dashboard/project/your-supabase-project-ref/editor

E execute: `supabase/migrations/20251123_critical_rls_policies.sql`

---

## ✅ Smoke Tests (Após Deploy)

```bash
# Substituir pela URL real
STAGING_URL=https://seu-projeto.vercel.app ./scripts/smoke-tests.sh

# Ou Netlify
STAGING_URL=https://seu-projeto.netlify.app ./scripts/smoke-tests.sh
```

**Testa:**
- ✅ Homepage (200)
- ✅ Auth routes
- ✅ Editor routes  
- ✅ Quiz routes
- ✅ Admin routes
- ✅ Static assets

---

## 📊 Scripts Disponíveis

```bash
# Validação pré-deploy
./scripts/deploy-validation.sh       # Valida build + integrações

# Deploy staging
./scripts/deploy-staging.sh          # Build + instruções completas

# Vercel
./scripts/migrate-to-vercel.sh       # Migração automatizada
./scripts/deploy-vercel.sh           # Deploy Vercel

# Netlify
./scripts/deploy-netlify.sh          # Deploy Netlify

# Testes
./scripts/smoke-tests.sh             # Testes pós-deploy
./scripts/apply-rls-manual.sh        # Instruções RLS
```

---

## 🎯 Fluxo Recomendado

### Para Primeira Vez

1. **Build local:**
   ```bash
   npm run build
   ```

2. **Deploy preview (teste):**
   ```bash
   # Vercel
   ./scripts/migrate-to-vercel.sh
   
   # OU Netlify
   ./scripts/deploy-netlify.sh
   ```

3. **Configurar:**
   - Variáveis de ambiente
   - Supabase Auth URLs
   - RLS policies

4. **Smoke tests:**
   ```bash
   STAGING_URL=https://... ./scripts/smoke-tests.sh
   ```

5. **Deploy production:**
   ```bash
   vercel --prod
   # OU
   netlify deploy --dir=dist --prod
   ```

---

## 📈 Status Atual

✅ **Build:** 7.8M (315 JS + 3 CSS)  
✅ **Configurações:** Netlify + Vercel prontas  
✅ **Scripts:** Todos automatizados  
✅ **Migração RLS:** Pronta para aplicar  
✅ **Auth:** AuthPage implementada  
⏳ **Deploy:** Escolha Vercel ou Netlify  
⏳ **Smoke tests:** Executar após deploy  

---

## 🆘 Problemas Comuns

### "Build failed"
```bash
npm run build
# Verificar erros no console
```

### "Environment variables not found"
- Adicione via CLI ou dashboard
- Redeploy após adicionar

### "RLS policy error"
- Execute `./scripts/apply-rls-manual.sh`
- Aplique SQL no Supabase Dashboard

### "Auth redirect error"
- Atualize URLs no Supabase Auth
- Adicione URL de staging

---

## 📞 Recursos

**Vercel:**
- Docs: https://vercel.com/docs
- Dashboard: https://vercel.com/dashboard
- CLI: https://vercel.com/docs/cli

**Netlify:**
- Docs: https://docs.netlify.com/
- Dashboard: https://app.netlify.com/
- CLI: https://docs.netlify.com/cli/get-started/

**Supabase:**
- Dashboard: https://supabase.com/dashboard/project/your-supabase-project-ref
- Auth: https://supabase.com/dashboard/project/your-supabase-project-ref/auth/url-configuration
- SQL Editor: https://supabase.com/dashboard/project/your-supabase-project-ref/editor

---

**Pronto para deploy!** 🚀

Escolha sua plataforma e execute o script correspondente.
