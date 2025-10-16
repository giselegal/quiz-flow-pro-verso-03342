import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function TransitionProgressBlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  const progress = block.properties?.progress || 70;
  const color = block.properties?.color || '#B89B7A';
  const backgroundColor = block.properties?.backgroundColor || '#F5EDE4';
  const height = block.properties?.height || '8px';

  return (
    <div 
      className={`w-full mb-6 ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <div 
        className="w-full rounded-full overflow-hidden"
        style={{ backgroundColor, height }}
      >
        <div
          className="h-full transition-all duration-500 rounded-full"
          style={{ 
            width: `${progress}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
}
