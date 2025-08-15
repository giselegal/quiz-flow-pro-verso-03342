import React, { useState, useEffect } from 'react';
import type { QuizQuestion } from '@/types/quiz';

interface QuizQuestionStepProps {
  question: QuizQuestion;
  stepNumber: number;
  questionNumber: number;
  totalQuestions: number;
  onContinue?: () => void;
  currentAnswers: Array<{ questionId: string; optionId: string; points: number }>;
  onAnswerChange: (questionId: string, optionId: string, points: number) => void;
  currentBlocks?: any[]; // Blocos editáveis do editor
}

/**
 * 🎯 STEPS 2-11: QUESTÕES PRINCIPAIS DO QUIZ
 * Componente para renderizar questões com múltipla escolha
 */
export const QuizQuestionStep: React.FC<QuizQuestionStepProps> = ({
  question,
  stepNumber,
  questionNumber,
  totalQuestions,
  onContinue,
  currentAnswers,
  onAnswerChange,
  currentBlocks = [] // 🆕 Blocos editáveis (futuro uso para personalização)
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [canContinue, setCanContinue] = useState(false);

  // 🆕 Função para extrair dados dos blocos editáveis
  const getContentFromBlocks = () => {
    if (currentBlocks.length === 0) return null;
    
    // Buscar blocos específicos por tipo/id
    const titleBlock = currentBlocks.find(b => b.type === 'heading' || b.id?.includes('title') || b.id?.includes('question'));
    const buttonBlock = currentBlocks.find(b => b.type === 'button' || b.id?.includes('button') || b.id?.includes('continue'));
    
    return {
      title: titleBlock?.content?.text || titleBlock?.properties?.text,
      buttonText: buttonBlock?.content?.text || buttonBlock?.properties?.text,
    };
  };

  const customContent = getContentFromBlocks();
  console.log('🎯 QuizQuestionStep: Conteúdo customizado extraído:', customContent);

  const maxSelections = question.multiSelect || 3;
  const progressPercentage = (stepNumber / 21) * 100;

  // Initialize selected options from current answers
  useEffect(() => {
    const existing = currentAnswers
      .filter(answer => answer.questionId === question.id)
      .map(answer => answer.optionId);
    setSelectedOptions(existing);
    setCanContinue(existing.length >= maxSelections);
  }, [currentAnswers, question.id, maxSelections]);

  const handleOptionClick = (optionId: string) => {
    setSelectedOptions(prev => {
      let newSelected: string[];

      if (prev.includes(optionId)) {
        // Deselect option
        newSelected = prev.filter(id => id !== optionId);
      } else {
        // Select option (respect max limit)
        if (prev.length >= maxSelections) {
          newSelected = [...prev.slice(1), optionId]; // Remove first, add new
        } else {
          newSelected = [...prev, optionId];
        }
      }

      // Update answers in quiz state
      newSelected.forEach(selectedOptionId => {
        const option = question.options.find(opt => opt.id === selectedOptionId);
        if (option) {
          onAnswerChange(question.id, selectedOptionId, option.weight || 1);
        }
      });

      // Check if we can continue
      const canProceed = newSelected.length >= maxSelections;
      setCanContinue(canProceed);

      // Auto-advance if we have enough selections
      if (canProceed && newSelected.length === maxSelections) {
        setTimeout(() => {
          onContinue?.();
        }, 800); // Small delay to show selection
      }

      return newSelected;
    });
  };

  const handleManualContinue = () => {
    if (canContinue && onContinue) {
      onContinue();
    }
  };

  // Check if question has images
  const hasImages = question.options.some(option => option.imageUrl);

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
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#432818] mb-4">
              {customContent?.title || question.text}
            </h1>
            <p className="text-lg text-gray-600">
              Questão {questionNumber} de {totalQuestions}
            </p>
          </div>

          {/* Selection Instructions */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-700">
              Selecione {maxSelections} opções que mais combinam com você
            </p>
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                Selecionadas: {selectedOptions.length}/{maxSelections}
              </span>
            </div>
          </div>

          {/* Options Grid */}
          <div className={`grid gap-4 mb-8 ${
            hasImages 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' 
              : 'grid-cols-1 max-w-3xl mx-auto'
          }`}>
            {question.options.map((option) => {
              const isSelected = selectedOptions.includes(option.id);
              
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
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-[#B89B7A] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                  )}

                  {/* Option Image */}
                  {option.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={option.imageUrl}
                        alt={option.text}
                        className="w-full h-48 object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Option Text */}
                  <p className="text-lg font-medium text-gray-800 leading-relaxed">
                    {option.text}
                  </p>

                  {/* Style Category Badge */}
                  {option.styleCategory && (
                    <div className="mt-3">
                      <span className="inline-block px-3 py-1 bg-[#432818] text-white text-sm rounded-full">
                        {option.styleCategory}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={handleManualContinue}
              disabled={!canContinue}
              className={`
                px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200
                ${canContinue 
                  ? 'bg-[#B89B7A] text-white hover:bg-[#432818] cursor-pointer shadow-lg' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {canContinue ? (customContent?.buttonText || 'Continuar →') : `Selecione ${maxSelections - selectedOptions.length} opção(ões) para continuar`}
            </button>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-white/90 p-3 rounded-lg text-xs text-gray-600 border max-w-xs">
          <div><strong>Quiz Question Debug</strong></div>
          <div>Step: {stepNumber}</div>
          <div>Question: {questionNumber}/{totalQuestions}</div>
          <div>ID: {question.id}</div>
          <div>Selected: {selectedOptions.length}/{maxSelections}</div>
          <div>Can Continue: {canContinue ? 'Yes' : 'No'}</div>
          <div>Has Images: {hasImages ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
};