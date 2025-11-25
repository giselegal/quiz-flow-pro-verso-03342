# 📘 Migração para Arquitetura Core - Guia Prático

> **Status:** FASE 2 em andamento  
> **Última atualização:** 2025-01  
> **Complementa:** `MIGRATION_GUIDE.md` (consolidação de serviços)

Este documento foca especificamente na migração para os módulos `@core` e `@shared`.

---

## 🎯 Estrutura da Nova Arquitetura

```
src/
├── core/                    # ← NOVA: Lógica fundamental
│   ├── contexts/
│   │   └── EditorContext/   # Estado unificado do editor
│   ├── hooks/               # Hooks reutilizáveis
│   │   ├── useEditor.ts
│   │   └── useBlockDraft.ts # Draft com undo/redo
│   ├── schemas/             # Validação Zod (fonte única)
│   │   ├── blockSchema.ts
│   │   └── stepSchema.ts
│   ├── services/
│   │   └── persistenceService.ts  # Save/load unificado
│   └── utils/
│       └── featureFlags.ts  # Sistema de feature flags
│
└── shared/                  # ← NOVA: Componentes compartilhados
    └── components/
        └── ErrorBoundary.tsx
```

---

## 📦 Tabela de Migração de Imports

| Antigo (Legado) | Novo (Core) | Status |
|----------------|-------------|--------|
| `@/contexts/editor/EditorStateProvider` | `@/core/contexts/EditorContext` | ✅ Migrado |
| `@/contexts/editor/EditorCompatLayer` | `@/core/contexts/EditorContext` | ✅ Migrado |
| `@/types/block-schema` | `@/core/schemas/blockSchema` | ✅ Migrado |
| `@/services/template-manager` | `@/core/services/persistenceService` | ⏳ Planejado |
| `@/hooks/useEditor` | `@/core/hooks/useEditor` | ⚠️ Deprecated |

---

## 🔧 Exemplos de Migração

### 1. Editor Context

**❌ ANTES:**
```typescript
import { useEditor } from '@/contexts/editor/EditorStateProvider';

function MyComponent() {
  const editor = useEditor();
  const blocks = editor.state.blocks;
  
  return <div>{blocks.length} blocos</div>;
}
```

**✅ DEPOIS:**
```typescript
import { useEditor } from '@/core/contexts/EditorContext';

function MyComponent() {
  const editor = useEditor();
  const blocks = editor.state.blocks;
  
  // API idêntica! Nenhuma mudança necessária no resto do código
  return <div>{blocks.length} blocos</div>;
}
```

---

### 2. Schemas de Validação

**❌ ANTES (Múltiplas fontes):**
```typescript
// Tipo definido em um arquivo
import { Block } from '@/types/editor';

// Schema em outro
import { blockSchema } from '@/types/block-schema';

// Validação em terceiro
import { validateBlock } from '@/utils/validation';

// Factory em quarto
import { createBlock } from '@/lib/block-factory';
```

**✅ DEPOIS (Fonte única):**
```typescript
import { 
  BlockSchema,      // Schema Zod
  Block,            // Tipo TypeScript derivado automaticamente
  validateBlock,    // Helper de validação
  createBlock       // Factory function
} from '@/core/schemas/blockSchema';

// Criar bloco com validação automática
const block = createBlock('intro-title', {
  title: 'Bem-vindo',
  subtitle: 'Inicie seu quiz'
});

// Validar bloco existente
const result = validateBlock(someBlock);
if (!result.success) {
  console.error('Erros:', result.error.issues);
}
```

---

### 3. Persistence (Save/Load)

**❌ ANTES (Fragmentado):**
```typescript
// 4 sistemas diferentes!
import { TemplateManager } from '@/services/template-manager';
import { funnelLocalCache } from '@/lib/funnel-cache';
import { useSupabaseSave } from '@/hooks/useSupabaseSave';
import { saveToIndexedDB } from '@/utils/indexeddb';

// Lógica complexa e propensa a race conditions
const tm = new TemplateManager();
await tm.saveTemplate(id, data);
funnelLocalCache.set(id, data);
// ... mais código
```

