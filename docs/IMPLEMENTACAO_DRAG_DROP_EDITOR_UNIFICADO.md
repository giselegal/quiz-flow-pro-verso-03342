# Implementação de Arrastar e Soltar (Drag & Drop) no Editor Unificado

Para implementar a funcionalidade de arrastar e soltar (drag & drop) no EditorUnified.tsx, siga estas etapas:

## 1. Criação do Componente SortablePreviewBlockWrapper

Este componente já foi criado e está disponível em:
`/workspaces/quiz-quest-challenge-verse/src/components/editor/unified/SortablePreviewBlockWrapper.tsx`

## 2. Atualização do UnifiedPreviewEngine.tsx

Modifique o arquivo `/workspaces/quiz-quest-challenge-verse/src/components/editor/unified/UnifiedPreviewEngine.tsx`:

### 2.1. Adicione as importações do dnd-kit:

```typescript
// Importações DnD
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';

// Importação do componente sortable
import { SortablePreviewBlockWrapper } from './SortablePreviewBlockWrapper';
```

### 2.2. Atualize a interface UnifiedPreviewEngineProps para incluir onBlocksReordered:

```typescript
export interface UnifiedPreviewEngineProps {
  blocks: Block[];
  selectedBlockId?: string | null;
  isPreviewing: boolean;
  viewportSize: 'mobile' | 'tablet' | 'desktop';
  primaryStyle?: StyleResult;
  onBlockSelect?: (blockId: string) => void;
  onBlockUpdate?: (blockId: string, updates: Partial<Block>) => void;
  onBlocksReordered?: (startIndex: number, endIndex: number) => void; // Nova prop
  mode?: 'editor' | 'preview' | 'production';
  className?: string;
}
```

### 2.3. Adicione o código para extrair blockIds:

```typescript
// Extrair os IDs dos blocos para o SortableContext
const blockIds = useMemo(() => blocks.map(block => block.id), [blocks]);
```

### 2.4. Adicione a função de handleDragEnd:

```typescript
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
```

### 2.5. Substitua o renderizador de blocos por DndContext e SortableContext:

```typescript
{blocks.length === 0 ? (
  <EmptyPreviewState mode={mode} />
) : (
  <DndContext
    sensors={[]} // Serão adicionados pelo componente pai
    collisionDetection={closestCenter}
    onDragEnd={handleDragEnd}
    modifiers={[restrictToParentElement]}
    autoScroll={true}
  >
    <SortableContext
      items={blockIds}
      strategy={verticalListSortingStrategy}
    >
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
  </DndContext>
)}
```

## 3. Atualize o EditorUnified.tsx

### 3.1. Adicione as importações do dnd-kit:

```typescript
// Importações DnD
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
```

### 3.2. Adicione a configuração dos sensores:

```typescript
// Configuração dos sensores para DndContext
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // 8px é a distância mínima para iniciar o drag
    },
  }),
  useSensor(KeyboardSensor)
);
```

### 3.3. Adicione o handler para arrastar e soltar:

```typescript
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
```

### 3.4. Envolva todo o componente com DndContext:

```typescript
return (
  <DndContext
    sensors={sensors}
    collisionDetection={closestCenter}
    onDragEnd={handleDragEnd}
    modifiers={[restrictToParentElement]}
  >
    <PreviewProvider totalSteps={totalSteps} funnelId={funnelIdRef.current}>
      {/* ... Conteúdo existente ... */}
    </PreviewProvider>
  </DndContext>
);
```

### 3.5. Passe a propriedade onBlocksReordered para o UnifiedPreviewEngine:

```typescript
<UnifiedPreviewEngine
  blocks={currentBlocks}
  selectedBlockId={selectedBlockId}
  isPreviewing={editorMode === 'preview' || editorMode === 'test'}
  viewportSize={controlsState.viewportSize}
  onBlockSelect={handleBlockSelect}
  onBlockUpdate={handleBlockUpdate}
  onBlocksReordered={reorderBlocks} // Adicione esta linha
  mode={editorMode === 'edit' ? 'editor' : 'preview'}
  className=""
  key={`preview-step-${currentStep}`}
/>
```

## Observações Importantes

1. Certifique-se de que o componente `SortablePreviewBlockWrapper` está corretamente implementado com `useSortable` do dnd-kit.
2. Os componentes devem estar na estrutura correta: `DndContext > SortableContext > SortablePreviewBlockWrapper`.
3. Ao testar, verifique se os sensores estão configurados corretamente para detectar o arrastar e soltar.
4. A função `reorderBlocks` do EditorContext deve ser corretamente utilizada para atualizar o estado.

Esta implementação permitirá que os blocos sejam reordenados através de arrastar e soltar no editor unificado.
