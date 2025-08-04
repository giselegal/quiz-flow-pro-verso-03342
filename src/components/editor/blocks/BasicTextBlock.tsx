import React from 'react';
import { cn } from '../../../lib/utils';
import type { BlockComponentProps } from '../../../types/blocks';

const BasicTextBlock: React.FC<BlockComponentProps> = ({ block, isSelected = false, onClick, className = '' }) => {
  const text = block.properties?.content || 'Adicione seu texto aqui';

  return (
    <div
      className={cn(
        'w-full p-3 rounded-lg border transition-all duration-200',
        'border-gray-200 bg-white hover:bg-gray-50',
        isSelected && 'border-blue-500 bg-blue-50 ring-2 ring-blue-200',
        'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      <div className="text-gray-800">{text}</div>
    </div>
  );
};

export default BasicTextBlock;
