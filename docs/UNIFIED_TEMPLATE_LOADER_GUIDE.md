# 🎯 Guia do UnifiedTemplateLoader

> **Fase 3 Completa**: Sistema consolidado de carregamento de templates

## 📋 Visão Geral

O **UnifiedTemplateLoader** é o novo sistema unificado que consolida todos os loaders de template existentes em um único ponto de entrada com hierarquia de fontes e fallback automático.

### ✅ Benefícios

- **Single Source of Truth**: Um único loader para todos os casos
- **Hierarquia de Fontes**: Prioriza v4 → v3 modular → v3 master → hierarchical
- **Fallback Automático**: Se uma fonte falha, tenta a próxima automaticamente
- **Cache Inteligente**: Multi-nível com invalidação automática
- **Type-Safe**: Validação Zod integrada para v4
- **Observabilidade**: Logging detalhado e métricas de performance

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│         UnifiedTemplateLoader (Singleton)                │
├─────────────────────────────────────────────────────────┤
│  Hierarquia de Fontes (prioridade decrescente):         │
│                                                          │
│  1️⃣ v4 JSON            → quiz21-v4.json                 │
│     ✓ Validação Zod                                      │
│     ✓ Formato canônico                                   │
│                                                          │
│  2️⃣ v3 Modular         → step-XX-v3.json                │
│     ✓ Steps individuais                                  │
│     ✓ Carregamento rápido                                │
│                                                          │
│  3️⃣ v3 Master          → quiz21-complete.json           │
│     ✓ Template consolidado                               │
│     ✓ Todos os steps em um arquivo                       │
│                                                          │
│  4️⃣ HierarchicalSource → Sistema de 4 prioridades       │
│     ✓ USER_EDIT → ADMIN_OVERRIDE → BUILT_IN → FALLBACK │
│     ✓ Supabase + JSON                                    │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Uso Básico

### Carregar Step Individual

```typescript
import { unifiedTemplateLoader } from '@/services/templates/UnifiedTemplateLoader';

// Carregar step com hierarquia automática
const result = await unifiedTemplateLoader.loadStep('step-01', {
  useCache: true,
  timeout: 5000,
});

console.log(`Loaded ${result.data.length} blocks`);
console.log(`Source: ${result.source}`); // 'v4' | 'v3-modular' | 'v3-master' | 'hierarchical'
console.log(`Load time: ${result.loadTime}ms`);
console.log(`From cache: ${result.fromCache}`);
```

### Carregar Template Completo

```typescript
// Carregar template v4 completo
const template = await unifiedTemplateLoader.loadFullTemplate('quiz21StepsComplete', {
  useCache: true,
  timeout: 10000,
});

console.log(`Template version: ${template.data.version}`);
console.log(`Total steps: ${template.data.steps.length}`);
console.log(`Total blocks: ${template.data.steps.reduce((sum, s) => sum + s.blocks.length, 0)}`);
```

### Validar Template

```typescript
// Validar estrutura com Zod
const validation = await unifiedTemplateLoader.validateTemplate(data);

if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
  validation.errors.forEach(err => {
    console.error(`  ${err.path}: ${err.message}`);
  });
}
```

## 🎛️ Opções Avançadas

### Forçar Fonte Específica

```typescript
// Forçar carregamento apenas de v4
const result = await unifiedTemplateLoader.loadStep('step-01', {
  forceSource: 'v4', // 'v4' | 'v3-modular' | 'v3-master' | 'hierarchical'
});
```

### Cancelamento com AbortSignal

```typescript
const controller = new AbortController();

// Timeout de 3 segundos
setTimeout(() => controller.abort(), 3000);

try {
  const result = await unifiedTemplateLoader.loadStep('step-01', {
    signal: controller.signal,
  });
} catch (error) {
  if (error.message === 'Operation aborted') {
    console.log('Load cancelled');
  }
}
```

### Passar FunnelId para HierarchicalSource

```typescript
// Carregar com contexto de funnel específico
const result = await unifiedTemplateLoader.loadStep('step-01', {
  funnelId: 'funnel-abc-123', // Prioriza USER_EDIT no Supabase
});
```

## 🔄 Migração de Código Legado

### Antes (jsonStepLoader)

```typescript
import { loadStepFromJson } from '@/templates/loaders/jsonStepLoader';

const blocks = await loadStepFromJson('step-01', 'quiz21StepsComplete');
```

### Depois (UnifiedTemplateLoader)

```typescript
import { unifiedTemplateLoader } from '@/services/templates/UnifiedTemplateLoader';

const result = await unifiedTemplateLoader.loadStep('step-01');
const blocks = result.data; // Mesma estrutura
```

### Compatibilidade

O `jsonStepLoader` ainda funciona como **wrapper** do `UnifiedTemplateLoader`:

```typescript
// Ainda funciona, mas deprecado
const blocks = await loadStepFromJson('step-01');
// Internamente chama unifiedTemplateLoader
```

## 🧩 Integração com React

### useQuizV4Loader (Atualizado)

```typescript
import { useQuizV4Loader } from '@/hooks/useQuizV4Loader';

function MyComponent() {
  const { quiz, steps, isLoading, error } = useQuizV4Loader({
    autoLoad: true,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div>
      <h1>{quiz?.metadata.title}</h1>
      <p>{steps.length} steps loaded</p>
    </div>
  );
}
```

### TemplateService Integration

O `TemplateService` agora usa `UnifiedTemplateLoader` internamente:

