
import React from 'react';
import { Block } from '@/types/editor';
import { EditorBlock } from '@/types/editor';
import { FunnelBlockRenderer } from './editor/FunnelBlockRenderer';

export const DynamicBlockRenderer: React.FC<{
  block: Block;
  isEditable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
}> = ({ block, isEditable = false, onEdit, onDelete, isSelected = false }) => {
  
  // List of funnel block types
  const funnelBlockTypes = [
    'intro',
    'name-collect',
    'quiz-intro',
    'question-multiple',
    'quiz-transition',
    'processing',
    'result-intro',
    'result-details',
    'result-guide',
    'offer-transition',
    'offer-page',
    'countdown-timer',
    'result-card',
    'offer-card'
  ];

  const isFunnelBlock = funnelBlockTypes.includes(block.type);

  if (isFunnelBlock) {
    return (
      <FunnelBlockRenderer
        block={block}
        isEditable={isEditable}
        onEdit={onEdit}
        onDelete={onDelete}
        isSelected={isSelected}
      />
    );
  }

  // Handle other block types here
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">{block.type}</h3>
      <p className="text-sm text-gray-600">
        Block content: {JSON.stringify(block.content)}
      </p>
    </div>
  );
};