**✅ DEPOIS (Unificado):**
```typescript
import { persistenceService } from '@/core/services/persistenceService';

// Save com retry automático e exponential backoff
await persistenceService.saveBlocks('funnel-123', blocks, {
  maxRetries: 3,
  validateBeforeSave: true
});

// Load com cache
const result = await persistenceService.loadBlocks('funnel-123');
if (result.success) {
  console.log('Versão:', result.version);
  console.log('Blocos:', result.blocks);
}

// Rollback para versão anterior
await persistenceService.rollback('funnel-123', '2025-01-15T10:30:00Z');
```

---

### 4. Draft Management com Undo/Redo

**❌ ANTES (Manual - 50+ linhas):**
```typescript
const [draft, setDraft] = useState(block);
const [history, setHistory] = useState([block]);
const [historyIndex, setHistoryIndex] = useState(0);
const [isDirty, setIsDirty] = useState(false);

const handleChange = (field: string, value: any) => {
  const newDraft = { ...draft, [field]: value };
  setDraft(newDraft);
  setHistory([...history.slice(0, historyIndex + 1), newDraft]);
  setHistoryIndex(historyIndex + 1);
  setIsDirty(true);
};

const undo = () => {
  if (historyIndex > 0) {
    setHistoryIndex(historyIndex - 1);
    setDraft(history[historyIndex - 1]);
  }
};

// ... mais código para redo, save, cancel, etc.
```

**✅ DEPOIS (Automático - 5 linhas):**
```typescript
import { useBlockDraft } from '@/core/hooks/useBlockDraft';

const draft = useBlockDraft(block, {
  onCommit: (updated) => saveBlock(updated),
  validateOnChange: true
});

// API fluente pronta para usar
<Input 
  value={draft.data.title}
  onChange={(e) => draft.updateContent('title', e.target.value)}
/>

{draft.isDirty && <Badge>Não salvo</Badge>}
{draft.errors.length > 0 && <Alert>{draft.errors[0]}</Alert>}

<button onClick={draft.commit}>Salvar</button>
<button onClick={draft.cancel}>Cancelar</button>
<button onClick={draft.undo}>Desfazer</button>
<button onClick={draft.redo}>Refazer</button>
```

---

### 5. Error Boundaries

**❌ ANTES (Sem proteção):**
```tsx
function App() {
  return (
    <Router>
      <Routes />
    </Router>
  );
}
// ☠️ Um erro em qualquer rota = tela branca total
```

**✅ DEPOIS (Protegido):**
```tsx
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary 
      onError={(error, errorInfo) => {
        appLogger.error('App crashed:', error);
      }}
    >
      <Router>
        <Routes />
      </Router>
    </ErrorBoundary>
  );
}
// ✅ Um erro em uma rota = UI elegante + log + opção de reset
```

**Custom Fallback:**
```tsx
<ErrorBoundary
  fallback={(error, reset) => (
    <div className="error-container">
      <h1>Algo deu errado 😞</h1>
      <details>
        <summary>Detalhes técnicos</summary>
        <pre>{error.stack}</pre>
      </details>
      <button onClick={reset}>Recarregar componente</button>
    </div>
  )}
>
  <CriticalComponent />
</ErrorBoundary>
```

---

### 6. Feature Flags

**❌ ANTES (Hardcoded):**
```typescript
// Mudava manualmente no código fonte
const USE_NEW_EDITOR = true;
const ENABLE_BETA_FEATURES = false;

if (USE_NEW_EDITOR) {
  return <NewEditor />;
}
```

**✅ DEPOIS (Dinâmico):**
```typescript
import { useFeatureFlag } from '@/core/utils/featureFlags';

function EditorPage() {
  const useNewEditor = useFeatureFlag('useUnifiedEditor');
  
  if (useNewEditor) {
    return <UnifiedEditor />;
  }
  return <LegacyEditor />;
}
```

**Controle via Console (desenvolvimento):**
```javascript
// No DevTools Console:

// Ver todas as flags
getFeatureFlags();

// Habilitar feature
setFeatureFlag('useUnifiedEditor', true);

// Desabilitar feature
setFeatureFlag('enableExperimentalFeatures', false);

// Reset para padrões
resetFeatureFlags();
```

