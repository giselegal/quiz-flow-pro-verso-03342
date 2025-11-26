# Render Deploy - Backend Express

## 🚀 Deploy Simples no Render.com (GRATUITO)

### Passo 1: Criar Conta
https://render.com/

### Passo 2: New Web Service

1. Clique "New +" → "Web Service"

2. Conecte GitHub: **giselegal/quiz-flow-pro-verso-03342**

3. Configure:
   ```
   Name: quiz-flow-backend
   Region: Oregon (US West)
   Branch: main
   Root Directory: (deixe vazio)
   Runtime: Node
   Build Command: npm install
   Start Command: tsx server/index.ts
   ```

4. Plan: **Free** (selecione o plano gratuito)

### Passo 3: Environment Variables

Adicione estas 4 variáveis:

```
VITE_SUPABASE_URL
https://your-supabase-project.supabase.co

VITE_SUPABASE_ANON_KEY
your-supabase-anon-key

NODE_ENV
production

PORT
5000
```

### Passo 4: Deploy

1. Clique "Create Web Service"
2. Aguarde 3-5 minutos
3. URL aparecerá automaticamente no topo
4. Copie e me envie: `https://quiz-flow-backend.onrender.com`

---

## ✅ Vantagens Render vs Railway

- ✅ **100% Gratuito** (Railway precisa cartão após $5)
- ✅ **Interface mais simples** (menos confusa)
- ✅ **URL aparece automaticamente**
- ⚠️ **Hiberna após 15 min** (demora ~30s para acordar)

---

## 🎯 Próximo Passo

Render é MUITO mais simples. Tenta lá e me envia a URL!

https://render.com/
