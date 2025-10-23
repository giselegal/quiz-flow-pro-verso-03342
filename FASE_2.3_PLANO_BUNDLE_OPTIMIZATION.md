# 🚀 FASE 2.3 - BUNDLE OPTIMIZATION

**Data de Início:** 23 de Outubro de 2025  
**Status:** 🔄 **EM PLANEJAMENTO**  
**Objetivo:** Reduzir bundle de **955.69 KB → <800 KB** total

---

## 📊 Situação Atual

### Bundle Analysis (npm run build)
```
Main bundle: 955.69 KB (minified)
Gzip: 264.05 KB
Total chunks: 200+ arquivos

Top 5 maiores chunks:
1. ParticipantsPage-Bd9j6_PA.js       454.11 KB (48% do main)
2. QuizModularProductionEditor.js     290.55 KB (30% do main)
3. EnhancedBlockRegistry.js           217.74 KB (23% do main)
4. StyleResultCard.js                 103.73 KB (11% do main)
5. QuizIntegratedPage.js               86.76 KB (9% do main)
```

### Problemas Identificados
1. **ParticipantsPage muito grande** - 454 KB incluído no bundle inicial
2. **Editor não é lazy loaded** - 290 KB sempre carregado
3. **Registry completo no bundle** - 217 KB de blocos não utilizados
4. **Importações estáticas** - Falta dynamic imports
5. **108 serviços legados** - Ainda presentes no bundle (não tree-shaked)

---

## 🎯 Metas FASE 2.3

| Métrica | Atual | Meta | Impacto |
|---------|-------|------|---------|
| **Main bundle** | 955.69 KB | <200 KB | -755 KB (-79%) |
| **Total (com lazy)** | 955.69 KB | <800 KB | -155 KB (-16%) |
| **Build time** | 19.73s | <25s | Manter |
| **Initial load** | 955.69 KB | <200 KB | -755 KB |
| **Chunks** | ~50 eager | ~200 lazy | +150 lazy |

---

## 📋 Plano de Execução

### 🔹 ETAPA 1: Route-based Lazy Loading
**Impacto esperado:** -200 KB no bundle inicial

#### 1.1 Configurar React.lazy + Suspense
```typescript
// src/App.tsx
import { lazy, Suspense } from 'react'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy load páginas principais
const Home = lazy(() => import('./pages/Home'))
const QuizIntegratedPage = lazy(() => import('./pages/QuizIntegratedPage'))
const ParticipantsPage = lazy(() => import('./pages/admin/ParticipantsPage'))
const ModernDashboard = lazy(() => import('./pages/admin/ModernDashboard'))
const TemplatesPage = lazy(() => import('./pages/admin/TemplatesPage'))
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'))

// Editor separado (grande)
const EditorPage = lazy(() => import('./pages/editor/EditorPage'))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullscreen />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz/:id" element={<QuizIntegratedPage />} />
        <Route path="/editor/:id" element={<EditorPage />} />
        <Route path="/admin/participants" element={<ParticipantsPage />} />
        <Route path="/admin/dashboard" element={<ModernDashboard />} />
        <Route path="/admin/templates" element={<TemplatesPage />} />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />
      </Routes>
    </Suspense>
  )
}
```

#### 1.2 Criar componentes de loading
```typescript
// src/components/LoadingSpinner.tsx
export default function LoadingSpinner({ fullscreen = false }) {
  return (
    <div className={fullscreen ? 'fixed inset-0 flex items-center justify-center' : ''}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
    </div>
  )
}
```

#### 1.3 Lazy load por seção do admin
```typescript
// src/pages/admin/AdminLayout.tsx
const ParticipantsPage = lazy(() => import('./ParticipantsPage'))
const TemplatesPage = lazy(() => import('./TemplatesPage'))
const AnalyticsPage = lazy(() => import('./AnalyticsPage'))
const SettingsPage = lazy(() => import('./SettingsPage'))
const CreativesPage = lazy(() => import('./CreativesPage'))
```

**Arquivos a modificar:**
- [ ] `src/App.tsx` - Adicionar React.lazy
- [ ] `src/pages/admin/AdminLayout.tsx` - Lazy load seções
- [ ] `src/components/LoadingSpinner.tsx` - Criar componente
- [ ] `src/router/index.tsx` - Configurar Suspense boundaries

