import React from 'react';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { Block } from '@/types/editor';

interface QuestionInstructionsBlockProps {
  block: Block;
  isSelected?: boolean;
  isEditable?: boolean;
  onSelect?: (blockId: string) => void;
  onOpenProperties?: (blockId: string) => void;
  contextData?: {
    currentAnswers?: string[];
    requiredSelections?: number;
  };
}

export default function QuestionInstructionsBlock({
  block,
  isSelected = false,
  isEditable = false,
  onSelect,
  onOpenProperties,
  contextData,
}: QuestionInstructionsBlockProps) {
  const requiredSelections = block.properties?.requiredSelections || 
                             contextData?.requiredSelections || 
                             1;
  
  const currentCount = contextData?.currentAnswers?.length || 0;
  
  const selectionText = requiredSelections > 1
    ? `Selecione ${requiredSelections} opções`
    : 'Selecione uma opção';

  const fontSize = block.properties?.fontSize || 'text-sm';
  const textColor = block.properties?.textColor || 'text-gray-600';
  const textAlign = block.properties?.textAlign || 'center';
  const marginBottom = block.properties?.marginBottom || 'mb-8';
  const showCounter = block.properties?.showCounter !== false;

  return (
    <SelectableBlock
      blockId={block.id}
      isSelected={isSelected}
      isEditable={isEditable}
      onSelect={() => onSelect?.(block.id)}
      blockType="Instruções de Seleção"
      blockIndex={block.order || 0}
      onOpenProperties={() => onOpenProperties?.(block.id)}
      isDraggable={true}
    >
      <p className={`${fontSize} ${textColor} ${marginBottom} text-${textAlign}`}>
        {selectionText}
        {showCounter && ` (${currentCount}/${requiredSelections})`}
        {isEditable && (
          <span className="block text-blue-500 mt-1 text-xs">
            ✏️ Editável via Painel de Propriedades
          </span>
        )}
      </p>
    </SelectableBlock>
  );
}
