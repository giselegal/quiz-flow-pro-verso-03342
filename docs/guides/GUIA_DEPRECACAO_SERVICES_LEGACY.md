# 🗑️ GUIA DE DEPRECAÇÃO - SERVIÇOS LEGACY

**Data**: 23 de outubro de 2025  
**FASE**: 2.3 - ETAPA 5  
**Status**: Documentação de serviços legados para futura remoção

---

## 📋 RESUMO EXECUTIVO

### Contexto
Durante a **FASE 2.2**, consolidamos **108 serviços legados** em **12 serviços canônicos**. Esta fase focou em compatibilidade retroativa, mantendo os serviços antigos funcionando via aliases.

### Objetivo desta ETAPA
Documentar os serviços legados e criar um plano de migração gradual, adicionando tags `@deprecated` para guiar desenvolvedores na transição.

### Status Atual
- ✅ **12 Serviços Canônicos** implementados e funcionando
- ✅ **108 Serviços Legacy** identificados
- ✅ **Aliases** criados para compatibilidade
- ⏳ **Tags @deprecated** a serem adicionadas
- ⏳ **Migration warnings** a serem configuradas

---

## 🎯 SERVIÇOS CANÔNICOS (12 MANTIDOS)

### Localização: `/src/services/canonical/`

```typescript
1.  CacheService.ts         - Cache unificado (memory + storage + async)
2.  TemplateService.ts       - Templates e JSON schemas
3.  DataService.ts           - CRUD Supabase + offline
4.  ValidationService.ts     - Validação de quiz, steps, blocks
5.  MonitoringService.ts     - Logging, analytics, performance
6.  EditorService.ts         - Estado do editor
7.  QuizService.ts           - Runtime do quiz
8.  ResultService.ts         - Cálculo de resultados
9.  NavigationService.ts     - Roteamento e transições
10. IntegrationService.ts    - Webhooks, APIs externas
11. ExportService.ts         - Export PDF, JSON, analytics
12. HealthService.ts         - Health checks, diagnostics
```

**Importação Recomendada**:
```typescript
// ✅ NOVO (Canonical)
import { 
  cacheService, 
  templateService, 
  dataService,
  // ... outros
} from '@/services/canonical';
```

---

## 🗑️ SERVIÇOS LEGADOS (108 DEPRECADOS)

### Categoria 1: Cache Services (18 serviços)
**Consolidados em**: `CacheService`

```typescript
// ❌ DEPRECATED - Usar cacheService
@deprecated Use cacheService from '@/services/canonical'
- MemoryCache
- StorageCache
- AsyncCache
- CacheInvalidation
- UnifiedCacheService
- EditorCacheService
- QuizCacheService
- TemplateCacheService
- ResultCacheService
- LocalStorageService
- SessionStorageService
- IndexedDBService
- CacheManager
- CacheStrategy
- CachePolicy
- CacheMetrics
- CacheWarmer
- CacheEviction

// ✅ MIGRAÇÃO
import { MemoryCache } from '@/services/cache/MemoryCache';
      ↓
import { cacheService } from '@/services/canonical';
cacheService.memory.get('key');
```

### Categoria 2: Template Services (16 serviços)
**Consolidados em**: `TemplateService`

```typescript
// ❌ DEPRECATED - Usar templateService
@deprecated Use templateService from '@/services/canonical'
- UnifiedTemplateRegistry
- HybridTemplateService
- MasterTemplateService
- JsonTemplateService
- ScalableHybridTemplateService
- TemplateLibraryService
- TemplateLoaderService
- TemplateValidatorService
- TemplateConverterService
- TemplateBuilderService
- TemplateMergerService
- TemplateRegistryService
- StepTemplateService
- BlockTemplateService
- SectionTemplateService
- CustomTemplateService

// ✅ MIGRAÇÃO
import { templateRegistry } from '@/services/UnifiedTemplateRegistry';
      ↓
import { templateService } from '@/services/canonical';
templateService.getTemplate('quiz-21-steps');
```

### Categoria 3: Data/API Services (22 serviços)
**Consolidados em**: `DataService`

