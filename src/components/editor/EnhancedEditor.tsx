// Enhanced Editor - Integração de Todas as Melhorias
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Save, 
  Eye, 
  Settings, 
  BarChart3, 
  Shield, 
  Globe, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Tablet,
  Monitor,
  ArrowLeft
} from 'lucide-react';

// Importar todos os sistemas melhorados
import { ValidationSummary, useValidation, type FunnelValidationContext } from './validation/ValidationSystem';
import { 
  ToastContainer, 
  AutoSaveIndicator, 
  ConnectionIndicator, 
  LoadingOverlay,
  useFeedbackSystem,
  useAutoSave,
  useConnectionState
} from './feedback/FeedbackSystem';
import { PermissionsProvider, ProtectedComponent, usePermissions } from '../admin/security/AccessControlSystem';
import { CustomURLEditor, SEOEditor, type SEOMetadata, useCustomURLs } from './seo/SEOSystem';
import { WorkflowManager, StatusBadge, useWorkflow } from '../admin/workflow/PublishingWorkflow';
import { AnalyticsDashboard } from '../admin/analytics/AdvancedAnalytics';

// Importar o editor base existente
import SchemaDrivenEditorResponsive from './SchemaDrivenEditorResponsive';

// Tipos
interface EnhancedEditorProps {
  funnelId?: string;
  className?: string;
}

interface FunnelData {
  id: string;
  name: string;
  description?: string;
  pages: any[];
  seo: SEOMetadata;
  status: 'draft' | 'review' | 'published' | 'paused' | 'archived';
  updatedAt: string;
}

type DeviceView = 'mobile' | 'tablet' | 'desktop';

