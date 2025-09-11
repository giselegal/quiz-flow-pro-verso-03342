# 🔧 Variáveis de Ambiente - Quiz Quest Challenge Verse

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Variáveis do Supabase](#variáveis-do-supabase)
3. [Variáveis do Editor](#variáveis-do-editor)
4. [Variáveis de API](#variáveis-de-api)
5. [Variáveis de Integração](#variáveis-de-integração)
6. [Variáveis de Desenvolvimento](#variáveis-de-desenvolvimento)
7. [Configuração por Ambiente](#configuração-por-ambiente)
8. [Exemplos de Uso](#exemplos-de-uso)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O sistema utiliza variáveis de ambiente para configurar diferentes aspectos da aplicação. Todas as variáveis que começam com `VITE_` são expostas ao frontend, enquanto outras são apenas para backend/build.

### Estrutura do Arquivo

```bash
# Arquivo: .env.local (ou .env)
.env.example        # 📋 Template com todas as variáveis
.env.local          # 🔒 Configuração local (ignorado pelo git)
.env.development    # 🧪 Ambiente de desenvolvimento
.env.production     # 🚀 Ambiente de produção
```

---

## 🗄️ Variáveis do Supabase

### **Configuração Principal**

```bash
# URL principal do projeto Supabase
VITE_SUPABASE_URL=https://pwtjuuhchtbzttrzoutw.supabase.co

# Chave pública (anon key) - segura para frontend
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Uso no código:**
```typescript
// src/config/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### **Configuração de Backend (Opcional)**

```bash
# Para scripts de migração/admin (NÃO expor ao frontend)
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIs...

# Chave anônima para diagnósticos (alternativa)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

**Uso em scripts:**
```typescript
// scripts/migrate.ts
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);
```

---

## ✏️ Variáveis do Editor

### **Configuração do Editor de Funil**

```bash
# ✅ Habilita persistência no Supabase (RECOMENDADO: true)
VITE_EDITOR_SUPABASE_ENABLED=true

# 🎯 Funil padrão para desenvolvimento
VITE_DEFAULT_FUNNEL_ID=funnel-1753409877331

# 📊 Modo debug - logs detalhados (DESENVOLVIMENTO: true, PRODUÇÃO: false)
VITE_EDITOR_DEBUG_MODE=false
```

**Funis Disponíveis:**
```bash
# Opções para VITE_DEFAULT_FUNNEL_ID:
funnel-1753409877331        # 🌟 Quiz CaktoQuiz - Descubra Seu Estilo (RECOMENDADO)
funnel_1753398563214_ue1fn5gvl  # 🧪 Funnel Teste Final
funnel-local-dev            # 📱 Desenvolvimento local
```

**Uso no código:**
```typescript
// src/pages/MainEditorUnified.tsx
const supabaseConfig = {
  enabled: import.meta.env.VITE_EDITOR_SUPABASE_ENABLED === 'true',
  funnelId: funnelId || import.meta.env.VITE_DEFAULT_FUNNEL_ID,
  debugMode: import.meta.env.VITE_EDITOR_DEBUG_MODE === 'true'
};

// Uso condicional
if (supabaseConfig.debugMode) {
  console.log('🐛 Editor Debug Mode ativo');
}
```

### **Configurações Avançadas do Editor**

```bash
# Configuração de persistência automática
VITE_AUTO_SAVE_INTERVAL=5000        # Intervalo de auto-save (ms)
VITE_AUTO_SAVE_ENABLED=true         # Habilita auto-save

# Configurações de performance
VITE_LAZY_LOADING_ENABLED=true      # Habilita lazy loading
VITE_PERFORMANCE_MONITORING=true    # Monitoring de performance

# Configurações de template
VITE_DEFAULT_TEMPLATE_ID=quiz-completo  # Template padrão
VITE_TEMPLATE_CACHE_TTL=3600        # TTL do cache de templates (segundos)
```

---

## 🌐 Variáveis de API

### **URLs Base**

```bash
# URL da API principal
VITE_API_URL=http://localhost:3000

# URL do CDN para assets
VITE_CDN_URL=https://cdn.example.com

# URL do webhook Hotmart
VITE_HOTMART_WEBHOOK_URL=/api/webhook/hotmart
```

**Uso no código:**
```typescript
// src/config/api.ts
const apiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  cdnURL: import.meta.env.VITE_CDN_URL || '',
  timeout: 10000,
};

// Cliente HTTP
export const apiClient = axios.create(apiConfig);

// Helper para URLs de assets
export const getAssetUrl = (path: string) => {
  const cdnUrl = import.meta.env.VITE_CDN_URL;
  return cdnUrl ? `${cdnUrl}${path}` : path;
};
```

---

## 🔗 Variáveis de Integração

### **Facebook Pixel & Conversions API**

```bash
# ID do pixel do Facebook
FACEBOOK_PIXEL_ID=123456789012345

# Token de acesso para Conversions API
FACEBOOK_ACCESS_TOKEN=your_facebook_access_token_here

# Código de teste para eventos
FACEBOOK_TEST_EVENT_CODE=TEST12345
```

**Uso no código:**
```typescript
// src/integrations/facebook.ts
export const initFacebookPixel = () => {
  const pixelId = process.env.FACEBOOK_PIXEL_ID;
  
  if (pixelId && typeof window !== 'undefined') {
    // Inicializar pixel
    fbq('init', pixelId);
    fbq('track', 'PageView');
  }
};

// Para events server-side
const sendConversionEvent = async (eventData: any) => {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const pixelId = process.env.FACEBOOK_PIXEL_ID;
  
  if (!accessToken || !pixelId) {
    console.warn('Facebook Conversions API não configurado');
    return;
  }
  
  // Enviar evento...
};
```

### **Hotmart Webhook**

```bash
# Chave secreta do webhook Hotmart
HOTMART_WEBHOOK_SECRET=your_hotmart_webhook_secret_here
```

**Uso no código:**
```typescript
// pages/api/webhook/hotmart.ts
import crypto from 'crypto';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const signature = req.headers['x-hotmart-signature'];
  const secret = process.env.HOTMART_WEBHOOK_SECRET;
  
  if (!secret) {
    return res.status(500).json({ error: 'Webhook secret não configurado' });
  }
  
  // Verificar signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Signature inválida' });
  }
  
  // Processar webhook...
}
```

---

## 🛠️ Variáveis de Desenvolvimento

### **Node.js e Build**

```bash
# Ambiente de execução
NODE_ENV=development              # development | production | test

# Configuração do Vite
VITE_MODE=development            # Modo do Vite
VITE_BUILD_TARGET=es2020         # Target da build

# Configuração de testes
VITEST=false                     # Flag para ambiente de teste
```

**Uso no código:**
```typescript
// Verificações condicionais
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

// Configurações específicas
if (isDev) {
  // Configurações de desenvolvimento
  console.log('🛠️ Modo desenvolvimento ativo');
}

// No vite.config.ts
export default defineConfig({
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VITEST': JSON.stringify(process.env.VITEST || false),
  },
});
```

### **Configurações de Debug**

```bash
# Debug geral da aplicação
DEBUG=quiz-quest:*               # Debug pattern para logs

# Debug específico do editor
VITE_EDITOR_VERBOSE_LOGGING=false   # Logs verbosos do editor
VITE_PERFORMANCE_DEBUG=false        # Debug de performance
VITE_CONTEXT_DEBUG=false            # Debug dos contextos React

# Debug de rede
VITE_API_DEBUG=false             # Debug das chamadas de API
VITE_SUPABASE_DEBUG=false        # Debug do Supabase
```

---

## 🚀 Configuração por Ambiente

### **Desenvolvimento Local**

```bash
# .env.local
NODE_ENV=development
VITE_EDITOR_SUPABASE_ENABLED=true
VITE_DEFAULT_FUNNEL_ID=funnel-1753409877331
VITE_EDITOR_DEBUG_MODE=true
VITE_API_URL=http://localhost:3000
VITE_PERFORMANCE_DEBUG=true
DEBUG=quiz-quest:*
```

### **Staging/Homologação**

```bash
# .env.staging
NODE_ENV=production
VITE_EDITOR_SUPABASE_ENABLED=true
VITE_DEFAULT_FUNNEL_ID=funnel-staging
VITE_EDITOR_DEBUG_MODE=false
VITE_API_URL=https://staging-api.quizquest.com
VITE_CDN_URL=https://staging-cdn.quizquest.com
```

### **Produção**

```bash
# .env.production
NODE_ENV=production
VITE_EDITOR_SUPABASE_ENABLED=true
VITE_DEFAULT_FUNNEL_ID=funnel-production
VITE_EDITOR_DEBUG_MODE=false
VITE_API_URL=https://api.quizquest.com
VITE_CDN_URL=https://cdn.quizquest.com

# Integrações
FACEBOOK_PIXEL_ID=seu_pixel_id_real
HOTMART_WEBHOOK_SECRET=sua_chave_secreta_real
```

---

## 💡 Exemplos de Uso

### **1. Configuração Condicional**

```typescript
// src/config/app.ts
export const AppConfig = {
  // API
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  cdnUrl: import.meta.env.VITE_CDN_URL || '',
  
  // Editor
  editor: {
    supabaseEnabled: import.meta.env.VITE_EDITOR_SUPABASE_ENABLED === 'true',
    defaultFunnelId: import.meta.env.VITE_DEFAULT_FUNNEL_ID || 'local-funnel',
    debugMode: import.meta.env.VITE_EDITOR_DEBUG_MODE === 'true',
    autoSaveInterval: parseInt(import.meta.env.VITE_AUTO_SAVE_INTERVAL || '5000'),
  },
  
  // Integrações
  integrations: {
    facebookPixelId: import.meta.env.VITE_FACEBOOK_PIXEL_ID,
    hotmartWebhookEnabled: !!import.meta.env.HOTMART_WEBHOOK_SECRET,
  },
  
  // Features flags
  features: {
    performanceMonitoring: import.meta.env.VITE_PERFORMANCE_MONITORING === 'true',
    lazyLoading: import.meta.env.VITE_LAZY_LOADING_ENABLED !== 'false', // default true
  },
  
  // Environment info
  environment: {
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    mode: import.meta.env.MODE,
  }
};
```

### **2. Hook para Configurações**

```typescript
// src/hooks/useAppConfig.ts
import { AppConfig } from '../config/app';

export const useAppConfig = () => {
  const config = AppConfig;
  
  // Helper functions
  const isFeatureEnabled = (feature: keyof typeof config.features) => {
    return config.features[feature] === true;
  };
  
  const getApiUrl = (path: string = '') => {
    return `${config.apiUrl}${path}`;
  };
  
  const getCdnUrl = (asset: string) => {
    if (!config.cdnUrl) return asset;
    return `${config.cdnUrl}${asset}`;
  };
  
  const logConfig = () => {
    if (config.environment.isDev) {
      console.table(config);
    }
  };
  
  return {
    config,
    isFeatureEnabled,
    getApiUrl,
    getCdnUrl,
    logConfig,
    
    // Shortcuts
    isDev: config.environment.isDev,
    isProd: config.environment.isProd,
    debugMode: config.editor.debugMode,
  };
};

// Uso no componente
const MyComponent = () => {
  const { config, isFeatureEnabled, debugMode } = useAppConfig();
  
  useEffect(() => {
    if (debugMode) {
      console.log('Componente carregado com debug ativo');
    }
  }, [debugMode]);
  
  return (
    <div>
      {isFeatureEnabled('performanceMonitoring') && (
        <PerformanceMonitor />
      )}
    </div>
  );
};
```

### **3. Validação de Configuração**

```typescript
// src/utils/configValidation.ts
export const validateConfig = () => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validações obrigatórias
  if (!import.meta.env.VITE_SUPABASE_URL) {
    errors.push('VITE_SUPABASE_URL é obrigatório');
  }
  
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    errors.push('VITE_SUPABASE_ANON_KEY é obrigatório');
  }
  
  // Validações de formato
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
    warnings.push('VITE_SUPABASE_URL deve usar HTTPS');
  }
  
  // Validações de ambiente
  if (import.meta.env.PROD && import.meta.env.VITE_EDITOR_DEBUG_MODE === 'true') {
    warnings.push('Debug mode ativo em produção');
  }
  
  // Log dos resultados
  if (errors.length > 0) {
    console.error('❌ Erros de configuração:', errors);
    throw new Error('Configuração inválida');
  }
  
  if (warnings.length > 0) {
    console.warn('⚠️ Avisos de configuração:', warnings);
  }
  
  console.log('✅ Configuração válida');
};

