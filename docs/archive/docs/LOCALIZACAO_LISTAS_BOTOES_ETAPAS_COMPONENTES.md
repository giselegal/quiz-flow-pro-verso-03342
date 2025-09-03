# 📍 LOCALIZAÇÃO DAS LISTAS DE BOTÕES - ETAPAS E COMPONENTES

## 🎯 **1. LISTA DE BOTÕES DE ETAPAS**

### 📂 **Arquivo Principal:**

```
/src/components/editor/funnel/FunnelStagesPanel.tsx
```

### 🔍 **Localização no Código:**

- **Linhas 200-280:** Renderização dos botões de etapas
- **Container:** `<ScrollArea>` dentro do `<CardContent>`

### 📋 **Estrutura dos Botões de Etapas:**

```tsx
// Linha 199-203: Container principal
<div className="space-y-2 p-4">
  {stages.map((stage, index) => (
    <div
      key={stage.id}
      className={/* Classes dinâmicas baseadas no activeStageId */}
      onClick={e => handleStageClick(stage.id, e)}
    >
      {/* Conteúdo do botão da etapa */}
    </div>
  ))}
</div>
```

### 🎨 **Elementos de Cada Botão de Etapa:**

1. **Header** (Linhas 220-235):
   - `<GripVertical>` - Ícone de arrastar
   - `Etapa {stage.order}` - Número da etapa
   - `<Badge>` - Contador de blocos

2. **Título** (Linha 237):
   - `{stage.name || stage.description || 'Sem título'}`

3. **Indicador Ativo** (Linhas 240-245):
   - Ponto animado + texto "ATIVA"

4. **Botões de Ação** (Linhas 249-280):
   - `<Eye>` - Visualizar
   - `<Settings>` - Configurações
   - `<Copy>` - Copiar
   - `<Trash2>` - Deletar

### 🔄 **Handler Principal:**

```tsx
// Linha 74-83: Função que gerencia cliques
const handleStageClick = (stageId: string, e?: React.MouseEvent) => {
  console.log('🚨 EVENTO CLICK RECEBIDO - StageID:', stageId);

  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  setActiveStage(stageId); // EditorContext unificado
};
```

---

## 🧩 **2. LISTA DE BOTÕES DE COMPONENTES**

### 📂 **Arquivo Principal:**

```
/src/components/editor/EnhancedComponentsSidebar.tsx
```

### 🔍 **Localização no Código:**

- **Linhas 80-95:** Botões de categorias
- **Linhas 100-135:** Botões de componentes individuais

### 📋 **Estrutura dos Botões de Categorias:**

```tsx
// Linhas 80-95: Grid de categorias
<div className="grid grid-cols-2 gap-2">
  {BLOCK_CATEGORIES.map(category => (
    <Button
      key={category}
      variant={selectedCategory === category ? 'default' : 'outline'}
      onClick={() => handleCategorySelect(category)}
    >
      <div className="text-left">
        <div className="font-medium">{category}</div>
        <div className="text-xs text-muted-foreground">
          {allBlocks.filter(b => b.category === category).length} itens
        </div>
      </div>
    </Button>
  ))}
</div>
```

### 🎨 **Estrutura dos Botões de Componentes:**

```tsx
// Linhas 100-135: Lista de componentes
<div className="space-y-2">
  {filteredBlocks.map(block => (
    <Card key={block.type} className="p-3 cursor-pointer hover:bg-muted/50">
      <div className="flex items-start gap-3">
        {/* Ícone Plus */}
        <div className="p-2 rounded-md bg-primary/10">
          <Plus className="h-4 w-4 text-primary" />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          {/* Nome + Badge */}
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium truncate">{block.name}</h4>
            <Badge variant="secondary">{block.category}</Badge>
          </div>

          {/* Descrição */}
          <p className="text-xs text-muted-foreground mb-2">{block.description}</p>

          {/* Botão Adicionar */}
          <Button size="sm" onClick={() => onAddComponent(block.type)} className="h-6 text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Adicionar
          </Button>
        </div>
      </div>
    </Card>
  ))}
</div>
```

### 🔄 **Handlers Principais:**

```tsx
// Linha 29-32: Busca de componentes
const handleSearch = (query: string) => {
  setSearchQuery(query);
  setSelectedCategory(null);
};

// Linha 34-37: Seleção de categoria
const handleCategorySelect = (category: string) => {
  setSelectedCategory(category === 'All' ? null : category);
  setSearchQuery('');
};
```

---

## 🏗️ **ESTRUTURA VISUAL HIERÁRQUICA**

```
📱 EDITOR-FIXED
├── 🏷️ BrandHeader (removido)
├── 🔧 EditorToolbar (logo + ferramentas)
├── 📊 Status Bar (informações)
└── 📋 FourColumnLayout
    ├── 📑 ETAPAS (Coluna 1)
    │   └── 📂 FunnelStagesPanel.tsx
    │       ├── 🔍 Busca de etapas
    │       ├── ➕ Botão adicionar etapa
    │       └── 📜 Lista de etapas (linhas 200-280)
    │           ├── 🎯 Botão Etapa 1
    │           ├── 🎯 Botão Etapa 2
    │           └── 🎯 Botão Etapa N...
    │
    ├── 🧩 COMPONENTES (Coluna 2)
    │   └── 📂 EnhancedComponentsSidebar.tsx
    │       ├── 🔍 Campo de busca
    │       ├── 📊 Stats do registry
    │       ├── 🏷️ Botões de categorias (linhas 80-95)
    │       └── 📦 Lista de componentes (linhas 100-135)
    │           ├── 🔧 Componente Text
    │           ├── 🔧 Componente Button
    │           └── 🔧 Componente N...
    │
    ├── 🎨 CANVAS (Coluna 3)
    └── ⚙️ PROPRIEDADES (Coluna 4)
```

---

## 🎯 **RESUMO DOS ARQUIVOS**

### 📑 **Lista de Etapas:**

- **Arquivo:** `/src/components/editor/funnel/FunnelStagesPanel.tsx`
- **Linhas:** 200-280 (renderização dos botões)
- **Handler:** `handleStageClick()` (linha 74-83)

### 🧩 **Lista de Componentes:**

- **Arquivo:** `/src/components/editor/EnhancedComponentsSidebar.tsx`
- **Categorias:** Linhas 80-95
- **Componentes:** Linhas 100-135
- **Handlers:** `handleCategorySelect()` e `onAddComponent()`

### 🔗 **Integração:**

Ambos os componentes são integrados no `editor-fixed.tsx` através do `<FourColumnLayout>` e usam o `EditorContext` para gerenciamento de estado unificado.

---

**Os códigos das listas estão localizados e documentados! 🎉**
