# 🚀 PRÓXIMOS PASSOS - DEPLOY VERCEL

## ⚠️ DECISÃO CRÍTICA PRIMEIRO

Você tem **2 opções** para as APIs do backend:

### **OPÇÃO A: Deploy Backend Separado (Railway)** ⏱️ 20 min
- Backend Express em servidor próprio
- Frontend na Vercel aponta para ele
- **✅ RECOMENDADO** para deploy rápido

### **OPÇÃO B: Usar Supabase 100%** ⏱️ 2 horas
- Remover backend Express
- Migrar todas APIs para Supabase (DB + Functions)
- Deploy apenas frontend estático

---

## 🎯 OPÇÃO A: Backend + Frontend (RECOMENDADO)

### **Passo 1: Deploy Backend no Railway** (10 min)

```bash
# Executar script automatizado
./scripts/deploy-backend-railway.sh
```

**O que o script faz:**
1. Instala Railway CLI
2. Faz login (abre navegador)
3. Cria projeto no Railway
4. Faz deploy do backend
5. Retorna URL do backend

**Resultado esperado:**
```
✅ Backend URL: https://seu-projeto-production.up.railway.app
```

---

### **Passo 2: Atualizar vercel.json** (2 min)

Abra `vercel.json` e substitua:

```json
// ANTES (linha 11)
"destination": "https://seu-backend.railway.app/api/:path*"

// DEPOIS (usar URL real do Railway)
"destination": "https://seu-projeto-production.up.railway.app/api/:path*"
```

**Validar:**
```bash
# Testar backend direto
curl https://seu-projeto-production.up.railway.app/api/health

# Deve retornar: {"status":"ok"}
```

---

### **Passo 3: Configurar CORS no Backend** (3 min)

Edite `server/index.ts` linha ~26:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://seu-projeto.vercel.app',  // Adicionar URL Vercel
    'https://*.vercel.app'              // Permitir preview deploys
  ],
  credentials: true
}));
```

**Redeploy backend:**
```bash
railway up
```

---

### **Passo 4: Deploy Frontend na Vercel** (5 min)

```bash
# Instalar Vercel CLI (se necessário)
npm install -g vercel

# Deploy preview (teste primeiro)
vercel

