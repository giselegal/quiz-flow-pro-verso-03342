
import React from 'react';
import { InlineBlockProps } from '@/types/inlineBlocks';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const ProgressInlineBlock: React.FC<InlineBlockProps> = ({ block, onUpdate, isSelected, onSelect }) => {
  // Safety check for block and properties
  if (!block) {
    console.warn('⚠️ ProgressInlineBlock: block is undefined');
    return <div className="p-2 bg-red-50 text-red-600">Error: Block not found</div>;
  }

  // Safe destructuring with fallbacks
  const properties = block.properties || {};
  const content = properties.content || {};
  const style = properties.style || {};
  
  const {
    value = 50,
    max = 100,
    showValue = true,
    label = '',
  } = content;

  const {
    color = '#B89B7A',
    height = 8,
    animated = true
  } = style;

  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  console.log('🔄 ProgressInlineBlock render:', {
    blockId: block.id,
    hasProperties: !!block.properties,
    value,
    max,
    percentage
  });

  return (
    <div
      onClick={onSelect}
      className={cn(
        'w-full space-y-2 cursor-pointer p-2 rounded transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2'
      )}
    >
      {(label || showValue) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="text-[#432818] font-medium">{label}</span>}
          {showValue && <span className="text-[#8F7A6A]">{value}/{max}</span>}
        </div>
      )}
      
      <div 
        className="w-full bg-gray-200 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out rounded-full",
            animated && "transition-all duration-1000"
          )}
          style={{
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
};

export default ProgressInlineBlock;
