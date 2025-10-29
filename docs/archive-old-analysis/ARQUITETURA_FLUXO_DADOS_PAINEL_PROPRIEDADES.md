# 🔄 FLUXO DE DADOS: PAINEL DE PROPRIEDADES ↔ FUNIL

**Sprint 4 - Dia 4**  
**Data:** 11 de outubro de 2025  
**Análise:** Arquitetura de Gerenciamento de Estado

---

## 🎯 RESPOSTA RÁPIDA

### **Como o Painel de Propriedades acessa as informações do funil?**

```
1. Estado do Funil (steps[])
          ↓
2. Hook useSelectionClipboard (gerencia selectedBlockId)
          ↓
3. useMemo calcula selectedBlock
          ↓
4. selectedBlock passado via props para PropertiesPanel
          ↓
5. PropertiesPanel lê e renderiza
```

### **Qual a melhor prática?**

✅ **Props Drilling + Callback Pattern** (padrão React unidirecional)  
✅ **Estado Centralizado** no componente Editor pai  
✅ **Memoização** para evitar re-renders desnecessários  
✅ **Callbacks Estáveis** para atualização  

---

## 📊 ARQUITETURA COMPLETA

### **1. Estrutura do Estado Global (Editor)**

```typescript
// 📁 src/components/editor/quiz/QuizModularProductionEditor.tsx

// ============================================
// ESTADO PRINCIPAL DO FUNIL
// ============================================
const [steps, setSteps] = useState<EditableQuizStep[]>([
    {
        id: 'step-1',
        type: 'question',
        blocks: [
            {
                id: 'block-1',
                type: 'quiz-question-inline',
                properties: {
                    question: 'Qual sua cor favorita?',
                    options: [
                        { id: 'opt1', text: 'Azul', value: 'blue' }
                    ]
                },
                order: 0
            }
        ]
    }
]);

// ============================================
// STEP SELECIONADO (ETAPA ATUAL)
// ============================================
const [selectedStepId, setSelectedStepId] = useState<string | null>('step-1');

const selectedStep = useMemo(
    () => steps.find(s => s.id === selectedStepId),
    [steps, selectedStepId]
);
```

---

### **2. Hook de Seleção (useSelectionClipboard)**

```typescript
// 📁 src/components/editor/quiz/hooks/useSelectionClipboard.ts

// ============================================
// GERENCIAMENTO DE SELEÇÃO
// ============================================
const selectionApi = useSelectionClipboard({
    steps,              // ✅ Estado completo do funil
    selectedStepId,     // ✅ Step atual
    setSteps,           // ✅ Função para atualizar funil
    pushHistory,        // ✅ Sistema de undo/redo
    onDirty: () => setIsDirty(true)  // ✅ Marcar alterações
});

// RETORNA:
// - selectedBlockId: string          // ID do bloco selecionado
// - setSelectedBlockId: (id) => void // Atualizar seleção
// - multiSelectedIds: string[]       // Multi-seleção (Shift+Click)
// - clipboard: Block[]               // Clipboard (Ctrl+C/V)
// - handleBlockClick: (e, block) => void  // Handler de click
```

**Responsabilidades do Hook:**
- ✅ Gerenciar `selectedBlockId` (bloco atualmente selecionado)
- ✅ Gerenciar multi-seleção (Shift + Click)
- ✅ Clipboard (copy/paste de blocos)
- ✅ Limpar seleção ao trocar de step

---

### **3. Derivação do Bloco Selecionado**

```typescript
// 📁 QuizModularProductionEditor.tsx (linha 600)

// ============================================
// BLOCO SELECIONADO (CALCULADO)
// ============================================
const selectedBlock = useMemo(
    () => selectedStep?.blocks.find(b => b.id === selectedBlockId),
    [selectedStep, selectedBlockId]
);

// RESULTADO:
// selectedBlock = {
//     id: 'block-1',
//     type: 'quiz-question-inline',
//     properties: { question: '...', options: [...] },
//     order: 0,
//     parentId?: string
// } | undefined
```

