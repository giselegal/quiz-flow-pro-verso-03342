# 🎣 PAPEL DOS HOOKS NO EDITOR - DOCUMENTAÇÃO COMPLETA

## 📋 **Resumo Executivo**

O sistema de hooks no editor Quiz Quest funciona como uma **arquitetura em camadas** que separa responsabilidades e centraliza o gerenciamento de estado. Os hooks `use...` servem como **interfaces funcionais** que conectam componentes React aos sistemas de estado, lógica de negócio e operações do editor.

---

## 🏗️ **ARQUITETURA DOS HOOKS - HIERARQUIA PRINCIPAL**

### **🔺 Camada 1: Hook Central (`useEditor`)**

```typescript
const {
  stages,
  activeStageId,
  selectedBlockId,
  stageActions: { setActiveStage, addStage },
  blockActions: { addBlock, updateBlock, deleteBlock, reorderBlocks },
  uiState: { isPreviewing, setIsPreviewing, viewportSize },
  computed: { currentBlocks, selectedBlock, totalBlocks },
} = useEditor();
```

**Função**: Centro de controle absoluto do editor

- **Estado**: Gerencia 21 estágios do funil, blocos ativos, seleções
- **Ações**: Coordena todas as operações CRUD (Create, Read, Update, Delete)
- **UI**: Controla modo preview, tamanho viewport, navegação
- **Computed**: Fornece propriedades calculadas otimizadas

---

### **🔸 Camada 2: Hooks Especializados**

#### **2.1 `useBlockOperations`** - Operações de Blocos

```typescript
const {
  blocks,
  selectedBlockId,
  setSelectedBlockId,
  updateBlocks,
  actions: { handleAddBlock, handleUpdateBlock, handleDeleteBlock, handleReorderBlocks },
} = useBlockOperations();
```

**Papel**: Gerenciamento específico de operações com blocos

- ✅ **CRUD Blocks**: Criar, atualizar, deletar, reordenar blocos
- ✅ **Estado Local**: Gerencia estado isolado de blocos
- ✅ **Callbacks**: Fornece handlers otimizados para componentes

#### **2.2 `useDynamicEditorData`** - Dados Dinâmicos

```typescript
const { blocks, selectedBlockId, addBlock, updateBlock, deleteBlock, selectBlock, reorderBlocks } =
  useDynamicEditorData();
```

**Papel**: Sistema de dados dinâmicos com IDs semânticos

- 🎯 **IDs Semânticos**: `editor-block-${type}-${number}`
- 🔄 **Estado Reativo**: Atualização em tempo real
- 🛡️ **Type Safety**: Validação TypeScript completa

#### **2.3 `useEditorReusableComponents`** - Componentes Reutilizáveis

```typescript
const {
  componentTypes,
  stepComponents,
  loading,
  error,
  addComponent,
  updateComponent,
  deleteComponent,
  reorderComponents,
  loadStepComponents,
} = useEditorReusableComponents();
```

**Papel**: Sistema de componentes reutilizáveis entre etapas

- 🔗 **Integração**: Conecta `useEditor()` com `useReusableComponents()`
- 📦 **Registry**: Gerencia ENHANCED_BLOCK_REGISTRY
- 🔄 **Sincronização**: Mantém componentes sincronizados entre stages

---

### **🔹 Camada 3: Hooks de Funcionalidades**

#### **3.1 `useEditorActions`** - Ações com Histórico

```typescript
const { handleAddBlock, handleUpdateBlock, handleDeleteBlock, handleSave } = useEditorActions(
  blocks,
  onBlocksChange,
  addToHistory
);
```

**Papel**: Ações do editor com sistema de histórico

- 📚 **Histórico**: Integra com `useEditorHistory`
- 🔔 **Toast**: Sistema de notificações
- 💾 **Auto-Save**: Persistência automática

#### **3.2 `useUnifiedProperties`** - Propriedades Unificadas

