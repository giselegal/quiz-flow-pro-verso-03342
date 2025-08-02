
import React from 'react';
import { Block } from '@/types/editor';

interface PreviewBlockProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  viewMode?: 'desktop' | 'mobile';
  isPreview?: boolean;
}

export const PreviewBlock: React.FC<PreviewBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  viewMode = 'desktop',
  isPreview = false
}) => {
  const baseClasses = `
    relative transition-all duration-200 cursor-pointer
    ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:shadow-md'}
    ${isPreview ? 'pointer-events-none' : ''}
  `;

  const renderBlockContent = () => {
    switch (block.type) {
      case 'headline':
        return (
          <div className="headline-block p-4 text-center">
            <h2 className="text-2xl font-bold">{block.content?.title || 'Headline'}</h2>
          </div>
        );
      
      case 'text':
        return (
          <div className="text-block p-4">
            <p>{block.content?.text || 'Texto do bloco'}</p>
          </div>
        );
      
      case 'header':
        return (
          <div className="header-block p-4 text-center">
            <h1 className="text-3xl font-bold">{block.content?.title || 'Cabeçalho'}</h1>
            {block.content?.subtitle && (
              <p className="text-gray-600 mt-2">{block.content.subtitle}</p>
            )}
          </div>
        );
      
      case 'benefits':
        // Ensure items is a string array for benefits
        const items = Array.isArray(block.content?.items) 
          ? block.content.items.filter((item): item is string => typeof item === 'string')
          : [];
        
        return (
          <div className="benefits-block p-4">
            <h3 className="font-medium mb-2">{block.content?.title || 'Benefícios'}</h3>
            <ul className="list-disc list-inside">
              {items.map((item, index) => (
                <li key={index} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>
        );
      
      default:
        return (
          <div className="p-8 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-500">Tipo de bloco não suportado: {block.type}</p>
          </div>
        );
    }
  };

  return (
    <div className={baseClasses} onClick={onClick}>
      {renderBlockContent()}
    </div>
  );
};
