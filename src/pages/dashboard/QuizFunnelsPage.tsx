/**
 * 🎯 QUIZ FUNNELS PAGE - Página de Gerenciamento de Funis Quiz
 * 
 * Funcionalidades:
 * - Lista de funis quiz editáveis
 * - Acesso para edição no /editor
 * - Versões editada e publicada
 * - Status dos funis
 * - Analytics integrados
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  RefreshCw,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Play,
  Archive,
  Trash2
} from 'lucide-react';
import { QuizFunnelCard } from '@/components/dashboard/QuizFunnelCard';
import { unifiedCRUDService } from '@/services/UnifiedCRUDService';
import { versioningService } from '@/services/versioningService';
import { analyticsService } from '@/services/analyticsService';

interface QuizFunnel {
  id: string;
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
}

const QuizFunnelsPage: React.FC = () => {
  const [funnels, setFunnels] = useState<QuizFunnel[]>([]);
  const [filteredFunnels, setFilteredFunnels] = useState<QuizFunnel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');

  // Carregar funis quiz
  useEffect(() => {
    loadQuizFunnels();
  }, []);

  // Filtrar funis
  useEffect(() => {
    let filtered = funnels;

    // Filtro por status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(funnel => funnel.status === selectedStatus);
    }

    // Filtro por busca
    if (searchTerm.trim()) {
      filtered = filtered.filter(funnel => 
        funnel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        funnel.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFunnels(filtered);
  }, [funnels, selectedStatus, searchTerm]);

  const loadQuizFunnels = async () => {
    try {
      setIsLoading(true);
      
      // Carregar funis do UnifiedCRUDService
      // Mock de funis para demonstração
      const allFunnels = [
        {
          id: 'quiz-estilo-21-steps',
          name: 'Quiz de Estilo Pessoal',
          description: 'Quiz completo para descobrir seu estilo único',
          type: 'quiz',
          status: 'draft',
          stages: [],
          settings: {},
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      // Filtrar apenas funis quiz
      const quizFunnels = allFunnels.filter((funnel: any) => 
        funnel.id.includes('quiz') || 
        funnel.name.toLowerCase().includes('quiz') ||
        funnel.type === 'quiz'
      );

      // Converter para formato QuizFunnel
      const formattedFunnels: QuizFunnel[] = await Promise.all(
        quizFunnels.map(async (funnel: any) => {
          // Carregar analytics
          const analytics = await analyticsService.getMetricsByCategory('usage');
          const views = analytics.find(m => m.name === 'pageViews')?.value || 0;
          const completions = analytics.find(m => m.name === 'conversions')?.value || 0;
          const conversionRate = views > 0 ? (completions / views) * 100 : 0;

          // Carregar versões
          const versions = await versioningService.getSnapshots();
          const latestVersion = versions[0];
          const publishedVersion = versions.find((v: any) => v.isPublished);

          return {
            id: funnel.id,
            name: funnel.name,
            description: funnel.description || 'Quiz de Estilo Pessoal',
            status: publishedVersion ? 'published' : 'draft',
            lastModified: new Date(funnel.updatedAt),
            version: latestVersion?.version || '1.0.0',
            publishedVersion: publishedVersion?.version,
            totalSteps: 21,
            completedSteps: funnel.stages?.length || 0,
            analytics: {
              views: views,
              completions: completions,
              conversionRate: conversionRate
            }
          };
        })
      );

      setFunnels(formattedFunnels);
    } catch (error) {
      console.error('❌ Erro ao carregar funis quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFunnel = () => {
    // Criar novo funil quiz
    const newFunnelId = `quiz-estilo-${Date.now()}`;
    window.open(`/editor?funnel=${newFunnelId}&type=quiz&template=quiz-estilo`, '_blank');
  };

  const handleEditFunnel = async (funnelId: string) => {
    try {
      // Abrir editor com o funil
      window.open(`/editor?funnel=${funnelId}&type=quiz`, '_blank');
    } catch (error) {
      console.error('❌ Erro ao abrir editor:', error);
    }
  };

  const handlePreviewFunnel = (funnelId: string) => {
    window.open(`/quiz-estilo?funnel=${funnelId}&mode=preview`, '_blank');
  };

  const handlePublishFunnel = async (funnelId: string) => {
    try {
      // Publicar funil
      const funnelResult = await unifiedCRUDService.getFunnel(funnelId);
      if (funnelResult.success && funnelResult.data) {
        const funnel = funnelResult.data;
        // Criar snapshot de publicação
        await versioningService.createSnapshot(funnel, 'manual', 'Publicação do funil');
        
        // Atualizar status
        await unifiedCRUDService.saveFunnel({
          ...funnel,
          status: 'published'
        });

        // Recarregar lista
        await loadQuizFunnels();
      }
    } catch (error) {
      console.error('❌ Erro ao publicar funil:', error);
    }
  };

  const handleAnalyticsFunnel = (funnelId: string) => {
    window.open(`/dashboard/analytics?funnel=${funnelId}`, '_blank');
  };

  const handleRefresh = () => {
    loadQuizFunnels();
  };

  const statusOptions = [
    { value: 'all', label: 'Todos', count: funnels.length },
    { value: 'draft', label: 'Rascunho', count: funnels.filter(f => f.status === 'draft').length },
    { value: 'published', label: 'Publicado', count: funnels.filter(f => f.status === 'published').length },
    { value: 'archived', label: 'Arquivado', count: funnels.filter(f => f.status === 'archived').length }
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando funis quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Funis Quiz</h1>
          <p className="text-gray-600 mt-1">
            Gerencie e edite seus funis de quiz de estilo pessoal
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button
            onClick={handleCreateFunnel}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Funil Quiz
          </Button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar funis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {statusOptions.map(option => (
            <Button
              key={option.value}
              variant={selectedStatus === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(option.value)}
            >
              {option.label}
              <Badge variant="secondary" className="ml-2">
                {option.count}
              </Badge>
            </Button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todos ({funnels.length})</TabsTrigger>
          <TabsTrigger value="draft">Rascunho ({funnels.filter(f => f.status === 'draft').length})</TabsTrigger>
          <TabsTrigger value="published">Publicado ({funnels.filter(f => f.status === 'published').length})</TabsTrigger>
          <TabsTrigger value="archived">Arquivado ({funnels.filter(f => f.status === 'archived').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredFunnels.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <BarChart3 className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum funil encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Tente ajustar os filtros de busca' : 'Crie seu primeiro funil quiz'}
              </p>
              <Button onClick={handleCreateFunnel}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Funil
              </Button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredFunnels.map(funnel => (
                <QuizFunnelCard
                  key={funnel.id}
                  funnelId={funnel.id}
                  name={funnel.name}
                  description={funnel.description}
                  status={funnel.status}
                  lastModified={funnel.lastModified}
                  version={funnel.version}
                  publishedVersion={funnel.publishedVersion}
                  totalSteps={funnel.totalSteps}
                  completedSteps={funnel.completedSteps}
                  analytics={funnel.analytics}
                  onEdit={handleEditFunnel}
                  onPreview={handlePreviewFunnel}
                  onPublish={handlePublishFunnel}
                  onAnalytics={handleAnalyticsFunnel}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuizFunnelsPage;
