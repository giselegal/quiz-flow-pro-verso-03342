# 🎯 Unified Block Registry - Documentação

## Visão Geral

O **Unified Block Registry** é o sistema consolidado de gerenciamento de componentes de bloco do editor. Ele substitui múltiplos registries fragmentados por uma única fonte de verdade, oferecendo:

- ✅ **Lazy loading inteligente** com code splitting
- ✅ **Cache otimizado** com TTL configurável  
- ✅ **Preload de componentes críticos**
- ✅ **Fallbacks robustos** para tipos desconhecidos
- ✅ **Performance monitoring** integrado
- ✅ **100% Type-safe** com TypeScript
- ✅ **Backwards compatible** com código legacy

## Arquitetura

### Componentes Críticos (Pre-loaded)

Componentes essenciais carregados imediatamente no bootstrap:

```typescript
const critical = [
  'text-inline',
  'button-inline',
  'image-inline',
  'form-input',
  'options-grid',
  'heading-inline',
  'quiz-intro-header',
  // ... ~40 componentes críticos
];
```

### Componentes Lazy (Code Split)

Componentes carregados sob demanda:

```typescript
const lazy = [
  'quiz-logo',
  'quiz-progress-bar',
  'question-hero',
  'offer-hero',
  // ... ~100+ componentes lazy
];
```

## API Básica

### Obter Componente (Síncrono)

```typescript
import { blockRegistry } from '@/registry/UnifiedBlockRegistry';

// Retorna componente imediatamente (pode ser lazy wrapper)
const TextBlock = blockRegistry.getComponent('text-inline');

// Usar com React.Suspense para lazy components
<Suspense fallback={<Skeleton />}>
  <TextBlock {...props} />
</Suspense>
```

### Obter Componente (Assíncrono) - **Recomendado**

```typescript
// Aguarda carregamento completo (ideal para uso programático)
const TextBlock = await blockRegistry.getComponentAsync('text-inline');

// Exemplo em useEffect
useEffect(() => {
  const loadComponent = async () => {
    const Component = await blockRegistry.getComponentAsync('quiz-logo');
    setComponent(() => Component);
  };
  loadComponent();
}, []);
```

### Verificar Existência

```typescript
if (blockRegistry.has('custom-block')) {
  const component = blockRegistry.getComponent('custom-block');
}
```

### Preload (Não-bloqueante)

```typescript
// Preload single
await blockRegistry.prefetch('quiz-logo');

// Preload batch
await blockRegistry.prefetchBatch([
  'quiz-logo',
  'quiz-progress-bar',
  'question-hero'
]);
```

### Registrar Novo Componente

```typescript
import MyCustomBlock from './MyCustomBlock';

// Registro estático
blockRegistry.register('my-custom-block', MyCustomBlock);

// Registro crítico (pre-loaded)
blockRegistry.register('my-critical-block', MyCriticalBlock, true);

// Registro lazy
blockRegistry.registerLazy('my-lazy-block', () => 
  import('./MyLazyBlock').then(m => ({ default: m.MyLazyBlock }))
);
```

## Sistema de Fallback

O registry implementa fallbacks inteligentes para tipos desconhecidos:

| Padrão | Fallback |
|--------|----------|
| `*-text-*` | TextInlineBlock |
| `*-button-*` | ButtonInlineBlock |
| `*-image-*` | ImageInlineBlock |
| `*-form-*` | FormInputBlock |
| `*-quiz-*` | TextInlineBlock |
| Outros | TextInlineBlock |

Exemplo:

```typescript
// Tipo desconhecido "custom-text-widget"
const component = blockRegistry.getComponent('custom-text-widget');
// Retorna TextInlineBlock como fallback
```

## Cache System

### TTL (Time To Live)

Cache expira após 30 minutos por padrão:

```typescript
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos
```

### Gerenciamento Manual

```typescript
// Limpar cache completo
blockRegistry.clearCache();

// Limpar apenas entradas expiradas
blockRegistry.clearExpiredCache();
```

## Performance Metrics

### Obter Estatísticas

```typescript
const stats = blockRegistry.getStats();

console.log(stats);
// {
//   registry: {
//     totalTypes: 150,
//     criticalTypes: 45,
//     lazyTypes: 105,
//     cachedTypes: 32
//   },
//   performance: {
//     totalLoads: 248,
//     totalErrors: 2,
//     errorRate: 0.81,
//     cacheHitRate: 78.23
//   },
//   topComponents: [
//     { type: 'text-inline', loads: 45, avgLoadTime: 1.2, ... },
//     ...
//   ]
// }
```

### Debug Console

```typescript
blockRegistry.debug();
// Imprime tabela formatada no console
```

## Migração de Código Legacy

### EnhancedBlockRegistry → UnifiedBlockRegistry

**ANTES:**

```typescript
import { 
  getEnhancedBlockComponent, 
  ENHANCED_BLOCK_REGISTRY 
} from '@/components/editor/blocks/EnhancedBlockRegistry';

const TextBlock = getEnhancedBlockComponent('text-inline');
const ButtonBlock = ENHANCED_BLOCK_REGISTRY['button-inline'];
```

**DEPOIS (Opção 1 - Direto):**

