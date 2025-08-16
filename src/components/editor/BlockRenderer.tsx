import React from 'react';
import { Block } from '@/types/editor';

interface BlockRendererProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isSelected,
  onClick,
}) => {

  const renderBlockContent = () => {
    switch (block.type) {
      case 'headline':
        return (
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              {block.content?.title || 'Novo Título'}
            </h1>
            {block.content?.subtitle && (
              <p className="text-lg text-muted-foreground">
                {block.content.subtitle}
              </p>
            )}
          </div>
        );
      
      case 'text':
        return (
          <div className="prose">
            <p>{block.content?.text || 'Novo texto'}</p>
          </div>
        );
      
      case 'image':
        return (
          <div className="space-y-2">
            {block.content?.imageUrl ? (
              <img 
                src={block.content.imageUrl} 
                alt={block.content?.imageAlt || 'Imagem'}
                className="max-w-full h-auto rounded-lg"
              />
            ) : (
              <div className="bg-muted rounded-lg p-8 text-center">
                <p className="text-muted-foreground">Adicionar imagem</p>
              </div>
            )}
            {block.content?.caption && (
              <p className="text-sm text-muted-foreground text-center">
                {block.content.caption}
              </p>
            )}
          </div>
        );
      
      case 'button':
        return (
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
            {block.content?.text || 'Botão'}
          </button>
        );
      
      default:
        return (
          <div className="bg-muted rounded p-4">
            <p className="text-sm text-muted-foreground">
              Bloco {block.type} (ID: {block.id})
            </p>
          </div>
        );
    }
  };

  return (
    <div
      className={`block-renderer ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      } ${onClick ? 'cursor-pointer' : ''} p-2 rounded-md transition-all`}
      onClick={onClick}
    >
      {renderBlockContent()}
    </div>
  );
};

export default BlockRenderer;