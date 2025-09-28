/**
 * 🎯 QUIZ FUNNEL CARD - Card do Funil Quiz no Dashboard
 * 
 * Funcionalidades:
 * - Exibir informações do funil quiz
 * - Acesso para edição no /editor
 * - Versões editada e publicada
 * - Status do funil
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Eye, 
  Play, 
  Settings, 
  BarChart3, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  GitBranch,
  Zap
} from 'lucide-react';
import { Link } from 'wouter';

interface QuizFunnelCardProps {
  funnelId: string;
  name: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  lastModified: Date;
  version: string;
  publishedVersion?: string;
  totalSteps: number;
  completedSteps: number;
  analytics?: {
    views: number;
    completions: number;
    conversionRate: number;
  };
  onEdit?: (funnelId: string) => void;
  onPreview?: (funnelId: string) => void;
  onPublish?: (funnelId: string) => void;
  onAnalytics?: (funnelId: string) => void;
}

export function QuizFunnelCard({
  funnelId,
  name,
  description,
  status,
  lastModified,
  version,
  publishedVersion,
  totalSteps,
  completedSteps,
  analytics,
  onEdit,
  onPreview,
  onPublish,
  onAnalytics
}: QuizFunnelCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      if (onEdit) {
        await onEdit(funnelId);
      } else {
        // Navegar para o editor com o funil
        window.open(`/editor?funnel=${funnelId}&type=quiz`, '_blank');
      }
    } catch (error) {
      console.error('❌ Erro ao abrir editor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(funnelId);
    } else {
      window.open(`/quiz-estilo?funnel=${funnelId}&mode=preview`, '_blank');
    }
  };

  const handlePublish = async () => {
    if (onPublish) {
      await onPublish(funnelId);
    }
  };

  const handleAnalytics = () => {
    if (onAnalytics) {
      onAnalytics(funnelId);
    } else {
      window.open(`/dashboard/analytics?funnel=${funnelId}`, '_blank');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-4 h-4" />;
      case 'draft': return <AlertCircle className="w-4 h-4" />;
      case 'archived': return <Clock className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'draft': return 'Rascunho';
      case 'archived': return 'Arquivado';
      default: return 'Desconhecido';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {name}
            </CardTitle>
            <p className="text-sm text-gray-600 mb-2">
              {description}
            </p>
            <div className="flex items-center space-x-2">
              <Badge className={`text-xs ${getStatusColor(status)}`}>
                {getStatusIcon(status)}
                <span className="ml-1">{getStatusText(status)}</span>
              </Badge>
              <Badge variant="outline" className="text-xs">
                <GitBranch className="w-3 h-3 mr-1" />
                v{version}
              </Badge>
              {publishedVersion && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Publicado v{publishedVersion}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Progresso das Etapas */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso das Etapas</span>
            <span className="text-sm text-gray-500">
              {completedSteps}/{totalSteps} etapas
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Analytics */}
        {analytics && (
          <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {analytics.views.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Visualizações</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {analytics.completions.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Completos</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {analytics.conversionRate.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">Conversão</div>
            </div>
          </div>
        )}

        {/* Informações do Funil */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              <span>Quiz de Estilo</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              <span>21 Etapas</span>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{lastModified.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleEdit}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isLoading ? 'Abrindo...' : 'Editar'}
          </Button>
          
          <Button
            onClick={handlePreview}
            variant="outline"
            size="sm"
          >
            <Eye className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={handleAnalytics}
            variant="outline"
            size="sm"
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
        </div>

        {/* Status de Publicação */}
        {status === 'draft' && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-800">
                  Rascunho - Não publicado
                </span>
              </div>
              <Button
                onClick={handlePublish}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="w-3 h-3 mr-1" />
                Publicar
              </Button>
            </div>
          </div>
        )}

        {status === 'published' && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm text-green-800">
                Publicado e ativo
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
