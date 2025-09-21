/**
 * 🖼️ IMAGE BLOCK - Componente de imagem
 */

import React from 'react';
import { Block } from '@/types/editor';

interface ImageBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview: boolean;
  onUpdateContent: (content: any) => void;
  onUpdateProperties: (properties: any) => void;
  showEditControls?: boolean;
}

const ImageBlock: React.FC<ImageBlockProps> = ({
  block,
  isSelected
}) => {
  const { content = {}, properties = {} } = block;
  
  const src = content.src || content.url || 'https://via.placeholder.com/400x300';
  const alt = content.alt || 'Imagem';
  const maxWidth = properties.maxWidth || 'full';
  const rounded = properties.rounded || 'rounded-lg';
  
  const imageClasses = `
    ${maxWidth === 'sm' ? 'max-w-sm' : ''}
    ${maxWidth === 'md' ? 'max-w-md' : ''}
    ${maxWidth === 'lg' ? 'max-w-lg' : ''}
    ${maxWidth === 'xl' ? 'max-w-xl' : ''}
    ${maxWidth === 'full' ? 'w-full' : ''}
    ${rounded}
  `;

  return (
    <div className={`image-block ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''} rounded-lg p-2`}>
      <img 
        src={src}
        alt={alt}
        className={imageClasses}
      />
    </div>
  );
};

export default ImageBlock;