/**
 * 🎯 RESULT CHARACTERISTICS BLOCK - Bloco Atômico
 * Características principais do resultado (bullet points)
 */

import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ResultCharacteristicsBlock({
  block,
  isSelected = false,
  isEditable = false,
  onUpdate,
}: AtomicBlockProps) {
  const characteristics = block.content?.characteristics || [
    'Característica 1',
    'Característica 2',
    'Característica 3',
  ];
  
  const handleEdit = (index: number, newValue: string) => {
    if (onUpdate) {
      const newCharacteristics = [...characteristics];
      newCharacteristics[index] = newValue;
      onUpdate({
        content: {
          ...block.content,
          characteristics: newCharacteristics,
        },
      });
    }
  };

  const handleAdd = () => {
    if (onUpdate) {
      onUpdate({
        content: {
          ...block.content,
          characteristics: [...characteristics, 'Nova característica'],
        },
      });
    }
  };

  const handleRemove = (index: number) => {
    if (onUpdate) {
      const newCharacteristics = characteristics.filter((_: any, i: number) => i !== index);
      onUpdate({
        content: {
          ...block.content,
          characteristics: newCharacteristics,
        },
      });
    }
  };

  return (
    <div 
      className={cn(
        "space-y-3 py-4",
        isSelected && "ring-2 ring-primary ring-offset-2 rounded px-4"
      )}
    >
      <h3 className="font-semibold text-lg">Características Principais</h3>
      <ul className="space-y-2">
        {characteristics.map((char: string, index: number) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            {isEditable ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={char}
                  onChange={(e) => handleEdit(index, e.target.value)}
                  className="flex-1 bg-transparent border-b border-muted outline-none"
                />
                <button
                  onClick={() => handleRemove(index)}
                  className="text-xs text-destructive hover:underline"
                >
                  Remover
                </button>
              </div>
            ) : (
              <span>{char}</span>
            )}
          </li>
        ))}
      </ul>
      {isEditable && (
        <button
          onClick={handleAdd}
          className="text-sm text-primary hover:underline"
        >
          + Adicionar característica
        </button>
      )}
    </div>
  );
}
