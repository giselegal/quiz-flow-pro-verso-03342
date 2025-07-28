import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Analytics, Users, Shield, Workflow, Save, Eye, Code, Smartphone, Tablet, Monitor } from 'lucide-react';
import { StyleResult } from '@/types/quiz';
import { useEditor } from '@/hooks/useEditor';

// Import admin components
import { PermissionsProvider, ProtectedComponent, usePermissions } from '../admin/security/AccessControlSystem';
import { WorkflowManager, StatusBadge, useWorkflow } from '../admin/workflow/PublishingWorkflow';
import { AnalyticsDashboard } from '../admin/analytics/AdvancedAnalytics';

// Enhanced Editor Components
import { EnhancedEditorDashboard } from '../enhanced-editor/dashboard/EnhancedEditorDashboard';
import { PropertiesPanel } from '../enhanced-editor/properties/PropertiesPanel';
import { PreviewPanel } from '../enhanced-editor/preview/PreviewPanel';

interface EnhancedEditorProps {
  primaryStyle?: StyleResult;
  funnelId?: string;
  funnelName?: string;
}

export const EnhancedEditor: React.FC<EnhancedEditorProps> = ({
  primaryStyle,
  funnelId = 'default',
  funnelName = 'Novo Funil'
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'workflow' | 'analytics' | 'seo' | 'settings'>('editor');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [viewportSize, setViewportSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [isPreviewing, setIsPreviewing] = useState(false);
  
  const { config, addBlock, updateBlock, deleteBlock, reorderBlocks, saveConfig } = useEditor();
  const { hasPermission } = usePermissions();
  const { items, updateStatus } = useWorkflow();

  const handleBlockSelect = (blockId: string) => {
    setSelectedBlockId(blockId);
  };

  const handleBlockUpdate = (blockId: string, content: any) => {
    updateBlock(blockId, content);
  };

  const handleBlockDelete = (blockId: string) => {
    deleteBlock(blockId);
    setSelectedBlockId(null);
  };

  const handleReorderBlocks = (sourceIndex: number, destinationIndex: number) => {
    reorderBlocks(sourceIndex, destinationIndex);
  };

  const handleSave = () => {
    saveConfig();
  };

  const validPrimaryStyle: StyleResult = primaryStyle || {
    category: 'Natural' as const,
    score: 0,
    percentage: 100
  } as StyleResult;

  return (
    <PermissionsProvider>
      <WorkflowManager>
        <div className="h-screen flex flex-col bg-[#FAF9F7]">
          {/* Header */}
          <div className="border-b bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-playfair text-[#432818]">
                  Editor Avançado
                </h1>
                <p className="text-sm text-[#8F7A6A]">{funnelName}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <StatusBadge status="draft" />
                
                {/* Viewport Size Controls */}
                <div className="flex items-center gap-1 border rounded-lg p-1">
                  <Button
                    variant={viewportSize === 'sm' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewportSize('sm')}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewportSize === 'md' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewportSize('md')}
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewportSize === 'lg' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewportSize('lg')}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                </div>

                {/* Action Buttons */}
                <Button
                  variant={isPreviewing ? 'default' : 'outline'}
                  onClick={() => setIsPreviewing(!isPreviewing)}
                  className="gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {isPreviewing ? 'Sair do Preview' : 'Preview'}
                </Button>
                
                <ProtectedComponent resource="funnel" action="edit">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" />
                    Salvar
                  </Button>
                </ProtectedComponent>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="editor" className="h-full flex flex-col">
              <div className="border-b bg-white px-4">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="editor" className="gap-2">
                    <Code className="w-4 h-4" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger value="workflow" className="gap-2">
                    <Workflow className="w-4 h-4" />
                    Workflow
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="gap-2">
                    <Analytics className="w-4 h-4" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="seo" className="gap-2">
                    <Settings className="w-4 h-4" />
                    SEO
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="gap-2">
                    <Shield className="w-4 h-4" />
                    Configurações
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="editor" className="h-full m-0">
                  <div className="h-full flex">
                    {/* Left Sidebar - Components */}
                    <div className="w-64 border-r bg-white">
                      <div className="p-4">
                        <h3 className="font-medium text-[#432818] mb-3">Componentes</h3>
                        {/* Component library will go here */}
                      </div>
                    </div>
                    
                    {/* Center - Preview */}
                    <div className="flex-1">
                      <PreviewPanel
                        blocks={config.blocks}
                        selectedBlockId={selectedBlockId}
                        onSelectBlock={handleBlockSelect}
                        isPreviewing={isPreviewing}
                        viewportSize={viewportSize}
                        primaryStyle={validPrimaryStyle}
                        onReorderBlocks={handleReorderBlocks}
                      />
                    </div>
                    
                    {/* Right Sidebar - Properties */}
                    <div className="w-80 border-l bg-white">
                      <ProtectedComponent resource="funnel" action="edit" fallback={
                        <div className="p-4 text-center text-[#8F7A6A]">
                          Sem permissão para editar
                        </div>
                      }>
                        <PropertiesPanel
                          selectedBlockId={selectedBlockId}
                          blocks={config.blocks}
                          onClose={() => setSelectedBlockId(null)}
                          onUpdate={handleBlockUpdate}
                          onDelete={handleBlockDelete}
                        />
                      </ProtectedComponent>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="workflow" className="h-full m-0">
                  <div className="h-full p-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Workflow de Publicação</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <h4 className="font-medium">{item.title}</h4>
                                <p className="text-sm text-[#8F7A6A]">
                                  Criado em {item.createdAt.toLocaleDateString()}
                                </p>
                              </div>
                              <StatusBadge status={item.status} />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="h-full m-0">
                  <div className="h-full p-4">
                    <AnalyticsDashboard />
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="h-full m-0">
                  <div className="h-full p-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Configurações SEO</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[#8F7A6A]">
                          Configurações de SEO estarão disponíveis em breve.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="h-full m-0">
                  <div className="h-full p-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Configurações Gerais</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[#8F7A6A]">
                          Configurações gerais estarão disponíveis em breve.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </WorkflowManager>
    </PermissionsProvider>
  );
};
