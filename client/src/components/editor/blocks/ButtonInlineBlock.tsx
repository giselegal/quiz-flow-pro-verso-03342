
import React from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import type { BlockComponentProps } from '../../../types/blocks';

const ButtonInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  const {
    text = 'Clique Aqui',
    variant = 'default',
    size = 'default',
    backgroundColor = '#B89B7A',
    textColor = '#ffffff',
    fullWidth = false
  } = block.properties;

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
      <Button 
        variant={variant as any}
        size={size as any}
        className={cn(
          'transition-all duration-200',
          fullWidth && 'w-full'
        )}
        style={{ 
          backgroundColor,
          color: textColor,
          border: 'none'
        }}
      >
        {text}
      </Button>
    </div>
  );
};

export default ButtonInlineBlock;
