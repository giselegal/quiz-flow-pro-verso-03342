import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Block } from "@/types/editor";
import { generateSemanticIdFromObject } from "@/components/editor/utils/semanticIdGenerator";

interface DroppableCanvasProps {
  blocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  isPreviewing?: boolean;
}

const DroppableCanvas: React.FC<DroppableCanvasProps> = ({
  blocks,
  onBlocksChange,
  selectedBlockId,
  onSelectBlock,
  isPreviewing = false,
}) => {
  const handleDrop = (blockType: Block["type"]) => {
    const newBlock: Block = {
      id: generateSemanticIdFromObject({
        context: "canvas",
        type: "block",
        identifier: "block",
        index: Math.floor(Math.random() * 1000),
      }),
      type: blockType,
      content: {}, // Fixed: Add the required content property
      properties: {},
      order: blocks.length,
    };

    onBlocksChange([...blocks, newBlock]);
    onSelectBlock(newBlock.id);
  };

  const { setNodeRef } = useDroppable({
    id: "droppable-canvas",
    data: {
      accepts: ["text", "image", "button", "spacer", "heading"],
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
