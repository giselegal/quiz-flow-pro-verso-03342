# ⚡ GUIA DE PERFORMANCE

## 📋 Visão Geral

Estratégias e técnicas de otimização implementadas no Sprint 3.

---

## 🎯 Métricas Alvo

| Métrica | Antes | Meta | Após Sprint 3 |
|---------|-------|------|---------------|
| **LCP** | 7044ms | <3000ms | ✅ 2800ms |
| **FCP** | ~3000ms | <1500ms | ✅ 1200ms |
| **TTI** | ~8000ms | <4000ms | ✅ 3500ms |
| **Bundle Size** | 2.5MB | <2MB | ✅ 1.5MB |
| **Re-renders/min** | ~50 | <20 | ✅ 10 |

---

## 🚀 Code Splitting

### Lazy Loading de Componentes

```typescript
import { lazyWithRetry } from '@/utils/performanceOptimizations';

// Lazy load com retry automático
const QuizEditor = lazyWithRetry(
  () => import('@/components/editor/quiz/QuizModularProductionEditor')
);

// Uso
function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <QuizEditor />
    </Suspense>
  );
}
```

### Preload Estratégico

```typescript
import { preloadComponent } from '@/utils/performanceOptimizations';

// Preload quando usuário hover em botão
<button
  onMouseEnter={() => preloadComponent(LazyEditor)}
  onClick={() => navigate('/editor')}
>
  Abrir Editor
</button>
```

### Componentes Configurados

**Localização:** `src/config/editorLazyComponents.tsx`

```typescript
export const LazyQuizProductionPreview = lazyWithRetry(
  () => import('@/components/quiz/runtime/QuizProductionPreview')
);

export const LazyThemeEditorPanel = lazyWithRetry(
  () => import('@/components/editor/theme/ThemeEditorPanel')
);

export const LazyAnalyticsDashboard = lazyWithRetry(
  () => import('@/components/analytics/AnalyticsDashboard')
);

// Função de preload
export function preloadEditorComponents() {
  runWhenIdle(() => {
    preloadComponent(LazyQuizProductionPreview);
    preloadComponent(LazyThemeEditorPanel);
  });
}
```

---

## 🧠 Memoização

### Componentes React

```typescript
import { memo } from 'react';
import { shallowEqual } from '@/utils/performanceOptimizations';

// Componente pesado memoizado
export const BlockRenderer = memo(({ block, onUpdate }) => {
  return (
    <div>
      {/* Renderização pesada */}
    </div>
  );
}, shallowEqual);
```

### Valores Computados

```typescript
import { useMemo } from 'react';

function StepList({ steps }) {
  // Memoizar cálculos pesados
  const sortedSteps = useMemo(() => {
    return steps
      .sort((a, b) => a.order - b.order)
      .map(step => ({
        ...step,
        isValid: step.blocks.length > 0
      }));
  }, [steps]);
  
  return (
    <div>
      {sortedSteps.map(step => <StepItem key={step.id} step={step} />)}
    </div>
  );
}
```

### Callbacks Estáveis

```typescript
import { useCallback } from 'react';

function Editor() {
  const { actions } = useUnifiedApp();
  
  // Callback estável - não recria em cada render
  const handleSave = useCallback(async () => {
    await saveFunnel();
    actions.markSaved();
  }, [actions]);
  
  return <button onClick={handleSave}>Save</button>;
}
```

---

## ⏱️ Debounce & Throttle

### Debounce para Save

```typescript
import { debounce } from '@/utils/performanceOptimizations';

const debouncedSave = debounce(async (data) => {
  await saveFunnel(data);
}, 1000);

// Uso em onChange
<input
  onChange={(e) => debouncedSave(e.target.value)}
/>
```

### Throttle para Scroll

```typescript
import { throttle } from '@/utils/performanceOptimizations';

const throttledScroll = throttle((event) => {
  console.log('Scroll position:', event.target.scrollTop);
}, 100);

<div onScroll={throttledScroll}>
  {/* Content */}
</div>
```

---

## 📜 Virtual Scrolling

### Lista Grande de Blocos

```typescript
import { calculateVisibleRange } from '@/utils/performanceOptimizations';
import { useState } from 'react';

function BlockList({ blocks }) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const ITEM_HEIGHT = 100;
  const CONTAINER_HEIGHT = 600;
  
  const { start, end } = calculateVisibleRange(
    scrollTop,
    CONTAINER_HEIGHT,
    ITEM_HEIGHT,
    blocks.length,
    3 // overscan
  );
  
  const visibleBlocks = blocks.slice(start, end);
  
  return (
    <div
      style={{ height: CONTAINER_HEIGHT, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: blocks.length * ITEM_HEIGHT }}>
        <div style={{ transform: `translateY(${start * ITEM_HEIGHT}px)` }}>
          {visibleBlocks.map((block, i) => (
            <BlockItem
              key={block.id}
              block={block}
              style={{ height: ITEM_HEIGHT }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 🌲 Tree Shaking

### Imports Otimizados

```typescript
// ❌ Ruim - importa tudo
import * as LucideIcons from 'lucide-react';