**Por que useMemo?**
- ✅ Evita recalcular em todo render
- ✅ Estabilidade de referência (evita re-renders desnecessários no PropertiesPanel)
- ✅ Performance: só recalcula se `selectedStep` ou `selectedBlockId` mudarem

---

### **4. Passagem de Props para PropertiesPanel**

```typescript
// 📁 QuizModularProductionEditor.tsx (linha 1916-1950)

<PropertiesPanel
    // ============================================
    // DADOS DE LEITURA (READ)
    // ============================================
    selectedStep={selectedStep}         // ✅ Step completo
    selectedBlock={selectedBlock}       // ✅ Bloco selecionado
    headerConfig={headerConfig}         // ✅ Config do header
    clipboard={clipboard}               // ✅ Blocos no clipboard
    multiSelectedIds={multiSelectedIds} // ✅ Multi-seleção
    snippets={snippets}                 // ✅ Snippets salvos
    
    // ============================================
    // CALLBACKS DE ATUALIZAÇÃO (WRITE)
    // ============================================
    onBlockPatch={(patch) => {
        if (!selectedBlock || !selectedStep) return;
        
        // Separa properties vs content
        const contentKeys = new Set(Object.keys(selectedBlock.content || {}));
        const propPatch: Record<string, any> = {};
        const contentPatch: Record<string, any> = {};
        
        Object.entries(patch).forEach(([k, v]) => {
            if (contentKeys.has(k)) {
                contentPatch[k] = v;  // ✅ Atualiza content
            } else {
                propPatch[k] = v;     // ✅ Atualiza properties
            }
        });
        
        // Aplica patches separadamente
        if (Object.keys(propPatch).length) {
            updateBlockProperties(selectedStep.id, selectedBlock.id, propPatch);
        }
        if (Object.keys(contentPatch).length) {
            updateBlockContent(selectedStep.id, selectedBlock.id, contentPatch);
        }
    }}
    
    onRemoveBlock={() => {
        if (!selectedStep || !selectedBlock) return;
        removeBlock(selectedStep.id, selectedBlock.id);
    }}
    
    onDuplicateInline={() => {
        if (!selectedStep || !selectedBlock) return;
        const newBlock = { 
            ...selectedBlock, 
            id: `block-${Date.now()}` 
        };
        setSteps(prev => prev.map(step => 
            step.id === selectedStep.id 
                ? { ...step, blocks: [...step.blocks, newBlock] }
                : step
        ));
        setIsDirty(true);
    }}
    
    // ... outros callbacks
/>
```

---

## 🔄 FLUXO COMPLETO DE ATUALIZAÇÃO

### **Cenário: Usuário Edita Texto de uma Opção**