**Flags Disponíveis:**
```typescript
- useUnifiedEditor              // Editor consolidado
- useUnifiedContext             // Contexto unificado
- useSinglePropertiesPanel      // Painel único de props
- enableLazyLoading             // Code splitting
- enableAdvancedValidation      // Validação Zod estrita
- usePersistenceService         // Persistence unificado
- enableErrorBoundaries         // Error boundaries
- enablePerformanceMonitoring   // Métricas de performance
- enableDebugPanel              // Painel de debug
- enableExperimentalFeatures    // Features beta
- useNewUIComponents            // Nova UI
- enableAccessibilityEnhancements // A11y
```

---

## 🚀 Criando Nova Página com Core Architecture

```tsx
// src/pages/my-feature/MyFeaturePage.tsx

import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { useEditor } from '@/core/contexts/EditorContext';
import { useFeatureFlag } from '@/core/utils/featureFlags';

// Lazy loading
const MyFeatureContent = React.lazy(() => 
  import('./MyFeatureContent')
);

export function MyFeaturePage() {
  const editor = useEditor();
  const isExperimental = useFeatureFlag('enableExperimentalFeatures');
  
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <div>
          <h1>My Feature</h1>
          <MyFeatureContent 
            blocks={editor.state.blocks}
            experimental={isExperimental}
          />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
```

**Adicionar em `routes.ts`:**
```typescript
// src/pages/routes.ts

export const routes: RouteConfig[] = [
  // ...
  {
    path: '/my-feature',
    component: lazy(() => import('./my-feature/MyFeaturePage')),
    name: 'My Feature',
    group: 'admin',
    requiresAuth: true,
    featureFlag: 'enableExperimentalFeatures',
    preloadPriority: 'low'
  }
];
```

---

## 🧪 Testando a Migração

### 1. Verificar Compilação TypeScript

```bash
npm run typecheck
```

**Erros comuns e soluções:**

```typescript
// ❌ Erro: Cannot find module '@/contexts/editor/EditorStateProvider'
import { useEditor } from '@/contexts/editor/EditorStateProvider';

// ✅ Solução:
import { useEditor } from '@/core/contexts/EditorContext';
```

```typescript
// ❌ Erro: Type 'Block' is not assignable...
import { Block } from '@/types/editor';

// ✅ Solução:
import { Block } from '@/core/schemas/blockSchema';
```

### 2. Runtime Testing

```bash
npm run dev
```

**Abrir DevTools Console:**
```javascript
// Verificar feature flags
getFeatureFlags();

// Habilitar novo editor
setFeatureFlag('useUnifiedEditor', true);

// Recarregar página
location.reload();
```

### 3. Testar Error Boundaries

**Adicionar erro temporário:**
```typescript
function TestComponent() {
  if (Math.random() > 0.5) {
    throw new Error('Test error boundary');
  }
  return <div>Component funcionando</div>;
}
```

**Resultado esperado:**
- ✅ UI de erro elegante (não tela branca)
- ✅ Erro logado no console
- ✅ Botão "Tentar novamente" funcional
- ✅ Stack trace visível em desenvolvimento

---

## 📋 Checklist de Migração por Componente

### Para Componentes Existentes:

- [ ] Atualizar imports de `@/contexts/editor/*` para `@/core/contexts/EditorContext`
- [ ] Atualizar imports de schemas para `@/core/schemas/blockSchema`
- [ ] Substituir gestão manual de drafts por `useBlockDraft`
- [ ] Envolver com `<ErrorBoundary>` se componente crítico
- [ ] Adicionar `Suspense` se faz lazy loading
- [ ] Usar `useFeatureFlag` se feature experimental
- [ ] Executar `npm run typecheck`
- [ ] Testar em runtime

### Para Novos Componentes:

- [ ] Usar `@/core/*` e `@/shared/*` desde o início
- [ ] Sempre envolver com `<ErrorBoundary>`
- [ ] Lazy load se não for rota crítica
- [ ] Validar dados com schemas Zod
- [ ] Documentar com JSDoc
- [ ] Adicionar testes unitários

