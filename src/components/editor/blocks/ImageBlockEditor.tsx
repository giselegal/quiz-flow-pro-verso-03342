import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BlockEditorProps } from './types';

export const ImageBlockEditor: React.FC<BlockEditorProps> = ({ block, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${block.id}-imageUrl`}>URL da Imagem</Label>
        <Input
          id={`${block.id}-imageUrl`}
          value={block.content.imageUrl || ''}
          onChange={e => onUpdate({ imageUrl: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor={`${block.id}-imageAlt`}>Texto Alternativo</Label>
        <Input
          id={`${block.id}-imageAlt`}
          value={block.content.imageAlt || ''}
          onChange={e => onUpdate({ imageAlt: e.target.value })}
          className="mt-1"
        />
      </div>

      {block.content.imageUrl && (
        <div className="mt-4">
          <p className="text-sm text-[#8F7A6A] mb-2">Pré-visualização:</p>
          <img
            src={block.content.imageUrl}
            alt={block.content.imageAlt || ''}
            className="max-w-full h-auto max-h-40 rounded-lg"
          />
        </div>
      )}
    </div>
  );
};