```
┌─────────────────────────────────────────────────────────┐
│ 1. USUÁRIO DIGITA NO INPUT                              │
│    Input value="Azul" → onChange("Verde")                │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. PAINEL DE PROPRIEDADES (QuestionPropertyEditor)     │
│    handleOptionUpdate(index, { text: 'Verde' })          │
│    setLocalOptions([...]) // Estado local               │
│    handlePropertyChange('options', newOptions)           │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 3. CALLBACK DO EDITOR PAI                               │
│    onUpdate({ options: [...] })                          │
│    ↓                                                      │
│    PropertiesPanel recebe via props                      │
│    ↓                                                      │
│    onBlockPatch({ options: [...] })                      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 4. SEPARAÇÃO PROPERTIES vs CONTENT                      │
│    'options' → propPatch                                 │
│    updateBlockProperties(stepId, blockId, { options })   │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 5. HOOK updateBlockProperties                           │
│    setSteps(prev => prev.map(step =>                     │
│      step.id === stepId                                  │
│        ? { ...step,                                      │
│            blocks: step.blocks.map(block =>              │
│              block.id === blockId                        │
│                ? { ...block,                             │
│                    properties: {                         │
│                      ...block.properties,                │
│                      ...patch  // ✅ ATUALIZA AQUI      │
│                    }                                     │
│                  }                                       │
│                : block                                   │
│            )                                             │
│          }                                               │
│        : step                                            │
│    ))                                                    │
│    pushHistory(next) // ✅ Salva no histórico           │
│    setIsDirty(true)  // ✅ Marca como modificado        │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 6. RE-RENDER DO COMPONENTE                              │
│    steps mudou → selectedStep recalculado (useMemo)     │
│    ↓                                                      │
│    selectedBlock recalculado (useMemo)                   │
│    ↓                                                      │
│    PropertiesPanel recebe novo selectedBlock             │
│    ↓                                                      │
│    QuestionPropertyEditor atualiza localOptions          │
│    ↓                                                      │
│    Input mostra novo valor "Verde" ✅                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🏗️ PADRÕES DE ARQUITETURA UTILIZADOS

### **1. Unidirectional Data Flow (Fluxo Unidirecional)**

```
          ┌──────────────┐
          │  Editor Pai  │
          │   (steps[])  │
          └──────┬───────┘
                 │ props ↓
          ┌──────▼────────────┐
          │ PropertiesPanel   │
          │  (selectedBlock)  │
          └──────┬────────────┘
                 │ callback ↑
          ┌──────▼───────┐
          │ onBlockPatch │
          │  (updates)   │
          └──────┬───────┘
                 │ setState ↑
          ┌──────▼───────┐
          │   setSteps   │
          │  (new state) │
          └──────────────┘
```

**Vantagens:**
- ✅ Fácil rastreamento de mudanças
- ✅ Previsível e testável
- ✅ Debugging simplificado
- ✅ Segue filosofia React

---

### **2. Lifting State Up (Estado Elevado)**

```
❌ ERRADO: Estado local no PropertiesPanel
┌────────────────────┐
│ PropertiesPanel    │
│ const [block, ...] │  ← Estado duplicado
└────────────────────┘

✅ CORRETO: Estado no Editor (pai comum)
┌────────────────────────────┐
│ Editor                     │
│ const [steps, setSteps]    │  ← Fonte única da verdade
│         ↓                  │
│  ┌─────────────────────┐   │
│  │ PropertiesPanel     │   │
│  │ props: selectedBlock│   │
│  └─────────────────────┘   │
└────────────────────────────┘
```

**Vantagens:**
- ✅ Single Source of Truth (SSOT)
- ✅ Sincronização automática entre componentes
- ✅ Histórico (undo/redo) centralizado
- ✅ Persistência simplificada

---

### **3. Memoization (useMemo)**

```typescript
// ❌ SEM MEMOIZAÇÃO (ineficiente)
const selectedBlock = selectedStep?.blocks.find(b => b.id === selectedBlockId);
// Recalcula em TODO render, mesmo se nada mudou

// ✅ COM MEMOIZAÇÃO (eficiente)
const selectedBlock = useMemo(
    () => selectedStep?.blocks.find(b => b.id === selectedBlockId),
    [selectedStep, selectedBlockId]
);
// Só recalcula se selectedStep ou selectedBlockId mudarem
```

**Vantagens:**
- ✅ Performance otimizada
- ✅ Evita re-renders desnecessários
- ✅ Referência estável (importante para useEffect)

---

### **4. Callback Pattern (useCallback)**

```typescript
// ✅ Callback estável para atualização
const updateBlockProperties = useCallback(
    (stepId: string, blockId: string, patch: Record<string, any>) => {
        setSteps(prev => {
            const next = prev.map(step => {
                if (step.id !== stepId) return step;
                return {
                    ...step,
                    blocks: step.blocks.map(block =>
                        block.id === blockId
                            ? { ...block, properties: { ...block.properties, ...patch } }
                            : block
                    )
                };
            });
            pushHistory(next);  // ✅ Histórico
            return next;
        });
        setIsDirty(true);  // ✅ Marca alteração
    },
    [pushHistory]
);
```

**Vantagens:**
- ✅ Função estável (mesma referência)
- ✅ Evita re-renders de componentes filhos
- ✅ Segura para dependências de useEffect

---

## 🎯 MELHORES PRÁTICAS IMPLEMENTADAS

### ✅ **1. Estado Centralizado**

```typescript
// ✅ BOM: Um único estado no pai
const [steps, setSteps] = useState<EditableQuizStep[]>([...]);

