import React, { useState, useEffect } from 'react';
import type { QuizQuestion } from '@/types/quiz';

interface StrategicQuestionStepProps {
  question: QuizQuestion;
  stepNumber: number;
  questionNumber: number;
  totalStrategicQuestions: number;
  onContinue?: () => void;
  currentAnswers: Array<{ questionId: string; optionId: string; category?: string }>;
  onAnswerChange: (questionId: string, optionId: string, category?: string) => void;
}

/**
 * 🎯 STEPS 13-18: QUESTÕES ESTRATÉGICAS
 * Componente para renderizar questões estratégicas (uma seleção apenas)
 */
export const StrategicQuestionStep: React.FC<StrategicQuestionStepProps> = ({
  question,
  stepNumber,
  questionNumber,
  totalStrategicQuestions,
  onContinue,
  currentAnswers,
  onAnswerChange
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [canContinue, setCanContinue] = useState(false);

  const progressPercentage = (stepNumber / 21) * 100;

  // Initialize selected option from current answers
  useEffect(() => {
    const existing = currentAnswers.find(answer => answer.questionId === question.id);
    if (existing) {
      setSelectedOption(existing.optionId);
      setCanContinue(true);
    }
  }, [currentAnswers, question.id]);

  const handleOptionClick = (optionId: string) => {
    setSelectedOption(optionId);
    setCanContinue(true);

    // Find the option to get category
    const option = question.options.find(opt => opt.id === optionId);
    onAnswerChange(question.id, optionId, option?.styleCategory || 'Strategic');
  };

  const handleContinue = () => {
    if (canContinue && onContinue) {
      onContinue();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
      {/* Header with Logo and Back Button */}
      <div className="w-full py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
            ←
          </button>
          <img
            src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
            alt="Logo Gisele Galvão"
            className="w-20 h-20 object-contain"
          />
          <div className="w-8" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#B89B7A] h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Question Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#432818] mb-4 leading-tight">
              {question.text}
            </h1>
            <p className="text-lg text-gray-600">
              Questão Estratégica {questionNumber} de {totalStrategicQuestions}
            </p>
          </div>

          {/* Strategic Question Badge */}
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-2 bg-[#432818] text-white text-sm font-semibold rounded-full">
              💭 Pergunta Estratégica
            </span>
          </div>

          {/* Options List (Single Column) */}
          <div className="grid gap-4 mb-10 max-w-4xl mx-auto">
            {question.options.map((option) => {
              const isSelected = selectedOption === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className={`
                    relative p-6 rounded-xl border-2 text-left transition-all duration-200
                    hover:shadow-lg active:scale-[0.98]
                    ${isSelected 
                      ? 'border-[#B89B7A] bg-[#B89B7A]/10 shadow-lg' 
                      : 'border-gray-200 bg-white hover:border-[#B89B7A]/50'
                    }
                  `}
                >
                  {/* Selection Radio Button */}
                  <div className="absolute top-6 left-6 w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    {isSelected && (
                      <div className="w-3 h-3 bg-[#B89B7A] rounded-full"></div>
                    )}
                  </div>

                  {/* Option Text */}
                  <p className="text-lg font-medium text-gray-800 leading-relaxed ml-10">
                    {option.text}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className={`
                px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200
                ${canContinue 
                  ? 'bg-[#B89B7A] text-white hover:bg-[#432818] cursor-pointer shadow-lg' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {canContinue ? 'Continuar' : 'Selecione uma opção para continuar'}
            </button>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-white/90 p-3 rounded-lg text-xs text-gray-600 border max-w-xs">
          <div><strong>Strategic Question Debug</strong></div>
          <div>Step: {stepNumber}</div>
          <div>Question: {questionNumber}/{totalStrategicQuestions}</div>
          <div>ID: {question.id}</div>
          <div>Selected: {selectedOption || 'none'}</div>
          <div>Can Continue: {canContinue ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
};