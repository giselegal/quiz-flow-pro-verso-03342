# 🎣 CATÁLOGO DE HOOKS

## 📋 Visão Geral

Catálogo completo dos hooks unificados e otimizados após o Sprint 3.

---

## 🎯 Hooks Principais

### useOptimizedQuizFlow

**Localização:** `src/hooks/useOptimizedQuizFlow.ts`

**Descrição:** Gerencia navegação entre steps do quiz de forma otimizada.

**Uso:**
```typescript
import { useOptimizedQuizFlow } from '@/hooks/useOptimizedQuizFlow';

function NavigationBar() {
  const {
    currentStep,
    totalSteps,
    canGoNext,
    canGoPrevious,
    nextStep,
    previousStep,
    progress,
  } = useOptimizedQuizFlow();
  
  return (
    <div>
      <button onClick={previousStep} disabled={!canGoPrevious}>
        Previous
      </button>
      <span>{currentStep} / {totalSteps}</span>
      <button onClick={nextStep} disabled={!canGoNext}>
        Next
      </button>
      <progress value={progress} max={100} />
    </div>
  );
}
```

**API:**
```typescript
interface QuizFlowReturn {
  // State
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number; // 0-100
  
  // Actions
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  
  // Validation
  isCurrentStepValid: boolean;
  validateCurrentStep: () => boolean;
}
```

---

### useOptimizedBlockOperations

**Localização:** `src/hooks/useOptimizedBlockOperations.ts`

**Descrição:** Operações CRUD otimizadas para blocos.

**Uso:**
```typescript
import { useOptimizedBlockOperations } from '@/hooks/useOptimizedBlockOperations';
import { BlockType } from '@/types/editor';

function BlockEditor() {
  const {
    selectedBlockId,
    selectBlock,
    addBlock,
    updateBlock,
    deleteBlock,
  } = useOptimizedBlockOperations();
  
  const handleAddHeading = () => {
    const blockId = addBlock(BlockType.HEADING, {
      text: 'New Heading',
      level: 1
    });
    console.log('Added block:', blockId);
  };
  
  const handleUpdateBlock = () => {
    if (selectedBlockId) {
      updateBlock(selectedBlockId, {
        properties: { text: 'Updated!' }
      });
    }
  };
  
  return (
    <div>
      <button onClick={handleAddHeading}>Add Heading</button>
      <button onClick={handleUpdateBlock}>Update Selected</button>
    </div>
  );
}
```

**API:**
```typescript
interface BlockOperationsReturn {
  // Selection
  selectedBlockId: string | null;
  selectBlock: (blockId: string | null) => void;
  
  // CRUD
  addBlock: (type: BlockType, properties?: Record<string, any>) => string;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (blockId: string) => void;
  duplicateBlock: (blockId: string) => void;
  
  // Bulk
  clearAllBlocks: () => void;
  
  // Queries
  getBlock: (blockId: string) => Block | undefined;
  getAllBlocks: () => Block[];
}
```

---

### useUnifiedApp

**Localização:** `src/contexts/UnifiedAppProvider.tsx`

**Descrição:** Hook principal para acessar estado e actions globais.

**Uso:**
```typescript
import { useUnifiedApp } from '@/contexts/UnifiedAppProvider';

function EditorComponent() {
  const { state, actions } = useUnifiedApp();
  
  return (
    <div>
      <h1>{state.funnelMeta.name}</h1>
      <p>Step: {state.currentStep}</p>
      <p>Blocks: {state.blocks.length}</p>
      
      <button onClick={actions.togglePreview}>
        Toggle Preview
      </button>
      
      {state.isDirty && <span>Unsaved changes</span>}
    </div>
  );
}
```

**Ver [PROVIDERS.md](./PROVIDERS.md) para API completa.**

---

### Seletores Otimizados

**Localização:** `src/contexts/UnifiedAppProvider.tsx`

**Descrição:** Seletores específicos para evitar re-renders desnecessários.

**Hooks Disponíveis:**
```typescript
// Step atual
const currentStep = useCurrentStep();

// ID do bloco selecionado
const selectedBlockId = useSelectedBlockId();

// Flag de modificação
const isDirty = useIsDirty();

// Modo preview
const isPreviewMode = useIsPreviewMode();

// Blocos do step atual
const blocks = useCurrentStepBlocks();
```

**Seletor Customizado:**
```typescript
import { useUnifiedAppSelector } from '@/contexts/UnifiedAppProvider';

function MyComponent() {
  // Seletor customizado - apenas re-renderiza quando o valor mudar
  const stepCount = useUnifiedAppSelector(state => state.steps.length);
  
  return <div>Total steps: {stepCount}</div>;
}
```

---

## 🧩 Hooks de Suporte

### useAutosave

