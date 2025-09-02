import QuizQuestion from './QuizQuestion';
import { UserResponse } from '@/types/quiz';
import { QuizHeader } from './quiz/QuizHeader';
import { StrategicQuestions } from './quiz/StrategicQuestions';
import { StorageService } from '@/services/core/StorageService';

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
  // Get user name via StorageService (fallback para legacy)
  let userName = user?.userName || '';
  if (!userName) {
    try {
      userName =
        StorageService.safeGetString('userName') ||
        StorageService.safeGetString('quizUserName') ||
        '';
    } catch {
      try {
        userName = localStorage.getItem('userName') || '';
      } catch {
        userName = '';
      }
    }
  }

  // Create strategic answers object safely
  const strategicAnswers = showingStrategicQuestions
    ? currentAnswers.reduce((acc: Record<string, string[]>, optionId) => {
      if (currentQuestion?.id) {
        acc[currentQuestion.id] = [optionId];
      }
      return acc;
    }, {})
    : {};

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
            answers={strategicAnswers}
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
