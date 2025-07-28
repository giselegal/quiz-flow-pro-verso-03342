
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Plus, Search, Filter } from 'lucide-react';
import type { Quiz } from '../../types/supabase';

interface QuizDashboardProps {
  onEditQuiz: (quiz: Quiz) => void;
  onPreviewQuiz: (quiz: Quiz) => void;
  onStartQuiz?: () => void;
}

export const QuizDashboard: React.FC<QuizDashboardProps> = ({ 
  onEditQuiz, 
  onPreviewQuiz, 
  onStartQuiz 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for now
  const mockQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'Descubra Seu Estilo',
      description: 'Quiz para descobrir seu estilo pessoal',
      author_id: '1',
      category: 'lifestyle',
      difficulty: 'easy',
      time_limit: null,
      is_public: true,
      is_published: true,
      is_template: false,
      thumbnail_url: null,
      tags: ['estilo', 'moda'],
      view_count: 0,
      completion_rate: 0,
      average_score: 0,
      settings: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    setQuizzes(mockQuizzes);
  }, []);

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meus Quizzes</h1>
        <Button onClick={() => console.log('Create quiz')}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Quiz
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredQuizzes.map((quiz) => (
          <Card key={quiz.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{quiz.title}</h3>
                <p className="text-gray-600 mt-1">{quiz.description}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{quiz.category}</Badge>
                  {quiz.is_published && <Badge variant="default">Publicado</Badge>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onEditQuiz(quiz)}>
                  Editar
                </Button>
                <Button variant="outline" onClick={() => onPreviewQuiz(quiz)}>
                  Visualizar
                </Button>
                {onStartQuiz && (
                  <Button onClick={onStartQuiz}>
                    Iniciar
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
