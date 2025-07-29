
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Quiz } from '@/types/quiz';

interface QuizPreviewProps {
  quiz: Quiz;
  onEdit: () => void;
}

export const QuizPreview: React.FC<QuizPreviewProps> = ({
  quiz,
  onEdit
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={quiz.is_published ? "default" : "secondary"}>
              {quiz.is_published ? 'Publicado' : 'Rascunho'}
            </Badge>
            <Badge variant="outline">{quiz.difficulty}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quiz.description && (
            <p className="text-gray-600">{quiz.description}</p>
          )}
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Categoria:</span> {quiz.category}
            </div>
            <div>
              <span className="font-medium">Perguntas:</span> {quiz.questions?.length || 0}
            </div>
            <div>
              <span className="font-medium">Visualizações:</span> {quiz.view_count}
            </div>
            <div>
              <span className="font-medium">Conclusões:</span> {quiz.completion_count}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onEdit}>
              Editar Quiz
            </Button>
            <Button>
              Visualizar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizPreview;
