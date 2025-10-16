/**
 * 🎯 TRANSITION MESSAGE BLOCK - Bloco Atômico
 * Mensagem adicional/secundária para telas de transição
 */

import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { cn } from '@/lib/utils';

export default function TransitionMessageBlock({
  block,
  isSelected = false,
  isEditable = false,
  onUpdate,
}: AtomicBlockProps) {
  const text = block.content?.text || 'Isso levará apenas alguns segundos...';
  const variant = block.content?.variant || 'default';
  
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
          "w-full text-sm text-center bg-transparent border-none outline-none",
          variant === 'muted' && "text-muted-foreground",
          variant === 'accent' && "text-accent-foreground",
          isSelected && "ring-2 ring-primary ring-offset-2 rounded px-2"
        )}
      />
    );
  }

  return (
    <p 
      className={cn(
        "text-sm text-center",
        variant === 'muted' && "text-muted-foreground",
        variant === 'accent' && "text-accent-foreground",
        isSelected && "ring-2 ring-primary ring-offset-2 rounded px-2"
      )}
    >
      {text}
    </p>
  );
}
