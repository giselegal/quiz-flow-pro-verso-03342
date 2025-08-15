import React, { useMemo, useCallback } from 'react';
import { Block } from '@/types/editor';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableBlockWrapper } from './SortableBlockWrapper';
import OptimizedBlockRenderer from '../blocks/OptimizedBlockRenderer';

interface EditorCanvasProps {
  blocks: Block[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onUpdateBlock: (blockId: string, properties: any) => void;
  onDeleteBlock: (blockId: string) => void;
  onReorderBlocks: (sourceIndex: number, destinationIndex: number) => void;
  isPreviewing?: boolean;
  viewportSize?: 'sm' | 'md' | 'lg';
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  onReorderBlocks,
  isPreviewing = false,
  viewportSize = 'lg',
}) => {
  // Memoizar handler de drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex(block => block.id === active.id);
    const newIndex = blocks.findIndex(block => block.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      onReorderBlocks(oldIndex, newIndex);
    }
  }, [blocks, onReorderBlocks]);

  // Memoizar viewport classes
  const viewportClasses = useMemo(() => {
    switch (viewportSize) {
      case 'sm':
        return 'max-w-full mx-auto px-2';
      case 'md':
        return 'max-w-full mx-auto px-4';
      case 'lg':
        return 'max-w-full mx-auto px-6';
      default:
        return 'max-w-full mx-auto px-6';
    }
  }, [viewportSize]);

  // Memoizar handler de update
  const handleUpdateBlock = useCallback((blockId: string, updates: any) => {
    onUpdateBlock(blockId, updates);
  }, [onUpdateBlock]);

  // Componente otimizado para preview
  const PreviewBlock = React.memo<{ block: Block }>(({ block }) => (
    <OptimizedBlockRenderer
      block={block}
      isSelected={false}
      isPreviewing={true}
    />
  ));

  // Memoizar lista de IDs dos blocos para DnD
  const blockIds = useMemo(() => blocks.map(b => b.id), [blocks]);

  // Renderização otimizada para preview
  if (isPreviewing) {
    return (
      <div className={`py-1 ${viewportClasses}`}>
        <div className="space-y-1">
          {blocks.map(block => (
            <div key={`preview-${block.id}`} className="w-full">
              <PreviewBlock block={block} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Renderização otimizada para edição
  return (
    <div className={`py-1 ${viewportClasses}`}>
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-1">
            {blocks.map(block => (
              <div key={`edit-${block.id}`} className="w-full">
                <SortableBlockWrapper
                  block={block}
                  isSelected={selectedBlockId === block.id}
                  onSelect={() => onSelectBlock(block.id)}
                  onUpdate={updates => handleUpdateBlock(block.id, updates)}
                  onDelete={() => onDeleteBlock(block.id)}
                />
              </div>
            ))}
            {blocks.length === 0 && (
              <div className="text-center py-8" style={{ color: '#8B7355' }}>
                <p className="text-lg font-medium">Nenhum componente adicionado ainda.</p>
                <p className="text-sm opacity-70 mt-2">
                  Arraste componentes da barra lateral para começar.
                </p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
