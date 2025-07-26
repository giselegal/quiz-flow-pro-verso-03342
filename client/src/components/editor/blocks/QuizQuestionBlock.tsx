import React, { useState } from 'react';
import { ChevronLeft, CheckCircle } from 'lucide-react';

interface QuizOption {
  id: string;
  text: string;
  imageUrl?: string;
  value?: string;
  nextStepId?: string;
}

interface QuizQuestionBlockProps {
  // Header
  headerEnabled?: boolean;
  logoUrl?: string;
  showProgressBar?: boolean;
  showBackButton?: boolean;
  progressValue?: number;
  
  // Question
  questionText?: string;
  questionTextSize?: number;
  questionTextColor?: string;
  questionTextAlign?: 'left' | 'center' | 'right';
  
  // Layout
  layout?: '1-column' | '2-columns' | '3-columns';
  direction?: 'vertical' | 'horizontal';
  disposition?: 'image-text' | 'text-image' | 'text-only' | 'image-only';
  
  // Options
  options?: QuizOption[];
  
  // Validation
  isMultipleChoice?: boolean;
  isRequired?: boolean;
  autoProceed?: boolean;
  
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
  
  // Callbacks
  onOptionSelect?: (option: QuizOption | QuizOption[]) => void;
  onBack?: () => void;
  onNext?: () => void;
  
  className?: string;
}

export const QuizQuestionBlock: React.FC<QuizQuestionBlockProps> = ({
  // Header defaults
  headerEnabled = true,
  logoUrl = '',
  showProgressBar = true,
  showBackButton = true,
  progressValue = 25,
  
  // Question defaults
  questionText = 'Qual é o seu tipo de roupa favorita?',
  questionTextSize = 28,
  questionTextColor = '#000000',
  questionTextAlign = 'center',
  
  // Layout defaults
  layout = '2-columns',
  direction = 'vertical',
  disposition = 'image-text',
  
  // Options defaults
  options = [],
  
  // Validation defaults
  isMultipleChoice = false,
  isRequired = true,
  autoProceed = false,
  
  // Styling defaults
  borderRadius = 'small',
  boxShadow = 'medium',
  spacing = 'medium',
  optionStyle = 'card',
  
  // Colors defaults
  primaryColor = '#B89B7A',
  secondaryColor = '#ffffff',
  borderColor = '#e5e7eb',
  hoverColor = '#a08965',
  
  // Callbacks
  onOptionSelect,
  onBack,
  onNext,
  
  className = ''
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Style mappings
  const borderRadiusMap = {
    none: '0px',
    small: '8px',
    medium: '12px',
    large: '16px'
  };

  const shadowMap = {
    none: 'none',
    small: '0 1px 3px rgba(0,0,0,0.1)',
    medium: '0 4px 6px rgba(0,0,0,0.1)',
    large: '0 10px 15px rgba(0,0,0,0.1)'
  };

  const spacingMap = {
    small: '8px',
    medium: '16px',
    large: '24px'
  };

  const gridColsMap = {
    '1-column': 'grid-cols-1',
    '2-columns': 'grid-cols-1 md:grid-cols-2',
    '3-columns': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  };

  const handleOptionClick = (option: QuizOption) => {
    let newSelection: string[];
    
    if (isMultipleChoice) {
      newSelection = selectedOptions.includes(option.id)
        ? selectedOptions.filter(id => id !== option.id)
        : [...selectedOptions, option.id];
    } else {
      newSelection = [option.id];
    }
    
    setSelectedOptions(newSelection);
    
    if (onOptionSelect) {
      const selectedOptionObjects = options.filter(opt => newSelection.includes(opt.id));
      onOptionSelect(isMultipleChoice ? selectedOptionObjects : selectedOptionObjects[0]);
    }
    
    // Auto-proceed for single choice
    if (!isMultipleChoice && autoProceed && onNext) {
      setTimeout(() => onNext(), 300);
    }
  };

  const getOptionStyle = (optionId: string) => {
    const isSelected = selectedOptions.includes(optionId);
    const baseStyle = {
      borderRadius: borderRadiusMap[borderRadius],
      boxShadow: shadowMap[boxShadow],
      border: `2px solid ${isSelected ? primaryColor : borderColor}`,
      backgroundColor: isSelected ? primaryColor : secondaryColor,
      color: isSelected ? secondaryColor : '#333333',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      padding: spacingMap[spacing]
    };

    return baseStyle;
  };

  return (
    <div className={`quiz-question-block ${className}`}>
      {/* Header */}
      {headerEnabled && (
        <div className="header flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            {showBackButton && onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {logoUrl && (
              <img src={logoUrl} alt="Logo" className="h-8" />
            )}
          </div>
          
          {showProgressBar && (
            <div className="flex-1 max-w-xs mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${progressValue}%`,
                    backgroundColor: primaryColor
                  }}
                />
              </div>
              <div className="text-right text-sm text-gray-600 mt-1">
                {progressValue}%
              </div>
            </div>
          )}
        </div>
      )}

      {/* Question */}
      <div className="question-section p-6">
        <h2
          className="font-playfair font-bold mb-6"
          style={{
            fontSize: `${questionTextSize}px`,
            color: questionTextColor,
            textAlign: questionTextAlign,
            lineHeight: 1.2
          }}
        >
          {questionText}
        </h2>

        {/* Options Grid */}
        {options.length > 0 && (
          <div className={`grid gap-4 ${gridColsMap[layout]}`}>
            {options.map((option) => (
              <div
                key={option.id}
                className="option-item hover:scale-105 transition-transform"
                style={getOptionStyle(option.id)}
                onClick={() => handleOptionClick(option)}
              >
                {/* Selected indicator */}
                {selectedOptions.includes(option.id) && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-5 h-5" style={{ color: secondaryColor }} />
                  </div>
                )}

                {/* Option content based on disposition */}
                <div className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} items-center gap-3`}>
                  {/* Image */}
                  {(disposition === 'image-text' || disposition === 'text-image' || disposition === 'image-only') && option.imageUrl && (
                    <div className={`${disposition === 'text-image' ? 'order-2' : ''} flex-shrink-0`}>
                      <img
                        src={option.imageUrl}
                        alt={option.text}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Text */}
                  {disposition !== 'image-only' && (
                    <div className={`${disposition === 'text-image' ? 'order-1' : ''} text-center flex-1`}>
                      <span className="text-base font-medium">
                        {option.text}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Default options if none provided */}
        {options.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma opção configurada</p>
            <p className="text-sm">Configure as opções no painel de propriedades</p>
          </div>
        )}

        {/* Continue button for multiple choice */}
        {isMultipleChoice && selectedOptions.length > 0 && onNext && (
          <div className="text-center mt-6">
            <button
              onClick={onNext}
              className="px-6 py-3 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: primaryColor,
                color: secondaryColor
              }}
            >
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
