/**
 * 🎯 RESULT HEADER BLOCK - Bloco Atômico
 * Cabeçalho da página de resultado
 */

import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { cn } from '@/lib/utils';

export default function ResultHeaderBlock({
  block,
  isSelected = false,
  isEditable = false,
  onUpdate,
}: AtomicBlockProps) {
  const title = block.content?.title || 'Seu Resultado';
  const subtitle = block.content?.subtitle || 'Baseado nas suas respostas';
  
  const handleTitleEdit = (newTitle: string) => {
    if (onUpdate) {
      onUpdate({
        content: {
          ...block.content,
          title: newTitle,
        },
      });
    }
  };

  const handleSubtitleEdit = (newSubtitle: string) => {
    if (onUpdate) {
      onUpdate({
        content: {
          ...block.content,
          subtitle: newSubtitle,
        },
      });
    }
  };

  return (
    <div 
      className={cn(
        "text-center space-y-2 py-6",
        isSelected && "ring-2 ring-primary ring-offset-2 rounded px-4"
      )}
    >
      {isEditable ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleEdit(e.target.value)}
            className="w-full text-3xl font-bold text-center bg-transparent border-none outline-none"
          />
          <input
            type="text"
            value={subtitle}
            onChange={(e) => handleSubtitleEdit(e.target.value)}
            className="w-full text-muted-foreground text-center bg-transparent border-none outline-none"
          />
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </>
      )}
    </div>
  );
}