**Localização:** `src/hooks/useAutosave.ts`

**Descrição:** Auto-save de dados com intervalo configurável.

**Uso:**
```typescript
import { useAutosave } from '@/hooks/useAutosave';
import { useUnifiedApp } from '@/contexts/UnifiedAppProvider';

function Editor() {
  const { state } = useUnifiedApp();
  
  const { isSaving, lastSaved, saveNow } = useAutosave({
    data: state.blocks,
    onSave: async (blocks) => {
      await saveFunnel(blocks);
    },
    interval: 30000, // 30s
    enabled: state.isDirty
  });
  
  return (
    <div>
      {isSaving && <span>Saving...</span>}
      {lastSaved && <span>Last saved: {lastSaved.toLocaleTimeString()}</span>}
      <button onClick={saveNow}>Save Now</button>
    </div>
  );
}
```

---

### useEditorWrapper

**Localização:** `src/hooks/useEditorWrapper.ts`

**Descrição:** Wrapper temporário para migração. **Será removido em versões futuras.**

**Status:** ⚠️ DEPRECATED

**Uso:**
```typescript
// ❌ NÃO USE MAIS
import { useEditor } from '@/hooks/useEditorWrapper';

// ✅ USE
import { useUnifiedApp } from '@/contexts/UnifiedAppProvider';
```

---

### useUnifiedStepNavigation

**Localização:** `src/hooks/useUnifiedStepNavigation.ts`

**Descrição:** Navegação unificada entre steps.

**Status:** ⚠️ DEPRECATED - Use `useOptimizedQuizFlow` instead

---

### useQuizStages

**Localização:** `src/hooks/useQuizStages.ts`

**Descrição:** Placeholder temporário.

**Status:** ⚠️ DEPRECATED

---

### useQuizComponents

**Localização:** `src/hooks/useQuizComponents.ts`

**Descrição:** Gerenciamento de componentes de quiz.

**Status:** ⚠️ DEPRECATED - Use `useOptimizedBlockOperations` instead

---

## 📊 Comparação: Hooks Antigos vs Novos

| Hook Antigo | Hook Novo | Status |
|-------------|-----------|--------|
| `useQuizFlow` | `useOptimizedQuizFlow` | ✅ Migrado |
| `useFunnelNavigation` | `useOptimizedQuizFlow` | ✅ Migrado |
| `useEditor` | `useUnifiedApp` | ✅ Migrado |
| `useConsolidatedEditor` | `useUnifiedApp` | ✅ Migrado |
| `useQuizComponents` | `useOptimizedBlockOperations` | ✅ Migrado |
| `useEditorWrapper` | - | ⚠️ Deprecated |

---

## ⚡ Performance

### Otimizações Implementadas

1. **Memoização de Valores**
   ```typescript
   const totalSteps = useMemo(() => steps.length, [steps.length]);
   ```

2. **Callbacks Estáveis**
   ```typescript
   const nextStep = useCallback(() => {
     actions.goToNextStep();
   }, [actions]);
   ```

3. **Seletores Otimizados**
   ```typescript
   // Apenas re-renderiza quando currentStep mudar
   const currentStep = useCurrentStep();
   ```

---

## 🎯 Boas Práticas

### 1. Use Seletores Específicos

```typescript
// ❌ Ruim - re-renderiza em qualquer mudança de estado
const { state } = useUnifiedApp();
const currentStep = state.currentStep;

// ✅ Bom - apenas re-renderiza quando currentStep mudar
const currentStep = useCurrentStep();
```

### 2. Memoize Valores Computados

```typescript
function MyComponent() {
  const blocks = useCurrentStepBlocks();
  
  // ✅ Memoizado
  const blockCount = useMemo(() => blocks.length, [blocks]);
  
  return <div>Total: {blockCount}</div>;
}
```

### 3. Use Callbacks para Handlers

```typescript
function MyComponent() {
  const { actions } = useUnifiedApp();
  
  // ✅ Callback estável
  const handleSave = useCallback(() => {
    actions.markSaved();
  }, [actions]);
  
  return <button onClick={handleSave}>Save</button>;
}
```

---

## 🐛 Debugging

### Development Logs

Hooks otimizados logam informações em modo dev:

```typescript
🧭 useOptimizedQuizFlow: {
  currentStep: 2,
  totalSteps: 10,
  canGoNext: true,
  canGoPrevious: true
}

🔧 useOptimizedBlockOperations: {
  operation: 'addBlock',
  blockId: 'block-abc123',
  type: 'heading'
}
```

---

## 📚 Recursos Relacionados

- [PROVIDERS.md](./PROVIDERS.md) - Providers utilizados pelos hooks
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura geral
- [PERFORMANCE.md](./PERFORMANCE.md) - Otimizações de performance
