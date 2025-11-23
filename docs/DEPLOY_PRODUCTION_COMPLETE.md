# ✅ CONFIGURAÇÃO COMPLETA - DEPLOY PRODUCTION

## 🎯 Domínio: giselsegalvao.com.br/quizflowpro

---

## ✅ ARQUIVOS JÁ CONFIGURADOS

### 1. `.env.production` ✅
```env
VITE_SUPABASE_URL=https://pwtjuuhchtbzttrzoutw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_URL=https://giselsegalvao.com.br/quizflowpro
VITE_BASE_PATH=/quizflowpro
```

### 2. `vite.config.ts` ✅
```typescript
base: process.env.NODE_ENV === 'production' ? '/quizflowpro/' : '/'
```

### 3. `vercel.json` ✅
```json
{
  "rewrites": [
    {
      "source": "/quizflowpro/api/:path*",
      "destination": "https://seu-backend.railway.app/api/:path*"
    },
    {
      "source": "/quizflowpro/(.*)",
      "destination": "/quizflowpro/index.html"
    }
  ]
}
```

### 4. `railway.json` ✅
Backend configurado para deploy com tsx

---

## 📋 PASSO A PASSO COMPLETO

### **PASSO 1: Deploy Backend Railway** (5 min)

```bash
railway login && railway init && railway up
```

**Depois do deploy, obtenha a URL:**
```bash
railway domain
```

**Exemplo de URL:** `https://quiz-flow-backend-production.up.railway.app`

---

### **PASSO 2: Configurar DNS do Domínio** (10 min)

#### Opção A: Subdomínio (Recomendado)
1. Acesse seu provedor DNS (Registro.br, Cloudflare, etc.)
2. Adicione registro CNAME:
   - **Host:** `quizflowpro`
   - **Valor:** `cname.vercel-dns.com`
   - **TTL:** 3600

#### Opção B: Subpath no Domínio Principal
1. No seu servidor principal (giselsegalvao.com.br)
2. Configure proxy reverso para `/quizflowpro/*` → Vercel

**Para Vercel, é mais simples usar subdomínio:**
- ✅ `quizflowpro.giselsegalvao.com.br` → Mais fácil
- ⚠️ `giselsegalvao.com.br/quizflowpro` → Requer proxy reverso

---

### **PASSO 3: Deploy na Vercel** (5 min)

```bash
# Instalar CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Durante o setup:**
- Project Name: `quiz-flow-pro`
- Framework: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

---

### **PASSO 4: Configurar Domínio Customizado na Vercel** (3 min)

1. Acesse: https://vercel.com/seu-usuario/quiz-flow-pro/settings/domains

2. Adicione domínio:
   - **Domínio:** `quizflowpro.giselsegalvao.com.br`
   - Vercel irá verificar DNS automaticamente

3. Aguarde propagação DNS (5-30 min)

---

### **PASSO 5: Configurar Environment Variables** (5 min)

Na Vercel Dashboard:
https://vercel.com/seu-usuario/quiz-flow-pro/settings/environment-variables

Adicione:

```
VITE_SUPABASE_URL=https://pwtjuuhchtbzttrzoutw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDQ0NjAsImV4cCI6MjA2NzkyMDQ2MH0.EP0qLHBZK8nyxcod0FEVRQln4R_yVSWEGQwuIbJfP_w
VITE_APP_URL=https://quizflowpro.giselsegalvao.com.br
VITE_BASE_PATH=/
NODE_ENV=production
```

**Importante:** Se usar subdomínio, `VITE_BASE_PATH=/` (não `/quizflowpro`)

Redeploy:
```bash
vercel --prod
```

---

### **PASSO 6: Atualizar vercel.json com URL do Railway** (2 min)

Edite `vercel.json` linha 11:

```json
{
  "source": "/api/:path*",
  "destination": "https://SEU-PROJETO.up.railway.app/api/:path*"
}
```

Commit e push:
```bash
git add vercel.json
git commit -m "chore: atualizar URL backend Railway"
git push
```

Deploy automático será disparado.

---

### **PASSO 7: Configurar Supabase Auth** (5 min)

1. Acesse: https://supabase.com/dashboard/project/pwtjuuhchtbzttrzoutw/auth/url-configuration

2. **Site URL:**
   ```
   https://quizflowpro.giselsegalvao.com.br
   ```

3. **Additional Redirect URLs:**
   ```
   https://quizflowpro.giselsegalvao.com.br/auth
   https://quizflowpro.giselsegalvao.com.br/auth/callback
   https://*.vercel.app/auth
   https://*.vercel.app/auth/callback
   http://localhost:5173/auth
   http://localhost:5173/auth/callback
   ```

4. Salvar

---

### **PASSO 8: Aplicar RLS Policies** (5 min)

1. Acesse: https://supabase.com/dashboard/project/pwtjuuhchtbzttrzoutw/editor

2. New Query

3. Copie conteúdo de: `supabase/migrations/20251123_critical_rls_policies.sql`

4. Execute (Run)

5. Validar:
   ```sql
   SELECT schemaname, tablename, policyname 
   FROM pg_policies 
   WHERE tablename IN ('quiz_users', 'quiz_analytics', 'component_instances');
   ```

   **Resultado esperado:** 9 políticas

---

### **PASSO 9: Smoke Tests** (5 min)

```bash
# Testar API via proxy
curl https://quizflowpro.giselsegalvao.com.br/api/health

