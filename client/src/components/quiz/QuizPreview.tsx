
import React from 'react';
import { Quiz } from '@/types/quiz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, Users, Star } from 'lucide-react';

interface QuizPreviewProps {
  quiz: Quiz;
  onClose: () => void;
  onEdit: () => void;
}

export const QuizPreview: React.FC<QuizPreviewProps> = ({
  quiz,
  onClose,
  onEdit
}) => {
  if (!quiz) {
    return (
      <div className="p-8 text-center text-gray-500">
        Quiz não encontrado
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{quiz.title}</CardTitle>
              <p className="text-gray-600">{quiz.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={onEdit}>
                Editar
              </Button>
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quiz Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Badge variant={quiz.is_published ? 'default' : 'secondary'}>
                  {quiz.is_published ? 'Publicado' : 'Rascunho'}
                </Badge>
                <Badge variant="outline">{quiz.category}</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {quiz.view_count || 0} visualizações
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {quiz.completion_count || 0} respostas
                  </span>
                </div>
                
                {quiz.time_limit && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {Math.floor(quiz.time_limit / 60)} minutos
                    </span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {quiz.average_score || 0}% média de acertos
                  </span>
                </div>
              </div>
            </div>

            {/* Questions Preview */}
            <div>
              <h3 className="font-semibold mb-3">
                Perguntas ({quiz.questions?.length || 0})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {quiz.questions?.map((question, index) => (
                  <div key={question.id} className="p-3 border rounded-lg">
                    <div className="flex items-start space-x-2">
                      <span className="text-sm font-medium text-gray-500">
                        {index + 1}.
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{question.question_text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {question.question_type} • {question.points} pontos
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPreview;
