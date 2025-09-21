/**
 * 🎯 HEADLINE BLOCK - Componente de título
 */

import React from 'react';
import { Block } from '@/types/editor';

interface HeadlineBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview: boolean;
  onUpdateContent: (content: any) => void;
  onUpdateProperties: (properties: any) => void;
  showEditControls?: boolean;
}

const HeadlineBlock: React.FC<HeadlineBlockProps> = ({
  block,
  isSelected
}) => {
  const { content = {}, properties = {} } = block;
  
  const level = content.level || 1;
  const text = content.text || content.title || 'Título';
  const subtitle = content.subtitle;
  const align = content.align || properties.textAlign || 'left';
  
  const HeadingTag = `h${Math.min(Math.max(level, 1), 6)}` as keyof JSX.IntrinsicElements;
  
  const headingClasses = `
    ${level === 1 ? 'text-4xl font-bold' : ''}
    ${level === 2 ? 'text-3xl font-semibold' : ''}
    ${level === 3 ? 'text-2xl font-semibold' : ''}
    ${level === 4 ? 'text-xl font-medium' : ''}
    ${level === 5 ? 'text-lg font-medium' : ''}
    ${level === 6 ? 'text-base font-medium' : ''}
    ${align === 'center' ? 'text-center' : ''}
    ${align === 'right' ? 'text-right' : ''}
    ${align === 'left' ? 'text-left' : ''}
    text-gray-900 mb-2
  `;

  return (
    <div className={`headline-block ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''} rounded-lg p-2`}>
      <HeadingTag className={headingClasses}>
        {text}
      </HeadingTag>
      {subtitle && (
        <p className={`text-gray-600 ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default HeadlineBlock;