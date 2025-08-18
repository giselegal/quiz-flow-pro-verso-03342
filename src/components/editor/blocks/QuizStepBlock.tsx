// @ts-nocheck
/**
 * QuizStepBlock - Componente completo de etapa de quiz
 *
 * Baseado no modelo fornecido, com todas as funcionalidades:
 * - Header configurável
 * - Pergunta editável
 * - Opções dinâmicas com imagens
 * - Múltiplos layouts
 * - Validação avançada
 * - Estilos customizáveis
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Minus, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import RichTextBlock from './RichTextBlock';

export interface QuizOption {
  id: string;
  text: string;
  imageUrl?: string;
  value?: string;
  nextStepId?: string;
}

export interface QuizStepBlockProps {
  blockId: string;
  // Header
  headerEnabled?: boolean;
  logoUrl?: string;
  showProgressBar?: boolean;
  showBackButton?: boolean;
  progressValue?: number;

  // Question
  questionText: string;
  questionTextSize?: number;
  questionTextColor?: string;
  questionTextAlign?: 'left' | 'center' | 'right';

  // Layout
  layout?: '1-column' | '2-columns' | '3-columns' | '4-columns';
  direction?: 'vertical' | 'horizontal';
  disposition?: 'image-text' | 'text-image' | 'text-only' | 'image-only';

  // Options
  options: QuizOption[];

  // Validation
  isMultipleChoice?: boolean;
  isRequired?: boolean;
  autoProceed?: boolean;
  minSelections?: number;
  maxSelections?: number;

  // Styling
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  boxShadow?: 'none' | 'small' | 'medium' | 'large';
  spacing?: 'small' | 'medium' | 'large';
  optionStyle?: 'simple' | 'card' | 'modern' | 'minimal';

  // Colors
  primaryColor?: string;
  secondaryColor?: string;
  borderColor?: string;
  hoverColor?: string;

  // Advanced
  componentId?: string;
  maxWidth?: number;

  // Interaction
  isSelected?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onSelect?: () => void;
  onChange?: (updates: Partial<QuizStepBlockProps>) => void;
  className?: string;
}

export // Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
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

const QuizStepBlock: React.FC<QuizStepBlockProps> = ({
  blockId,
  // Header
  headerEnabled = true,
  logoUrl = '',
  showProgressBar = true,
  showBackButton = true,
  progressValue = 25,

  // Question
  questionText = 'Qual é o seu tipo de roupa favorita?',
  questionTextSize = 28,
  questionTextColor = '#000000',
  questionTextAlign = 'center',

  // Layout
  layout = '2-columns',
  direction = 'vertical',
  disposition = 'image-text',

  // Options
  options = [],

  // Validation
  isMultipleChoice = false,
  isRequired = true,
  autoProceed = false,
  minSelections = 1,
  maxSelections = 3,

  // Styling
  borderRadius = 'small',
  boxShadow = 'medium',
  spacing = 'medium',
  optionStyle = 'card',

  // Colors
  primaryColor = '#B89B7A',
  secondaryColor = '#ffffff',
  borderColor = '#e5e7eb',
  hoverColor = '#a08965',

  // Advanced
  componentId = '',
  maxWidth = 90,

  // Interaction
  isSelected = false,
  isEditing = false,
  onEdit,
  onSelect,
  onChange,
  className = '',
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);

  // Helper functions para classes CSS
  const getLayoutClasses = (layout: string) => {
    switch (layout) {
      case '1-column':
        return 'grid-cols-1';
      case '2-columns':
        return 'grid-cols-1 md:grid-cols-2';
      case '3-columns':
        return 'grid-cols-1 md:grid-cols-2';
      case '4-columns':
        return 'grid-cols-1 md:grid-cols-2';
      default:
        return 'grid-cols-1 md:grid-cols-2';
    }
  };

  const getBorderRadiusClass = (radius: string) => {
    switch (radius) {
      case 'small':
        return 'rounded-md';
      case 'medium':
        return 'rounded-lg';
      case 'large':
        return 'rounded-xl';
      case 'none':
        return 'rounded-none';
      default:
        return 'rounded-md';
    }
  };

  const getShadowClass = (shadow: string) => {
    switch (shadow) {
      case 'small':
        return 'shadow-sm';
      case 'medium':
        return 'shadow-md';
      case 'large':
        return 'shadow-lg';
      case 'none':
        return 'shadow-none';
      default:
        return 'shadow-md';
    }
  };

  const getSpacingClass = (spacing: string) => {
    switch (spacing) {
      case 'small':
        return 'gap-2';
      case 'medium':
        return 'gap-4';
      case 'large':
        return 'gap-6';
      default:
        return 'gap-4';
    }
  };

  const getDispositionClasses = (disposition: string) => {
    switch (disposition) {
      case 'image-text':
        return 'flex-col items-center justify-start';
      case 'text-image':
        return 'flex-col-reverse items-center justify-start';
      case 'text-only':
        return 'flex-col items-center justify-center';
      case 'image-only':
        return 'flex-col items-center justify-center';
      default:
        return 'flex-col items-center justify-start';
    }
  };

  const getOptionStyleClasses = (style: string) => {
    const baseClasses = 'transition-all duration-200 cursor-pointer border';
    switch (style) {
      case 'simple':
        return `${baseClasses} bg-white hover:bg-gray-50 text-gray-800`;
      case 'card':
        return `${baseClasses} bg-white hover:bg-gray-50 text-gray-800 shadow-md`;
      case 'modern':
        return `${baseClasses} bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 text-gray-800 shadow-sm`;
      case 'minimal':
        return `${baseClasses} bg-transparent hover:bg-gray-100 text-gray-800 border-gray-200`;
      default:
        return `${baseClasses} bg-white hover:bg-gray-50 text-gray-800 shadow-md`;
    }
  };

  // Handlers
  const handleOptionClick = (optionId: string) => {
    if (isMultipleChoice) {
      const newSelected = new Set(selectedOptions);
      if (newSelected.has(optionId)) {
        newSelected.delete(optionId);
      } else if (newSelected.size < maxSelections) {
        newSelected.add(optionId);
      }
      setSelectedOptions(newSelected);
    } else {
      setSelectedOptions(new Set([optionId]));
      if (autoProceed) {
        // Auto advance logic would go here
        console.log('Auto proceeding to next step');
      }
    }
  };

  const handleQuestionChange = (newContent: string) => {
    onChange?.({ questionText: newContent });
  };

  const handleClick = () => {
    onSelect?.();
  };

  const handleDoubleClick = () => {
    onEdit?.();
  };

  const canProceed = isRequired
    ? selectedOptions.size >= minSelections && selectedOptions.size <= maxSelections
    : true;

  return (
    <div
      className={`relative transition-all duration-200 ${
        isSelected ? 'ring-2 ring-[#B89B7A] ring-opacity-50' : ''
      } ${className}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className={`p-3 md:p-5 pb-10 flex flex-col gap-4 md:gap-6 h-full justify-between rounded-lg bg-white ${getShadowClass(boxShadow)}`}
        style={{ borderColor: isSelected ? primaryColor : 'transparent' }}
      >
        {/* Header Section */}
        {headerEnabled && (
          <div className="grid gap-4">
            <div className="flex flex-row w-full h-auto justify-center relative">
              {showBackButton && (
                <Button variant="ghost" size="icon" className="h-10 w-10 absolute left-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}

              <div className="flex flex-col w-full justify-start items-center gap-4">
                {logoUrl && (
                  <img
                    width="96"
                    height="96"
                    className="max-w-24 object-cover"
                    alt="Logotipo"
                    src={logoUrl}
                  />
                )}

                {showProgressBar && (
                  <div className="w-full max-w-md">
                    <Progress
                      value={progressValue}
                      className="h-2"
                      style={
                        {
                          '--progress-background': primaryColor,
                        } as React.CSSProperties
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="main-content w-full relative mx-auto" style={{ maxWidth: `${maxWidth}%` }}>
          <div className="flex flex-col pb-10">
            {/* Question */}
            <div className="w-full mb-6">
              <RichTextBlock
                blockId={`${blockId}-question`}
                content={questionText}
                onChange={handleQuestionChange}
                isEditing={isEditingQuestion}
                className="text-center"
                minHeight={60}
                placeholder="Digite sua pergunta aqui..."
              />
            </div>

            {/* Options Grid */}
            <div className={`grid ${getLayoutClasses(layout)} ${getSpacingClass(spacing)} w-full`}>
              {options.map(option => {
                const isOptionSelected = selectedOptions.has(option.id);

                return (
                  <button
                    key={option.id}
                    className={`
                      ${getOptionStyleClasses(optionStyle)}
                      ${getBorderRadiusClass(borderRadius)}
                      ${getDispositionClasses(disposition)}
                      p-4 min-h-[80px] flex gap-3 overflow-hidden
                      ${isOptionSelected ? 'ring-2 ring-offset-2' : ''}
                    `}
                    style={
                      {
                        borderColor: isOptionSelected ? primaryColor : borderColor,
                        backgroundColor: isOptionSelected ? `${primaryColor}20` : undefined,
                        '--tw-ring-color': primaryColor,
                      } as React.CSSProperties
                    }
                    onClick={() => handleOptionClick(option.id)}
                  >
                    {/* Imagem da opção */}
                    {(disposition === 'image-text' ||
                      disposition === 'text-image' ||
                      disposition === 'image-only') &&
                      option.imageUrl && (
                        <div className="flex-shrink-0">
                          <img
                            src={option.imageUrl}
                            alt="Opção"
                            className={`w-full h-32 object-cover ${getBorderRadiusClass(borderRadius)}`}
                            style={{
                              maxWidth: disposition === 'image-only' ? '100%' : '120px',
                            }}
                          />
                        </div>
                      )}

                    {/* Texto da opção */}
                    {(disposition === 'image-text' ||
                      disposition === 'text-image' ||
                      disposition === 'text-only') && (
                      <div
                        className="flex-1 text-left flex items-center"
                        style={{
                          color: isOptionSelected ? primaryColor : '#374151',
                        }}
                      >
                        <div
                          className="rich-text-content"
                          dangerouslySetInnerHTML={{ __html: option.text }}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Continue Button */}
            {(!autoProceed || isMultipleChoice) && (
              <div className="w-full mt-6">
                <Button
                  className="w-full h-14 text-lg font-semibold disabled:opacity-50"
                  style={{
                    backgroundColor: primaryColor,
                    color: secondaryColor,
                  }}
                  disabled={!canProceed}
                  onClick={() => {
                    if (canProceed) {
                      console.log('Proceeding with selections:', Array.from(selectedOptions));
                      // Proceed logic here
                    }
                  }}
                >
                  Continuar
                  {isMultipleChoice && selectedOptions.size > 0 && (
                    <span className="ml-2 opacity-75">
                      ({selectedOptions.size}/{maxSelections})
                    </span>
                  )}
                </Button>
              </div>
            )}

            {/* Validation message */}
            {isRequired && isMultipleChoice && (
              <div style={{ color: '#6B4F43' }}>
                {minSelections === maxSelections
                  ? `Selecione ${minSelections} opções`
                  : `Selecione entre ${minSelections} e ${maxSelections} opções`}
              </div>
            )}
          </div>
        </div>

        {/* Debug/Admin info (only visible in edit mode) */}
        {isSelected && componentId && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded border">
            ID: {componentId}
          </div>
        )}
      </div>

      {/* Custom styles for option hover effects */}
      <style>{`
        .rich-text-content h1, .rich-text-content h2, .rich-text-content h3 {
          margin: 0;
          font-weight: 600;
        }
        
        .rich-text-content p {
          margin: 0;
        }
        
        .rich-text-content strong {
          font-weight: 700;
        }
        
        .rich-text-content em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default QuizStepBlock;
