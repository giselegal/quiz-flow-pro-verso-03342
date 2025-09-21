/**
 * 📝 TEXT BLOCK - Componente de texto
 */

import React from 'react';
import { Block } from '@/types/editor';

interface TextBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview: boolean;
  onUpdateContent: (content: any) => void;
  onUpdateProperties: (properties: any) => void;
  showEditControls?: boolean;
}

const TextBlock: React.FC<TextBlockProps> = ({
  block,
  isSelected
}) => {
  const { content = {}, properties = {} } = block;
  
  const text = content.text || 'Digite seu texto aqui...';
  const align = content.textAlign || properties.textAlign || 'left';
  const fontSize = properties.fontSize || 'text-base';
  
  const textClasses = `
    ${fontSize}
    ${align === 'center' ? 'text-center' : ''}
    ${align === 'right' ? 'text-right' : ''}
    ${align === 'left' ? 'text-left' : ''}
    text-gray-700 leading-relaxed
  `;

  return (
    <div className={`text-block ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''} rounded-lg p-2`}>
      <div className={textClasses}>
        {text}
      </div>
    </div>
  );
};

export default TextBlock;