```typescript
import { templateService } from '@/services/canonical/TemplateService';

// Usa UnifiedTemplateLoader automaticamente
const result = await templateService.getStep('step-01', 'quiz21StepsComplete');
```

## 🗂️ Gerenciamento de Cache

### Limpar Cache

```typescript
// Limpar todo o cache
unifiedTemplateLoader.clearCache();
```

### Invalidar Step Específico

```typescript
// Invalidar apenas um step
unifiedTemplateLoader.invalidateStep('step-01');

// Recarregar com nova versão
const result = await unifiedTemplateLoader.loadStep('step-01', {
  useCache: false, // Força reload
});
```

### Estatísticas de Cache

```typescript
// Via TemplateService
import { templateService } from '@/services/canonical/TemplateService';

const stats = templateService.getCacheStats();
console.log(`Cache hit rate: ${stats.cacheHitRate}`);
console.log(`Steps in memory: ${stats.stepsLoadedInMemory}`);
```

## 📊 Monitoring e Debug

### Logs Detalhados

```typescript
// Logs automáticos (via appLogger)
// ✅ [UnifiedLoader] Loaded from v4: step-01
// ⚠️ [UnifiedLoader] v4 failed for step-01: timeout
// ✅ [UnifiedLoader] Loaded from v3-modular: step-01
```

### Performance Tracking

```typescript
const result = await unifiedTemplateLoader.loadStep('step-01');

console.log(`Load time: ${result.loadTime.toFixed(2)}ms`);
console.log(`Source: ${result.source}`);
console.log(`Cache hit: ${result.fromCache}`);

if (result.warnings) {
  console.warn('Warnings:', result.warnings);
}
```

### Window Debug Access

```typescript
// Em desenvolvimento, disponível no console
window.__unifiedTemplateLoader.loadStep('step-01');
window.__unifiedTemplateLoader.clearCache();
window.__unifiedTemplateLoader.validateTemplate(data);
```

## 🔬 Testes

### Unit Tests

```typescript
import { UnifiedTemplateLoader } from '@/services/templates/UnifiedTemplateLoader';

describe('UnifiedTemplateLoader', () => {
  let loader: UnifiedTemplateLoader;

  beforeEach(() => {
    loader = UnifiedTemplateLoader.getInstance();
    loader.clearCache();
  });

  it('should load step from v4', async () => {
    const result = await loader.loadStep('step-01');
    
    expect(result.source).toBe('v4');
    expect(result.data).toBeInstanceOf(Array);
    expect(result.data.length).toBeGreaterThan(0);
  });

  it('should fallback to v3-modular if v4 fails', async () => {
    const result = await loader.loadStep('step-99', {
      forceSource: 'v3-modular',
    });
    
    expect(result.source).toBe('v3-modular');
  });
});
```

## 🎯 Boas Práticas

### ✅ Recomendado

```typescript
// 1. Usar opções padrão quando possível
const result = await unifiedTemplateLoader.loadStep('step-01');

// 2. Cache habilitado por padrão
const result = await unifiedTemplateLoader.loadStep('step-01', {
  useCache: true, // Padrão
});

// 3. Validar antes de usar dados críticos
const validation = await unifiedTemplateLoader.validateTemplate(data);
if (validation.isValid) {
  // Processar dados
}

// 4. Tratar erros apropriadamente
try {
  const result = await unifiedTemplateLoader.loadStep('step-01');
} catch (error) {
  if (error.message.includes('aborted')) {
    // Handle cancellation
  } else {
    // Handle other errors
  }
}
```

### ❌ Evitar

```typescript
// ❌ Desabilitar cache sem necessidade
const result = await unifiedTemplateLoader.loadStep('step-01', {
  useCache: false, // Desnecessário na maioria dos casos
});

// ❌ Timeout muito curto
const result = await unifiedTemplateLoader.loadStep('step-01', {
  timeout: 100, // Muito agressivo
});

// ❌ Ignorar warnings
const result = await unifiedTemplateLoader.loadStep('step-01');
// result.warnings pode conter informações importantes
```

## 📚 Referências

- **Código**: `src/services/templates/UnifiedTemplateLoader.ts`
- **Testes**: `src/templates/loaders/__tests__/`
- **Exemplos**: `examples/UnifiedTemplateLoaderExample.tsx`
- **Migration Guide**: `docs/MIGRATION_GUIDE_V4.md`

## 🆘 Troubleshooting

### Erro: "Failed to load step from all sources"

**Solução**: Verificar se os arquivos JSON existem em pelo menos uma das fontes:
- `/templates/quiz21-v4.json`
- `/templates/step-XX-v3.json`
- `/templates/quiz21-complete.json`

### Performance Lenta

**Solução**: Verificar cache stats e considerar preload:

```typescript
// Preload steps críticos
await Promise.all([
  unifiedTemplateLoader.loadStep('step-01'),
  unifiedTemplateLoader.loadStep('step-12'),
  unifiedTemplateLoader.loadStep('step-20'),
]);
```

### Validação Zod Falha

**Solução**: Verificar estrutura do JSON com o schema:

```typescript
const validation = await unifiedTemplateLoader.validateTemplate(data);
console.error('Validation errors:', validation.errors);
```

---

**Status**: ✅ Fase 3 Completa - UnifiedTemplateLoader em Produção  
**Versão**: 4.0.0  
**Última Atualização**: Novembro 2025
