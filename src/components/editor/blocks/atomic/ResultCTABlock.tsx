/**
 * 🎯 RESULT CTA BLOCK - Bloco Atômico
 * Call-to-action na página de resultado
 */

import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ResultCTABlock({
  block,
  isSelected = false,
  isEditable = false,
  onUpdate,
}: AtomicBlockProps) {
  const buttonText = block.content?.buttonText || 'Ver Recomendações';
  const buttonVariant = block.content?.buttonVariant || 'default';
  const url = block.content?.url || '#';
  
  const handleTextEdit = (newText: string) => {
    if (onUpdate) {
      onUpdate({
        content: {
          ...block.content,
          buttonText: newText,
        },
      });
    }
  };

  const handleUrlEdit = (newUrl: string) => {
    if (onUpdate) {
      onUpdate({
        content: {
          ...block.content,
          url: newUrl,
        },
      });
    }
  };

  return (
    <div 
      className={cn(
        "text-center py-8 space-y-4",
        isSelected && "ring-2 ring-primary ring-offset-2 rounded px-4"
      )}
    >
      {isEditable ? (
        <>
          <input
            type="text"
            value={buttonText}
            onChange={(e) => handleTextEdit(e.target.value)}
            className="w-full max-w-sm mx-auto text-center bg-transparent border-b border-muted outline-none"
          />
          <input
            type="text"
            value={url}
            onChange={(e) => handleUrlEdit(e.target.value)}
            placeholder="URL do botão"
            className="w-full max-w-sm mx-auto text-sm text-center bg-muted px-2 py-1 rounded"
          />
        </>
      ) : (
        <Button 
          variant={buttonVariant as any} 
          size="lg"
          onClick={() => window.location.href = url}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}