// ❌ RUIM: Estados duplicados
const [steps, setSteps] = useState([...]);
const [selectedBlock, setSelectedBlock] = useState(...);  // Duplicação!
```

---

### ✅ **2. Derivação de Estado (useMemo)**

```typescript
// ✅ BOM: Derivar de steps
const selectedBlock = useMemo(
    () => selectedStep?.blocks.find(b => b.id === selectedBlockId),
    [selectedStep, selectedBlockId]
);

// ❌ RUIM: Sincronizar manualmente
useEffect(() => {
    const block = steps[0].blocks[0];
    setSelectedBlock(block);  // Pode ficar dessincronizado
}, [steps]);
```

---

### ✅ **3. Callbacks Imutáveis**

```typescript
// ✅ BOM: Imutabilidade com spread
setSteps(prev => prev.map(step =>
    step.id === targetStepId
        ? { ...step, blocks: [...step.blocks, newBlock] }  // ✅ Novo array
        : step
));

// ❌ RUIM: Mutação direta
setSteps(prev => {
    prev[0].blocks.push(newBlock);  // ❌ Mutação!
    return prev;
});
```

---

### ✅ **4. Separação properties vs content**

```typescript
// ✅ BOM: Identificar corretamente
const contentKeys = new Set(Object.keys(selectedBlock.content || {}));

Object.entries(patch).forEach(([k, v]) => {
    if (contentKeys.has(k)) {
        contentPatch[k] = v;  // Vai para content
    } else {
        propPatch[k] = v;     // Vai para properties
    }
});

// ❌ RUIM: Misturar tudo em properties
updateBlockProperties(stepId, blockId, { ...patch });  // Pode perder dados
```

---

### ✅ **5. Histórico (Undo/Redo)**

```typescript
// ✅ BOM: pushHistory em todas as mudanças
const updateBlockProperties = (stepId, blockId, patch) => {
    setSteps(prev => {
        const next = /* ... */;
        pushHistory(next);  // ✅ Salva no histórico
        return next;
    });
};

// ❌ RUIM: Esquecer histórico
setSteps(/* ... */);  // Undo não funcionará
```

---

### ✅ **6. Dirty Flag (Alterações Não Salvas)**

```typescript
// ✅ BOM: Marcar quando modifica
const onBlockPatch = (patch) => {
    updateBlockProperties(/* ... */);
    setIsDirty(true);  // ✅ Mostra alerta ao sair
};

// ❌ RUIM: Não rastrear alterações
// Usuário pode perder trabalho ao fechar
```

---

## 📋 CHECKLIST DE BOAS PRÁTICAS

### **Implementação Atual (Quiz Editor)**

- [x] ✅ Estado centralizado no componente pai
- [x] ✅ useMemo para derivar selectedBlock
- [x] ✅ useCallback para callbacks estáveis
- [x] ✅ Props drilling para passagem de dados
- [x] ✅ Callbacks para atualização (onBlockPatch)
- [x] ✅ Separação properties vs content
- [x] ✅ Histórico (undo/redo) centralizado
- [x] ✅ Dirty flag para alterações não salvas
- [x] ✅ Imutabilidade com spread operators
- [x] ✅ Hook customizado (useSelectionClipboard)

### **O que poderia melhorar:**

- [ ] ⚠️ Context API para evitar props drilling profundo
- [ ] ⚠️ Zustand/Redux para estado global complexo
- [ ] ⚠️ React Query para cache e sincronização com servidor
- [ ] ⚠️ Immer para updates imutáveis mais simples

---

## 🆚 ALTERNATIVAS ARQUITETURAIS

### **Opção 1: Context API** (para evitar props drilling)

```typescript
// Criar contexto
const EditorContext = createContext<{
    selectedBlock: Block | undefined;
    updateBlock: (patch: Record<string, any>) => void;
}>(null);

