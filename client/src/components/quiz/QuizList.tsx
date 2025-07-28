import React from 'react';
import { Calendar, Eye, Users, MoreVertical, Edit, Copy, Share2, Trash2, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { DropdownMenu } from '../ui/DropdownMenu';
import type { Quiz } from '../../types/supabase';

interface QuizStats {
  views: number;
  completions: number;
  completionRate: number;
}

interface QuizListProps {
  quiz: Quiz;
  stats: QuizStats;
  onEdit?: () => void;
  onPreview?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

export const QuizList: React.FC<QuizListProps> = ({
  quiz,
  stats,
  onEdit,
  onPreview,
  onDuplicate,
  onDelete,
  onShare
}) => {
  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string | null) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return difficulty || 'N/A';
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      geral: 'Geral',
      educacao: 'Educação',
      entretenimento: 'Entretenimento',
      business: 'Negócios',
      tecnologia: 'Tecnologia',
      saude: 'Saúde',
      esportes: 'Esportes',
      historia: 'História',
      ciencia: 'Ciência',
      arte: 'Arte'
    };
    return categories[category] || category;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 p-6">
      <div className="flex items-center justify-between">
        {/* Conteúdo Principal */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {quiz.title.charAt(0).toUpperCase()}
          </div>

          {/* Informações do Quiz */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-gray-900 text-lg truncate">
                {quiz.title}
              </h3>
              
              {/* Badges */}
              <div className="flex space-x-2">
                <Badge variant="secondary">
                  {getCategoryLabel(quiz.category)}
                </Badge>
                <Badge className={getDifficultyColor(quiz.difficulty)}>
                  {getDifficultyLabel(quiz.difficulty)}
                </Badge>
                {quiz.is_published ? (
                  <Badge className="bg-green-100 text-green-800">
                    Publicado
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800">
                    Rascunho
                  </Badge>
                )}
                {quiz.is_public && (
                  <Badge className="bg-blue-100 text-blue-800">
                    Público
                  </Badge>
                )}
              </div>
            </div>

            {quiz.description && (
              <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                {quiz.description}
              </p>
            )}

            {/* Tags */}
            {quiz.tags && quiz.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {quiz.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
                {quiz.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{quiz.tags.length - 3} mais
                  </span>
                )}
              </div>
            )}

            <div className="text-sm text-gray-500">
              Atualizado {new Date(quiz.updated_at).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 text-sm text-gray-500 mr-6">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{stats.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{stats.completions.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{stats.completionRate}%</span>
          </div>
        </div>

        {/* Menu de Ações */}
        <DropdownMenu
          trigger={
            <Button variant="ghost" size="sm" className="p-1">
              <MoreVertical className="w-4 h-4" />
            </Button>
          }
        >
          <div className="py-1">
            <button
              onClick={onEdit}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit className="w-4 h-4 mr-3" />
              Editar
            </button>
            <button
              onClick={onPreview}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Play className="w-4 h-4 mr-3" />
              Visualizar
            </button>
            <button
              onClick={onDuplicate}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Copy className="w-4 h-4 mr-3" />
              Duplicar
            </button>
            <button
              onClick={onShare}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Share2 className="w-4 h-4 mr-3" />
              Compartilhar
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button
              onClick={onDelete}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-3" />
              Excluir
            </button>
          </div>
        </DropdownMenu>
      </div>
    </div>
  );
};
