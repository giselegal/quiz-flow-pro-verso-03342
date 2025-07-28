
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserResponse } from '@/types/quiz';

interface QuizQuestionProps {
  question: any;
  onAnswer: (response: UserResponse) => void;
  currentAnswers: string[];
  showQuestionImage?: boolean;
  autoAdvance?: boolean;
  isStrategicQuestion?: boolean;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  currentAnswers,
  showQuestionImage = false,
  autoAdvance = false,
  isStrategicQuestion = false
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(currentAnswers);
  const requiredSelections = isStrategicQuestion ? 1 : 3;

  useEffect(() => {
    setSelectedOptions(currentAnswers);
  }, [currentAnswers, question?.id]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions(prev => {
      let newSelections: string[];
      
      if (prev.includes(optionId)) {
        newSelections = prev.filter(id => id !== optionId);
      } else {
        if (isStrategicQuestion) {
          newSelections = [optionId];
        } else {
          if (prev.length >= requiredSelections) {
            return prev;
          }
          newSelections = [...prev, optionId];
        }
      }

      return newSelections;
    });
  };

  const handleSubmit = () => {
    if (selectedOptions.length === requiredSelections) {
      const response: UserResponse = {
        questionId: question.id,
        answerIds: selectedOptions
      };
      onAnswer(response);
    }
  };

  if (!question) return null;

  const questionText = question.question || question.question_text || question.text;
  const questionOptions = question.options || [];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-playfair text-[#432818] mb-4">
          {questionText}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questionOptions.map((option: any) => (
          <button
            key={option.id}
            onClick={() => handleOptionSelect(option.id)}
            disabled={selectedOptions.length >= requiredSelections && !selectedOptions.includes(option.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedOptions.includes(option.id)
                ? 'border-[#B89B7A] bg-[#FAF9F7] text-[#432818]'
                : selectedOptions.length >= requiredSelections && !isStrategicQuestion
                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'border-gray-200 hover:border-[#B89B7A] text-[#8F7A6A]'
            }`}
          >
            {option.text}
          </button>
        ))}
      </div>

      {!autoAdvance && (
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={selectedOptions.length !== requiredSelections}
            className="px-8 py-3"
          >
            Continuar
          </Button>
        </div>
      )}

      <div className="text-center text-sm text-[#8F7A6A]">
        Selecionadas: {selectedOptions.length} de {requiredSelections}
      </div>
    </div>
  );
};
