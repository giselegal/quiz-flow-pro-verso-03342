
import React from 'react';
import { InlineBlockProps } from '@/types/inlineBlocks';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const BadgeInlineBlock: React.FC<InlineBlockProps> = ({ block, onUpdate, isSelected, onSelect }) => {
  const {
    text = 'Novo',
    variant = 'default',
    size = 'sm',
    shape = 'rounded'
  } = block.properties;

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm': return 'text-xs px-2 py-1';
      case 'md': return 'text-sm px-3 py-1.5';
      case 'lg': return 'text-base px-4 py-2';
      default: return 'text-xs px-2 py-1';
    }
  };

  const getShapeClasses = (shape: string) => {
    switch (shape) {
      case 'pill': return 'rounded-full';
      case 'square': return 'rounded-none';
      case 'rounded': return 'rounded-md';
      default: return 'rounded-md';
    }
  };

  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'success': return 'bg-green-100 text-green-800 border-green-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'error': return 'bg-red-100 text-red-800 border-red-300';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'default': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div
      onClick={onSelect}
      className={cn(
        'inline-block cursor-pointer transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2'
      )}
    >
      <span
        className={cn(
          'inline-flex items-center font-medium border transition-all duration-200',
          getSizeClasses(size),
          getShapeClasses(shape),
          getVariantClasses(variant)
        )}
      >
        {text}
      </span>
    </div>
  );
};

export default BadgeInlineBlock;
