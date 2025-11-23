# ✅ VERCEL - Informações de Deploy

## 🌐 Domínios Vercel Ativos

### Domínio Principal (Production)
```
https://quiz-flow-pro-nu.vercel.app
```

### Domínios de Preview
```
https://quiz-flow-pro-git-main-quiz-flow.vercel.app
https://quiz-flow-1byewiq7g-quiz-flow.vercel.app
```

## 🔑 Credenciais

### API Key (AI Gateway)
```
vck_7sPJrFaeumk6wKjTazgi7WFnCTKyPERndOAQinNyTRSAis6qjR3CRwGz
```

## 📦 Último Deploy

**Commit:** `ca6e68f`  
**Mensagem:** ci(vercel): adicionar arquivos de configuração do vercel e script de instalação

## 🎯 Status Atual

✅ **Frontend deployado na Vercel**
- Domínio principal: quiz-flow-pro-nu.vercel.app
- Base path: `/` (raiz do domínio)
- Build: Sucesso

## ⚠️ Próximos Passos

### 1. Deploy Backend no Railway
O backend ainda precisa ser deployado. Execute:

```bash
railway login && railway init && railway up
```

### 2. Atualizar vercel.json com URL do Railway

Depois do deploy no Railway, atualize o arquivo `vercel.json` linha 11:

```json
{
  "source": "/api/:path*",
  "destination": "https://SEU-PROJETO.up.railway.app/api/:path*"
}
```

### 3. Configurar Environment Variables na Vercel

Acesse: https://vercel.com/quiz-flow/quiz-flow-pro-nu/settings/environment-variables

Adicione todas as variáveis de `.env.production`:

```env
VITE_SUPABASE_URL=https://pwtjuuhchtbzttrzoutw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDQ0NjAsImV4cCI6MjA2NzkyMDQ2MH0.EP0qLHBZK8nyxcod0FEVRQln4R_yVSWEGQwuIbJfP_w
VITE_APP_URL=https://quiz-flow-pro-nu.vercel.app
VITE_BASE_PATH=/
AI_GATEWAY_API_KEY=vck_7sPJrFaeumk6wKjTazgi7WFnCTKyPERndOAQinNyTRSAis6qjR3CRwGz
NODE_ENV=production
VITE_USE_MASTER_JSON=true
VITE_USE_MODULAR_TEMPLATES=true
VITE_PREFER_PUBLIC_STEP_JSON=true
```

**Depois, redeploy:**
```bash
vercel --prod
```

### 4. Configurar Supabase Auth URLs

Acesse: https://supabase.com/dashboard/project/pwtjuuhchtbzttrzoutw/auth/url-configuration

**Site URL:**
```
https://quiz-flow-pro-nu.vercel.app
```

**Redirect URLs:**
```
https://quiz-flow-pro-nu.vercel.app/auth
https://quiz-flow-pro-nu.vercel.app/auth/callback
https://quiz-flow-pro-git-main-quiz-flow.vercel.app/auth
https://quiz-flow-pro-git-main-quiz-flow.vercel.app/auth/callback
https://quiz-flow-1byewiq7g-quiz-flow.vercel.app/auth
https://quiz-flow-1byewiq7g-quiz-flow.vercel.app/auth/callback
http://localhost:5173/auth
http://localhost:5173/auth/callback
```

### 5. Adicionar Domínio Customizado (Opcional)

Se quiser usar `giselsegalvao.com.br`:

1. **Opção A: Subdomínio (Recomendado)**
   - DNS: CNAME `quizflowpro` → `cname.vercel-dns.com`
   - Vercel Dashboard: Add Domain → `quizflowpro.giselsegalvao.com.br`
   
2. **Opção B: Domínio Principal**
   - DNS: A Record `@` → `76.76.21.21`
   - Vercel Dashboard: Add Domain → `giselsegalvao.com.br`

## 🧪 Testar Aplicação

```bash
# Testar frontend
open https://quiz-flow-pro-nu.vercel.app

# Testar API (após Railway)
curl https://quiz-flow-pro-nu.vercel.app/api/health
```

## 📊 Checklist de Deploy

### Frontend (Vercel) ✅
- [x] Projeto criado
- [x] Deploy inicial realizado
- [x] Domínio Vercel ativo
- [ ] Environment variables configuradas
- [ ] Domínio customizado (opcional)

### Backend (Railway) ⏳
- [ ] Projeto criado
- [ ] Deploy realizado
- [ ] URL copiada
- [ ] vercel.json atualizado
- [ ] Environment variables configuradas

### Supabase ⏳
- [ ] Auth URLs configuradas
- [ ] RLS policies aplicadas
- [ ] Teste de autenticação

### Validação Final ⏳
- [ ] Homepage carrega
- [ ] Auth funciona
- [ ] Editor salva dados
- [ ] Quiz completa
- [ ] Dashboard mostra métricas
- [ ] Sem erros no console

## 🚀 Comando Rápido (Após Railway)

```bash
# 1. Deploy backend
railway login && railway init && railway up

# 2. Copiar URL do Railway
railway domain

# 3. Atualizar vercel.json
# 4. Commit e push
git add vercel.json
git commit -m "chore: adicionar URL do backend Railway"
git push

# 5. Aguardar redeploy automático
```

---

**Última atualização:** 23/11/2025  
**Status:** Frontend deployado, aguardando backend Railway
