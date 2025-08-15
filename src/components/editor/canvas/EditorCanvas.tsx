import React from 'react';
import { getBlockComponent } from '@/config/enhancedBlockRegistry';
import { useContainerProperties } from '@/hooks/useContainerProperties';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableBlockWrapper } from './SortableBlockWrapper';

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
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex(block => block.id === active.id);
    const newIndex = blocks.findIndex(block => block.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      onReorderBlocks(oldIndex, newIndex);
    }
  };

  const getViewportClasses = () => {
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
  };

  const handleUpdateBlock = (blockId: string, updates: any) => {
    onUpdateBlock(blockId, updates);
  };

  // 🎯 Componente simplificado para preview (2 containers apenas)
  const PreviewBlock: React.FC<{ block: Block }> = ({ block }) => {
    const { containerClasses, inlineStyles } = useContainerProperties(block.properties);
    const Component = getBlockComponent(block.type);

    if (!Component) {
      return (
        <div style={{ borderColor: '#E5DDD5' }}>
          <p>Componente não encontrado: {block.type}</p>
        </div>
      );
    }

    return (
      <div className={cn('transition-all duration-200', containerClasses)} style={inlineStyles}>
        <React.Suspense fallback={<div className="animate-pulse bg-gray-200 h-16 rounded" />}>
          <Component id={block.id} properties={block.properties} isSelected={false} block={block} />
        </React.Suspense>
      </div>
    );
  };

  if (isPreviewing) {
    return (
      <div className={`py-1 ${getViewportClasses()}`}>
        <div className="space-y-1">
          {blocks.map(block => (
            <div key={block.id} className="w-full flex justify-center">
              <div className="w-full max-w-none">
                <PreviewBlock block={block} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`py-1 ${getViewportClasses()}`}>
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1">
            {blocks.map(block => (
              <div key={block.id} className="w-full flex justify-center">
                <div className="w-full max-w-none">
                  <SortableBlockWrapper
                    key={block.id}
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => onSelectBlock(block.id)}
                    onUpdate={updates => handleUpdateBlock(block.id, updates)}
                    onDelete={() => onDeleteBlock(block.id)}
                  />
                </div>
              </div>
            ))}
            {blocks.length === 0 && (
              <div style={{ color: '#8B7355' }}>
                <p>Nenhum componente adicionado ainda.</p>
                <p className="text-sm">Arraste componentes da barra lateral para começar.</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