// Provider no Editor pai
<EditorContext.Provider value={{ selectedBlock, updateBlock }}>
    <PropertiesPanel />
</EditorContext.Provider>

// Consumir no PropertiesPanel
const { selectedBlock, updateBlock } = useContext(EditorContext);
```

**Vantagens:**
- ✅ Sem props drilling
- ✅ Código mais limpo

**Desvantagens:**
- ❌ Mais difícil rastrear fluxo
- ❌ Pode causar re-renders desnecessários

---

### **Opção 2: Zustand** (estado global)

```typescript
// Store
const useEditorStore = create((set) => ({
    steps: [],
    selectedBlockId: null,
    updateBlock: (blockId, patch) => set(state => ({
        steps: state.steps.map(/* ... */)
    }))
}));

// Uso no PropertiesPanel
const selectedBlock = useEditorStore(state =>
    state.steps
        .find(s => s.id === state.selectedStepId)
        ?.blocks
        .find(b => b.id === state.selectedBlockId)
);
```

**Vantagens:**
- ✅ Menos boilerplate que Redux
- ✅ Performance otimizada (seletores)
- ✅ DevTools integrado

**Desvantagens:**
- ❌ Mais complexo para casos simples
- ❌ Curva de aprendizado

---

### **Opção 3: Immer** (imutabilidade simplificada)

```typescript
import produce from 'immer';

// ✅ COM IMMER (mais legível)
setSteps(produce(draft => {
    const step = draft.find(s => s.id === stepId);
    const block = step.blocks.find(b => b.id === blockId);
    block.properties.question = 'Nova pergunta';  // ✅ Parece mutação, mas é imutável!
}));

// ❌ SEM IMMER (verboso)
setSteps(prev => prev.map(step =>
    step.id === stepId
        ? {
            ...step,
            blocks: step.blocks.map(block =>
                block.id === blockId
                    ? {
                        ...block,
                        properties: {
                            ...block.properties,
                            question: 'Nova pergunta'
                        }
                    }
                    : block
            )
        }
        : step
));
```

---

## 🎯 CONCLUSÃO

### **Arquitetura Atual É Boa Porque:**

1. ✅ **Simples e direta** - Fácil de entender
2. ✅ **Padrão React** - Segue melhores práticas oficiais
3. ✅ **Testável** - Props e callbacks são fáceis de mockar
4. ✅ **Previsível** - Fluxo unidirecional claro
5. ✅ **Performance** - Memoização adequada
6. ✅ **Manutenível** - Código bem estruturado

### **Quando Considerar Mudanças:**

- 🟡 Se props drilling se tornar muito profundo (>5 níveis) → **Context API**
- 🟡 Se estado ficar muito complexo (>20 estados) → **Zustand/Redux**
- 🟡 Se updates ficarem muito verbosos → **Immer**
- 🟡 Se precisar sincronização servidor → **React Query**

### **Recomendação:**

🎯 **Manter arquitetura atual!** Ela é sólida, eficiente e segue as melhores práticas do ecossistema React.

---

**Documento gerado automaticamente**  
**Sprint 4 - Dia 4**  
**Data:** 11/out/2025 05:30  
**Status:** ✅ **ANÁLISE COMPLETA**
