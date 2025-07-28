
import React, { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, GripVertical, Eye, EyeOff, Undo, Redo } from 'lucide-react';
import ModularPropertiesPanel from './ModularPropertiesPanel';

interface Component {
  id: string;
  type: 'text' | 'image' | 'button' | 'container';
  properties: Record<string, any>;
  order: number;
}

interface ModularEditorProps {
  initialComponents?: Component[];
  onSave?: (components: Component[]) => void;
  onPreview?: (components: Component[]) => void;
}

const ModularEditor: React.FC<ModularEditorProps> = ({
  initialComponents = [],
  onSave,
  onPreview
}) => {
  const [components, setComponents] = useState<Component[]>(initialComponents);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [activeTab, setActiveTab] = useState('components');
  const [isPreview, setIsPreview] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState<Component | null>(null);

  // Component templates
  const componentTemplates = {
    text: {
      type: 'text' as const,
      properties: {
        content: {
          title: 'Sample Title',
          text: 'Sample text content',
          buttonText: 'Click me',
          buttonUrl: '#',
          imageUrl: ''
        },
        style: {
          backgroundColor: '#ffffff',
          textColor: '#000000',
          fontSize: '16px',
          fontWeight: 'normal',
          padding: '16px',
          borderRadius: '8px'
        },
        layout: {
          width: '100%',
          height: 'auto',
          alignment: 'left'
        },
        animation: {
          type: 'none',
          duration: 300
        }
      }
    },
    image: {
      type: 'image' as const,
      properties: {
        content: {
          title: '',
          text: '',
          buttonText: '',
          buttonUrl: '',
          imageUrl: 'https://via.placeholder.com/300x200'
        },
        style: {
          backgroundColor: '#ffffff',
          textColor: '#000000',
          fontSize: '16px',
          fontWeight: 'normal',
          padding: '0px',
          borderRadius: '8px'
        },
        layout: {
          width: '300px',
          height: '200px',
          alignment: 'center'
        },
        animation: {
          type: 'none',
          duration: 300
        }
      }
    },
    button: {
      type: 'button' as const,
      properties: {
        content: {
          title: '',
          text: '',
          buttonText: 'Click me',
          buttonUrl: '#',
          imageUrl: ''
        },
        style: {
          backgroundColor: '#007bff',
          textColor: '#ffffff',
          fontSize: '16px',
          fontWeight: 'bold',
          padding: '12px 24px',
          borderRadius: '6px'
        },
        layout: {
          width: 'auto',
          height: 'auto',
          alignment: 'center'
        },
        animation: {
          type: 'none',
          duration: 300
        }
      }
    }
  };

  const addComponent = useCallback((type: 'text' | 'image' | 'button') => {
    const template = componentTemplates[type];
    const newComponent: Component = {
      id: `${type}_${Date.now()}`,
      type,
      properties: template.properties,
      order: components.length
    };
    
    setComponents(prev => [...prev, newComponent]);
    setSelectedComponent(newComponent);
  }, [components.length]);

  const updateComponent = useCallback((id: string, updates: Partial<Component['properties']>) => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === id 
          ? { ...comp, properties: { ...comp.properties, ...updates } }
          : comp
      )
    );
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
    setSelectedComponent(null);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const component = components.find(c => c.id === event.active.id);
    setDraggedComponent(component || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      setDraggedComponent(null);
      return;
    }

    const activeIndex = components.findIndex(c => c.id === active.id);
    const overIndex = components.findIndex(c => c.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      const newComponents = [...components];
      const [removed] = newComponents.splice(activeIndex, 1);
      newComponents.splice(overIndex, 0, removed);
      
      // Update order
      const reorderedComponents = newComponents.map((comp, index) => ({
        ...comp,
        order: index
      }));
      
      setComponents(reorderedComponents);
    }
    
    setDraggedComponent(null);
  };

  const handleSave = () => {
    onSave?.(components);
  };

  const handlePreview = () => {
    setIsPreview(!isPreview);
    onPreview?.(components);
  };

  const renderComponentPreview = (component: Component) => {
    const { type, properties } = component;
    const style = properties.style || {};
    const content = properties.content || {};
    
    switch (type) {
      case 'text':
        return (
          <div style={style} className="p-4 border rounded">
            <h3 className="text-lg font-semibold">{content.title}</h3>
            <p>{content.text}</p>
          </div>
        );
      
      case 'image':
        return (
          <div style={style} className="border rounded overflow-hidden">
            <img 
              src={content.imageUrl} 
              alt={content.title || 'Component image'}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        );
      
      case 'button':
        return (
          <button 
            style={style}
            className="px-4 py-2 rounded cursor-pointer hover:opacity-80"
          >
            {content.buttonText}
          </button>
        );
      
      default:
        return <div>Unknown component type</div>;
    }
  };

  const handlePropertyChange = (groupId: string, propertyKey: string, value: any) => {
    if (selectedComponent) {
      const updates = {
        ...selectedComponent.properties,
        [groupId]: {
          ...selectedComponent.properties[groupId],
          [propertyKey]: value
        }
      };
      updateComponent(selectedComponent.id, updates);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Modular Editor</h1>
        <div className="flex gap-2">
          <Button onClick={handleSave} variant="outline">
            Save
          </Button>
          <Button onClick={handlePreview} variant="outline">
            {isPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r bg-white flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
            </TabsList>
            
            <TabsContent value="components" className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Add Components</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => addComponent('text')}
                      variant="outline"
                      className="h-20 flex flex-col items-center gap-1"
                    >
                      <span className="text-xs">Text</span>
                    </Button>
                    <Button
                      onClick={() => addComponent('image')}
                      variant="outline"
                      className="h-20 flex flex-col items-center gap-1"
                    >
                      <span className="text-xs">Image</span>
                    </Button>
                    <Button
                      onClick={() => addComponent('button')}
                      variant="outline"
                      className="h-20 flex flex-col items-center gap-1"
                    >
                      <span className="text-xs">Button</span>
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Component List</h3>
                  <div className="space-y-2">
                    {components.map(component => (
                      <div
                        key={component.id}
                        className={`p-2 border rounded cursor-pointer hover:bg-gray-50 ${
                          selectedComponent?.id === component.id ? 'bg-blue-50 border-blue-300' : ''
                        }`}
                        onClick={() => setSelectedComponent(component)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">
                            {component.type}
                          </span>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteComponent(component.id);
                            }}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="properties" className="flex-1 overflow-y-auto">
              <ModularPropertiesPanel
                selectedComponent={selectedComponent}
                onPropertyChange={handlePropertyChange}
                onSave={handleSave}
                onReset={() => setSelectedComponent(null)}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto">
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {components.map(component => (
                    <div
                      key={component.id}
                      className={`relative ${
                        selectedComponent?.id === component.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedComponent(component)}
                    >
                      {!isPreview && (
                        <div className="absolute top-2 right-2 z-10 flex gap-1">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteComponent(component.id);
                            }}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      {renderComponentPreview(component)}
                    </div>
                  ))}
                </div>
              </SortableContext>
              
              <DragOverlay>
                {draggedComponent && renderComponentPreview(draggedComponent)}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModularEditor;
