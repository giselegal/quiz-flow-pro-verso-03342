
import React, { useState, useCallback } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Eye, EyeOff, Save, Undo, Redo, Smartphone, Tablet, Monitor } from 'lucide-react';

interface ModularQuizEditorProps {
  quizId?: string;
  onSave?: (data: any) => void;
}

export const ModularQuizEditor: React.FC<ModularQuizEditorProps> = ({
  quizId,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState('editor');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [quizData, setQuizData] = useState({
    title: 'Novo Quiz',
    description: '',
    components: [],
    settings: {
      theme: 'default',
      showProgress: true,
      allowSkip: false
    }
  });

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(quizData);
    }
    toast({
      title: "Quiz salvo",
      description: "Suas alterações foram salvas com sucesso.",
    });
  }, [quizData, onSave]);

  const handlePreviewToggle = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    // Handle component reordering
    console.log('Drag end:', event);
  };

  const renderDevicePreview = () => {
    const deviceClasses = {
      mobile: 'w-80 h-[600px]',
      tablet: 'w-[768px] h-[1024px]',
      desktop: 'w-full h-full'
    };

    return (
      <div className={`mx-auto ${deviceClasses[deviceView]} border rounded-lg overflow-hidden bg-white`}>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">{quizData.title}</h2>
          <p className="text-gray-600 mb-6">{quizData.description}</p>
          
          {/* Quiz components would be rendered here */}
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <p>Componentes do quiz serão exibidos aqui</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderComponentsSidebar = () => {
    return (
      <div className="p-4 space-y-4">
        <h3 className="font-semibold">Componentes</h3>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            Pergunta
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Texto
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Imagem
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Vídeo
          </Button>
        </div>
      </div>
    );
  };

  const renderPropertiesPanel = () => {
    return (
      <div className="p-4 space-y-4">
        <h3 className="font-semibold">Propriedades</h3>
        {selectedComponentId ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="component-title">Título</Label>
              <Input id="component-title" placeholder="Digite o título" />
            </div>
            <div>
              <Label htmlFor="component-description">Descrição</Label>
              <Textarea id="component-description" placeholder="Digite a descrição" />
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Selecione um componente para editar</p>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input
              value={quizData.title}
              onChange={(e) => setQuizData(prev => ({ ...prev, title: e.target.value }))}
              className="text-lg font-semibold border-none p-0 focus-visible:ring-0"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Redo className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center border rounded-lg">
              <Button
                variant={deviceView === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceView('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
              <Button
                variant={deviceView === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceView('tablet')}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={deviceView === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceView('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
            </div>
            
            <Select value={deviceView} onValueChange={(value: 'mobile' | 'tablet' | 'desktop') => setDeviceView(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={handlePreviewToggle}>
              {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="preview">Visualizar</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="h-full">
            <DndContext onDragEnd={handleDragEnd}>
              <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel defaultSize={20} minSize={15}>
                  {renderComponentsSidebar()}
                </ResizablePanel>
                
                <ResizableHandle />
                
                <ResizablePanel defaultSize={60}>
                  <div className="h-full p-4 overflow-auto">
                    {isPreviewMode ? renderDevicePreview() : (
                      <SortableContext items={quizData.components} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                          {quizData.components.length === 0 ? (
                            <div className="text-center py-12">
                              <p className="text-gray-500">Adicione componentes para começar a criar seu quiz</p>
                            </div>
                          ) : (
                            quizData.components.map((component: any, index: number) => (
                              <Card key={index} className="p-4">
                                <p>Componente {index + 1}</p>
                              </Card>
                            ))
                          )}
                        </div>
                      </SortableContext>
                    )}
                  </div>
                </ResizablePanel>
                
                <ResizableHandle />
                
                <ResizablePanel defaultSize={20} minSize={15}>
                  {renderPropertiesPanel()}
                </ResizablePanel>
              </ResizablePanelGroup>
            </DndContext>
          </TabsContent>

          <TabsContent value="settings" className="p-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="quiz-title">Título do Quiz</Label>
                <Input
                  id="quiz-title"
                  value={quizData.title}
                  onChange={(e) => setQuizData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="quiz-description">Descrição</Label>
                <Textarea
                  id="quiz-description"
                  value={quizData.description}
                  onChange={(e) => setQuizData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="p-4">
            {renderDevicePreview()}
          </TabsContent>

          <TabsContent value="analytics" className="p-4">
            <p>Analytics serão implementados aqui</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ModularQuizEditor;
