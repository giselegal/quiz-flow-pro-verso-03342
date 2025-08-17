import React from 'react';
import type { BlockComponentProps } from '@/types/blocks';

interface Option {
  id: string;
  text: string;
  imageUrl?: string;
  value?: string;
  category?: string;
  styleCategory?: string;
  keyword?: string;
  points?: number;
}

interface OptionsGridBlockProps extends BlockComponentProps {
  // Preview mode props
  isPreviewMode?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  onNavigate?: (stepId: string) => void;
  onUpdateSessionData?: (key: string, value: any) => void;
  sessionData?: Record<string, any>;
  onStepComplete?: (data: any) => void;
  autoAdvanceOnComplete?: boolean;

  properties: {
    question?: string;
    questionId?: string;
    options?: Option[];
    columns?: number | string;
    selectedOption?: string;
    selectedOptions?: string[];
    // 🎯 CONTROLES DE IMAGEM
    showImages?: boolean;
    imageSize?: 'small' | 'medium' | 'large' | 'custom' | string; // Permite strings também
    imageWidth?: number;
    imageHeight?: number;
    imagePosition?: 'top' | 'left' | 'right' | 'bottom';
    imageLayout?: 'vertical' | 'horizontal';
    // 🎯 CONTROLES DE LAYOUT
    multipleSelection?: boolean;
    maxSelections?: number;
    minSelections?: number;
    requiredSelections?: number;
    gridGap?: number;
    responsiveColumns?: boolean;
    // 🎯 CONTROLES DE SELEÇÃO
    selectionStyle?: string;
    selectedColor?: string;
    hoverColor?: string;
    allowDeselection?: boolean;
    showSelectionCount?: boolean;
    // 🎯 CONTROLES DE VALIDAÇÃO
    validationMessage?: string;
    progressMessage?: string;
    enableButtonOnlyWhenValid?: boolean;
    showValidationFeedback?: boolean;
    // 🎯 CONTROLES DE COMPORTAMENTO
    autoAdvanceOnComplete?: boolean;
    autoAdvanceDelay?: number;
    instantActivation?: boolean;
    trackSelectionOrder?: boolean;
  };
}

// NOTE: getMarginClass function available if needed for margin calculations
/*
const getMarginClass = (value: string | number, type: 'top' | 'bottom' | 'left' | 'right'): string => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};
*/

