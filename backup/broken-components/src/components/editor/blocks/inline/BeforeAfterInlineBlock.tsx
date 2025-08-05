import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { safeGetBlockProperties, logBlockDebug } from '@/utils/blockUtils';

/**
 * BeforeAfterInlineBlock - Comparação antes/depois
 */
const BeforeAfterInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  logBlockDebug('BeforeAfterInlineBlock', block);
  const properties = safeGetBlockProperties(block);

  const {
    title = 'Antes vs Depois',
    beforeText = 'Antes',
    afterText = 'Depois',
    beforeImage = 'https://via.placeholder.com/200x150',
    afterImage = 'https://via.placeholder.com/200x150',
  } = properties;

  return (
    <div
      className={cn(
        'w-full p-4 rounded-lg transition-all duration-200',
        isSelected && 'ring-2 ring-[#B89B7A]',
        'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      <h3 className="font-semibold mb-4 text-center">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-center">
          <img src={beforeImage} alt={beforeText} className="w-full h-32 object-cover rounded-lg mb-2" />
          <p className="font-medium">{beforeText}</p>
        </div>
        <div className="text-center">
          <img src={afterImage} alt={afterText} className="w-full h-32 object-cover rounded-lg mb-2" />
          <p className="font-medium">{afterText}</p>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterInlineBlock;