---

## 🚨 Avisos Importantes

### ⚠️ Código Legado Não Será Removido na FASE 2

```typescript
// ✅ CORRETO: Mantém compatibilidade
import { useEditor } from '@/core/contexts/EditorContext';

// O código antigo ainda funciona via EditorCompatLayer
// Mas mostra warnings em desenvolvimento
```

### ⚠️ Feature Flags Desabilitadas por Padrão em Produção

```typescript
// src/core/utils/featureFlags.ts

const defaultFlags = {
  useUnifiedEditor: import.meta.env.DEV, // true em dev, false em prod
  enableExperimentalFeatures: false,     // sempre false até aprovado
  // ...
};
```

**Para habilitar em produção:**
```typescript
// Apenas após testes completos!
if (import.meta.env.PROD && isQAApproved) {
  setFeatureFlag('useUnifiedEditor', true);
}
```

### ⚠️ Lazy Loading e Code Splitting

```tsx
// ❌ ERRADO: Import síncrono em arquivo grande
import { HugeComponent } from './HugeComponent';

// ✅ CORRETO: Lazy load
const HugeComponent = lazy(() => import('./HugeComponent'));

function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <HugeComponent />
    </Suspense>
  );
}
```

---

## 📊 Métricas de Sucesso da Migração

**Antes (Código Legado):**
- 🔴 3 contextos incompatíveis
- 🔴 7 implementações de properties panel
- 🔴 4 sistemas de persistência
- 🔴 EditorContext.tsx: 2847 linhas
- 🔴 Sem validação runtime
- 🔴 Sem error boundaries
- 🔴 Sem feature flags

**Depois (Core Architecture):**
- ✅ 1 contexto unificado (`@/core/contexts/EditorContext`)
- ✅ 1 sistema de draft (`useBlockDraft`)
- ✅ 1 sistema de persistência (`persistenceService`)
- ✅ Arquivos modulares (<300 linhas cada)
- ✅ Validação Zod automática
- ✅ ErrorBoundary em componentes críticos
- ✅ 12 feature flags para rollout gradual

**Redução de Código:**
- PropertiesPanel: 150 linhas → 60 linhas (-60%)
- Draft management: 80 linhas → 5 linhas (-94%)
- Persistence logic: 200 linhas → 10 linhas (-95%)

---

## 📚 Recursos Adicionais

**Documentação:**
- `ANALISE_ARQUITETURA_PROJETO.md` - Análise completa dos problemas
- `FASE_1_RESUMO_EXECUTIVO.md` - Resumo da implementação FASE 1
- `MIGRATION_GUIDE.md` - Guia de consolidação de serviços
- `PROJECT_STATUS.md` - Status geral do projeto

**Código-fonte:**
- `src/core/contexts/EditorContext/EditorStateProvider.tsx` - Contexto canônico
- `src/core/hooks/useBlockDraft.ts` - Hook de draft
- `src/core/schemas/blockSchema.ts` - Schema Zod
- `src/core/services/persistenceService.ts` - Persistence unificado
- `src/shared/components/ErrorBoundary.tsx` - Error boundary

---

## 🎓 Exemplo Completo: Antes vs Depois

### Componente: PropertiesPanel

