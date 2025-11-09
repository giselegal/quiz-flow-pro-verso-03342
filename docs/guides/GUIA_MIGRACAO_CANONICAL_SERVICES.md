# 🔄 GUIA DE MIGRAÇÃO - CANONICAL SERVICES

**Data:** Outubro 2025  
**Status:** FASE 2.2 EM ANDAMENTO  
**Objetivo:** Migrar de 108 services fragmentados para 12 services canônicos

---

## 📊 Visão Geral

### Situação Atual
- **108 services** espalhados em `/src/services/`
- Duplicação de lógica (ex: 31 services de dados)
- Inconsistência de APIs
- Difícil manutenção e testing

### Situação Alvo
- **12 services canônicos** em `/src/services/canonical/`
- APIs consistentes com Result pattern
- Lifecycle management unificado
- Event-driven communication

---

## 🏛️ Arquitetura Canonical Services

### Base Class: BaseCanonicalService

Todos os services canônicos herdam de `BaseCanonicalService`:

```typescript
abstract class BaseCanonicalService {
  readonly name: string;
  readonly version: string;
  readonly state: ServiceState; // 'idle' | 'initializing' | 'ready' | 'error'
  
  async initialize(): Promise<void>
  async dispose(): Promise<void>
  async healthCheck(): Promise<boolean>
}
```

### Result Pattern

Todas as operações retornam `ServiceResult<T>`:

```typescript
type ServiceResult<T> = 
  | { success: true; data: T }
  | { success: false; error: Error }
```

**Exemplo de uso:**
```typescript
const result = cacheService.get('key');
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

---

## 🗄️ CacheService (IMPLEMENTADO)

### Migração de EditorCacheService

**Antes:**
```typescript
import { EditorCacheService } from '@/services/EditorCacheService';

const cache = EditorCacheService.getInstance();
cache.set('key', value, 5000);
const data = cache.get('key');
```

**Depois:**
```typescript
import { cacheService } from '@/services/canonical';

cacheService.blocks.set('key', value, 5000);
const result = cacheService.blocks.get('key');
if (result.success) {
  const data = result.data;
}
```

### Migração de ConfigurationCache

**Antes:**
```typescript
import { configurationCache } from '@/utils/ConfigurationCache';

configurationCache.set('config-key', config, 2000);
const cached = configurationCache.get('config-key');
```

**Depois:**
```typescript
import { cacheService } from '@/services/canonical';

cacheService.configs.set('config-key', config, 2000);
const result = cacheService.configs.get('config-key');
if (result.success) {
  const config = result.data;
}
```

### API Completa

```typescript
// Uso genérico
cacheService.set('key', value, { store: 'generic', ttl: 5000 });
cacheService.get('key', 'generic');
cacheService.delete('key', 'generic');
cacheService.has('key', 'generic');

// Uso especializado
cacheService.templates.set('step-01', data);
cacheService.templates.get('step-01');
cacheService.templates.invalidateStep('step-01');

cacheService.funnels.set('funnel-123', data);
cacheService.funnels.get('funnel-123');
cacheService.funnels.invalidate('funnel-123');

cacheService.configs.set('editor-config', data);
cacheService.blocks.set('block-xyz', data);

// Estatísticas
cacheService.logStats();
const stats = cacheService.getAllStats();
cacheService.resetStats();
```

---

## 📝 TemplateService (PRÓXIMO)

### Services a Consolidar (20)

1. `stepTemplateService.ts`
2. `UnifiedTemplateRegistry.ts`
3. `HybridTemplateService.ts`
4. `JsonTemplateService.ts`
5. `TemplateEditorService.ts`
6. `customTemplateService.ts`
7. `templateLibraryService.ts`
8. `TemplatesCacheService.ts`
9. `AIEnhancedHybridTemplateService.ts`
10. `DynamicMasterJSONGenerator.ts`
11. `Quiz21CompleteService.ts`
12. `UnifiedBlockStorageService.ts`
13. ... (mais 8 services)

### API Planejada

```typescript
interface TemplateService {
  // CRUD
  getTemplate(id: string): ServiceResult<Template>
  getStep(stepId: string): ServiceResult<Block[]>
  saveTemplate(template: Template): ServiceResult<void>
  
