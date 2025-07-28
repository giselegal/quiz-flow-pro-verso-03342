
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Card } from '@/components/ui/Card';

interface QuizOption {
  id: string;
  text: string;
  styleCategory: string;
  points: number;
  keywords: string[];
  image?: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  type: 'single' | 'multiple';
  maxSelections?: number;
}

interface QuizContentProps {
  questions: QuizQuestion[];
  onComplete: (answers: Record<string, string[]>) => void;
  currentQuestion: number;
  onNext: () => void;
  onPrev: () => void;
  answers: Record<string, string[]>;
  onAnswer: (questionId: string, selectedOptions: string[]) => void;
}

const QuizContent: React.FC<QuizContentProps> = ({
  questions,
  onComplete,
  currentQuestion,
  onNext,
  onPrev,
  answers,
  onAnswer
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  const handleOptionSelect = (optionId: string) => {
    if (question.type === 'single') {
      setSelectedOptions([optionId]);
      onAnswer(question.id, [optionId]);
    } else {
      const newSelection = selectedOptions.includes(optionId)
        ? selectedOptions.filter(id => id !== optionId)
        : [...selectedOptions, optionId];
      
      if (question.maxSelections && newSelection.length > question.maxSelections) {
        return;
      }
      
      setSelectedOptions(newSelection);
      onAnswer(question.id, newSelection);
    }
  };

  const handleNext = () => {
    if (currentQuestion === questions.length - 1) {
      onComplete(answers);
    } else {
      onNext();
      setSelectedOptions([]);
    }
  };

  const canProceed = selectedOptions.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header com progresso */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">
              Pergunta {currentQuestion + 1} de {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% completo
            </span>
          </div>
          <Progress 
            percent={progress} 
            showInfo={false}
            strokeColor="#B89B7A"
            className="h-2"
          />
        </div>

        {/* Pergunta */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-playfair font-bold text-[#432818] mb-6 text-center">
              {question.question}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option) => (
                <Card
                  key={option.id}
                  variant="component"
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    selectedOptions.includes(option.id)
                      ? 'border-[#B89B7A] bg-[#B89B7A]/10'
                      : 'hover:border-[#B89B7A]/50'
                  }`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  {option.image && (
                    <img
                      src={option.image}
                      alt={option.text}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <p className="text-[#432818] font-medium text-center">
                    {option.text}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </Card>

        {/* Navegação */}
        <div className="flex justify-between items-center">
          <Button
            variant="secondary"
            onClick={onPrev}
            disabled={currentQuestion === 0}
            className="px-6 py-3"
          >
            Anterior
          </Button>
          
          <div className="text-center">
            {question.type === 'multiple' && question.maxSelections && (
              <p className="text-sm text-gray-600 mb-2">
                Selecione até {question.maxSelections} opções
              </p>
            )}
            <p className="text-sm text-gray-600">
              {selectedOptions.length} selecionada(s)
            </p>
          </div>
          
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!canProceed}
            className="px-6 py-3 bg-[#B89B7A] hover:bg-[#A68B6A]"
          >
            {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Próxima'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizContent;
