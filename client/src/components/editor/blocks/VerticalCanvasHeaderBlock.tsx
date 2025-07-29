
import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

const VerticalCanvasHeaderBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  const {
    title = 'Título do Header',
    subtitle = 'Subtítulo opcional',
    backgroundColor = '#ffffff',
    textColor = '#432818',
    showLogo = true,
    logoUrl = 'https://via.placeholder.com/150x50?text=Logo'
  } = block.properties;

  return (
    <div 
      className={cn(
        'w-full p-6 rounded-lg cursor-pointer transition-all duration-200',
        isSelected 
          ? 'border-2 border-blue-500 bg-blue-50' 
          : 'border-2 border-dashed border-gray-300 hover:bg-gray-50',
        className
      )}
      onClick={onClick}
      style={{ backgroundColor, color: textColor }}
    >
      <div className="text-center space-y-4">
        {showLogo && logoUrl && (
          <div className="flex justify-center mb-4">
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="h-12 w-auto"
            />
          </div>
        )}
        
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: textColor }}>
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-lg opacity-80" style={{ color: textColor }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerticalCanvasHeaderBlock;
