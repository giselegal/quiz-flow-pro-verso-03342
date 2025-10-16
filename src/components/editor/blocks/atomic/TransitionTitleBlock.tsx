/**
 * 🎯 TRANSITION TITLE BLOCK - Bloco Atômico
 * Título para telas de transição
 */

import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { cn } from '@/lib/utils';

export default function TransitionTitleBlock({
  block,
  isSelected = false,
  isEditable = false,
  onUpdate,
}: AtomicBlockProps) {
  const text = block.content?.text || 'Preparando sua experiência...';
  const align = block.content?.align || 'center';
  
  const handleEdit = (newText: string) => {
    if (onUpdate) {
      onUpdate({
        content: {
          ...block.content,
          text: newText,
        },
      });
    }
  };

  if (isEditable) {
    return (
      <input
        type="text"
        value={text}
        onChange={(e) => handleEdit(e.target.value)}
        className={cn(
          "w-full text-2xl font-bold bg-transparent border-none outline-none",
          align === 'center' && "text-center",
          align === 'left' && "text-left",
          align === 'right' && "text-right",
          isSelected && "ring-2 ring-primary ring-offset-2 rounded px-2"
        )}
      />
    );
  }

  return (
    <h2 
      className={cn(
        "text-2xl font-bold",
        align === 'center' && "text-center",
        align === 'left' && "text-left",
        align === 'right' && "text-right",
        isSelected && "ring-2 ring-primary ring-offset-2 rounded px-2"
      )}
    >
      {text}
    </h2>
  );
}
