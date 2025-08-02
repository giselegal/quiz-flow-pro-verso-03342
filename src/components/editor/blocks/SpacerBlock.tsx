import React from 'react';
import { Block } from '@/types/editor';
import { EditableContent } from '@/types/editor';

interface SpacerBlockProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  onUpdate?: (content: Partial<EditableContent>) => void;
}

const SpacerBlock: React.FC<SpacerBlockProps> = ({ 
  block, 
  isSelected, 
  onClick, 
  onUpdate 
}) => {
  const content = block.content as EditableContent;
  const height = content.height || 40;
  
  // Convert height to string for style
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  const handleHeightChange = (newHeight: number) => {
    if (onUpdate) {
      onUpdate({ height: newHeight }); // Keep as number for consistency
    }
  };

  return (
    <div
      className={`w-full bg-gray-100 border-2 border-dashed border-gray-300 relative group cursor-pointer ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
      }`}
      style={{ height: heightStyle }}
      onClick={onClick}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm text-gray-500 font-medium">
          Espaçador ({heightStyle})
        </span>
      </div>
      
      {isSelected && onUpdate && (
        <div className="absolute top-2 right-2 bg-white p-2 rounded shadow-lg border">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Altura (px)
          </label>
          <input
            type="number"
            value={typeof height === 'number' ? height : parseInt(height.replace('px', '')) || 40}
            onChange={(e) => handleHeightChange(parseInt(e.target.value) || 40)}
            className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
            min="10"
            max="500"
          />
        </div>
      )}
    </div>
  );
};

export default SpacerBlock;
