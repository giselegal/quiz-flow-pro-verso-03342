# 🎯 Workflow do Editor Schema-Driven

## 📋 Visão Geral

O editor é um sistema completo de criação de funis/quizzes com interface drag-and-drop, gerenciamento de estado avançado e persistência em tempo real.

## 🏗️ Arquitetura Principal

```
┌─────────────────────────────────────────────────────────────┐
│                    EDITOR RESPONSIVO                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   SIDEBAR   │  │   CANVAS    │  │  PROPERTIES PANEL   │  │
│  │ Componentes │  │   Visual    │  │   Configurações     │  │
│  │   & Páginas │  │   Editor    │  │     do Bloco        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Funcionamento

### 1. **Inicialização do Editor**

```typescript
// Hook principal: useSchemaEditorFixed
const {
  funnel, // Estado do funil atual
  currentPage, // Página sendo editada
  selectedBlock, // Bloco selecionado
  isLoading, // Estado de carregamento
  isSaving, // Estado de salvamento
  // ... métodos de manipulação
} = useSchemaEditor(funnelId);
```

**Processo:**

1. 🚀 Editor carrega com `funnelId` (se fornecido)
2. 📥 `loadFunnel()` busca dados do Supabase ou cria novo funil
3. 🎨 Interface renderiza com 3 painéis principais
4. 📱 Suporte responsivo (mobile, tablet, desktop)

### 2. **Gerenciamento de Estado**

```typescript
// Estado centralizado no hook
const [funnel, setFunnel] = useState<SchemaDrivenFunnelData | null>(null);
const [currentPageId, setCurrentPageId] = useState<string | null>(null);
const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
```

**Fluxo de Dados:**

```
Ação do Usuário → Hook useSchemaEditor → Estado Local → Supabase
                                      ↓
                              localStorage (backup)
```

### 3. **Sistema Drag & Drop**

#### **Sidebar de Componentes**

```typescript
// Componentes disponíveis
const blockTypes = [
  'heading-inline', // Títulos
  'text-inline', // Textos
  'image-display-inline', // Imagens
  'form-input', // Campos de entrada
  'options-grid', // Grade de opções
  'quiz-intro-header', // Cabeçalho do quiz
  'style-card-inline', // Cards de estilo
  'button-inline', // Botões
];
```

#### **Canvas Droppable**

```typescript
// DroppableCanvas.tsx
<div ref={setNodeRef} className="canvas-drop-zone">
  {blocks.map(block => (
    <SortableBlockItem
      block={block}
      onSelect={onBlockSelect}
      onDelete={onBlockDelete}
      onDuplicate={onBlockDuplicate}
    />
  ))}
</div>
```

### 4. **Operações CRUD**

#### **Criar Bloco**

```typescript
const addBlock = (blockData: Omit<BlockData, 'id'>) => {
  const newBlock = {
    ...blockData,
    id: `block-${Date.now()}`,
  };

  updateFunnelState(prev => ({
    ...prev,
    pages: prev.pages.map(page =>
      page.id === currentPageId ? { ...page, blocks: [...page.blocks, newBlock] } : page
    ),
  }));
};
```

#### **Atualizar Bloco**

```typescript
const updateBlock = (blockId: string, updates: Partial<BlockData>) => {
  updateFunnelState(prev => ({
    ...prev,
    pages: prev.pages.map(page => ({
      ...page,
      blocks: page.blocks.map(block => (block.id === blockId ? { ...block, ...updates } : block)),
    })),
  }));
};
```

#### **Deletar Bloco**

```typescript
const deleteBlock = async (blockId: string) => {
  // 1. Deletar no backend
  await schemaDrivenFunnelService.deleteBlock(funnel.id, currentPage.id, blockId);

  // 2. Atualizar estado local
  updateFunnelState(prev => ({
    ...prev,
    pages: prev.pages.map(page =>
      page.id === currentPage.id
        ? {
            ...page,
            blocks: page.blocks.filter(block => block.id !== blockId),
          }
        : page
    ),
  }));
};
```

### 5. **Sistema de Persistência**

#### **Salvamento Manual**

```typescript
const saveFunnel = async (manual: boolean = true) => {
  setIsSaving(true);
  try {
    const savedFunnel = await schemaDrivenFunnelService.saveFunnel(funnel, !manual);
    setFunnel(savedFunnel);

    if (manual) {
      toast({
        title: 'Funil salvo!',
        description: 'Todas as alterações foram salvas.',
      });
    }
  } catch (error) {
    toast({ title: 'Erro ao salvar', variant: 'destructive' });
  } finally {
    setIsSaving(false);
  }
};
```

#### **Backup Local**

```typescript
const saveToLocal = (funnelData: SchemaDrivenFunnelData) => {
  try {
    localStorage.setItem('schema-driven-funnel', JSON.stringify(funnelData));
  } catch (error) {
    // Limpeza automática se quota excedida
    localStorage.removeItem('schema-driven-versions');
    localStorage.setItem('schema-driven-funnel', JSON.stringify(funnelData));
  }
};
```

### 6. **Renderização de Blocos**

#### **Sistema de Blocos Modulares**

```typescript
// Cada bloco tem estrutura padronizada
interface BlockData {
  id: string;
  type: string;
  properties: {
    // Propriedades específicas do tipo
    content?: string;
    fontSize?: string;
    color?: string;
    // ... outras propriedades
  };
}
```

#### **Renderização Responsiva**

```typescript
// Layout vertical centralizado
<div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
  {blocks.map(block => (
    <SortableBlockItem
      block={block}
      className="w-full max-w-full"
      // ... props
    />
  ))}
