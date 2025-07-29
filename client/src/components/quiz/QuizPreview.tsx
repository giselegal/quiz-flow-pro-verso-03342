
import React from 'react';
import { Quiz, Question } from '@/types/quiz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Users, BarChart } from 'lucide-react';

interface QuizPreviewProps {
  quiz: Quiz;
  onEdit?: () => void;
  onPlay?: () => void;
  showStats?: boolean;
}

export const QuizPreview: React.FC<QuizPreviewProps> = ({ 
  quiz, 
  onEdit, 
  onPlay, 
  showStats = true 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
    <div className="space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{quiz.title}</CardTitle>
              <p className="text-gray-600 mb-4">{quiz.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{quiz.category}</Badge>
                {quiz.difficulty && (
                  <Badge className={getDifficultyColor(quiz.difficulty)}>
                    {quiz.difficulty}
                  </Badge>
                )}
                {quiz.is_public && <Badge variant="outline">Público</Badge>}
                {quiz.is_published && <Badge variant="outline">Publicado</Badge>}
              </div>

              {showStats && (
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{quiz.completion_count || 0} participantes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart className="w-4 h-4" />
                    <span>{quiz.average_score}% média</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Atualizado em {formatDate(quiz.updated_at)}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="outline" onClick={onEdit}>
                  Editar
                </Button>
              )}
              {onPlay && (
                <Button onClick={onPlay}>
                  Iniciar Quiz
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quiz Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Perguntas ({quiz.questions?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!quiz.questions || quiz.questions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhuma pergunta adicionada ainda.
            </p>
          ) : (
            <div className="space-y-6">
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <h3 className="font-semibold">{question.title}</h3>
                  </div>
                  
                  <p className="mb-4">{question.text}</p>
                  
                  {question.type === 'multiple_choice' && (
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name={`question-${question.id}`} 
                            disabled 
                          />
                          <span>{option.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'single_choice' && (
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            disabled 
                          />
                          <span>{option.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'text' && (
                    <Input disabled placeholder="Resposta de texto livre" />
                  )}
                  
                  {question.type === 'rating' && (
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button key={rating} className="text-2xl" disabled>
                          ⭐
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mt-4">
                    <Badge variant="secondary">{question.type}</Badge>
                    {question.required && <Badge variant="outline">Obrigatória</Badge>}
                    {question.hint && <Badge variant="outline">Com dica</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quiz Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Limite de Tempo</label>
              <p className="text-sm text-gray-600">
                {quiz.time_limit ? `${quiz.time_limit} minutos` : 'Sem limite'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Visibilidade</label>
              <p className="text-sm text-gray-600">
                {quiz.is_public ? 'Público' : 'Privado'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <p className="text-sm text-gray-600">
                {quiz.is_published ? 'Publicado' : 'Rascunho'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPreview;
