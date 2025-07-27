
import React from 'react';
import { Block } from '@/types/editor';

interface TwoColumnBlockProps {
  block: Block;
  isSelected?: boolean;
  onSelect?: () => void;
  isPreview?: boolean;
}

const TwoColumnBlock: React.FC<TwoColumnBlockProps> = ({
  block,
  isSelected,
  onSelect,
  isPreview = false
}) => {
  const leftContent = block.content?.leftContent || 'Conteúdo da coluna esquerda';
  const rightContent = block.content?.rightContent || 'Conteúdo da coluna direita';

  return (
    <div 
      className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-4 ${
        isSelected && !isPreview ? 'ring-2 ring-[#B89B7A] bg-[#FAF9F7]' : ''
      }`}
      onClick={onSelect}
    >
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-[#8F7A6A]">Coluna Esquerda</h4>
        <div className="p-4 bg-white rounded-md border border-[#B89B7A]/20">
          {leftContent}
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-[#8F7A6A]">Coluna Direita</h4>
        <div className="p-4 bg-white rounded-md border border-[#B89B7A]/20">
          {rightContent}
        </div>
      </div>
    </div>
  );
};

export default TwoColumnBlock;
