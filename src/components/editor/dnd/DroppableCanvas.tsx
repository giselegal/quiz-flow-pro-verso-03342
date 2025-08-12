import { Block } from '@/types/editor';
import { useDroppable } from '@dnd-kit/core';

interface DroppableCanvasProps {
  blocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  isPreviewing?: boolean;
}

const DroppableCanvas: React.FC<DroppableCanvasProps> = ({
  blocks,
  selectedBlockId: _selectedBlockId,
  isPreviewing: _isPreviewing = false,
}) => {
  const { setNodeRef } = useDroppable({
    id: 'droppable-canvas',
    data: {
      accepts: ['text', 'image', 'button', 'spacer', 'heading'],
    },
  });

  return (
    <div ref={setNodeRef} className="w-full h-full p-4 border-2 border-dashed rounded-md bg-white">
      {blocks.length === 0 ? (
        <div className="text-stone-500 text-center">Arraste e solte componentes aqui</div>
      ) : (
        <div>
          {blocks.map(block => (
            <div key={block.id}>{block.type}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DroppableCanvas;
