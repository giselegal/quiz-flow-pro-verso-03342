// UniversalBlockRenderer.tsx
// Delegates block rendering to the centralized BlockRegistry renderer.
// import { UniversalBlockRenderer as RegistryRenderer } from './BlockRegistry';

// export default RegistryRenderer;
import React from 'react';
import { EditorBlock } from '@/types/editor';
import { getBlockComponent } from './BlockRegistry';

export interface BlockRendererProps {
  block: EditorBlock;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<EditorBlock>) => void;
  onDelete: () => void;
  isPreview?: boolean;
}

export const UniversalBlockRenderer: React.FC<BlockRendererProps> = ({
  block, isSelected, onSelect, onUpdate, onDelete, isPreview
}) => {
  // Retorno padrão usando renderBlock
  // Atualiza propriedades do bloco
  const handleContentUpdate = (key: string, value: any) => {
    onUpdate({ content: { ...block.content, [key]: value } });
  };

  const toPascal = (s: string) =>
    s.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  
  // Usando o registro de blocos importado
  const Dynamic = getBlockComponent(block.type);

  if (!Dynamic) {
    return null;
  }

  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50'
          : 'hover:bg-gray-50'
      } ${isPreview ? '' : 'border border-transparent hover:border-gray-200 rounded-lg p-2'}`}
    >
      <Dynamic
        block={block}
        isSelected={isSelected}
        onClick={onSelect}
        onPropertyChange={(key, value) =>
          onUpdate({ content: { ...block.content, [key]: value } })
        }
      />
      {!isPreview && isSelected && (
        <button
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 text-red-500"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default UniversalBlockRenderer;
