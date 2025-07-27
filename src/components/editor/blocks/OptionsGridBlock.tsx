
import React from 'react';
import { Block } from '@/types/editor';

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
  const columns = block.content?.columns || 2;
  const gap = block.content?.gap || 'medium';
  const items = block.content?.items || [
    'Opção 1',
    'Opção 2',
    'Opção 3',
    'Opção 4'
  ];

  const gapClasses = {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6'
  };

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div 
      className={`p-4 ${
        isSelected && !isPreview ? 'ring-2 ring-[#B89B7A] bg-[#FAF9F7]' : ''
      }`}
      onClick={onSelect}
    >
      <div className={`grid ${gridClasses[columns]} ${gapClasses[gap]}`}>
        {items.map((item, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg border border-[#B89B7A]/20 hover:border-[#B89B7A] transition-colors cursor-pointer"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-[#FAF9F7] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-[#B89B7A] font-medium">{index + 1}</span>
              </div>
              <p className="text-sm font-medium text-[#432818]">{item}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionsGridBlock;