# Deploy production
vercel --prod
```

**Interativo - responda:**
- Set up and deploy? → `Y`
- Which scope? → Selecione sua conta
- Link to existing project? → `N`
- Project name? → `quiz-flow-pro` (ou outro)
- In which directory? → `.` (pressione Enter)
- Override settings? → `N`

**Resultado:**
```
✅ Preview: https://quiz-flow-pro-abc123.vercel.app
✅ Production: https://quiz-flow-pro.vercel.app
```

---

### **Passo 5: Configurar Variáveis de Ambiente** (5 min)

**Via CLI:**
```bash
vercel env add VITE_SUPABASE_URL production
# Cole: https://your-supabase-project.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Redeploy para aplicar
vercel --prod
```

**Via Dashboard:**
1. Acesse: https://vercel.com/seu-usuario/quiz-flow-pro/settings/environment-variables
2. Adicione as variáveis
3. Environment: Production
4. Salve e redeploy

---

### **Passo 6: Configurar Supabase Auth URLs** (3 min)

1. Acesse: https://supabase.com/dashboard/project/your-supabase-project-ref/auth/url-configuration

2. **Site URL:**
   ```
   https://quiz-flow-pro.vercel.app
   ```

3. **Additional Redirect URLs:**
   ```
   https://quiz-flow-pro.vercel.app/auth
   https://quiz-flow-pro.vercel.app/auth/callback
   https://*.vercel.app/auth
   https://*.vercel.app/auth/callback
   http://localhost:5173/auth
   http://localhost:5173/auth/callback
   ```

4. Salvar

---

### **Passo 7: Smoke Tests** (5 min)

```bash
# Substituir pela URL real
STAGING_URL=https://quiz-flow-pro.vercel.app ./scripts/smoke-tests.sh
```

**Testes manuais críticos:**

1. **API Health:**
   ```bash
   curl https://quiz-flow-pro.vercel.app/api/health
   # Deve retornar JSON: {"status":"ok"}
   ```

2. **Auth:**
   - Abrir: https://quiz-flow-pro.vercel.app/auth
   - Fazer login
   - Verificar redirecionamento

3. **Editor:**
   - Abrir: https://quiz-flow-pro.vercel.app/editor
   - Adicionar bloco
   - Verificar auto-save (badge)

4. **Quiz:**
   - Abrir: https://quiz-flow-pro.vercel.app/quiz
   - Responder quiz
   - Verificar finalização

---

### **Passo 8: Aplicar RLS Policies** (5 min)

```bash
./scripts/apply-rls-manual.sh
```

Ou manual:
1. Acesse: https://supabase.com/dashboard/project/your-supabase-project-ref/editor
2. Copie conteúdo de `supabase/migrations/20251123_critical_rls_policies.sql`
3. Execute (Run)

---

## 🎯 OPÇÃO B: Apenas Supabase (SEM Backend Express)

### **Situação:**
- Remove todo código `server/`
- Migra 20 endpoints para Supabase Functions ou lógica frontend
- **Tempo:** 2-4 horas de refactor

### **Quando escolher:**
- ✅ Quer arquitetura 100% serverless
- ✅ Tem tempo para migração
- ❌ Precisa de deploy hoje

### **Passos:**
1. Migrar `/api/health` → Supabase Edge Function
2. Migrar `/api/funnels/*` → Supabase RPC calls
3. Migrar `/api/utm-analytics` → Direct Supabase insert
4. Remover `server/` do projeto
5. Deploy frontend: `vercel --prod`

**Documentação:** Ver `docs/BACKEND_API_VERCEL.md` seção OPÇÃO B

---

## ⏱️ Timeline Estimado

### OPÇÃO A (Backend + Frontend):
```
├── Deploy backend (Railway)         → 10 min
├── Atualizar vercel.json            → 2 min
├── Configurar CORS                  → 3 min
├── Deploy frontend (Vercel)         → 5 min
├── Configurar env vars              → 5 min
├── Configurar Supabase Auth         → 3 min
├── Smoke tests                      → 5 min
└── RLS policies                     → 5 min
────────────────────────────────────────────
TOTAL                                → 38 min
```

### OPÇÃO B (Apenas Supabase):
```
├── Análise de endpoints             → 30 min
├── Migração de APIs                 → 90 min
├── Testes locais                    → 30 min
├── Deploy frontend                  → 5 min
├── Smoke tests                      → 10 min
────────────────────────────────────────────
TOTAL                                → 165 min (2h45)
```

---

## 🐛 Troubleshooting Comum

### "API retorna 502 Bad Gateway"
**Causa:** Backend Railway não está rodando  
**Solução:**
```bash
# Ver logs do Railway
railway logs

# Restart
railway up
```

### "CORS error no browser"
**Causa:** URL Vercel não está no CORS do backend  
**Solução:** Adicionar em `server/index.ts` e `railway up`

### "Environment variables undefined"
**Causa:** Env vars não configuradas ou não aplicadas  
**Solução:**
```bash
vercel env pull .env.production
vercel --prod --force  # Force redeploy
```

### "Supabase Auth redirect error"
**Causa:** URL não configurada no Supabase  
**Solução:** Adicionar URL no dashboard Supabase Auth

---

## 📋 Checklist Final

### Pré-Deploy
- [ ] Build local funcionando: `npm run build`
- [ ] Variáveis .env configuradas
- [ ] Decidido: OPÇÃO A ou B?

### Deploy (OPÇÃO A)
- [ ] Backend deployado no Railway
- [ ] URL do Railway copiada
- [ ] `vercel.json` atualizado com URL real
- [ ] CORS configurado no backend
- [ ] Backend testado: `curl .../api/health`
- [ ] Frontend deployado: `vercel --prod`
- [ ] Env vars configuradas na Vercel
- [ ] Supabase Auth URLs atualizadas
- [ ] RLS policies aplicadas
- [ ] Smoke tests executados
- [ ] APIs testadas: `/api/health`, `/api/funnels`

### Deploy (OPÇÃO B)
- [ ] Endpoints analisados
- [ ] APIs migradas para Supabase
- [ ] Código `server/` removido
- [ ] Testes locais passando
- [ ] Frontend deployado: `vercel --prod`
- [ ] Smoke tests executados

---

## 🚀 Comando Único (OPÇÃO A)

**Se tiver Railway CLI instalado:**
```bash
# 1. Deploy backend
./scripts/deploy-backend-railway.sh

# 2. Copiar URL exibida e atualizar vercel.json

# 3. Deploy frontend
vercel --prod

# 4. Configurar env vars
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# 5. Testar
curl https://quiz-flow-pro.vercel.app/api/health
```

---

## 💡 Recomendação Final

**Para deploy HOJE:** Use **OPÇÃO A**

1. Execute: `./scripts/deploy-backend-railway.sh`
2. Copie URL do Railway
3. Atualize `vercel.json` linha 11
4. Execute: `vercel --prod`
5. Configure env vars e Auth URLs
6. Teste tudo

**Tempo total:** 30-40 minutos

---

**Quer que eu execute algum desses passos agora?**
