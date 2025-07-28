import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SimpleComponent, ComponentType, QuizConfig, QuizFunnel, Version } from '@/types/quiz';
import { useFunnelManager } from '@/hooks/useFunnelManager';
import { useVersionManager } from '@/hooks/useVersionManager';
import { useComponentManager } from '@/hooks/useComponentManager';
import { QuizOption } from '@/types/quiz';
import { 
  Save, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Layers, 
  Clock, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff,
  Plus,
  Minus
} from 'lucide-react';

interface ModularQuizEditorProps {
  initialFunnel?: QuizFunnel;
  onSave?: (funnel: QuizFunnel) => void;
  onPreview?: (funnel: QuizFunnel) => void;
}

const ModularQuizEditor: React.FC<ModularQuizEditorProps> = ({
  initialFunnel,
  onSave,
  onPreview
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'funis' | 'historico' | 'config'>('editor');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  const {
    components,
    selectedComponentId,
    setSelectedComponentId,
    addComponent,
    updateComponent,
    deleteComponent,
    getComponentById
  } = useComponentManager();

  const {
    funnel,
    saveFunnel,
    loadFunnel,
    createNewFunnel,
    duplicateFunnel,
    deleteFunnel,
    isLoading: funnelLoading
  } = useFunnelManager(initialFunnel);

  const {
    versions,
    currentVersion,
    saveVersion,
    loadVersion,
    createAutoSave,
    isLoading: versionLoading
  } = useVersionManager();

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (funnel && components.length > 0) {
        createAutoSave(funnel);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [funnel, components, createAutoSave]);

  const handleSave = async () => {
    if (funnel) {
      const updatedFunnel = {
        ...funnel,
        pages: funnel.pages.map((page, index) => 
          index === currentPageIndex 
            ? { ...page, components }
            : page
        )
      };
      
      await saveFunnel(updatedFunnel);
      await saveVersion(updatedFunnel, 'Manual save');
      onSave?.(updatedFunnel);
    }
  };

  const handlePreview = () => {
    if (funnel) {
      const updatedFunnel = {
        ...funnel,
        pages: funnel.pages.map((page, index) => 
          index === currentPageIndex 
            ? { ...page, components }
            : page
        )
      };
      onPreview?.(updatedFunnel);
    }
  };

  const handleAddComponent = (type: ComponentType) => {
    const componentId = addComponent(type);
    setSelectedComponentId(componentId);
  };

  const handleUpdateComponent = (id: string, updates: Partial<SimpleComponent>) => {
    updateComponent(id, updates);
  };

  const handleDeleteComponent = (id: string) => {
    deleteComponent(id);
  };

  const renderComponentEditor = () => {
    const selectedComponent = getComponentById(selectedComponentId || '');
    
    if (!selectedComponent) {
      return (
        <div className="p-4 text-center text-gray-500">
          Selecione um componente para editar
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Editar Componente</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteComponent(selectedComponent.id)}
            className="text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <Label>Tipo</Label>
            <Badge variant="secondary">{selectedComponent.type}</Badge>
          </div>

          {selectedComponent.type === 'text' && (
            <div>
              <Label>Texto</Label>
              <Input
                value={selectedComponent.data.text || ''}
                onChange={(e) => handleUpdateComponent(selectedComponent.id, {
                  data: { ...selectedComponent.data, text: e.target.value }
                })}
                placeholder="Digite o texto"
              />
            </div>
          )}

          {selectedComponent.type === 'image' && (
            <>
              <div>
                <Label>URL da Imagem</Label>
                <Input
                  value={selectedComponent.data.src || ''}
                  onChange={(e) => handleUpdateComponent(selectedComponent.id, {
                    data: { ...selectedComponent.data, src: e.target.value }
                  })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              <div>
                <Label>Texto Alternativo</Label>
                <Input
                  value={selectedComponent.data.alt || ''}
                  onChange={(e) => handleUpdateComponent(selectedComponent.id, {
                    data: { ...selectedComponent.data, alt: e.target.value }
                  })}
                  placeholder="Descrição da imagem"
                />
              </div>
            </>
          )}

          {selectedComponent.type === 'button' && (
            <>
              <div>
                <Label>Texto do Botão</Label>
                <Input
                  value={selectedComponent.data.text || ''}
                  onChange={(e) => handleUpdateComponent(selectedComponent.id, {
                    data: { ...selectedComponent.data, text: e.target.value }
                  })}
                  placeholder="Clique aqui"
                />
              </div>
              <div>
                <Label>Link</Label>
                <Input
                  value={selectedComponent.data.href || ''}
                  onChange={(e) => handleUpdateComponent(selectedComponent.id, {
                    data: { ...selectedComponent.data, href: e.target.value }
                  })}
                  placeholder="https://exemplo.com"
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderComponentList = () => {
    const componentTypes: { type: ComponentType; label: string; icon: React.ReactNode }[] = [
      { type: 'title', label: 'Título', icon: <Plus className="w-4 h-4" /> },
      { type: 'text', label: 'Texto', icon: <Plus className="w-4 h-4" /> },
      { type: 'image', label: 'Imagem', icon: <Plus className="w-4 h-4" /> },
      { type: 'button', label: 'Botão', icon: <Plus className="w-4 h-4" /> },
      { type: 'spacer', label: 'Espaçador', icon: <Plus className="w-4 h-4" /> },
      { type: 'progress', label: 'Progresso', icon: <Plus className="w-4 h-4" /> },
    ];

    return (
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-medium mb-4">Componentes</h3>
        {componentTypes.map((comp) => (
          <Button
            key={comp.type}
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleAddComponent(comp.type)}
          >
            {comp.icon}
            <span className="ml-2">{comp.label}</span>
          </Button>
        ))}
      </div>
    );
  };

  const renderCanvas = () => {
    return (
      <div className="flex-1 p-4 bg-gray-50">
        <div className={`mx-auto bg-white rounded-lg shadow-sm ${
          deviceView === 'mobile' ? 'max-w-sm' :
          deviceView === 'tablet' ? 'max-w-md' : 'max-w-4xl'
        }`}>
          <div className="p-6 space-y-4">
            {components.map((component) => (
              <div
                key={component.id}
                className={`p-3 border rounded cursor-pointer transition-colors ${
                  selectedComponentId === component.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedComponentId(component.id)}
              >
                <div className="text-xs text-gray-500 mb-1">{component.type}</div>
                
                {component.type === 'text' && (
                  <p>{component.data.text || 'Texto vazio'}</p>
                )}
                
                {component.type === 'title' && (
                  <h2 className="text-xl font-bold">{component.data.text || 'Título'}</h2>
                )}
                
                {component.type === 'image' && (
                  <div className="bg-gray-100 h-32 flex items-center justify-center rounded">
                    {component.data.src ? (
                      <img src={component.data.src} alt={component.data.alt} className="max-h-full" />
                    ) : (
                      <span className="text-gray-400">Imagem</span>
                    )}
                  </div>
                )}
                
                {component.type === 'button' && (
                  <Button className="w-full">
                    {component.data.text || 'Botão'}
                  </Button>
                )}
                
                {component.type === 'spacer' && (
                  <div className="bg-gray-100 h-8 flex items-center justify-center rounded border-dashed border-2">
                    <span className="text-xs text-gray-400">Espaçador</span>
                  </div>
                )}
                
                {component.type === 'progress' && (
                  <Progress value={component.data.progressValue || 50} className="w-full" />
                )}
              </div>
            ))}
            
            {components.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>Nenhum componente adicionado</p>
                <p className="text-sm">Adicione componentes da barra lateral</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Editor de Quiz</h1>
            <Badge variant="outline">
              {funnel?.name || 'Novo Funil'}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeviceView('mobile')}
              className={deviceView === 'mobile' ? 'bg-blue-50' : ''}
            >
              📱
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeviceView('tablet')}
              className={deviceView === 'tablet' ? 'bg-blue-50' : ''}
            >
              📱
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeviceView('desktop')}
              className={deviceView === 'desktop' ? 'bg-blue-50' : ''}
            >
              💻
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            
            <Button onClick={handlePreview} size="sm">
              <Play className="w-4 h-4 mr-2" />
              Preview
            </Button>
            
            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1 flex">
          <div className="w-64 border-r border-gray-200 bg-gray-50">
            <TabsList className="grid w-full grid-cols-1 h-auto p-2">
              <TabsTrigger value="editor" className="justify-start">
                <Layers className="w-4 h-4 mr-2" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="funis" className="justify-start">
                <Copy className="w-4 h-4 mr-2" />
                Funis
              </TabsTrigger>
              <TabsTrigger value="historico" className="justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Histórico
              </TabsTrigger>
              <TabsTrigger value="config" className="justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Config
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="mt-0">
              {renderComponentList()}
            </TabsContent>

            <TabsContent value="funis" className="mt-0 p-4">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={createNewFunnel}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Funil
                </Button>
                {/* Lista de funis seria renderizada aqui */}
              </div>
            </TabsContent>

            <TabsContent value="historico" className="mt-0 p-4">
              <div className="space-y-2">
                <h4 className="font-medium">Versões</h4>
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className="p-2 border rounded text-sm cursor-pointer hover:bg-gray-50"
                    onClick={() => loadVersion(version.id)}
                  >
                    <div className="font-medium">v{version.version}</div>
                    <div className="text-gray-500 text-xs">
                      {new Date(version.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="config" className="mt-0 p-4">
              <div className="space-y-4">
                <div>
                  <Label>Nome do Funil</Label>
                  <Input
                    value={funnel?.name || ''}
                    onChange={(e) => {
                      // Update funnel name logic here
                    }}
                    placeholder="Nome do funil"
                  />
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Input
                    value={funnel?.description || ''}
                    onChange={(e) => {
                      // Update funnel description logic here
                    }}
                    placeholder="Descrição do funil"
                  />
                </div>
              </div>
            </TabsContent>
          </div>

          <div className="flex-1 flex">
            {renderCanvas()}
            
            {/* Properties Panel */}
            <div className="w-80 border-l border-gray-200 bg-white">
              {renderComponentEditor()}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ModularQuizEditor;
