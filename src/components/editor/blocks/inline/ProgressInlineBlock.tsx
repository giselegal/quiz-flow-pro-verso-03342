import React from 'react';
import { InlineBlockProps } from '@/types/inlineBlocks';
import { cn } from '@/lib/utils';

const ProgressInlineBlock: React.FC<InlineBlockProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
  disabled = false,
}) => {
  // Safety check for block and properties
  if (!block) {
    console.warn('⚠️ ProgressInlineBlock: block is undefined');
    return <div className="p-2 bg-red-50 text-red-600">Error: Block not found</div>;
  }

  // Safe destructuring with fallbacks
  const properties = block.properties || {};
  const content = properties.content || {};
  const style = properties.style || {};

  const { label = 'Progresso', value = 50, max = 100, showPercentage = true, showLabel = true } = content;

  const { size = 'md', color = 'blue', backgroundColor = 'gray' } = style;

  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'h-2 text-sm';
      case 'md':
        return 'h-3 text-base';
      case 'lg':
        return 'h-4 text-lg';
      default:
        return 'h-3 text-base';
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-[#B89B7A]/100';
      case 'green':
        return 'bg-green-500';
      case 'red':
        return 'bg-red-500';
      case 'yellow':
        return 'bg-stone-500';
      case 'purple':
        return 'bg-[#B89B7A]/100';
      default:
        return 'bg-[#B89B7A]/100';
    }
  };

  const getBackgroundClasses = (backgroundColor: string) => {
    switch (backgroundColor) {
      case 'gray':
        return 'bg-gray-200';
      case 'light':
        return 'bg-gray-100';
      case 'dark':
        return 'bg-gray-300';
      default:
        return 'bg-gray-200';
    }
  };

  const sizeClasses = getSizeClasses(size);
  const colorClasses = getColorClasses(color);
  const backgroundClasses = getBackgroundClasses(backgroundColor);

  return (
    <div
      onClick={onClick}
      className={cn(
        'cursor-pointer p-4 rounded-lg transition-all duration-200',
        isSelected && 'ring-2 ring-[#B89B7A] ring-offset-2',
        'space-y-2',
      )}
    >
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className={cn('font-medium text-gray-700', sizeClasses)}>{label}</span>
          {showPercentage && <span className={cn('text-gray-600', sizeClasses)}>{Math.round(percentage)}%</span>}
        </div>
      )}

      <div className={cn('w-full rounded-full overflow-hidden', sizeClasses, backgroundClasses)}>
        <div
          className={cn('h-full transition-all duration-300 ease-out', colorClasses)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressInlineBlock;