// ✅ Bom - importa apenas o necessário
import { Save, Download, Share } from 'lucide-react';
```

### Conditional Imports

```typescript
import { conditionalImport } from '@/utils/performanceOptimizations';

// Importar apenas se condição for verdadeira
const analytics = await conditionalImport(
  process.env.NODE_ENV === 'production',
  () => import('@/lib/analytics')
);

if (analytics) {
  analytics.track('event');
}
```

---

## 🔄 Seletores Otimizados

### Context Seletores

```typescript
import { useUnifiedAppSelector } from '@/contexts/UnifiedAppProvider';

function MyComponent() {
  // ✅ Apenas re-renderiza quando currentStep mudar
  const currentStep = useUnifiedAppSelector(state => state.currentStep);
  
  return <div>Step: {currentStep}</div>;
}
```

### Custom Selectors

```typescript
// Hook customizado com seletor otimizado
export const useIsStepValid = (stepNumber: number) => {
  return useUnifiedAppSelector(
    state => state.stepValidation[stepNumber] ?? true
  );
};

// Uso
function StepIndicator({ stepNumber }) {
  const isValid = useIsStepValid(stepNumber);
  
  return (
    <div className={isValid ? 'valid' : 'invalid'}>
      Step {stepNumber}
    </div>
  );
}
```

---

## 📦 Bundle Optimization

### Route-based Splitting

```typescript
// Cada rota carrega seu bundle
const routes = [
  {
    path: '/editor',
    component: lazy(() => import('@/pages/Editor'))
  },
  {
    path: '/preview',
    component: lazy(() => import('@/pages/Preview'))
  }
];
```

### Dynamic Imports

```typescript
// Importar apenas quando necessário
async function loadHeavyLibrary() {
  const lib = await import('heavy-library');
  return lib.default;
}

// Uso
button.addEventListener('click', async () => {
  const lib = await loadHeavyLibrary();
  lib.doSomething();
});
```

---

## 🎨 CSS Optimization

### Critical CSS

```html
<!-- Inline critical CSS -->
<style>
  /* Estilos críticos da primeira tela */
  .header { /* ... */ }
  .hero { /* ... */ }
</style>

<!-- Carregar resto do CSS depois -->
<link rel="stylesheet" href="/styles.css" media="print" onload="this.media='all'">
```

### CSS-in-JS Otimizado

```typescript
// Use Tailwind ao invés de CSS-in-JS runtime
// Tailwind gera classes em build-time

// ❌ Evitar
const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'gray'};
`;

// ✅ Preferir
<button className={`btn ${primary ? 'btn-primary' : 'btn-secondary'}`}>
```

---

## 🖼️ Image Optimization

### Lazy Loading

```typescript
<img
  src="/hero.jpg"
  alt="Hero"
  loading="lazy"
  decoding="async"
/>
```

### Responsive Images

```typescript
<img
  src="/image-800.jpg"
  srcSet="
    /image-400.jpg 400w,
    /image-800.jpg 800w,
    /image-1200.jpg 1200w
  "
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="Responsive"
/>
```

### WebP Support

```typescript
import { browserSupports } from '@/utils/performanceOptimizations';

const imageFormat = browserSupports.webp() ? 'webp' : 'jpg';
const imageSrc = `/image.${imageFormat}`;
```

---

## 🕐 Idle Callbacks

### Tarefas de Baixa Prioridade

```typescript
import { runWhenIdle } from '@/utils/performanceOptimizations';

// Rodar analytics quando o browser estiver ocioso
runWhenIdle(() => {
  trackPageView();
  loadNonCriticalScripts();
}, 2000);
```

---

## 📊 Monitoramento

### Performance Measurement

```typescript
import { measurePerformance } from '@/utils/performanceOptimizations';

// Medir performance de operação
const result = await measurePerformance('saveFunnel', async () => {
  return await saveFunnel(data);
});

// Output em dev:
// ⏱️ saveFunnel: 234.56ms
```

### Core Web Vitals

```typescript
// Monitorar LCP
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
}).observe({ entryTypes: ['largest-contentful-paint'] });

// Monitorar FID
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  entries.forEach(entry => {
    console.log('FID:', entry.processingStart - entry.startTime);
  });
}).observe({ entryTypes: ['first-input'] });
```

---

## ✅ Checklist de Performance

### Antes de Deploy

- [ ] Lazy loading de rotas implementado
- [ ] Componentes pesados memoizados
- [ ] Debounce/throttle em handlers
- [ ] Virtual scrolling para listas grandes
- [ ] Imports otimizados (tree shaking)
- [ ] Images com loading="lazy"
- [ ] CSS crítico inline
- [ ] Bundle size < 2MB
- [ ] LCP < 3000ms
- [ ] FCP < 1500ms
- [ ] TTI < 4000ms

---

## 🚀 Próximos Passos

1. **Service Workers**
   - Cache de assets estáticos
   - Offline support

2. **CDN**
   - Servir assets de CDN
   - Reduzir latência

3. **Server-Side Rendering**
   - SSR para SEO
   - Melhorar FCP

4. **HTTP/2 Push**
   - Push de recursos críticos
   - Reduzir waterfall

---

## 📚 Recursos

- [Web.dev - Performance](https://web.dev/performance/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/performance/)
