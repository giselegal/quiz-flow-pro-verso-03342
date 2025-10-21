import React from 'react';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { Block } from '@/types/editor';

interface QuestionNavigationBlockProps {
  block: Block;
  isSelected?: boolean;
  isEditable?: boolean;
  onSelect?: (blockId: string) => void;
  onOpenProperties?: (blockId: string) => void;
  contextData?: {
    canProceed?: boolean;
    onNext?: () => void;
  };
}

export default function QuestionNavigationBlock({
  block,
  isSelected = false,
  isEditable = false,
  onSelect,
  onOpenProperties,
  contextData
}: QuestionNavigationBlockProps) {
  const canProceed = contextData?.canProceed || false;
  const onNext = contextData?.onNext;

  // Preferir rótulos do conteúdo do JSON v3 quando disponíveis
  const contentNextLabel = (block as any)?.content?.nextLabel as string | undefined;
  const contentBackLabel = (block as any)?.content?.backLabel as string | undefined;

  const buttonTextEnabled = block.properties?.buttonTextEnabled || contentNextLabel || 'Avançar';
  const buttonTextDisabled = block.properties?.buttonTextDisabled || contentNextLabel || 'Próxima';
  const buttonText = canProceed ? buttonTextEnabled : buttonTextDisabled;

  const enabledColor = block.properties?.enabledColor || '#deac6d';
  const disabledColor = block.properties?.disabledColor || '#e6ddd4';
  const disabledTextColor = block.properties?.disabledTextColor || '#8a7663';

  const handleClick = () => {
    if (!isEditable && canProceed && onNext) {
      onNext();
    }
  };

  return (
    <SelectableBlock
      blockId={block.id}
      isSelected={isSelected}
      isEditable={isEditable}
      onSelect={() => onSelect?.(block.id)}
      blockType="Botão de Navegação"
      blockIndex={block.order || 0}
      onOpenProperties={() => onOpenProperties?.(block.id)}
      isDraggable={true}
    >
      <button
        disabled={!canProceed || isEditable}
        onClick={handleClick}
        className={`font-bold py-3 px-6 rounded-full shadow-md transition-all ${canProceed
            ? 'text-white animate-pulse'
            : 'opacity-50 cursor-not-allowed'
          }`}
        style={{
          backgroundColor: canProceed ? enabledColor : disabledColor,
          color: canProceed ? 'white' : disabledTextColor
        }}
      >
        {buttonText}
      </button>
    </SelectableBlock>
  );
}