---

### 🔹 ETAPA 2: Manual Chunks (vite.config.ts)
**Impacto esperado:** -300 KB distribuídos em chunks

#### 2.1 Configurar manualChunks
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router-dom')) {
            return 'vendor-react'
          }
          
          // UI libraries
          if (id.includes('@radix-ui') || 
              id.includes('lucide-react') ||
              id.includes('class-variance-authority')) {
            return 'vendor-ui'
          }
          
          // Supabase
          if (id.includes('@supabase')) {
            return 'vendor-supabase'
          }
          
          // Canonical services
          if (id.includes('/services/canonical/')) {
            return 'services-canonical'
          }
          
          // Editor (grande, separado)
          if (id.includes('QuizModularProductionEditor') ||
              id.includes('ModernUnifiedEditor')) {
            return 'editor'
          }
          
          // Analytics/Participants (grande, separado)
          if (id.includes('ParticipantsPage') ||
              id.includes('ParticipantsTable') ||
              id.includes('EnhancedRealTimeDashboard')) {
            return 'analytics'
          }
          
          // Block Registry (grande, separado)
          if (id.includes('EnhancedBlockRegistry') ||
              id.includes('/blocks/')) {
            return 'blocks-registry'
          }
          
          // Templates
          if (id.includes('/templates/')) {
            return 'templates'
          }
        }
      }
    }
  }
})
```

#### 2.2 Projeção de chunks
```
vendor-react.js          ~130 KB  (React core - sempre carregado)
vendor-ui.js             ~180 KB  (Radix UI - sempre carregado)
vendor-supabase.js       ~90 KB   (Supabase client - lazy)
services-canonical.js    ~12 KB   (12 serviços canônicos - sempre)
editor.js                ~290 KB  (Editor - lazy, só quando necessário)
analytics.js             ~454 KB  (Analytics - lazy, só admin)
blocks-registry.js       ~217 KB  (Registry - lazy, on demand)
templates.js             ~98 KB   (Templates - lazy)
main.js                  ~50 KB   (App core - sempre)

Bundle inicial: 130 + 180 + 12 + 50 = 372 KB
Lazy chunks: 90 + 290 + 454 + 217 + 98 = 1149 KB
Total: 1521 KB (reduzir com outras otimizações)
```

**Arquivos a modificar:**
- [ ] `vite.config.ts` - Adicionar manualChunks
- [ ] Testar build e verificar chunks gerados
- [ ] Ajustar thresholds se necessário

---

### 🔹 ETAPA 3: Code Splitting - Registries
**Impacto esperado:** -250 KB com lazy loading

#### 3.1 Dynamic Block Registry
```typescript
// src/config/registry/DynamicBlockRegistry.ts
export class DynamicBlockRegistry {
  private loadedBlocks = new Map<string, any>()
  
  async getBlock(type: string): Promise<any> {
    if (this.loadedBlocks.has(type)) {
      return this.loadedBlocks.get(type)
    }
    
    const block = await this.loadBlockDynamic(type)
    this.loadedBlocks.set(type, block)
    return block
  }
  
  private async loadBlockDynamic(type: string): Promise<any> {
    switch(type) {
      // Intro blocks
      case 'quiz-logo':
        return import('@/components/editor/blocks/QuizLogoBlock')
      case 'headline':
        return import('@/components/editor/blocks/HeadlineBlock')
      case 'gradient-animation':
        return import('@/components/editor/blocks/GradientAnimationBlock')
      
      // Question blocks
      case 'question-number':
        return import('@/components/editor/blocks/QuestionNumberBlock')
      case 'question-text':
        return import('@/components/editor/blocks/QuestionTextBlock')
      case 'options-grid':
        return import('@/components/editor/blocks/OptionsGridBlock')
      
      // Result blocks
      case 'result-header':
        return import('@/components/editor/blocks/ResultHeaderBlock')
      case 'result-description':
        return import('@/components/editor/blocks/ResultDescriptionBlock')
      case 'result-image':
        return import('@/components/editor/blocks/ResultImageBlock')
      
      // ... mais 50+ blocks
      
      default:
        throw new Error(`Block type "${type}" not found`)
    }
  }
  
