import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import type { BlockComponentProps } from '@/types/blocks';

interface OptionItem {
  id: string;
  text: string;
  description?: string;
  imageUrl?: string;
  value?: string;
  category?: string;
  points?: number;
}

/**
 * OptionsGridInlineBlock - Bloco inline para grade de opções
 *
 * Renderiza uma grade de opções selecionáveis sem depender do sistema funnel.
 * Compatível 100% com o editor e SortableBlockWrapper.
 *
 * INLINE | EDITÁVEL | RESPONSIVO | COMPATÍVEL COM EDITOR
 */
const OptionsGridInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  // callback opcional para reportar validade da seleção ao editor/painel
  onValidate,
  className = '',
}) => {
  // Destructuring das propriedades do bloco
  const {
    options = [],
    columns = 2,
    imageSize = 256,
    multipleSelection = true,
    minSelections = 1,
    maxSelections = 3,
    showImages = true,
    // ✨ NOVAS PROPRIEDADES DO PAINEL
    layoutOrientation = 'vertical',
    contentType = 'text-and-image',
    imagePosition = 'top',
    gap = 16,
    cardRadius = 12,
  } = block.properties || {};

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // 🔍 DEBUG
  console.log('🎯 OptionsGridInlineBlock DEBUG:', {
    blockId: block.id,
    optionsCount: options.length,
    firstOption: options[0],
    selectedCount: selectedOptions.length,
  });

  const handleOptionClick = (optionId: string) => {
    if (multipleSelection) {
      setSelectedOptions(prev => {
        const newSelected = prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId].slice(0, maxSelections);

        // Notificar mudança
        if (onPropertyChange) {
          // Atualiza both explicit selectedOptions e o objeto properties para garantir persistência
          try {
            onPropertyChange('selectedOptions', newSelected);
          } finally {
            // Garantir que a propriedade completa seja mesclada no editor (merge seguro)
            onPropertyChange('properties', { selectedOptions: newSelected });
          }
        }

        // Reportar validao ao editor/painel
        const isValid = newSelected.length >= minSelections;
        if (onValidate) onValidate(isValid);

        // Dispatch quiz selection change event
        const stepNumber = parseInt(block.id?.match(/step-(\d+)/)?.[1] || '0');
        const questionId = stepNumber > 1 ? `q${stepNumber - 1}` : `q1`; // Step 2 = q1, etc.

        window.dispatchEvent(
          new CustomEvent('quiz-selection-change', {
            detail: {
              blockId: block.id,
              questionId, // ✅ NOVO: ID da questão para mapeamento no quiz
              selectedOptions: newSelected,
              isValid,
              minSelections,
              maxSelections,
            },
          })
        );

        return newSelected;
      });
    } else {
      const newSelected = [optionId];
      setSelectedOptions(newSelected);

      if (onPropertyChange) {
        try {
          onPropertyChange('selectedOptions', newSelected);
        } finally {
          onPropertyChange('properties', { selectedOptions: newSelected });
        }
      }

      const isValid = newSelected.length >= minSelections;
      if (onValidate) onValidate(isValid);

      // Dispatch quiz selection change event
      const stepNumber = parseInt(block.id?.match(/step-(\d+)/)?.[1] || '0');
      const questionId = stepNumber > 1 ? `q${stepNumber - 1}` : `q1`; // Step 2 = q1, etc.

      window.dispatchEvent(
        new CustomEvent('quiz-selection-change', {
          detail: {
            blockId: block.id,
            questionId, // ✅ NOVO: ID da questão para mapeamento no quiz
            selectedOptions: newSelected,
            isValid,
            minSelections,
            maxSelections,
          },
        })
      );
    }
  };

  const isValidSelection = selectedOptions.length >= minSelections;

  return (
    <div
      className={cn(
        'options-grid-inline-block w-full',
        className,
        isSelected && 'ring-2 ring-blue-500 ring-opacity-50'
      )}
      onClick={onClick}
    >
      {/* Grid de opções */}
      <div
        className={cn(
          'grid',
          columns === 1 && 'grid-cols-1',
          columns === 2 && 'grid-cols-1 md:grid-cols-2',
          columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          columns === 4 && 'grid-cols-2 md:grid-cols-4'
        )}
        style={{
          gap: `${gap}px`,
        }}
      >
        {options.map((option: OptionItem) => {
          const isSelectedOption = selectedOptions.includes(option.id);

          return (
            <div
              key={option.id}
              className={cn(
                'option-card p-4 border-2 cursor-pointer transition-all duration-200',
                'hover:shadow-lg transform hover:-translate-y-1',
                layoutOrientation === 'horizontal' && imagePosition === 'left'
                  ? 'flex items-center gap-4'
                  : '',
                layoutOrientation === 'horizontal' && imagePosition === 'right'
                  ? 'flex items-center gap-4 flex-row-reverse'
                  : '',
                isSelectedOption
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-lg'
                  : 'border-gray-200 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5'
              )}
              onClick={e => {
                e.stopPropagation();
                handleOptionClick(option.id);
              }}
              style={{
                borderRadius: `${cardRadius}px`,
              }}
            >
              {/* Imagem da opção */}
              {showImages && option.imageUrl && contentType !== 'text-only' && (
                <div
                  className={cn(
                    'option-image',
                    layoutOrientation === 'vertical' && imagePosition === 'top' && 'mb-3',
                    layoutOrientation === 'vertical' &&
                      imagePosition === 'bottom' &&
                      'order-2 mt-3',
                    layoutOrientation === 'horizontal' &&
                      (imagePosition === 'left' || imagePosition === 'right') &&
                      'flex-shrink-0'
                  )}
                >
                  <img
                    src={option.imageUrl}
                    alt={option.text}
                    className="w-full rounded-md object-cover"
                    style={{
                      width:
                        layoutOrientation === 'horizontal'
                          ? `${Math.min(imageSize, 120)}px`
                          : `${imageSize}px`,
                      height:
                        layoutOrientation === 'horizontal'
                          ? `${Math.min(imageSize, 120)}px`
                          : `${imageSize}px`,
                      maxWidth: '100%',
                      aspectRatio: '1/1',
                    }}
                    loading="lazy"
                  />
                </div>
              )}

              {/* Texto da opção */}
              {contentType !== 'image-only' && (
                <div
                  className={cn(
                    'option-text',
                    layoutOrientation === 'horizontal' && 'flex-1',
                    layoutOrientation === 'vertical' && imagePosition === 'bottom' && 'order-1'
                  )}
                >
                  {/* Título da opção */}
                  <h4
                    className={cn(
                      'text-sm font-bold leading-tight mb-1',
                      isSelectedOption ? 'text-[var(--primary)]' : 'text-foreground'
                    )}
                  >
                    {option.text}
                  </h4>

                  {/* Descrição da opção */}
                  {option.description && (
                    <p
                      className={cn(
                        'text-xs leading-relaxed opacity-90',
                        isSelectedOption ? 'text-[var(--primary)]' : 'text-muted-foreground'
                      )}
                    >
                      {option.description}
                    </p>
                  )}
                </div>
              )}

              {/* Indicador de seleção */}
              {isSelectedOption && (
                <div className="selection-indicator mt-2 flex justify-center">
                  <div className="w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center text-primary-foreground text-xs font-bold">
                    ✓
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Feedback de seleção */}
      <div className="selection-feedback mt-4 text-center">
        <p className={cn('text-sm', isValidSelection ? 'text-green-600' : 'text-muted-foreground')}>
          {multipleSelection
            ? `${selectedOptions.length} de ${maxSelections} selecionados${!isValidSelection ? ` (mínimo ${minSelections})` : ''}`
            : selectedOptions.length > 0
              ? 'Opção selecionada'
              : 'Selecione uma opção'}
        </p>
      </div>
    </div>
  );
};

export default OptionsGridInlineBlock;
