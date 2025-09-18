// @ts-nocheck
import { Button } from '@/components/ui/button';
import { getOptimizedContainerClasses } from '@/config/containerConfig';
import React, { useState } from 'react';
import {
  Alignment,
  BlockComponentProps,
  InteractionCallbacks,
  ProgressConfig,
  QuestionOption,
} from './types';

// Interface para estilos customizados
interface CustomStyles {
  optionStyles?: React.CSSProperties;
  gridGap?: string;
  columns?: string;
  imageWidth?: string;
  imageHeight?: string;
  layoutOrientation?: 'vertical' | 'horizontal';
  columnsCount?: number;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  shadowBlur?: number;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  imageSize?: number;
  contentType?: 'text-only' | 'image-only' | 'text-and-image';
  scale?: number;
  // Novos controles de seleção (paridade com renderizadores)
  selectionStyle?: 'border' | 'background' | 'shadow' | 'scale';
  selectedColor?: string;
  hoverColor?: string;
}

/**
 * QuizQuestion - Componente de pergunta de quiz configurável
 *
 * Renderiza uma pergunta com múltiplas opções, barra de progresso e validação.
 * Suporta diferentes tipos de seleção (única ou múltipla) e estilos customizados.
 *
 * @example
 * <QuizQuestion
 *   question="Qual é o seu estilo favorito?"
 *   options={[
 *     { id: '1', text: 'Clássico', value: 'classic' },
 *     { id: '2', text: 'Moderno', value: 'modern' },
 *   ]}
 *   multipleSelection={false}
 *   required={true}
 *   onAnswer={(answers) => console.log('Respostas:', answers)}
 * />
 */

export interface QuizQuestionProps extends BlockComponentProps, InteractionCallbacks {
  // Conteúdo da pergunta
  question: string;
  description?: string;
  questionNumber?: number;
  totalQuestions?: number;

  // Opções
  options: QuestionOption[];
  multipleSelection?: boolean;
  minSelections?: number;
  maxSelections?: number;

  // Validação
  required?: boolean;
  showValidation?: boolean;

  // Layout e estilos
  alignment?: Alignment;
  optionLayout?: 'vertical' | 'horizontal' | 'grid';
  optionStyle?: 'card' | 'button' | 'radio' | 'checkbox';
  showLetters?: boolean; // A, B, C, D
  optionImageSize?: 'small' | 'medium' | 'large';

  // Progresso
  progressConfig?: ProgressConfig;

  // Interação
  autoAdvance?: boolean; // Avança automaticamente após seleção
  autoAdvanceDelay?: number; // Delay em ms
  showNextButton?: boolean;
  nextButtonText?: string;

  // Valores iniciais
  initialSelections?: string[];

  // === NOVAS PROPRIEDADES CUSTOMIZADAS ===
  customStyles?: CustomStyles;

  // Callbacks específicos
  onAnswer?: (selectedOptions: QuestionOption[]) => void;
  onSelectionChange?: (selectedOptions: QuestionOption[]) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  // Conteúdo
  question,
  description,
  questionNumber,
  totalQuestions,

  // Opções
  options,
  multipleSelection = false,
  minSelections = 1,
  maxSelections = options.length,

  // Validação
  required = true,
  showValidation = true,

  // Layout
  alignment = 'center',
  optionLayout = 'vertical',
  optionStyle = 'card',
  showLetters = true,
  optionImageSize = 'medium',

  // Progresso
  progressConfig,

  // Interação
  autoAdvance = false,
  autoAdvanceDelay = 1000,
  showNextButton = true,
  nextButtonText = 'Próxima',

  // Valores iniciais
  initialSelections = [],

  // Estilos customizados
  customStyles,

  // Callbacks
  onAnswer,
  onSelectionChange,
  onNext,
  onValidation,
  onError,

