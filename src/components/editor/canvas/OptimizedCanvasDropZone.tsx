import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React from 'react';
import OptimizedSortableBlock from '../dnd/OptimizedSortableBlock';

interface OptimizedCanvasDropZoneProps {
  blocks: Block[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onDuplicateBlock: (id: string) => void;
  onDeleteBlock: (id: string) => void;
  renderBlock: (block: Block) => React.ReactNode;
  className?: string;
}

export const OptimizedCanvasDropZone: React.FC<OptimizedCanvasDropZoneProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onDuplicateBlock,
  onDeleteBlock,
  renderBlock,
  className,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
    data: {
      type: 'canvas',
      accepts: ['sidebar-component', 'block'],
    },
  });

  const blockIds = blocks.map(block => `dnd-block-${block.id}`);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-screen w-full p-6 transition-all duration-200',
        'border-2 border-dashed rounded-lg',
        isOver
          ? 'border-primary bg-primary/5 shadow-inner'
          : 'border-border/50 hover:border-border',
        className
      )}
    >
      {/* Estado vazio */}
      {blocks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div
            className={cn(
              'text-center space-y-4 transition-all duration-300',
              isOver && 'scale-105'
            )}
          >
            <div className="text-6xl">📱</div>
            <h3 className="text-xl font-semibold text-foreground">Canvas Vazio</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Arraste componentes da sidebar para começar a construir sua página. Os blocos
              aparecerão aqui e você poderá reordená-los facilmente.
            </p>
            {isOver && (
              <div className="text-sm text-primary font-medium animate-pulse">
                ✨ Solte aqui o componente
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lista de blocos com SortableContext */}
      {blocks.length > 0 && (
        <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {blocks.map(block => (
              <OptimizedSortableBlock
                key={block.id}
                block={block}
                isSelected={selectedBlockId === block.id}
                onSelect={onSelectBlock}
                onDuplicate={onDuplicateBlock}
                onDelete={onDeleteBlock}
              >
                {renderBlock(block)}
              </OptimizedSortableBlock>
            ))}
          </div>
        </SortableContext>
      )}

      {/* Indicador de drop zone ativo */}
      {isOver && blocks.length > 0 && (
        <div className="mt-6 p-4 border-2 border-dashed border-primary bg-primary/5 rounded-lg">
          <div className="text-center text-primary font-medium animate-pulse">
            ✨ Solte aqui para adicionar ao final
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedCanvasDropZone;
