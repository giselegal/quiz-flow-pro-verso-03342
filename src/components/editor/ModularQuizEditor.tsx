
import React, { useState, useCallback, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Copy, 
  Save, 
  Undo, 
  Redo, 
  Settings,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PropertyPanel } from './PropertyPanel';
import { QuizFunnel, SimplePage, SimpleComponent, Version } from '@/types/quiz';
import { EditorBlock } from '@/types/editor';

// Mock components for missing imports
const ComponentsSidebar = ({ onAddComponent }: { onAddComponent: (type: string) => void }) => (
  <div className="w-64 bg-gray-50 p-4">
    <h3 className="font-medium mb-4">Components</h3>
    <div className="space-y-2">
      <Button size="sm" onClick={() => onAddComponent('text')}>Add Text</Button>
      <Button size="sm" onClick={() => onAddComponent('image')}>Add Image</Button>
      <Button size="sm" onClick={() => onAddComponent('button')}>Add Button</Button>
    </div>
  </div>
);

const DevicePreview = ({ device, children }: { device: string; children: React.ReactNode }) => (
  <div className={`${device === 'mobile' ? 'max-w-sm' : device === 'tablet' ? 'max-w-md' : 'max-w-full'} mx-auto`}>
    {children}
  </div>
);

interface EditorComponent {
  id: string;
  type: string;
  content: any;
  style?: any;
}

interface EditorPage {
  id: string;
  title: string;
  components: EditorComponent[];
  settings?: any;
  order: number;
}

interface ModularQuizEditorProps {
  initialFunnel?: QuizFunnel;
  onSave?: (funnel: QuizFunnel) => void;
  onPreview?: (funnel: QuizFunnel) => void;
}

