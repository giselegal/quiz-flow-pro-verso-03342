// @ts-nocheck
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuizQuestion } from '@/types/quiz';
import QuestionEditor from './QuestionEditor';
import { Plus } from 'lucide-react';

interface QuizEditorProps {
  initialTemplate?: any;
}

const QuizEditor: React.FC<QuizEditorProps> = ({ initialTemplate }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const handleAddQuestion = () => {
    setIsCreatingNew(true);
    setEditingQuestion(null);
  };

  const handleSaveQuestion = (question: QuizQuestion) => {
    if (isCreatingNew) {
      // Create new question with proper order
      const newQuestion: QuizQuestion = {
        ...question,
        id: `question-${Date.now()}`,
        order: questions.length,
        question: question.title || question.question || '', // Ensure question property is set
        type: 'normal',
      };
      setQuestions(prev => [...prev, newQuestion]);
    } else {
      setQuestions(prev =>
        prev.map(q =>
          q.id === question.id
            ? {
                ...question,
                question: question.title || question.question || '',
              }
            : q
        )
      );
    }

    setEditingQuestion(null);
    setIsCreatingNew(false);
  };

  const handleEditQuestion = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setIsCreatingNew(false);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    setEditingQuestion(null);
  };

  const handleCancel = () => {
    setEditingQuestion(null);
    setIsCreatingNew(false);
  };

  const handleDeleteCurrent = () => {
    if (editingQuestion) {
      handleDeleteQuestion(editingQuestion.id);
    }
  };

  if (editingQuestion || isCreatingNew) {
    return (
      <QuestionEditor
        question={editingQuestion}
        onSave={handleSaveQuestion}
        onCancel={handleCancel}
        onDelete={editingQuestion ? handleDeleteCurrent : undefined}
        isNew={isCreatingNew}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#432818]">Editor de Quiz</h2>
        <Button onClick={handleAddQuestion} className="bg-[#B89B7A] hover:bg-[#A38A69] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nova Pergunta
        </Button>
      </div>

      <div className="grid gap-4">
        {questions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-[#8F7A6A] mb-4">Nenhuma pergunta adicionada ainda.</p>
            <Button
              onClick={handleAddQuestion}
              variant="outline"
              className="border-[#B89B7A] text-[#432818]"
            >
              Adicionar primeira pergunta
            </Button>
          </Card>
        ) : (
          questions.map((question, index) => (
            <Card key={question.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-[#432818] mb-2">
                    Pergunta {index + 1}: {question.title || question.question}
                  </h3>
                  <p className="text-sm text-[#8F7A6A] mb-2">
                    {question.options.length} opções • {question.multiSelect || 3} seleções
                    permitidas
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditQuestion(question)}
                  className="border-[#B89B7A] text-[#432818]"
                >
                  Editar
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default QuizEditor;
