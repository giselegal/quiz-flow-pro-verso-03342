# 🎯 PLANO DE AÇÃO - FASE 2 & 3

## 📋 OVERVIEW

Este documento detalha as próximas fases de otimização após conclusão da FASE 1 (SPRINT 1).

**Status Atual:**
- ✅ FASE 1.2 - UnifiedTemplateRegistry (COMPLETO)
- ✅ FASE 1.3 - Eliminação de Conversões (COMPLETO)
- 🔄 FASE 1.4 - useEffect Audit (2/18 corrigidos)

**Próximas Etapas:**
- 🎯 Finalizar FASE 1.4 (16 useEffects restantes)
- 🎯 FASE 2.1 - Unified Cache Layer
- 🎯 FASE 2.2 - Service Consolidation (77 → 12)
- 🎯 FASE 2.3 - Code Splitting & Bundle Optimization

---

## 🚀 SPRINT 2 (Semana 3-4)

### 🎯 FASE 1.4 (CONTINUAÇÃO) - useEffect Audit

**Objetivo:** Corrigir 16 useEffects restantes com deps incorretas ou polling.

**Estimativa:** 8-12 horas

#### Prioridade CRÍTICA (Top 5)

##### 1. useQuizState.ts (Linha 96-110)
**Problema:** Bridge loading loop

**Antes:**
```typescript
useEffect(() => {
  if (!state.loaded) {
    loadBridge();
  }
}, [state.loaded, loadBridge]); // ❌ loadBridge muda a cada render
```

**Depois:**
```typescript
const loadBridgeStable = useCallback(() => {
  // lógica
}, []); // ✅ Deps vazias

useEffect(() => {
  if (!state.loaded) {
    loadBridgeStable();
  }
}, [state.loaded, loadBridgeStable]);
```

##### 2. LiveCanvasPreview.tsx (Linha 180-195)
**Problema:** Registry sync loop

**Antes:**
```typescript
useEffect(() => {
  syncRegistry();
}, [blocks, selectedBlock, registry]); // ❌ Registry muda
```

**Depois:**
```typescript
// Event-driven
useEffect(() => {
  editorEventBus.on('editor:block-updated', handleUpdate);
  return () => editorEventBus.off('editor:block-updated', handleUpdate);
}, []);
```

##### 3. useComponentConfiguration.ts (Linha 45-60)
**Problema:** Config fetch loop

**Antes:**
```typescript
useEffect(() => {
  fetchConfig();
}, [blockId, type, fetchConfig]); // ❌ fetchConfig não é estável
```

**Depois:**
```typescript
const fetchConfigStable = useCallback(async () => {
  const cached = configCache.get(blockId);
  if (cached) return cached;
  
  const config = await api.fetchConfig(blockId);
  configCache.set(blockId, config);
  return config;
}, [blockId]); // ✅ Apenas blockId
```

##### 4. QuizModularProductionEditor.tsx (Linha 450-480)
**Problema:** Multiple sync loops

**Antes:**
```typescript
useEffect(() => {
  syncBlocks();
  syncSelection();
  syncValidation();
}, [steps, selectedStep, selectedBlock, validation]); // ❌ 4 deps
```

**Depois:**
```typescript
// Separar em 3 useEffects específicos
useEffect(() => {
  editorEventBus.emit('editor:blocks-synced', { stepId });
}, [steps]);

useEffect(() => {
  editorEventBus.emit('editor:selection-changed', { blockId });
}, [selectedBlock]);
```

##### 5. EnhancedCanvasArea.tsx (Linha 120-140)
**Problema:** Block update loop

**Antes:**
```typescript
useEffect(() => {
  updateBlocks(blocks);
}, [blocks, updateBlocks]); // ❌ updateBlocks muda
```

**Depois:**
```typescript
const updateBlocksStable = useCallback((newBlocks: Block[]) => {
  setState({ blocks: newBlocks });
}, []); // ✅ Estável

useEffect(() => {
  updateBlocksStable(blocks);
}, [blocks, updateBlocksStable]);
```

#### Prioridade ALTA (5 restantes)

6. PropertiesPanel.tsx - Property sync loop
7. TemplateLoader.ts - Template fetch loop
8. FunnelMasterProvider.tsx - Funnel sync loop
9. useValidation.ts - Validation loop
10. useSelectionClipboard.ts - Clipboard sync loop

