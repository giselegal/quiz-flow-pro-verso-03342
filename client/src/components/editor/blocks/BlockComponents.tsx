
import React from 'react';
import { Block } from '@/types/editor';

interface BlockComponentProps {
  block: Block;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: any) => void;
  onSelect?: () => void;
  className?: string;
}

export const BlockComponents: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  className
}) => {
  const commonProps = {
    content: block.content,
    isSelected,
    isEditing,
    onUpdate,
    onSelect,
    className
  };

  switch (block.type) {
    case 'text':
      return (
        <div className={className} onClick={onSelect}>
          <p>{block.content?.text || 'Texto vazio'}</p>
        </div>
      );
      
    case 'header':
      return (
        <div className={className} onClick={onSelect}>
          <h2>{block.content?.text || 'Cabeçalho'}</h2>
        </div>
      );
      
    case 'image':
      return (
        <div className={className} onClick={onSelect}>
          <img src={block.content?.url || '/placeholder.jpg'} alt={block.content?.alt || 'Imagem'} />
        </div>
      );
      
    case 'button':
      return (
        <div className={className} onClick={onSelect}>
          <button>{block.content?.text || 'Botão'}</button>
        </div>
      );
      
    default:
      return (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
          Componente não implementado: {block.type}
        </div>
      );
  }
};

export default BlockComponents;
