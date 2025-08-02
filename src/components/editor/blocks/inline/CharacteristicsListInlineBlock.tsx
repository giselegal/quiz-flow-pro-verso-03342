
import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { safeGetBlockProperties, logBlockDebug } from '@/utils/blockUtils';

/**
 * CharacteristicsListInlineBlock - Lista de características
 */
const CharacteristicsListInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = ''
}) => {
  logBlockDebug('CharacteristicsListInlineBlock', block);
  const properties = safeGetBlockProperties(block);
  
  const {
    title = 'Características',
    items = ['Item 1', 'Item 2', 'Item 3'],
    backgroundColor = 'white'
  } = properties;

  return (
    <div
      className={cn(
        'w-full p-4 rounded-lg transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500',
        'cursor-pointer',
        className
      )}
      style={{ backgroundColor }}
      onClick={onClick}
    >
      <h3 className="font-semibold mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item: string, index: number) => (
          <li key={index} className="flex items-center">
            <span className="w-2 h-2 bg-[#B89B7A] rounded-full mr-3" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CharacteristicsListInlineBlock;
