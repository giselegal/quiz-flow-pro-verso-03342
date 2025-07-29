
import React from 'react';
import { Quiz } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [difficultyFilter, setDifficultyFilter] = React.useState('all');

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || quiz.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'all' || quiz.difficulty === difficultyFilter;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meus Quizzes</h1>
          <p className="text-gray-600">Gerencie seus quizzes criados</p>
        </div>
        <Button onClick={onCreateQuiz} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Criar Quiz
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Categorias</SelectItem>
            <SelectItem value="general">Geral</SelectItem>
            <SelectItem value="education">Educação</SelectItem>
            <SelectItem value="entertainment">Entretenimento</SelectItem>
            <SelectItem value="business">Negócios</SelectItem>
          </SelectContent>
        </Select>

        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Dificuldade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Dificuldades</SelectItem>
            <SelectItem value="easy">Fácil</SelectItem>
            <SelectItem value="medium">Médio</SelectItem>
            <SelectItem value="hard">Difícil</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onQuizSelect(quiz)}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg truncate">{quiz.title}</h3>
              <Badge variant={quiz.is_published ? "default" : "secondary"}>
                {quiz.is_published ? "Publicado" : "Rascunho"}
              </Badge>
            </div>
            
            {quiz.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {quiz.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{quiz.category}</span>
              <span>{quiz.difficulty}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum quiz encontrado.</p>
          <Button onClick={onCreateQuiz} variant="outline" className="mt-4">
            Criar seu primeiro quiz
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizDashboard;