// Executar na inicialização
// src/main.tsx
validateConfig();
```

---

## 🔍 Troubleshooting

### **Problemas Comuns**

#### 1. **Variável não encontrada**
```typescript
// ❌ Problema
const apiUrl = process.env.VITE_API_URL; // undefined no frontend

// ✅ Solução
const apiUrl = import.meta.env.VITE_API_URL; // Correto para Vite
```

#### 2. **Variável não carregada**
```bash
# Verificar se o arquivo .env.local existe
# Verificar se as variáveis começam com VITE_ (para frontend)
# Restart do servidor de desenvolvimento
```

#### 3. **Configuração diferente por ambiente**
```typescript
// Usar arquivos específicos:
// .env.local          - Local (maior prioridade)
// .env.development    - Desenvolvimento
// .env.production     - Produção
// .env               - Padrão (menor prioridade)
```

### **Debug de Configuração**

```typescript
// src/utils/debugConfig.ts
export const debugConfig = () => {
  console.group('🔧 Configuração da Aplicação');
  
  console.log('Environment:', {
    NODE_ENV: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
  });
  
  console.log('Supabase:', {
    url: import.meta.env.VITE_SUPABASE_URL ? '✅' : '❌',
    key: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅' : '❌',
  });
  
  console.log('Editor:', {
    enabled: import.meta.env.VITE_EDITOR_SUPABASE_ENABLED,
    funnelId: import.meta.env.VITE_DEFAULT_FUNNEL_ID,
    debug: import.meta.env.VITE_EDITOR_DEBUG_MODE,
  });
  
  console.log('API:', {
    url: import.meta.env.VITE_API_URL,
    cdn: import.meta.env.VITE_CDN_URL || 'não configurado',
  });
  
  console.groupEnd();
};

