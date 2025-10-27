import React from 'react';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { Block } from '@/types/editor';

interface ImageDisplayInlineBlockProps {
  block: Block;
  isSelected?: boolean;
  isEditable?: boolean;
  onSelect?: (blockId: string) => void;
  onOpenProperties?: (blockId: string) => void;
}

export default function ImageDisplayInlineBlock({
  block,
  isSelected = false,
  isEditable = false,
  onSelect,
  onOpenProperties,
}: ImageDisplayInlineBlockProps) {
  const src = block.properties?.src || 'https://via.placeholder.com/300x204';
  const alt = block.properties?.alt || 'Imagem';
  const maxWidth = block.properties?.maxWidth || '300px';
  const objectFit = block.properties?.objectFit || 'contain';
  const rounded = block.properties?.rounded !== false;
  const aspectRatio = block.properties?.aspectRatio || '1.47';

  return (
    <SelectableBlock
      blockId={block.id}
      isSelected={isSelected}
      isEditable={isEditable}
      onSelect={() => onSelect?.(block.id)}
      blockType="Imagem"
      blockIndex={block.order || 0}
      onOpenProperties={() => onOpenProperties?.(block.id)}
      isDraggable={true}
    >
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto mt-8">
        <div className="mt-2 w-full mx-auto flex justify-center">
          <div 
            className={`overflow-hidden ${rounded ? 'rounded-lg' : ''} shadow-sm`}
            style={{ 
              aspectRatio,
              maxHeight: '204px',
              width: '100%',
              maxWidth,
            }}
          >
            <img 
              src={src}
              alt={alt}
              className="w-full h-full"
              style={{
                maxWidth,
                maxHeight: '204px',
                width: '100%',
                height: 'auto',
                objectFit,
              }}
            />
          </div>
        </div>
      </div>
    </SelectableBlock>
  );
}
