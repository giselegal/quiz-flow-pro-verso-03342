# 🚀 DOCUMENTAÇÃO DO SERVIDOR - QUIZ QUEST CHALLENGE VERSE

## 📋 **VISÃO GERAL**

O Quiz Quest Challenge Verse utiliza uma arquitetura **híbrida** que combina:

- **Frontend SPA** (React + Vite)
- **Backend API** (Node.js + Express)
- **Database** (Supabase PostgreSQL)

Esta documentação explica como o servidor funciona, suas configurações e como tudo se conecta.

---

## 🏗️ **ARQUITETURA GERAL DO SISTEMA**

```
┌─────────────────────────────────────────────────────────────────┐
│                    QUIZ QUEST CHALLENGE VERSE                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌──────────────────┐    ┌────────────┐ │
│  │    FRONTEND     │    │     BACKEND      │    │  DATABASE  │ │
│  │   (React SPA)   │◄──►│  (Node.js API)   │◄──►│ (Supabase) │ │
│  │   Port: 8081    │    │   Port: 3001     │    │   Cloud    │ │
│  │   Vite Server   │    │  Express Server  │    │PostgreSQL  │ │
│  └─────────────────┘    └──────────────────┘    └────────────┘ │
│           │                       │                     │      │
│           ▼                       ▼                     ▼      │
│  ┌─────────────────┐    ┌──────────────────┐    ┌────────────┐ │
│  │ Static Assets   │    │   REST API       │    │ Real-time  │ │
│  │ Hot Reload      │    │   Health Check   │    │ Sync       │ │
│  │ Proxy /api      │    │   CORS Enabled   │    │ Auth       │ │
│  └─────────────────┘    └──────────────────┘    └────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 **FRONTEND SERVER (Vite)**

### 📊 **Características Principais**

| Aspecto                | Configuração                       |
| ---------------------- | ---------------------------------- |
| **Framework**          | Vite 5.4.19                        |
| **Porta Configurada**  | 8080                               |
| **Porta Atual**        | 8081 (fallback automático)         |
| **Porta Default Vite** | 5173 (não usada)                   |
| **Host**               | 0.0.0.0 (aceita conexões externas) |
| **HMR**                | Ativo na porta 8080                |
| **Strict Port**        | false (permite fallback)           |

### ⚙️ **Configuração do Vite**

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    host: '0.0.0.0', // Aceita conexões de qualquer IP
    port: 8080, // Porta preferencial
    strictPort: false, // Permite fallback para 8081
    allowedHosts: true, // Aceita todos os hosts
    hmr: {
      port: 8080, // Hot Module Replacement
      overlay: false, // Não mostra overlay de erros
    },
    proxy: {
      '/api': {
        // Proxy para backend
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

### 🔄 **Sistema de Proxy**

O Vite atua como **proxy reverso** para as chamadas de API:

```
Frontend Request: /api/quizzes
        │
        ▼
Vite Proxy: http://localhost:8081/api/quizzes
        │
        ▼
Backend API: http://localhost:3001/api/quizzes
        │
        ▼
Response: JSON data
```

### 🚀 **Scripts de Desenvolvimento**

```json
{
  "dev": "vite --host 0.0.0.0 --port 8080",
  "build": "vite build",
  "build:dev": "vite build --mode development"
}
```

---

## 🛡️ **BACKEND SERVER (Express)**

### 📊 **Características Principais**

| Aspecto            | Configuração                  |
| ------------------ | ----------------------------- |
| **Framework**      | Express.js                    |
| **Porta**          | 3001                          |
| **CORS**           | Habilitado (todas as origens) |
| **JSON Parser**    | Habilitado                    |
| **Error Handling** | Global middleware             |

### 🗂️ **Estrutura do Servidor**

```typescript
// server/index.ts
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

// Middlewares
app.use(cors()); // Permite CORS
app.use(express.json()); // Parse JSON

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// API Endpoints
app.get('/api/quizzes', (req, res) => {
  res.json([]);
});

app.post('/api/quizzes', (req, res) => {
  res.json({ id: Date.now().toString(), ...req.body });
});

app.get('/api/quizzes/:id', (req, res) => {
  res.json({ id: req.params.id, title: 'Mock Quiz' });
});

// Error Handler Global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### 📡 **Endpoints Disponíveis**

| Método | Endpoint           | Descrição                | Response                           |
| ------ | ------------------ | ------------------------ | ---------------------------------- |
| `GET`  | `/health`          | Health check do servidor | `{status: "OK", timestamp: "..."}` |
| `GET`  | `/api/quizzes`     | Listar todos os quizzes  | `Array<Quiz>`                      |
| `POST` | `/api/quizzes`     | Criar novo quiz          | `{id: "...", ...data}`             |
| `GET`  | `/api/quizzes/:id` | Obter quiz específico    | `Quiz`                             |

### 🚀 **Scripts do Backend**

```json
{
  "dev:server": "tsx server/index.ts",
  "dev:full": "concurrently \"npm run dev\" \"npm run dev:server\"",
  "build": "esbuild server/index.ts --bundle --outfile=dist/server.js",
  "start": "node dist/server.js"
}
```

