
import React from 'react';
import { Block } from '../../../types/editor';

interface Option {
  id: string;
  text: string;
  value: string;
  imageUrl?: string;
  category?: string;
}

interface OptionsGridBlockProps {
  block: Block;
  isSelected?: boolean;
  onSelect?: () => void;
  isPreview?: boolean;
}

const OptionsGridBlock: React.FC<OptionsGridBlockProps> = ({
  block,
  isSelected,
  onSelect,
  isPreview = false
}) => {
  // Acessar propriedades corretas do bloco
  const properties = block.properties || {};
  const content = block.content || {};
  
  const options: Option[] = properties.options || content.options || [];
  const columns = properties.columns || content.columns || 2;
  const showImages = properties.showImages !== undefined ? properties.showImages : true;
  const multipleSelection = properties.multipleSelection || false;
  const maxSelections = properties.maxSelections || 1;
  
  // Grid responsivo baseado no número de colunas
  const getGridClasses = (cols: number) => {
    switch (cols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2';
    }
  };

  // Se não há opções, mostrar placeholder
  if (!options || options.length === 0) {
    return (
      <div 
        className={`p-4 ${
          isSelected && !isPreview ? 'ring-2 ring-[#B89B7A] bg-[#FAF9F7]' : ''
        }`}
        onClick={onSelect}
      >
        <div className="text-center text-gray-500 py-8">
          <p>Configure as opções nas propriedades do bloco</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`p-4 ${
        isSelected && !isPreview ? 'ring-2 ring-[#B89B7A] bg-[#FAF9F7]' : ''
      }`}
      onClick={onSelect}
    >
      <div className={`grid ${getGridClasses(columns)} gap-4`}>
        {options.map((option, index) => (
          <div
            key={option.id || index}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            {showImages && option.imageUrl && (
              <div className="mb-3">
                <img 
                  src={option.imageUrl} 
                  alt={option.text}
                  className="w-full h-40 object-cover rounded-md"
                />
              </div>
            )}
            <div className="text-sm font-medium text-gray-900">
              {option.text}
            </div>
            {option.category && (
              <div className="text-xs text-gray-500 mt-1">
                {option.category}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Informações de configuração no editor */}
      {!isPreview && (
        <div className="mt-4 text-xs text-gray-500 border-t pt-2">
          <p>✓ {options.length} opções configuradas</p>
          <p>✓ {multipleSelection ? `Múltipla seleção (máx: ${maxSelections})` : 'Seleção única'}</p>
          <p>✓ {showImages ? 'Com imagens' : 'Apenas texto'}</p>
        </div>
      )}
    </div>
  );
};

export default OptionsGridBlock;
