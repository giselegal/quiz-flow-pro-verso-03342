/**
 * 🎯 RESULT SECONDARY STYLES BLOCK - Bloco Atômico
 * Estilos secundários compatíveis
 */

import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function ResultSecondaryStylesBlock({
  block,
  isSelected = false,
  isEditable = false,
  onUpdate,
}: AtomicBlockProps) {
  const secondaryStyles = block.content?.secondaryStyles || [
    'Estilo Complementar 1',
    'Estilo Complementar 2',
  ];
  
  const handleEdit = (index: number, newValue: string) => {
    if (onUpdate) {
      const newStyles = [...secondaryStyles];
      newStyles[index] = newValue;
      onUpdate({
        content: {
          ...block.content,
          secondaryStyles: newStyles,
        },
      });
    }
  };

  const handleAdd = () => {
    if (onUpdate) {
      onUpdate({
        content: {
          ...block.content,
          secondaryStyles: [...secondaryStyles, 'Novo estilo'],
        },
      });
    }
  };

  const handleRemove = (index: number) => {
    if (onUpdate) {
      const newStyles = secondaryStyles.filter((_: any, i: number) => i !== index);
      onUpdate({
        content: {
          ...block.content,
          secondaryStyles: newStyles,
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
      <h3 className="font-semibold">Estilos Compatíveis</h3>
      <div className="flex flex-wrap gap-2">
        {secondaryStyles.map((style: string, index: number) => (
          <div key={index} className="relative group">
            {isEditable ? (
              <input
                type="text"
                value={style}
                onChange={(e) => handleEdit(index, e.target.value)}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm border border-muted outline-none"
              />
            ) : (
              <Badge variant="secondary">{style}</Badge>
            )}
            {isEditable && (
              <button
                onClick={() => handleRemove(index)}
                className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            )}
          </div>
        ))}
        {isEditable && (
          <button
            onClick={handleAdd}
            className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm hover:bg-muted/80"
          >
            + Adicionar
          </button>
        )}
      </div>
    </div>
  );
}
