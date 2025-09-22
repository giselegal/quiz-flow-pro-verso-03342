import type { BlockComponentProps } from '@/types/blocks';
import React from 'react';

/**
 * 📄 SimpleTextBlock - Versão simples para o ModularV1Editor
 */
const SimpleTextBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  const textContent = block?.content?.text || 'Texto vazio';

  return (
    <div
      className={`
        py-2 px-2 cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-1 ring-blue-400 bg-blue-50/30' : 'hover:bg-gray-50/50'}
        ${className}
      `}
      onClick={onClick}
    >
      <div 
        dangerouslySetInnerHTML={{ __html: textContent }}
        style={{ 
          color: block.properties?.color,
          fontSize: block.properties?.fontSize,
          textAlign: block.properties?.textAlign || 'left'
        }}
      />
    </div>
  );
};

export default SimpleTextBlock;