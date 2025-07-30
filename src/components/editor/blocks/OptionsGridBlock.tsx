import React, { useState, useEffect, useCallback, useRef } from 'react';
import { InlineEditableText } from './InlineEditableText';
import { Rows3, Check } from 'lucide-react';
import type { BlockComponentProps } from '../../../types/blocks';
import { QuizUtils } from '../../../data/realQuizTemplates';
import { 
  OptionsGridUtils, 
  IMAGE_SIZE_CLASSES, 
  GRID_LAYOUT_CONFIG,
  VISUAL_STATES_CONFIG,
  ANIMATION_CONFIG,
  SPACING_CONFIG,
  ACCESSIBILITY_CONFIG,
  VALIDATION_CONFIG,
  type OptionItem,
  type OptionsGridConfig 
} from '../../../config/optionsGridConfig';
const OptionsGridBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  const {
    title = '',
    options = [
      { id: 'opcao-1', text: 'Opção 1', value: 'opcao-1', imageUrl: '', category: '' },
      { id: 'opcao-2', text: 'Opção 2', value: 'opcao-2', imageUrl: '', category: '' }
    ],
    columns = 2,
    showImages = true,
    imageSize = 'large',
    multipleSelection = false,
    maxSelections = 1,
    minSelections = 1,
    validationMessage = 'Selecione uma opção',
    gridGap = 16,
    selectedOptions = [],
    // Novas propriedades de autoavanço
    autoAdvanceOnComplete = true,
    enableButtonOnlyWhenValid = true,
    autoAdvanceDelay = 800,
    requiredSelections = 3,
    showValidationFeedback = true,
    questionId = ''
  } = block.properties;

  // Estado local para gerenciar seleções e autoavanço
  const [internalSelectedOptions, setInternalSelectedOptions] = useState<string[]>(selectedOptions || []);
  const [validationError, setValidationError] = useState<string>('');
  const [isAdvanceButtonEnabled, setIsAdvanceButtonEnabled] = useState<boolean>(false);
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sincronizar estado interno com propriedades do bloco apenas na inicialização
  useEffect(() => {
    if (selectedOptions && Array.isArray(selectedOptions)) {
      setInternalSelectedOptions(selectedOptions);
    }
  }, []); // Removido todas as dependências para evitar loop

  // Verificar se deve habilitar botão e fazer autoavanço
  useEffect(() => {
    if (!isEditing) {
      const isValidSelection = QuizUtils.isAdvanceButtonEnabled(internalSelectedOptions, questionId);
      setIsAdvanceButtonEnabled(isValidSelection);
      
      // Autoavanço automático se configurado e seleção válida
      if (autoAdvanceOnComplete && isValidSelection && QuizUtils.shouldAutoAdvance(internalSelectedOptions, questionId)) {
        const delay = QuizUtils.getAutoAdvanceDelay();
        
        // Limpar timeout anterior se existir
        if (autoAdvanceTimeoutRef.current) {
          clearTimeout(autoAdvanceTimeoutRef.current);
        }
        
        // Configurar novo timeout para autoavanço
        autoAdvanceTimeoutRef.current = setTimeout(() => {
          handleAutoAdvance();
        }, delay);
      }
    }
    
    // Cleanup do timeout
    return () => {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, [internalSelectedOptions, isEditing, autoAdvanceOnComplete, questionId]);

  const handleAutoAdvance = useCallback(() => {
    // Aqui você pode implementar a lógica de navegação para a próxima questão
    // Por exemplo, disparar um evento ou callback para o componente pai
    console.log('🚀 Auto-avançando para a próxima questão');
    
    // Exemplo de como poderia ser implementado:
    if (onPropertyChange) {
      onPropertyChange('autoAdvanceTriggered', {
        selectedOptions: internalSelectedOptions,
        timestamp: Date.now()
      });
    }
  }, [internalSelectedOptions, onPropertyChange]);

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const handleOptionSelect = (optionId: string, optionValue: string) => {
    if (isEditing) return; // Não permitir seleção no modo de edição

    let newSelectedOptions: string[] = [];
    
    // Sempre usar seleção múltipla com exatamente 3 opções obrigatórias
    if (internalSelectedOptions.includes(optionId)) {
      // Desmarcar opção
      newSelectedOptions = internalSelectedOptions.filter(id => id !== optionId);
    } else {
      // Marcar opção (respeitando limite de 3 seleções)
      if (internalSelectedOptions.length < requiredSelections) {
        newSelectedOptions = [...internalSelectedOptions, optionId];
      } else {
        // Já tem 3 seleções - substituir a primeira
        newSelectedOptions = [...internalSelectedOptions.slice(1), optionId];
      }
    }

    setInternalSelectedOptions(newSelectedOptions);
    handlePropertyChange('selectedOptions', newSelectedOptions);
    
    // Validar seleção usando QuizUtils
    const validation = QuizUtils.validateQuestionResponse(newSelectedOptions, questionId);
    if (!validation.isValid) {
      if (showValidationFeedback) {
        setValidationError(validation.error || `Selecione exatamente ${requiredSelections} opções`);
      }
    } else {
      setValidationError('');
    }
  };

  const isOptionSelected = (optionId: string) => {
    return internalSelectedOptions.includes(optionId);
  };

  const getGridCols = (hasImages: boolean, textOnlyColumns: number = 1) => {
    // Usar utilitário do optionsGridConfig
    return OptionsGridUtils.getGridClasses(options, columns);
  };

  const getImageHeight = (size: string) => {
    // Usar classes de altura da configuração
    return OptionsGridUtils.getImageHeightClasses(size as 'small' | 'medium' | 'large');
  };

  if (!options || options.length === 0) {
    return (
      <div
        className={`
          bg-gray-100 p-4 sm:p-6 md:p-8 rounded-lg text-gray-500 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[150px] cursor-pointer transition-all duration-200
          ${isSelected 
            ? 'ring-1 ring-gray-400/40 bg-gray-50/30' 
            : 'hover:shadow-sm'
          }
          ${className}
        `}
        onClick={onClick}
        data-block-id={block.id}
        data-block-type={block.type}
      >
        <Rows3 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-3 md:mb-4 opacity-50" />
        <p className="text-xs sm:text-sm md:text-base text-center px-2">Configure as opções do grid no painel de propriedades.</p>
      </div>
    );
  }

  return (
    <div
      className={`
        py-2 sm:py-3 md:py-4 text-center space-y-3 sm:space-y-4 cursor-pointer transition-all duration-200 w-full
        ${isSelected 
          ? 'ring-1 ring-gray-400/40 bg-gray-50/30' 
          : 'hover:shadow-sm'
        }
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {title && (
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#432818] mb-3 sm:mb-4 md:mb-6 px-1 sm:px-2">
          <InlineEditableText
            value={title}
            onChange={(value: string) => handlePropertyChange('title', value)}
            className="inline-block"
            placeholder="Título das opções"
          />
        </h3>
      )}
      
      {/* Detectar se tem imagens para escolher layout automaticamente */}
      {(() => {
        const hasImages = OptionsGridUtils.hasImages(options);
        const gridCols = getGridCols(hasImages, columns);
        const cardAspectConfig = OptionsGridUtils.getCardAspectConfig(hasImages);
        
        return (
          <div 
            className={`grid ${gridCols} w-full mx-auto px-1 sm:px-0 ${SPACING_CONFIG.grid.mobile} ${SPACING_CONFIG.grid.tablet} ${SPACING_CONFIG.grid.desktop}`}
          >
            {options.map((option: any, index: number) => {
          const isSelected = isOptionSelected(option.id);
          const hasOptionImage = option.imageUrl && option.imageUrl.trim() !== '';
          
          return (
            <button 
              key={option.id || index} 
              className={`
                group relative rounded-lg text-sm sm:text-base md:text-lg font-medium ring-offset-background 
                ${ANIMATION_CONFIG.transition} transform hover:scale-[1.02] 
                ${ACCESSIBILITY_CONFIG.button.focusVisible}
                disabled:pointer-events-none disabled:opacity-50 active:scale-95 
                border-2 bg-white hover:shadow-lg overflow-hidden w-full gap-1 flex 
                flex-col items-center justify-start option-button
                ${hasImages && hasOptionImage ? cardAspectConfig.aspectRatio : `${cardAspectConfig.aspectRatio} ${cardAspectConfig.minHeight} ${cardAspectConfig.padding}`} 
                ${isSelected 
                  ? `${VISUAL_STATES_CONFIG.selected.border} ${VISUAL_STATES_CONFIG.selected.background} ${VISUAL_STATES_CONFIG.selected.shadow} ${VISUAL_STATES_CONFIG.selected.transform}` 
                  : `${VISUAL_STATES_CONFIG.default.border} ${VISUAL_STATES_CONFIG.hover.border} ${VISUAL_STATES_CONFIG.hover.background} ${VISUAL_STATES_CONFIG.default.shadow}`
                }
                ${isEditing ? 'cursor-default' : 'cursor-pointer'}
                ${ACCESSIBILITY_CONFIG.touchTarget.class}
              `}
              type="button"
              onClick={() => handleOptionSelect(option.id, option.value)}
              disabled={isEditing}
              data-option-id={option.id}
              data-option-value={option.value}
              data-option-category={option.category}
              data-selected={isSelected}
            >
              {/* Indicador de seleção */}
              {isSelected && (
                <div className={`absolute ${ANIMATION_CONFIG.selectionIndicator.position} ${ANIMATION_CONFIG.selectionIndicator.size} ${ANIMATION_CONFIG.selectionIndicator.background} rounded-full flex items-center justify-center shadow-lg z-10 ${ANIMATION_CONFIG.selectionIndicator.animation}`}>
                  <Check className={`${ANIMATION_CONFIG.selectionIndicator.iconSize} text-white`} />
                </div>
              )}
              
              {showImages && option.imageUrl && (
                <div className="relative w-full flex-1">
                  <img
                    src={option.imageUrl}
                    alt={option.text}
                    width={ACCESSIBILITY_CONFIG.image.width}
                    height={ACCESSIBILITY_CONFIG.image.height}
                    loading={ACCESSIBILITY_CONFIG.image.loading}
                    className={`w-full rounded-t-lg bg-white ${getImageHeight(imageSize)} object-cover ${ANIMATION_CONFIG.transition}`}
                    onError={(e) => {
                      e.currentTarget.src = OptionsGridUtils.getFallbackImageUrl(option.text);
                    }}
                  />
                  {/* Overlay de seleção */}
                  {isSelected && (
                    <div className={`absolute inset-0 ${ANIMATION_CONFIG.overlay.background} ${ANIMATION_CONFIG.overlay.borderRadius} ${ANIMATION_CONFIG.overlay.transition}`}></div>
                  )}
                </div>
              )}
              
              <div className={`w-full flex flex-row items-center justify-center flex-shrink-0 ${
                hasOptionImage ? SPACING_CONFIG.cards.withImages.padding : SPACING_CONFIG.cards.textOnly.padding
              }`}>
                <div className="break-words w-full custom-quill quill ql-editor quill-option text-center">
                  <div 
                    className={`font-medium ${ANIMATION_CONFIG.transition} ${
                      hasOptionImage ? SPACING_CONFIG.cards.withImages.leading : SPACING_CONFIG.cards.textOnly.leading
                    } ${
                      isSelected ? 'text-[#432818]' : 'text-[#432818] group-hover:text-[#B89B7A]'
                    }`}
                    dangerouslySetInnerHTML={{ __html: option.text || 'Opção sem texto' }}
                  />
                </div>
              </div>
            </button>
          );
        })}
        </div>
        );
      })()}
      
      {/* Contador de seleções */}
      {!isEditing && showValidationFeedback && (
        <div className="mt-4 text-center">
          <p className={`text-sm font-medium ${
            internalSelectedOptions.length === requiredSelections 
              ? 'text-green-600' 
              : 'text-gray-600'
          }`}>
            {internalSelectedOptions.length} de {requiredSelections} opções selecionadas
          </p>
          
          {/* Indicador de autoavanço */}
          {autoAdvanceOnComplete && internalSelectedOptions.length === requiredSelections && (
            <div className="flex items-center justify-center mt-2 text-green-600">
              <div className="animate-pulse flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-xs font-medium">Avançando automaticamente...</span>
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Mensagem de validação */}
      {validationError && showValidationFeedback && (
        <div className="mt-3 text-center">
          <p className="text-red-600 text-sm font-medium">{validationError}</p>
        </div>
      )}
      
      {/* Informações de seleção para modo de edição */}
      {isEditing && (
        <div className="mt-3 text-center">
          <p className="text-gray-500 text-sm">
            Modo de edição: {internalSelectedOptions.length} opção(ões) selecionada(s)
            <br />
            Configurado para: {requiredSelections} seleções obrigatórias
            {autoAdvanceOnComplete && <br />}
            {autoAdvanceOnComplete && `Auto-avanço: ${autoAdvanceDelay}ms de delay`}
          </p>
        </div>
      )}
    </div>
  );
};

export default OptionsGridBlock;