```typescript
// ❌ DEPRECATED - Usar dataService
@deprecated Use dataService from '@/services/canonical'
- SupabaseApiClient
- EnhancedUnifiedDataService
- UnifiedDataService
- ConsolidatedFunnelService
- ContextualFunnelService
- FunnelService
- QuizDataService
- ParticipantsService
- AnalyticsDataService
- ResultsDataService
- UserDataService
- SettingsDataService
- ConfigService
- ApiClient
- HttpService
- RestService
- GraphQLService
- WebSocketService
- SyncService
- OfflineService
- BatchService
- TransactionService

// ✅ MIGRAÇÃO
import { SupabaseApiClient } from '@/services/SupabaseApiClient';
      ↓
import { dataService } from '@/services/canonical';
dataService.funnels.getAll();
```

### Categoria 4: Validation Services (8 serviços)
**Consolidados em**: `ValidationService`

```typescript
// ❌ DEPRECATED - Usar validationService
@deprecated Use validationService from '@/services/canonical'
- QuizValidationService
- StepValidationService
- BlockValidationService
- SchemaValidationService
- FormValidationService
- DataValidationService
- RuleValidationService
- ConstraintValidationService

// ✅ MIGRAÇÃO
import { QuizValidationService } from '@/services/validation/QuizValidation';
      ↓
import { validationService } from '@/services/canonical';
validationService.validateQuiz(quiz);
```

### Categoria 5: Editor Services (14 serviços)
**Consolidados em**: `EditorService`

```typescript
// ❌ DEPRECATED - Usar editorService
@deprecated Use editorService from '@/services/canonical'
- EditorStateManager
- EditorHistoryService
- EditorCacheService
- UnifiedQuizStepAdapter
- PropsToBlocksAdapter
- BlocksToPropsAdapter
- EditorSyncService
- EditorAutoSaveService
- EditorUndoRedoService
- EditorSelectionService
- EditorClipboardService
- EditorDragDropService
- EditorKeyboardService
- EditorToolbarService

// ✅ MIGRAÇÃO
import { EditorStateManager } from '@/services/editor/EditorStateManager';
      ↓
import { editorService } from '@/services/canonical';
editorService.state.updateStep(step);
```

### Categoria 6: Quiz Runtime Services (10 serviços)
**Consolidados em**: `QuizService`

```typescript
// ❌ DEPRECATED - Usar quizService
@deprecated Use quizService from '@/services/canonical'
- QuizEngineService
- QuizFlowService
- QuizStateService
- QuizEventService
- QuizTimerService
- QuizProgressService
- QuizScoringService
- QuizNavigationService
- QuizAnswerService
- QuizSessionService

// ✅ MIGRAÇÃO
import { QuizEngineService } from '@/services/quiz/QuizEngine';
      ↓
import { quizService } from '@/services/canonical';
quizService.runtime.advanceStep();
```

### Categoria 7: Result Services (6 serviços)
**Consolidados em**: `ResultService`

```typescript
// ❌ DEPRECATED - Usar resultService
@deprecated Use resultService from '@/services/canonical'
- ResultOrchestrator
- ResultCalculatorService
- ResultProcessorService
- ResultFormatterService
- QuizResultsService
- ResultAnalyticsService

// ✅ MIGRAÇÃO
import { ResultOrchestrator } from '@/services/core/ResultOrchestrator';
      ↓
import { resultService } from '@/services/canonical';
resultService.calculateResult(answers);
```

### Categoria 8: Analytics/Monitoring (8 serviços)
**Consolidados em**: `MonitoringService`

```typescript
// ❌ DEPRECATED - Usar monitoringService
@deprecated Use monitoringService from '@/services/canonical'
- RealDataAnalyticsService
- RealTimeAnalytics
- PerformanceMonitoringService
- ErrorTrackingService
- LoggingService
- MetricsService
- TelemetryService
- DiagnosticsService

// ✅ MIGRAÇÃO
import { RealDataAnalyticsService } from '@/services/core/RealDataAnalytics';
      ↓
import { monitoringService } from '@/services/canonical';
monitoringService.analytics.trackEvent('quiz_completed');
```

