import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageEditorCanvasProps {
  blocks: any[];
  onAddBlock: (type: string) => void;
  onSelectBlock: (id: string) => void;
  selectedBlockId: string | null;
}

export const PageEditorCanvas: React.FC<PageEditorCanvasProps> = ({
  blocks,
  onAddBlock,
  onSelectBlock,
  selectedBlockId,
}) => {
  return (
    <div className="flex-1 p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm min-h-96 p-6">
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="mb-4">Nenhum bloco adicionado ainda</p>
            <Button onClick={() => onAddBlock("text")} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Bloco
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {blocks.map((block) => (
              <div
                key={block.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedBlockId === block.id
                    ? "border-blue-500 bg-[#B89B7A]/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onSelectBlock(block.id)}
              >
                <div className="text-sm text-gray-500 mb-2">
                  Bloco: {block.type}
                </div>
                <div>
                  {block.properties?.title ||
                    block.properties?.text ||
                    "Conteúdo do bloco"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageEditorCanvas;
