import React from "react";
import { Block } from "@/types/editor";
import { StyleResult } from "@/types/quiz";

// Import specific block editors (commented out missing components)
// import TextInlineBlock from "./blocks/inline/TextInlineBlock";
// import ImageDisplayInlineBlock from "./blocks/inline/ImageDisplayInlineBlock";
// import BadgeInlineBlock from "./blocks/inline/BadgeInlineBlock";
// import ProgressInlineBlock from "./blocks/inline/ProgressInlineBlock";
// import StatInlineBlock from "./blocks/inline/StatInlineBlock";
// import { CountdownInlineBlock } from "./blocks/inline";
// import SpacerInlineBlock from "./blocks/inline/SpacerInlineBlock";

interface EditBlockContentProps {
  block: Block;
  selectedStyle?: StyleResult;
  onUpdateBlock: (blockId: string, properties: any) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

const EditBlockContent: React.FC<EditBlockContentProps> = ({
  block,
  selectedStyle,
  onUpdateBlock,
  isSelected = false,
  onSelect,
}) => {
  const handlePropertyChange = (key: string, value: any) => {
    onUpdateBlock(block.id, {
      ...(block.properties || {}),
      [key]: value,
    });
  };

  // Ensure block has properties field for compatibility
  const blockWithProperties = {
    ...block,
    properties: block.properties || block.content || {},
  };

  const blockProps = {
    block: blockWithProperties,
    isSelected,
    onClick: onSelect,
    onPropertyChange: handlePropertyChange,
    disabled: false,
  };

  // Map block types to their respective editors - simplified version
  const renderBlock = () => {
    // For now, just render a simple preview for all block types
    return (
      <div className="p-4 border border-gray-300 bg-gray-50 rounded-lg">
        <p className="text-gray-600">
          Bloco tipo: <strong>{block.type}</strong>
        </p>
        <pre className="text-xs mt-2 bg-gray-100 p-2 rounded max-h-32 overflow-y-auto">
          {JSON.stringify(block.properties || {}, null, 2)}
        </pre>
      </div>
    );
  };

  return <div className="w-full">{renderBlock()}</div>;
};

export default EditBlockContent;
