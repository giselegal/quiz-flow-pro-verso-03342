
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { BlockComponentProps } from '@/types/blocks';

const CTAInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  const {
    title = 'Chamada para Ação',
    description = 'Descrição da oferta ou benefício',
    buttonText = 'Clique Aqui',
    buttonUrl = '#',
    backgroundColor = '#B89B7A',
    textColor = '#ffffff'
  } = block.properties;

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
    >
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold" style={{ color: textColor }}>
          {title}
        </h3>
        
        <p className="text-sm opacity-80" style={{ color: textColor }}>
          {description}
        </p>
        
        <Button 
          size="lg"
          className="px-8 py-3"
          style={{ 
            backgroundColor,
            color: textColor,
            border: 'none'
          }}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default CTAInlineBlock;