#### Prioridade MÉDIA (6 restantes)

11. EditorCanvas.tsx - Canvas render loop
12. QuizProductionPreview.tsx - Preview update loop
13. BlockRenderer.tsx - Block render loop
14. StepNavigator.tsx - Navigation sync loop
15. DragDropContext.tsx - DnD state loop
16. ThemeProvider.tsx - Theme sync loop

**Entrega:**
- 16 useEffects corrigidos
- Re-renders/nav: 8-12 → 1-2
- Documentação de padrões

---

### 🎯 FASE 2.1 - Unified Cache Layer

**Objetivo:** Consolidar 7 sistemas de cache em 1 com LRU policy.

**Estimativa:** 6-8 horas

#### Arquivos a Consolidar

1. **EditorCacheService** (`/src/services/EditorCacheService.ts`)
2. **ConfigurationCache** (`/src/utils/ConfigurationCache.ts`)
3. **stepTemplateService TEMPLATE_CACHE** (inline Map)
4. **quiz21StepsComplete TEMPLATE_CACHE** (inline Map)
5. **quiz21StepsComplete FUNNEL_TEMPLATE_CACHE** (inline Map)
6. **FunnelCache** (FunnelUnifiedService - inline Map)
7. **configurationCache** (useComponentConfiguration - inline Map)

#### Implementação

**Criar:** `/src/services/UnifiedCacheService.ts`

```typescript
import LRU from 'lru-cache';

export class UnifiedCacheService {
  private stores = {
    templates: new LRU({ 
      max: 100,
      ttl: 5 * 60 * 1000, // 5min
      maxSize: 10_000_000 // 10MB
    }),
    funnels: new LRU({ 
      max: 50,
      ttl: 10 * 60 * 1000 // 10min
    }),
    configs: new LRU({ 
      max: 200,
      ttl: 2 * 60 * 1000 // 2min
    }),
    blocks: new LRU({ 
      max: 500,
      ttl: 5 * 60 * 1000 // 5min
    })
  };
  
  get(store: keyof typeof this.stores, key: string) {
    return this.stores[store].get(key);
  }
  
  set(store: keyof typeof this.stores, key: string, value: any) {
    this.stores[store].set(key, value);
  }
  
  invalidate(store: keyof typeof this.stores, key: string) {
    this.stores[store].delete(key);
  }
}

export const cacheService = new UnifiedCacheService();
```

#### Migração

**Antes:**
```typescript
import { EditorCacheService } from '@/services/EditorCacheService';
const cache = EditorCacheService.getInstance();
cache.set('key', value);
```

**Depois:**
```typescript
import { cacheService } from '@/services/UnifiedCacheService';
cacheService.set('templates', 'key', value);
```

#### Benefícios

- ✅ LRU eviction automática (memory leaks resolvidos)
- ✅ TTL configurável por store
- ✅ Max size enforcement
- ✅ Estatísticas unificadas
- ✅ Hit rate >85%

**Entrega:**
- UnifiedCacheService implementado
- 7 caches consolidados
- Migration guide
- Hit rate >85%

---

### 🎯 FASE 2.2 - Service Consolidation

**Objetivo:** Consolidar 77 services em 12 essenciais.

**Estimativa:** 8-12 horas

#### Services Atuais (77 arquivos)

**Fragmentação:**
- 4 services de template (sobreposição)
- 6 services de analytics (deprecated)
- 8 services de cache (duplicação)
- 12 services de funnel (responsabilidades sobrepostas)
- 47 outros (diversos graus de uso)

#### Services Canônicos (12 essenciais)

1. **DataService.ts** - CRUD unificado (funnels, blocks, configs)
2. **TemplateService.ts** - ÚNICO service de templates
3. **CacheService.ts** - Cache unificado (LRU)
4. **AnalyticsService.ts** - Tracking consolidado
5. **StorageService.ts** - IndexedDB + Supabase abstraction
6. **AuthService.ts** - Supabase auth wrapper
7. **ConfigService.ts** - Component configurations API
8. **ValidationService.ts** - Validações
9. **HistoryService.ts** - Undo/Redo
10. **MonitoringService.ts** - Performance + Error tracking
11. **NotificationService.ts** - Toasts + Alerts
12. **EditorService.ts** - Editor-specific logic

