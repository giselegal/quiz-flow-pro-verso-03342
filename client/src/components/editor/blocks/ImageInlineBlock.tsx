
import React from 'react';
import { cn } from '../../../lib/utils';
import type { BlockComponentProps } from '../../../types/blocks';

const ImageInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  const {
    imageUrl = 'https://via.placeholder.com/400x300?text=Imagem',
    alt = 'Imagem',
    width = 'auto',
    height = 'auto',
    borderRadius = '8px'
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
      <img 
        src={imageUrl}
        alt={alt}
        className="max-w-full h-auto"
        style={{ 
          width: width !== 'auto' ? width : undefined,
          height: height !== 'auto' ? height : undefined,
          borderRadius 
        }}
      />
    </div>
  );
};

export default ImageInlineBlock;
