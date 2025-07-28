import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ComponentsSidebar } from './ComponentsSidebar';
import { VersioningPanel } from './panels/VersioningPanel';
import { DevicePreview } from './DevicePreview';
import { PropertyPanel } from './PropertyPanel';
import { EditorToolbar } from './toolbar/EditorToolbar';
import { Version } from '@/types/quiz';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  Copy, 
  Move, 
  Settings, 
  Smartphone, 
  Tablet, 
  Monitor,
  Save,
  Undo,
  Redo,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Share2,
  Layers,
  Palette,
  Code,
  Database,
  BarChart3,
  Users,
  Calendar,
  Clock,
  Zap,
  Star,
  Heart,
  MessageCircle,
  ThumbsUp,
  Archive,
  BookOpen,
  Lightbulb,
  Target,
  TrendingUp,
  Award,
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ModularQuizEditorProps {
  quizId?: string;
  onSave?: (data: any) => void;
  onPreview?: () => void;
}

interface EditorComponent {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: EditorComponent[];
  order: number;
}

interface EditorPage {
  id: string;
  title: string;
  components: EditorComponent[];
  settings: Record<string, any>;
  order: number;
}

interface EditorState {
  isDragging: boolean;
  dragOverIndex: number | null;
  selectedComponentId: string | null;
  currentPageIndex: number;
  deviceView: 'mobile' | 'tablet' | 'desktop';
  activeTab: 'editor' | 'funis' | 'historico' | 'config';
  activeConfigSection: string;
  isPreviewMode: boolean;
}

interface VersionChange {
  type: 'add' | 'remove' | 'edit';
  component?: string;
  page?: string;
  description: string;
}

