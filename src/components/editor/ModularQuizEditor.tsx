
import React, { useState, useCallback, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SimpleComponent, ComponentType, QuizConfig, QuizFunnel, Version } from '@/types/quiz';
import { Plus, Save, Play, Settings, Layers, History, Eye, Code, Smartphone, Monitor, Download } from 'lucide-react';
import { useFunnelManager } from '@/hooks/useFunnelManager';
import { useVersionManager } from '@/hooks/useVersionManager';
import { useComponentManager } from '@/hooks/useComponentManager';
import { QuizOption } from '@/types/quiz';

// Import panels
import { PropertiesPanel } from './properties/PropertiesPanel';
import { ConfigPanel } from './config/ConfigPanel';
import { FunnelManagementPanel } from './panels/FunnelManagementPanel';
import { VersioningPanel } from './panels/VersioningPanel';

interface ModularQuizEditorProps {
  initialFunnel?: QuizFunnel;
  onSave?: (funnel: QuizFunnel) => void;
  onPreview?: (funnel: QuizFunnel) => void;
  onExport?: (funnel: QuizFunnel) => void;
}

// Define interfaces for panel props
interface PropertiesPanelProps {
  selectedComponent: SimpleComponent;
  onUpdateComponent: (componentId: string, newData: Partial<SimpleComponent>) => void;
  onDeleteComponent: (componentId: string) => void;
}

interface ConfigPanelProps {
  config: QuizConfig;
  onUpdateConfig: (updates: Partial<QuizConfig>) => void;
  onUpdateConfigSection: <K extends keyof QuizConfig>(section: K, updates: Partial<QuizConfig[K]>) => void;
}

interface FunnelManagementPanelProps {
  funnel: QuizFunnel;
  onLoadFunnel: (funnelId: string) => Promise<void>;
  onDeleteFunnel: (funnelId: string) => Promise<void>;
  isLoading: boolean;
}

interface VersioningPanelProps {
  funnel: QuizFunnel;
  onLoadVersion: (version: Version) => QuizFunnel | null;
  onDeleteVersion: () => void;
  onClearHistory: () => void;
  isLoading: boolean;
}

