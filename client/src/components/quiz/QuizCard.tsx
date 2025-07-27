
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Users, BarChart } from 'lucide-react';
import type { Quiz } from '../../types/supabase';

interface QuizCardProps {
  quiz: Quiz;
  onEdit: (quiz: Quiz) => void;
  onPreview: (quiz: Quiz) => void;
  onDelete: (id: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onEdit, onPreview, onDelete }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{quiz.title}</CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant={quiz.is_published ? "default" : "secondary"}>
                {quiz.is_published ? 'Publicado' : 'Rascunho'}
              </Badge>
              <Badge variant="outline">{quiz.category}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {quiz.description || 'Sem descrição'}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(quiz.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{quiz.view_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>{quiz.completion_rate}%</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => onEdit(quiz)} variant="outline" size="sm">
            Editar
          </Button>
          <Button onClick={() => onPreview(quiz)} variant="outline" size="sm">
            Visualizar
          </Button>
          <Button onClick={() => onDelete(quiz.id)} variant="destructive" size="sm">
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
