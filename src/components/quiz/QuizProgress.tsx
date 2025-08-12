// @ts-nocheck
import { useQuizHooks } from '@/hooks/useQuizHooks';

interface QuizProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentQuestionIndex,
  totalQuestions,
}) => {
  const progressPercent = (currentQuestionIndex / totalQuestions) * 100;

  return (
    <div style={{ backgroundColor: '#E5DDD5' }}>
      <div
        className="bg-[#B89B7A] h-2 rounded-full transition-all duration-300"
        style={{ width: `${progressPercent}%` }}
      />
      <p style={{ color: '#6B4F43' }}>
        Pergunta {currentQuestionIndex + 1} de {totalQuestions}
      </p>
    </div>
  );
};
