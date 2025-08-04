import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BlockType } from "@/types/editor";

interface EditorWorkspaceProps {
  blocks: any[];
  onAddBlock: (type: BlockType) => void;
  onSelectBlock: (id: string) => void;
  selectedBlockId?: string;
}

export const EditorWorkspace: React.FC<EditorWorkspaceProps> = ({
  blocks,
  onAddBlock,
  onSelectBlock,
  selectedBlockId,
}) => {
  const handleAddBlock = (type: string) => {
    // Ensure the type is valid before calling onAddBlock
    onAddBlock(type as BlockType);
  };

  return (
    <div className="editor-workspace flex-1 p-4">
      {blocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-gray-500 mb-4">Nenhum bloco adicionado ainda</p>
          <Button
            onClick={() => handleAddBlock("text")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar primeiro bloco
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block) => (
            <div
              key={block.id}
              className={`block-item p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedBlockId === block.id
                  ? "border-blue-500 bg-[#B89B7A]/10"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => onSelectBlock(block.id)}
            >
              <div className="block-type text-sm text-gray-500 mb-2">
                {block.type}
              </div>
              <div className="block-content">
                {block.content.title && (
                  <h3 className="font-medium">{block.content.title}</h3>
                )}
                {block.content.text && (
                  <p className="text-gray-700">{block.content.text}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditorWorkspace;
