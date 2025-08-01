
import React, { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { FunnelStep, FunnelBlock } from '@/types/funnel';
import { SortableCanvasItem } from '@/components/result-editor/SortableCanvasItem';
import { UniversalBlockRenderer } from '../blocks/UniversalBlockRenderer';

interface EditorCanvasProps {
  step: FunnelStep | null;
  blocks: FunnelBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string | null) => void;
  onUpdateBlock: (blockId: string, updates: Partial<FunnelBlock>) => void;
  onDeleteBlock: (blockId: string) => void;
  onReorderBlocks: (stepId: string, startIndex: number, endIndex: number) => void;
  isPreviewing: boolean;
  viewportSize: 'sm' | 'md' | 'lg' | 'xl';
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  step,
  blocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  onReorderBlocks,
  isPreviewing,
  viewportSize
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !step || active.id === over.id) return;

    const oldIndex = blocks.findIndex((block) => block.id === active.id);
    const newIndex = blocks.findIndex((block) => block.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      onReorderBlocks(step.id, oldIndex, newIndex);
    }
  }, [blocks, step, onReorderBlocks]);

  const handleBlockSelect = useCallback((blockId: string) => {
    onSelectBlock(blockId === selectedBlockId ? null : blockId);
  }, [selectedBlockId, onSelectBlock]);

  const handleBlockDelete = useCallback((blockId: string) => {
    onDeleteBlock(blockId);
    if (selectedBlockId === blockId) {
      onSelectBlock(null);
    }
  }, [onDeleteBlock, selectedBlockId, onSelectBlock]);

  const handleBlockDuplicate = useCallback((blockId: string) => {
    const blockToDuplicate = blocks.find(b => b.id === blockId);
    if (!blockToDuplicate) return;

    const duplicatedBlock: FunnelBlock = {
      ...blockToDuplicate,
      id: `${blockToDuplicate.id}-copy-${Date.now()}`,
      order: blockToDuplicate.order + 0.5,
    };

    // This would need to be implemented in the parent component
    console.log('Duplicate block:', duplicatedBlock);
  }, [blocks]);

  // Get viewport-specific classes
  const getViewportClasses = () => {
    switch (viewportSize) {
      case 'sm':
        return 'max-w-sm mx-auto';
      case 'md':
        return 'max-w-md mx-auto';
      case 'lg':
        return 'max-w-4xl mx-auto';
      case 'xl':
        return 'max-w-6xl mx-auto';
      default:
        return 'max-w-4xl mx-auto';
    }
  };

  if (!step) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">Nenhuma etapa selecionada</h3>
          <p className="text-sm">Selecione uma etapa na barra lateral para começar a editar</p>
        </div>
      </div>
    );
  }

  if (blocks.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-lg font-medium mb-2">Canvas Vazio</h3>
          <p className="text-sm mb-4">
            Adicione componentes à etapa "{step.name}" usando o painel de componentes
          </p>
          <div className="text-xs text-gray-400">
            💡 Dica: Comece adicionando um cabeçalho ou texto
          </div>
        </div>
      </div>
    );
  }

  if (isPreviewing) {
    return (
      <div className={`h-full bg-white overflow-auto ${getViewportClasses()}`}>
        <div className="p-6 space-y-4">
          {blocks.map((block) => (
            <div key={block.id} className="w-full">
              <UniversalBlockRenderer
                block={block}
                isSelected={false}
                onSelect={() => {}}
                onUpdate={() => {}}
                onDelete={() => {}}
                isPreview={true}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      <div className={`min-h-full p-6 ${getViewportClasses()}`}>
        <div className="mb-4 text-sm text-gray-600 bg-white px-3 py-2 rounded-md border">
          <span className="font-medium">Etapa:</span> {step.name} 
          <span className="ml-4 text-gray-400">({blocks.length} componentes)</span>
        </div>

        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {blocks.map((block) => (
                <SortableCanvasItem
                  key={block.id}
                  id={block.id}
                  isSelected={selectedBlockId === block.id}
                  onSelect={() => handleBlockSelect(block.id)}
                  onDelete={() => handleBlockDelete(block.id)}
                  onDuplicate={() => handleBlockDuplicate(block.id)}
                >
                  <UniversalBlockRenderer
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => handleBlockSelect(block.id)}
                    onUpdate={(updates) => onUpdateBlock(block.id, updates)}
                    onDelete={() => handleBlockDelete(block.id)}
                    isPreview={false}
                  />
                </SortableCanvasItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