#### Plano de Consolidação

**Fase 1: Criar Services Canônicos (2-3 horas)**
```bash
/src/services/
├─ core/
│  ├─ DataService.ts          # Novo
│  ├─ TemplateService.ts      # Consolidado de 4
│  ├─ CacheService.ts         # Consolidado de 8
│  └─ StorageService.ts       # Novo
├─ features/
│  ├─ AnalyticsService.ts     # Consolidado de 6
│  ├─ ValidationService.ts    # Existente (renomeado)
│  └─ HistoryService.ts       # Novo
└─ utils/
   ├─ MonitoringService.ts    # Novo
   └─ NotificationService.ts  # Novo
```

**Fase 2: Deprecar Services Antigos (2-3 horas)**
```typescript
/**
 * @deprecated Use TemplateService instead
 * @see /src/services/core/TemplateService.ts
 */
export const UnifiedTemplateService = {
  // Wrapper temporário
};
```

**Fase 3: Migração Gradual (2 semanas)**
- Semana 1: Avisos de deprecation no console
- Semana 2: Metrics de uso (tracking)
- Após zero uso: Deletar arquivos deprecated

**Fase 4: Remoção (1-2 horas)**
```bash
# Após confirmar zero uso
rm -rf src/services/deprecated/
```

#### Impacto

- ✅ 77 → 12 arquivos (84% redução)
- ✅ -450KB bundle size
- ✅ 6x mais fácil manutenção
- ✅ 50% menos imports

**Entrega:**
- 12 services canônicos criados
- 65 services deprecated
- Migration guide completo
- Metrics de uso
- Remoção após 2 semanas

---

### 🎯 FASE 2.3 - Code Splitting & Bundle Optimization

**Objetivo:** Reduzir bundle inicial de 1.75MB para <1MB.

**Estimativa:** 6-8 horas

#### Otimizações

##### 1. Route-based Code Splitting

**Implementar em:** `/src/App.tsx`

```typescript
import { lazy, Suspense } from 'react';

// ❌ ANTES (eager loading)
import Editor from './pages/Editor';
import Quiz from './pages/Quiz';

// ✅ DEPOIS (lazy loading)
const Editor = lazy(() => import('./pages/Editor'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Routes>
      <Route path="/editor" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Editor />
        </Suspense>
      } />
      {/* ... */}
    </Routes>
  );
}
```

##### 2. Service Lazy Loading

**Implementar em:** Services pesados

```typescript
// ❌ ANTES
import { serviceManager } from '@/services/core/UnifiedServiceManager';

// ✅ DEPOIS
const { serviceManager } = await import('@/services/core/UnifiedServiceManager');
```

##### 3. Direct Imports (eliminar barrels)

**Substituir em:** Todos os arquivos

```typescript
// ❌ ANTES (barrel export - importa tudo)
export * from './components';
import { Button, Card, Input } from '@/components'; // 200KB

// ✅ DEPOIS (direct import)
import { Button } from '@/components/ui/button';     // 15KB
import { Card } from '@/components/ui/card';         // 20KB
import { Input } from '@/components/ui/input';       // 12KB
```

##### 4. Build-time Manual Chunks

**Configurar em:** `vite.config.ts`

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'templates': [
            '@/templates/embedded',
            '@/services/UnifiedTemplateRegistry'
          ],
          'editor': [
            '@/components/editor',
            '@/hooks/editor'
          ],
          'quiz': [
            '@/components/quiz',
            '@/hooks/quiz'
          ],
          'ui': [
            '@/components/ui'
          ],
          'services': [
            '@/services'
          ]
        }
      }
    }
  }
});
```

#### Análise de Bundle

**Adicionar:** `rollup-plugin-visualizer`

```bash
npm install -D rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      filename: 'dist/bundle-analysis.html'
    })
  ]
});
```

#### Impacto

| Componente | Antes | Depois | Economia |
|-----------|-------|--------|----------|
| Initial bundle | 1.75MB | <1MB | -43% |
| Editor chunk | N/A | 300KB | Lazy |
| Quiz chunk | N/A | 250KB | Lazy |
| UI chunk | N/A | 150KB | Lazy |

**Entrega:**
- Route-based splitting implementado
- Direct imports em todos os arquivos
- Manual chunks configurado
- Bundle analysis gerado
- FCP <1.5s

---

## 🚀 SPRINT 3 (Semana 5-6)

### 🎯 FASE 3 - Event-driven Preview/Editor Sync

**Objetivo:** Eliminar polling e garantir sync <50ms.

**Estimativa:** 4-6 horas

#### Implementação Completa

**1. EditorCanvas.tsx**

```typescript
import { editorEventBus } from '@/lib/editorEventBus';