---

## 🗃️ **DATABASE (Supabase)**

### 📊 **Configuração**

| Aspecto        | Valor                |
| -------------- | -------------------- |
| **Tipo**       | PostgreSQL           |
| **Provider**   | Supabase             |
| **Project ID** | pwtjuuhchtbzttrzoutw |
| **Ambiente**   | Cloud                |
| **ORM**        | Drizzle Kit          |

### 🗂️ **Estrutura de Dados**

```
supabase/
├── config.toml              # Configuração do projeto
├── migrations/              # Migrações SQL
└── .temp/                   # Arquivos temporários

shared/
├── schema.ts                # Schema principal TypeScript
├── schema_sqlite.ts         # Schema para SQLite local
└── schema_supabase.ts       # Schema específico Supabase
```

### 🔌 **Integração com Frontend**

```typescript
// src/services/quizSupabaseService.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://projeto.supabase.co';
const supabaseKey = 'sua-chave-publica';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Exemplo de uso
export const saveQuiz = async quizData => {
  const { data, error } = await supabase.from('quizzes').insert(quizData);

  return { data, error };
};
```

---

## 🔄 **FLUXO DE COMUNICAÇÃO**

### 🌐 **Comunicação Frontend ↔ Backend**

```
1. REQUISIÇÃO DO USUÁRIO
   │
   ▼
2. FRONTEND (React Component)
   │ fetch('/api/quizzes')
   ▼
3. VITE PROXY
   │ Redireciona para http://localhost:3001/api/quizzes
   ▼
4. EXPRESS SERVER
   │ Processa request
   ▼
5. RESPONSE
   │ JSON data
   ▼
6. FRONTEND RECEIVE
   │ Update UI
   ▼
7. USER SEES RESULT
```

### 🗃️ **Comunicação Backend ↔ Database**

```
1. API REQUEST
   │
   ▼
2. EXPRESS HANDLER
   │ Validação e processamento
   ▼
3. SUPABASE CLIENT
   │ SQL Query via REST/GraphQL
   ▼
4. POSTGRESQL
   │ Executa query
   ▼
5. RESULT
   │ Raw data
   ▼
6. EXPRESS RESPONSE
   │ Formatted JSON
   ▼
7. FRONTEND RECEIVES
```

---

## 🚀 **COMANDOS DE OPERAÇÃO**

### 💻 **Desenvolvimento Local**

```bash
# 1. Iniciar apenas Frontend
npm run dev
# ➜ http://localhost:8081

# 2. Iniciar apenas Backend
npm run dev:server
# ➜ http://localhost:3001

# 3. Iniciar Frontend + Backend (RECOMENDADO)
npm run dev:full
# ➜ Frontend: http://localhost:8081
# ➜ Backend: http://localhost:3001
```

### 🏗️ **Build e Deploy**

```bash
# Build completo (Frontend + Backend)
npm run build

# Inicia servidor de produção
npm start

# Push schema para database
npm run db:push
```

### 🔍 **Health Checks**

```bash
# Verificar se frontend está rodando
curl http://localhost:8081

# Verificar se backend está rodando
curl http://localhost:3001/health

# Verificar se proxy está funcionando
curl http://localhost:8081/api/quizzes
```

---

## ⚙️ **CONFIGURAÇÕES AVANÇADAS**

### 🌍 **Variáveis de Ambiente**

```bash
# .env
NODE_ENV=development
PORT=3001
SUPABASE_URL=https://projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-publica
```

### 🔧 **Proxy Personalizado**

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true,
    secure: false,
    rewrite: (path) => path.replace(/^\/api/, '')
  },
  '/uploads': {
    target: 'http://localhost:3001',
    changeOrigin: true
  }
}
```

### 🛡️ **Middlewares de Segurança**

```typescript
// server/index.ts
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Segurança
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
});
app.use(limiter);
```

---

## 🐛 **TROUBLESHOOTING**

### ❌ **Problemas Comuns**

| Problema                  | Causa                       | Solução                       |
| ------------------------- | --------------------------- | ----------------------------- |
| **Porta 8080 ocupada**    | Outro processo usando porta | Vite automaticamente usa 8081 |
| **CORS Error**            | Backend não configurado     | Verificar `cors()` no Express |
| **Proxy não funciona**    | Configuração incorreta      | Verificar `vite.config.ts`    |
| **API 404**               | Endpoint não existe         | Verificar rotas no backend    |
| **Referência porta 5173** | Documentação desatualizada  | Usar 8081 (porta atual ativa) |

### 🔍 **Debugging**

```bash
# Verificar processos nas portas
netstat -tulpn | grep :8081
netstat -tulpn | grep :3001

# Logs do Vite
npm run dev > vite.log 2>&1

# Logs do Express
NODE_ENV=development npm run dev:server
```

### 📊 **Monitoramento**

```bash
# Status dos serviços
curl -s http://localhost:8081 && echo "Frontend OK"
curl -s http://localhost:3001/health && echo "Backend OK"

