import React from "react";
import { EditableContent } from "@/types/editor";

interface SpacerBlockProps {
  content: EditableContent;
  isSelected?: boolean;
  onContentChange?: (content: Partial<EditableContent>) => void;
  onClick?: () => void;
}

export const SpacerBlock: React.FC<SpacerBlockProps> = ({
  content,
  isSelected,
  onContentChange,
  onClick,
}) => {
  // Convert height to string if it's a number
  const height =
    typeof content.height === "number" ? `${content.height}px` : content.height || "40px";

  return (
    <div
      className={`w-full border border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-400 transition-colors ${
        isSelected ? "border-[#B89B7A] bg-[#B89B7A]/10" : "bg-gray-50"
      }`}
      style={{ height }}
      onClick={onClick}
    >
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Espaçador ({height})
      </div>
    </div>
  );
};

export default SpacerBlock;
