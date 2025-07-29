
import React from 'react';
import { cn } from '../../../lib/utils';
import type { BlockComponentProps } from '../../../types/blocks';

const OptionsGridBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  const {
    options = [
      { id: '1', text: 'Opção 1', value: 'option1' },
      { id: '2', text: 'Opção 2', value: 'option2' },
      { id: '3', text: 'Opção 3', value: 'option3' }
    ],
    columns = 2,
    showImages = false
  } = block.properties;

  return (
    <div 
      className={cn(
        'p-4 rounded-lg cursor-pointer transition-all duration-200',
        isSelected 
          ? 'border-2 border-blue-500 bg-blue-50' 
          : 'border-2 border-dashed border-gray-300 hover:bg-gray-50',
        className
      )}
      onClick={onClick}
    >
      <div className={cn(
        'grid gap-3',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-2',
        columns === 3 && 'grid-cols-3',
        columns === 4 && 'grid-cols-4'
      )}>
        {options.map((option: any) => (
          <div
            key={option.id}
            className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            {showImages && option.imageUrl && (
              <img 
                src={option.imageUrl} 
                alt={option.text}
                className="w-full h-20 object-cover rounded mb-2"
              />
            )}
            <p className="text-sm font-medium text-center">{option.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionsGridBlock;