### Categoria 9: Navigation Services (4 serviços)
**Consolidados em**: `NavigationService`

```typescript
// ❌ DEPRECATED - Usar navigationService
@deprecated Use navigationService from '@/services/canonical'
- RouterService
- HistoryService
- BreadcrumbService
- LinkService

// ✅ MIGRAÇÃO
import { RouterService } from '@/services/navigation/Router';
      ↓
import { navigationService } from '@/services/canonical';
navigationService.navigateTo('/quiz/123');
```

### Categoria 10: Outros (2 serviços)
**Consolidados em**: Diversos

```typescript
// ❌ DEPRECATED
@deprecated Use specific canonical service
- StorageService → cacheService.storage
- QuizEditorBridge → editorService.bridge
```

---

## 📦 ALIASES DE COMPATIBILIDADE

### Localização: `/src/services/aliases/`

**Arquivos criados** (para compatibilidade temporária):

```typescript
// src/services/aliases/cache.ts
export { cacheService as MemoryCache } from '@/services/canonical';
export { cacheService as StorageCache } from '@/services/canonical';
export { cacheService as AsyncCache } from '@/services/canonical';
// ... todos os aliases de cache

// src/services/aliases/template.ts
export { templateService as UnifiedTemplateRegistry } from '@/services/canonical';
export { templateService as HybridTemplateService } from '@/services/canonical';
// ... todos os aliases de template

// src/services/aliases/data.ts
export { dataService as SupabaseApiClient } from '@/services/canonical';
export { dataService as EnhancedUnifiedDataService } from '@/services/canonical';
// ... todos os aliases de data
```

**Uso dos Aliases**:
```typescript
// ⚠️ FUNCIONA mas DEPRECATED
import { MemoryCache } from '@/services/cache/MemoryCache';
// Internamente redireciona para cacheService

// ✅ RECOMENDADO
import { cacheService } from '@/services/canonical';
```

---

## 🚀 PLANO DE MIGRAÇÃO GRADUAL

### Fase 1: Documentação e Warnings (ATUAL)
**Timeline**: Imediato  
**Status**: ✅ EM ANDAMENTO

**Ações**:
1. ✅ Criar este guia de deprecação
2. ⏳ Adicionar JSDoc `@deprecated` em todos os 108 serviços legacy
3. ⏳ Adicionar console.warn() em serviços mais usados
4. ⏳ Atualizar documentação do projeto

**Exemplo de Tag**:
```typescript
/**
 * @deprecated Use cacheService from '@/services/canonical' instead
 * @see {@link CacheService}
 * 
 * Migration guide:
 * ```
 * // Before
 * import { MemoryCache } from '@/services/cache/MemoryCache';
 * const cache = new MemoryCache();
 * cache.set('key', value);
 * 
 * // After
 * import { cacheService } from '@/services/canonical';
 * cacheService.memory.set('key', value);
 * ```
 */
export class MemoryCache {
  constructor() {
    console.warn('[DEPRECATED] MemoryCache is deprecated. Use cacheService instead.');
  }
}
```

### Fase 2: Migração de Código Interno (PRÓXIMA)
**Timeline**: Sprint 3-4  
**Prioridade**: MÉDIA

**Ações**:
1. Migrar código interno do projeto para serviços canônicos
2. Atualizar imports em `/src/components/`
3. Atualizar imports em `/src/pages/`
4. Atualizar imports em `/src/utils/`
5. Run ESLint auto-fix para imports simples

**Comando**:
```bash
# Auto-fix imports simples
npx eslint --fix "src/**/*.{ts,tsx}"

# Ou script personalizado
node scripts/migrate-to-canonical.mjs
```

### Fase 3: Remover Aliases (FUTURO)
**Timeline**: Sprint 5-6  
**Prioridade**: BAIXA

**Ações**:
1. Verificar que não há mais imports de serviços legacy
2. Remover arquivos em `/src/services/aliases/`
3. Remover serviços legacy individuais
4. Validar build e testes