```typescript
import { blockRegistry } from '@/registry/UnifiedBlockRegistry';

const TextBlock = blockRegistry.getComponent('text-inline');
const ButtonBlock = blockRegistry.getComponent('button-inline');
```

**DEPOIS (Opção 2 - Adapter para compatibilidade):**

```typescript
// Usar adapter temporariamente durante migração
import { 
  getEnhancedBlockComponent, 
  ENHANCED_BLOCK_REGISTRY 
} from '@/registry/UnifiedBlockRegistryAdapter';

// Código legacy continua funcionando sem alterações
const TextBlock = getEnhancedBlockComponent('text-inline');
const ButtonBlock = ENHANCED_BLOCK_REGISTRY['button-inline'];
```

### AVAILABLE_COMPONENTS

**ANTES:**

```typescript
import { AVAILABLE_COMPONENTS } from '@/components/editor/blocks/EnhancedBlockRegistry';

AVAILABLE_COMPONENTS.forEach(comp => {
  console.log(comp.type, comp.label);
});
```

**DEPOIS:**

```typescript
import { AVAILABLE_COMPONENTS } from '@/registry/UnifiedBlockRegistryAdapter';

// Mesmo comportamento
AVAILABLE_COMPONENTS.forEach(comp => {
  console.log(comp.type, comp.label);
});
```

## Validação de Templates

Use o script de validação para verificar que todos os blocos referenciados em templates existem no registry:

```bash
npx tsx scripts/validate-block-registry.ts
```

Saída esperada:

```
🔍 Validating Block Registry...

📁 Found 45 template files

🧩 Found 87 unique block types

✅ Validating block types...

✅ SUCCESS: All block types are registered!

📊 SUMMARY:
   Templates scanned: 45/45
   Total block types: 87
   Valid types: 87
   Missing types: 0

🎯 REGISTRY STATS:
   Total registered: 150
   Critical (pre-loaded): 45
   Lazy (code-split): 105
   Cache hit rate: 0%
```

## Best Practices

### 1. Sempre use `getComponentAsync` para novos códigos

```typescript
// ✅ CORRETO
const Component = await blockRegistry.getComponentAsync('quiz-logo');

// ⚠️ EVITE (sync pode retornar lazy wrapper)
const Component = blockRegistry.getComponent('quiz-logo');
```

### 2. Preload componentes críticos da rota

```typescript
// No início de uma página/rota que usa múltiplos blocos
useEffect(() => {
  blockRegistry.prefetchBatch([
    'quiz-logo',
    'quiz-progress-bar',
    'question-hero'
  ]);
}, []);
```

### 3. Use Suspense para lazy components

```typescript
import { Suspense } from 'react';

function BlockRenderer({ type, props }) {
  const Component = blockRegistry.getComponent(type);
  
  return (
    <Suspense fallback={<BlockSkeleton />}>
      <Component {...props} />
    </Suspense>
  );
}
```

### 4. Monitore performance em produção

```typescript
// Adicionar em um dashboard/monitoring
setInterval(() => {
  const stats = blockRegistry.getStats();
  
  if (stats.performance.errorRate > 5) {
    logger.warn('High block registry error rate', stats);
  }
  
  if (stats.performance.cacheHitRate < 50) {
    logger.info('Low cache hit rate, consider preloading', stats);
  }
}, 60000); // Check a cada minuto
```

### 5. Registre componentes customizados no bootstrap

```typescript
// src/bootstrap.ts ou App.tsx
import { blockRegistry } from '@/registry/UnifiedBlockRegistry';
import MyCustomBlock from './custom-blocks/MyCustomBlock';

// Registrar componente customizado
blockRegistry.register('my-custom-block', MyCustomBlock);

// Ou lazy
blockRegistry.registerLazy('my-lazy-custom', () => 
  import('./custom-blocks/MyLazyCustom')
);
```

## Troubleshooting

### "Component not found" Error

1. Verifique se o tipo está registrado:
   ```typescript
   console.log(blockRegistry.has('my-block')); // false?
   ```

2. Execute validação de templates:
   ```bash
   npx tsx scripts/validate-block-registry.ts
   ```

3. Registre o componente manualmente:
   ```typescript
   blockRegistry.register('my-block', MyBlock);
   ```

### Performance Degradation

1. Verifique cache hit rate:
   ```typescript
   const stats = blockRegistry.getStats();
   console.log('Cache hit rate:', stats.performance.cacheHitRate);
   ```

2. Se < 50%, considere preload:
   ```typescript
   blockRegistry.prefetchBatch(commonBlockTypes);
   ```

3. Limpe cache expirado periodicamente:
   ```typescript
   setInterval(() => blockRegistry.clearExpiredCache(), 5 * 60 * 1000);
   ```

## Roadmap

- [ ] Implementar persistência de cache (IndexedDB/localStorage)
- [ ] Service Worker para prefetch inteligente
- [ ] Analytics de uso para otimizar critical/lazy split
- [ ] Hot reload de componentes em dev mode
- [ ] Registry plugins system

## Support

- 📖 Docs: `/docs/UNIFIED_BLOCK_REGISTRY.md`
- 🐛 Issues: Reportar no GitHub
- 💬 Discord: Canal #architecture
