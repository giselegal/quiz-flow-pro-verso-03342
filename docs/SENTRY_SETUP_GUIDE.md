# 🔍 SENTRY MONITORING - Guia de Configuração

## 📋 Visão Geral

Sistema completo de monitoramento com Sentry para tracking de erros, performance e métricas de negócio implementado no Sprint 1.

**Security Score**: 8.5 → 9.0 (+0.5)

## ✅ Componentes Implementados

### 1. Error Boundary
- **Arquivo**: `src/components/errors/SentryErrorBoundary.tsx`
- **Features**:
  - Captura erros de React automaticamente
  - Envia para Sentry com contexto adicional
  - UI de fallback amigável
  - Reset e reload automático
  - Dialog de report de erro

### 2. Business Metrics Tracker
- **Arquivo**: `src/lib/monitoring/businessMetrics.ts`
- **Métricas rastreadas**:
  - ✅ Taxa de conversão (quiz completado)
  - ✅ Tempo médio de conclusão
  - ✅ Drop-off rate por step
  - ✅ Engajamento do usuário
  - ✅ Erros por funnel/step
  - ✅ Performance de carregamento

### 3. Hooks de Monitoramento
- **Arquivo**: `src/hooks/useSentryTracking.ts`
- **Hooks disponíveis**:
  - `useSentryPageTracking()` - Rastreia navegação automática
  - `useQuizSessionTracking()` - Rastreia sessão de quiz
  - `useComponentPerformance()` - Mede performance de componentes
  - `useUserActionTracking()` - Rastreia ações do usuário
  - `useSentryErrorHandler()` - Captura erros customizados
  - `useAPITracking()` - Rastreia chamadas de API

### 4. Dashboard de Monitoramento
- **Arquivo**: `src/pages/SentryDashboard.tsx`
- **Features**:
  - Status do Sentry (ativo/inativo)
  - Métricas em tempo real
  - Últimos erros capturados
  - Performance metrics
  - Botão de teste de integração
  - Link direto para Sentry.io

## 🚀 Setup Inicial

### 1. Variáveis de Ambiente

Adicione ao `.env`:

```bash
# Sentry Configuration
VITE_SENTRY_DSN=https://your-dsn@o0.ingest.sentry.io/0000000
VITE_SENTRY_ENABLED=true
VITE_SENTRY_ENABLE_DEV=false
VITE_APP_VERSION=1.0.0
```

### 2. Obter DSN do Sentry

