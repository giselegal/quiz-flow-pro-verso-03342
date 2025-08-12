import QuizQuestion from '../QuizQuestion';
import { UserResponse } from '@/types/quiz';

export interface StrategicQuestionsProps {
  currentQuestionIndex: number;
  answers: Record<string, string[]>;
  onAnswer: (response: UserResponse) => void;
}

export const StrategicQuestions: React.FC<StrategicQuestionsProps> = ({
  currentQuestionIndex,
  answers,
  onAnswer,
}) => {
  // Simplified strategic questions implementation
  const strategicQuestions = [
    {
      id: 'strategic-1',
      question: 'Qual é o seu nome?',
      type: 'text' as const,
      options: [],
    },
  ];

  const currentQuestion = strategicQuestions[currentQuestionIndex];

  if (!currentQuestion) {
    return null;
  }

  return (
    <QuizQuestion
      question={currentQuestion}
      onAnswer={onAnswer}
      currentAnswers={answers[currentQuestion.id] || []}
      showQuestionImage={false}
      autoAdvance={false}
    />
  );
};