</div>
```

### 7. **Painel de Propriedades**

```typescript
// DynamicPropertiesPanel.tsx
const updateBlockProperty = (key: string, value: any) => {
  if (!selectedBlockId) return;

  const newProperties = {
    ...selectedBlock.properties,
    [key]: value,
  };

  updateBlock(selectedBlockId, { properties: newProperties });
};
```

### 8. **Funcionalidades Avançadas**

#### **Undo/Redo**

```typescript
const [undoStack, setUndoStack] = useState<any[]>([]);
const [redoStack, setRedoStack] = useState<any[]>([]);

const handleUndo = () => {
  if (undoStack.length > 0) {
    const prevState = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, currentPage]);
    updatePage(prevState.id, prevState);
  }
};
```

#### **Versionamento**

```typescript
// Histórico de versões automático
const saveVersion = (funnel: SchemaDrivenFunnelData) => {
  const version = {
    id: `v-${Date.now()}`,
    timestamp: new Date(),
    data: funnel,
    description: `Auto-save ${new Date().toLocaleString()}`,
  };

  const versions = getVersionHistory();
  versions.push(version);
  localStorage.setItem('schema-driven-versions', JSON.stringify(versions));
};
```

#### **Preview em Tempo Real**

```typescript
// Visualização responsiva
const deviceViews = ['mobile', 'tablet', 'desktop'];
const [deviceView, setDeviceView] = useState<DeviceView>('desktop');

// CSS responsivo automático
const getDeviceStyles = () => {
  switch (deviceView) {
    case 'mobile':
      return 'max-w-sm';
    case 'tablet':
      return 'max-w-2xl';
    case 'desktop':
      return 'max-w-4xl';
  }
};
```

## 🎯 Fluxo Completo de Uso

### **1. Usuário Acessa Editor**

```
/editor/:id → Carrega funil existente
/editor     → Cria novo funil
```

### **2. Interface Carrega**

```
┌─ Sidebar ─┐ ┌─── Canvas ───┐ ┌─ Properties ─┐
│ • Heading │ │              │ │              │
│ • Text    │ │   [Empty]    │ │   [None]     │
│ • Image   │ │              │ │              │
│ • Button  │ │              │ │              │
└───────────┘ └──────────────┘ └──────────────┘
```

### **3. Usuário Arrasta Componente**

```
Sidebar → Canvas: Drag & Drop
                ↓
        Novo bloco criado
                ↓
        Estado atualizado
                ↓
        Canvas re-renderiza
```

### **4. Usuário Edita Propriedades**

```
Clica no bloco → Seleciona → Properties Panel abre
                                      ↓
                              Edita propriedades
                                      ↓
                              updateBlock() chamado
                                      ↓
                              Estado atualizado
```

### **5. Salvamento**

```
Manual: Botão Save → saveFunnel() → Supabase + localStorage
Auto:   Mudança detectada → Debounce → Save automático
```

## 🔧 Tecnologias Utilizadas

- **React + TypeScript**: Interface e tipagem
- **@dnd-kit**: Sistema drag & drop
- **Supabase**: Persistência em nuvem
- **localStorage**: Backup local
- **Wouter**: Roteamento
- **Lucide React**: Ícones
- **Tailwind CSS**: Estilização

## 📊 Estrutura de Dados

```typescript
interface SchemaDrivenFunnelData {
  id: string;
  name: string;
  description?: string;
  config: FunnelConfig;
  pages: SchemaDrivenPageData[];
  createdAt: Date;
  lastModified: Date;
}

interface SchemaDrivenPageData {
  id: string;
  name: string;
  title: string;
  type: 'intro' | 'question' | 'transition' | 'result' | 'offer';
  order: number;
  blocks: BlockData[];
  settings: PageSettings;
}
```

## 🚀 Performance e Otimizações

- **Debounce**: Evita salvamentos excessivos
- **Memoização**: React.memo em componentes pesados
- **Lazy Loading**: Componentes carregados sob demanda
- **Cleanup**: Limpeza automática de localStorage
- **Error Boundaries**: Tratamento de erros robusto

Este workflow garante uma experiência fluida e profissional para criação de funis/quizzes interativos! 🎉
