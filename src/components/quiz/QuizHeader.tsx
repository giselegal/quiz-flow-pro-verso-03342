// @ts-nocheck
import caktoquizQuestions from '@/data/caktoquizQuestions';
import { calculateQuizScore } from '@/data/correctQuizQuestions';
import { useMemo } from 'react';
import { AnimatedWrapper } from '../ui/animated-wrapper';
import { Progress } from '../ui/progress';

interface QuizHeaderProps {
  userName: string | null;
  currentQuestionIndex: number;
  totalQuestions: number; // Total de questões normais
  showingStrategicQuestions: boolean;
  currentStrategicQuestionIndex: number;
  // ✅ NOVO: Sistema de pontuação
  userAnswers?: Record<string, string>;
  showScore?: boolean;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  userName,
  currentQuestionIndex,
  totalQuestions,
  showingStrategicQuestions,
  currentStrategicQuestionIndex,
  userAnswers = {},
  showScore = false,
}) => {
  const totalNumberOfStrategicQuestions = caktoquizQuestions.length;

  // ✅ CÁLCULO DE PONTUAÇÃO EM TEMPO REAL
  const scoreData = useMemo(() => {
    if (!showScore || Object.keys(userAnswers).length === 0) return null;
    return calculateQuizScore(userAnswers);
  }, [userAnswers, showScore]);

  const progressValue = showingStrategicQuestions
    ? Math.round(
        ((totalQuestions + currentStrategicQuestionIndex + 1) /
          (totalQuestions + totalNumberOfStrategicQuestions)) *
          100
      )
    : Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  const currentStep = showingStrategicQuestions
    ? totalQuestions + currentStrategicQuestionIndex + 1
    : currentQuestionIndex + 1;

  const totalSteps = showingStrategicQuestions
    ? totalQuestions + totalNumberOfStrategicQuestions
    : totalQuestions;

  return (
    <>
      <Progress
        value={progressValue}
        className="w-full h-2 bg-[#B89B7A]/20 fixed top-0 left-0 z-50"
        indicatorClassName="bg-[#B89B7A]"
      />

      <AnimatedWrapper
        show={true}
        className="flex justify-between items-center pt-4 pb-2 px-4 w-full"
      >
        <div className="text-sm text-[#1A1818]/60">
          {currentStep} de {totalSteps}
        </div>

        {/* ✅ NOVO: Exibição de pontuação em tempo real */}
        {showScore && scoreData && (
          <div className="text-sm font-medium text-[#B89B7A]">
            {scoreData.percentage}% • {scoreData.profile}
          </div>
        )}
      </AnimatedWrapper>
    </>
  );
};