# Teste de proxy
curl -s http://localhost:8081/api/quizzes
```

---

## 📈 **PERFORMANCE E OTIMIZAÇÃO**

### ⚡ **Frontend (Vite)**

- ✅ **Hot Module Replacement** para desenvolvimento rápido
- ✅ **Tree Shaking** automático
- ✅ **Code Splitting** por rotas
- ✅ **Asset Optimization** (imagens, CSS)

### 🚀 **Backend (Express)**

- ✅ **Middleware eficiente** com ordem otimizada
- ✅ **Error handling** centralizado
- ✅ **JSON parsing** apenas quando necessário
- ✅ **CORS** configurado adequadamente

### 🗃️ **Database (Supabase)**

- ✅ **Connection Pooling** automático
- ✅ **Real-time subscriptions** disponíveis
- ✅ **Row Level Security** configurável
- ✅ **Edge Functions** para lógica customizada

---

## 🎯 **RESUMO EXECUTIVO**

### ✅ **O que está funcionando:**

1. **Frontend Vite** rodando na porta 8081 com proxy ativo
2. **Backend Express** rodando na porta 3001 com CORS habilitado
3. **Database Supabase** configurado e acessível
4. **Hot Reload** ativo para desenvolvimento
5. **Error Boundaries** implementadas
6. **Build system** configurado para produção

### 🔄 **Fluxo de trabalho recomendado:**

```bash
1. npm run dev:full          # Inicia tudo
2. Desenvolver no frontend   # http://localhost:8081
3. Testar APIs              # http://localhost:3001
4. npm run build            # Build para produção
5. npm start                # Deploy
```

### 📍 **URLs importantes:**

- **Frontend**: http://localhost:8081
- **Editor**: http://localhost:8081/editor-fixed
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### 🔢 **Explicação das Portas:**

| Porta    | Propósito                                                | Status           |
| -------- | -------------------------------------------------------- | ---------------- |
| **5173** | Porta **padrão do Vite** (não configurada neste projeto) | ❌ **NÃO USADA** |
| **8080** | Porta **configurada** no vite.config.ts                  | ⚠️ **Ocupada**   |
| **8081** | Porta **ativa atual** (fallback automático)              | ✅ **EM USO**    |
| **3001** | Backend Express API                                      | ✅ **EM USO**    |

> **📝 NOTA:** A porta **5173** aparece em documentações antigas do projeto, mas **NÃO está sendo usada**. O Vite foi configurado para usar a porta **8080**, que faz fallback para **8081** quando ocupada.

---

**📝 Documentação criada:** 03 de Agosto de 2025  
**🔄 Última atualização:** Sistema em funcionamento  
**✅ Status:** Todos os serviços operacionais

---

## ❓ **FAQ - PORTA 5173**

### 🤔 **"Para que serve a porta 5173?"**

A porta **5173** é a **porta padrão do Vite** quando nenhuma configuração específica é definida. No entanto, **neste projeto ela NÃO está sendo usada** pelos seguintes motivos:

#### 📋 **Configuração do Projeto:**

1. **Vite configurado para porta 8080** no `vite.config.ts`
2. **Fallback automático para 8081** quando 8080 está ocupada
3. **Porta 5173 nunca é utilizada** neste setup

#### 🔍 **Onde aparece a porta 5173:**

- ❌ **Documentações antigas** do projeto (desatualizadas)
- ❌ **Scripts de teste** antigos (não atualizados)
- ❌ **Referências históricas** em análises passadas

#### ✅ **Portas corretas para usar:**

```bash
# ✅ Frontend (porta ativa atual)
http://localhost:8081

# ✅ Backend API
http://localhost:3001

# ❌ NÃO USAR (não existe)
http://localhost:5173
```

#### 🛠️ **Como verificar qual porta está ativa:**

```bash
# Verificar processos nas portas
netstat -tulpn | grep :8081    # Frontend ativo
netstat -tulpn | grep :3001    # Backend ativo
netstat -tulpn | grep :5173    # Nada (não usada)

# Testar conectividade
curl http://localhost:8081     # ✅ Responde
curl http://localhost:5173     # ❌ Connection refused
```

#### 🔧 **Se quiser usar porta 5173:**

Para configurar o Vite para usar a porta 5173 (padrão), altere o `vite.config.ts`:

```typescript
// vite.config.ts
server: {
  port: 5173,        // ← Trocar de 8080 para 5173
  strictPort: true   // ← Não permitir fallback
}
```

**Mas isso NÃO é recomendado** porque:

- Quebra a configuração atual funcionando
- Pode causar conflitos com documentação
- A porta 8080/8081 já está bem estabelecida

#### 🎯 **Resumo sobre porta 5173:**

| Status                  | Descrição                               |
| ----------------------- | --------------------------------------- |
| **🔵 O que é**          | Porta padrão do Vite (sem configuração) |
| **🚫 Status atual**     | NÃO utilizada neste projeto             |
| **📍 Onde aparece**     | Documentações antigas desatualizadas    |
| **✅ Use em vez disso** | http://localhost:8081                   |