// Componente principal do editor melhorado
const EnhancedEditor: React.FC<EnhancedEditorProps> = ({ 
  funnelId = 'default',
  className = '' 
}) => {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'editor' | 'seo' | 'workflow' | 'analytics' | 'settings'>('editor');
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop');
  const [showSidebar, setShowSidebar] = useState(true);
  
  // Estados do funil
  const [funnelData, setFunnelData] = useState<FunnelData>({
    id: funnelId,
    name: 'Novo Funil',
    description: '',
    pages: [],
    seo: {
      title: '',
      description: '',
      keywords: [],
      openGraph: {
        title: '',
        description: '',
        image: '',
        type: 'quiz'
      },
      twitterCard: {
        card: 'summary_large_image',
        title: '',
        description: '',
        image: ''
      }
    },
    status: 'draft',
    updatedAt: new Date().toISOString()
  });

  // Hooks dos sistemas avançados
  const feedback = useFeedbackSystem();
  const connectionState = useConnectionState();
  const { hasPermission, logAction } = usePermissions();
  const { workflowState } = useWorkflow(funnelId);
  const { urls } = useCustomURLs(funnelId);

  // Validação
  const validationContext: FunnelValidationContext = {
    funnel: funnelData,
    pages: funnelData.pages,
    userRole: 'editor' // Pode vir do contexto de permissões
  };

  // Auto-save
  const { autoSaveState, pendingChanges } = useAutoSave(
    async () => {
      await saveFunnel();
    },
    [funnelData],
    { enabled: true, interval: 3000 }
  );

  // Funções
  const saveFunnel = useCallback(async () => {
    try {
      feedback.startLoading('Salvando funil...');
      
      // Simular salvamento - substituir por API real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await logAction('update_funnel', 'funnel', funnelId, {
        newData: funnelData,
        description: 'Funil atualizado via editor'
      });

      feedback.showSuccess('Funil salvo com sucesso!');
    } catch (error) {
      feedback.showError('Erro ao salvar', 'Não foi possível salvar o funil');
    } finally {
      feedback.stopLoading();
    }
  }, [funnelData, funnelId, feedback, logAction]);

  const publishFunnel = useCallback(async () => {
    try {
      feedback.startLoading('Publicando funil...');
      
      // Validar antes de publicar
      const { getValidationSummary } = useValidation();
      // const summary = getValidationSummary; // Implementar validação

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setFunnelData(prev => ({ ...prev, status: 'published' }));
      
      await logAction('publish_funnel', 'funnel', funnelId, {
        description: 'Funil publicado'
      });

      feedback.showSuccess('Funil publicado!', 'Seu funil está agora acessível publicamente');
    } catch (error) {
      feedback.showError('Erro ao publicar', 'Não foi possível publicar o funil');
    } finally {
      feedback.stopLoading();
    }
  }, [funnelId, feedback, logAction]);

  const previewFunnel = useCallback(() => {
    const previewUrl = urls.find(url => url.isPrimary)?.slug || funnelId;
    window.open(`/preview/${previewUrl}`, '_blank');
    
    logAction('view_funnel', 'funnel', funnelId, {
      description: 'Preview do funil aberto'
    });
  }, [urls, funnelId, logAction]);

  const handleSEOChange = useCallback((newSEO: SEOMetadata) => {
    setFunnelData(prev => ({ 
      ...prev, 
      seo: newSEO,
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const getDeviceViewport = () => {
    switch (deviceView) {
      case 'mobile': return 'max-w-sm mx-auto';
      case 'tablet': return 'max-w-2xl mx-auto';
      default: return 'w-full';
    }
  };

  return (
    <PermissionsProvider>
      <div className={`h-screen flex flex-col bg-gray-50 ${className}`}>
        {/* Header */}
        <header className="bg-white border-b shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left side */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation('/admin/funis')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {funnelData.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    {workflowState && <StatusBadge status={workflowState.status} />}
                    <span className="text-sm text-gray-500">
                      Atualizado em {new Date(funnelData.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Center - Device View Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {[
                  { type: 'mobile' as DeviceView, icon: Smartphone },
                  { type: 'tablet' as DeviceView, icon: Tablet },
                  { type: 'desktop' as DeviceView, icon: Monitor }
                ].map(({ type, icon: Icon }) => (
                  <Button
                    key={type}
                    variant={deviceView === type ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setDeviceView(type)}
                    className="px-3"
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>

              {/* Right side */}
              <div className="flex items-center gap-3">
                {/* Status indicators */}
                <AutoSaveIndicator 
                  autoSaveState={autoSaveState} 
                  pendingChanges={pendingChanges} 
                />
                <ConnectionIndicator connectionState={connectionState} />

                {/* Action buttons */}
                <Button variant="outline" size="sm" onClick={previewFunnel}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                
                <ProtectedComponent resource="funnel" action="update" resourceId={funnelId}>
                  <Button size="sm" onClick={saveFunnel}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                </ProtectedComponent>

                <ProtectedComponent resource="funnel" action="publish" resourceId={funnelId}>
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={publishFunnel}
                    disabled={funnelData.status === 'published'}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {funnelData.status === 'published' ? 'Publicado' : 'Publicar'}
                  </Button>
                </ProtectedComponent>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          {showSidebar && (
            <div className="w-80 bg-white border-r overflow-y-auto">
              <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
                <TabsList className="grid w-full grid-cols-5 p-1 m-4">
                  <TabsTrigger value="editor" className="text-xs">
                    <Settings className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="seo" className="text-xs">
                    <Globe className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="workflow" className="text-xs">
                    <Calendar className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="text-xs">
                    <BarChart3 className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs">
                    <Shield className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>

                <div className="px-4 pb-4">
                  <TabsContent value="editor" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Validação</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ValidationSummary context={validationContext} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="seo" className="mt-0 space-y-4">
                    <CustomURLEditor 
                      funnelId={funnelId}
                      onSave={(slug) => {
                        feedback.showSuccess('URL personalizada criada!', `/${slug}`);
                      }}
                    />
                    <SEOEditor 
                      metadata={funnelData.seo}
                      onChange={handleSEOChange}
                    />
                  </TabsContent>

                  <TabsContent value="workflow" className="mt-0">
                    <ProtectedComponent 
                      resource="funnel" 
                      action="update" 
                      resourceId={funnelId}
                      fallback={
                        <div className="text-center py-8">
                          <Shield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Sem permissão</p>
                        </div>
                      }
                    >
                      <WorkflowManager 
                        funnelId={funnelId}
                        funnelName={funnelData.name}
                      />
                    </ProtectedComponent>
                  </TabsContent>

                  <TabsContent value="analytics" className="mt-0">
                    <ProtectedComponent 
                      resource="analytics" 
                      action="read"
                      fallback={
                        <div className="text-center py-8">
                          <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Sem permissão para analytics</p>
                        </div>
                      }
                    >
                      <div className="text-sm">
                        <p className="mb-2">Analytics básico disponível.</p>
                        <Button size="sm" onClick={() => setActiveTab('analytics')}>
                          Ver Dashboard Completo
                        </Button>
                      </div>
                    </ProtectedComponent>
                  </TabsContent>

                  <TabsContent value="settings" className="mt-0">
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Configurações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Sidebar</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setShowSidebar(!showSidebar)}
                            >
                              {showSidebar ? 'Ocultar' : 'Mostrar'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}

          {/* Editor Canvas */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'analytics' ? (
              <div className="h-full overflow-y-auto p-6">
                <AnalyticsDashboard funnelId={funnelId} />
              </div>
            ) : (
              <div className="h-full bg-gray-100 p-6">
                <div className={`h-full bg-white rounded-lg shadow-sm overflow-hidden ${getDeviceViewport()}`}>
                  <div className="h-full">
                    <SchemaDrivenEditorResponsive 
                      funnelId={funnelId}
                      className="h-full border-0"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading Overlay */}
        <LoadingOverlay 
          isLoading={feedback.loadingState.isLoading}
          message={feedback.loadingState.message}
          progress={feedback.loadingState.progress}
        />

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </PermissionsProvider>
  );
};

// Wrapper para compatibilidade
const EnhancedEditorPage: React.FC<{ funnelId?: string }> = ({ funnelId }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedEditor funnelId={funnelId} />
    </div>
  );
};

export default EnhancedEditor;
export { EnhancedEditorPage };
