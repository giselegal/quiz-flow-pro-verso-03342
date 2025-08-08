# 🎯 COMO O EDITOR É USADO NO /editor-fixed

## 📋 **ARQUITETURA COMPLETA DO /editor-fixed**

### 🛣️ **FLUXO DE ROTEAMENTO:**

```
/editor-fixed → App.tsx → EditorProvider → EditorFixedPage → EditorFixedPageWithDragDrop
```

**🔗 CADEIA DE COMPONENTES:**

1. **`/editor-fixed`** (URL)
2. **`App.tsx`** (linha 51) - Rota principal
3. **`EditorProvider`** - Context wrapper
4. **`ScrollSyncProvider`** - Scroll sincronizado
5. **`EditorFixedPage`** - Wrapper simples
6. **`EditorFixedPageWithDragDrop`** - Editor principal

---

## 🏗️ **ESTRUTURA DO EDITOR**

### **📱 LAYOUT DE 4 COLUNAS:**

```tsx
<FourColumnLayout
  stagesPanel={<FunnelStagesPanel />} // Coluna 1: Etapas
  componentsPanel={<CombinedComponentsPanel />} // Coluna 2: Componentes
  canvas={<CanvasDropZone />} // Coluna 3: Canvas principal
  propertiesPanel={<EnhancedUniversalPanel />} // Coluna 4: Propriedades
/>
```

### **🎛️ COMPONENTES PRINCIPAIS:**

**1. 📋 PAINEL DE ETAPAS (Coluna 1):**

- **`FunnelStagesPanel`** - Lista das 21 etapas
- **Navegação** entre Step01-Step21
- **Indicador** de etapa ativa

**2. 🧩 PAINEL DE COMPONENTES (Coluna 2):**

- **`CombinedComponentsPanel`** - Biblioteca de blocos
- **Drag & Drop** de componentes
- **Filtros** por categoria

**3. 🎨 CANVAS PRINCIPAL (Coluna 3):**

- **`CanvasDropZone`** - Área de edição
- **Preview** responsivo (desktop/mobile)
- **Drag & Drop** de blocos
- **Seleção** e edição inline

**4. ⚙️ PAINEL DE PROPRIEDADES (Coluna 4):**

- **`EnhancedUniversalPropertiesPanel`** - Controles universais
- **7 propriedades** principais (margin, container, etc)
- **Controles específicos** por componente

---

## 🔄 **SISTEMA DE ESTADOS (EditorContext)**

### **📊 ESTADO PRINCIPAL:**

```typescript
const {
  stages, // 21 etapas do funil
  activeStageId, // Etapa selecionada
  selectedBlockId, // Bloco selecionado
  blockActions: {
    // Ações de bloco
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
  },
  uiState: {
    // Interface
    isPreviewing,
    viewportSize,
  },
} = useEditor();
```

### **🎯 DADOS DINÂMICOS:**

- **`currentBlocks`** - Blocos da etapa ativa
- **`selectedBlock`** - Bloco sendo editado
- **`totalBlocks`** - Total de blocos no funil
- **`stageCount`** - Total de etapas (21)

---

## 📦 **INTEGRAÇÃO COM TEMPLATES**

### **🔗 CONEXÃO COM MAPEAMENTO:**

```typescript
// EditorContext carrega templates via stepTemplatesMapping.ts
const allStepTemplates = getAllSteps(); // Inicialização
const templateBlocks = getStepTemplate(stepNumber); // Carregamento dinâmico
```

### **⚡ FLUXO DE DADOS:**

1. **Usuário seleciona etapa** → FunnelStagesPanel
2. **EditorContext carrega template** → stepTemplatesMapping.ts
3. **Template executado** → Step01Template.tsx (exemplo)
4. **Blocos carregados** → CanvasDropZone
5. **Renderização** → Componentes individuais

---

## 🎛️ **FUNCIONALIDADES ATIVAS**

### **✅ DRAG & DROP:**

- **DndProvider** envolve todo o editor
- **Componentes arrastáveis** do painel
- **Drop zones** no canvas
- **Reordenação** de blocos

### **🎨 PREVIEW RESPONSIVO:**

- **Desktop/Mobile** toggle
- **Viewport dinâmico** (375px/1024px)
- **Scroll sincronizado** entre painéis

### **⚙️ EDIÇÃO EM TEMPO REAL:**

- **Seleção** de blocos no canvas
- **Propriedades** atualizadas instantaneamente
- **Preview** atualizado automaticamente

### **💾 PERSISTÊNCIA:**

- **Estados salvos** no EditorContext
- **Templates preservados** entre navegações
- **Configurações mantidas** por sessão

---

## 🚀 **INICIALIZAÇÃO DO SISTEMA**

### **📋 SEQUÊNCIA DE STARTUP:**

1. **App.tsx** → Rota `/editor-fixed`
2. **EditorProvider** → Inicializa com 21 stages
3. **stepTemplatesMapping** → Carrega todos os templates
4. **EditorContext** → Configura estados iniciais
5. **FourColumnLayout** → Monta interface
6. **Componentes** → Renderizam painéis
7. **Canvas** → Carrega Step01 por padrão

### **⚡ PERFORMANCE:**

- **Lazy loading** de templates
- **Virtualization** de listas grandes
- **Debounced updates** para propriedades
- **Memoization** de componentes

---

## 📊 **ESTATÍSTICAS DO SISTEMA**

### **🎯 NÚMEROS ATUAIS:**

- **21 etapas** mapeadas
- **4 colunas** de interface
- **16 tipos** de blocos disponíveis
- **7 propriedades** universais
- **100+ componentes** individuais

### **🔧 INTEGRAÇÕES ATIVAS:**

- **enhancedBlockRegistry** - Componentes disponíveis
- **useUnifiedProperties** - Sistema de propriedades
- **useContainerProperties** - Controles de container
- **ScrollSyncProvider** - Sincronização de scroll

---

## ✅ **CONCLUSÃO**

O **`/editor-fixed`** é um **editor visual completo** que:

1. **🎯 Carrega 21 etapas** via templates automáticos
2. **🎨 Interface 4 colunas** para edição visual
3. **🔄 Drag & Drop nativo** para construção
4. **⚙️ Propriedades universais** para customização
5. **📱 Preview responsivo** para validação
6. **💾 Estado persistente** durante a sessão

**É o CORE do sistema de criação de funis, totalmente integrado com o sistema de templates! 🚀**
