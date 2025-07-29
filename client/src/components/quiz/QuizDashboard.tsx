
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Quiz } from '@/types/quiz';

interface QuizDashboardProps {
  quizzes: Quiz[];
  onQuizSelect: (quiz: Quiz) => void;
  onCreateQuiz: () => void;
}

const QuizDashboard: React.FC<QuizDashboardProps> = ({
  quizzes,
  onQuizSelect,
  onCreateQuiz
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Quiz Dashboard</h1>
        <Button onClick={onCreateQuiz} className="flex items-center gap-2">
          <Plus size={16} />
          Criar Novo Quiz
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar quizzes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <Card key={quiz.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {quiz.title}
                <Badge variant="secondary">{quiz.category}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{quiz.description}</p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => onQuizSelect(quiz)}
                  className="flex items-center gap-1"
                >
                  <Edit size={14} />
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuizDashboard;