export const ModularQuizEditor: React.FC<ModularQuizEditorProps> = ({
  initialFunnel,
  onSave,
  onPreview
}) => {
  const [pages, setPages] = useState<EditorPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [history, setHistory] = useState<EditorPage[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize pages from funnel
  useEffect(() => {
    if (initialFunnel?.pages) {
      const editorPages: EditorPage[] = initialFunnel.pages.map((page, index) => ({
        id: page.id,
        title: page.title,
        components: page.components.map(comp => ({
          id: comp.id,
          type: comp.type,
          content: comp.data,
          style: comp.style
        })),
        settings: {},
        order: index
      }));
      setPages(editorPages);
      if (editorPages.length > 0) {
        setSelectedPageId(editorPages[0].id);
      }
    }
  }, [initialFunnel]);

  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(pages)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex, pages]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPages(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPages(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const addPage = useCallback(() => {
    const newPage: EditorPage = {
      id: `page-${Date.now()}`,
      title: `Page ${pages.length + 1}`,
      components: [],
      settings: {},
      order: pages.length
    };
    setPages([...pages, newPage]);
    setSelectedPageId(newPage.id);
    saveToHistory();
  }, [pages, saveToHistory]);

  const addComponent = useCallback((type: string) => {
    if (!selectedPageId) return;
    
    const newComponent: EditorComponent = {
      id: `component-${Date.now()}`,
      type,
      content: { text: 'New component' },
      style: {}
    };
    
    setPages(pages.map(page => 
      page.id === selectedPageId 
        ? { ...page, components: [...page.components, newComponent] }
        : page
    ));
    setSelectedComponentId(newComponent.id);
    saveToHistory();
  }, [selectedPageId, pages, saveToHistory]);

  const updateComponent = useCallback((componentId: string, updates: Partial<EditorComponent>) => {
    setPages(pages.map(page => ({
      ...page,
      components: page.components.map(comp => 
        comp.id === componentId ? { ...comp, ...updates } : comp
      )
    })));
    saveToHistory();
  }, [pages, saveToHistory]);

  const deleteComponent = useCallback((componentId: string) => {
    setPages(pages.map(page => ({
      ...page,
      components: page.components.filter(comp => comp.id !== componentId)
    })));
    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
    }
    saveToHistory();
  }, [pages, selectedComponentId, saveToHistory]);

  const handleSave = useCallback(() => {
    if (onSave) {
      const funnel: QuizFunnel = {
        id: initialFunnel?.id || 'new-funnel',
        name: initialFunnel?.name || 'New Funnel',
        pages: pages.map(page => ({
          id: page.id,
          title: page.title,
          type: 'question' as const,
          progress: 0,
          showHeader: true,
          showProgress: true,
          components: page.components.map(comp => ({
            id: comp.id,
            type: comp.type as SimpleComponent['type'],
            data: comp.content,
            style: comp.style || {}
          }))
        }))
      };
      onSave(funnel);
    }
  }, [pages, initialFunnel, onSave]);

  const handlePreview = useCallback(() => {
    if (onPreview) {
      const funnel: QuizFunnel = {
        id: initialFunnel?.id || 'preview-funnel',
        name: initialFunnel?.name || 'Preview Funnel',
        pages: pages.map(page => ({
          id: page.id,
          title: page.title,
          type: 'question' as const,
          progress: 0,
          showHeader: true,
          showProgress: true,
          components: page.components.map(comp => ({
            id: comp.id,
            type: comp.type as SimpleComponent['type'],
            data: comp.content,
            style: comp.style || {}
          }))
        }))
      };
      onPreview(funnel);
    }
  }, [pages, initialFunnel, onPreview]);

  const selectedPage = pages.find(page => page.id === selectedPageId);
  const selectedComponent = selectedPage?.components.find(comp => comp.id === selectedComponentId);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Quiz Editor</h2>
        </div>
        
        <Tabs defaultValue="pages" className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pages" className="p-4">
            <div className="space-y-2">
              <Button onClick={addPage} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Page
              </Button>
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={`p-2 rounded cursor-pointer ${
                    selectedPageId === page.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedPageId(page.id)}
                >
                  <div className="font-medium">{page.title}</div>
                  <div className="text-sm text-gray-500">
                    {page.components.length} components
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="components" className="p-4">
            <ComponentsSidebar onAddComponent={addComponent} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button size="sm" onClick={undo} disabled={historyIndex <= 0}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
              <Redo className="w-4 h-4" />
            </Button>
            <div className="border-l border-gray-200 h-6 mx-2" />
            <Select value={device} onValueChange={(value: 'desktop' | 'tablet' | 'mobile') => setDevice(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desktop">
                  <Monitor className="w-4 h-4 mr-2" />
                  Desktop
                </SelectItem>
                <SelectItem value="tablet">
                  <Tablet className="w-4 h-4 mr-2" />
                  Tablet
                </SelectItem>
                <SelectItem value="mobile">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={() => setIsPreviewMode(!isPreviewMode)}>
              {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button size="sm" onClick={handlePreview}>Preview</Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-4">
          <DevicePreview device={device}>
            {selectedPage && (
              <div className="bg-white rounded-lg shadow-sm min-h-96 p-4">
                <h3 className="text-lg font-semibold mb-4">{selectedPage.title}</h3>
                <div className="space-y-4">
                  {selectedPage.components.map((component) => (
                    <div
                      key={component.id}
                      className={`p-4 border rounded cursor-pointer ${
                        selectedComponentId === component.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedComponentId(component.id)}
                    >
                      <div className="text-sm text-gray-500 mb-2">{component.type}</div>
                      <div>{component.content.text || 'Component content'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </DevicePreview>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 bg-white border-l border-gray-200">
        {selectedComponent ? (
          <PropertyPanel
            block={{
              id: selectedComponent.id,
              type: selectedComponent.type,
              content: selectedComponent.content,
              properties: selectedComponent.content,
              order: 0
            }}
            onChange={(updated) => updateComponent(selectedComponent.id, { content: updated })}
            onDelete={() => deleteComponent(selectedComponent.id)}
          />
        ) : (
          <div className="p-4 text-center text-gray-500">
            Select a component to edit its properties
          </div>
        )}
      </div>
    </div>
  );
};

export default ModularQuizEditor;