export const ModularQuizEditor: React.FC<ModularQuizEditorProps> = ({
  initialFunnel,
  onSave,
  onPreview,
  onExport
}) => {
  const [activeTab, setActiveTab] = useState('design');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');

  // Use hooks
  const funnelManager = useFunnelManager();
  const { createFunnel, updateFunnel, getFunnelById, activeFunnelId } = funnelManager;
  const componentManager = useComponentManager();
  const versionManager = useVersionManager();

  // Get current funnel
  const currentFunnel = useMemo(() => {
    return initialFunnel || (activeFunnelId ? getFunnelById(activeFunnelId) : null);
  }, [initialFunnel, activeFunnelId, getFunnelById]);

  // Get current page
  const currentPage = currentFunnel?.pages?.[0];
  const components = currentPage?.components || [];

  // Get selected component
  const selectedComponent = useMemo(() => {
    return components.find(c => c.id === selectedComponentId) || null;
  }, [components, selectedComponentId]);

  // Component management
  const handleAddComponent = useCallback((type: ComponentType) => {
    if (!currentFunnel) return;

    const newComponent: SimpleComponent = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      order: components.length,
      style: {},
      ...(type === 'text' && { text: 'New text component' }),
      ...(type === 'image' && { src: '', alt: 'New image', width: 300, height: 200 }),
      ...(type === 'button' && { text: 'Click me', href: '#' }),
      ...(type === 'title' && { text: 'New title', level: 1 }),
      ...(type === 'subtitle' && { text: 'New subtitle', level: 2 }),
      ...(type === 'input' && { placeholder: 'Enter text...', required: false }),
      ...(type === 'email' && { placeholder: 'Enter email...', required: true }),
      ...(type === 'options' && { 
        question: 'Select an option', 
        options: [
          { id: 'opt1', text: 'Option 1', value: 'option1' },
          { id: 'opt2', text: 'Option 2', value: 'option2' }
        ] as QuizOption[]
      }),
      ...(type === 'video' && { src: '', controls: true, autoplay: false }),
      ...(type === 'progress' && { value: 50, max: 100 }),
      ...(type === 'spacer' && { height: 20 }),
      ...(type === 'faq' && { 
        question: 'Frequently Asked Question?', 
        answer: 'This is the answer to the question.' 
      }),
      ...(type === 'testimonial' && { 
        text: 'This is a great testimonial!', 
        author: 'John Doe',
        role: 'Customer'
      }),
      ...(type === 'guarantee' && { 
        title: '30-Day Money Back Guarantee',
        description: 'If you\'re not satisfied, get your money back.'
      }),
      ...(type === 'bonus' && { 
        title: 'Exclusive Bonus',
        description: 'Get this amazing bonus with your purchase!'
      }),
      ...(type === 'social-proof' && { 
        text: 'Join 10,000+ satisfied customers!'
      }),
      ...(type === 'pricing' && { 
        price: '$99',
        originalPrice: '$199',
        period: 'one-time'
      }),
      ...(type === 'countdown' && { 
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        text: 'Limited Time Offer!'
      })
    };

    const updatedComponents = [...components, newComponent];
    
    updateFunnel(currentFunnel.id, {
      pages: [{
        ...currentPage,
        components: updatedComponents
      }]
    });

    setSelectedComponentId(newComponent.id);
  }, [currentFunnel, currentPage, components, updateFunnel]);

  const handleUpdateComponent = useCallback((componentId: string, updates: Partial<SimpleComponent>) => {
    if (!currentFunnel) return;

    const updatedComponents = components.map(c => 
      c.id === componentId ? { ...c, ...updates } : c
    );

    updateFunnel(currentFunnel.id, {
      pages: [{
        ...currentPage,
        components: updatedComponents
      }]
    });
  }, [currentFunnel, currentPage, components, updateFunnel]);

  const handleDeleteComponent = useCallback((componentId: string) => {
    if (!currentFunnel) return;

    const updatedComponents = components.filter(c => c.id !== componentId);
    
    updateFunnel(currentFunnel.id, {
      pages: [{
        ...currentPage,
        components: updatedComponents
      }]
    });

    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
    }
  }, [currentFunnel, currentPage, components, updateFunnel, selectedComponentId]);

  const handleSave = useCallback(() => {
    if (currentFunnel && onSave) {
      onSave(currentFunnel);
    }
  }, [currentFunnel, onSave]);

  const handlePreview = useCallback(() => {
    if (currentFunnel && onPreview) {
      onPreview(currentFunnel);
    }
  }, [currentFunnel, onPreview]);

  if (!currentFunnel) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No funnel selected</p>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg">Quiz Editor</h2>
            <p className="text-sm text-gray-600">{currentFunnel.name}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="design">
                <Plus className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="properties">
                <Settings className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="config">
                <Layers className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="versions">
                <History className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="flex-1 p-4">
              <ComponentLibrary onAddComponent={handleAddComponent} />
            </TabsContent>

            <TabsContent value="properties" className="flex-1 p-4">
              {selectedComponent ? (
                <PropertiesPanel
                  selectedComponent={selectedComponent}
                  onUpdateComponent={handleUpdateComponent}
                  onDeleteComponent={handleDeleteComponent}
                />
              ) : (
                <p className="text-gray-500 text-center">Select a component to edit its properties</p>
              )}
            </TabsContent>

            <TabsContent value="config" className="flex-1 p-4">
              <ConfigPanel
                config={currentFunnel.config}
                onUpdateConfig={(updates) => updateFunnel(currentFunnel.id, { config: { ...currentFunnel.config, ...updates } })}
                onUpdateConfigSection={(section, updates) => updateFunnel(currentFunnel.id, { 
                  config: { 
                    ...currentFunnel.config, 
                    [section]: { ...currentFunnel.config[section], ...updates } 
                  } 
                })}
              />
            </TabsContent>

            <TabsContent value="versions" className="flex-1 p-4">
              <VersioningPanel
                funnel={currentFunnel}
                onLoadVersion={versionManager.loadVersion}
                onDeleteVersion={versionManager.deleteVersion}
                onClearHistory={versionManager.clearHistory}
                isLoading={false}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant={deviceView === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceView('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={deviceView === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceView('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
              <Button
                variant={isPreviewMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                <Eye className="w-4 h-4" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handlePreview}>
                <Play className="w-4 h-4 mr-2" />
                Test
              </Button>
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-auto">
            <div className={`mx-auto bg-white min-h-full ${
              deviceView === 'mobile' ? 'max-w-sm' : 'max-w-4xl'
            }`}>
              <QuizCanvas
                components={components}
                selectedComponentId={selectedComponentId}
                onSelectComponent={setSelectedComponentId}
                onUpdateComponent={handleUpdateComponent}
                onDeleteComponent={handleDeleteComponent}
                isPreviewMode={isPreviewMode}
                deviceView={deviceView}
              />
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

// Component Library
const ComponentLibrary: React.FC<{ onAddComponent: (type: ComponentType) => void }> = ({ onAddComponent }) => {
  const componentTypes: { type: ComponentType; label: string; category: string }[] = [
    { type: 'title', label: 'Title', category: 'Text' },
    { type: 'subtitle', label: 'Subtitle', category: 'Text' },
    { type: 'text', label: 'Text', category: 'Text' },
    { type: 'image', label: 'Image', category: 'Media' },
    { type: 'video', label: 'Video', category: 'Media' },
    { type: 'button', label: 'Button', category: 'Interactive' },
    { type: 'input', label: 'Input', category: 'Interactive' },
    { type: 'email', label: 'Email', category: 'Interactive' },
    { type: 'options', label: 'Options', category: 'Interactive' },
    { type: 'progress', label: 'Progress', category: 'Feedback' },
    { type: 'spacer', label: 'Spacer', category: 'Layout' },
    { type: 'faq', label: 'FAQ', category: 'Content' },
    { type: 'testimonial', label: 'Testimonial', category: 'Social' },
    { type: 'guarantee', label: 'Guarantee', category: 'Sales' },
    { type: 'bonus', label: 'Bonus', category: 'Sales' },
    { type: 'social-proof', label: 'Social Proof', category: 'Social' },
    { type: 'pricing', label: 'Pricing', category: 'Sales' },
    { type: 'countdown', label: 'Countdown', category: 'Urgency' }
  ];

  const categories = useMemo(() => {
    return componentTypes.reduce((acc, comp) => {
      if (!acc[comp.category]) {
        acc[comp.category] = [];
      }
      acc[comp.category].push(comp);
      return acc;
    }, {} as Record<string, typeof componentTypes>);
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Components</h3>
      {Object.entries(categories).map(([category, components]) => (
        <div key={category}>
          <h4 className="text-sm font-medium text-gray-600 mb-2">{category}</h4>
          <div className="grid grid-cols-2 gap-2">
            {components.map(({ type, label }) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => onAddComponent(type)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Quiz Canvas
const QuizCanvas: React.FC<{
  components: SimpleComponent[];
  selectedComponentId: string | null;
  onSelectComponent: (id: string) => void;
  onUpdateComponent: (id: string, updates: Partial<SimpleComponent>) => void;
  onDeleteComponent: (id: string) => void;
  isPreviewMode: boolean;
  deviceView: 'desktop' | 'mobile';
}> = ({
  components,
  selectedComponentId,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent,
  isPreviewMode,
  deviceView
}) => {
  return (
    <div className="p-8 space-y-4">
      {components.map(component => (
        <ComponentRenderer
          key={component.id}
          component={component}
          isSelected={selectedComponentId === component.id}
          onSelect={() => onSelectComponent(component.id)}
          onUpdate={(updates) => onUpdateComponent(component.id, updates)}
          onDelete={() => onDeleteComponent(component.id)}
          isPreviewMode={isPreviewMode}
          deviceView={deviceView}
        />
      ))}
      
      {components.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p>No components added yet.</p>
          <p className="text-sm">Use the sidebar to add components to your quiz.</p>
        </div>
      )}
    </div>
  );
};

// Component Renderer
const ComponentRenderer: React.FC<{
  component: SimpleComponent;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<SimpleComponent>) => void;
  onDelete: () => void;
  isPreviewMode: boolean;
  deviceView: 'desktop' | 'mobile';
}> = ({ component, isSelected, onSelect, onUpdate, onDelete, isPreviewMode, deviceView }) => {
  const renderComponent = () => {
    switch (component.type) {
      case 'title':
        return (
          <h1 className="text-2xl font-bold" style={component.style}>
            {component.text || 'Title'}
          </h1>
        );
      case 'subtitle':
        return (
          <h2 className="text-xl font-semibold" style={component.style}>
            {component.text || 'Subtitle'}
          </h2>
        );
      case 'text':
        return (
          <p className="text-base" style={component.style}>
            {component.text || 'Text content'}
          </p>
        );
      case 'image':
        return (
          <img
            src={component.src || '/api/placeholder/300/200'}
            alt={component.alt || 'Image'}
            className="max-w-full h-auto"
            style={component.style}
          />
        );
      case 'button':
        return (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            style={component.style}
          >
            {component.text || 'Button'}
          </button>
        );
      case 'input':
        return (
          <input
            type="text"
            placeholder={component.placeholder || 'Enter text...'}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={component.style}
          />
        );
      case 'spacer':
        return (
          <div
            className="w-full bg-gray-100 border-dashed border-2 border-gray-300 flex items-center justify-center"
            style={{ height: component.height || 20, ...component.style }}
          >
            <span className="text-gray-400 text-sm">Spacer ({component.height || 20}px)</span>
          </div>
        );
      default:
        return (
          <div className="p-4 bg-gray-100 border border-gray-300 rounded">
            <p className="text-gray-600">Component: {component.type}</p>
          </div>
        );
    }
  };

  return (
    <div
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''} ${
        !isPreviewMode ? 'hover:ring-1 hover:ring-gray-300 cursor-pointer' : ''
      }`}
      onClick={!isPreviewMode ? onSelect : undefined}
    >
      {renderComponent()}
      
      {!isPreviewMode && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default ModularQuizEditor;
