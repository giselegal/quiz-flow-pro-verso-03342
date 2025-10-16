import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function ResultCharacteristicsBlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  const characteristics = block.content?.items || [];
  const icon = block.properties?.icon || '✓';
  const iconColor = block.properties?.iconColor || '#B89B7A';
  const textColor = block.properties?.textColor || '#5b4135';

  if (characteristics.length === 0) return null;

  return (
    <div 
      className={`mb-6 ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <ul className="space-y-3">
        {characteristics.map((item: any, index: number) => {
          const text = typeof item === 'string' ? item : item.text || item.question || '';
          return (
            <li key={index} className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0" style={{ color: iconColor }}>
                {icon}
              </span>
              <span className="text-base" style={{ color: textColor }}>
                {text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
