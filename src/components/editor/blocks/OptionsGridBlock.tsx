import React from 'react';
import type { BlockComponentProps } from '@/types/blocks';

interface Option {
  id: string;
  text: string;
  imageUrl?: string;
}

interface OptionsGridBlockProps extends BlockComponentProps {
  properties: {
    question?: string;
    options?: Option[];
    columns?: number;
    selectedOption?: string;
  };
}

const OptionsGridBlock: React.FC<OptionsGridBlockProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  const {
    question = 'Escolha uma opção',
    options = [],
    columns = 2,
    selectedOption
  } = block.properties;

  const handleOptionSelect = (optionId: string) => {
    if (onPropertyChange) {
      onPropertyChange('selectedOption', optionId);
    }
  };

  return (
    <div
      className={`
        py-8 px-4 cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'ring-1 ring-gray-400/40 bg-gray-50/30' 
          : 'hover:shadow-sm'
        }
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-[#432818]">
          {question}
        </h2>
        
        <div className={`grid gap-4 ${
          columns === 1 ? 'grid-cols-1' :
          columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {(options || []).map((opt: any) => (
            <div
              key={opt.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => handleOptionSelect(opt.id)}
            >
              {opt.imageUrl && (
                <img 
                  src={opt.imageUrl} 
                  alt={opt.text}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
              )}
              <p className="text-center text-[#432818] font-medium">
                {opt.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OptionsGridBlock;
