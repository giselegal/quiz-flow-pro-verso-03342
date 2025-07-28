
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Settings, Eye, EyeOff, Save, Trash2 } from 'lucide-react';

interface ModularEditorProps {
  initialData?: any;
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

interface Component {
  id: string;
  type: 'text' | 'image' | 'button' | 'container';
  properties: {
    content: {
      title: string;
      text: string;
      buttonText: string;
      buttonUrl: string;
      imageUrl: string;
    };
    style: {
      backgroundColor: string;
      textColor: string;
      fontSize: string;
      fontWeight: string;
      padding: string;
      borderRadius: string;
    };
    layout: {
      width: string;
      height: string;
      margin: string;
      display: string;
    };
    animation: {
      type: string;
      duration: string;
      delay: string;
    };
  };
}

const ModularEditor: React.FC<ModularEditorProps> = ({ 
  initialData = {}, 
  onSave,
  onCancel 
}) => {
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [data, setData] = useState(initialData);

  const addComponent = (type: Component['type']) => {
    const newComponent: Component = {
      id: `component-${Date.now()}`,
      type,
      properties: {
        content: {
          title: 'New Component',
          text: 'Sample text',
          buttonText: 'Click me',
          buttonUrl: '#',
          imageUrl: '',
        },
        style: {
          backgroundColor: '#ffffff',
          textColor: '#000000',
          fontSize: '16px',
          fontWeight: 'normal',
          padding: '16px',
          borderRadius: '8px',
        },
        layout: {
          width: '100%',
          height: 'auto',
          margin: '8px',
          display: 'block',
        },
        animation: {
          type: 'none',
          duration: '0.3s',
          delay: '0s',
        },
      },
    };

    setComponents(prev => [...prev, newComponent]);
    setSelectedComponent(newComponent.id);
  };

  const updateComponent = (componentId: string, updates: Partial<Component>) => {
    setComponents(prev => prev.map(comp => 
      comp.id === componentId 
        ? { ...comp, ...updates }
        : comp
    ));
  };

  const deleteComponent = (componentId: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== componentId));
    setSelectedComponent(null);
  };

  const handlePropertyChange = (property: string, value: any) => {
    if (!selectedComponent) return;
    
    const component = components.find(c => c.id === selectedComponent);
    if (!component) return;

    const updatedComponent = { ...component };
    
    // Handle nested property updates
    if (property.includes('.')) {
      const [group, key] = property.split('.');
      if (updatedComponent.properties[group as keyof typeof updatedComponent.properties]) {
        (updatedComponent.properties[group as keyof typeof updatedComponent.properties] as any)[key] = value;
      }
    } else {
      (updatedComponent.properties as any)[property] = value;
    }

    updateComponent(selectedComponent, updatedComponent);
  };

  const handleSave = () => {
    const saveData = {
      ...data,
      components,
      lastModified: new Date().toISOString()
    };
    
    onSave?.(saveData);
  };

  const handleReset = () => {
    setComponents([]);
    setSelectedComponent(null);
    setData(initialData);
  };

  const renderComponent = (component: Component) => {
    const { type, properties } = component;
    const isSelected = selectedComponent === component.id;

    const baseStyle = {
      backgroundColor: properties.style.backgroundColor,
      color: properties.style.textColor,
      fontSize: properties.style.fontSize,
      fontWeight: properties.style.fontWeight,
      padding: properties.style.padding,
      borderRadius: properties.style.borderRadius,
      width: properties.layout.width,
      height: properties.layout.height,
      margin: properties.layout.margin,
      display: properties.layout.display,
      border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
      cursor: 'pointer',
    };

    const handleClick = () => {
      if (!isPreviewMode) {
        setSelectedComponent(component.id);
      }
    };

    switch (type) {
      case 'text':
        return (
          <div key={component.id} style={baseStyle} onClick={handleClick}>
            <h3>{properties.content.title}</h3>
            <p>{properties.content.text}</p>
          </div>
        );

      case 'image':
        return (
          <div key={component.id} style={baseStyle} onClick={handleClick}>
            {properties.content.imageUrl ? (
              <img 
                src={properties.content.imageUrl} 
                alt={properties.content.title}
                style={{ width: '100%', height: 'auto' }}
              />
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f3f4f6' }}>
                Image Placeholder
              </div>
            )}
          </div>
        );

      case 'button':
        return (
          <div key={component.id} style={baseStyle} onClick={handleClick}>
            <button style={{ 
              padding: '8px 16px', 
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              {properties.content.buttonText}
            </button>
          </div>
        );

      case 'container':
        return (
          <div key={component.id} style={baseStyle} onClick={handleClick}>
            <div style={{ padding: '20px', border: '1px dashed #9ca3af' }}>
              Container: {properties.content.title}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const selectedComp = components.find(c => c.id === selectedComponent);

  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar */}
      <div className="border-b bg-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => addComponent('text')}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Text</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => addComponent('image')}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Image</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => addComponent('button')}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Button</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => addComponent('container')}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Container</span>
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center space-x-2"
          >
            {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{isPreviewMode ? 'Edit' : 'Preview'}</span>
          </Button>
          <Button onClick={handleSave} className="flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm min-h-[600px] p-6">
            {components.length === 0 ? (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <p className="text-gray-500 mb-4">No components added yet</p>
                  <Button onClick={() => addComponent('text')}>Add your first component</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {components.map(renderComponent)}
              </div>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        {selectedComp && !isPreviewMode && (
          <div className="w-80 border-l bg-white p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Properties</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteComponent(selectedComp.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={selectedComp.properties.content.title}
                    onChange={(e) => handlePropertyChange('content.title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="text">Text</Label>
                  <Textarea
                    id="text"
                    value={selectedComp.properties.content.text}
                    onChange={(e) => handlePropertyChange('content.text', e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={selectedComp.properties.style.backgroundColor}
                    onChange={(e) => handlePropertyChange('style.backgroundColor', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="textColor">Text Color</Label>
                  <Input
                    id="textColor"
                    type="color"
                    value={selectedComp.properties.style.textColor}
                    onChange={(e) => handlePropertyChange('style.textColor', e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="layout" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    value={selectedComp.properties.layout.width}
                    onChange={(e) => handlePropertyChange('layout.width', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="padding">Padding</Label>
                  <Input
                    id="padding"
                    value={selectedComp.properties.style.padding}
                    onChange={(e) => handlePropertyChange('style.padding', e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModularEditor;
