# ⚠️ ATENÇÃO: BACKEND APIs NA VERCEL

## 🚨 Problema Crítico Identificado

O projeto atual usa um **backend Express** (`server/index.ts`) com ~20 endpoints `/api/*`:
- `/api/health`
- `/api/funnels/*`
- `/api/components/*`
- `/api/utm-analytics`
- `/api/logs`
- `/api/admin/migrate`

**❌ PROBLEMA:** Vercel é otimizada para **frontend estático + serverless functions**, não para servidores Express tradicionais com `server.listen()`.

---

## 🎯 Duas Soluções Possíveis

### **OPÇÃO A: Backend Externo (Recomendado para MVP rápido)** ✅

**Como funciona:**
- Frontend na Vercel (SPA estático)
- Backend Express em servidor separado (Railway, Render, Heroku)
- `vercel.json` faz proxy de `/api/*` para backend

**Configuração atual em `vercel.json`:**
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://seu-backend.railway.app/api/:path*"
    }
  ]
}
```

**Passos:**
1. Deploy backend Express em Railway/Render
2. Atualizar `destination` no `vercel.json` com URL real
3. Deploy frontend na Vercel
4. Configurar CORS no backend para aceitar domínio Vercel

**Vantagens:**
- ✅ Migração rápida (sem refactor)
- ✅ Backend independente (escala separado)
- ✅ Mantém código Express atual

**Desvantagens:**
- ⚠️ Dois deploys separados
- ⚠️ Latência adicional (round-trip)
- ⚠️ Custo de dois serviços

---

### **OPÇÃO B: Migrar para Vercel Serverless Functions** 🔄

**Como funciona:**
- Converter rotas Express em funções serverless
- Cada arquivo em `api/*.ts` vira um endpoint
- Vercel gerencia tudo automaticamente

**Estrutura:**
```
api/
  ├── health.ts           → /api/health
  ├── funnels/
  │   ├── [id].ts         → /api/funnels/:id
  │   └── index.ts        → /api/funnels
  ├── components/
  │   └── [componentId]/
  │       └── configuration.ts
  └── utm-analytics.ts
```

**Exemplo de conversão:**
```typescript
// ANTES (server/index.ts)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// DEPOIS (api/health.ts)
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  res.json({ status: 'ok' });
}
```

**Vantagens:**
- ✅ Deploy único (frontend + API)
- ✅ Auto-scaling (Vercel gerencia)
- ✅ Cold start otimizado
- ✅ Edge network para APIs

**Desvantagens:**
- ⚠️ Refactor significativo (~2-3 dias)
- ⚠️ Limites serverless (10s timeout free tier)
- ⚠️ State não persiste entre requests

---

## 🔧 Status Atual do Projeto

### Backend Express (server/index.ts)
```typescript
// 527 linhas com ~20 endpoints
app.get('/api/health', ...)
app.get('/api/funnels', ...)
app.post('/api/funnels', ...)
// ... etc
```

### Frontend usando APIs
```typescript
// src/hooks/useUtmParameters.ts
fetch('/api/utm-analytics', ...)

// src/components/admin/MigrationPanel.tsx
fetch('/api/admin/migrate', ...)

// src/core/observability/StructuredLogger.ts
fetch('/api/logs', ...)
```

### Configuração Netlify (atual)
```toml
# netlify.toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### Configuração Vercel (nova)
```json
// vercel.json - TEMPORÁRIA
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://localhost:5000/api/:path*"
    }
  ]
}
```

**⚠️ IMPORTANTE:** A configuração atual aponta para `localhost:5000` (dev). Você **deve** atualizá-la para produção.

---

## 🚀 Recomendação para Deploy Imediato

### **Use OPÇÃO A com Railway** (15 minutos)

1. **Deploy Backend no Railway:**
   ```bash
   # Instalar Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Deploy
   railway init
   railway up
   
   # Obter URL
   railway domain
   ```

2. **Atualizar vercel.json:**
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://seu-projeto.railway.app/api/:path*"
       }
     ]
   }
   ```

3. **Configurar CORS no backend:**
   ```typescript
   // server/index.ts
   app.use(cors({
     origin: [
       'http://localhost:5173',
       'https://seu-projeto.vercel.app'
     ]
   }));
   ```

4. **Deploy frontend na Vercel:**
   ```bash
   vercel --prod
   ```

---

## 📋 Checklist de Deploy com Backend

### Pré-Deploy
- [ ] Escolher OPÇÃO A (externo) ou B (serverless)
- [ ] Se OPÇÃO A: Deploy backend primeiro
- [ ] Se OPÇÃO B: Migrar rotas para api/

### OPÇÃO A - Backend Externo
- [ ] Deploy backend em Railway/Render
- [ ] Obter URL do backend
- [ ] Atualizar `vercel.json` com URL real
- [ ] Configurar CORS no backend
- [ ] Testar endpoints: `curl https://backend.railway.app/api/health`
- [ ] Deploy frontend: `vercel --prod`
- [ ] Smoke test completo

### OPÇÃO B - Serverless
- [ ] Criar estrutura `api/`
- [ ] Converter rotas Express → functions
- [ ] Testar local: `vercel dev`
- [ ] Deploy: `vercel --prod`
- [ ] Smoke test completo

---

## 🐛 Troubleshooting

### "API retorna HTML em vez de JSON"
**Causa:** Rewrite `/(.*)` está capturando `/api/*`  
**Solução:** Adicionar regra específica para `/api/*` ANTES do rewrite SPA

### "CORS error"
**Causa:** Backend não permite origem Vercel  
**Solução:** Adicionar domínio Vercel em `cors({ origin: [...] })`

### "502 Bad Gateway"
**Causa:** Backend não está rodando ou URL incorreta  
**Solução:** Verificar logs do Railway/Render e testar endpoint direto

### "Timeout em production"
**Causa:** Serverless function > 10s (free tier)  
**Solução:** Otimizar ou usar OPÇÃO A

---

## 💻 Suporte para Windows

**Problema:** Scripts `.sh` não rodam nativamente no Windows.

**Soluções:**

### 1. Git Bash (Recomendado)
```bash
# Já vem com Git for Windows
"C:\Program Files\Git\bin\bash.exe" ./scripts/deploy-vercel.sh
```

### 2. WSL (Ubuntu)
```bash
wsl
cd /mnt/c/caminho/do/projeto
./scripts/deploy-vercel.sh
```

### 3. PowerShell (Manual - sem scripts)
```powershell
# Instalar CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Recomendação:** Use a **Opção Manual** (CLI direta) se estiver no Windows sem Git Bash/WSL.

---

## 📦 Scripts Disponíveis

| Script | Requer Bash | Alternativa Windows |
|--------|-------------|---------------------|
| `migrate-to-vercel.sh` | ✅ | Manual CLI |
| `deploy-vercel.sh` | ✅ | `vercel --prod` |
| `smoke-tests.sh` | ✅ | Testar via browser |
| `apply-rls-manual.sh` | ✅ | Copiar SQL manual |

---

## 🎯 Decisão Rápida

**Precisa de deploy HOJE?**
→ Use OPÇÃO A (Backend no Railway) + Frontend na Vercel

**Tem 2-3 dias?**
→ Use OPÇÃO B (Migrar para serverless) - mais elegante

**Está no Windows sem Bash?**
→ Use comandos manuais da Vercel CLI

---

## 📞 Recursos

**Railway (Backend Hosting):**
- Quick Start: https://docs.railway.app/quick-start
- Pricing: $5/mês (free tier disponível)

**Render (Alternativa):**
- Deploy: https://render.com/docs/deploy-node-express-app
- Pricing: Free tier disponível

**Vercel Serverless:**
- Functions: https://vercel.com/docs/functions
- API Routes: https://vercel.com/docs/functions/serverless-functions

---

**Status:** ⚠️ Requer decisão sobre arquitetura backend antes do deploy
