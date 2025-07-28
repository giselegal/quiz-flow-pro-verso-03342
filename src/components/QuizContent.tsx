
import React from 'react';
import { QuizQuestion } from './QuizQuestion';
import { UserResponse } from '@/types/quiz';
import { QuizHeader } from './quiz/QuizHeader';
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
  handleNextClick: () => void;
  handlePrevious: () => void;
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
  handleNextClick,
  handlePrevious,
}) => {
  // Get user name from localStorage if not provided in props
  const userName = user?.userName || localStorage.getItem('userName') || '';
  
  // Determine the required selections based on question type
  const requiredSelections = showingStrategicQuestions ? 1 : (currentQuestion?.multiSelect || 3);
  
  // Check if we have enough selections to proceed
  const canProceed = currentAnswers?.length === requiredSelections;

  return (
    <>
      <QuizHeader 
        userName={userName}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        showingStrategicQuestions={showingStrategicQuestions}
        currentStrategicQuestionIndex={currentStrategicQuestionIndex}
      />

      <div className="container mx-auto px-4 py-8 w-full max-w-5xl">
        {showingStrategicQuestions ? (
          <StrategicQuestions
            currentQuestionIndex={currentStrategicQuestionIndex}
            answers={showingStrategicQuestions ? currentAnswers.reduce((acc, optionId) => {
              if (currentQuestion?.id) {
                acc[currentQuestion.id] = [optionId];
              }
              return acc;
            }, {}) : {}}
            onAnswer={handleAnswerSubmit}
          />
        ) : (
          <QuizQuestion
            question={currentQuestion}
            onAnswer={handleAnswerSubmit}
            currentAnswers={currentAnswers || []}
            showQuestionImage={true}
          />
        )}
      </div>
    </>
  );
};