**❌ ANTES (Legado - 150 linhas):**
```typescript
import { useState, useEffect } from 'react';
import { useEditor } from '@/contexts/editor/EditorStateProvider';

export function LegacyPropertiesPanel() {
  const editor = useEditor();
  const block = editor.state.blocks.find(b => b.id === editor.selectedBlockId);
  
  const [draft, setDraft] = useState(block);
  const [history, setHistory] = useState([block]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    setDraft(block);
    setHistory([block]);
    setHistoryIndex(0);
    setIsDirty(false);
  }, [block]);
  
  const handleChange = (field: string, value: any) => {
    const newDraft = { ...draft, [field]: value };
    setDraft(newDraft);
    setHistory([...history.slice(0, historyIndex + 1), newDraft]);
    setHistoryIndex(historyIndex + 1);
    setIsDirty(true);
    
    // Validação manual
    const newErrors = [];
    if (field === 'title' && !value) {
      newErrors.push('Título é obrigatório');
    }
    if (field === 'type' && !['intro', 'question'].includes(value)) {
      newErrors.push('Tipo inválido');
    }
    setErrors(newErrors);
  };
  
  const handleSave = async () => {
    if (errors.length > 0) return;
    
    setIsSaving(true);
    try {
      await editor.updateBlock(draft.id, draft);
      setIsDirty(false);
    } catch (err) {
      setErrors([err.message]);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setDraft(history[historyIndex - 1]);
      setIsDirty(true);
    }
  };
  
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setDraft(history[historyIndex + 1]);
      setIsDirty(true);
    }
  };
  
  const handleCancel = () => {
    setDraft(block);
    setHistory([block]);
    setHistoryIndex(0);
    setIsDirty(false);
    setErrors([]);
  };
  
  if (!block) return <div>Selecione um bloco</div>;
  
  return (
    <div>
      <input 
        value={draft?.title || ''} 
        onChange={(e) => handleChange('title', e.target.value)} 
      />
      
      {isDirty && <span style={{ color: 'orange' }}>Não salvo</span>}
      {errors.map(e => <div key={e} style={{ color: 'red' }}>{e}</div>)}
      
      <button onClick={handleSave} disabled={!isDirty || errors.length > 0 || isSaving}>
        {isSaving ? 'Salvando...' : 'Salvar'}
      </button>
      <button onClick={handleCancel}>Cancelar</button>
      <button onClick={handleUndo} disabled={historyIndex === 0}>Desfazer</button>
      <button onClick={handleRedo} disabled={historyIndex === history.length - 1}>Refazer</button>
    </div>
  );
}
```

**✅ DEPOIS (Core - 60 linhas):**
```typescript
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { useEditor } from '@/core/contexts/EditorContext';
import { useBlockDraft } from '@/core/hooks/useBlockDraft';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function PropertiesPanel() {
  const editor = useEditor();
  const block = editor.state.blocks.find(b => b.id === editor.selectedBlockId);
  
  const draft = useBlockDraft(block, {
    onCommit: async (updated) => {
      await editor.updateBlock(updated.id, updated);
    },
    validateOnChange: true
  });
  
  if (!block) {
    return <div className="p-4">Selecione um bloco para editar</div>;
  }
  
  return (
    <ErrorBoundary>
      <div className="p-4 space-y-4">
        <Input
          value={draft.data.title || ''}
          onChange={(e) => draft.updateContent('title', e.target.value)}
          placeholder="Título do bloco"
        />
        
        <div className="flex gap-2 items-center">
          {draft.isDirty && (
            <Badge variant="warning">Não salvo</Badge>
          )}
          {draft.errors.length > 0 && (
            <Alert variant="destructive">
              {draft.errors[0]}
            </Alert>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={draft.commit} 
            disabled={!draft.isDirty || draft.errors.length > 0}
          >
            Salvar
          </Button>
          <Button variant="outline" onClick={draft.cancel}>
            Cancelar
          </Button>
          <Button variant="ghost" onClick={draft.undo} disabled={!draft.canUndo}>
            Desfazer
          </Button>
          <Button variant="ghost" onClick={draft.redo} disabled={!draft.canRedo}>
            Refazer
          </Button>
        </div>
      </div>
    </ErrorBoundary>
  );
}
```

**Comparação:**
| Aspecto | Legado | Core | Melhoria |
|---------|--------|------|----------|
| Linhas de código | 150 | 60 | **-60%** |
| Estado gerenciado | 8 states | 0 states | **-100%** |
| Validação | Manual | Zod automático | **Type-safe** |
| Undo/Redo | 40 linhas | Built-in | **Gratuito** |
| Error handling | Try/catch | ErrorBoundary | **Resiliente** |
| UI | Inline styles | shadcn/ui | **Consistente** |
| TypeScript | Parcial | 100% | **Type-safe** |

---

**Última atualização:** 2025-01  
**Versão:** 2.0 (FASE 2)  
**Mantenedor:** Equipe Core Architecture