// Executar no console do navegador:
// debugConfig();
```

### **Comandos Úteis**

```bash
# Listar variáveis de ambiente (desenvolvimento)
npm run dev -- --debug

# Verificar build com variáveis
npm run build && npm run preview

# Debug específico
DEBUG=quiz-quest:* npm run dev

# Limpar cache e reinstalar
rm -rf node_modules .vite dist
npm install
npm run dev
```

---

## ✅ Checklist de Configuração

### **Para Desenvolvimento**
- [ ] Arquivo `.env.local` criado
- [ ] `VITE_SUPABASE_URL` configurado
- [ ] `VITE_SUPABASE_ANON_KEY` configurado  
- [ ] `VITE_EDITOR_SUPABASE_ENABLED=true`
- [ ] `VITE_DEFAULT_FUNNEL_ID` definido
- [ ] `VITE_EDITOR_DEBUG_MODE=true`

### **Para Produção**
- [ ] Todas as variáveis obrigatórias configuradas
- [ ] `VITE_EDITOR_DEBUG_MODE=false`
- [ ] URLs de API apontam para produção
- [ ] Chaves de integração (Facebook, Hotmart) configuradas
- [ ] `NODE_ENV=production`
- [ ] Validação de configuração passou

### **Segurança**
- [ ] Chaves secretas não expostas ao frontend
- [ ] Arquivo `.env.local` no `.gitignore`
- [ ] URLs HTTPS em produção
- [ ] Tokens com permissões mínimas necessárias

---

**🔒 Lembre-se:** Nunca commite arquivos `.env.local` ou `.env.production` no git! Use apenas `.env.example` como template.
