/**
 * 🎯 TRANSITION LOADER BLOCK - Bloco Atômico
 * Spinner/loader animado para telas de transição
 */

import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TransitionLoaderBlock({
  block,
  isSelected = false,
  onUpdate,
}: AtomicBlockProps) {
  const size = block.content?.size || 'medium';
  const color = block.content?.color || 'primary';
  
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  return (
    <div 
      className={cn(
        "flex justify-center py-8",
        isSelected && "ring-2 ring-primary ring-offset-2 rounded"
      )}
    >
      <Loader2 
        className={cn(
          "animate-spin",
          sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.medium,
          color === 'primary' && "text-primary",
          color === 'accent' && "text-accent",
          color === 'muted' && "text-muted-foreground"
        )}
      />
    </div>
  );
}
