import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuizEditor } from '../../hooks/useQuizEditor';
import { QuestionEditor } from '../editor/QuestionEditor';
import type { Quiz } from '../../types/supabase';

interface QuizEditorProps {
  quiz: Quiz;
  onBack: () => void;
}

export const QuizEditor: React.FC<QuizEditorProps> = ({ quiz, onBack }) => {
  const {
    questions,
    loading,
    error,
    updateQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    saveQuiz,
    publishQuiz,
    duplicateQuestion
  } = useQuizEditor(quiz.id);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button onClick={onBack} variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {questions.map((question) => (
              <QuestionEditor
                key={question.id}
                question={question}
                onUpdate={updateQuestion}
                onDelete={deleteQuestion}
                onDuplicate={duplicateQuestion}
              />
            ))}
            <Button onClick={addQuestion} variant="outline">
              Adicionar Pergunta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
