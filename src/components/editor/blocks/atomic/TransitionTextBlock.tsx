/**
 * 🎯 TRANSITION TEXT BLOCK - Bloco Atômico
 * Texto descritivo para telas de transição
 */

import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { cn } from '@/lib/utils';

export default function TransitionTextBlock({
  block,
  isSelected = false,
  isEditable = false,
  onUpdate,
}: AtomicBlockProps) {
  const text = block.content?.text || 'Aguarde enquanto processamos suas respostas...';
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
      <textarea
        value={text}
        onChange={(e) => handleEdit(e.target.value)}
        rows={3}
        className={cn(
          "w-full text-muted-foreground bg-transparent border-none outline-none resize-none",
          align === 'center' && "text-center",
          align === 'left' && "text-left",
          align === 'right' && "text-right",
          isSelected && "ring-2 ring-primary ring-offset-2 rounded px-2"
        )}
      />
    );
  }

  return (
    <p 
      className={cn(
        "text-muted-foreground",
        align === 'center' && "text-center",
        align === 'left' && "text-left",
        align === 'right' && "text-right",
        isSelected && "ring-2 ring-primary ring-offset-2 rounded px-2"
      )}
    >
      {text}
    </p>
  );
}
