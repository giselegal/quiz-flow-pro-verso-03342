
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { BlockComponentProps } from '@/types/blocks';

export interface QuestionOption {
  id: string;
  text: string;
  value: string | number;
  imageUrl?: string;
  isCorrect?: boolean;
  weight?: number;
  category?: string;
}

export interface QuizQuestionBlockProps extends BlockComponentProps {
  id?: string;
  question?: string;
  options?: QuestionOption[];
  selectedOption?: string;
  onOptionSelect?: (optionId: string) => void;
  showImages?: boolean;
  multipleChoice?: boolean;
  questionColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  isEditable?: boolean;
  onUpdate?: (updates: any) => void;
}

const QuizQuestionBlock: React.FC<QuizQuestionBlockProps> = ({
  id = 'quiz-question',
  question = 'Qual é a sua pergunta?',
  options = [
    { id: '1', text: 'Opção 1', value: 'option1' },
    { id: '2', text: 'Opção 2', value: 'option2' },
    { id: '3', text: 'Opção 3', value: 'option3' },
    { id: '4', text: 'Opção 4', value: 'option4' }
  ],
  selectedOption = '',
  onOptionSelect = () => {},
  showImages = false,
  multipleChoice = false,
  questionColor = '#432818',
  backgroundColor = '#ffffff',
  borderColor = '#B89B7A',
  className = '',
  isEditable = false,
  onUpdate = () => {}
}) => {
  const handleOptionSelect = (optionId: string) => {
    if (onOptionSelect) {
      onOptionSelect(optionId);
    }
  };

  return (
    <div 
      className={cn(
        'quiz-question-block w-full max-w-3xl mx-auto p-8 rounded-xl shadow-lg',
        'border-2 transition-all duration-300',
        className
      )}
      style={{ 
        backgroundColor, 
        borderColor: `${borderColor}40` 
      }}
      data-block-id={id}
    >
      {/* Question */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold leading-tight" style={{ color: questionColor }}>
          {question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {options.map((option) => (
          <div
            key={option.id}
            className={cn(
              'p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
              'hover:shadow-md hover:scale-[1.02]',
              selectedOption === option.id 
                ? 'border-[#B89B7A] bg-[#B89B7A]/10' 
                : 'border-gray-200 hover:border-[#B89B7A]/50'
            )}
            onClick={() => handleOptionSelect(option.id)}
          >
            <div className="flex items-center space-x-4">
              {/* Option Image */}
              {showImages && option.imageUrl && (
                <img 
                  src={option.imageUrl} 
                  alt={option.text}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              
              {/* Option Text */}
              <div className="flex-1">
                <p className="text-lg font-medium" style={{ color: questionColor }}>
                  {option.text}
                </p>
              </div>
              
              {/* Selection Indicator */}
              <div className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                selectedOption === option.id 
                  ? 'border-[#B89B7A] bg-[#B89B7A]' 
                  : 'border-gray-300'
              )}>
                {selectedOption === option.id && (
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      {selectedOption && (
        <div className="text-center mt-8">
          <Button
            size="lg"
            className="px-8 py-3 bg-[#B89B7A] hover:bg-[#A38A69] text-white font-semibold"
          >
            Continuar
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizQuestionBlock;
