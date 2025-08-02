
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Block } from '@/types/editor';
import UniversalBlockRenderer from '../blocks/UniversalBlockRenderer';

interface DroppableCanvasProps {
  blocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
}

export const DroppableCanvas: React.FC<DroppableCanvasProps> = ({
  blocks,
  onBlocksChange,
  selectedBlockId,
  onSelectBlock
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas-droppable',
  });

  const handleAddBlock = (type: string) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type: type as Block['type'],
      properties: {},
      order: blocks.length
    };
    
    onBlocksChange([...blocks, newBlock]);
  };

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[600px] p-6 border-2 border-dashed rounded-lg transition-colors ${
        isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
      }`}
    >
      {blocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <p className="text-lg mb-2">Canvas vazio</p>
          <p className="text-sm">Arraste componentes aqui para começar</p>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block) => (
            <div
              key={block.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedBlockId === block.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectBlock(block.id)}
            >
              <UniversalBlockRenderer
                block={block}
                isSelected={selectedBlockId === block.id}
                onClick={() => onSelectBlock(block.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DroppableCanvas;