  // Props base
  deviceView = 'desktop',
  className = '',
  style = {},
  testId = 'quiz-question',
  ...props
}) => {
  // Util para converter HEX em RGBA
  const hexToRgba = (hex: string, alpha: number) => {
    if (!hex) return '';
    const clean = hex.replace('#', '');
    if (clean.length !== 6) return hex;
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // LOG DE DEBUG - verificar se as opções estão chegando
  console.log('🔍 QuizQuestion DEBUG:', {
    question,
    optionsLength: options?.length,
    firstOption: options?.[0],
    multipleSelection,
    showNextButton,
  });

  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(initialSelections);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Classes de layout
  const layoutClasses = {
    vertical: 'flex flex-col space-y-3',
    horizontal: 'flex flex-wrap gap-3',
    grid: deviceView === 'mobile' ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-2 gap-4',
  };

  // Classes para tamanhos de imagem
  const imageSizeClasses = {
    small: 'h-24',
    medium: 'h-32',
    large: 'h-40',
  };

  // Classes de alinhamento
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const selectedOptions = options.filter(option => selectedOptionIds.includes(option.id));

  // Validação
  const validateSelection = (selections: string[]) => {
    if (required && selections.length === 0) {
      return 'Por favor, selecione uma opção';
    }

    if (multipleSelection) {
      if (selections.length < minSelections) {
        return `Selecione pelo menos ${minSelections} opção${minSelections > 1 ? 'ões' : ''}`;
      }
      if (selections.length > maxSelections) {
        return `Selecione no máximo ${maxSelections} opção${maxSelections > 1 ? 'ões' : ''}`;
      }
    }

    return null;
  };

  // Manipular seleção de opção
  // Estilos dinâmicos baseados nas propriedades customizadas
  const containerStyles = React.useMemo(() => {
    const baseStyles: React.CSSProperties = {
      display: 'grid',
      gap: customStyles?.gridGap || '1rem',
      gridTemplateColumns:
        customStyles?.layoutOrientation === 'horizontal'
          ? `repeat(${customStyles?.columnsCount || 2}, 1fr)`
          : '1fr',
    };

    // Aplicar bordas se configuradas
    if (customStyles?.borderWidth && customStyles?.borderWidth > 0) {
      baseStyles.border = `${customStyles.borderWidth}px solid ${customStyles?.borderColor || '#e2e8f0'}`;
      if (customStyles?.borderRadius) {
        baseStyles.borderRadius = `${customStyles.borderRadius}px`;
      }
    }

    // Aplicar sombras se configuradas
    if (customStyles?.shadowBlur && customStyles?.shadowBlur > 0) {
      const shadowColor = customStyles?.shadowColor || 'rgba(0, 0, 0, 0.1)';
      baseStyles.boxShadow = `${customStyles?.shadowOffsetX || 0}px ${customStyles?.shadowOffsetY || 2}px ${customStyles.shadowBlur}px ${shadowColor}`;
    }

    return baseStyles;
  }, [customStyles]);

  // Estilos para itens individuais
  const itemStyles = React.useMemo(() => {
    const baseStyles: React.CSSProperties = {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    };

    // Tamanho da imagem se configurado
    if (customStyles?.imageSize) {
      baseStyles.minHeight = `${customStyles.imageSize + 40}px`; // +40px para padding/texto
    }

    return baseStyles;
  }, [customStyles]);

  const handleOptionSelect = (optionId: string) => {
    let newSelections: string[];

    if (multipleSelection) {
      if (selectedOptionIds.includes(optionId)) {
        newSelections = selectedOptionIds.filter(id => id !== optionId);
      } else {
        newSelections = [...selectedOptionIds, optionId];
      }
    } else {
      newSelections = [optionId];
      setHasAnswered(true);
    }

    setSelectedOptionIds(newSelections);

    const error = validateSelection(newSelections);
    setValidationError(error);

    const newSelectedOptions = options.filter(option => newSelections.includes(option.id));

    onSelectionChange?.(newSelectedOptions);
    onValidation?.(!error);

    // Auto-advance para seleção única
    if (!multipleSelection && autoAdvance && newSelections.length > 0) {
      setTimeout(() => {
        onAnswer?.(newSelectedOptions);
        onNext?.();
      }, autoAdvanceDelay);
    }
  };

  // Submeter resposta
  const handleSubmit = () => {
    const error = validateSelection(selectedOptionIds);

    if (error) {
      setValidationError(error);
      onError?.(error);
      return;
    }

    setHasAnswered(true);
    onAnswer?.(selectedOptions);
    onNext?.();
  };

  // Renderizar opção
  const renderOption = (option: QuestionOption, index: number) => {
    const isSelected = selectedOptionIds.includes(option.id);
    const letter = String.fromCharCode(65 + index); // A, B, C, D...

    const baseClasses = 'transition-all duration-200 cursor-pointer';

  let optionClasses = baseClasses;
    let contentClasses = '';

    switch (optionStyle) {
      case 'card':
        optionClasses += ` p-4 border-2 rounded-lg ${
          isSelected ? '' : 'border-gray-200'
        }`;
        contentClasses = 'flex items-center space-x-3';
        break;
      case 'button':
        optionClasses += ` px-6 py-3 rounded-lg ${isSelected ? '' : 'bg-gray-100 text-gray-800'}`;
        contentClasses = 'text-center';
        break;
      case 'radio':
      case 'checkbox':
        optionClasses += ' p-3 hover:bg-gray-50 rounded';
        contentClasses = 'flex items-center space-x-3';
        break;
    }

    // Overrides dinâmicos conforme seleção e estilo desejado
    const selectedColor = customStyles?.selectedColor || '#B89B7A';
    const selectionStyle = customStyles?.selectionStyle || 'border';
    const overrides: React.CSSProperties = {};

    if (isSelected) {
      // Borda destacada
      overrides.borderColor = selectedColor;

      // Estilo adicional
      if (selectionStyle === 'background') {
        overrides.backgroundColor = hexToRgba(selectedColor, 0.12);
        overrides.color = undefined; // manter cores do tema
      }

      if (selectionStyle === 'shadow') {
        overrides.boxShadow = `0 0 0 4px ${hexToRgba(selectedColor, 0.3)}`;
      }

      if (selectionStyle === 'scale') {
        overrides.transform = 'scale(1.02)';
        overrides.willChange = 'transform';
      }

      // Para botão, aplicar fundo direto
      if (optionStyle === 'button') {
        overrides.backgroundColor = selectedColor;
        overrides.color = '#fff';
      }
    }

    return (
      <div
        key={option.id}
        className={optionClasses}
        style={{ ...itemStyles, ...(customStyles?.optionStyles || {}), ...overrides }}
        onClick={() => handleOptionSelect(option.id)}
        data-testid={`option-${option.id}`}
      >
        <div className={option.imageUrl ? 'space-y-3' : contentClasses}>
          {/* Indicador de seleção */}
          {optionStyle === 'radio' && (
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                isSelected ? 'border-[#B89B7A] bg-[#B89B7A]' : 'border-gray-300'
              }`}
            >
              {isSelected && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
            </div>
          )}

          {optionStyle === 'checkbox' && (
            <div
              className={`w-4 h-4 border-2 rounded ${
                isSelected ? 'border-[#B89B7A] bg-[#B89B7A]' : 'border-gray-300'
              }`}
            >
              {isSelected && (
                <svg
                  className="w-3 h-3 text-white mt-0.5 ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          )}

          {/* Imagem da opção (se houver) */}
          {option.imageUrl && customStyles?.contentType !== 'text-only' && (
            <div className="w-full mb-3">
              <img
                src={option.imageUrl}
                alt={option.text}
                className={`w-full object-cover rounded-lg`}
                style={{
                  width: customStyles?.imageSize ? `${customStyles.imageSize}px` : undefined,
                  height: customStyles?.imageSize ? `${customStyles.imageSize}px` : undefined,
                  maxWidth: '100%',
                }}
                loading="lazy"
              />
            </div>
          )}

          {/* Texto e letra em uma linha quando há imagem */}
          {customStyles?.contentType !== 'image-only' && (
            <div className={option.imageUrl ? 'flex items-center space-x-3' : 'contents'}>
              {/* Letra da opção */}
              {showLetters && optionStyle === 'card' && (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isSelected ? 'text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                  style={isSelected ? { backgroundColor: selectedColor } : undefined}
                >
                  {letter}
                </div>
              )}

              {/* Texto da opção */}
              <span className="flex-1 text-left">{option.text}</span>

              {/* Pontuação se disponível */}
              {option.points && <span style={{ color: '#8B7355' }}>{option.points} pontos</span>}
            </div>
          )}
        </div>
      </div>
    );
  };

  const containerClasses = getOptimizedContainerClasses(
    deviceView || 'desktop',
    'tight',
    'full',
    className
  );

  return (
    <div className={containerClasses} style={style} data-testid={testId} {...props}>
      {/* Barra de Progresso */}
      {progressConfig?.showProgress && (
        <div className="w-full max-w-2xl mx-auto mb-8">
          <div style={{ backgroundColor: '#E5DDD5' }}>
            <div
              className="bg-[#B89B7A] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressConfig.progressValue || 0}%` }}
            />
          </div>
          {questionNumber && totalQuestions && (
            <p style={{ color: '#6B4F43' }}>
              Pergunta {questionNumber} de {totalQuestions}
            </p>
          )}
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full">
        {/* Pergunta */}
        {question && question.trim() && (
          <div className="mb-8">
            <h2
              className={`text-2xl md:text-3xl font-bold text-[#432818] mb-4 ${
                alignment === 'center'
                  ? 'text-center'
                  : alignment === 'right'
                    ? 'text-right'
                    : 'text-left'
              }`}
            >
              {question}
            </h2>

            {description && <p style={{ color: '#6B4F43' }}>{description}</p>}
          </div>
        )}

        {/* Opções */}
        <div
          className={`mb-8 ${layoutClasses[optionLayout as keyof typeof layoutClasses]}`}
          style={containerStyles}
        >
          {options && options.length > 0 ? (
            options.map((option, index) => renderOption(option, index))
          ) : (
            <div style={{ borderColor: '#E5DDD5' }}>
              <p style={{ color: '#432818' }}>
                ⚠️ Nenhuma opção encontrada. Array de opções está vazio ou indefinido.
              </p>
              <p style={{ color: '#6B4F43' }}>Debug: options.length = {options?.length || 0}</p>
            </div>
          )}
        </div>

        {/* Erro de Validação */}
        {validationError && showValidation && (
          <div style={{ borderColor: '#E5DDD5' }}>
            <p style={{ color: '#432818' }}>{validationError}</p>
          </div>
        )}

        {/* Botão Próxima (para múltipla seleção ou quando não há auto-advance) */}
        {showNextButton && (multipleSelection || !autoAdvance) && (
          <Button
            onClick={handleSubmit}
            disabled={required && selectedOptionIds.length === 0}
            className="w-full md:w-auto mx-auto px-8 py-6 text-lg font-semibold bg-[#B89B7A] hover:bg-[#A08766] text-white transition-all duration-200"
            data-testid="next-button"
          >
            {nextButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizQuestion;
