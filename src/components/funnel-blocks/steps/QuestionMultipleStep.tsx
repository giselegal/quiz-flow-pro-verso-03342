import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FunnelStepProps } from '@/types/funnel';

interface QuizOptionProps {
  id: string;
  text: string;
  imageUrl?: string;
  isSelected: boolean;
  onSelect: () => void;
  multiSelect?: boolean;
  disabled: boolean;
}

const QuizOption: React.FC<QuizOptionProps> = ({
  // id, // unused in component
  text,
  imageUrl,
  isSelected,
  onSelect,
  // multiSelect, // unused in component
  disabled,
}) => {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`p-4 border-2 rounded-lg transition-all ${
        isSelected
          ? 'border-[#B89B7A] bg-[#B89B7A]/10'
          : 'border-gray-200 hover:border-[#B89B7A]/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {imageUrl && (
        <img src={imageUrl} alt={text} className="w-full h-32 object-cover rounded mb-2" />
      )}
      <span className="text-sm font-medium">{text}</span>
    </button>
  );
};

interface QuestionMultipleStepProps extends FunnelStepProps {
  data?: {
    question?: string;
    options?: Array<{
      id: string;
      text: string;
      imageUrl?: string;
    }>;
    multiSelect?: boolean;
    minAnswers?: number;
    maxAnswers?: number;
  };
}

const QuestionMultipleStep: React.FC<QuestionMultipleStepProps> = ({
  stepNumber = 1,
  totalSteps = 7,
  onNext,
  data = {},
}) => {
  const {
    question = 'Selecione suas opções preferidas',
    options = [],
    multiSelect = false,
    minAnswers = 1,
    maxAnswers = 1,
  } = data;

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionSelect = (optionId: string) => {
    if (multiSelect) {
      setSelectedOptions(prev => {
        if (prev.includes(optionId)) {
          return prev.filter(id => id !== optionId);
        } else {
          if (prev.length < (maxAnswers || 99)) {
            return [...prev, optionId];
          }
          return prev;
        }
      });
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const canProceed =
    selectedOptions.length >= (minAnswers || 1) && selectedOptions.length <= (maxAnswers || 99);

  return (
    <div className="min-h-screen flex flex-col p-6 bg-[#FFFAF0]">
      <div className="max-w-4xl mx-auto flex-1">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#432818] mb-4">{question}</h2>
          <p className="text-[#8F7A6A]">
            Pergunta {stepNumber} de {totalSteps}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {options.map((option: any) => (
            <QuizOption
              key={option.id}
              id={option.id}
              text={option.text}
              imageUrl={option.imageUrl}
              isSelected={selectedOptions.includes(option.id)}
              onSelect={() => handleOptionSelect(option.id)}
              multiSelect={multiSelect}
              disabled={false}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onNext}
            disabled={!canProceed}
            size="lg"
            className="bg-[#B89B7A] hover:bg-[#A38A69] text-white px-8 py-3"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionMultipleStep;
