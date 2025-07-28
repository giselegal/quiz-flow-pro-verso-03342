
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/Input'; // Use Input with capital I
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { useComponentManager } from '@/hooks/useComponentManager';
import { QuizOption, SimpleComponent, ComponentType, QuizConfig, QuizFunnel, Version } from '@/types/quiz';
import { VersioningPanel } from './panels/VersioningPanel';
import { 
  Play, 
  Pause, 
  Save, 
  Download, 
  Upload, 
  Copy, 
  Trash2, 
  Plus,
  Settings,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Tablet,
  Undo,
  Redo,
  Clock,
  Users,
  BarChart3,
  Target
} from 'lucide-react';

interface ModularQuizEditorProps {
  quizId: string;
  onSave?: (quiz: QuizFunnel) => void;
  onPreview?: (quiz: QuizFunnel) => void;
}

export const ModularQuizEditor: React.FC<ModularQuizEditorProps> = ({
  quizId,
  onSave,
  onPreview
}) => {
  const [activeTab, setActiveTab] = useState<'pages' | 'components' | 'settings' | 'versions'>('pages');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [quizConfig, setQuizConfig] = useState<QuizConfig>({
    title: '',
    description: '',
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b'
    }
  });

  const {
    components,
    selectedComponentId,
    setSelectedComponentId,
    addComponent,
    updateComponent,
    deleteComponent,
    getComponentById
  } = useComponentManager();

  // Mock quiz funnel management
  const [quizFunnel, setQuizFunnel] = useState<QuizFunnel>({
    id: quizId,
    name: 'My Quiz',
    pages: []
  });

  // Mock versions for demonstration
  const [versions, setVersions] = useState<Version[]>([
    {
      id: '1',
      name: 'Version 1.0',
      description: 'Initial version',
      timestamp: Date.now() - 86400000,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      data: quizFunnel
    }
  ]);

  const handleAddComponent = (type: ComponentType) => {
    const componentId = addComponent(type);
    setSelectedComponentId(componentId);
    toast({
      title: "Component added",
      description: `${type} component has been added to your quiz.`
    });
  };

  const handleUpdateComponent = (id: string, updates: Partial<SimpleComponent>) => {
    updateComponent(id, updates);
    toast({
      title: "Component updated",
      description: "Your changes have been saved."
    });
  };

  const handleDeleteComponent = (id: string) => {
    deleteComponent(id);
    toast({
      title: "Component deleted",
      description: "The component has been removed from your quiz."
    });
  };

  const handleSaveQuiz = () => {
    const updatedFunnel = {
      ...quizFunnel,
      pages: [{
        id: '1',
        title: 'Quiz Page',
        type: 'question' as const,
        progress: 0,
        showHeader: true,
        showProgress: true,
        components: components
      }]
    };
    
    setQuizFunnel(updatedFunnel);
    onSave?.(updatedFunnel);
    
    toast({
      title: "Quiz saved",
      description: "Your quiz has been saved successfully."
    });
  };

  const handlePreview = () => {
    const updatedFunnel = {
      ...quizFunnel,
      pages: [{
        id: '1',
        title: 'Quiz Page',
        type: 'question' as const,
        progress: 0,
        showHeader: true,
        showProgress: true,
        components: components
      }]
    };
    
    onPreview?.(updatedFunnel);
    setIsPreviewMode(true);
  };

  const handleCreateVersion = (name: string, description: string) => {
    const newVersion: Version = {
      id: (versions.length + 1).toString(),
      name,
      description,
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
      data: quizFunnel
    };
    
    setVersions([...versions, newVersion]);
    toast({
      title: "Version created",
      description: `Version "${name}" has been created.`
    });
  };

  const handleRestoreVersion = (versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (version) {
      setQuizFunnel(version.data);
      toast({
        title: "Version restored",
        description: `Version "${version.name}" has been restored.`
      });
    }
  };

  const selectedComponent = selectedComponentId ? getComponentById(selectedComponentId) : null;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Quiz Builder</h1>
            <Badge variant="outline">{quizFunnel.name}</Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isPreviewMode ? 'Exit Preview' : 'Preview'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveQuiz}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            
            <Button
              size="sm"
              onClick={handlePreview}
            >
              <Play className="h-4 w-4 mr-2" />
              Preview Quiz
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="versions">Versions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pages" className="flex-1 p-4">
              <div className="space-y-4">
                <h3 className="font-medium">Quiz Pages</h3>
                {/* Page management content */}
                <div className="text-sm text-gray-500">
                  Page management coming soon...
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="components" className="flex-1 p-4">
              <div className="space-y-4">
                <h3 className="font-medium">Add Components</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  {(['title', 'subtitle', 'text', 'image', 'button', 'options'] as ComponentType[]).map((type) => (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddComponent(type)}
                      className="capitalize"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {type}
                    </Button>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Current Components</h4>
                  {components.map((component) => (
                    <div
                      key={component.id}
                      className={`p-2 rounded border cursor-pointer transition-colors ${
                        selectedComponentId === component.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedComponentId(component.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{component.type}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteComponent(component.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="flex-1 p-4">
              <div className="space-y-4">
                <h3 className="font-medium">Quiz Settings</h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="quiz-title">Quiz Title</Label>
                    <Input
                      id="quiz-title"
                      value={quizConfig.title}
                      onChange={(e) => setQuizConfig({
                        ...quizConfig,
                        title: e.target.value
                      })}
                      placeholder="Enter quiz title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="quiz-description">Description</Label>
                    <Textarea
                      id="quiz-description"
                      value={quizConfig.description}
                      onChange={(e) => setQuizConfig({
                        ...quizConfig,
                        description: e.target.value
                      })}
                      placeholder="Enter quiz description"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <Input
                      id="primary-color"
                      type="color"
                      value={quizConfig.theme?.primaryColor}
                      onChange={(e) => setQuizConfig({
                        ...quizConfig,
                        theme: {
                          ...quizConfig.theme,
                          primaryColor: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="versions" className="flex-1 p-4">
              <VersioningPanel
                versions={versions}
                onCreateVersion={handleCreateVersion}
                onRestoreVersion={handleRestoreVersion}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 bg-gray-100 p-6">
          <div className="bg-white rounded-lg shadow-sm min-h-full">
            {/* Component rendering area */}
            <div className="p-6">
              {components.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🎯</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No components yet</h3>
                  <p className="text-gray-500">Add components from the sidebar to start building your quiz</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {components.map((component) => (
                    <div
                      key={component.id}
                      className={`p-4 rounded border-2 transition-colors ${
                        selectedComponentId === component.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedComponentId(component.id)}
                    >
                      <div className="text-sm font-medium text-gray-600 mb-2 capitalize">
                        {component.type}
                      </div>
                      <div className="text-gray-800">
                        {component.data.text || component.data.title || 'No content'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-white border-l border-gray-200">
          {selectedComponent ? (
            <div className="p-4">
              <h3 className="font-medium mb-4">Properties</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="component-text">Text</Label>
                  <Input
                    id="component-text"
                    value={selectedComponent.data.text || ''}
                    onChange={(e) => handleUpdateComponent(selectedComponent.id, {
                      data: { ...selectedComponent.data, text: e.target.value }
                    })}
                    placeholder="Enter text"
                  />
                </div>
                
                {selectedComponent.type === 'title' && (
                  <div>
                    <Label htmlFor="component-title">Title</Label>
                    <Input
                      id="component-title"
                      value={selectedComponent.data.title || ''}
                      onChange={(e) => handleUpdateComponent(selectedComponent.id, {
                        data: { ...selectedComponent.data, title: e.target.value }
                      })}
                      placeholder="Enter title"
                    />
                  </div>
                )}
                
                {selectedComponent.type === 'image' && (
                  <>
                    <div>
                      <Label htmlFor="component-src">Image URL</Label>
                      <Input
                        id="component-src"
                        value={selectedComponent.data.src || ''}
                        onChange={(e) => handleUpdateComponent(selectedComponent.id, {
                          data: { ...selectedComponent.data, src: e.target.value }
                        })}
                        placeholder="Enter image URL"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="component-alt">Alt Text</Label>
                      <Input
                        id="component-alt"
                        value={selectedComponent.data.alt || ''}
                        onChange={(e) => handleUpdateComponent(selectedComponent.id, {
                          data: { ...selectedComponent.data, alt: e.target.value }
                        })}
                        placeholder="Enter alt text"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-medium mb-2">Properties</h3>
              <p className="text-sm">Select a component to edit its properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModularQuizEditor;
