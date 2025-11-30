/**
 * 🧭 QUIZ NAVIGATION BLOCK - STUB
 *
 * Componente de navegação temporário para resolver dependências
 */

import React from 'react';

export interface QuizNavigationBlockProps {
  currentStep?: number;
  totalSteps?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
}

export const QuizNavigationBlock: React.FC<QuizNavigationBlockProps> = ({
  currentStep = 1,
  totalSteps = 21,
  onNext,
  onPrevious,
  canGoNext = true,
  canGoPrevious = true,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50"
      >
        ← Anterior
      </button>

      <span className="text-sm text-gray-600">
        {currentStep} de {totalSteps}
      </span>

      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Próximo →
      </button>
    </div>
  );
};

export default QuizNavigationBlock;
