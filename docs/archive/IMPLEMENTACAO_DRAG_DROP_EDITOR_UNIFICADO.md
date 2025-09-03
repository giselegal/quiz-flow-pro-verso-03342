# Implementação de Arrastar e Soltar no EditorUnified

## Visão Geral

Foi implementada a funcionalidade de arrastar e soltar (drag and drop) no componente `EditorUnified`, permitindo a reordenação de blocos no canvas do editor. Esta implementação utiliza a biblioteca `@dnd-kit`, uma solução moderna e acessível para funcionalidades de arrastar e soltar em aplicações React.

## Componentes Envolvidos

1. **EditorUnified.tsx**: Componente principal do editor que agora inclui o `DndContext` para controlar operações de arrastar e soltar.
2. **UnifiedPreviewEngine.tsx**: Componente que renderiza os blocos no canvas e agora inclui `SortableContext` para gerenciar os itens ordenáveis.
3. **SortablePreviewBlockWrapper.tsx**: Novo componente criado para envolver cada bloco no preview com funcionalidade de arrastar e soltar.

## Bibliotecas Utilizadas

- **@dnd-kit/core**: Fornece o sistema básico de arrastar e soltar
- **@dnd-kit/sortable**: Extensão para listas ordenáveis
- **@dnd-kit/modifiers**: Para modificadores como restringir movimentos
- **@dnd-kit/utilities**: Utilitários como transformações CSS

## Fluxo de Dados

1. **EditorUnified** configura o `DndContext` principal e os sensores (pointer e keyboard)
2. **UnifiedPreviewEngine** utiliza `SortableContext` para listar os blocos em ordem
3. **SortablePreviewBlockWrapper** utiliza o hook `useSortable` para tornar cada bloco arrastável

## Detalhes da Implementação

### 1. EditorUnified.tsx

```tsx
// Configuração dos sensores para DndContext
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // 8px é a distância mínima para iniciar o drag
    },
  }),
  useSensor(KeyboardSensor)
);

// Handler para arrastar e soltar (drag and drop)
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (over && active.id !== over.id) {
    // Encontrar os índices dos blocos
    const oldIndex = currentBlocks.findIndex(block => block.id === active.id);
    const newIndex = currentBlocks.findIndex(block => block.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      console.log('🔄 Reordenando blocos:', { oldIndex, newIndex });
      // Usar reorderBlocks do EditorContext
      reorderBlocks(oldIndex, newIndex);
    }
  }
};

// No JSX:
return (
  <DndContext
    sensors={sensors}
    collisionDetection={closestCenter}
    onDragEnd={handleDragEnd}
    modifiers={[restrictToParentElement]}
  >
    <PreviewProvider totalSteps={totalSteps} funnelId={funnelIdRef.current}>
      {/* ... conteúdo do editor ... */}
    </PreviewProvider>
  </DndContext>
);
```

### 2. UnifiedPreviewEngine.tsx

```tsx
// Extrair os IDs dos blocos para o SortableContext
const blockIds = useMemo(() => blocks.map(block => block.id), [blocks]);

// Handler para o fim do drag and drop
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;

  if (over && active.id !== over.id) {
    const oldIndex = blocks.findIndex(block => block.id === active.id);
    const newIndex = blocks.findIndex(block => block.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1 && onBlocksReordered) {
      onBlocksReordered(oldIndex, newIndex);
      trackEvent('blocks_reordered_in_preview', { oldIndex, newIndex });
    }
  }
};

// No JSX:
<DndContext
  sensors={[]} // Serão adicionados pelo componente pai (EditorUnified)
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
  modifiers={[restrictToParentElement]}
  autoScroll={true}
>
  <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
    {blocks.map(block => (
      <SortablePreviewBlockWrapper
        key={block.id}
        block={block}
        isSelected={selectedBlockId === block.id}
        isPreviewing={isPreviewing}
        renderConfig={renderConfig[mode]}
        primaryStyle={primaryStyle}
        onClick={() => handleBlockClick(block.id)}
        onUpdate={updates => handleBlockUpdate(block.id, updates)}
      />
    ))}
  </SortableContext>
</DndContext>;
```

### 3. SortablePreviewBlockWrapper.tsx

```tsx
// Configuração do useSortable do dnd-kit
const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
  id: block.id,
  disabled: isPreviewing,
});

// Estilo do wrapper com transformação de arrastar e soltar
const wrapperStyle = {
  outline: renderConfig.showOutlines && isSelected ? '2px solid #3b82f6' : 'none',
  position: 'relative' as const,
  transform: CSS.Transform.toString(transform),
  transition,
  opacity: isDragging ? 0.5 : 1,
  zIndex: isDragging ? 999 : 'auto',
};

// No JSX:
<div
  ref={setNodeRef}
  className={wrapperClasses}
  style={wrapperStyle}
  onClick={onClick}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  {...attributes}
>
  {/* ... conteúdo do bloco ... */}

  {/* Alça para arrastar (visível apenas no modo editor e quando não está previsualizando) */}
  {!isPreviewing && renderConfig.showOutlines && (
    <div
      className="drag-handle absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded cursor-move z-10"
      {...listeners}
    >
      ⋮⋮
    </div>
  )}
</div>;
```

## Como Funciona

1. O usuário interage com a "alça de arrasto" (⋮⋮) no canto superior direito de um bloco
2. Após mover o mouse por pelo menos 8px, o arrasto é iniciado
3. O bloco arrastado é mostrado com opacidade reduzida
4. Ao soltar o bloco em uma nova posição, o evento `onDragEnd` é disparado
5. A função `reorderBlocks` do `EditorContext` é chamada para atualizar a ordem dos blocos
6. A interface é atualizada refletindo a nova ordem dos blocos

## Considerações Sobre Acessibilidade

- Suporte a teclado através do `KeyboardSensor`
- Alças de arrasto claramente visíveis com feedback visual
- Feedback visual durante o arrasto (opacidade reduzida)

## Melhorias Futuras

- Adicionar animações suaves durante a reordenação
- Implementar previsualização de "fantasma" durante o arrasto
- Adicionar sons de feedback para arrastar e soltar
- Melhorar a experiência em dispositivos móveis com sensores otimizados para toque

## Limitações

- O arrastar e soltar está desativado no modo de preview
- Blocos só podem ser reorganizados verticalmente (ordem linear)
