import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import type { BlockComponentProps } from '../../../types/blocks';

interface OptionItem {
  id: string;
  text: string;
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
    borderColor = '#E5E7EB',
    selectedBorderColor = '#B89B7A',
    hoverColor = '#F3E8D3',
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
          onPropertyChange('selectedOptions', newSelected);
        }

        return newSelected;
      });
    } else {
      const newSelected = [optionId];
      setSelectedOptions(newSelected);

      if (onPropertyChange) {
        onPropertyChange('selectedOptions', newSelected);
      }
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
          'grid gap-4',
          columns === 1 && 'grid-cols-1',
          columns === 2 && 'grid-cols-1 md:grid-cols-2',
          columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          columns === 4 && 'grid-cols-2 md:grid-cols-4'
        )}
      >
        {options.map((option: OptionItem) => {
          const isSelectedOption = selectedOptions.includes(option.id);

          return (
            <div
              key={option.id}
              className={cn(
                'option-card p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
                'hover:shadow-lg transform hover:-translate-y-1',
                isSelectedOption
                  ? `border-[${selectedBorderColor}] bg-[${selectedBorderColor}]/10 shadow-lg`
                  : `border-[${borderColor}] hover:border-[${selectedBorderColor}] hover:bg-[${hoverColor}]`
              )}
              onClick={e => {
                e.stopPropagation();
                handleOptionClick(option.id);
              }}
              style={{
                borderColor: isSelectedOption ? selectedBorderColor : borderColor,
                backgroundColor: isSelectedOption ? `${selectedBorderColor}20` : undefined,
              }}
            >
              {/* Imagem da opção */}
              {showImages && option.imageUrl && (
                <div className="option-image mb-3">
                  <img
                    src={option.imageUrl}
                    alt={option.text}
                    className="w-full rounded-md object-cover"
                    style={{
                      width: `${imageSize}px`,
                      height: `${imageSize}px`,
                      maxWidth: '100%',
                      aspectRatio: '1/1',
                    }}
                    loading="lazy"
                  />
                </div>
              )}

              {/* Texto da opção */}
              <div className="option-text">
                <p
                  className={cn(
                    'text-sm font-medium leading-relaxed',
                    isSelectedOption ? `text-[${selectedBorderColor}]` : 'text-gray-800'
                  )}
                >
                  {option.text}
                </p>
              </div>

              {/* Indicador de seleção */}
              {isSelectedOption && (
                <div className="selection-indicator mt-2 flex justify-center">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: selectedBorderColor }}
                  >
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
        <p style={{ color: '#6B4F43' }}>
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
