
import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

const HeadingInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  const {
    text = 'Título',
    level = 2,
    textAlign = 'left',
    textColor = '#432818',
    fontSize = 'xl'
  } = block.properties;

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  const sizeClasses = {
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl'
  };

  return (
    <div 
      className={cn(
        'p-2 rounded cursor-pointer transition-all duration-200',
        isSelected 
          ? 'border-2 border-blue-500 bg-blue-50' 
          : 'border-2 border-dashed border-transparent hover:bg-gray-50',
        className
      )}
      onClick={onClick}
    >
      <HeadingTag 
        className={cn(
          'font-bold',
          sizeClasses[fontSize as keyof typeof sizeClasses] || sizeClasses.xl,
          textAlign === 'center' && 'text-center',
          textAlign === 'right' && 'text-right'
        )}
        style={{ color: textColor }}
      >
        {text}
      </HeadingTag>
    </div>
  );
};

export default HeadingInlineBlock;
