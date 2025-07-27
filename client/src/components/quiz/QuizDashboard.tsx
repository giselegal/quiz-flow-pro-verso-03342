
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Play, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  author_id: string;
  category: string;
  difficulty: string | null;
  time_limit: number | null;
  settings: any;
  is_public: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface QuizDashboardProps {
  quizzes: Quiz[];
  onCreateQuiz: (quiz: Omit<Quiz, 'id' | 'created_at' | 'updated_at' | 'author_id'>) => void;
  onEditQuiz: (quiz: Quiz) => void;
  onDeleteQuiz: (id: string) => void;
  onPlayQuiz: (id: string) => void;
  onViewAnalytics: (id: string) => void;
}

export const QuizDashboard: React.FC<QuizDashboardProps> = ({
  quizzes,
  onCreateQuiz,
  onEditQuiz,
  onDeleteQuiz,
  onPlayQuiz,
  onViewAnalytics
}) => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    category: 'general',
    difficulty: 'medium',
    time_limit: null as number | null,
    settings: {
      allowRetake: true,
      showResults: true,
      shuffleQuestions: false,
      showProgressBar: true,
      passingScore: 70
    },
    is_public: false,
    is_published: false
  });

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (quiz.description && quiz.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || quiz.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateQuiz = () => {
    if (!user) return;
    
    const quizData = {
      ...newQuiz,
      author_id: user.id
    };
    
    onCreateQuiz(quizData);
    setNewQuiz({
      title: '',
      description: '',
      category: 'general',
      difficulty: 'medium',
      time_limit: null,
      settings: {
        allowRetake: true,
        showResults: true,
        shuffleQuestions: false,
        showProgressBar: true,
        passingScore: 70
      },
      is_public: false,
      is_published: false
    });
    setShowCreateForm(false);
  };

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'general', label: 'Geral' },
    { value: 'education', label: 'Educação' },
    { value: 'business', label: 'Negócios' },
    { value: 'technology', label: 'Tecnologia' },
    { value: 'health', label: 'Saúde' },
    { value: 'entertainment', label: 'Entretenimento' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meus Quizzes</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Quiz
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Pesquisar quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Create Quiz Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newQuiz.title}
                onChange={(e) => setNewQuiz(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Digite o título do quiz"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={newQuiz.description}
                onChange={(e) => setNewQuiz(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o quiz..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select 
                  value={newQuiz.category} 
                  onValueChange={(value) => setNewQuiz(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Dificuldade</Label>
                <Select 
                  value={newQuiz.difficulty} 
                  onValueChange={(value) => setNewQuiz(prev => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Fácil</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="hard">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateQuiz} disabled={!newQuiz.title.trim()}>
                Criar Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz List */}
      <div className="grid gap-4">
        {filteredQuizzes.map(quiz => (
          <Card key={quiz.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                  {quiz.description && (
                    <p className="text-gray-600 mb-3">{quiz.description}</p>
                  )}
                  <div className="flex gap-2 mb-3">
                    <Badge variant="secondary">{quiz.category}</Badge>
                    <Badge variant="outline">{quiz.difficulty}</Badge>
                    {quiz.is_published && <Badge variant="default">Publicado</Badge>}
                    {quiz.is_public && <Badge variant="default">Público</Badge>}
                  </div>
                  <p className="text-sm text-gray-500">
                    Criado em {new Date(quiz.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPlayQuiz(quiz.id)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Jogar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewAnalytics(quiz.id)}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Estatísticas
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditQuiz(quiz)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteQuiz(quiz.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm || filterCategory !== 'all' 
              ? 'Nenhum quiz encontrado com os filtros aplicados.' 
              : 'Você ainda não criou nenhum quiz. Comece criando seu primeiro quiz!'}
          </p>
        </div>
      )}
    </div>
  );
};
