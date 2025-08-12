// @ts-nocheck
import { Progress } from '../ui/progress';
import { AnimatedWrapper } from '../ui/animated-wrapper';
import caktoquizQuestions from '@/data/caktoquizQuestions';

interface QuizHeaderProps {
  userName: string | null;
  currentQuestionIndex: number;
  totalQuestions: number; // Total de questões normais
  showingStrategicQuestions: boolean;
  currentStrategicQuestionIndex: number;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  userName,
  currentQuestionIndex,
  totalQuestions,
  showingStrategicQuestions,
  currentStrategicQuestionIndex,
}) => {
  const totalNumberOfStrategicQuestions = caktoquizQuestions.length;

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
        className="flex justify-center items-center pt-4 pb-2 px-4 w-full"
      >
        <div className="text-sm text-[#1A1818]/60">
          {currentStep} de {totalSteps}
        </div>
      </AnimatedWrapper>
    </>
  );
};
