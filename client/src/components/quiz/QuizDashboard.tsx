
import React, { useState, useEffect } from 'react';
import { CreateQuizModal } from './CreateQuizModal';
import { QuizList } from './QuizList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter } from 'lucide-react';
import { useQuizzes } from '../../hooks/useQuiz';
import { useAuth } from '../../contexts/AuthContext';
import type { Quiz } from '../../types/supabase';

interface QuizDashboardProps {
  onEditQuiz: (quiz: Quiz) => void;
  onPreviewQuiz: (quiz: Quiz) => void;
}

export const QuizDashboard: React.FC<QuizDashboardProps> = ({ onEditQuiz, onPreviewQuiz }) => {
  const { user } = useAuth();
  const { quizzes, loading, error, loadQuizzes, deleteQuiz, duplicateQuiz } = useQuizzes();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (user) {
      loadQuizzes(user.id);
    }
  }, [user, loadQuizzes]);

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || quiz.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && quiz.is_published) ||
                         (filterStatus === 'draft' && !quiz.is_published);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleQuizCreated = (quiz: Quiz) => {
    loadQuizzes(user?.id || '');
  };

  const handleDeleteQuiz = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este quiz?')) {
      await deleteQuiz(id);
    }
  };

  const handleDuplicateQuiz = async (id: string) => {
    await duplicateQuiz(id);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erro: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meus Quizzes</h1>
        <CreateQuizModal onQuizCreated={handleQuizCreated} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
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
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="general">Geral</SelectItem>
                <SelectItem value="education">Educação</SelectItem>
                <SelectItem value="entertainment">Entretenimento</SelectItem>
                <SelectItem value="business">Negócios</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="published">Publicados</SelectItem>
                <SelectItem value="draft">Rascunhos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {filteredQuizzes.length} quiz(zes) encontrado(s)
          </span>
          {filterCategory !== 'all' && (
            <Badge variant="secondary">
              {filterCategory}
            </Badge>
          )}
          {filterStatus !== 'all' && (
            <Badge variant="secondary">
              {filterStatus === 'published' ? 'Publicados' : 'Rascunhos'}
            </Badge>
          )}
        </div>
      </div>

      <QuizList
        quizzes={filteredQuizzes}
        onEditQuiz={onEditQuiz}
        onPreviewQuiz={onPreviewQuiz}
        onDeleteQuiz={handleDeleteQuiz}
        onDuplicateQuiz={handleDuplicateQuiz}
        loading={loading}
      />
    </div>
  );
};
