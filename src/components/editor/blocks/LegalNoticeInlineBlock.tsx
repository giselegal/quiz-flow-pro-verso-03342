import React from 'react';
import type { BlockComponentProps } from '@/types/blocks';

const LegalNoticeInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = 'Aviso Legal',
    content = 'Este é um aviso legal padrão.',
    backgroundColor = '#f8f9fa',
    textColor = '#6c757d',
  } = block?.properties || {};

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  // Split content into parts for rendering
  const parts = content.split('\n').filter((part: string) => part.trim());

  return (
    <div
      className={`
        py-6 px-4 cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
        ${className}
      `}
      style={{ backgroundColor }}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-sm font-semibold mb-4" style={{ color: textColor }}>
          {title}
        </h3>
        <div className="text-xs space-y-2" style={{ color: textColor }}>
          {parts.map((part: string, index: number) => (
            <p key={index}>{part}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalNoticeInlineBlock;
