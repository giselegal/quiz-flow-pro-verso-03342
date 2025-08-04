import React from 'react';
import { InlineEditableText } from './InlineEditableText';
import { List } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

const ListBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    listType = 'ul',
    items = [{ text: 'Primeiro item da lista' }, { text: 'Segundo item da lista' }, { text: 'Terceiro item da lista' }],
  } = block.properties;

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const ListTag = listType === 'ol' ? 'ol' : 'ul';

  if (!items || items.length === 0) {
    return (
      <div
        className={`
          bg-gray-100 p-8 rounded-lg text-gray-500 flex flex-col items-center justify-center min-h-[100px] cursor-pointer transition-all duration-200
          ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
          ${className}
        `}
        onClick={onClick}
        data-block-id={block.id}
        data-block-type={block.type}
      >
        <List className="w-8 h-8 mb-2 opacity-50" />
        <p>Configure os itens da lista no painel de propriedades.</p>
      </div>
    );
  }

  return (
    <div
      className={`
        py-4 px-4 cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <ListTag className={`space-y-2 text-[#432818] ${listType === 'ul' ? 'list-disc' : 'list-decimal'} list-inside`}>
        {(items || []).map((item: any, index: number) => (
          <li key={index} className="leading-relaxed">
            {item.text}
          </li>
        ))}
      </ListTag>
    </div>
  );
};

export default ListBlock;
