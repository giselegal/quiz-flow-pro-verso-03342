import React from 'react';
import { InlineEditableText } from './InlineEditableText';
import { Scale } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

const TermsBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = 'Termos e Condições',
    content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  } = block?.properties || {};

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  return (
    <div
      className={`
        py-6 px-4 space-y-4 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <Scale className="w-6 h-6 text-gray-600" />
        <h3 className="text-xl font-bold text-[#432818] text-center">
          <InlineEditableText
            value={title}
            onChange={(value: string) => handlePropertyChange('title', value)}
            className="inline-block"
            placeholder="Título dos termos"
          />
        </h3>
      </div>
      <div className="text-sm text-gray-700 leading-relaxed">
        <InlineEditableText
          value={content}
          onChange={(value: string) => handlePropertyChange('content', value)}
          className="inline-block w-full"
          placeholder="Conteúdo dos termos e condições"
        />
      </div>
    </div>
  );
};

export default TermsBlock;
