
import React from 'react';
import { InlineBlockProps } from '@/types/inlineBlocks';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

const StatInlineBlock: React.FC<InlineBlockProps> = ({ block, onUpdate, isSelected, onSelect }) => {
  const {
    value = '1,234',
    label = 'Estatística',
    prefix = '',
    suffix = '',
    icon = '',
    highlightColor = '#B89B7A',
    size = 'md'
  } = block.properties;

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm': return { value: 'text-2xl', label: 'text-sm', icon: 16 };
      case 'md': return { value: 'text-3xl', label: 'text-base', icon: 20 };
      case 'lg': return { value: 'text-4xl', label: 'text-lg', icon: 24 };
      default: return { value: 'text-3xl', label: 'text-base', icon: 20 };
    }
  };

  const sizeClasses = getSizeClasses(size);

  // Get icon component if specified
  const IconComponent = icon && Icons[icon as keyof typeof Icons] as React.ComponentType<any>;

  return (
    <div
      onClick={onSelect}
      className={cn(
        'text-center space-y-2 cursor-pointer p-4 rounded-lg transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2'
      )}
    >
      {IconComponent && (
        <div className="flex justify-center">
          <IconComponent 
            size={sizeClasses.icon} 
            style={{ color: highlightColor }}
          />
        </div>
      )}
      
      <div 
        className={cn('font-bold', sizeClasses.value)}
        style={{ color: highlightColor }}
      >
        {prefix}{value}{suffix}
      </div>
      
      <div className={cn('text-[#8F7A6A]', sizeClasses.label)}>
        {label}
      </div>
    </div>
  );
};

export default StatInlineBlock;
