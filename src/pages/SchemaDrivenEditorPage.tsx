import React, { useState } from 'react';
import { DroppableCanvas } from '../components/editor/dnd/DroppableCanvas';
import { FormElementsPanel } from '../components/editor/FormElementsPanel';
import { DndProvider } from '../components/editor/dnd/DndProvider';
import { BlockData } from '../types/blocks';

export default function SchemaDrivenEditorPage() {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string>();
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  const handleBlocksReorder = (newBlocks: BlockData[]) => {
    setBlocks(newBlocks);
  };

  const handleBlockAdd = (blockType: string, position?: number) => {
    const newBlock: BlockData = {
      id: `block-${Date.now()}`,
      type: blockType,
      properties: {},
    };
    
    if (position !== undefined) {
      const newBlocks = [...blocks];
      newBlocks.splice(position, 0, newBlock);
      setBlocks(newBlocks);
    } else {
      setBlocks([...blocks, newBlock]);
    }
  };

  const handleBlockUpdate = (blockId: string, updates: Partial<BlockData>) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
  };

  const handleBlockDelete = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
  };

  const handleBlockDuplicate = (blockId: string) => {
    const blockToDuplicate = blocks.find(block => block.id === blockId);
    if (blockToDuplicate) {
      const duplicatedBlock: BlockData = {
        ...blockToDuplicate,
        id: `block-${Date.now()}`,
      };
      setBlocks([...blocks, duplicatedBlock]);
    }
  };

  const handleBlockToggleVisibility = (blockId: string) => {
    setBlocks(blocks.map(block => 
      block.id === blockId 
        ? { ...block, properties: { ...block.properties, visible: !block.properties.visible } }
        : block
    ));
  };

  const handleSaveInline = (blockId: string, updates: any) => {
    handleBlockUpdate(blockId, { properties: { ...blocks.find(b => b.id === blockId)?.properties, ...updates } });
  };

  return (
    <DndProvider
      blocks={blocks}
      onBlocksReorder={handleBlocksReorder}
      onBlockAdd={handleBlockAdd}
      onBlockSelect={setSelectedBlockId}
      selectedBlockId={selectedBlockId}
      onBlockUpdate={handleBlockUpdate}
    >
      <div className="flex h-screen">
        <FormElementsPanel />
        <div className="flex-1">
          <DroppableCanvas 
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onBlockSelect={setSelectedBlockId}
            onBlockDelete={handleBlockDelete}
            onBlockDuplicate={handleBlockDuplicate}
            onBlockToggleVisibility={handleBlockToggleVisibility}
            onSaveInline={handleSaveInline}
            onAddBlock={handleBlockAdd}
            setShowRightSidebar={setShowRightSidebar}
          />
        </div>
      </div>
    </DndProvider>
  );
}
