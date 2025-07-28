
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimpleComponent, QuizConfig, QuizFunnel, Version, QuizOption } from '@/types/quiz';
import { useVersionManager } from '@/hooks/useVersionManager';
import { useComponentManager } from '@/hooks/useComponentManager';
import PropertiesPanel from './properties/PropertiesPanel';
import ConfigPanel from './config/ConfigPanel';
import FunnelManagementPanel from './panels/FunnelManagementPanel';
import { VersioningPanel } from './panels/VersioningPanel';
import { Plus, Save, Eye, EyeOff, Settings, History, Folder } from 'lucide-react';

interface ModularQuizEditorProps {
  funnelId?: string;
  onSave?: (funnel: QuizFunnel) => void;
  onPreview?: (funnel: QuizFunnel) => void;
}

export const ModularQuizEditor: React.FC<ModularQuizEditorProps> = ({
  funnelId,
  onSave,
  onPreview
}) => {
  const [activeTab, setActiveTab] = useState('editor');
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Component management
  const {
    components,
    selectedComponentId,
    setSelectedComponentId,
    addComponent,
    updateComponent,
    deleteComponent
  } = useComponentManager();
  
  // Version management
  const {
    versions,
    currentVersion,
    saveVersion,
    loadVersion,
    deleteVersion,
    clearHistory
  } = useVersionManager(funnelId);
  
  // Quiz configuration
  const [quizConfig, setQuizConfig] = useState<QuizConfig>({
    title: 'New Quiz',
    description: '',
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b'
    }
  });
  
  // Current funnel state
  const [currentFunnel, setCurrentFunnel] = useState<QuizFunnel>({
    id: funnelId || `funnel-${Date.now()}`,
    name: 'New Funnel',
    description: 'A new quiz funnel',
    pages: [
      {
        id: 'intro-page',
        title: 'Introduction',
        type: 'intro',
        progress: 0,
        showHeader: true,
        showProgress: true,
        components: []
      }
    ]
  });

  const selectedComponent = components.find(c => c.id === selectedComponentId);

  // Component type options
  const componentTypes = [
    { type: 'title' as const, label: 'Title', icon: '📝' },
    { type: 'text' as const, label: 'Text', icon: '📄' },
    { type: 'image' as const, label: 'Image', icon: '🖼️' },
    { type: 'button' as const, label: 'Button', icon: '🔘' },
    { type: 'input' as const, label: 'Input', icon: '📝' },
    { type: 'options' as const, label: 'Options', icon: '☑️' },
    { type: 'spacer' as const, label: 'Spacer', icon: '⬜' },
    { type: 'video' as const, label: 'Video', icon: '🎥' }
  ];

  const handleAddComponent = useCallback((type: SimpleComponent['type']) => {
    const componentId = addComponent(type);
    
    // Add to current page
    const currentPage = currentFunnel.pages[0];
    if (currentPage) {
      const newComponent: SimpleComponent = {
        id: componentId,
        type,
        data: getDefaultDataForType(type),
        style: {}
      };
      
      const updatedPages = currentFunnel.pages.map(page => 
        page.id === currentPage.id 
          ? { ...page, components: [...page.components, newComponent] }
          : page
      );
      
      setCurrentFunnel(prev => ({ ...prev, pages: updatedPages }));
    }
  }, [addComponent, currentFunnel.pages]);

  const handleUpdateComponent = useCallback((componentId: string, newData: Partial<SimpleComponent>) => {
    updateComponent(componentId, newData);
    
    // Update in funnel pages
    const updatedPages = currentFunnel.pages.map(page => ({
      ...page,
      components: page.components.map(component =>
        component.id === componentId ? { ...component, ...newData } : component
      )
    }));
    
    setCurrentFunnel(prev => ({ ...prev, pages: updatedPages }));
  }, [updateComponent, currentFunnel.pages]);

  const handleDeleteComponent = useCallback((componentId: string) => {
    deleteComponent(componentId);
    
    // Remove from funnel pages
    const updatedPages = currentFunnel.pages.map(page => ({
      ...page,
      components: page.components.filter(component => component.id !== componentId)
    }));
    
    setCurrentFunnel(prev => ({ ...prev, pages: updatedPages }));
  }, [deleteComponent, currentFunnel.pages]);

  const handleSave = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Save version
      const versionId = await saveVersion(
        currentFunnel,
        `Version ${new Date().toLocaleString()}`,
        'Auto-saved version'
      );
      
      // Call external save handler if provided
      if (onSave) {
        onSave(currentFunnel);
      }
      
      console.log('Funnel saved successfully:', versionId);
    } catch (error) {
      console.error('Error saving funnel:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentFunnel, saveVersion, onSave]);

  const handlePreview = useCallback(() => {
    setIsPreviewing(!isPreviewing);
    if (onPreview) {
      onPreview(currentFunnel);
    }
  }, [isPreviewing, onPreview, currentFunnel]);

  const handleLoadVersion = useCallback((versionId: string) => {
    const versionData = loadVersion(versionId);
    if (versionData) {
      setCurrentFunnel(versionData);
    }
  }, [loadVersion]);

  const handleDeleteVersion = useCallback((versionId: string) => {
    deleteVersion(versionId);
  }, [deleteVersion]);

  const handleUpdateConfig = useCallback((updates: Partial<QuizConfig>) => {
    setQuizConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const handleUpdateConfigSection = useCallback(<K extends keyof QuizConfig>(
    section: K,
    updates: Partial<QuizConfig[K]>
  ) => {
    setQuizConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  }, []);

  // Mock funnel management functions (would integrate with actual funnel system)
  const handleLoadFunnel = useCallback(async (funnelId: string) => {
    // Mock implementation
    console.log('Loading funnel:', funnelId);
  }, []);

  const handleDeleteFunnel = useCallback(async (funnelId: string) => {
    // Mock implementation
    console.log('Deleting funnel:', funnelId);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Quiz Editor</h2>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-4 grid grid-cols-4 w-full">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="properties">Props</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">Add Components</h3>
                <div className="grid grid-cols-2 gap-2">
                  {componentTypes.map(({ type, label, icon }) => (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddComponent(type)}
                      className="h-12 flex flex-col items-center gap-1"
                    >
                      <span className="text-lg">{icon}</span>
                      <span className="text-xs">{label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Page Components</h3>
                <div className="space-y-2">
                  {components.map((component, index) => (
                    <Card
                      key={component.id}
                      className={`cursor-pointer transition-colors ${
                        selectedComponentId === component.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedComponentId(component.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {component.type}
                            </Badge>
                            <span className="text-sm font-medium">
                              {component.data.text || component.data.title || `Component ${index + 1}`}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteComponent(component.id);
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="properties" className="flex-1 p-4">
            {selectedComponent ? (
              <PropertiesPanel
                selectedComponent={selectedComponent}
                onUpdateComponent={handleUpdateComponent}
                onDeleteComponent={handleDeleteComponent}
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select a component to edit its properties
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="config" className="flex-1 p-4">
            <ConfigPanel
              config={quizConfig}
              onUpdateConfig={handleUpdateConfig}
              onUpdateConfigSection={handleUpdateConfigSection}
            />
          </TabsContent>
          
          <TabsContent value="versions" className="flex-1 p-4">
            <VersioningPanel
              versions={versions}
              currentVersionId={currentVersion}
              onLoadVersion={handleLoadVersion}
              onDeleteVersion={handleDeleteVersion}
              onClearHistory={clearHistory}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreview}
            >
              {isPreviewing ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </>
              )}
            </Button>
            
            <Badge variant={isPreviewing ? "default" : "secondary"}>
              {isPreviewing ? "Preview" : "Edit"}
            </Badge>
          </div>
        </div>
        
        {/* Canvas */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-8">
            {components.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p>No components added yet.</p>
                <p className="text-sm">Use the sidebar to add components to your quiz.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {components.map((component) => (
                  <div
                    key={component.id}
                    className={`border rounded-lg p-4 ${
                      selectedComponentId === component.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedComponentId(component.id)}
                  >
                    <div className="text-sm text-gray-500 mb-2">{component.type}</div>
                    <div className="space-y-2">
                      {component.data.text && (
                        <div className="text-sm">{component.data.text}</div>
                      )}
                      {component.data.title && (
                        <div className="text-lg font-semibold">{component.data.title}</div>
                      )}
                      {component.data.src && (
                        <img 
                          src={component.data.src} 
                          alt={component.data.alt || 'Component image'} 
                          className="max-w-full h-auto"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get default data for component types
function getDefaultDataForType(type: SimpleComponent['type']) {
  switch (type) {
    case 'title':
      return { text: 'New Title', fontSize: '24px', fontWeight: 'bold' };
    case 'text':
      return { text: 'New text content' };
    case 'image':
      return { src: '', alt: 'Image', width: 300, height: 200 };
    case 'button':
      return { text: 'Click me', variant: 'default' };
    case 'input':
      return { type: 'text', placeholder: 'Enter text...', label: 'Input' };
    case 'options':
      return { 
        options: [
          { id: '1', text: 'Option 1', value: 'option1' },
          { id: '2', text: 'Option 2', value: 'option2' }
        ],
        multiSelect: false
      };
    case 'spacer':
      return { height: '20px' };
    case 'video':
      return { videoUrl: '', width: 560, height: 315 };
    default:
      return {};
  }
}

export default ModularQuizEditor;
