import React from 'react';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { Block } from '@/types/editor';

interface QuestionNumberBlockProps {
  block: Block;
  isSelected?: boolean;
  isEditable?: boolean;
  onSelect?: (blockId: string) => void;
  onOpenProperties?: (blockId: string) => void;
}

export default function QuestionNumberBlock({
  block,
  isSelected = false,
  isEditable = false,
  onSelect,
  onOpenProperties
}: QuestionNumberBlockProps) {
  const questionNumber = block.content?.questionNumber || 
                        block.properties?.questionNumber || 
                        'Pergunta 1';
  
  const fontSize = block.properties?.fontSize || 'text-xl md:text-2xl';
  const fontWeight = block.properties?.fontWeight || 'font-bold';
  const textColor = block.properties?.textColor || '#432818';
  const textAlign = block.properties?.textAlign || 'center';
  const marginBottom = block.properties?.marginBottom || 'mb-4';

  return (
    <SelectableBlock
      blockId={block.id}
      isSelected={isSelected}
      isEditable={isEditable}
      onSelect={() => onSelect?.(block.id)}
      blockType="Número da Pergunta"
      blockIndex={block.order || 0}
      onOpenProperties={() => onOpenProperties?.(block.id)}
      isDraggable={true}
    >
      <h2 
        className={`${fontSize} ${fontWeight} ${marginBottom} text-${textAlign}`}
        style={{ color: textColor }}
      >
        {questionNumber}
      </h2>
    </SelectableBlock>
  );
}
