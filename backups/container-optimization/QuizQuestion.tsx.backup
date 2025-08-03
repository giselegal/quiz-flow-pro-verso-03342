import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  BlockComponentProps, 
  ProgressConfig, 
  QuestionOption, 
  Alignment, 
  InteractionCallbacks 
} from './types';

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
  
  // Progresso
  progressConfig?: ProgressConfig;
  
  // Interação
  autoAdvance?: boolean; // Avança automaticamente após seleção
  autoAdvanceDelay?: number; // Delay em ms
  showNextButton?: boolean;
  nextButtonText?: string;
  
  // Valores iniciais
  initialSelections?: string[];
  
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
  
  // Progresso
  progressConfig,
  
  // Interação
  autoAdvance = false,
  autoAdvanceDelay = 1000,
  showNextButton = true,
  nextButtonText = 'Próxima',
  
  // Valores iniciais
  initialSelections = [],
  
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
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(initialSelections);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Classes de layout
  const layoutClasses = {
    vertical: 'flex flex-col space-y-3',
    horizontal: 'flex flex-wrap gap-3',
    grid: deviceView === 'mobile' 
      ? 'grid grid-cols-1 gap-3' 
      : 'grid grid-cols-2 gap-3'
  };

  // Classes de alinhamento
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const selectedOptions = options.filter(option => 
    selectedOptionIds.includes(option.id)
  );

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
    
    const newSelectedOptions = options.filter(option => 
      newSelections.includes(option.id)
    );
    
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
    
    const baseClasses = "transition-all duration-200 cursor-pointer";
    
    let optionClasses = baseClasses;
    let contentClasses = "";
    
    switch (optionStyle) {
      case 'card':
        optionClasses += ` p-4 border-2 rounded-lg ${
          isSelected 
            ? 'border-[#B89B7A] bg-[#B89B7A]/10' 
            : 'border-gray-200 hover:border-[#B89B7A]/50'
        }`;
        contentClasses = "flex items-center space-x-3";
        break;
      case 'button':
        optionClasses += ` px-6 py-3 rounded-lg ${
          isSelected 
            ? 'bg-[#B89B7A] text-white' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        }`;
        contentClasses = "text-center";
        break;
      case 'radio':
      case 'checkbox':
        optionClasses += " p-3 hover:bg-gray-50 rounded";
        contentClasses = "flex items-center space-x-3";
        break;
    }
    
    return (
      <div
        key={option.id}
        className={optionClasses}
        onClick={() => handleOptionSelect(option.id)}
        data-testid={`option-${option.id}`}
      >
        <div className={option.imageUrl ? "space-y-3" : contentClasses}>
          {/* Indicador de seleção */}
          {optionStyle === 'radio' && (
            <div className={`w-4 h-4 rounded-full border-2 ${
              isSelected ? 'border-[#B89B7A] bg-[#B89B7A]' : 'border-gray-300'
            }`}>
              {isSelected && (
                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
              )}
            </div>
          )}
          
          {optionStyle === 'checkbox' && (
            <div className={`w-4 h-4 border-2 rounded ${
              isSelected ? 'border-[#B89B7A] bg-[#B89B7A]' : 'border-gray-300'
            }`}>
              {isSelected && (
                <svg className="w-3 h-3 text-white mt-0.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          )}
          
          {/* Imagem da opção (se houver) */}
          {option.imageUrl && (
            <div className="w-full mb-3">
              <img
                src={option.imageUrl}
                alt={option.text}
                className="w-full h-32 object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          )}
          
          {/* Texto e letra em uma linha quando há imagem */}
          <div className={option.imageUrl ? "flex items-center space-x-3" : "contents"}>
            {/* Letra da opção */}
            {showLetters && optionStyle === 'card' && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                isSelected ? 'bg-[#B89B7A] text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {letter}
              </div>
            )}
            
            {/* Texto da opção */}
            <span className="flex-1 text-left">{option.text}</span>
          </div>
        </div>
      </div>
    );
  };

  const containerClasses = `
    flex flex-col min-h-screen
    ${deviceView === 'mobile' ? 'px-4 py-6' : 
      deviceView === 'tablet' ? 'px-8 py-8' : 
      'px-12 py-12'}
    ${alignmentClasses[alignment as keyof typeof alignmentClasses]}
    ${className}
  `.trim();

  return (
    <div 
      className={containerClasses}
      style={style}
      data-testid={testId}
      {...props}
    >
      {/* Barra de Progresso */}
      {progressConfig?.showProgress && (
        <div className="w-full max-w-2xl mx-auto mb-8">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#B89B7A] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressConfig.progressValue || 0}%` }}
            />
          </div>
          {questionNumber && totalQuestions && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              Pergunta {questionNumber} de {totalQuestions}
            </p>
          )}
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full">
        {/* Pergunta */}
        <div className="mb-8">
          <h2 className={`text-2xl md:text-3xl font-bold text-[#432818] mb-4 ${
            alignment === 'center' ? 'text-center' : 
            alignment === 'right' ? 'text-right' : 'text-left'
          }`}>
            {question}
          </h2>
          
          {description && (
            <p className="text-lg text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Opções */}
        <div className={`mb-8 ${layoutClasses[optionLayout as keyof typeof layoutClasses]}`}>
          {options.map((option, index) => renderOption(option, index))}
        </div>

        {/* Erro de Validação */}
        {validationError && showValidation && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{validationError}</p>
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
