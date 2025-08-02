
import React from 'react';
import { BlockComponentProps } from '@/types/blocks';

const ImageBlock: React.FC<BlockComponentProps> = ({ block, className = '' }) => {
  return (
    <div className={`image-block ${className}`}>
      <img 
        src={block.properties?.src || '/placeholder.jpg'} 
        alt={block.properties?.alt || 'Image'} 
        className="w-full h-auto"
      />
    </div>
  );
};

export default ImageBlock;
