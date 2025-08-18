# Otimização de JavaScript

Este documento fornece diretrizes para reduzir o tamanho e melhorar o desempenho do JavaScript no projeto.

## Problemas Identificados no Lighthouse

Segundo o relatório do Lighthouse, os seguintes arquivos JavaScript estão consumindo mais bytes:

| Arquivo                | Tamanho  |
| ---------------------- | -------- |
| fbevents.js (Facebook) | 68,3 KiB |
| react-vendor           | 51,0 KiB |
| QuizPage               | 45,3 KiB |
| ui                     | 34,4 KiB |
| gptengineer.js         | 28,9 KiB |
| client                 | 27,2 KiB |

## Estratégias de Otimização

### 1. Carregamento Assíncrono de Scripts Externos

Para scripts como o Facebook Pixel e analytics, carregue de forma assíncrona e adie sua execução:

```html
<!-- Antes -->
<script src="https://connect.facebook.net/en_US/fbevents.js"></script>

<!-- Depois -->
<script async defer src="https://connect.facebook.net/en_US/fbevents.js"></script>
```

### 2. Code Splitting

Dividir o código em chunks menores para carregar sob demanda:

```tsx
// Antes - Importação direta
import { HeavyComponent } from './HeavyComponent';

// Depois - Importação dinâmica
import React, { lazy, Suspense } from 'react';
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 3. Importações Seletivas

Importar apenas o necessário de bibliotecas:

```tsx
// Ruim - Importa tudo
import * as Lucide from 'lucide-react';

// Bom - Importa apenas componentes específicos
import { ShoppingCart, Clock } from 'lucide-react';
```

### 4. Lazy Loading de Componentes

Carregar componentes apenas quando necessário:

```tsx
// Em App.tsx
const QuizPage = lazy(() => import('./pages/QuizPage'));
const ResultPage = lazy(() => import('./pages/ResultPage'));
```

### 5. Diferir Scripts Não Críticos

Adicionar o atributo `defer` para scripts que não são críticos para o carregamento inicial:

```html
<script defer src="https://cdn.gpteng.co/gptengineer.js"></script>
```

### 6. Remover Código Não Utilizado

Utilize ferramentas como o [Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) para identificar código não utilizado:

```bash
# Com Vite
npm install --save-dev rollup-plugin-visualizer
```

E adicione ao arquivo vite.config.ts:

```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    // outros plugins...
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
```

### 7. Bundling Eficiente

Configure o Vite para dividir seu código de forma mais eficiente:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: [
            // Listar componentes da UI que podem ser agrupados
          ],
        },
      },
    },
  },
});
```

## Scripts a Otimizar

Os scripts externos devem ser carregados de forma assíncrona no `index.html`:

```html
<!-- Facebook Pixel -->
<script async defer src="https://connect.facebook.net/en_US/fbevents.js"></script>

<!-- Cloudflare Analytics -->
<script async defer src="https://static.cloudflareinsights.com/beacon.min.js"></script>

<!-- GPT Engineer -->
<script async defer src="https://cdn.gpteng.co/gptengineer.js"></script>
```

## Conclusão

Implementando essas estratégias, podemos reduzir significativamente o tempo de carregamento inicial da página e melhorar as métricas do Lighthouse, especialmente o Total Blocking Time (TBT) e o Largest Contentful Paint (LCP).
