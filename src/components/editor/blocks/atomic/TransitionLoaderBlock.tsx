import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function TransitionLoaderBlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  const color = block.content?.color || '#5b4135';
  const size = block.content?.size || 'md';

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div
      className={`flex gap-2 justify-center items-center py-8 ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size as keyof typeof sizeClasses]} rounded-full animate-pulse`}
          style={{
            backgroundColor: color,
            animationDelay: `${i * 0.15}s`
          }}
        />
      ))}
    </div>
  );
}
