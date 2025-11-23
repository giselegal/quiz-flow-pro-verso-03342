# 🎯 DECISÃO DE DEPLOY - BACKEND

## 📊 Sua Situação Atual

✅ Frontend: Pronto (build 7.8M)  
⚠️ Backend: Express com ~20 endpoints `/api/*`  
⚠️ Vercel: Não suporta Express tradicional  
✅ Netlify: Suporta via Functions (mas requer adaptação)

---

## 🔀 Três Caminhos Possíveis

### **OPÇÃO A: Netlify (Mais Simples)** 🟢 RECOMENDADO

**Por quê?**
- ✅ Já configurado (`netlify.toml` pronto)
- ✅ Suporta Functions (compatível com Express)
- ✅ Zero mudanças no código
- ✅ Deploy único (frontend + backend)

**Como fazer:**
```bash
./scripts/deploy-netlify.sh
```

**Tempo:** 5-10 minutos  
**Risco:** Baixo  
**Custo:** Free tier suficiente

---

### **OPÇÃO B: Vercel + Railway** 🟡

**Por quê?**
- ✅ Performance superior (Vercel edge network)
- ⚠️ Dois deploys separados
- ⚠️ Precisa configurar CORS
- ⚠️ Custo de dois serviços

**Como fazer:**
```bash
# 1. Deploy backend
./scripts/deploy-backend-railway.sh

# 2. Atualizar vercel.json com URL do Railway
# Editar: "destination": "https://seu-projeto.railway.app/api/:path*"

# 3. Deploy frontend
vercel --prod
```

**Tempo:** 20-30 minutos  
**Risco:** Médio  
**Custo:** Railway $5/mês (ou free tier)

---

### **OPÇÃO C: Vercel Serverless** 🔴 Complexo

**Por quê?**
- ✅ Deploy único
- ✅ Auto-scaling
- ❌ Requer refactor completo do backend (2-3 dias)
- ❌ Limitações serverless (10s timeout)

**Como fazer:**
```bash
# 1. Criar estrutura api/
mkdir -p api/funnels api/components

# 2. Converter cada rota Express em function
# Exemplo: server/index.ts:84 → api/health.ts

# 3. Testar local
vercel dev

# 4. Deploy
vercel --prod
```

**Tempo:** 2-3 dias  
**Risco:** Alto  
**Custo:** Free tier Vercel

---

## 🎯 Recomendação Final

### Para Deploy **HOJE**:
→ **Use Netlify (OPÇÃO A)**

**Motivos:**
1. Zero mudanças no código
2. Já está configurado
3. Backend funciona como está
4. 5-10 minutos de deploy

```bash
./scripts/deploy-netlify.sh
```

---

### Para Deploy **Esta Semana**:
→ **Use Vercel + Railway (OPÇÃO B)**

**Motivos:**
1. Melhor performance
2. Modern stack
3. Custo aceitável ($5/mês Railway)
4. 20-30 minutos de setup

```bash
./scripts/deploy-backend-railway.sh
# Copiar URL
# Editar vercel.json
vercel --prod
```

---

### Para Refactor **Futuro**:
→ **Migre para Serverless (OPÇÃO C)**

**Quando fazer:**
- Após MVP validado
- Quando tiver 2-3 dias disponíveis
- Se quiser deploy único
- Se precisar de auto-scaling

---

## 📋 Checklist de Decisão

### Perguntas Chave:

**1. Precisa deployar hoje?**
- ✅ Sim → Netlify
- ❌ Não → Considere Vercel + Railway

**2. Quer melhor performance?**
- ✅ Sim → Vercel + Railway
- ❌ Não → Netlify

**3. Tem tempo para refactor (2-3 dias)?**
- ✅ Sim → Vercel Serverless
- ❌ Não → Netlify ou Vercel + Railway

**4. Orçamento mensal?**
- $0 → Netlify ou Railway free tier
- $5-10 → Vercel + Railway
- $20+ → Vercel Pro

**5. Está no Windows sem Git Bash?**
- ✅ Sim → Use comandos manuais ou Netlify Dashboard
- ❌ Não → Qualquer opção

---

## 🚀 Ação Imediata

### Recomendação: **Netlify**

```bash
# 1 comando, 5 minutos
./scripts/deploy-netlify.sh
```

**Depois do deploy:**
1. Testar: `STAGING_URL=https://seu-site.netlify.app ./scripts/smoke-tests.sh`
2. Configurar Auth URLs no Supabase
3. Aplicar RLS policies: `./scripts/apply-rls-manual.sh`
4. Validar APIs: `curl https://seu-site.netlify.app/api/health`

---

## 📞 Suporte

**Se escolher Netlify:**
- `docs/DEPLOY_GUIDE_STAGING.md`
- `docs/DEPLOY_OPTIONS.md`

**Se escolher Vercel + Railway:**
- `docs/BACKEND_API_VERCEL.md`
- `docs/VERCEL_QUICK_START.md`

**Se escolher Serverless:**
- `docs/BACKEND_API_VERCEL.md` (seção OPÇÃO B)
- https://vercel.com/docs/functions

---

## 💡 Minha Recomendação Pessoal

**Para este projeto agora:** Use **Netlify**.

**Razões:**
1. Você já tem tudo configurado
2. Zero risco de quebrar APIs
3. Deploy em 5 minutos
4. Pode migrar para Vercel depois

**Migre para Vercel quando:**
- MVP estiver validado
- Tiver tempo para setup Railway
- Performance for crítica
- Quiser otimizar custos ($5 Railway vs deploy serverless)

---

**Qual opção você escolhe?**
- A = Netlify (5 min)
- B = Vercel + Railway (30 min)
- C = Vercel Serverless (2-3 dias)
