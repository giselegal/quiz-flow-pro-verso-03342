/**
 * 🔘 BUTTON BLOCK - Componente de botão
 */

import React from 'react';
import { Block } from '@/types/editor';

interface ButtonBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview: boolean;
  onUpdateContent: (content: any) => void;
  onUpdateProperties: (properties: any) => void;
  showEditControls?: boolean;
}

const ButtonBlock: React.FC<ButtonBlockProps> = ({
  block,
  isSelected,
  isPreview
}) => {
  const { content = {}, properties = {} } = block;
  
  const text = content.text || content.buttonText || 'Clique aqui';
  const variant = content.variant || properties.variant || 'primary';
  const size = content.size || properties.size || 'md';
  
  const buttonClasses = `
    inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
    ${variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500' : ''}
    ${variant === 'secondary' ? 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500' : ''}
    ${variant === 'outline' ? 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500' : ''}
    ${size === 'sm' ? 'px-3 py-2 text-sm' : ''}
    ${size === 'md' ? 'px-4 py-2 text-base' : ''}
    ${size === 'lg' ? 'px-6 py-3 text-lg' : ''}
  `;

  return (
    <div className={`button-block ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''} rounded-lg p-2`}>
      <button 
        className={buttonClasses}
        disabled={!isPreview}
      >
        {text}
      </button>
    </div>
  );
};

export default ButtonBlock;