// =============================================================================
// DASHBOARD DE QUIZZES - GERENCIAMENTO PRINCIPAL
// Sistema de Quiz Quest Challenge Verse
// =============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuizOperations } from '@/hooks/useQuizOperations';
import { Quiz } from '@shared/types/supabase';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// =============================================================================
// TIPOS
// =============================================================================

interface QuizCardProps {
  quiz: Quiz;
  onEdit: (quizId: string) => void;
  onDuplicate: (quizId: string) => void;
  onDelete: (quizId: string) => void;
  onTogglePublish: (quizId: string, isPublished: boolean) => void;
}

// =============================================================================
// COMPONENTES
// =============================================================================

const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  onEdit,
  onDuplicate,
  onDelete,
  onTogglePublish,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return 'Data inválida';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return difficulty;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {quiz.title}
          </h3>
          
          {quiz.description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {quiz.description}
            </p>
          )}
        </div>
        
        {quiz.thumbnail_url && (
          <img 
            src={quiz.thumbnail_url} 
            alt={quiz.title}
            className="w-16 h-16 object-cover rounded-lg ml-4 flex-shrink-0"
          />
        )}
      </div>

      {/* Tags e Status */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
          {getDifficultyLabel(quiz.difficulty)}
        </span>
        
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {quiz.category}
        </span>
        
        {quiz.is_published && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Publicado
          </span>
        )}
        
        {quiz.is_public && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Público
          </span>
        )}
      </div>

      {/* Estatísticas */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <span>👁️ {quiz.view_count || 0}</span>
          <span>✅ {quiz.completion_count || 0}</span>
          {quiz.time_limit && <span>⏱️ {quiz.time_limit}min</span>}
        </div>
        <div>
          v{quiz.version}
        </div>
      </div>

      {/* Data de atualização */}
      <div className="text-xs text-gray-400 mb-4">
        Atualizado {formatDate(quiz.updated_at)}
      </div>

      {/* Ações */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(quiz.id)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Editar
          </button>
          
          <button
            onClick={() => onDuplicate(quiz.id)}
            className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
          >
            Duplicar
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onTogglePublish(quiz.id, !quiz.is_published)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              quiz.is_published
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {quiz.is_published ? 'Despublicar' : 'Publicar'}
          </button>
          
          <button
            onClick={() => onDelete(quiz.id)}
            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const QuizDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    getUserQuizzes,
    duplicateQuiz,
    deleteQuiz,
    publishQuiz,
    unpublishQuiz,
    loading,
    error,
    clearError,
  } = useQuizOperations();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'updated_at' | 'created_at' | 'title' | 'view_count'>('updated_at');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // =============================================================================
  // EFEITOS
  // =============================================================================

  useEffect(() => {
    if (user && !authLoading) {
      loadQuizzes();
    }
  }, [user, authLoading]);

  // =============================================================================
  // FUNÇÕES
  // =============================================================================

  const loadQuizzes = async () => {
    try {
      const userQuizzes = await getUserQuizzes();
      setQuizzes(userQuizzes);
    } catch (error) {
      console.error('Erro ao carregar quizzes:', error);
    }
  };

  const handleCreateNew = () => {
    window.location.href = '/quiz-editor?new=true';
  };

  const handleEdit = (quizId: string) => {
    window.location.href = `/quiz-editor/${quizId}`;
  };

  const handleDuplicate = async (quizId: string) => {
    try {
      const duplicatedQuiz = await duplicateQuiz(quizId);
      if (duplicatedQuiz) {
        await loadQuizzes();
        alert('Quiz duplicado com sucesso!');
      }
    } catch (error) {
      alert('Erro ao duplicar quiz');
    }
  };

  const handleDelete = async (quizId: string) => {
    if (showDeleteConfirm !== quizId) {
      setShowDeleteConfirm(quizId);
      return;
    }

    try {
      const success = await deleteQuiz(quizId);
      if (success) {
        await loadQuizzes();
        alert('Quiz excluído com sucesso!');
      }
    } catch (error) {
      alert('Erro ao excluir quiz');
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const handleTogglePublish = async (quizId: string, shouldPublish: boolean) => {
    try {
      if (shouldPublish) {
        await publishQuiz(quizId);
      } else {
        await unpublishQuiz(quizId);
      }
      await loadQuizzes();
    } catch (error) {
      alert(`Erro ao ${shouldPublish ? 'publicar' : 'despublicar'} quiz`);
    }
  };

  // =============================================================================
  // FILTROS E ORDENAÇÃO
  // =============================================================================

  const filteredQuizzes = quizzes
    .filter(quiz => {
      // Filtro por busca
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!quiz.title.toLowerCase().includes(searchLower) &&
            !quiz.description?.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Filtro por categoria
      if (filterCategory !== 'all' && quiz.category !== filterCategory) {
        return false;
      }

      // Filtro por status
      if (filterStatus === 'published' && !quiz.is_published) return false;
      if (filterStatus === 'draft' && quiz.is_published) return false;
      if (filterStatus === 'public' && !quiz.is_public) return false;
      if (filterStatus === 'private' && quiz.is_public) return false;

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'view_count':
          return (b.view_count || 0) - (a.view_count || 0);
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default: // updated_at
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

  const categories = [...new Set(quizzes.map(quiz => quiz.category))];

  // =============================================================================
  // LOADING STATE
  // =============================================================================

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Quizzes</h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus quizzes e acompanhe o desempenho
          </p>
        </div>
        
        <button
          onClick={handleCreateNew}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Novo Quiz
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Busca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="published">Publicados</option>
              <option value="draft">Rascunhos</option>
              <option value="public">Públicos</option>
              <option value="private">Privados</option>
            </select>
          </div>

          {/* Ordenação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="updated_at">Última atualização</option>
              <option value="created_at">Data de criação</option>
              <option value="title">Título</option>
              <option value="view_count">Visualizações</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{quizzes.length}</div>
          <div className="text-gray-600">Total de Quizzes</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {quizzes.filter(q => q.is_published).length}
          </div>
          <div className="text-gray-600">Publicados</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">
            {quizzes.reduce((sum, q) => sum + (q.view_count || 0), 0)}
          </div>
          <div className="text-gray-600">Total de Visualizações</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-purple-600">
            {quizzes.reduce((sum, q) => sum + (q.completion_count || 0), 0)}
          </div>
          <div className="text-gray-600">Tentativas Completas</div>
        </div>
      </div>

      {/* Lista de Quizzes */}
      {filteredQuizzes.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' 
              ? 'Nenhum quiz encontrado' 
              : 'Nenhum quiz criado ainda'
            }
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
              ? 'Tente ajustar os filtros para encontrar seus quizzes.'
              : 'Comece criando seu primeiro quiz para engajar sua audiência.'
            }
          </p>
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Criar Primeiro Quiz
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map(quiz => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onTogglePublish={handleTogglePublish}
            />
          ))}
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmar Exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir este quiz? Esta ação não pode ser desfeita.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="ml-3 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDashboard;