```typescript
const {
  selectedBlock,
  availableProperties,
  updateProperty,
  resetProperties,
  propertyHistory,
  undoProperty,
  redoProperty,
} = useUnifiedProperties();
```

**Papel**: Sistema universal de propriedades dos blocos

- 🎛️ **Controles**: Margins, borders, colors, fonts
- 📊 **História**: Histórico de mudanças por propriedade
- 🔧 **Universal**: Funciona com qualquer tipo de bloco

#### **3.3 `useSyncedScroll`** - Scroll Sincronizado

```typescript
const { scrollRef } = useSyncedScroll({ source: 'canvas' });
```

**Papel**: Sincronização de scroll entre painéis

- 🔄 **Multi-Panel**: Sincroniza scroll entre canvas/preview
- ⚡ **Performance**: Otimizado com debouncing
- 📱 **Responsivo**: Adaptável a diferentes viewports

---

### **🔸 Camada 4: Hooks Utilitários**

#### **4.1 `useEditorHistory`** - Histórico de Mudanças

```typescript
const { addToHistory, undo, redo, canUndo, canRedo } = useEditorHistory(blocks);
```

**Papel**: Sistema de undo/redo para o editor

- ⏪ **Undo/Redo**: Navegação no histórico
- 💾 **Stack**: Pilha de estados anteriores
- 🎯 **Granular**: Histórico por operação

#### **4.2 `useKeyboardShortcuts`** - Atalhos de Teclado

```typescript
const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts();
```

**Papel**: Sistema de atalhos de teclado

- ⌨️ **Shortcuts**: Ctrl+Z, Ctrl+Y, Delete, etc.
- 🎯 **Contexto**: Atalhos específicos por componente
- 🚫 **Prevent**: Previne conflitos com browser

#### **4.3 `useDebounce`** - Debouncing de Operações

```typescript
const debouncedValue = useDebounce(inputValue, 300);
```

**Papel**: Otimização de performance para operações frequentes

- ⏱️ **Delay**: Evita execução excessiva
- 🔍 **Search**: Otimiza busca em tempo real
- 💾 **Auto-Save**: Debounce para salvamento automático

---

## 🔄 **FLUXO DE DADOS ENTRE HOOKS**

### **📊 Diagrama de Dependências**

```
🔺 useEditor (EditorContext)
   ├── 🔸 useBlockOperations
   ├── 🔸 useDynamicEditorData
   ├── 🔸 useEditorReusableComponents
   │   └── 🔹 useReusableComponents
   ├── 🔹 useUnifiedProperties
   │   ├── 🔸 usePropertyHistory
   │   └── 🔸 useDebounce
   ├── 🔹 useEditorActions
   │   └── 🔸 useEditorHistory
   ├── 🔹 useSyncedScroll
   └── 🔸 useKeyboardShortcuts
```

### **🔗 Comunicação Entre Hooks**

1. **`useEditor`** → **Provider Central**
   - Fornece estado global via EditorContext
   - Coordena todas as operações cross-hook
   - Mantém sincronização entre 21 stages

2. **`useBlockOperations`** → **Operações Locais**
   - Consome `useEditor` para operações específicas
   - Fornece handlers otimizados para componentes
   - Gerencia estado local de seleção

3. **`useUnifiedProperties`** → **Propriedades Universais**
   - Conecta com `useEditor` via `selectedBlock`
   - Utiliza `useDebounce` para otimização
   - Integra `usePropertyHistory` para undo/redo

---

## 🎯 **CASOS DE USO PRÁTICOS**

### **🔥 Exemplo 1: Adicionar Novo Bloco**

```typescript
// Hook: useEditor
const {
  blockActions: { addBlock },
} = useEditor();

// Uso em componente:
const handleAddHeading = () => {
  const blockId = addBlock('heading');
  console.log(`Bloco ${blockId} adicionado!`);
};
```

### **🔥 Exemplo 2: Editar Propriedades em Tempo Real**

