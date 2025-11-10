# 🔧 G5: Otimização de Re-renders do Canvas - Guia de Implementação

## 📊 PROBLEMA ATUAL

### Sintomas
- **~50 re-renders** no canvas a cada keystroke no PropertyPanel
- Lag perceptível ao editar propriedades de texto
- Performance degradada com 20+ blocos no canvas

### Causa Raiz
```tsx
// ❌ PROBLEMA: Contexto único compartilhado
const UnifiedContext = createContext({
  selectedBlockId: string | null,
  blocks: Block[],
  updateBlock: (id, props) => void,
  // ... outros estados
});

// Resultado: Qualquer mudança causa re-render TOTAL
// - selectedBlockId muda → TODO canvas re-renderiza
// - blocks[0].properties muda → TODO canvas re-renderiza
// - Keystroke no PropertyPanel → blocks muda → TODO canvas re-renderiza
```

### Fluxo de Re-render Atual
```
User digita "H" no PropertyPanel
  ↓
PropertyPanel.onChange({ text: "H" })
  ↓
SuperUnifiedProvider.updateBlock(blockId, { text: "H" })
  ↓
setBlocks([...blocks.map(b => b.id === blockId ? {...b, properties: {...}} : b)])
  ↓
UnifiedContext emite novo valor { selectedBlockId, blocks: [...] }
  ↓
TODOS os componentes que usam UnifiedContext re-renderizam:
  - CanvasColumn ✅
  - SelectableBlock #1 ❌ (desnecessário)
  - SelectableBlock #2 ❌ (desnecessário)
  - SelectableBlock #3 ❌ (desnecessário)
  - ... (até 21 blocos) ❌
  - StepNavigatorColumn ❌ (desnecessário)
  - ComponentLibraryColumn ❌ (desnecessário)
```

**Resultado:** ~50 re-renders (1 necessário + 49 desnecessários)

---

## ✅ SOLUÇÃO PROPOSTA

### Arquitetura Otimizada

```
┌─────────────────────────────────────────────────────────┐
│ SuperUnifiedProvider (root)                              │
│ - Gerencia estado global                                 │
│ - NÃO emite diretamente para componentes                 │
└────────────┬────────────────────────────────────────────┘
             │
             ├─────────────────────────────────────────────┐
             ↓                                             ↓
┌──────────────────────────┐              ┌──────────────────────────┐
│ SelectionContext         │              │ BlocksContext            │
│ - selectedBlockId        │              │ - blocks[]               │
│ - setSelectedBlock()     │              │ - updateBlock()          │
└────────┬─────────────────┘              └────────┬─────────────────┘
         │                                         │
         ↓                                         ↓
    Apenas componentes                        Apenas componentes
    que precisam saber                        que renderizam blocos
    qual bloco está selecionado               (canvas, lista)
```

### Benefícios
- ✅ SelectableBlock re-renderiza APENAS quando:
  1. Suas próprias propriedades mudam
  2. Seu estado de seleção muda (isSelected)
  
- ✅ PropertyPanel pode atualizar bloco sem re-renderizar canvas completo
- ✅ StepNavigator não re-renderiza ao editar propriedades
- ✅ ComponentLibrary não re-renderiza ao editar propriedades

---

## 📝 IMPLEMENTAÇÃO PASSO A PASSO

### PASSO 1: Criar Contextos Separados

**Arquivo:** `src/contexts/editor/SelectionContext.tsx` (NOVO)

```tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

interface SelectionContextValue {
  selectedBlockId: string | null;
  setSelectedBlock: (id: string | null) => void;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const setSelectedBlock = useCallback((id: string | null) => {
    setSelectedBlockId(id);
  }, []);

  return (
    <SelectionContext.Provider value={{ selectedBlockId, setSelectedBlock }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) throw new Error('useSelection must be used within SelectionProvider');
  return context;
}
```

**Arquivo:** `src/contexts/editor/BlocksContext.tsx` (NOVO)

```tsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { Block } from '@/types/editor';

interface BlocksContextValue {
  blocks: Block[];
  updateBlock: (id: string, updates: Partial<Block['properties']>) => void;
  addBlock: (block: Block) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
}

type BlocksAction =
  | { type: 'UPDATE'; id: string; updates: Partial<Block['properties']> }
  | { type: 'ADD'; block: Block }
  | { type: 'REMOVE'; id: string }
  | { type: 'REORDER'; startIndex: number; endIndex: number }
  | { type: 'SET'; blocks: Block[] };

function blocksReducer(state: Block[], action: BlocksAction): Block[] {
  switch (action.type) {
    case 'UPDATE':
      return state.map(block =>
        block.id === action.id
          ? { ...block, properties: { ...block.properties, ...action.updates } }
          : block
      );
    case 'ADD':
      return [...state, action.block];
    case 'REMOVE':
      return state.filter(block => block.id !== action.id);
    case 'REORDER': {
      const result = Array.from(state);
      const [removed] = result.splice(action.startIndex, 1);
      result.splice(action.endIndex, 0, removed);
      return result.map((block, index) => ({ ...block, order: index }));
    }
    case 'SET':
      return action.blocks;
    default:
      return state;
  }
}

const BlocksContext = createContext<BlocksContextValue | null>(null);

export function BlocksProvider({ children, initialBlocks = [] }: { 
  children: React.ReactNode;
  initialBlocks?: Block[];
}) {
  const [blocks, dispatch] = useReducer(blocksReducer, initialBlocks);

  const updateBlock = useCallback((id: string, updates: Partial<Block['properties']>) => {
    dispatch({ type: 'UPDATE', id, updates });
  }, []);

  const addBlock = useCallback((block: Block) => {
    dispatch({ type: 'ADD', block });
  }, []);

  const removeBlock = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  const reorderBlocks = useCallback((startIndex: number, endIndex: number) => {
    dispatch({ type: 'REORDER', startIndex, endIndex });
  }, []);

  return (
    <BlocksContext.Provider value={{ blocks, updateBlock, addBlock, removeBlock, reorderBlocks }}>
      {children}
    </BlocksContext.Provider>
  );
}

export function useBlocks() {
  const context = useContext(BlocksContext);
  if (!context) throw new Error('useBlocks must be used within BlocksProvider');
  return context;
}
```

