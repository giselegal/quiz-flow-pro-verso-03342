/**
 * 🎯 RESULT IMAGE BLOCK - Bloco Atômico
 * Imagem do resultado (estilo visual)
 */

import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { cn } from '@/lib/utils';

export default function ResultImageBlock({
  block,
  isSelected = false,
  isEditable = false,
  onUpdate,
}: AtomicBlockProps) {
  const imageUrl = block.content?.imageUrl || 'https://via.placeholder.com/400x300';
  const alt = block.content?.alt || 'Imagem do resultado';
  
  const handleImageUrlEdit = (newUrl: string) => {
    if (onUpdate) {
      onUpdate({
        content: {
          ...block.content,
          imageUrl: newUrl,
        },
      });
    }
  };

  return (
    <div 
      className={cn(
        "w-full max-w-md mx-auto",
        isSelected && "ring-2 ring-primary ring-offset-2 rounded"
      )}
    >
      {isEditable ? (
        <div className="space-y-2">
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-auto rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Imagem';
            }}
          />
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => handleImageUrlEdit(e.target.value)}
            placeholder="URL da imagem"
            className="w-full text-sm bg-muted px-2 py-1 rounded"
          />
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-auto rounded-lg object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Imagem';
          }}
        />
      )}
    </div>
  );
}
