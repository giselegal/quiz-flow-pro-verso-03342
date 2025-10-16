/**
 * 🎯 RESULT DESCRIPTION BLOCK - Bloco Atômico
 * Descrição detalhada do resultado
 */

import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { cn } from '@/lib/utils';

export default function ResultDescriptionBlock({
  block,
  isSelected = false,
  isEditable = false,
  onUpdate,
}: AtomicBlockProps) {
  const description = block.content?.description || 'Descrição detalhada do seu resultado...';
  
  const handleEdit = (newDescription: string) => {
    if (onUpdate) {
      onUpdate({
        content: {
          ...block.content,
          description: newDescription,
        },
      });
    }
  };

  if (isEditable) {
    return (
      <textarea
        value={description}
        onChange={(e) => handleEdit(e.target.value)}
        rows={6}
        className={cn(
          "w-full bg-transparent border border-muted rounded-md p-4 outline-none resize-none",
          isSelected && "ring-2 ring-primary ring-offset-2"
        )}
      />
    );
  }

  return (
    <div 
      className={cn(
        "prose prose-sm max-w-none",
        isSelected && "ring-2 ring-primary ring-offset-2 rounded px-4"
      )}
    >
      <p>{description}</p>
    </div>
  );
}