  // Registry
  listTemplates(): ServiceResult<Template[]>
  searchTemplates(query: string): ServiceResult<Template[]>
  
  // Cache integration
  preloadTemplates(ids: string[]): Promise<void>
  invalidateTemplate(id: string): void
  
  // Conversions
  convertV2ToV3(v2Template: any): ServiceResult<Template>
  normalizeBlocks(blocks: any[]): Block[]
}
```

---

## 💾 DataService (PRÓXIMO)

### Services a Consolidar (31)

Principais:
- `EnhancedUnifiedDataService.ts`
- `FunnelUnifiedService.ts`
- `quizSupabaseService.ts`
- `editorSupabaseService.ts`
- `funnelDataService.ts`
- ... (mais 26)

### API Planejada

```typescript
interface DataService {
  // Funnels
  funnels: {
    list(): ServiceResult<Funnel[]>
    get(id: string): ServiceResult<Funnel>
    create(data: CreateFunnelDTO): ServiceResult<Funnel>
    update(id: string, data: UpdateFunnelDTO): ServiceResult<Funnel>
    delete(id: string): ServiceResult<void>
  }
  
  // Results
  results: {
    list(funnelId: string): ServiceResult<QuizResult[]>
    get(id: string): ServiceResult<QuizResult>
    create(data: CreateResultDTO): ServiceResult<QuizResult>
  }
  
  // Participants
  participants: {
    list(funnelId: string): ServiceResult<Participant[]>
    get(id: string): ServiceResult<Participant>
    export(funnelId: string): ServiceResult<Blob>
  }
}
```

---

## 📊 AnalyticsService

### Services a Consolidar (4)

1. `AnalyticsService.ts`
2. `FacebookMetricsService.ts`
3. `analyticsEngine.ts`
4. `realTimeAnalytics.ts`

### API Planejada

```typescript
interface AnalyticsService {
  track(event: AnalyticsEvent): void
  
  metrics: {
    getFunnelMetrics(funnelId: string): ServiceResult<Metrics>
    getRealTimeStats(): ServiceResult<RealtimeStats>
    getFacebookAds(accountId: string): ServiceResult<AdMetrics[]>
  }
  
  insights: {
    getConversionRate(funnelId: string): number
    getDropOffPoints(funnelId: string): DropOffPoint[]
    getRecommendations(funnelId: string): Recommendation[]
  }
}
```

---

## 🗂️ StorageService

### Services a Consolidar (7)

1. `OptimizedImageStorage.ts`
2. `mediaUploadService.ts`
3. `supabaseIntegration.ts`
4. `editorSupabaseService.ts`
5. ... (mais 3)

### API Planejada

```typescript
interface StorageService {
  upload(file: File, options: UploadOptions): ServiceResult<UploadResult>
  download(path: string): ServiceResult<Blob>
  delete(path: string): ServiceResult<void>
  
  images: {
    optimize(file: File): ServiceResult<File>
    generateThumbnail(url: string): ServiceResult<string>
    migrate(oldPath: string, newPath: string): ServiceResult<void>
  }
}
```

---

## 🔐 AuthService

### Services a Consolidar (4)

1. `sessionService.ts`
2. `PermissionService.ts`
3. `MultiTenantService.ts`
4. `WhiteLabelPlatform.ts`

### API Planejada

```typescript
interface AuthService {
  session: {
    getCurrentUser(): ServiceResult<User>
    login(credentials: Credentials): ServiceResult<Session>
    logout(): ServiceResult<void>
  }
  
  permissions: {
    hasPermission(action: string): boolean
    checkAccess(resource: string, action: string): boolean
  }
  