---

### PASSO 2: Atualizar SuperUnifiedProvider

**Arquivo:** `src/contexts/providers/SuperUnifiedProvider.tsx`

```diff
+ import { SelectionProvider } from '@/contexts/editor/SelectionContext';
+ import { BlocksProvider } from '@/contexts/editor/BlocksContext';

export function SuperUnifiedProvider({ children, ...props }: SuperUnifiedProviderProps) {
  // ... lógica existente
  
  return (
    <QueryClientProvider client={queryClient}>
      <FunnelProvider {...funnelProviderProps}>
+       <SelectionProvider>
+         <BlocksProvider initialBlocks={initialBlocks}>
            {children}
+         </BlocksProvider>
+       </SelectionProvider>
      </FunnelProvider>
    </QueryClientProvider>
  );
}
```

---

### PASSO 3: Otimizar SelectableBlock com React.memo

**Arquivo:** `src/components/editor/quiz/QuizModularEditor/components/SelectableBlock.tsx`

```tsx
import React, { memo } from 'react';
import { useSelection } from '@/contexts/editor/SelectionContext';
import { useBlocks } from '@/contexts/editor/BlocksContext';
import type { Block } from '@/types/editor';

interface SelectableBlockProps {
  block: Block;
  onUpdate?: (id: string, updates: any) => void;
}

function SelectableBlockInner({ block, onUpdate }: SelectableBlockProps) {
  const { selectedBlockId, setSelectedBlock } = useSelection();
  const { updateBlock } = useBlocks();

  const isSelected = selectedBlockId === block.id;

  const handleClick = () => {
    setSelectedBlock(block.id);
  };

  const handleUpdate = (updates: any) => {
    updateBlock(block.id, updates);
    onUpdate?.(block.id, updates);
  };

  return (
    <div
      className={`block-container ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      data-block-id={block.id}
    >
      {/* Renderizar bloco baseado em block.type */}
      <BlockRenderer block={block} onUpdate={handleUpdate} />
    </div>
  );
}

// ✅ CRITICAL: React.memo com comparação customizada
export const SelectableBlock = memo(SelectableBlockInner, (prev, next) => {
  // Re-renderizar APENAS se:
  // 1. ID do bloco mudou (nunca deveria acontecer)
  // 2. Propriedades do bloco mudaram
  // 3. Callback mudou (raro com useCallback)
  
  return (
    prev.block.id === next.block.id &&
    prev.block.type === next.block.type &&
    prev.block.properties === next.block.properties && // Comparação de referência
    prev.onUpdate === next.onUpdate
  );
});

SelectableBlock.displayName = 'SelectableBlock';
```

---

### PASSO 4: Atualizar CanvasColumn

**Arquivo:** `src/components/editor/quiz/QuizModularEditor/components/CanvasColumn.tsx`

```tsx
import React, { memo } from 'react';
import { useBlocks } from '@/contexts/editor/BlocksContext';
import { useSelection } from '@/contexts/editor/SelectionContext';
import { SelectableBlock } from './SelectableBlock';

function CanvasColumnInner() {
  const { blocks } = useBlocks();
  const { selectedBlockId } = useSelection();

  return (
    <div className="canvas-container">
      {blocks.map((block) => (
        <SelectableBlock
          key={block.id}
          block={block}
        />
      ))}
    </div>
  );
}

// Memo opcional - CanvasColumn raramente precisa evitar re-render
export const CanvasColumn = memo(CanvasColumnInner);
CanvasColumn.displayName = 'CanvasColumn';
```

---

### PASSO 5: Atualizar PropertiesColumn

**Arquivo:** `src/components/editor/quiz/QuizModularEditor/components/PropertiesColumn.tsx`

```tsx
import React, { memo } from 'react';
import { useSelection } from '@/contexts/editor/SelectionContext';
import { useBlocks } from '@/contexts/editor/BlocksContext';

