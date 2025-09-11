# Configurações de Logging por Ambiente

## Configuração para Desenvolvimento

### .env.development
```bash
# Logging completo para desenvolvimento
VITE_LOG_LEVEL=DEBUG
VITE_ENABLE_DEBUG_LOGGING=true
VITE_ENABLE_PERFORMANCE_LOGGING=true
VITE_ENABLE_STORAGE_LOGGING=true
VITE_ENABLE_REMOTE_LOGGING=false
VITE_LOG_INCLUDE_STACK_TRACE=true
VITE_MAX_LOG_BUFFER_SIZE=100
VITE_LOG_FLUSH_INTERVAL=5000
```

### Características
- Todos os níveis de log (DEBUG+)
- Performance tracking habilitado
- Stack traces incluídos
- Storage local habilitado
- Formatação legível para desenvolvimento
- Buffer pequeno para feedback rápido

## Configuração para Produção

### .env.production
```bash
# Logging otimizado para produção
VITE_LOG_LEVEL=WARN
VITE_ENABLE_DEBUG_LOGGING=false
VITE_ENABLE_PERFORMANCE_LOGGING=false
VITE_ENABLE_STORAGE_LOGGING=true
VITE_ENABLE_REMOTE_LOGGING=true
VITE_LOGGING_ENDPOINT=https://logs.yourcompany.com/api/logs
VITE_LOGGING_API_KEY=your-api-key-here
VITE_LOG_INCLUDE_STACK_TRACE=false
VITE_MAX_LOG_BUFFER_SIZE=50
VITE_LOG_FLUSH_INTERVAL=10000
VITE_ENABLE_LOG_RATE_LIMITING=true
VITE_ENABLE_SENSITIVE_DATA_FILTER=true
```

### Características
- Apenas WARN e ERROR
- Sem debug ou performance logs
- Remote logging habilitado
- Filtros de dados sensíveis
- Rate limiting ativo
- Buffer maior para eficiência

## Configuração para Staging

### .env.staging
```bash
# Logging intermediário para staging
VITE_LOG_LEVEL=INFO
VITE_ENABLE_DEBUG_LOGGING=false
VITE_ENABLE_PERFORMANCE_LOGGING=true
VITE_ENABLE_STORAGE_LOGGING=true
VITE_ENABLE_REMOTE_LOGGING=true
VITE_LOGGING_ENDPOINT=https://logs-staging.yourcompany.com/api/logs
VITE_LOGGING_API_KEY=your-staging-api-key
VITE_LOG_INCLUDE_STACK_TRACE=true
VITE_MAX_LOG_BUFFER_SIZE=75
VITE_LOG_FLUSH_INTERVAL=7500
```

### Características
- INFO, WARN e ERROR
- Performance tracking para testes
- Remote logging para análise
- Stack traces para debugging

## Configuração para Testes

### .env.test
```bash
# Logging mínimo para testes
VITE_LOG_LEVEL=ERROR
VITE_ENABLE_DEBUG_LOGGING=false
VITE_ENABLE_PERFORMANCE_LOGGING=false
VITE_ENABLE_STORAGE_LOGGING=false
VITE_ENABLE_REMOTE_LOGGING=false
VITE_LOG_INCLUDE_STACK_TRACE=false
VITE_MAX_LOG_BUFFER_SIZE=1
VITE_LOG_FLUSH_INTERVAL=100
```

### Características
- Apenas ERROR
- Sem storage ou remote logging
- Buffer mínimo para performance dos testes
- Flush rápido

## Configuração Avançada

### Feature Flags por Ambiente

```javascript
// src/utils/logging/environments.ts
export const LoggingEnvironments = {
  development: {
    minLevel: 'DEBUG',
    enableDebug: true,
    enablePerformance: true,
    enableStorage: true,
    enableRemote: false,
    includeStackTrace: true,
    defaultFormatter: 'dev',
    batchSize: 10,
    flushInterval: 5000
  },
  
  staging: {
    minLevel: 'INFO',
    enableDebug: false,
    enablePerformance: true,
    enableStorage: true,
    enableRemote: true,
    includeStackTrace: true,
    defaultFormatter: 'json',
    batchSize: 25,
    flushInterval: 7500
  },
  
  production: {
    minLevel: 'WARN',
    enableDebug: false,
    enablePerformance: false,
    enableStorage: true,
    enableRemote: true,
    includeStackTrace: false,
    defaultFormatter: 'json',
    batchSize: 50,
    flushInterval: 10000,
    enableRateLimit: true,
    enableSensitiveDataFilter: true
  },
  
  test: {
    minLevel: 'ERROR',
    enableDebug: false,
    enablePerformance: false,
    enableStorage: false,
    enableRemote: false,
    includeStackTrace: false,
    defaultFormatter: 'json',
    batchSize: 1,
    flushInterval: 100
  }
} as const;
```

## Configuração de Contextos

### Contextos Habilitados por Ambiente

```javascript
// Desenvolvimento - todos os contextos
const devContexts = ['*'];

// Produção - apenas contextos críticos
const prodContexts = [
  'error',
  'api',
  'auth',
  'payment',
  'security'
];

// Staging - contextos de análise
const stagingContexts = [
  'error',
  'api',
  'auth',
  'performance',
  'user-interaction'
];
```

### Configuração Dinâmica

```javascript
// src/utils/logging/dynamic-config.ts
export const getDynamicLogConfig = () => {
  const env = import.meta.env.NODE_ENV;
  const baseConfig = LoggingEnvironments[env];
  
  // Override baseado em feature flags
  if (import.meta.env.VITE_FEATURE_VERBOSE_LOGGING === 'true') {
    baseConfig.minLevel = 'DEBUG';
    baseConfig.enableDebug = true;
  }
  
  // Override baseado em parâmetros de URL (apenas dev/staging)
  if (env !== 'production') {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('debug') === 'true') {
      baseConfig.minLevel = 'DEBUG';
      baseConfig.enableDebug = true;
    }
    
    if (urlParams.get('perf') === 'true') {
      baseConfig.enablePerformance = true;
    }
  }
  
  return baseConfig;
};
```

## Monitoramento por Ambiente

### Desenvolvimento
- Logs no console do browser
- Storage local para histórico
- Ferramentas de dev integradas

### Staging
- Remote logging para análise
- Métricas de performance
- Testes de integração com monitoring

### Produção
- Remote logging obrigatório
- Alertas em tempo real
- Dashboards de monitoramento
- Retenção de logs configurável

## Troubleshooting por Ambiente

### Problemas Comuns

#### Desenvolvimento
- Muitos logs impactando performance
- Console poluído com informações irrelevantes

**Solução:** Use filtros de contexto específicos

#### Staging
- Logs não chegando ao endpoint remoto
- Performance degradada com logging

**Solução:** Verifique configuração de rede e ajuste batch sizes

#### Produção
- Logs críticos não sendo capturados
- Overhead de logging em operações críticas

**Solução:** Revise níveis de log e use async batching

### Scripts de Validação

```bash
# validate-logging-config.sh
#!/bin/bash

ENV=${1:-development}

echo "Validando configuração de logging para $ENV..."

# Verificar variáveis de ambiente necessárias
if [ "$ENV" = "production" ]; then
  if [ -z "$VITE_LOGGING_ENDPOINT" ]; then
    echo "ERROR: VITE_LOGGING_ENDPOINT necessário para produção"
    exit 1
  fi
  
  if [ -z "$VITE_LOGGING_API_KEY" ]; then
    echo "ERROR: VITE_LOGGING_API_KEY necessário para produção"
    exit 1
  fi
fi

echo "Configuração válida para $ENV!"
```