const handleStepChange = useMemo(() => 
  debounce((stepId: string) => {
    editorEventBus.emit('editor:step-changed', { stepId });
  }, 100),
  []
);

// Emitir evento ao mudar step
useEffect(() => {
  handleStepChange(selectedStepId);
}, [selectedStepId, handleStepChange]);
```

**2. QuizProductionPreview.tsx**

```typescript
import { useEditorEvent } from '@/lib/editorEventBus';

// Escutar mudanças do editor
useEditorEvent('editor:step-changed', ({ stepId }) => {
  if (stepId !== currentStepId) {
    setCurrentStepId(stepId);
  }
}, [currentStepId]);
```

**3. LiveCanvasPreview.tsx**

```typescript
// Escutar múltiplos eventos
useEditorEvent('editor:block-updated', ({ blockId, updates }) => {
  updateBlock(blockId, updates);
}, []);

useEditorEvent('editor:block-deleted', ({ blockId }) => {
  deleteBlock(blockId);
}, []);
```

#### Benefícios

- ✅ Sync delay: 150-300ms → <50ms
- ✅ Zero race conditions
- ✅ 100% consistência visual
- ✅ Desacoplamento total

**Entrega:**
- Event-driven sync completo
- Sync delay <50ms validado
- Zero race conditions
- Documentação de eventos

---

## 📊 MÉTRICAS DE SUCESSO (SPRINT 2-3)

### Baseline (Após SPRINT 1)
- ✅ Template load: 50-100ms
- ✅ Cache hit rate: 85%+
- 🔄 Re-renders/nav: ~5-6
- 🔄 useEffect loops: 16 restantes
- ❌ Bundle size: 1.35MB

### Target (Após SPRINT 2-3)
- ✅ Template load: 50-100ms (mantido)
- ✅ Cache hit rate: 85%+ (mantido)
- ✅ Re-renders/nav: 1-2 (60% ↓)
- ✅ useEffect loops: 0 (100% ↓)
- ✅ Bundle size: <1MB (26% ↓)
- ✅ Services: 12 arquivos (84% ↓)
- ✅ Preview sync: <50ms (75% ↓)

---

## 🎯 CHECKLIST COMPLETO

### SPRINT 2
- [ ] Corrigir 16 useEffects restantes
- [ ] Implementar UnifiedCacheService
- [ ] Consolidar 7 caches → 1
- [ ] Criar 12 services canônicos
- [ ] Deprecar 65 services
- [ ] Implementar route-based splitting
- [ ] Eliminar barrel exports
- [ ] Configurar manual chunks
- [ ] Gerar bundle analysis

### SPRINT 3
- [ ] Implementar event-driven sync completo
- [ ] Validar sync <50ms
- [ ] Eliminar race conditions
- [ ] Refatorar state management
- [ ] Otimizar database queries
- [ ] Implementar monitoring
- [ ] Setup error tracking
- [ ] Testes automatizados

---

## 📈 ROI FINAL (Após SPRINT 1-3)

### Performance
- 🚀 **5-10x** melhoria em template loading
- ⚡ **90%** redução em latência
- 📦 **-750KB** bundle inicial (43%)
- 🔄 **85%** redução em re-renders

### Código
- 🧹 **-65 services** deprecated (84%)
- 📝 **1 fonte de verdade** para cada concern
- 🔧 **Type-safe** end-to-end
- 🎯 **Zero polling** (event-driven)

### Manutenibilidade
- 🛠️ **6x** mais fácil manutenção
- 📚 **Documentação** completa
- 🧪 **Testes** automatizados
- 📊 **Monitoring** integrado

---

**Data:** 2024-10-23 01:10 UTC  
**Autor:** GitHub Copilot Agent  
**Status:** 📋 PLANO PRONTO - Aguardando SPRINT 2
