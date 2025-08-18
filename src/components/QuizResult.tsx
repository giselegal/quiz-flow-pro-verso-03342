import { useAuth } from '@/context/AuthContext';
import { QuizResult as QuizResultType } from '@/hooks/useQuizResults';

interface QuizResultProps {
  result: QuizResultType;
  categoryScores?: Record<string, number>;
  showCategoryScores?: boolean;
  showExplanation?: boolean;
}

const QuizResult: React.FC<QuizResultProps> = ({
  result,
  categoryScores = {},
  showCategoryScores = true,
  showExplanation = true,
}) => {
  const { user } = useAuth();

  // Safely get userName from user object
  const userName = user?.name || user?.email || 'Usuário';

  return (
    <div className="quiz-result p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Parabéns, {userName}!</h1>

      {result ? (
        <div className="space-y-4">
          <div style={{ color: '#6B4F43' }}>Seu resultado: {result.title}</div>

          {showExplanation && result.description && (
            <div style={{ color: '#6B4F43' }}>{result.description}</div>
          )}

          {showCategoryScores && Object.keys(categoryScores).length > 0 && (
            <div className="category-scores mt-6">
              <h3 className="text-lg font-medium mb-2">Pontuação por categoria:</h3>
              <div className="grid gap-2">
                {Object.entries(categoryScores).map(([category, score]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="font-medium">{category}:</span>
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                      {String(score)} pontos
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p style={{ color: '#432818' }}>Resultado não disponível</p>
      )}
    </div>
  );
};

export default QuizResult;