  multiTenant: {
    getCurrentTenant(): ServiceResult<Tenant>
    switchTenant(tenantId: string): ServiceResult<void>
  }
}
```

---

## ⚙️ ConfigService

### Services a Consolidar (9)

1. `ConfigurationService.ts`
2. `ConfigurationAPI.ts`
3. `FunnelConfigGenerator.ts`
4. `funnelSettingsService.ts`
5. ... (mais 5)

---

## ✅ ValidationService

### Services a Consolidar (5)

1. `AlignmentValidator.ts`
2. `funnelValidationService.ts`
3. `pageStructureValidator.ts`
4. ... (mais 2)

---

## 📚 HistoryService

### Services a Consolidar (7)

1. `HistoryManager.ts`
2. `VersioningService.ts`
3. `MigrationService.ts`
4. ... (mais 4)

---

## 📡 MonitoringService

### Services a Consolidar (3)

1. `MonitoringService.ts`
2. `PerformanceMonitor.ts`
3. `performanceOptimizer.ts`

---

## 🔔 NotificationService

### Services a Consolidar (1)

1. `NotificationService.ts`

---

## ✏️ EditorService

### Services a Consolidar (7)

1. `editorService.ts`
2. `QuizEditorBridge.ts`
3. `CollaborationService.ts`
4. ... (mais 4)

---

## 🔄 Estratégia de Migração

### Fase 1: Implementação (2 semanas)
1. ✅ CacheService (CONCLUÍDO)
2. 🔄 TemplateService (3 dias)
3. 🔄 DataService (4 dias)
4. 🔄 Demais services (1 semana)

### Fase 2: Deprecation (2 semanas)
1. Adicionar `@deprecated` tags em 108 services legados
2. Console warnings apontando para canonical services
3. Documentar migrações específicas

### Fase 3: Migração Gradual (4 semanas)
1. Migrar componentes core (Editor, Preview)
2. Migrar páginas principais (Dashboard, Funnels)
3. Migrar páginas secundárias
4. Atualizar testes

### Fase 4: Remoção (1 semana)
1. Remover services legados não utilizados
2. Cleanup de imports
3. Bundle size analysis

---

## 📋 Checklist de Migração

### Para cada service canônico:
- [ ] Implementar class extendendo `BaseCanonicalService`
- [ ] Definir interfaces públicas
- [ ] Implementar Result pattern
- [ ] Adicionar unit tests
- [ ] Documentar API com JSDoc
- [ ] Exportar singleton
- [ ] Adicionar em `canonical/index.ts`

### Para cada service legado:
- [ ] Adicionar `@deprecated` tag
- [ ] Console warning com service canônico equivalente
- [ ] Criar adapter se necessário
- [ ] Atualizar documentação

---

## 🧪 Testing

### Testes Unitários (Cada Service)
```typescript
describe('CacheService', () => {
  it('should initialize successfully', async () => {
    await cacheService.initialize();
    expect(cacheService.state).toBe('ready');
  });
  
  it('should set and get values', () => {
    const result = cacheService.set('key', 'value');
    expect(result.success).toBe(true);
    
    const getResult = cacheService.get('key');
    expect(getResult.success).toBe(true);
    expect(getResult.data).toBe('value');
  });
  
  it('should pass health check', async () => {
    const healthy = await cacheService.healthCheck();
    expect(healthy).toBe(true);
  });
});
```

### Testes de Integração
```typescript
describe('Canonical Services Integration', () => {
  it('should work together', async () => {
    // Template usa Cache
    const template = await templateService.getStep('step-01');
    const cached = cacheService.templates.get('step-01');
    
    expect(cached.success).toBe(true);
  });
});
```

---

## 📊 Métricas de Sucesso

| Métrica | Antes | Meta | Atual |
|---------|-------|------|-------|
| Total Services | 108 | 12 | 108 (🔄 1/12) |
| Bundle Size | 955 KB | <800 KB | 955 KB |
| API Consistency | 20% | 95% | 25% |
| Test Coverage | 15% | 80% | 15% |

---

## 🔗 Referências

- `/src/services/canonical/types.ts` - Base types
- `/src/services/canonical/CacheService.ts` - Exemplo implementado
- `SERVICES_ANALYSIS.json` - Análise completa dos 108 services
- `RELATORIO_FINAL_FASE_2_1.md` - Context da FASE 2.1

---

**Última Atualização:** Outubro 2025  
**Próximo Review:** Após implementação de 3 services canônicos
