# 🔄 COMO O EDITORCONTEXT É USADO NO /editor-fixed

## ✅ **INTEGRAÇÃO COMPLETA DO EDITORCONTEXT**

### 🏗️ **ESTRUTURA DE INTEGRAÇÃO:**

```
App.tsx (Route) → EditorProvider → useEditor() → Componentes
```

---

## 📋 **PONTOS DE USO DO EDITORCONTEXT**

### **1. 🛣️ INICIALIZAÇÃO (App.tsx):**

```tsx
<Route path="/editor-fixed">
  <ErrorBoundary>
    <EditorProvider>
      {' '}
      {/* ← Provedor do contexto */}
      <ScrollSyncProvider>
        <EditorPage />
      </ScrollSyncProvider>
    </EditorProvider>
  </ErrorBoundary>
</Route>
```

### **2. 🎯 COMPONENTE PRINCIPAL (editor-fixed-dragdrop.tsx):**

```tsx
const {
  stages, // 21 etapas do funil
  activeStageId, // Etapa selecionada
  selectedBlockId, // Bloco selecionado
  stageActions: {
    // Ações de etapas
    setActiveStage,
  },
  blockActions: {
    // Ações de blocos
    addBlock,
    addBlockAtPosition,
    getBlocksForStage,
    setSelectedBlockId,
    deleteBlock,
    updateBlock,
    reorderBlocks,
  },
  uiState: {
    // Estados da UI
    isPreviewing,
    setIsPreviewing,
    viewportSize,
    setViewportSize,
  },
  computed: {
    // Dados computados
    currentBlocks,
    selectedBlock,
    totalBlocks,
    stageCount,
  },
} = useEditor();
```

### **3. 📋 PAINEL DE ETAPAS (FunnelStagesPanel.tsx):**

```tsx
const {
  stages, // Lista das 21 etapas
  activeStageId, // Etapa ativa
  stageActions: {
    // Controles de etapas
    setActiveStage,
    addStage,
    removeStage,
    updateStage,
  },
  computed: {
    stageCount, // Total de etapas (21)
  },
} = useEditor();
```

---

## 🎛️ **FLUXOS DE DADOS PRINCIPAIS**

### **⚡ 1. NAVEGAÇÃO ENTRE ETAPAS:**

```typescript
// Usuário clica em uma etapa
FunnelStagesPanel → setActiveStage(stageId)
                 ↓
EditorContext → Carrega template da etapa
             ↓
CanvasDropZone → Recebe novos blocos
              ↓
SortableBlockWrapper → Renderiza componentes
```

### **🎨 2. EDIÇÃO DE BLOCOS:**

```typescript
// Usuário seleciona um bloco
CanvasDropZone → setSelectedBlockId(blockId)
              ↓
EditorContext → Atualiza selectedBlock
             ↓
EnhancedUniversalPropertiesPanel → Mostra propriedades
                                ↓
Usuário edita → updateBlock(id, changes)
             ↓
EditorContext → Atualiza estado
             ↓
CanvasDropZone → Re-renderiza bloco
```

### **🧩 3. ADIÇÃO DE COMPONENTES:**

```typescript
// Usuário arrasta componente
CombinedComponentsPanel → Drag start
                       ↓
CanvasDropZone → Drop zone ativa
              ↓
addBlockAtPosition(position, blockData)
↓
EditorContext → Adiciona ao estado
             ↓
CanvasDropZone → Renderiza novo bloco
```

---

## 📊 **ESTADOS GERENCIADOS**

### **🗂️ ESTRUTURA DE DADOS:**

```typescript
// Estados principais no EditorContext:
{
  // ETAPAS E NAVEGAÇÃO
  stages: FunnelStage[],          // 21 etapas do funil
  activeStageId: string,          // "step-1", "step-2", etc

  // BLOCOS E CONTEÚDO
  stageBlocks: Record<string, EditorBlock[]>,  // Blocos por etapa
  selectedBlockId: string | null,              // Bloco selecionado

  // INTERFACE DO USUÁRIO
  isPreviewing: boolean,          // Modo preview ativo
  viewportSize: "desktop" | "mobile",  // Viewport atual

  // DADOS COMPUTADOS (derivados)
  currentBlocks: EditorBlock[],   // Blocos da etapa ativa
  selectedBlock: EditorBlock,     // Bloco sendo editado
  totalBlocks: number,           // Total de blocos no funil
  stageCount: number             // Total de etapas (21)
}
```

### **🔄 AÇÕES DISPONÍVEIS:**

