
import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { PropertyPanel } from './PropertyPanel';
import { VersioningPanel } from './panels/VersioningPanel';
import { SimplePage } from '@/types/quiz';
import { Version } from '@/types/quiz';

interface EditorPage {
  id: string;
  title: string;
  components: any[];
  settings: any;
  order: number;
}

interface EditorComponent {
  id: string;
  type: string;
  props: any;
  order: number;
}

interface ModularQuizEditorProps {
  initialPages?: SimplePage[];
  onSave?: (pages: SimplePage[]) => void;
}

export const ModularQuizEditor: React.FC<ModularQuizEditorProps> = ({
  initialPages = [],
  onSave
}) => {
  const [pages, setPages] = useState<EditorPage[]>(
    initialPages.map((page, index) => ({
      id: page.id,
      title: page.title,
      components: page.components,
      settings: {},
      order: index
    }))
  );
  
  const [activePageId, setActivePageId] = useState<string | null>(
    pages.length > 0 ? pages[0].id : null
  );
  
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [versions, setVersions] = useState<Version[]>([]);

  const activePage = pages.find(p => p.id === activePageId);
  const selectedComponent = activePage?.components.find(c => c.id === selectedComponentId);

  const handleSavePages = useCallback(() => {
    const simplePagesData: SimplePage[] = pages.map(page => ({
      id: page.id,
      title: page.title,
      type: 'question' as const,
      progress: 0,
      showHeader: true,
      showProgress: true,
      components: page.components
    }));
    
    if (onSave) {
      onSave(simplePagesData);
    }
  }, [pages, onSave]);

  const handleDragEnd = useCallback((result: any) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    // Handle component reordering logic here
    console.log('Drag ended:', { destination, source, draggableId });
  }, []);

  const addComponent = useCallback((type: string) => {
    if (!activePage) return;
    
    const newComponent: EditorComponent = {
      id: `component-${Date.now()}`,
      type,
      props: {},
      order: activePage.components.length
    };
    
    setPages(prev => prev.map(page => 
      page.id === activePageId 
        ? { ...page, components: [...page.components, newComponent] }
        : page
    ));
  }, [activePage, activePageId]);

  const updateComponent = useCallback((id: string, updates: any) => {
    setPages(prev => prev.map(page => 
      page.id === activePageId 
        ? {
            ...page,
            components: page.components.map(comp =>
              comp.id === id ? { ...comp, ...updates } : comp
            )
          }
        : page
    ));
  }, [activePageId]);

  const deleteComponent = useCallback((id: string) => {
    setPages(prev => prev.map(page => 
      page.id === activePageId 
        ? {
            ...page,
            components: page.components.filter(comp => comp.id !== id)
          }
        : page
    ));
    
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  }, [activePageId, selectedComponentId]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Quiz Editor</h1>
          <Select value={deviceView} onValueChange={(value: 'desktop' | 'mobile' | 'tablet') => setDeviceView(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desktop">Desktop</SelectItem>
              <SelectItem value="tablet">Tablet</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Preview
          </Button>
          <Button onClick={handleSavePages} size="sm">
            Save
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r flex flex-col">
          <Tabs defaultValue="pages" className="flex-1">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pages" className="flex-1 p-4">
              <div className="space-y-2">
                {pages.map((page) => (
                  <Card
                    key={page.id}
                    className={`cursor-pointer transition-colors ${
                      activePageId === page.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setActivePageId(page.id)}
                  >
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">{page.title}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="components" className="flex-1 p-4">
              <div className="space-y-2">
                {['text', 'image', 'button', 'input'].map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => addComponent(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex-1 p-4 overflow-auto">
              {activePage && (
                <Droppable droppableId="components">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {activePage.components.map((component, index) => (
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
                              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedComponentId === component.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setSelectedComponentId(component.id)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  {component.type}
                                </span>
                                <Badge variant="secondary">{component.id}</Badge>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </div>
          </DragDropContext>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-white border-l flex flex-col">
          <Tabs defaultValue="properties" className="flex-1">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="versions">Versions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties" className="flex-1 p-4">
              {selectedComponent ? (
                <PropertyPanel
                  block={selectedComponent}
                  onChange={(updated) => updateComponent(selectedComponent.id, updated)}
                  onDelete={() => deleteComponent(selectedComponent.id)}
                />
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  Select a component to edit its properties
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="versions" className="flex-1 p-4">
              <VersioningPanel 
                versions={versions}
                onDeleteVersion={(versionId: string) => {
                  setVersions(prev => prev.filter(v => v.id !== versionId));
                }}
                onRestoreVersion={(versionId: string) => {
                  console.log('Restore version:', versionId);
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ModularQuizEditor;
