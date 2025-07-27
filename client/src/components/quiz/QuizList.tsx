
import React from 'react';
import { QuizCard } from './QuizCard';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Quiz } from '../../types/supabase';

interface QuizListProps {
  quizzes: Quiz[];
  onEditQuiz: (quiz: Quiz) => void;
  onPreviewQuiz: (quiz: Quiz) => void;
  onDeleteQuiz: (id: string) => void;
  onDuplicateQuiz: (id: string) => void;
  loading?: boolean;
}

export const QuizList: React.FC<QuizListProps> = ({
  quizzes,
  onEditQuiz,
  onPreviewQuiz,
  onDeleteQuiz,
  onDuplicateQuiz,
  loading = false
}) => {
  if (loading) {
    return <div>Carregando...</div>;
  }

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum quiz encontrado</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          onEdit={() => onEditQuiz(quiz)}
          onPreview={() => onPreviewQuiz(quiz)}
          onDelete={() => onDeleteQuiz(quiz.id)}
          onDuplicate={() => onDuplicateQuiz(quiz.id)}
        />
      ))}
    </div>
  );
};
