
import React from 'react';
import { useQuizHooks } from '@/hooks/useQuizHooks';

interface QuizProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentQuestionIndex,
  totalQuestions
}) => {
  const progressPercent = (currentQuestionIndex / totalQuestions) * 100;
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
      <div 
        className="bg-[#B89B7A] h-2 rounded-full transition-all duration-300"
        style={{ width: `${progressPercent}%` }}
      />
      <p className="text-sm text-gray-600 mt-2">
        Pergunta {currentQuestionIndex + 1} de {totalQuestions}
      </p>
    </div>
  );
};