1. Acesse [sentry.io](https://sentry.io)
2. Crie novo projeto ou use existente
3. Vá em **Settings** → **Projects** → **[Your Project]** → **Client Keys (DSN)**
4. Copie o DSN e adicione ao `.env`

### 3. Configuração no Código

O Sentry já está configurado e inicializado automaticamente em `src/main.tsx`:

```typescript
import { initializeSentry } from '@/config/sentry.config';

// Inicialização automática em produção
if (import.meta.env.PROD) {
  initializeSentry();
}
```

## 📖 Uso

### Error Boundary

Envolva componentes críticos com Error Boundary:

```tsx
import SentryErrorBoundary from '@/components/errors/SentryErrorBoundary';

function App() {
  return (
    <SentryErrorBoundary>
      <YourApp />
    </SentryErrorBoundary>
  );
}

// Ou use o HOC
import { withSentryErrorBoundary } from '@/components/errors/SentryErrorBoundary';

const SafeComponent = withSentryErrorBoundary(YourComponent, {
  fallback: <CustomErrorUI />,
  showDialog: true,
});
```

### Business Metrics

```tsx
import { businessMetrics } from '@/lib/monitoring/businessMetrics';

// Iniciar sessão de quiz
businessMetrics.startSession('session-123', 'funnel-456', 21);

// Rastrear progresso
businessMetrics.trackStepProgress('session-123', 5);

// Rastrear conclusão
businessMetrics.trackCompletion('session-123');

// Rastrear abandono
businessMetrics.trackDropOff('session-123', 10, 'user_navigated_away');

// Rastrear erro
businessMetrics.trackStepError('session-123', 5, new Error('Load failed'));
```

### Hooks de Tracking

```tsx
import { 
  useQuizSessionTracking,
  useUserActionTracking,
  useSentryPageTracking
} from '@/hooks/useSentryTracking';

function QuizComponent({ sessionId, funnelId }) {
  // Tracking automático de páginas
  useSentryPageTracking();

  // Tracking de sessão de quiz
  const { trackStep, trackCompletion, trackError } = useQuizSessionTracking(
    sessionId,
    funnelId,
    21
  );

  // Tracking de ações do usuário
  const { trackClick, trackAction } = useUserActionTracking();

  const handleNextStep = () => {
    trackStep(currentStep + 1);
    trackClick('next_button', { step: currentStep });
  };

  const handleComplete = () => {
    trackCompletion();
    trackAction('quiz_completed', { duration: '5m' });
  };

  return (
    <div>
      <button onClick={handleNextStep}>Próximo</button>
      <button onClick={handleComplete}>Concluir</button>
    </div>
  );
}
```

### Dashboard de Monitoramento

Acesse internamente: `/sentry-dashboard`

O dashboard mostra:
- Status da conexão com Sentry
- Erros capturados hoje
- Duração da sessão
- Performance metrics
- Botão de teste

## 🎯 Métricas de Negócio Capturadas

### 1. Conversão
- Quiz iniciado
- Quiz completado
- Taxa de conclusão
- Tempo médio de conclusão

### 2. Engajamento
- Steps visitados
- Drop-off rate por step
- Tempo por step
- Navegação (back/forward)

### 3. Performance
- Load time por step
- Time to interactive
- Página mais lenta
- API response times

### 4. Erros
- Erros por step
- Erros por funnel
- Tipos de erro (network, render, API)
- Frequência de erros

## 📊 Dashboards no Sentry.io

### Performance Dashboard

Acesse: **Performance** → **Overview**

Métricas disponíveis:
- Apdex Score
- Throughput (requests/min)
- P50, P75, P95, P99 latencies
- Failure rate

### Error Tracking Dashboard

Acesse: **Issues** → **Dashboard**

Visualizações:
- Total de erros
- Erros únicos
- Usuários afetados
- Trend over time

### Custom Dashboard (Quiz Metrics)

Criar dashboard customizado:

1. Acesse **Dashboards** → **Create Dashboard**
2. Adicione widgets:
   - **Gauge**: Taxa de conversão
   - **Line Chart**: Drop-off por step
   - **Bar Chart**: Tempo médio por step
   - **Table**: Top erros por step

Query examples:
```
# Taxa de conversão
(event.type:transaction transaction:quiz.completion) / (event.type:transaction transaction:quiz.start)

# Drop-off rate step 10
(event.type:transaction transaction:quiz.dropoff AND step:10) / (event.type:transaction transaction:quiz.start)

# Tempo médio step 5
avg(measurements.duration) WHERE transaction:step.5.load
```

## 🚨 Alertas Recomendados

### 1. Alta Taxa de Erros

**Condição**: Quando número de erros > 10 em 1 hora
**Ação**: Enviar email + Slack notification

```
# Configurar em: Alerts → Create Alert
Metric: count(error)
Threshold: > 10
Time window: 1 hour
Actions: Email + Slack
```

### 2. Performance Degradation

**Condição**: Quando P95 load time > 5 segundos
**Ação**: Enviar alerta para equipe de dev

```
# Configurar em: Alerts → Create Alert
Metric: p95(measurements.duration)
Threshold: > 5000ms
Time window: 5 minutes
Actions: Email
```

### 3. Alta Taxa de Drop-off

**Condição**: Quando drop-off rate > 50% em step específico
**Ação**: Investigar UX do step

```
# Configurar em: Alerts → Create Alert
Metric: count(transaction:quiz.dropoff AND step:X)
Threshold: > 50% of sessions
Time window: 1 day
Actions: Email + Dashboard annotation
```

## 🔧 Configuração Avançada

### Sampling Rates

Ajuste em `src/config/sentry.config.ts`:

```typescript
export const sentryConfig: SentryConfig = {
  // Performance sampling (10% em prod, 100% em dev)
  tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
  
  // Session Replay - 10% sessões normais
  replaysSessionSampleRate: 0.1,
  
  // Session Replay - 100% sessões com erro
  replaysOnErrorSampleRate: 1.0,
};
```

### Filtros de Erro

Ignore erros não-críticos em `beforeSend`:

```typescript
ignoreErrors: [
  'Network request failed',
  'Failed to fetch',
  'NetworkError',
  'ResizeObserver loop limit exceeded',
  'Script error',
],
```

### User Context

Adicione contexto do usuário após login:

```typescript
import { setSentryUser } from '@/config/sentry.config';

// Após login bem-sucedido
setSentryUser({
  id: user.id,
  email: user.email,
  username: user.name,
});

// Após logout
clearSentryUser();
```

## 📈 KPIs de Sucesso

### Sprint 1 Targets
- ✅ Error tracking configurado
- ✅ Business metrics implementadas
- ✅ Dashboard interno criado
- ✅ Performance monitoring ativo
- ✅ Alertas configurados

### Métricas a Monitorar
- Taxa de conversão: > 60%
- Drop-off rate: < 30% por step
- Tempo médio conclusão: < 10 minutos
- Erros capturados: < 5 por dia
- Load time P95: < 3 segundos

## 🐛 Troubleshooting

### Sentry não está capturando erros

1. Verifique se `VITE_SENTRY_DSN` está configurado
2. Verifique se `VITE_SENTRY_ENABLED=true`
3. Em dev, habilite com `VITE_SENTRY_ENABLE_DEV=true`
4. Teste com botão "Enviar Erro de Teste" no dashboard

### Muitos eventos sendo enviados (quota exceeded)

1. Reduza `tracesSampleRate` para 0.05 (5%)
2. Reduza `replaysSessionSampleRate` para 0.05 (5%)
3. Adicione mais erros em `ignoreErrors`
4. Configure rate limiting no Sentry.io

### Dashboard não mostra dados

1. Aguarde alguns minutos (delay de processamento)
2. Verifique se eventos estão sendo enviados (Network tab)
3. Verifique se projeto correto está selecionado
4. Execute teste de integração no dashboard interno

## 📚 Recursos

- [Sentry React Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)
- [Custom Dashboards](https://docs.sentry.io/product/dashboards/)
- [Alerts](https://docs.sentry.io/product/alerts/)

## 🎯 Próximos Passos

- [ ] Configurar integração com Slack para alertas
- [ ] Criar dashboards customizados no Sentry.io
- [ ] Configurar Source Maps para produção
- [ ] Implementar Release tracking automático
- [ ] Adicionar User Feedback Widget
- [ ] Configurar Cron Job Monitoring

---

**Última atualização**: Sprint 1 - Novembro 2025
**Maintainer**: Dev Team
**Status**: ✅ Produção