**Validation**:
```bash
# Check for legacy imports
grep -r "from '@/services/" src/ | grep -v "canonical" | grep -v "__tests__"

# Se retornar vazio, aliases podem ser removidos
```

### Fase 4: Cleanup Final (LONGO PRAZO)
**Timeline**: Sprint 7+  
**Prioridade**: BAIXA

**Ações**:
1. Remover pastas legacy em `/src/services/`
2. Limpar documentação antiga
3. Atualizar tutoriais e exemplos
4. Archive em `/archived/services-legacy/`

---

## 📊 IMPACTO ESTIMADO

### Bundle Size
```
Atual (com aliases):     ~2,800 KB (~800 KB gzip)
Após remoção completa:   ~2,700 KB (~750 KB gzip)
Reduction:               ~100 KB (~50 KB gzip)
Percentual:              -3.6% total, -6.3% gzip
```

### Build Time
```
Atual:                   19.82s
Após remoção:            ~17-18s (estimado)
Reduction:               -10-15%
```

### Maintenance
```
Linhas de código:        -15,000 linhas (serviços legacy)
Complexity:              -30% (menos duplicação)
Test coverage:           Mesmo nível (testes migrados)
```

---

## ✅ CHECKLIST DE MIGRAÇÃO

### Para Desenvolvedores

**Ao criar novo código**:
- [ ] Usar apenas serviços canônicos (`@/services/canonical`)
- [ ] Não usar serviços legacy ou aliases
- [ ] Seguir exemplos na documentação atualizada

**Ao modificar código existente**:
- [ ] Substituir imports legacy por canônicos
- [ ] Atualizar testes correspondentes
- [ ] Validar que funciona igualmente

**Ao deprecar um serviço**:
- [ ] Adicionar JSDoc `@deprecated` com migration guide
- [ ] Adicionar console.warn() no construtor
- [ ] Atualizar CHANGELOG.md
- [ ] Notificar time via Slack/email

### Para Revisores de Código

- [ ] Rejeitar PRs com novos imports de serviços legacy
- [ ] Sugerir migração para canônicos em código tocado
- [ ] Validar que aliases não estão sendo criados
- [ ] Verificar que testes cobrem nova implementação

---

## 📚 RECURSOS ADICIONAIS

### Documentação Relacionada
- [FASE_2.2_CONCLUSAO.md](./FASE_2.2_CONCLUSAO.md) - Implementação dos serviços canônicos
- [GUIA_MIGRACAO_CANONICAL_SERVICES.md](./GUIA_MIGRACAO_CANONICAL_SERVICES.md) - Guia de migração detalhado
- [/src/services/canonical/README.md](../src/services/canonical/README.md) - API dos serviços canônicos

### Scripts Úteis
```bash
# Listar imports legacy
grep -r "from '@/services/" src/ --include="*.ts" --include="*.tsx" | \
  grep -v "canonical" | \
  grep -v "__tests__" | \
  wc -l

# Encontrar serviços mais usados
grep -r "from '@/services/" src/ --include="*.ts" --include="*.tsx" | \
  grep -v "canonical" | \
  cut -d"'" -f2 | \
  sort | uniq -c | sort -rn | head -20

# Validar aliases funcionando
npm run build && npm run test
```

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

### Ação 1: Adicionar Tags @deprecated (2-3h)
```bash
# Script para adicionar tags automaticamente
node scripts/add-deprecated-tags.mjs

# Ou manualmente nos 10 serviços mais usados
```

### Ação 2: Validar Bundle Final (30min)
```bash
npm run build
npm run build:analyze

# Verificar que bundle está <800 KB gzip
```

### Ação 3: Documentar Resultados Finais (1h)
```bash
# Criar FASE_2.3_CONCLUSAO_FINAL.md com:
- Bundle sizes finais
- Performance metrics
- Migration status
- Next steps
```

---

**Status Atual**: 📝 **DOCUMENTAÇÃO COMPLETA**  
**Próxima Ação**: Validar bundle final e criar relatório de conclusão  
**Data**: 23 de outubro de 2025
