
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Quiz } from '@/types/quiz';

interface QuizCardProps {
  quiz: Quiz;
  onEdit: (quiz: Quiz) => void;
  onDelete: (id: string) => void;
  onDuplicate: (quiz: Quiz) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onEdit, onDelete, onDuplicate }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{quiz.title}</CardTitle>
            <CardDescription className="mt-1">
              {quiz.description || 'Sem descrição'}
            </CardDescription>
          </div>
          <Badge variant={quiz.is_published ? 'default' : 'secondary'}>
            {quiz.is_published ? 'Publicado' : 'Rascunho'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{quiz.questions.length} perguntas</span>
            <span>{quiz.view_count} visualizações</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(quiz)}>
              Editar
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDuplicate(quiz)}>
              Duplicar
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(quiz.id)}>
              Excluir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
