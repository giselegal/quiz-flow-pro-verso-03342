import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, TrendingUp, Eye, Edit3, Copy, Trash2, Plus } from 'lucide-react';
import FunnelTemplatesDashboard from './FunnelTemplatesDashboard';
import TemplateImportExport from '../TemplateImportExport';

interface DashboardStats {
  totalFunnels: number;
  totalViews: number;
  conversionRate: number;
  activeUsers: number;
}

interface FunnelSummary {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  conversions: number;
  lastModified: string;
}

interface EnhancedEditorDashboardProps {
  stats?: DashboardStats;
  funnels?: FunnelSummary[];
  onCreateFunnel?: () => void;
  onEditFunnel?: (funnelId: string) => void;
  onDuplicateFunnel?: (funnelId: string) => void;
  onDeleteFunnel?: (funnelId: string) => void;
  onPreviewFunnel?: (funnelId: string) => void;
  onCreateFromTemplate?: (templateId: string) => void;
  onImportTemplate?: () => void;
  onExportTemplate?: (templateId: string) => void;
}

const DEFAULT_STATS: DashboardStats = {
  totalFunnels: 3,
  totalViews: 1247,
  conversionRate: 12.5,
  activeUsers: 89,
};

const DEFAULT_FUNNELS: FunnelSummary[] = [
  {
    id: '1',
    title: 'Quiz de Estilo Pessoal',
    description: 'Funil completo para descoberta de estilo',
    status: 'published',
    views: 856,
    conversions: 107,
    lastModified: '2 horas atrás',
  },
  {
    id: '2',
    title: 'Guia de Cores Pessoais',
    description: 'Quiz para análise de paleta de cores',
    status: 'draft',
    views: 234,
    conversions: 31,
    lastModified: '1 dia atrás',
  },
  {
    id: '3',
    title: 'Consultoria de Imagem',
    description: 'Funil de vendas para consultoria',
    status: 'published',
    views: 157,
    conversions: 19,
    lastModified: '3 dias atrás',
  },
];

export const EnhancedEditorDashboard: React.FC<EnhancedEditorDashboardProps> = ({
  stats = DEFAULT_STATS,
  funnels = DEFAULT_FUNNELS,
  onCreateFunnel,
  onEditFunnel,
  onDuplicateFunnel,
  onDeleteFunnel,
  onPreviewFunnel,
  onCreateFromTemplate,
  onImportTemplate,
  onExportTemplate,
}) => {
  const [selectedFunnel, setSelectedFunnel] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('my-funnels');

  const getStatusColor = (status: FunnelSummary['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-stone-100 text-stone-700';
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: FunnelSummary['status']) => {
    switch (status) {
      case 'published':
        return 'Publicado';
      case 'draft':
        return 'Rascunho';
      case 'archived':
        return 'Arquivado';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF9F7' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color: '#432818' }}>Dashboard de Funis</h1>
          <p style={{ color: '#6B4F43' }}>Gerencie seus funis de conversão</p>
        </div>
        <div className="flex space-x-3">
          <TemplateImportExport
            onImportTemplate={onImportTemplate}
          />
          <Button onClick={onCreateFunnel} className="bg-[#B89B7A] hover:bg-[#A38A69]">
            <Plus className="w-4 h-4 mr-2" />
            Criar Funil
          </Button>
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-funnels">Meus Funis</TabsTrigger>
          <TabsTrigger value="templates">Modelos de Funil</TabsTrigger>
        </TabsList>

        {/* My Funnels Tab */}
        <TabsContent value="my-funnels" className="space-y-6">{/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle style={{ color: '#6B4F43' }}>Total de Funis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart3 className="w-4 h-4 text-[#B89B7A] mr-2" />
              <span className="text-2xl font-bold">{stats.totalFunnels}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle style={{ color: '#6B4F43' }}>Visualizações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Eye className="w-4 h-4 text-[#B89B7A] mr-2" />
              <span className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle style={{ color: '#6B4F43' }}>Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-2xl font-bold">{stats.conversionRate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle style={{ color: '#6B4F43' }}>Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users style={{ color: '#B89B7A' }} />
              <span className="text-2xl font-bold">{stats.activeUsers}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funnels List */}
      <Card>
        <CardHeader>
          <CardTitle>Seus Funis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnels.map(funnel => (
              <div
                key={funnel.id}
                className={`p-4 border rounded-lg transition-all cursor-pointer hover:shadow-md ${
                  selectedFunnel === funnel.id
                    ? 'border-[#B89B7A] bg-[#B89B7A]/5'
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedFunnel(funnel.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 style={{ color: '#432818' }}>{funnel.title}</h3>
                      <Badge className={getStatusColor(funnel.status)}>
                        {getStatusLabel(funnel.status)}
                      </Badge>
                    </div>
                    <p style={{ color: '#6B4F43' }}>{funnel.description}</p>

                    <div style={{ color: '#8B7355' }}>
                      <span>{funnel.views} visualizações</span>
                      <span>{funnel.conversions} conversões</span>
                      <span>Modificado {funnel.lastModified}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={e => {
                        e.stopPropagation();
                        onPreviewFunnel?.(funnel.id);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={e => {
                        e.stopPropagation();
                        onEditFunnel?.(funnel.id);
                      }}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={e => {
                        e.stopPropagation();
                        onDuplicateFunnel?.(funnel.id);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      style={{ color: '#432818' }}
                      onClick={e => {
                        e.stopPropagation();
                        onDeleteFunnel?.(funnel.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </TabsContent>

      {/* Templates Tab */}
      <TabsContent value="templates">
        <FunnelTemplatesDashboard
          onSelectTemplate={(templateId) => {
            console.log('Template selected:', templateId);
          }}
          onImportTemplate={onImportTemplate}
          onExportTemplate={onExportTemplate}
          onCreateFromTemplate={onCreateFromTemplate}
        />
      </TabsContent>
      </Tabs>
    </div>
  );
};
