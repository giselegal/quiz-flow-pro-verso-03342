// @ts-nocheck
import { useQuestionScroll } from '@/hooks/useQuestionScroll';

interface QuizQuestionProps {
  question: any;
  onAnswer: (answer: any) => void;
  currentAnswers: string[];
  showQuestionImage?: boolean;
  autoAdvance?: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  currentAnswers,
  showQuestionImage = true,
  autoAdvance = false,
}) => {
  // Fix the parameter type - useQuestionScroll expects number, not string
  const questionIndex = parseInt(question?.id?.replace(/\D/g, '') || '0', 10);
  useQuestionScroll(questionIndex);

  return (
    <div className="quiz-question p-6">
      <h2 className="text-xl font-bold mb-4">{question?.title || 'Question'}</h2>

      {showQuestionImage && question?.imageUrl && (
        <img
          src={question.imageUrl}
          alt="Question"
          className="w-full max-w-md mx-auto mb-6 rounded-lg"
        />
      )}

      <div className="space-y-3">
        {question?.options?.map((option: any) => (
          <div
            key={option.id}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              currentAnswers.includes(option.id)
                ? 'bg-[#B89B7A]/20 border-[#B89B7A]'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onAnswer({ questionId: question.id, selectedOption: option.id })}
          >
            <span>{option.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;
