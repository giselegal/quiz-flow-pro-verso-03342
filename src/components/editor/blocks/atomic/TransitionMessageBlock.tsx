import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function TransitionMessageBlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  const emoji = block.content?.emoji || '✨';
  const message = block.content?.text || '';
  const backgroundColor = block.properties?.backgroundColor || '#F5EDE4';
  const textColor = block.properties?.textColor || '#5b4135';
  const borderRadius = block.properties?.borderRadius || '12px';

  return (
    <div
      className={`p-6 mt-6 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={{ 
        backgroundColor,
        borderRadius
      }}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{emoji}</span>
        <p className="text-lg" style={{ color: textColor }}>
          {message}
        </p>
      </div>
    </div>
  );
}
