import React, { useState } from 'react';
import { Plus, Search, Filter, Grid, List, MoreVertical, Eye, Users, Calendar, Edit, Trash2, Copy, Share2 } from 'lucide-react';
import { useUserQuizzes } from '../../hooks/useQuiz';
import { useAuth } from '../../context/AuthContext';
import { QuizCard } from './QuizCard';
import { QuizList } from './QuizList';
import { CreateQuizModal } from './CreateQuizModal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { Quiz } from '../../types/supabase';

interface QuizDashboardProps {
  onEditQuiz?: (quiz: Quiz) => void;
  onPreviewQuiz?: (quiz: Quiz) => void;
}

export const QuizDashboard: React.FC<QuizDashboardProps> = ({
  onEditQuiz,
  onPreviewQuiz
}) => {
  const { user } = useAuth();
  const { quizzes, loading, error, createQuiz, duplicateQuiz, refetch } = useUserQuizzes();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filtrar quizzes
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || quiz.category === selectedCategory;
    
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'published' && quiz.is_published) ||
                         (selectedStatus === 'draft' && !quiz.is_published) ||
                         (selectedStatus === 'public' && quiz.is_public) ||
                         (selectedStatus === 'private' && !quiz.is_public);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateQuiz = async (quizData: {
    title: string;
    description?: string;
    category: string;
    difficulty: string;
  }) => {
    try {
      const { data, error } = await createQuiz({
        title: quizData.title,
        description: quizData.description || '',
        category: quizData.category || 'geral',
        difficulty: quizData.difficulty || 'medium',
        settings: {
          allowRetake: true,
          showResults: true,
          shuffleQuestions: false,
          showProgressBar: true,
          passingScore: 60
        }
      });

      if (error) {
        throw error;
      }

      setIsCreateModalOpen(false);
      
      // Redirecionar para o editor se um quiz foi criado
      if (data && onEditQuiz) {
        onEditQuiz(data);
      }
    } catch (err) {
      console.error('Erro ao criar quiz:', err);
    }
  };

  const handleDuplicateQuiz = async (quiz: Quiz) => {
    try {
      await duplicateQuiz(quiz.id, `${quiz.title} (Cópia)`);
    } catch (err) {
      console.error('Erro ao duplicar quiz:', err);
    }
  };

  const getQuizStats = (quiz: Quiz) => ({
    views: quiz.view_count || 0,
    completions: quiz.completion_count || 0,
    completionRate: quiz.view_count ? 
      Math.round(((quiz.completion_count || 0) / quiz.view_count) * 100) : 0
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          Erro ao carregar quizzes: {error.message}
        </div>
        <Button onClick={refetch} variant="outline">
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Quizzes</h1>
          <p className="text-gray-600">
            {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} criado{quizzes.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Quiz
        </Button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar quizzes..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <option value="all">Todas as categorias</option>
              <option value="geral">Geral</option>
              <option value="educacao">Educação</option>
              <option value="entretenimento">Entretenimento</option>
              <option value="business">Negócios</option>
              <option value="tecnologia">Tecnologia</option>
              <option value="saude">Saúde</option>
              <option value="esportes">Esportes</option>
              <option value="historia">História</option>
              <option value="ciencia">Ciência</option>
              <option value="arte">Arte</option>
            </Select>

            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <option value="all">Todos os status</option>
              <option value="published">Publicados</option>
              <option value="draft">Rascunhos</option>
              <option value="public">Públicos</option>
              <option value="private">Privados</option>
            </Select>

            {/* Toggle de visualização */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Quizzes */}
      {filteredQuizzes.length === 0 ? (
        <EmptyState
          icon={Plus}
          title={searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' 
            ? "Nenhum quiz encontrado" 
            : "Crie seu primeiro quiz"
          }
          description={searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
            ? "Tente ajustar os filtros de busca"
            : "Comece criando um quiz para engajar sua audiência"
          }
          action={
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Quiz
            </Button>
          }
        />
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredQuizzes.map((quiz) => (
            viewMode === 'grid' ? (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                stats={getQuizStats(quiz)}
                onEdit={() => onEditQuiz?.(quiz)}
                onPreview={() => onPreviewQuiz?.(quiz)}
                onDuplicate={() => handleDuplicateQuiz(quiz)}
              />
            ) : (
              <QuizList
                key={quiz.id}
                quiz={quiz}
                stats={getQuizStats(quiz)}
                onEdit={() => onEditQuiz?.(quiz)}
                onPreview={() => onPreviewQuiz?.(quiz)}
                onDuplicate={() => handleDuplicateQuiz(quiz)}
              />
            )
          ))}
        </div>
      )}

      {/* Modal de Criação */}
      <CreateQuizModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateQuiz}
      />
    </div>
  );
};
