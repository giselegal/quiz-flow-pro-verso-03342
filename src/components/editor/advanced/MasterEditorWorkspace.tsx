import React, { useState } from 'react';
import { Block } from '@/types/editor';
import { InteractivePreviewEngine } from '../interactive/InteractivePreviewEngine';
import { CollaborationProvider, CollaborationStatus } from './CollaborationProvider';
import { AdvancedStylingPanel } from './AdvancedStylingPanel';
import { PublishingEngine } from './PublishingEngine';
import { useEditorIntegration } from '@/hooks/useEditorIntegration';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Layout, 
  Palette, 
  Rocket, 
  Save, 
  Eye, 
  Settings,
  Zap,
  BarChart3,
  CheckCircle
} from 'lucide-react';

interface MasterEditorWorkspaceProps {
  funnelId: string;
  userId: string;
  userName: string;
  className?: string;
}

type WorkspaceTab = 'editor' | 'styling' | 'publish' | 'analytics';

export const MasterEditorWorkspace: React.FC<MasterEditorWorkspaceProps> = ({
  funnelId,
  userId,
  userName,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('editor');
  const [selectedBlockForStyling, setSelectedBlockForStyling] = useState<Block | null>(null);
  
  const {
    integrationState,
    stepValidation,
    currentStepBlocks,
    updateStepBlocks,
    saveChanges,
    toggleInteractiveMode,
    toggleDraftMode,
  } = useEditorIntegration();

  const handleBlockStyleUpdate = (blockId: string, styles: any) => {
    const updatedBlocks = currentStepBlocks.map(block => 
      block.id === blockId 
        ? { 
            ...block, 
            properties: { 
              ...block.properties, 
              customStyles: { ...block.properties?.customStyles, ...styles } 
            }
          }
        : block
    );
    updateStepBlocks(updatedBlocks);
  };

  const renderWorkspaceStatus = () => (
    <div className="flex items-center gap-4 p-4 bg-muted/50 border-b">
      <div className="flex items-center gap-2">
        <div className={cn(
          'w-2 h-2 rounded-full',
          integrationState.syncStatus === 'syncing' ? 'bg-blue-500 animate-pulse' :
          integrationState.syncStatus === 'success' ? 'bg-green-500' :
          integrationState.syncStatus === 'error' ? 'bg-red-500' :
          'bg-gray-400'
        )} />
        <span className="text-sm text-muted-foreground">
          {integrationState.syncStatus === 'syncing' ? 'Sincronizando...' :
           integrationState.syncStatus === 'success' ? 'Salvo' :
           integrationState.syncStatus === 'error' ? 'Erro ao salvar' :
           integrationState.hasUnsavedChanges ? 'Alterações não salvas' : 'Tudo salvo'}
        </span>
      </div>

      <CollaborationStatus />

      <div className="flex items-center gap-2 ml-auto">
        <Badge variant={integrationState.isDraftMode ? 'secondary' : 'default'}>
          {integrationState.isDraftMode ? 'Rascunho' : 'Publicado'}
        </Badge>
        
        <Badge variant={integrationState.isInteractiveMode ? 'default' : 'outline'}>
          <Zap className="w-3 h-3 mr-1" />
          {integrationState.isInteractiveMode ? 'Modo Interativo' : 'Modo Visualização'}
        </Badge>

        {stepValidation.hasErrors === false && (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Válido
          </Badge>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={toggleInteractiveMode}
        >
          <Eye className="w-4 h-4 mr-1" />
          {integrationState.isInteractiveMode ? 'Visualizar' : 'Editar'}
        </Button>
        
        {integrationState.hasUnsavedChanges && (
          <Button size="sm" onClick={saveChanges}>
            <Save className="w-4 h-4 mr-1" />
            Salvar
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <CollaborationProvider userId={userId} userName={userName}>
      <div className={cn('flex flex-col h-full bg-background', className)}>
        {/* Workspace Status Bar */}
        {renderWorkspaceStatus()}

        {/* Main Workspace */}
        <div className="flex-1 flex">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <Tabs value={activeTab} onValueChange={(tab) => setActiveTab(tab as WorkspaceTab)}>
              <TabsList className="w-full justify-start border-b rounded-none h-12 px-4">
                <TabsTrigger value="editor" className="flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="styling" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Estilos
                </TabsTrigger>
                <TabsTrigger value="publish" className="flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  Publicar
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="editor" className="h-full m-0 p-6">
                  <InteractivePreviewEngine
                    blocks={currentStepBlocks}
                    onBlocksUpdate={updateStepBlocks}
                  />
                </TabsContent>

                <TabsContent value="styling" className="h-full m-0 p-6">
                  <div className="flex gap-6 h-full">
                    <div className="flex-1">
                      <div className="mb-4">
                        <h2 className="text-2xl font-bold mb-2">Editor de Estilos</h2>
                        <p className="text-muted-foreground">
                          Selecione um bloco para personalizar seu estilo avançado
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        {currentStepBlocks.map(block => (
                          <Card 
                            key={block.id}
                            className={cn(
                              'cursor-pointer transition-all hover:ring-2 hover:ring-primary/50',
                              selectedBlockForStyling?.id === block.id && 'ring-2 ring-primary'
                            )}
                            onClick={() => setSelectedBlockForStyling(block)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <Badge variant="secondary">{block.type}</Badge>
                                  <span className="ml-2 text-sm text-muted-foreground">
                                    #{block.id.slice(-6)}
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBlockForStyling(block);
                                  }}
                                >
                                  <Settings className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <AdvancedStylingPanel
                        block={selectedBlockForStyling}
                        onStyleUpdate={handleBlockStyleUpdate}
                        onClose={() => setSelectedBlockForStyling(null)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="publish" className="h-full m-0 p-6">
                  <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-2">Publicar Funil</h2>
                      <p className="text-muted-foreground">
                        Configure e publique seu funil para produção
                      </p>
                    </div>
                    
                    <PublishingEngine
                      funnelId={funnelId}
                      onPublishComplete={(result) => {
                        if (result.success) {
                          toggleDraftMode(); // Switch to published mode
                        }
                      }}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="h-full m-0 p-6">
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-xl font-semibold mb-2">Analytics em Desenvolvimento</h3>
                    <p className="text-muted-foreground">
                      Ferramentas de analytics e métricas serão disponibilizadas em breve
                    </p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </CollaborationProvider>
  );
};