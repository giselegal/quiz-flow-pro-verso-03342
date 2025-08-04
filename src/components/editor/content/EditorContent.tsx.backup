import React from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { EditorBlock } from "@/types/editor";

interface EditorContentProps {
  blocks: EditorBlock[];
  onDragEnd: (event: DragEndEvent) => void;
  onAddBlock: (type: EditorBlock["type"]) => void;
  onUpdateBlock: (id: string, content: any) => void;
  onDeleteBlock: (id: string) => void;
  isPreviewing: boolean;
}

export const EditorContent: React.FC<EditorContentProps> = ({
  blocks,
  onDragEnd,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  isPreviewing,
}) => {
  const renderBlock = (block: EditorBlock) => {
    const isSelected = false;

    switch (block.type) {
      case "benefits":
        const items = Array.isArray(block.content?.items)
          ? block.content.items.filter(
              (item): item is string => typeof item === "string",
            )
          : [];

        return (
          <div
            key={block.id}
            className={`p-4 border rounded-lg cursor-pointer ${
              isSelected ? "border-blue-500 bg-[#B89B7A]/10" : "border-gray-200"
            }`}
            onClick={() => {}}
          >
            <h3 className="font-medium mb-2">
              {block.content?.title || "Benefícios"}
            </h3>
            <ul className="list-disc list-inside">
              {items.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );

      default:
        return (
          <div
            key={block.id}
            className={`p-4 border rounded-lg cursor-pointer ${
              isSelected ? "border-blue-500 bg-[#B89B7A]/10" : "border-gray-200"
            }`}
          >
            <p className="text-gray-600">Tipo de bloco: {block.type}</p>
          </div>
        );
    }
  };

  return <div className="space-y-4">{blocks.map(renderBlock)}</div>;
};