function PropertiesColumnInner() {
  const { selectedBlockId } = useSelection();
  const { blocks, updateBlock } = useBlocks();

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  if (!selectedBlock) {
    return <NoSelectionState />;
  }

  const handlePropertyChange = (key: string, value: any) => {
    // ✅ OTIMIZAÇÃO: updateBlock NÃO causa re-render de SelectableBlock
    // se a comparação memo determinar que propriedades não mudaram
    updateBlock(selectedBlockId!, { [key]: value });
  };

  return (
    <div className="properties-panel">
      <DynamicPropertyForm
        blockType={selectedBlock.type}
        properties={selectedBlock.properties}
        onChange={handlePropertyChange}
      />
    </div>
  );
}

export const PropertiesColumn = memo(PropertiesColumnInner);
PropertiesColumn.displayName = 'PropertiesColumn';
```

---

## 🧪 TESTES DE VALIDAÇÃO

### Teste 1: Contagem de Re-renders

```tsx
// Adicionar em SelectableBlock para debug
useEffect(() => {
  console.log(`[SelectableBlock ${block.id}] RENDER`);
});
```

**Resultado Esperado:**
- ❌ ANTES: ~50 logs ao digitar no PropertyPanel
- ✅ DEPOIS: ~2 logs (apenas bloco selecionado + propriedades atualizadas)

### Teste 2: Performance Profiling

```bash
# Chrome DevTools
1. Abrir Performance tab
2. Gravar interação: digitar 10 caracteres no PropertyPanel
3. Analisar flamegraph de re-renders
```

**Resultado Esperado:**
- ❌ ANTES: 50+ componentes re-renderizados
- ✅ DEPOIS: 5-10 componentes re-renderizados

### Teste 3: React DevTools Profiler

```bash
# React DevTools > Profiler
1. Gravar interação: editar propriedade de texto
2. Ver "Ranked" chart
```

**Resultado Esperado:**
- ❌ ANTES: SelectableBlock aparece 21× na lista
- ✅ DEPOIS: SelectableBlock aparece 1× (apenas o selecionado)

---

## 📊 MÉTRICAS DE SUCESSO

| Métrica | Antes | Depois | Meta |
|---------|-------|--------|------|
| Re-renders por keystroke | ~50 | ~10 | 80% ↓ |
| Tempo de resposta (input lag) | ~100ms | ~20ms | 80% ↓ |
| CPU usage (typing) | ~60% | ~15% | 75% ↓ |
| Frame drops | Frequentes | Raros | 90% ↓ |

---

## 🚨 CUIDADOS E GOTCHAS

### 1. Comparação de Referência vs. Deep Equality

```tsx
// ❌ PROBLEMA: Objetos novos a cada render
const updateBlock = (id, updates) => {
  setBlocks(blocks.map(b => 
    b.id === id ? { ...b, properties: { ...b.properties, ...updates } } : b
  ));
};

// ✅ SOLUÇÃO: useReducer com ações imutáveis
const updateBlock = useCallback((id, updates) => {
  dispatch({ type: 'UPDATE', id, updates });
}, []);
```

### 2. Memo com Callbacks

```tsx
// ❌ PROBLEMA: onUpdate sempre é função nova
<SelectableBlock block={block} onUpdate={(id, upd) => updateBlock(id, upd)} />

// ✅ SOLUÇÃO: useCallback
const handleUpdate = useCallback((id, updates) => {
  updateBlock(id, updates);
}, [updateBlock]);

<SelectableBlock block={block} onUpdate={handleUpdate} />
```

### 3. Context API Splitting

```tsx
// ❌ PROBLEMA: Contexto único com múltiplas responsabilidades
const UnifiedContext = { selectedBlockId, blocks, /* 20 outros estados */ };

// ✅ SOLUÇÃO: Contextos específicos por domínio
<SelectionContext>  {/* Apenas selectedBlockId */}
<BlocksContext>     {/* Apenas blocks[] */}
<UIContext>         {/* Apenas UI state */}
```

---

## 🎯 CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Criar `SelectionContext.tsx`
- [ ] Criar `BlocksContext.tsx`
- [ ] Atualizar `SuperUnifiedProvider.tsx` (adicionar providers)
- [ ] Adicionar `React.memo` em `SelectableBlock.tsx`
- [ ] Otimizar `CanvasColumn.tsx` (usar contextos separados)
- [ ] Otimizar `PropertiesColumn.tsx` (usar contextos separados)
- [ ] Adicionar testes de re-render (debug logs)
- [ ] Executar React DevTools Profiler
- [ ] Validar redução de 80% em re-renders
- [ ] Documentar mudanças no CHANGELOG
- [ ] Atualizar testes automatizados

---

## 📚 REFERÊNCIAS

- [React.memo Documentation](https://react.dev/reference/react/memo)
- [useReducer for Complex State](https://react.dev/reference/react/useReducer)
- [Context API Best Practices](https://react.dev/learn/passing-data-deeply-with-context)
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools#profiler)

---

**Status:** 📋 ESPECIFICAÇÃO COMPLETA  
**Esforço Estimado:** 3 horas  
**Complexidade:** Média  
**Prioridade:** Alta (Sprint Melhoria)