const ModularQuizEditor: React.FC<ModularQuizEditorProps> = ({
  quizId,
  onSave,
  onPreview
}) => {
  const [pages, setPages] = useState<EditorPage[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [state, setState] = useState<EditorState>({
    isDragging: false,
    dragOverIndex: null,
    selectedComponentId: null,
    currentPageIndex: 0,
    deviceView: 'desktop',
    activeTab: 'editor',
    activeConfigSection: 'general',
    isPreviewMode: false
  });

  const handleDragStart = () => {
    setState(prev => ({ ...prev, isDragging: true }));
  };

  const handleDragUpdate = (event: any) => {
    if (!event.destination) return;
    setState(prev => ({ ...prev, dragOverIndex: event.destination.index }));
  };

  const handleDragEnd = (event: any) => {
    setState(prev => ({ ...prev, isDragging: false, dragOverIndex: null }));
    const { source, destination } = event;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const reorderedPages = reorder(
      pages,
      source.index,
      destination.index
    );

    setPages(reorderedPages);
  };

  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleAddComponent = (type: string) => {
    const newComponent: EditorComponent = {
      id: `component-${Date.now()}`,
      type,
      props: { text: 'Novo Componente' },
      order: pages[state.currentPageIndex].components.length
    };

    setPages(prev => {
      const newPages = [...prev];
      newPages[state.currentPageIndex].components = [...newPages[state.currentPageIndex].components, newComponent];
      return newPages;
    });
  };

  const handleUpdateComponent = (componentId: string, newProps: Record<string, any>) => {
    setPages(prev => {
      const newPages = [...prev];
      newPages[state.currentPageIndex].components = newPages[state.currentPageIndex].components.map(component => {
        if (component.id === componentId) {
          return { ...component, props: { ...component.props, ...newProps } };
        }
        return component;
      });
      return newPages;
    });
  };

  const handleDeleteComponent = (componentId: string) => {
    setPages(prev => {
      const newPages = [...prev];
      newPages[state.currentPageIndex].components = newPages[state.currentPageIndex].components.filter(component => component.id !== componentId);
      return newPages;
    });
  };

  const handleAddPage = () => {
    const newPage: EditorPage = {
      id: `page-${Date.now()}`,
      title: `Página ${pages.length + 1}`,
      components: [],
      settings: {},
      order: pages.length
    };

    setPages(prev => [...prev, newPage]);
  };

  const handleUpdatePage = (pageId: string, newSettings: Record<string, any>) => {
    setPages(prev => {
      const newPages = [...prev];
      newPages[state.currentPageIndex] = { ...newPages[state.currentPageIndex], settings: newSettings };
      return newPages;
    });
  };

  const handleDeletePage = (pageId: string) => {
    setPages(prev => prev.filter(page => page.id !== pageId));
  };

  const handleCreateVersion = (name: string, description: string) => {
    const newVersion: Version = {
      id: `version-${Date.now()}`,
      name,
      description,
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
      data: { pages }
    };
    setVersions(prev => [...prev, newVersion]);
  };

  const handleRestoreVersion = (versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (version) {
      setPages(version.data.pages);
    }
  };

  const handleDeleteVersion = (versionId: string) => {
    setVersions(prev => prev.filter(v => v.id !== versionId));
  };

  const selectedComponent = pages[state.currentPageIndex]?.components.find(
    c => c.id === state.selectedComponentId
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <EditorToolbar
        onSave={() => onSave?.(pages)}
        onPreview={onPreview}
        onUndo={() => {}}
        onRedo={() => {}}
        onTogglePreview={() => setState(prev => ({ ...prev, isPreviewMode: !prev.isPreviewMode }))}
        isPreviewing={state.isPreviewMode}
        canUndo={false}
        canRedo={false}
        canSave={true}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 border-r border-gray-200 bg-white">
          <Tabs value={state.activeTab} onValueChange={(value) => setState(prev => ({ ...prev, activeTab: value as any }))}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="funis">Funis</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
              <TabsTrigger value="config">Config</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="p-0">
              <ComponentsSidebar onComponentSelect={(type) => {}} />
            </TabsContent>
            
            <TabsContent value="funis" className="p-4">
              <h3 className="font-semibold mb-4">Funis Salvos</h3>
              <p className="text-sm text-gray-600">Nenhum funil salvo ainda.</p>
            </TabsContent>
            
            <TabsContent value="historico" className="p-0">
              <VersioningPanel
                versions={versions}
                onDeleteVersion={handleDeleteVersion}
                onRestoreVersion={handleRestoreVersion}
              />
            </TabsContent>
            
            <TabsContent value="config" className="p-4">
              <h3 className="font-semibold mb-4">Configurações</h3>
              <p className="text-sm text-gray-600">Configurações do editor.</p>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <Select value={state.deviceView} onValueChange={(value) => setState(prev => ({ ...prev, deviceView: value as any }))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      Mobile
                    </div>
                  </SelectItem>
                  <SelectItem value="tablet">
                    <div className="flex items-center gap-2">
                      <Tablet className="w-4 h-4" />
                      Tablet
                    </div>
                  </SelectItem>
                  <SelectItem value="desktop">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      Desktop
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setState(prev => ({ ...prev, isPreviewMode: !prev.isPreviewMode }))}
              >
                {state.isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {state.isPreviewMode ? 'Editar' : 'Visualizar'}
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <DevicePreview
              deviceType={state.deviceView}
              isPreviewMode={state.isPreviewMode}
              pages={pages}
              currentPageIndex={state.currentPageIndex}
              selectedComponentId={state.selectedComponentId}
              onSelectComponent={(id) => setState(prev => ({ ...prev, selectedComponentId: id }))}
            />
          </div>
        </div>
        
        <div className="w-80 border-l border-gray-200 bg-white">
          <PropertyPanel
            selectedComponent={selectedComponent}
            onChange={(updated) => {
              if (updated) {
                setPages(prev => prev.map((page, index) => 
                  index === state.currentPageIndex
                    ? {
                        ...page,
                        components: page.components.map(comp =>
                          comp.id === updated.id ? updated : comp
                        )
                      }
                    : page
                ));
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ModularQuizEditor;
