
import React, { useState, useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart3, Settings, Save, Eye, Upload, Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StyleResult } from '@/types/quiz';

// Import admin components
import { 
  PermissionsProvider, 
  ProtectedComponent, 
  usePermissions 
} from '../admin/security/AccessControlSystem';

import { 
  WorkflowManager, 
  StatusBadge, 
  useWorkflow 
} from '../admin/workflow/PublishingWorkflow';

import { 
  AnalyticsDashboard
} from '../admin/analytics/AdvancedAnalytics';

// Import editor components
import { ComponentsSidebar } from './sidebar/ComponentsSidebar';
import { PreviewPanel } from './preview/PreviewPanel';
import { PropertiesPanel } from './properties/PropertiesPanel';
import { SEOOptimizer } from './seo/SEOOptimizer';
import { EditorToolbar } from './toolbar/EditorToolbar';

interface EnhancedEditorProps {
  funnelId: string;
  funnelName: string;
  selectedStyle?: StyleResult;
  onSave?: () => void;
  onPublish?: () => void;
  onExport?: () => void;
  onImport?: () => void;
}

export const EnhancedEditor: React.FC<EnhancedEditorProps> = ({
  funnelId,
  funnelName,
  selectedStyle,
  onSave,
  onPublish,
  onExport,
  onImport
}) => {
  // State management
  const [activeTab, setActiveTab] = useState<'editor' | 'analytics' | 'seo' | 'workflow' | 'settings'>('editor');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Ensure we have a valid StyleResult
  const validSelectedStyle: StyleResult = selectedStyle || {
    category: 'Natural' as unknown as StyleResult['category'],
    score: 0,
    percentage: 100
  };

  // Hooks
  const { hasPermission, logAction } = usePermissions();
  const { state: workflowState, actions: workflowActions } = useWorkflow();

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (hasPermission('funnel', 'edit')) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSave);
  }, [hasPermission]);

  const handleAutoSave = async () => {
    try {
      setIsSaving(true);
      // Implement auto-save logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate save
      setLastSaved(new Date());
      logAction('auto_save', { funnelId, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave?.();
      setLastSaved(new Date());
      logAction('manual_save', { funnelId, timestamp: new Date().toISOString() });
      toast({
        title: "Salvo com sucesso",
        description: "Suas alterações foram salvas.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      await workflowActions.requestApproval(funnelId);
      await onPublish?.();
      toast({
        title: "Publicação solicitada",
        description: "Sua solicitação de publicação foi enviada para aprovação.",
      });
    } catch (error) {
      toast({
        title: "Erro na publicação",
        description: "Ocorreu um erro ao solicitar a publicação.",
        variant: "destructive",
      });
    }
  };

  const handleExport = async () => {
    try {
      await onExport?.();
      logAction('export', { funnelId, timestamp: new Date().toISOString() });
      toast({
        title: "Exportação concluída",
        description: "O funil foi exportado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar o funil.",
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    try {
      await onImport?.();
      logAction('import', { funnelId, timestamp: new Date().toISOString() });
      toast({
        title: "Importação concluída",
        description: "O funil foi importado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao importar o funil.",
        variant: "destructive",
      });
    }
  };

  return (
    <PermissionsProvider>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="border-b bg-background p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">{funnelName}</h1>
              <StatusBadge status={workflowState.status} />
              {isSaving && <Badge variant="secondary">Salvando...</Badge>}
              {lastSaved && (
                <span className="text-sm text-muted-foreground">
                  Último salvamento: {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {isPreviewMode ? 'Editar' : 'Visualizar'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleImport}
              >
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <ProtectedComponent resource="funnel" action="publish">
                <Button
                  onClick={handlePublish}
                  disabled={workflowState.status !== 'draft'}
                >
                  Publicar
                </Button>
              </ProtectedComponent>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
            <TabsList className="border-b w-full justify-start rounded-none">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <ProtectedComponent resource="analytics" action="read">
                <TabsTrigger value="analytics">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </ProtectedComponent>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <ProtectedComponent resource="workflow" action="read">
                <TabsTrigger value="workflow">Workflow</TabsTrigger>
              </ProtectedComponent>
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="h-full">
              <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                  <ComponentsSidebar onComponentSelect={() => {}} />
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={55}>
                  <PreviewPanel
                    selectedStyle={validSelectedStyle}
                    isPreviewMode={isPreviewMode}
                    selectedBlockId={selectedBlockId}
                    onSelectBlock={setSelectedBlockId}
                  />
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={25}>
                  <PropertiesPanel
                    selectedBlockId={selectedBlockId}
                    onUpdate={() => {}}
                    onClose={() => setSelectedBlockId(null)}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            </TabsContent>

            <TabsContent value="analytics" className="h-full">
              <ProtectedComponent 
                resource="analytics" 
                action="read"
                fallback={
                  <Card className="m-4">
                    <CardHeader>
                      <CardTitle>Acesso Negado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Você não tem permissão para acessar os analytics.</p>
                    </CardContent>
                  </Card>
                }
              >
                <AnalyticsDashboard />
              </ProtectedComponent>
            </TabsContent>

            <TabsContent value="seo" className="h-full">
              <div className="p-4">
                <SEOOptimizer funnelId={funnelId} />
              </div>
            </TabsContent>

            <TabsContent value="workflow" className="h-full">
              <WorkflowManager />
            </TabsContent>

            <TabsContent value="settings" className="h-full">
              <div className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações do Funil</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Configurações em desenvolvimento...</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PermissionsProvider>
  );
};
