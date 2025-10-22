import React from 'react';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { Block } from '@/types/editor';

interface QuestionTextBlockProps {
  block: Block;
  isSelected?: boolean;
  isEditable?: boolean;
  onSelect?: (blockId: string) => void;
  onOpenProperties?: (blockId: string) => void;
}

export default function QuestionTextBlock({
  block,
  isSelected = false,
  isEditable = false,
  onSelect,
  onOpenProperties
}: QuestionTextBlockProps) {
  // Aceita aliases comuns: content.questionText, content.text, properties.questionText
  const questionText = block.content?.questionText ||
    (block as any).content?.text ||
    block.properties?.questionText ||
    'Qual é a sua preferência?';

  const fontSize = block.properties?.fontSize || 'text-xl md:text-2xl';
  const fontWeight = block.properties?.fontWeight || 'font-bold';
  const textColor = block.properties?.textColor || '#deac6d';
  const fontFamily = block.properties?.fontFamily || '"Playfair Display", serif';
  const textAlign = block.properties?.textAlign || 'center';
  const marginBottom = block.properties?.marginBottom || 'mb-4';

  return (
    <SelectableBlock
      blockId={block.id}
      isSelected={isSelected}
      isEditable={isEditable}
      onSelect={() => onSelect?.(block.id)}
      blockType="Texto da Pergunta"
      blockIndex={block.order || 0}
      onOpenProperties={() => onOpenProperties?.(block.id)}
      isDraggable={true}
    >
      <p
        className={`${fontSize} ${fontWeight} ${marginBottom} text-${textAlign}`}
        style={{ color: textColor, fontFamily }}
      >
        {questionText}
      </p>
    </SelectableBlock>
  );
}