# Testar frontend
open https://quizflowpro.giselsegalvao.com.br
```

**Checklist manual:**
- [ ] Homepage carrega
- [ ] Auth funciona (login/signup)
- [ ] Editor carrega e auto-save funciona
- [ ] Quiz responde e finaliza
- [ ] Dashboard mostra métricas
- [ ] Sem erros no console

---

## 🔧 CONFIGURAÇÃO RAILWAY

### Environment Variables no Railway:

```
VITE_SUPABASE_URL=https://pwtjuuhchtbzttrzoutw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDQ0NjAsImV4cCI6MjA2NzkyMDQ2MH0.EP0qLHBZK8nyxcod0FEVRQln4R_yVSWEGQwuIbJfP_w
NODE_ENV=production
PORT=5000
```

---

## 🚨 ATENÇÃO: Subdomínio vs Subpath

### ✅ RECOMENDADO: Subdomínio
```
https://quizflowpro.giselsegalvao.com.br
```

**Vantagens:**
- Configuração simples na Vercel
- Sem problemas de routing
- SSL automático
- Deploy independente

**Configuração:**
1. DNS: CNAME `quizflowpro` → `cname.vercel-dns.com`
2. Vercel: Adicionar domínio
3. `.env.production`: `VITE_BASE_PATH=/`
4. `vite.config.ts`: `base: '/'`

---

### ⚠️ ALTERNATIVA: Subpath (Complexo)
```
https://giselsegalvao.com.br/quizflowpro
```

**Requer:**
1. Servidor principal com proxy reverso (Nginx/Apache)
2. Configuração complexa de routing
3. Problemas com assets e links

**Não recomendado para Vercel!**

---

## ✅ CHECKLIST FINAL

### Pré-Deploy
- [x] `.env.production` criado
- [x] `vite.config.ts` configurado
- [x] `vercel.json` configurado
- [x] `railway.json` configurado
- [ ] DNS configurado

### Deploy
- [ ] Backend Railway deployado
- [ ] URL Railway copiada
- [ ] Frontend Vercel deployado
- [ ] Domínio customizado adicionado
- [ ] DNS propagado

### Configuração
- [ ] Env vars na Vercel
- [ ] Env vars no Railway
- [ ] `vercel.json` atualizado com URL Railway
- [ ] Supabase Auth URLs configuradas
- [ ] RLS policies aplicadas

### Validação
- [ ] API respondendo
- [ ] Frontend carregando
- [ ] Auth funcionando
- [ ] Editor salvando
- [ ] Quiz finalizando
- [ ] Dashboard mostrando dados

---

## 🎯 RECOMENDAÇÃO FINAL

**Use subdomínio:**
```
https://quizflowpro.giselsegalvao.com.br
```

**Comandos:**
```bash
# 1. Deploy backend
railway login && railway init && railway up

# 2. Deploy frontend
vercel --prod

# 3. Configurar domínio na Vercel Dashboard
# 4. Configurar DNS: CNAME quizflowpro → cname.vercel-dns.com
# 5. Configurar Supabase Auth
# 6. Testar!
```

---

**Tempo total estimado:** 40-50 minutos
