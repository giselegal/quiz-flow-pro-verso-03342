import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ComponentsSidebar } from './ComponentsSidebar';
import { PropertyPanel } from './PropertyPanel';
import { DevicePreview } from './DevicePreview';
import { VersioningPanel } from './panels/VersioningPanel';
import { Eye, Settings, History, Smartphone, Tablet, Monitor, Save, Undo, Redo } from 'lucide-react';

// Define interfaces and types
interface EditorPage {
  id: string;
  title: string;
  components: EditorComponent[];
  settings: Record<string, any>;
  order: number;
}

interface EditorComponent {
  id: string;
  type: string;
  data: Record<string, any>;
  style: Record<string, any>;
  order: number;
}

interface Version {
  id: string;
  timestamp: number;
  description: string;
  data: any;
}

interface EditorState {
  pages: EditorPage[];
  selectedPageId: string | null;
  selectedComponentId: string | null;
  deviceView: 'desktop' | 'tablet' | 'mobile';
  activeTab: 'editor' | 'versions' | 'settings';
  isPreviewMode: boolean;
}

export const ModularQuizEditor: React.FC = () => {
  const [state, setState] = useState<EditorState>({
    pages: [{
      id: 'page-1',
      title: 'Page 1',
      components: [],
      settings: {},
      order: 0
    }],
    selectedPageId: 'page-1',
    selectedComponentId: null,
    deviceView: 'desktop',
    activeTab: 'editor',
    isPreviewMode: false
  });

  const [versions, setVersions] = useState<Version[]>([]);

  const selectedPage = state.pages.find(p => p.id === state.selectedPageId);
  const selectedComponent = selectedPage?.components.find(c => c.id === state.selectedComponentId);

  const handleAddComponent = useCallback((type: string) => {
    if (!selectedPage) return;

    const newComponent: EditorComponent = {
      id: `component-${Date.now()}`,
      type,
      data: { title: `New ${type}` },
      style: {},
      order: selectedPage.components.length
    };

    setState(prev => ({
      ...prev,
      pages: prev.pages.map(page => 
        page.id === prev.selectedPageId 
          ? { ...page, components: [...page.components, newComponent] }
          : page
      ),
      selectedComponentId: newComponent.id
    }));
  }, [selectedPage]);

  const handleUpdateComponent = useCallback((componentId: string, updates: Partial<EditorComponent>) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.map(page => 
        page.id === prev.selectedPageId 
          ? {
              ...page,
              components: page.components.map(comp =>
                comp.id === componentId ? { ...comp, ...updates } : comp
              )
            }
          : page
      )
    }));
  }, []);

  const handleDeleteComponent = useCallback((componentId: string) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.map(page => 
        page.id === prev.selectedPageId 
          ? {
              ...page,
              components: page.components.filter(comp => comp.id !== componentId)
            }
          : page
      ),
      selectedComponentId: null
    }));
  }, []);

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination || !selectedPage) return;

    const items = Array.from(selectedPage.components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setState(prev => ({
      ...prev,
      pages: prev.pages.map(page => 
        page.id === prev.selectedPageId 
          ? { ...page, components: items.map((item, index) => ({ ...item, order: index })) }
          : page
      )
    }));
  }, [selectedPage]);

  const handleSaveVersion = useCallback((description: string) => {
    const newVersion: Version = {
      id: `version-${Date.now()}`,
      timestamp: Date.now(),
      description,
      data: { ...state }
    };
    setVersions(prev => [...prev, newVersion]);
  }, [state]);

  const handleRestoreVersion = useCallback((versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (version) {
      setState(version.data);
    }
  }, [versions]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Quiz Editor</h1>
            <Select value={state.deviceView} onValueChange={(value: 'desktop' | 'tablet' | 'mobile') => setState(prev => ({ ...prev, deviceView: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desktop">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4" />
                    <span>Desktop</span>
                  </div>
                </SelectItem>
                <SelectItem value="tablet">
                  <div className="flex items-center space-x-2">
                    <Tablet className="w-4 h-4" />
                    <span>Tablet</span>
                  </div>
                </SelectItem>
                <SelectItem value="mobile">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4" />
                    <span>Mobile</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Redo className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setState(prev => ({ ...prev, isPreviewMode: !prev.isPreviewMode }))}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <Tabs value={state.activeTab} onValueChange={(value: any) => setState(prev => ({ ...prev, activeTab: value }))}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="versions">Versions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="flex-1 overflow-hidden">
              <ComponentsSidebar onAddComponent={handleAddComponent} />
            </TabsContent>
            
            <TabsContent value="versions" className="flex-1 overflow-hidden">
              <VersioningPanel 
                versions={versions}
                onSaveVersion={handleSaveVersion}
                onRestoreVersion={handleRestoreVersion}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="flex-1 p-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quiz-title">Quiz Title</Label>
                  <Input id="quiz-title" placeholder="Enter quiz title" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          <DevicePreview 
            deviceView={state.deviceView}
            components={selectedPage?.components || []}
            onSelectComponent={(id: string) => setState(prev => ({ ...prev, selectedComponentId: id }))}
            selectedComponentId={state.selectedComponentId}
            onDragEnd={handleDragEnd}
          />
        </div>

        {/* Properties Panel */}
        {selectedComponent && (
          <div className="w-80 bg-white border-l border-gray-200">
            <PropertyPanel 
              block={selectedComponent}
              onUpdate={(updated: Partial<EditorComponent>) => handleUpdateComponent(selectedComponent.id, updated)}
              onDelete={() => handleDeleteComponent(selectedComponent.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ModularQuizEditor;
