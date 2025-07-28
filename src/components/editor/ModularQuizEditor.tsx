import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Undo, 
  Redo, 
  Eye, 
  EyeOff,
  Smartphone, 
  Tablet, 
  Monitor,
  Settings,
  History,
  Layers,
  Palette
} from 'lucide-react';

interface EditorComponent {
  id: string;
  type: string;
  props: Record<string, any>;
  order: number;
}

interface EditorPage {
  id: string;
  name: string;
  components: EditorComponent[];
  settings: {
    backgroundColor: string;
    padding: number;
    maxWidth: number;
  };
  order: number;
}

interface Version {
  id: string;
  timestamp: number;
  version: number;
  description: string;
  isAutoSave: boolean;
  changes: any[];
}

export const ModularQuizEditor: React.FC = () => {
  const [pages, setPages] = useState<EditorPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [activeTab, setActiveTab] = useState<'editor' | 'funis' | 'historico' | 'config'>('editor');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [activeConfigSection, setActiveConfigSection] = useState('geral');

  const currentPage = pages[currentPageIndex];
  const selectedComponent = currentPage?.components.find(c => c.id === selectedComponentId);

  const addPage = () => {
    const newPage: EditorPage = {
      id: `page-${Date.now()}`,
      name: `Página ${pages.length + 1}`,
      components: [],
      settings: {
        backgroundColor: '#ffffff',
        padding: 20,
        maxWidth: 800
      },
      order: pages.length
    };
    setPages([...pages, newPage]);
    setCurrentPageIndex(pages.length);
  };

  const duplicatePage = (pageIndex: number) => {
    const originalPage = pages[pageIndex];
    const duplicatedPage: EditorPage = {
      ...originalPage,
      id: `page-${Date.now()}`,
      name: `${originalPage.name} (Cópia)`,
      components: originalPage.components.map(comp => ({
        ...comp,
        id: `comp-${Date.now()}-${Math.random()}`
      }))
    };
    const newPages = [...pages];
    newPages.splice(pageIndex + 1, 0, duplicatedPage);
    setPages(newPages);
  };

  const deletePage = (pageIndex: number) => {
    if (pages.length > 1) {
      const newPages = pages.filter((_, index) => index !== pageIndex);
      setPages(newPages);
      if (currentPageIndex >= newPages.length) {
        setCurrentPageIndex(newPages.length - 1);
      }
    }
  };

  const addComponent = (type: string) => {
    if (!currentPage) return;

    const newComponent: EditorComponent = {
      id: `comp-${Date.now()}`,
      type,
      props: getDefaultProps(type),
      order: currentPage.components.length
    };

    const updatedPages = pages.map((page, index) =>
      index === currentPageIndex
        ? { ...page, components: [...page.components, newComponent] }
        : page
    );
    setPages(updatedPages);
    setSelectedComponentId(newComponent.id);
  };

  const getDefaultProps = (type: string) => {
    const defaults: Record<string, any> = {
      text: { content: 'Texto de exemplo', fontSize: 16, color: '#000000' },
      button: { text: 'Botão', backgroundColor: '#007bff', textColor: '#ffffff' },
      image: { src: '', alt: 'Imagem', width: 300, height: 200 },
      input: { placeholder: 'Digite aqui...', label: 'Campo de texto' },
      select: { options: [], placeholder: 'Selecione uma opção' }
    };
    return defaults[type] || {};
  };

  const updateComponent = (componentId: string, updates: Partial<EditorComponent>) => {
    const updatedPages = pages.map((page, index) =>
      index === currentPageIndex
        ? {
            ...page,
            components: page.components.map(comp =>
              comp.id === componentId ? { ...comp, ...updates } : comp
            )
          }
        : page
    );
    setPages(updatedPages);
  };

  const deleteComponent = (componentId: string) => {
    const updatedPages = pages.map((page, index) =>
      index === currentPageIndex
        ? {
            ...page,
            components: page.components.filter(comp => comp.id !== componentId)
          }
        : page
    );
    setPages(updatedPages);
    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination || !currentPage) return;

    const reorderedComponents = Array.from(currentPage.components);
    const [reorderedItem] = reorderedComponents.splice(result.source.index, 1);
    reorderedComponents.splice(result.destination.index, 0, reorderedItem);

    const updatedPages = pages.map((page, index) =>
      index === currentPageIndex
        ? { ...page, components: reorderedComponents }
        : page
    );
    setPages(updatedPages);
  };

  const saveVersion = () => {
    const newVersion: Version = {
      id: `v-${Date.now()}`,
      timestamp: Date.now(),
      version: versions.length + 1,
      description: `Versão ${versions.length + 1}`,
      isAutoSave: false,
      changes: []
    };
    setVersions([...versions, newVersion]);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Editor Modular</h1>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Undo className="w-4 h-4 mr-1" />
                Desfazer
              </Button>
              <Button variant="outline" size="sm">
                <Redo className="w-4 h-4 mr-1" />
                Refazer
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Select value={deviceView} onValueChange={(value) => setDeviceView(value as any)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobile">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile
                </SelectItem>
                <SelectItem value="tablet">
                  <Tablet className="w-4 h-4 mr-2" />
                  Tablet
                </SelectItem>
                <SelectItem value="desktop">
                  <Monitor className="w-4 h-4 mr-2" />
                  Desktop
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPreviewMode ? 'Editar' : 'Visualizar'}
            </Button>

            <Button onClick={saveVersion}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="editor">
                <Layers className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="funis">
                <Settings className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="historico">
                <History className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="config">
                <Palette className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="p-4">
              {selectedComponent ? (
                <PropertyPanel
                  selectedComponent={selectedComponent}
                  onChange={(updated) => updateComponent(selectedComponent.id, updated)}
                />
              ) : (
                <div className="text-center text-gray-500">
                  Selecione um componente para editar suas propriedades
                </div>
              )}
            </TabsContent>

            <TabsContent value="funis" className="p-4">
              <div className="space-y-4">
                <h3 className="font-medium">Páginas</h3>
                {pages.map((page, index) => (
                  <Card key={page.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{page.name}</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentPageIndex(index)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => duplicatePage(index)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePage(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                <Button onClick={addPage} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Página
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="historico" className="p-4">
              <div className="space-y-4">
                <h3 className="font-medium">Histórico de Versões</h3>
                {versions.map((version) => (
                  <Card key={version.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Versão {version.version}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(version.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Restaurar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="config" className="p-4">
              <div className="space-y-4">
                <h3 className="font-medium">Configurações</h3>
                <div className="space-y-2">
                  <Label>Configurações Gerais</Label>
                  <Input placeholder="Título do projeto" />
                  <Textarea placeholder="Descrição do projeto" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 bg-gray-100 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
              {currentPage && (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="components">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="p-4 space-y-4"
                      >
                        {currentPage.components.map((component, index) => (
                          <Draggable
                            key={component.id}
                            draggableId={component.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                  selectedComponentId === component.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setSelectedComponentId(component.id)}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline">{component.type}</Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteComponent(component.id);
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="text-gray-800">
                                  {component.type === 'text' && component.props.content}
                                  {component.type === 'button' && component.props.text}
                                  {component.type === 'image' && 'Imagem'}
                                  {component.type === 'input' && component.props.placeholder}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        <div className="flex justify-center space-x-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => addComponent('text')}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Texto
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => addComponent('button')}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Botão
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => addComponent('image')}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Imagem
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => addComponent('input')}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Input
                          </Button>
                        </div>
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Property Panel Component
interface PropertyPanelProps {
  selectedComponent: EditorComponent;
  onChange: (updated: Partial<EditorComponent>) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ selectedComponent, onChange }) => {
  const updateProps = (newProps: Record<string, any>) => {
    onChange({ props: { ...selectedComponent.props, ...newProps } });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Propriedades</h3>
      
      {selectedComponent.type === 'text' && (
        <div className="space-y-2">
          <Label>Conteúdo</Label>
          <Textarea
            value={selectedComponent.props.content || ''}
            onChange={(e) => updateProps({ content: e.target.value })}
          />
          <Label>Tamanho da fonte</Label>
          <Input
            type="number"
            value={selectedComponent.props.fontSize || 16}
            onChange={(e) => updateProps({ fontSize: parseInt(e.target.value) })}
          />
          <Label>Cor</Label>
          <Input
            type="color"
            value={selectedComponent.props.color || '#000000'}
            onChange={(e) => updateProps({ color: e.target.value })}
          />
        </div>
      )}
      
      {selectedComponent.type === 'button' && (
        <div className="space-y-2">
          <Label>Texto</Label>
          <Input
            value={selectedComponent.props.text || ''}
            onChange={(e) => updateProps({ text: e.target.value })}
          />
          <Label>Cor de fundo</Label>
          <Input
            type="color"
            value={selectedComponent.props.backgroundColor || '#007bff'}
            onChange={(e) => updateProps({ backgroundColor: e.target.value })}
          />
          <Label>Cor do texto</Label>
          <Input
            type="color"
            value={selectedComponent.props.textColor || '#ffffff'}
            onChange={(e) => updateProps({ textColor: e.target.value })}
          />
        </div>
      )}
      
      {selectedComponent.type === 'image' && (
        <div className="space-y-2">
          <Label>URL da imagem</Label>
          <Input
            value={selectedComponent.props.src || ''}
            onChange={(e) => updateProps({ src: e.target.value })}
          />
          <Label>Texto alternativo</Label>
          <Input
            value={selectedComponent.props.alt || ''}
            onChange={(e) => updateProps({ alt: e.target.value })}
          />
          <Label>Largura</Label>
          <Input
            type="number"
            value={selectedComponent.props.width || 300}
            onChange={(e) => updateProps({ width: parseInt(e.target.value) })}
          />
          <Label>Altura</Label>
          <Input
            type="number"
            value={selectedComponent.props.height || 200}
            onChange={(e) => updateProps({ height: parseInt(e.target.value) })}
          />
        </div>
      )}
      
      {selectedComponent.type === 'input' && (
        <div className="space-y-2">
          <Label>Placeholder</Label>
          <Input
            value={selectedComponent.props.placeholder || ''}
            onChange={(e) => updateProps({ placeholder: e.target.value })}
          />
          <Label>Rótulo</Label>
          <Input
            value={selectedComponent.props.label || ''}
            onChange={(e) => updateProps({ label: e.target.value })}
          />
        </div>
      )}
    </div>
  );
};

export default ModularQuizEditor;
