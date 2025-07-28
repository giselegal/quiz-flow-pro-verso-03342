
import React from 'react';
import { Block } from '../../../types/editor';
import { getBlockComponent } from '../../../config/editorBlocksMapping21Steps';

interface UniversalBlockRendererProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  onSaveInline?: (blockId: string, updates: Partial<Block>) => void;
  disabled?: boolean;
  className?: string;
}

export const UniversalBlockRenderer: React.FC<UniversalBlockRendererProps> = ({
  block,
  isSelected = false,
  onClick,
  onSaveInline,
  disabled = false,
  className = ''
}) => {
  const BlockComponent = getBlockComponent(block.type);
  
  if (!BlockComponent) {
    return (
      <div 
        className={`p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 ${className}`}
        onClick={onClick}
      >
        <p>Componente não encontrado: {block.type}</p>
      </div>
    );
  }

  const handleUpdate = (updates: any) => {
    if (onSaveInline) {
      onSaveInline(block.id, {
        ...block,
        content: { ...block.content, ...updates }
      });
    }
  };

  return (
    <div className={className} onClick={onClick}>
      <BlockComponent
        block={block}
        content={block.content}
        isSelected={isSelected}
        isEditing={!disabled}
        onUpdate={handleUpdate}
        onPropertyChange={handleUpdate}
        onSelect={onClick}
        onClick={onClick}
        disabled={disabled}
      />
    </div>
  );
};