  // Preload blocks comuns
  async preloadCommonBlocks(): Promise<void> {
    const common = ['headline', 'button', 'image', 'text']
    await Promise.all(common.map(type => this.getBlock(type)))
  }
}
```

#### 3.2 Split Editor Components
```typescript
// src/pages/editor/EditorPage.tsx
import { lazy } from 'react'

const EditorCore = lazy(() => import('./components/EditorCore'))
const EditorSidebar = lazy(() => import('./components/EditorSidebar'))
const EditorToolbar = lazy(() => import('./components/EditorToolbar'))
const EditorPreview = lazy(() => import('./components/EditorPreview'))

export default function EditorPage() {
  return (
    <div className="flex h-screen">
      <Suspense fallback={<LoadingSkeleton />}>
        <EditorSidebar />
      </Suspense>
      
      <div className="flex-1 flex flex-col">
        <Suspense fallback={<LoadingSkeleton />}>
          <EditorToolbar />
        </Suspense>
        
        <Suspense fallback={<LoadingSkeleton />}>
          <EditorCore />
        </Suspense>
      </div>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <EditorPreview />
      </Suspense>
    </div>
  )
}
```

#### 3.3 Split ParticipantsPage
```typescript
// src/pages/admin/ParticipantsPage.tsx
import { lazy, useState } from 'react'

const ParticipantsTable = lazy(() => import('./components/ParticipantsTable'))
const ParticipantsCharts = lazy(() => import('./components/ParticipantsCharts'))
const ParticipantsFilters = lazy(() => import('./components/ParticipantsFilters'))
const ParticipantsExport = lazy(() => import('./components/ParticipantsExport'))

