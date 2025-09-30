# Unified Analytics (Fase 1)

Este módulo introduz o modelo unificado de eventos e o `UnifiedEventTracker`.

## Componentes Atuais
- `types.ts`: Tipos e interfaces centrais.
- `UnifiedEventTracker.ts`: Tracker com buffer, flush automático e persistência offline.
- Migração: `supabase/migrations/20250930120000_create_unified_events.sql` cria tabela `unified_events`.

## Feature Flag
Ativar via variável: `VITE_ENABLE_UNIFIED_ANALYTICS=true`.
Se desativado, eventos são ignorados (sem erro).

## Uso Básico
```ts
import { unifiedEventTracker } from '@/analytics/UnifiedEventTracker';

unifiedEventTracker.setGlobalContext({ locale: 'pt-BR' });

unifiedEventTracker.track({
  type: 'quiz_started',
  sessionId: 'sess_123',
  funnelId: 'quiz-main',
  userId: 'user_42'
});
```

## Próximos Passos
- Implementar `UnifiedAnalyticsEngine` (agregações e cache)
- Hook `useUnifiedAnalytics` para o editor/quiz
- Marcar serviços legados como deprecated e criar wrappers

## Estratégia de Migração
1. Continuar emitindo eventos legacy em paralelo (fase de sombra)
2. Validar consistência comparando contagens entre tabelas antigas e `unified_events`
3. Desligar gradualmente serviços antigos após estabilidade ≥ 1 semana
