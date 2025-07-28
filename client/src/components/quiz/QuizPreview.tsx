import React from 'react';
import { ArrowLeft, Play, Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { Quiz } from '../../types/supabase';

interface QuizPreviewProps {
  quiz: Quiz;
  onBack: () => void;
}

export const QuizPreview: React.FC<QuizPreviewProps> = ({
  quiz,
  onBack
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Visualização do Quiz
                </h1>
                <p className="text-sm text-gray-500">
                  Como seu quiz aparece para os usuários
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Modo Simulação
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-2" />
                Iniciar Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview do Quiz */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Card de Apresentação do Quiz */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">
                  {quiz.title}
                </h1>
                {quiz.description && (
                  <p className="text-xl opacity-90 mb-6">
                    {quiz.description}
                  </p>
                )}
                
                {/* Badges */}
                <div className="flex justify-center space-x-2 mb-6">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {getCategoryLabel(quiz.category)}
                  </Badge>
                  <Badge className={`${getDifficultyColor(quiz.difficulty)} bg-white/20 text-white`}>
                    {getDifficultyLabel(quiz.difficulty)}
                  </Badge>
                </div>

                {/* Tags */}
                {quiz.tags && quiz.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {quiz.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-white/20 text-white text-sm px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Informações do Quiz */}
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    0
                  </div>
                  <div className="text-sm text-gray-500">
                    Perguntas
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {quiz.time_limit ? `${quiz.time_limit} min` : '∞'}
                  </div>
                  <div className="text-sm text-gray-500">
                    Tempo Limite
                  </div>
                </div>
              </div>

              {/* Estado do Quiz */}
              <div className="text-center mb-8">
                {quiz.is_published ? (
                  <div className="inline-flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Quiz Publicado</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-2 text-gray-500">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Quiz em Rascunho</span>
                  </div>
                )}
              </div>

              {/* Aviso */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Modo de Visualização
                </h3>
                <p className="text-blue-700 text-sm">
                  Esta é uma prévia de como seu quiz aparece para os usuários. 
                  Adicione perguntas no editor para ter um quiz funcional.
                </p>
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Configurações do Quiz
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Visibilidade:</span>
                <span className="ml-2 font-medium">
                  {quiz.is_public ? 'Público' : 'Privado'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className="ml-2 font-medium">
                  {quiz.is_published ? 'Publicado' : 'Rascunho'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Criado em:</span>
                <span className="ml-2 font-medium">
                  {new Date(quiz.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Atualizado em:</span>
                <span className="ml-2 font-medium">
                  {new Date(quiz.updated_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
