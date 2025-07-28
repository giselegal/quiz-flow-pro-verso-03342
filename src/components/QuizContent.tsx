import React from 'react';
import { QuizQuestion } from './QuizQuestion';
import { UserResponse } from '@/types/quiz';
import { Progress } from '@/components/ui/Progress';
import { AnimatedWrapper } from './ui/animated-wrapper';
import { strategicQuestions } from '@/data/strategicQuestions';
import { StrategicQuestions } from './quiz/StrategicQuestions';

interface QuizContentProps {
  user: any;
  currentQuestionIndex: number;
  totalQuestions: number;
  showingStrategicQuestions: boolean;
  currentStrategicQuestionIndex: number;
  currentQuestion: any;
  currentAnswers: string[];
  handleAnswerSubmit: (response: UserResponse) => void;
}

export const QuizContent: React.FC<QuizContentProps> = ({
  user,
  currentQuestionIndex,
  totalQuestions,
  showingStrategicQuestions,
  currentStrategicQuestionIndex,
  currentQuestion,
  currentAnswers,
  handleAnswerSubmit,
}) => {
  // Get user name from localStorage if not provided in props
  const userName = user?.userName || localStorage.getItem('userName') || '';
  
  const totalNumberOfStrategicQuestions = strategicQuestions.length;

  const progressValue = showingStrategicQuestions
    ? Math.round(((totalQuestions + currentStrategicQuestionIndex + 1) / (totalQuestions + totalNumberOfStrategicQuestions)) * 100)
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
        percent={progressValue} 
        className="w-full h-2 bg-[#B89B7A]/20 fixed top-0 left-0 z-50"
        strokeColor="#B89B7A"
        showInfo={false}
      />
      
      <AnimatedWrapper show={true} className="flex justify-center items-center pt-4 pb-2 px-4 w-full">
        <div className="text-sm text-[#1A1818]/60">
          {currentStep} de {totalSteps}
        </div>
      </AnimatedWrapper>

      <div className="container mx-auto px-4 py-8 w-full max-w-5xl">
        {showingStrategicQuestions ? (
          <StrategicQuestions
            currentQuestionIndex={currentStrategicQuestionIndex}
            answers={{}}
            onAnswer={handleAnswerSubmit}
          />
        ) : (
          <QuizQuestion
            question={currentQuestion}
            onAnswer={handleAnswerSubmit}
            currentAnswers={currentAnswers || []}
            showQuestionImage={true}
            autoAdvance={true}
          />
        )}
      </div>
    </>
  );
};
