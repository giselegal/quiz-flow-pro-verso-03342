import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Eye, Image, Layout, Mouse, Save, Settings, Type } from 'lucide-react';
import { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { PropertiesPanel } from '@/components/editor/properties/PropertiesPanel';
import { BlockType } from '@/types/editor';

/**
 * 🏆 EDITOR PRINCIPAL: EditorFixedPageWithDragDrop
 * Localização: src/pages/editor-fixed.tsx
 *
 * Editor de 4 colunas com layout responsivo baseado em ResizablePanel
 * Funcionalidades principais:
 * - Layout de 4 colunas ajustáveis
 * - Biblioteca de componentes
 * - Canvas de edição
 * - Painel de propriedades
 * - Toolbar com ações principais
 */
const EditorFixedPageWithDragDrop = () => {
  // Estado local para o editor
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [viewMode, setViewMode] = useState('desktop');
  const [showPreview, setShowPreview] = useState(false);

  // Componentes disponíveis
  const components = [
    { id: 'heading', name: 'Título', icon: Type, category: 'Texto' },
    { id: 'paragraph', name: 'Parágrafo', icon: Type, category: 'Texto' },
    { id: 'button', name: 'Botão', icon: Mouse, category: 'Interação' },
    { id: 'image', name: 'Imagem', icon: Image, category: 'Mídia' },
    { id: 'card', name: 'Card', icon: Layout, category: 'Layout' },
  ];

  // Etapas do funil (1-21)
  const funnelSteps = Array.from({ length: 21 }, (_, i) => ({
    id: i + 1,
    name: `Etapa ${i + 1}`,
    active: currentStep === i + 1,
  }));

  return (
    <div className="h-screen w-full bg-background">
      {/* 🎨 TOOLBAR SUPERIOR */}
      <div className="h-14 border-b border-border bg-card px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Editor Quiz Quest</h1>
          <Badge variant="outline">4 Colunas</Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('desktop')}
          >
            Desktop
          </Button>
          <Button
            variant={viewMode === 'tablet' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('tablet')}
          >
            Tablet
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('mobile')}
          >
            Mobile
          </Button>

          <div className="w-px h-6 bg-border mx-2" />

          <Button
            variant={showPreview ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>

          <Button size="sm">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* 🏗️ LAYOUT DE 4 COLUNAS RESPONSIVO */}
      <div className="h-[calc(100vh-3.5rem)]">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* 📋 COLUNA 1: ETAPAS DO FUNIL */}
          <ResizablePanel defaultSize={15} minSize={12} maxSize={25}>
            <div className="h-full border-r border-border bg-card/50 p-3">
              <div className="mb-3">
                <h3 className="text-sm font-medium mb-2">Etapas do Funil</h3>
                <p className="text-xs text-muted-foreground">21 etapas disponíveis</p>
              </div>

              <div className="space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto">
                {funnelSteps.map(step => (
                  <Button
                    key={step.id}
                    variant={step.active ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => setCurrentStep(step.id)}
                  >
                    {step.name}
                  </Button>
                ))}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* 🧩 COLUNA 2: COMPONENTES */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full border-r border-border bg-card/30 p-3">
              <div className="mb-3">
                <h3 className="text-sm font-medium mb-2">Componentes</h3>
                <p className="text-xs text-muted-foreground">Biblioteca de elementos</p>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-8rem)] overflow-y-auto">
                {components.map(component => {
                  const IconComponent = component.icon;
                  return (
                    <Card
                      key={component.id}
                      className="p-2 cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => setSelectedComponent(component)}
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs font-medium">{component.name}</p>
                          <p className="text-xs text-muted-foreground">{component.category}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* 🎨 COLUNA 3: CANVAS PRINCIPAL */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full bg-background p-4">
              <div className="h-full border-2 border-dashed border-border rounded-lg bg-card/20 flex items-center justify-center">
                {showPreview ? (
                  <div className="text-center">
                    <Eye className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Modo Preview</h3>
                    <p className="text-muted-foreground mb-4">
                      Visualizando Etapa {currentStep} no modo {viewMode}
                    </p>
                    {selectedComponent && (
                      <Badge variant="secondary">
                        Componente selecionado: {selectedComponent.name}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <Layout className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Canvas de Edição</h3>
                    <p className="text-muted-foreground mb-4">
                      Arraste componentes aqui para construir a Etapa {currentStep}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Modo: {viewMode} • Resolução responsiva
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* ⚙️ COLUNA 4: PROPRIEDADES */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <div className="h-full border-l border-border bg-card/30 p-3">
              <div className="mb-3">
                <h3 className="text-sm font-medium mb-2">Propriedades</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedComponent
                    ? `Editando: ${selectedComponent.name}`
                    : 'Nenhum componente selecionado'}
                </p>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
                {selectedComponent ? (
                  <>
                    <Card className="p-3">
                      <CardHeader className="p-0 mb-2">
                        <CardTitle className="text-sm">Aparência</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 space-y-2">
                        <div>
                          <label className="text-xs text-muted-foreground">Cor</label>
                          <div className="flex gap-2 mt-1">
                            <div className="w-6 h-6 bg-primary rounded border cursor-pointer"></div>
                            <div className="w-6 h-6 bg-secondary rounded border cursor-pointer"></div>
                            <div className="w-6 h-6 bg-accent rounded border cursor-pointer"></div>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Tamanho</label>
                          <div className="flex gap-1 mt-1">
                            <Button variant="outline" size="sm" className="text-xs">
                              P
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs">
                              M
                            </Button>
                            <Button variant="default" size="sm" className="text-xs">
                              G
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="p-3">
                      <CardHeader className="p-0 mb-2">
                        <CardTitle className="text-sm">Layout</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 space-y-2">
                        <div>
                          <label className="text-xs text-muted-foreground">Alinhamento</label>
                          <div className="flex gap-1 mt-1">
                            <Button variant="outline" size="sm" className="text-xs">
                              ←
                            </Button>
                            <Button variant="default" size="sm" className="text-xs">
                              ⋄
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs">
                              →
                            </Button>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Espaçamento</label>
                          <div className="grid grid-cols-2 gap-1 mt-1">
                            <Button variant="outline" size="sm" className="text-xs">
                              ↑ 8px
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs">
                              ↓ 8px
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs">
                              ← 12px
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs">
                              → 12px
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="p-4">
                    <div className="text-center text-muted-foreground">
                      <Settings className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">
                        Selecione um componente para editar suas propriedades
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default EditorFixedPageWithDragDrop;
