
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import type { BlockData } from '@/types/blocks';

interface QuizQuestionBlockProps {
  block: BlockData;
  className?: string;
  onUpdate?: (updates: Partial<BlockData>) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

const QuizQuestionBlock: React.FC<QuizQuestionBlockProps> = ({
  block,
  className,
  onUpdate,
  isSelected,
  onSelect
}) => {
  const properties = block.properties || {};
  const {
    question = 'Qual é a sua pergunta?',
    options = ['Opção 1', 'Opção 2', 'Opção 3'],
    allowMultiple = false,
    buttonText = 'Próxima',
    primaryColor = '#B89B7A'
  } = properties;

  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const handleOptionClick = (index: number) => {
    if (allowMultiple) {
      setSelectedOptions(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      setSelectedOptions([index]);
    }
  };

  const handleClick = () => {
    onSelect?.();
  };

  return (
    <div
      className={cn(
        'quiz-question-block w-full max-w-2xl mx-auto p-6',
        'transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500 bg-blue-50',
        className
      )}
      onClick={handleClick}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {question}
        </h2>
      </div>

      <div className="space-y-4 mb-8">
        {options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
            className={cn(
              'w-full p-4 rounded-lg border-2 text-left transition-all duration-200',
              'hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500',
              selectedOptions.includes(index)
                ? 'border-[#B89B7A] bg-[#B89B7A]/10'
                : 'border-gray-200 bg-white'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">{option}</span>
              {selectedOptions.includes(index) && (
                <div className="w-5 h-5 rounded-full bg-[#B89B7A] flex items-center justify-center">
                  <ChevronRight className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <Button 
          size="lg"
          disabled={selectedOptions.length === 0}
          className="bg-[#B89B7A] hover:bg-[#A68A6D] px-8"
        >
          {buttonText}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default QuizQuestionBlock;
