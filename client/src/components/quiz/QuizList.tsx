
import React from 'react';
import { Quiz } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Users, Clock, Edit } from 'lucide-react';

interface QuizListProps {
  quizzes: Quiz[];
  onQuizSelect: (quiz: Quiz) => void;
  onQuizEdit: (quiz: Quiz) => void;
}

export const QuizList: React.FC<QuizListProps> = ({
  quizzes,
  onQuizSelect,
  onQuizEdit
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.map((quiz) => (
        <div
          key={quiz.id}
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onQuizSelect(quiz)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{quiz.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {quiz.description}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <Badge variant={quiz.is_published ? 'default' : 'secondary'}>
              {quiz.is_published ? 'Publicado' : 'Rascunho'}
            </Badge>
            <Badge variant="outline">{quiz.category}</Badge>
          </div>

          <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {quiz.view_count || 0}
            </div>
            {quiz.time_limit && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {Math.floor(quiz.time_limit / 60)}min
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {quiz.questions.length} pergunta(s)
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onQuizEdit(quiz);
              }}
            >
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizList;