const OptionsGridBlock: React.FC<OptionsGridBlockProps> = ({
  block,
  isSelected = false,
  // isEditing = false, // unused
  onClick,
  onPropertyChange,
  className = '',
  // Preview mode props
  isPreviewMode = false,
  onNext,
  onUpdateSessionData,
  sessionData = {},
  onStepComplete,
}) => {
  const {
    question,
    // questionId, // unused
    options = [],
    columns = 2,
    // selectedOption, // unused for now
    selectedOptions = [],
    // 🎯 PROPRIEDADES DE IMAGEM
    showImages = true,
    imageSize = 'medium',
    imageWidth,
    imageHeight,
    imagePosition = 'top',
    imageLayout = 'vertical',
    // 🎯 PROPRIEDADES DE LAYOUT
    gridGap = 16,
    responsiveColumns = true,
    multipleSelection = false,
    maxSelections = 1,
    minSelections = 1,
    requiredSelections = 1,
    // 🎯 PROPRIEDADES DE ESTILO
    // selectionStyle = 'border', // unused
    // selectedColor = '#B89B7A', // unused
    // hoverColor = '#D4C2A8', // unused
    // 🎯 PROPRIEDADES DE COMPORTAMENTO
    allowDeselection = true,
    // showSelectionCount = true, // unused
    // validationMessage = 'Selecione uma opção', // unused
    // progressMessage = '{selected} de {maxSelections} selecionados', // unused
    // enableButtonOnlyWhenValid = true, // unused
    // showValidationFeedback = true, // unused
    autoAdvanceOnComplete = false,
    autoAdvanceDelay = 1500,
    // instantActivation = true, // unused
    // trackSelectionOrder = false, // unused
    // 🎯 PROPRIEDADES LEGADAS
    className: blockClassName,
    showQuestionTitle = true,
  } = (block?.properties as any) || {};

  // State for preview mode selections
  const [previewSelections, setPreviewSelections] = React.useState<string[]>([]);

  React.useEffect(() => {
    // Initialize from session data in preview mode
    if (isPreviewMode && sessionData) {
      const sessionKey = `step_selections_${block?.id}`;
      const savedSelections = sessionData[sessionKey];
      if (savedSelections && Array.isArray(savedSelections)) {
        setPreviewSelections(savedSelections);
      }
    }
  }, [isPreviewMode, sessionData, block?.id]);

  // Helpers
  const toPxNumber = (val?: number | string): number | undefined => {
    if (val == null) return undefined;
    if (typeof val === 'number') return val;
    const n = parseInt(String(val), 10);
    return isNaN(n) ? undefined : n;
  };

  // 🎯 Normalizar tamanhos de imagem
  const getImageSize = () => {
    const presets = {
      small: 96,
      medium: 128,
      large: 256,
    } as const;

    // Se for uma string com "px", extrair o número
    if (typeof imageSize === 'string' && imageSize.includes('px')) {
      const size = parseInt(imageSize.replace('px', ''), 10);
      return { width: size, height: size };
    }

    // Se for um número como string
    if (typeof imageSize === 'string' && !isNaN(parseInt(imageSize, 10))) {
      const size = parseInt(imageSize, 10);
      return { width: size, height: size };
    }

    if (imageSize === 'custom') {
      const w = toPxNumber(imageWidth) ?? 150;
      const h = toPxNumber(imageHeight) ?? w;
      return { width: w, height: h };
    }

    const side = presets[imageSize as keyof typeof presets] ?? presets.medium;
    return { width: side, height: side };
  };

  const { width: imgW, height: imgH } = getImageSize();

  const cardLayoutClass =
    imageLayout === 'horizontal' && (imagePosition === 'left' || imagePosition === 'right')
      ? 'flex items-center'
      : 'flex flex-col';

  const gridColsClass = (() => {
    const colNum = typeof columns === 'string' ? parseInt(columns, 10) : columns;
    if (colNum === 1) return 'grid-cols-1';
    if (colNum === 2) return responsiveColumns ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2';
    if (colNum === 3)
      return responsiveColumns ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3';
    if (colNum === 4)
      return responsiveColumns ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-4';
    return responsiveColumns ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2';
  })();

  const imageOrderClass = (() => {
    switch (imagePosition) {
      case 'bottom':
        return 'order-last mt-3';
      case 'left':
        return 'mr-3';
      case 'right':
        return 'ml-3';
      case 'top':
      default:
        return 'mb-3';
    }
  })();

  const handleOptionSelect = (optionId: string) => {
    if (isPreviewMode) {
      // Preview mode: Handle selection with real behavior
      let newSelections: string[];

      if (multipleSelection) {
        if (previewSelections.includes(optionId)) {
          // Deselect if already selected
          if (allowDeselection) {
            newSelections = previewSelections.filter(id => id !== optionId);
          } else {
            newSelections = previewSelections; // Don't change if deselection not allowed
          }
        } else {
          // Add selection if under max limit
          if (previewSelections.length < maxSelections) {
            newSelections = [...previewSelections, optionId];
          } else {
            newSelections = previewSelections; // Don't exceed max selections
          }
        }
      } else {
        // Single selection
        if (previewSelections.includes(optionId) && allowDeselection) {
          newSelections = [];
        } else {
          newSelections = [optionId];
        }
      }

      setPreviewSelections(newSelections);

      // Save to session data
      if (onUpdateSessionData) {
        const sessionKey = `step_selections_${block?.id}`;
        onUpdateSessionData(sessionKey, newSelections);

        // Save individual option details for analytics
        const selectedOptionDetails = newSelections.map(id => {
          const option = options.find((opt: any) => opt.id === id);
          return {
            id,
            text: option?.text,
            category: option?.category,
            styleCategory: option?.styleCategory,
            points: option?.points,
          };
        });
        onUpdateSessionData(`${sessionKey}_details`, selectedOptionDetails);
      }

      // Check if we should auto-advance
      const hasMinSelections = newSelections.length >= (minSelections || 1);
      const hasRequiredSelections =
        newSelections.length >= (requiredSelections || minSelections || 1);

      // Calculate option details for completion events
      const selectedOptionDetails = newSelections.map(id => {
        const option = options.find((opt: any) => opt.id === id);
        return {
          id,
          text: option?.text,
          category: option?.category,
          styleCategory: option?.styleCategory,
          points: option?.points,
        };
      });

      if (autoAdvanceOnComplete && hasRequiredSelections && onNext) {
        console.log('🚀 OptionsGrid: Auto-advancing after selection', newSelections);

        // Trigger step completion event
        if (onStepComplete) {
          onStepComplete({
            stepId: block?.id,
            selections: newSelections,
            selectedOptionDetails,
            autoAdvance: true,
          });
        }

        // Auto-advance with delay
        setTimeout(() => {
          onNext();
        }, autoAdvanceDelay || 1500);
      } else if (onStepComplete && hasMinSelections) {
        // Just trigger completion without auto-advance
        onStepComplete({
          stepId: block?.id,
          selections: newSelections,
          selectedOptionDetails,
          autoAdvance: false,
        });
      }
    } else {
      // Editor mode: Use the property change handler
      if (onPropertyChange) {
        if (multipleSelection) {
          const currentSelections = selectedOptions || [];
          const newSelections = currentSelections.includes(optionId)
            ? currentSelections.filter((id: string) => id !== optionId)
            : [...currentSelections, optionId];
          onPropertyChange('selectedOptions', newSelections);
        } else {
          onPropertyChange('selectedOption', optionId);
        }
      }
    }
  };

  // NOTE: getCurrentSelections function available if needed
  /*
  const getCurrentSelections = () => {
    if (isPreviewMode) {
      return previewSelections;
    }
    return multipleSelection ? (selectedOptions || []) : (selectedOption ? [selectedOption] : []);
  };
  */

  // const currentSelections = getCurrentSelections(); // unused variable

  return (
    <div
      className={`${isSelected ? 'ring-2 ring-amber-500/60 ring-offset-1' : ''} ${className}`}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {/* Título interno opcional: só renderiza se existir e for permitido */}
      {question && showQuestionTitle && (
        <h2 className="text-2xl font-bold text-center mb-6">{question}</h2>
      )}

      <div
        className={`grid ${gridColsClass} ${blockClassName || ''}`}
        style={{ gap: `${gridGap}px` }}
      >
        {(options || []).map((opt: any) => (
          <div
            key={opt.id}
            className={`rounded-lg border border-neutral-200 bg-white p-4 hover:shadow-md transition-all duration-200 cursor-pointer ${cardLayoutClass}`}
            onClick={() => handleOptionSelect(opt.id)}
          >
            {opt.imageUrl && showImages && (
              <img
                src={opt.imageUrl}
                alt={opt.text || 'opção'}
                className={`object-cover rounded-md flex-shrink-0 ${imageOrderClass}`}
                width={imgW}
                height={imgH}
                style={{ width: `${imgW}px`, height: `${imgH}px` }}
                loading="lazy"
                decoding="async"
              />
            )}
            <p className={`${imageLayout === 'horizontal' ? 'flex-1' : 'text-center'} font-medium`}>
              {opt.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionsGridBlock;
