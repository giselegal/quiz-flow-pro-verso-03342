
import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { EditorBlock } from '@/types/editor';
import { UniversalBlockRenderer } from '../blocks/UniversalBlockRenderer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EditorCanvasProps {
  blocks: EditorBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlock: (id: string, updates: Partial<EditorBlock>) => void;
  onDeleteBlock: (id: string) => void;
  onReorderBlocks: (startIndex: number, endIndex: number) => void;
  isPreviewing: boolean;
  viewportSize: 'sm' | 'md' | 'lg' | 'xl';
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
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
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeIndex = blocks.findIndex(block => block.id === active.id);
    const overIndex = blocks.findIndex(block => block.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      onReorderBlocks(activeIndex, overIndex);
    }
  };

  if (blocks.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-white">
        <div className="text-center space-y-4">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-xl font-medium text-gray-900">Canvas vazio</h3>
          <p className="text-gray-600 max-w-md">
            Adicione componentes da barra lateral para começar a construir sua página
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm min-h-[600px] p-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={blocks.map(block => block.id)} 
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    className={`
                      relative transition-all duration-200
                      ${selectedBlockId === block.id 
                        ? 'ring-2 ring-blue-500 ring-opacity-50' 
                        : 'hover:ring-1 hover:ring-gray-300'
                      }
                      ${isPreviewing ? '' : 'cursor-pointer'}
                    `}
                    onClick={() => !isPreviewing && onSelectBlock(block.id)}
                  >
                    <UniversalBlockRenderer
                      block={block}
                      isSelected={selectedBlockId === block.id}
                      onSelect={() => onSelectBlock(block.id)}
                      onUpdate={(updates) => onUpdateBlock(block.id, updates)}
                      onDelete={() => onDeleteBlock(block.id)}
                      isPreview={isPreviewing}
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default EditorCanvas;
