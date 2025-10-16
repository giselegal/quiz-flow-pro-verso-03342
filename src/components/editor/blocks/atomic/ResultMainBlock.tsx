/**
 * 🎯 RESULT MAIN BLOCK - Bloco Atômico
 * Conteúdo principal do resultado (estilo principal)
 */

import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ResultMainBlock({
  block,
  isSelected = false,
  isEditable = false,
  onUpdate,
}: AtomicBlockProps) {
  const styleName = block.content?.styleName || 'Seu Estilo';
  const description = block.content?.description || 'Descrição do estilo';
  
  const handleStyleNameEdit = (newName: string) => {
    if (onUpdate) {
      onUpdate({
        content: {
          ...block.content,
          styleName: newName,
        },
      });
    }
  };

  const handleDescriptionEdit = (newDescription: string) => {
    if (onUpdate) {
      onUpdate({
        content: {
          ...block.content,
          description: newDescription,
        },
      });
    }
  };

  return (
    <Card 
      className={cn(
        "w-full",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <CardHeader>
        {isEditable ? (
          <input
            type="text"
            value={styleName}
            onChange={(e) => handleStyleNameEdit(e.target.value)}
            className="text-2xl font-bold bg-transparent border-none outline-none"
          />
        ) : (
          <CardTitle>{styleName}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        {isEditable ? (
          <textarea
            value={description}
            onChange={(e) => handleDescriptionEdit(e.target.value)}
            rows={4}
            className="w-full bg-transparent border-none outline-none resize-none"
          />
        ) : (
          <p>{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