```typescript
// Hook: useUnifiedProperties
const { updateProperty } = useUnifiedProperties();

// Uso em painel de propriedades:
const handleMarginChange = (value: string) => {
  updateProperty('marginTop', value);
  // ✅ Auto-debounced
  // ✅ Auto-historized
  // ✅ Auto-synchronized
};
```

### **🔥 Exemplo 3: Drag & Drop com Reordenação**

```typescript
// Hook: useEditor
const {
  blockActions: { reorderBlocks },
} = useEditor();

// Uso em DndProvider:
const handleDragEnd = (newBlockIds: string[]) => {
  reorderBlocks(newBlockIds, activeStageId);
  // ✅ Atualização atômica
  // ✅ Sincronização cross-stage
  // ✅ Estado consistente
};
```

---

## 📈 **BENEFÍCIOS DA ARQUITETURA DE HOOKS**

### **✅ Vantagens Técnicas**

1. **🎯 Separação de Responsabilidades**
   - Cada hook tem função específica e bem definida
   - Reduz complexidade de componentes individuais
   - Facilita manutenção e debugging

2. **🔄 Reutilização de Código**
   - Hooks podem ser utilizados em múltiplos componentes
   - Lógica compartilhada entre diferentes partes do editor
   - Reduz duplicação de código

3. **⚡ Performance Otimizada**
   - `useCallback` e `useMemo` em hooks críticos
   - Debouncing automático para operações frequentes
   - Re-renders otimizados com dependencies bem definidas

4. **🛡️ Type Safety**
   - TypeScript completo em todos os hooks
   - Interfaces bem definidas para cada hook
   - Validação de tipos em tempo de desenvolvimento

5. **🧪 Testabilidade**
   - Hooks podem ser testados isoladamente
   - Mocking facilitado para testes unitários
   - Lógica de negócio separada da renderização

---

## 🔧 **PADRÕES DE IMPLEMENTAÇÃO**

### **📝 Padrão 1: Hook com Estado Local**

```typescript
export const useLocalHook = () => {
  const [state, setState] = useState(initialState);

  const action = useCallback(() => {
    // Lógica específica
  }, [dependencies]);

  return { state, action };
};
```

### **📝 Padrão 2: Hook com Contexto**

```typescript
export const useContextHook = () => {
  const context = useContext(SomeContext);

  if (!context) {
    throw new Error('Hook must be used within Provider');
  }

  return context;
};
```

### **📝 Padrão 3: Hook Composto**

```typescript
export const useComposedHook = () => {
  const hook1 = useHook1();
  const hook2 = useHook2();

  const composedAction = useCallback(() => {
    hook1.action();
    hook2.action();
  }, [hook1.action, hook2.action]);

  return { ...hook1, ...hook2, composedAction };
};
```

---

## 🎯 **CONCLUSÃO**

Os hooks no editor Quiz Quest implementam uma **arquitetura em camadas robusta** que:

### **🔑 Funções Principais**

1. **🏗️ Centralização**: `useEditor` como único ponto de verdade
2. **🔧 Especialização**: Hooks específicos para funcionalidades
3. **🔄 Coordenação**: Comunicação otimizada entre sistemas
4. **⚡ Performance**: Otimizações automáticas e debouncing
5. **🛡️ Segurança**: Type safety e validações completas

### **📊 Impacto no Sistema**

- **21 Stages** gerenciados de forma coordenada
- **16+ Block Types** com operações uniformes
- **4 Panels** sincronizados em tempo real
- **Drag & Drop** com reordenação atômica
- **Undo/Redo** com histórico granular

### **🚀 Resultado Final**

Uma interface de editor visual **profissional e performática** que permite criação intuitiva de funis de quiz com 21 etapas, drag & drop completo, propriedades universais e sistema de templates integrado.

---

**📝 Documentação criada**: `PAPEL_HOOKS_EDITOR_DOCUMENTACAO_COMPLETA.md`  
**🗓️ Data**: 08 de Agosto de 2025  
**📊 Status**: Sistema 100% funcional e documentado
