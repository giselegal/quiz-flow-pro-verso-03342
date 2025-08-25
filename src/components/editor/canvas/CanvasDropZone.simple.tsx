import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { Block } from '@/types/editor';
import { cn } from '@/lib/utils';

type Props = {
  blocks: Block[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onUpdateBlock: (id: string, updates: any) => void;
  onDeleteBlock: (id: string) => void;
};

export const CanvasDropZone: React.FC<Props> = ({ blocks, selectedBlockId, onSelectBlock }) => {
  // Zona raiz do canvas (pega canvas vazio e “final da lista”)
  const root = useDroppable({ id: 'canvas-drop-zone' });

  const DropSeparator: React.FC<{ index: number }> = ({ index }) => {
    const { setNodeRef, isOver } = useDroppable({ id: `drop-zone-${index}` });
    return (
      <div
        ref={setNodeRef}
        className={cn(
          'h-3 my-1 rounded transition-colors',
          isOver ? 'bg-blue-200' : 'bg-transparent'
        )}
        aria-label={`drop-zone-${index}`}
      />
    );
  };

  const CanvasItem: React.FC<{ block: Block; index: number }> = ({ block, index }) => {
    // O bloco é droppable (para inserir antes) e draggable (para reordenar)
    const drop = useDroppable({ id: String(block.id) });
    const drag = useDraggable({
      id: String(block.id),
      data: { type: 'canvas-block', blockId: String(block.id) },
    });

    const style: React.CSSProperties = drag.transform
      ? { 
          transform: `translate3d(${drag.transform.x}px, ${drag.transform.y}px, 0)`,
          zIndex: drag.isDragging ? 1000 : 'auto',
        }
      : {};

    return (
      <>
        <DropSeparator index={index} />
        <div
          ref={node => {
            drop.setNodeRef(node);
            drag.setNodeRef(node);
          }}
          {...drag.attributes}
          {...drag.listeners}
          style={style}
          className={cn(
            'w-full min-h-[48px] rounded-md border border-dashed p-2 bg-white transition-colors',
            drop.isOver && 'border-blue-500 bg-blue-50',
            selectedBlockId === block.id && 'ring-2 ring-blue-400',
            drag.isDragging && 'opacity-50 cursor-grabbing'
          )}
          onClick={() => onSelectBlock(String(block.id))}
        >
          {/* Placeholder de conteúdo do bloco - substitua pelo renderer real, se existir */}
          <div className="text-xs text-gray-500">
            {block.type} — {String(block.id)}
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      ref={root.setNodeRef}
      className={cn('w-full', root.isOver && 'bg-blue-50 ring-2 ring-blue-200 rounded-md')}
    >
      {blocks.length === 0 ? (
        <div className="p-6 text-center text-sm text-gray-500">Solte um componente aqui</div>
      ) : (
        <div className="flex flex-col">
          {blocks.map((b, i) => (
            <CanvasItem key={String(b.id)} block={b} index={i} />
          ))}
          {/* Último separador → permite inserir no final via drop-zone-N */}
          <DropSeparator index={blocks.length} />
        </div>
      )}
    </div>
  );
};

export default CanvasDropZone;
