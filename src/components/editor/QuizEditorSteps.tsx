import { Card } from '@/components/ui/card';

interface QuizOption {
  id: string;
  text: string;
  styleCategory: string;
  points: number;
  imageUrl?: string;
}

interface QuizEditorStepsProps {
  questions: Array<{
    id: string;
    title: string;
    type: string;
    options: QuizOption[];
  }>;
}

export const QuizEditorSteps: React.FC<QuizEditorStepsProps> = ({ questions = [] }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Etapas do Quiz</h2>

      {questions.map((question, index) => (
        <Card key={question.id} className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#B89B7A]/100 text-white px-2 py-1 rounded text-sm">
              {index + 1}
            </span>
            <h3 className="font-medium">{question.title}</h3>
          </div>

          <div className="space-y-2">
            {question.options.map(option => (
              <div key={option.id} style={{ backgroundColor: '#FAF9F7' }}>
                {option.imageUrl && (
                  <img
                    src={option.imageUrl}
                    alt={option.text}
                    className="w-8 h-8 object-cover rounded"
                  />
                )}
                <span className="text-sm">{option.text}</span>
                <span style={{ color: '#8B7355' }}>{option.styleCategory}</span>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {questions.length === 0 && (
        <Card style={{ color: '#8B7355' }}>
          <p>Nenhuma questão configurada ainda</p>
        </Card>
      )}
    </div>
  );
};

export default QuizEditorSteps;
