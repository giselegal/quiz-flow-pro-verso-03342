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
    onBack?: () => void;
  };
}

export default function QuestionNavigationBlock({
  block,
  isSelected = false,
  isEditable = false,
  onSelect,
  onOpenProperties,
  contextData,
}: QuestionNavigationBlockProps) {
  const canProceed = contextData?.canProceed || false;
  const onNext = contextData?.onNext;
  const onBack = contextData?.onBack;

  // Preferir rótulos do conteúdo do JSON v3 quando disponíveis
  const contentNextLabel = (block as any)?.content?.nextLabel as string | undefined;
  const contentBackLabel = (block as any)?.content?.backLabel as string | undefined;

  const buttonTextEnabled = block.properties?.buttonTextEnabled || contentNextLabel || 'Avançar';
  const buttonTextDisabled = block.properties?.buttonTextDisabled || contentNextLabel || 'Próxima';
  const buttonText = canProceed ? buttonTextEnabled : buttonTextDisabled;

  const enabledColor = block.properties?.enabledColor || '#deac6d';
  const disabledColor = block.properties?.disabledColor || '#e6ddd4';
  const disabledTextColor = block.properties?.disabledTextColor || '#8a7663';
  const align = (block.properties as any)?.align || 'center';

  // Controle de visibilidade e alvos de navegação
  const showBack = (block.properties as any)?.showBack ?? true;
  const enableWhenValid = (block.properties as any)?.enableWhenValid ?? true;
  const nextStepId = (block.properties as any)?.nextStepId as string | number | undefined;
  const prevStepId = (block.properties as any)?.prevStepId as string | number | undefined;

  const handleClick = (e?: React.MouseEvent) => {
    // 🔥 CRITICAL: Impedir propagação se for evento de click
    if (e) e.stopPropagation();

    const allowed = enableWhenValid ? canProceed : true;
    if (isEditable || !allowed) return;

    // Dispara evento sem navegação (tracking)
    try {
      window.dispatchEvent(new CustomEvent('quiz-navigation-click', { detail: { type: 'next', blockId: block.id, timestamp: Date.now() } }));
    } catch { }

    if (onNext) return onNext();

    // Navegação por ID configurável
    if (nextStepId) {
      import('@/lib/utils/stepEvents').then(({ dispatchNavigate }) =>
        dispatchNavigate(nextStepId, { source: 'question-navigation:next', blockId: block.id }),
      );
      try {
        window.dispatchEvent(new CustomEvent('quiz-navigation-next', { detail: { target: nextStepId, blockId: block.id } }));
      } catch { }
      return;
    }
  };

  const handleBack = (e?: React.MouseEvent) => {
    // 🔥 CRITICAL: Impedir propagação se for evento de click
    if (e) e.stopPropagation();

    if (isEditable) return;
    // Dispara evento sem navegação (tracking)
    try {
      window.dispatchEvent(new CustomEvent('quiz-navigation-click', { detail: { type: 'back', blockId: block.id, timestamp: Date.now() } }));
    } catch { }

    if (onBack) return onBack();
    if (prevStepId) {
      import('@/lib/utils/stepEvents').then(({ dispatchNavigate }) =>
        dispatchNavigate(prevStepId, { source: 'question-navigation:back', blockId: block.id }),
      );
      try {
        window.dispatchEvent(new CustomEvent('quiz-navigation-back', { detail: { target: prevStepId, blockId: block.id } }));
      } catch { }
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
      <div
        className={`flex items-center gap-3 ${align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center'
          }`}
      >
        {showBack && (
          <button
            type="button"
            onClick={handleBack}
            className="font-semibold py-3 px-5 rounded-full shadow-md transition-all bg-[#e6ddd4] text-[#8a7663] hover:opacity-90"
            disabled={isEditable}
          >
            {contentBackLabel || 'Voltar'}
          </button>
        )}
        <button
          type="button"
          disabled={(enableWhenValid ? !canProceed : false) || isEditable}
          onClick={handleClick}
          className={`font-bold py-3 px-6 rounded-full shadow-md transition-all ${(enableWhenValid ? canProceed : true) ? 'text-white' : 'opacity-50 cursor-not-allowed'
            }`}
          style={{
            backgroundColor: (enableWhenValid ? canProceed : true) ? enabledColor : disabledColor,
            color: (enableWhenValid ? canProceed : true) ? 'white' : disabledTextColor,
          }}
        >
          {buttonText}
        </button>
      </div>
    </SelectableBlock>
  );
}