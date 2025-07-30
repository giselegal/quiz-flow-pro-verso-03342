import React from 'react';
import { cn } from '../../../lib/utils';
import type { BlockComponentProps } from '../../../types/blocks';

const TextInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  const {
    text = 'Texto de exemplo',
    content = 'Texto de exemplo',
    fontSize = 'base',
    textAlign = 'left',
    textColor = '#374151',
    fontWeight = 'normal',
    backgroundColor = 'transparent'
  } = block.properties;

  const displayText = text || content;

  const sizeClasses = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  };

  const alignClasses = {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right'
  };

  const weightClasses = {
    'light': 'font-light',
    'normal': 'font-normal',
    'medium': 'font-medium',
    'semibold': 'font-semibold',
    'bold': 'font-bold'
  };

  return (
    <div 
      className={cn(
        'p-4 rounded-lg cursor-pointer transition-all duration-200',
        isSelected 
          ? 'border-2 border-blue-500 bg-blue-50' 
          : 'border-2 border-dashed border-gray-300 hover:bg-gray-50',
        className
      )}
      onClick={onClick}
      style={{ backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : undefined }}
    >
      <p 
        className={cn(
          sizeClasses[fontSize as keyof typeof sizeClasses] || 'text-base',
          alignClasses[textAlign as keyof typeof alignClasses] || 'text-left',
          weightClasses[fontWeight as keyof typeof weightClasses] || 'font-normal',
          'transition-colors duration-200'
        )}
        style={{ color: textColor }}
      >
        {displayText}
      </p>
    </div>
  );
};

export default TextInlineBlock;
