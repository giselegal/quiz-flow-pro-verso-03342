import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { BlockComponentProps } from '@/types/blocks';

export interface QuestionOption {
  id: string;
  text: string;
  value: string;
  imageUrl?: string;
  description?: string;
}

export interface QuizQuestionBlockProps extends BlockComponentProps {
  questionNumber?: number;
  totalQuestions?: number;
  question?: string;
  options?: QuestionOption[];
  selectedOption?: string;
  onOptionSelect?: (optionId: string) => void;
  onNext?: () => void;
  onBack?: () => void;
  multipleChoice?: boolean;
  required?: boolean;
  showProgress?: boolean;
  questionColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  optionStyle?: 'cards' | 'buttons' | 'list';
  isEditable?: boolean;
  onUpdate?: (updates: any) => void;
}

const QuizQuestionBlock: React.FC<QuizQuestionBlockProps> = ({
  blockId = 'quiz-question',
  questionNumber = 1,
  totalQuestions = 10,
  question = 'Qual dessas opções mais combina com você?',
  options = [
    { id: '1', text: 'Opção A', value: 'option-a' },
    { id: '2', text: 'Opção B', value: 'option-b' },
    { id: '3', text: 'Opção C', value: 'option-c' },
    { id: '4', text: 'Opção D', value: 'option-d' }
  ],
  selectedOption = '',
  onOptionSelect = () => {},
  onNext = () => {},
  onBack = () => {},
  multipleChoice = false,
  required = true,
  showProgress = true,
  questionColor = '#432818',
  backgroundColor = '#ffffff',
  borderColor = '#B89B7A',
  optionStyle = 'cards',
  className = '',
  isEditable = false,
  onUpdate = () => {}
}) => {
  const progressPercentage = (questionNumber / totalQuestions) * 100;

  const handleUpdateProperty = (key: string, value: any) => {
    if (onUpdate) {
      onUpdate({ [key]: value });
    }
  };

  const renderOption = (option: QuestionOption) => {
    const isSelected = selectedOption === option.id;
    
    return (
      <div
        key={option.id}
        className={cn(
          'cursor-pointer transition-all duration-200',
          'border-2 rounded-lg p-4',
          'hover:shadow-md',
          isSelected 
            ? 'border-[#B89B7A] bg-[#B89B7A]/10' 
            : 'border-gray-200 hover:border-[#B89B7A]/50',
          optionStyle === 'cards' && 'bg-white shadow-sm',
          optionStyle === 'buttons' && 'bg-gray-50 hover:bg-gray-100',
          optionStyle === 'list' && 'bg-transparent'
        )}
        onClick={() => onOptionSelect(option.id)}
      >
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center',
              isSelected
                ? 'bg-[#B89B7A] border-[#B89B7A]'
                : 'border-gray-300'
            )}
          >
            {isSelected && (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
          
          {option.imageUrl && (
            <img 
              src={option.imageUrl} 
              alt={option.text}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
          
          <div className="flex-1">
            <p className="font-medium text-gray-800">{option.text}</p>
            {option.description && (
              <p className="text-sm text-gray-600 mt-1">{option.description}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={cn(
        'quiz-question-block w-full max-w-2xl mx-auto p-8 rounded-xl shadow-lg',
        'border transition-all duration-300',
        className
      )}
      style={{ backgroundColor, borderColor: `${borderColor}40` }}
      data-block-id={blockId}
    >
      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Questão {questionNumber} de {totalQuestions}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#B89B7A] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Question */}
      <div className="mb-8">
        <h2 
          className="text-2xl font-bold text-center leading-tight"
          style={{ color: questionColor }}
        >
          {question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-4 mb-8">
        {options.map(renderOption)}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={questionNumber === 1}
          size="lg"
        >
          Voltar
        </Button>
        
        <Button
          onClick={onNext}
          disabled={required && !selectedOption}
          size="lg"
          className="bg-[#B89B7A] hover:bg-[#A38A69] text-white"
        >
          {questionNumber === totalQuestions ? 'Finalizar' : 'Próxima'}
        </Button>
      </div>
    </div>
  );
};

export default QuizQuestionBlock;
