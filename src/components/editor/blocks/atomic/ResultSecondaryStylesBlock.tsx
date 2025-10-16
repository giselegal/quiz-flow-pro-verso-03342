import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function ResultSecondaryStylesBlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  const styles = block.content?.styles || [];
  const backgroundColor = block.properties?.backgroundColor || '#FFFFFF';
  const borderColor = block.properties?.borderColor || '#E5D5C3';

  if (styles.length === 0) return null;

  return (
    <div 
      className={`mb-6 ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold mb-4" style={{ color: '#5b4135' }}>
        Outros estilos compatíveis:
      </h3>
      <div className="grid gap-3">
        {styles.map((style: any, index: number) => (
          <div
            key={index}
            className="p-4 rounded-lg border-2 transition-all"
            style={{ 
              backgroundColor,
              borderColor
            }}
          >
            <div className="font-medium" style={{ color: '#5b4135' }}>
              {style.name}
            </div>
            <div className="text-sm" style={{ color: '#8F7A6A' }}>
              {style.percentage} compatibilidade
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
