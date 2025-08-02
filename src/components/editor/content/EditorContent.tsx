
import React from 'react';
import { Block } from '@/types/editor';
import { BenefitsBlock } from '../preview/blocks';

interface EditorContentProps {
  blocks: Block[];
  selectedBlockId?: string;
  onSelectBlock: (blockId: string) => void;
}

export const EditorContent: React.FC<EditorContentProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock
}) => {
  const renderBlock = (block: Block) => {
    const isSelected = selectedBlockId === block.id;

    switch (block.type) {
      case 'benefits':
        // Ensure items is a string array for benefits
        const items = Array.isArray(block.content.items) 
          ? block.content.items.filter((item): item is string => typeof item === 'string')
          : [];
        
        return (
          <BenefitsBlock
            key={block.id}
            content={{
              ...block.content,
              items
            }}
            onClick={() => onSelectBlock(block.id)}
          />
        );
      
      default:
        return (
          <div
            key={block.id}
            className={`p-4 border rounded-lg cursor-pointer ${
              isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => onSelectBlock(block.id)}
          >
            <p className="text-gray-600">Tipo de bloco: {block.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {blocks.map(renderBlock)}
    </div>
  );
};