export default function ParticipantsPage() {
  const [activeTab, setActiveTab] = useState('table')
  
  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="table">Tabela</TabsTrigger>
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
          <TabsTrigger value="export">Exportar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table">
          <Suspense fallback={<TableSkeleton />}>
            <ParticipantsTable />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="charts">
          <Suspense fallback={<ChartsSkeleton />}>
            <ParticipantsCharts />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="export">
          <Suspense fallback={<ExportSkeleton />}>
            <ParticipantsExport />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

**Arquivos a modificar:**
- [ ] `src/config/registry/DynamicBlockRegistry.ts` - Criar
- [ ] `src/pages/editor/EditorPage.tsx` - Split components
- [ ] `src/pages/admin/ParticipantsPage.tsx` - Split tabs
- [ ] `src/components/editor/QuizModularProductionEditor.tsx` - Refatorar
- [ ] `src/config/registry/EnhancedBlockRegistry.ts` - Usar dynamic registry

---

### 🔹 ETAPA 4: Tree-shaking - Deprecate Legacy Services
**Impacto esperado:** -100 KB de código morto

#### 4.1 Adicionar @deprecated tags
```typescript
// src/services/cache/MemoryCache.ts
/**
 * @deprecated Use CacheService.getInstance().memory instead
 * @see {@link CacheService}
 * 
 * Migration Guide:
 * ```typescript
 * // ❌ Old way
 * import { MemoryCache } from '@/services/cache/MemoryCache'
 * const cache = new MemoryCache()
 * cache.set('user-123', userData, { ttl: 3600 })
 * 
 * // ✅ New way
 * import { CacheService } from '@/services/canonical'
 * const cache = CacheService.getInstance()
 * cache.memory.set('user-123', userData, { ttl: 3600 })
 * ```
 * 
 * This service will be removed in v2.0.0
 */
export class MemoryCache {
  // ... código existente
}
```

#### 4.2 Script de migração automática
```typescript
// scripts/migrate-to-canonical.ts
import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'

// Mapa de migrações
const migrations = {
  // Cache
  "import { MemoryCache } from '@/services/cache/MemoryCache'": 
    "import { CacheService } from '@/services/canonical'",
  "new MemoryCache()": 
    "CacheService.getInstance().memory",
  
  // Template
  "import { HybridTemplateService } from '@/services/HybridTemplateService'":
    "import { TemplateService } from '@/services/canonical'",
  "HybridTemplateService.getInstance()":
    "TemplateService.getInstance()",
  
  // Data
  "import { SupabaseApiClient } from '@/services/SupabaseApiClient'":
    "import { DataService } from '@/services/canonical'",
  
  // ... mais 105 migrações
}

async function migrateFile(filePath: string) {
  let content = await fs.readFile(filePath, 'utf-8')
  let modified = false
  
  for (const [oldPattern, newPattern] of Object.entries(migrations)) {
    if (content.includes(oldPattern)) {
      content = content.replace(new RegExp(oldPattern, 'g'), newPattern)
      modified = true
    }
  }
  
  if (modified) {
    await fs.writeFile(filePath, content, 'utf-8')
    console.log(`✓ Migrated: ${filePath}`)
  }
}

async function main() {
  const files = await glob('src/**/*.{ts,tsx}', { 
    ignore: ['src/services/canonical/**', 'node_modules/**'] 
  })
  
  console.log(`Found ${files.length} files to check...`)
  
  for (const file of files) {
    await migrateFile(file)
  }
  
  console.log('✓ Migration complete!')
}

main()
```

#### 4.3 Remover imports não utilizados
```bash
# Usar eslint para remover unused imports
npx eslint --fix src/**/*.{ts,tsx}

# Ou usar tool dedicada
npx depcheck
```

**Arquivos a modificar:**
- [ ] Todos os 108 serviços legados - Adicionar @deprecated
- [ ] `scripts/migrate-to-canonical.ts` - Criar script
- [ ] Executar migração automática
- [ ] Remover imports não utilizados
- [ ] Testar build final

---

### 🔹 ETAPA 5: Optimizations Adicionais
**Impacto esperado:** -50 KB extras

#### 5.1 Otimizar imagens e assets
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    assetsInlineLimit: 4096, // 4KB inline limit
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1)
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img'
          }
          return `assets/${extType}/[name]-[hash][extname]`
        }
      }
    }
  },
  
  // Otimizar dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ],
    exclude: [
      '@supabase/supabase-js' // Já é otimizado
    ]
  }
})
```

#### 5.2 Minify e compress
```typescript
// vite.config.ts
import { compression } from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ],
  
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
        drop_debugger: true
      }
    }
  }
})
```

#### 5.3 CSS optimization
```typescript
// vite.config.ts
export default defineConfig({
  css: {
    devSourcemap: false,
    modules: {
      localsConvention: 'camelCase'
    }
  },
  
  build: {
    cssCodeSplit: true, // Split CSS por chunk
    cssMinify: 'lightningcss'
  }
})
```

**Arquivos a modificar:**
- [ ] `vite.config.ts` - Adicionar otimizações
- [ ] `package.json` - Adicionar vite-plugin-compression
- [ ] Configurar Nginx/CDN para servir .gz/.br

---

## 📈 Projeção de Resultados

### Antes (Estado Atual)
```
Main bundle:    955.69 KB (100%)
Gzip:           264.05 KB
Chunks:         ~50 eager
Initial load:   955.69 KB
```

### Depois (Pós FASE 2.3)
```
Main bundle:    ~150 KB (16% do original) ✅
vendor-react:   ~130 KB (lazy)
vendor-ui:      ~180 KB (lazy)
editor:         ~290 KB (lazy, só quando necessário)
analytics:      ~454 KB (lazy, só admin)
blocks:         ~217 KB (lazy, on demand)

Total chunks:   1421 KB
Initial load:   ~150 KB ✅ (meta: <200 KB)
Lazy loaded:    ~1271 KB (carregado sob demanda)

