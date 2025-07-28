
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useQuizEditor } from '../../hooks/useQuizEditor';
import { QuestionEditor } from '../editor/QuestionEditor';
import type { Quiz } from '../../types/supabase';

interface QuizEditorProps {
  quiz: Quiz;
  onBack: () => void;
}

// Transform QuizQuestion to match QuestionEditor expected interface
const transformQuizQuestion = (question: any) => ({
  id: question.id,
  text: question.question_text,
  type: question.question_type,
  options: question.options,
  correct_answers: question.correct_answers,
  points: question.points,
  time_limit: question.time_limit,
  required: question.required,
  explanation: question.explanation,
  hint: question.hint,
  media_url: question.media_url,
  media_type: question.media_type,
  tags: question.tags,
  order_index: question.order_index
});

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

  const handleUpdateQuestion = (updatedQuestion: any) => {
    updateQuestion(updatedQuestion.id, {
      question_text: updatedQuestion.text,
      question_type: updatedQuestion.type,
      options: updatedQuestion.options,
      correct_answers: updatedQuestion.correct_answers,
      points: updatedQuestion.points,
      time_limit: updatedQuestion.time_limit,
      required: updatedQuestion.required,
      explanation: updatedQuestion.explanation,
      hint: updatedQuestion.hint,
      media_url: updatedQuestion.media_url,
      media_type: updatedQuestion.media_type,
      tags: updatedQuestion.tags,
      order_index: updatedQuestion.order_index
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    deleteQuestion(questionId);
  };

  const handleDuplicateQuestion = (questionId: string) => {
    duplicateQuestion(questionId);
  };

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
            {questions.map((question, index) => (
              <QuestionEditor
                key={question.id}
                question={transformQuizQuestion(question)}
                index={index}
                onUpdate={handleUpdateQuestion}
                onDelete={() => handleDeleteQuestion(question.id)}
                onDuplicate={() => handleDuplicateQuestion(question.id)}
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
