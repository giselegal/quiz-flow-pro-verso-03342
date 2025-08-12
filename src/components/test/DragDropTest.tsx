import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import DroppableCanvas from '../editor/dnd/DroppableCanvas';

const DragDropTest: React.FC = () => {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const handleBlockSelect = (blockId: string) => {
    setSelectedBlockId(blockId);
  };

  const handleBlockDelete = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
  };

  const handleBlockDuplicate = (blockId: string) => {
    const blockToDuplicate = blocks.find(block => block.id === blockId);
    if (blockToDuplicate) {
      const newBlock = {
        ...blockToDuplicate,
        id: `${blockToDuplicate.id}-copy`,
      };
      setBlocks([...blocks, newBlock]);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Drag & Drop Test</h2>

      <DroppableCanvas
        blocks={blocks}
        onBlocksChange={setBlocks}
        selectedBlockId={selectedBlockId}
        onSelectBlock={handleBlockSelect}
      />

      <div className="mt-4 space-x-2">
        <Button onClick={() => handleBlockSelect('test')}>Select Test Block</Button>
        <Button onClick={() => handleBlockDelete('test')}>Delete Test Block</Button>
        <Button onClick={() => handleBlockDuplicate('test')}>Duplicate Test Block</Button>
      </div>
    </div>
  );
};

export default DragDropTest;
