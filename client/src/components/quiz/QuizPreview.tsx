
import React from 'react';
import { Clock, Users, Star, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Quiz } from '@/types/quiz';

interface QuizPreviewProps {
  quiz: Quiz;
  onStart: () => void;
  onClose: () => void;
}

export const QuizPreview: React.FC<QuizPreviewProps> = ({
  quiz,
  onStart,
  onClose
}) => {
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'Sem limite';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{quiz.title}</CardTitle>
              <p className="text-gray-600 mb-4">{quiz.description}</p>
            </div>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
              {quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1) || 'Não definido'}
            </Badge>
            <Badge variant="outline">
              {quiz.category.charAt(0).toUpperCase() + quiz.category.slice(1)}
            </Badge>
            {quiz.tags.map(tag => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{formatDuration(quiz.time_limit)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{quiz.completion_count || 0} participantes</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{quiz.average_score}% média</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{quiz.view_count} visualizações</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Sobre este quiz</h3>
            <p className="text-sm text-gray-600 mb-4">
              Este quiz contém {quiz.questions.length} perguntas e está classificado como {quiz.difficulty || 'não definido'}.
              {quiz.time_limit && ` Você terá ${formatDuration(quiz.time_limit)} para completar.`}
            </p>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={onStart} className="bg-blue-600 hover:bg-blue-700">
              Iniciar Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