```typescript
// Ações de etapas
setActiveStage(stageId: string)
addStage(stageData: FunnelStage)
removeStage(stageId: string)
updateStage(stageId: string, updates: Partial<FunnelStage>)

// Ações de blocos
addBlock(stageId: string, blockData: EditorBlock)
addBlockAtPosition(stageId: string, position: number, blockData: EditorBlock)
updateBlock(blockId: string, updates: Partial<EditorBlock>)
deleteBlock(blockId: string)
reorderBlocks(stageId: string, oldIndex: number, newIndex: number)
setSelectedBlockId(blockId: string | null)

// Ações de UI
setIsPreviewing(previewing: boolean)
setViewportSize(size: "desktop" | "mobile")
```

---

## 🎯 **COMPONENTES QUE USAM EDITORCONTEXT**

### **✅ COMPONENTES CONECTADOS:**

**1. 🎛️ CONTROLE PRINCIPAL:**

- **`editor-fixed-dragdrop.tsx`** - Orquestra todo o editor
- **`FunnelStagesPanel.tsx`** - Navegação entre etapas

**2. 🎨 ÁREA DE EDIÇÃO:**

- **`CanvasDropZone.tsx`** - Canvas principal (via props)
- **`SortableBlockWrapper.tsx`** - Wrapper de blocos (via props)

**3. 🧩 PAINÉIS LATERAIS:**

- **`CombinedComponentsPanel.tsx`** - Biblioteca de componentes (via props)
- **`EnhancedUniversalPropertiesPanel.tsx`** - Painel de propriedades (via props)

### **📋 FLUXO DE PROPS:**

```typescript
// EditorContext não é usado diretamente nos componentes filhos
// Os dados fluem via props para manter performance

editor-fixed-dragdrop.tsx (useEditor)
  ↓ (props)
FourColumnLayout
  ↓ (props)
CanvasDropZone → currentBlocks, selectedBlockId
FunnelStagesPanel → stages, activeStageId
EnhancedUniversalPropertiesPanel → selectedBlock
CombinedComponentsPanel → activeStageId
```

---

## ⚡ **PERFORMANCE E OTIMIZAÇÕES**

### **🎯 ESTRATÉGIAS APLICADAS:**

**1. 📦 LAZY LOADING DE TEMPLATES:**

```typescript
// Templates são carregados apenas quando etapa é selecionada
const templateBlocks = getStepTemplate(stepNumber);
```

**2. 🔄 COMPUTED PROPERTIES:**

```typescript
// Dados derivados são computados automaticamente
const currentBlocks = useMemo(() => stageBlocks[activeStageId] || [], [stageBlocks, activeStageId]);
```

**3. 📊 MINIMAL RE-RENDERS:**

```typescript
// Props específicas evitam re-renders desnecessários
<CanvasDropZone
  blocks={currentBlocks}           // Apenas blocos da etapa ativa
  selectedBlockId={selectedBlockId} // ID específico
  onSelectBlock={setSelectedBlockId} // Callback memorizado
/>
```

---

## 🚀 **INICIALIZAÇÃO COMPLETA**

### **📋 SEQUÊNCIA DE STARTUP:**

```typescript
1. App.tsx monta <EditorProvider>
2. EditorContext.tsx executa inicialização:
   - getAllSteps() → Carrega 21 templates
   - Cria 21 stages iniciais
   - Define step-1 como ativo
   - Carrega blocos do Step01Template
3. editor-fixed-dragdrop.tsx monta e usa useEditor()
4. FourColumnLayout renderiza painéis
5. Componentes recebem dados via props
6. Sistema está pronto para uso
```

### **🔍 DEBUG E MONITORING:**

```typescript
// Logs detalhados em cada componente
console.log('🔥 EditorFixedPage: Dados do editor:', {
  stages: stages?.length || 0,
  activeStageId,
  selectedBlockId,
  currentBlocks: currentBlocks?.length || 0,
  totalBlocks,
  stageCount,
});
```

---

## ✅ **CONCLUSÃO**

O **EditorContext** é o **CÉREBRO CENTRAL** do `/editor-fixed`:

1. **🎯 Gerencia estado** de 21 etapas + blocos
2. **🔄 Coordena fluxos** de dados entre componentes
3. **⚡ Carrega templates** dinamicamente conforme navegação
4. **📊 Computa dados** derivados para performance
5. **🎛️ Expõe ações** para manipulação do estado
6. **🚀 Mantém sincronização** entre todos os painéis

**É a peça fundamental que torna o editor visual funcional e eficiente! 🎯**