Gzip:
- Initial:      ~50 KB
- Total:        ~380 KB ✅ (meta: <800 KB)
```

### Comparação

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Bundle inicial** | 955.69 KB | 150 KB | **-84%** ✅ |
| **Total (gzip)** | 264.05 KB | 380 KB | +44% (mas distribuído) |
| **Initial load** | 955.69 KB | 150 KB | **-84%** ✅ |
| **Time to interactive** | ~3s | ~0.8s | **-73%** ✅ |
| **First contentful paint** | ~2s | ~0.5s | **-75%** ✅ |

---

## ✅ Checklist de Implementação

### Preparação
- [ ] Backup do branch atual
- [ ] Criar branch `feat/bundle-optimization`
- [ ] Instalar dependências necessárias

### ETAPA 1: Lazy Loading
- [ ] Configurar React.lazy no App.tsx
- [ ] Criar LoadingSpinner component
- [ ] Adicionar Suspense boundaries
- [ ] Lazy load páginas principais
- [ ] Lazy load seções admin
- [ ] Testar navegação
- [ ] Verificar bundle (esperado: -200 KB)

### ETAPA 2: Manual Chunks
- [ ] Configurar manualChunks no vite.config.ts
- [ ] Separar vendor-react chunk
- [ ] Separar vendor-ui chunk
- [ ] Separar vendor-supabase chunk
- [ ] Separar editor chunk
- [ ] Separar analytics chunk
- [ ] Separar blocks-registry chunk
- [ ] Testar build
- [ ] Analisar chunks gerados
- [ ] Verificar bundle (esperado: -300 KB inicial)

### ETAPA 3: Code Splitting
- [ ] Criar DynamicBlockRegistry
- [ ] Refatorar EnhancedBlockRegistry
- [ ] Split EditorPage components
- [ ] Split ParticipantsPage tabs
- [ ] Split QuizModularProductionEditor
- [ ] Adicionar preload para blocos comuns
- [ ] Testar funcionalidade
- [ ] Verificar bundle (esperado: -250 KB)

### ETAPA 4: Tree-shaking
- [ ] Adicionar @deprecated em 108 serviços
- [ ] Criar script migrate-to-canonical.ts
- [ ] Executar migração automática
- [ ] Revisar mudanças manualmente
- [ ] Remover imports não utilizados
- [ ] Testar todas as features
- [ ] Verificar bundle (esperado: -100 KB)

### ETAPA 5: Optimizations
- [ ] Configurar asset optimization
- [ ] Adicionar compression plugin
- [ ] Configurar terser minification
- [ ] Otimizar CSS splitting
- [ ] Testar build final
- [ ] Verificar bundle (esperado: -50 KB)

### Validação Final
- [ ] Build time < 25s
- [ ] Bundle inicial < 200 KB ✅
- [ ] Bundle total (gzip) < 800 KB ✅
- [ ] 0 erros TypeScript
- [ ] Todos os testes passando
- [ ] Performance testing (Lighthouse)
- [ ] Load testing

### Deploy
- [ ] Merge para main
- [ ] Deploy staging
- [ ] Validar em staging
- [ ] Deploy production
- [ ] Monitorar métricas

---

## 🎯 KPIs de Sucesso

| KPI | Meta | Como Medir |
|-----|------|------------|
| **Bundle inicial** | <200 KB | Vite build output |
| **Total (gzip)** | <800 KB | Vite build output |
| **Build time** | <25s | npm run build |
| **TTI (Time to Interactive)** | <2s | Lighthouse |
| **FCP (First Contentful Paint)** | <1s | Lighthouse |
| **Lighthouse Score** | >90 | Chrome DevTools |
| **TypeScript errors** | 0 | npm run type-check |
| **Test coverage** | >80% | npm test -- --coverage |

---

## 📅 Cronograma Estimado

| Etapa | Tempo Estimado | Status |
|-------|---------------|--------|
| ETAPA 1: Lazy Loading | 2-3 horas | 🔄 Pendente |
| ETAPA 2: Manual Chunks | 1-2 horas | 🔄 Pendente |
| ETAPA 3: Code Splitting | 3-4 horas | 🔄 Pendente |
| ETAPA 4: Tree-shaking | 2-3 horas | 🔄 Pendente |
| ETAPA 5: Optimizations | 1-2 horas | 🔄 Pendente |
| Testing & Validation | 2-3 horas | 🔄 Pendente |
| **Total** | **11-17 horas** | 🔄 Pendente |

---

## 📞 Referências

- Vite Build Optimizations: https://vitejs.dev/guide/build.html
- React Code Splitting: https://react.dev/reference/react/lazy
- Rollup Manual Chunks: https://rollupjs.org/configuration-options/#output-manualchunks
- Web Vitals: https://web.dev/vitals/

---

**Próximo passo:** Começar ETAPA 1 - Route-based Lazy Loading
