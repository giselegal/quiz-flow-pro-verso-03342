
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Type, 
  Image, 
  MousePointer, 
  Palette, 
  Layout, 
  Settings2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react';

export interface ModularPropertiesPanelProps {
  selectedComponent: any;
  onPropertyChange: (property: string, value: any) => void;
  onSave: () => void;
  onReset: () => void;
}

interface PropertyGroup {
  id: string;
  title: string;
  properties: Record<string, any>;
}

// Create property groups for different component types
export const createTextPropertyGroups = (component: any): PropertyGroup[] => [
  {
    id: 'content',
    title: 'Content',
    properties: {
      text: component.properties?.text || '',
      fontSize: component.properties?.fontSize || '16px',
      fontWeight: component.properties?.fontWeight || 'normal',
      color: component.properties?.color || '#000000'
    }
  },
  {
    id: 'layout',
    title: 'Layout',
    properties: {
      alignment: component.properties?.alignment || 'left',
      padding: component.properties?.padding || '0px',
      margin: component.properties?.margin || '0px'
    }
  }
];

export const createImagePropertyGroups = (component: any): PropertyGroup[] => [
  {
    id: 'content',
    title: 'Content',
    properties: {
      src: component.properties?.src || '',
      alt: component.properties?.alt || '',
      width: component.properties?.width || 'auto',
      height: component.properties?.height || 'auto'
    }
  },
  {
    id: 'style',
    title: 'Style',
    properties: {
      borderRadius: component.properties?.borderRadius || '0px',
      objectFit: component.properties?.objectFit || 'cover'
    }
  }
];

export const createButtonPropertyGroups = (component: any): PropertyGroup[] => [
  {
    id: 'content',
    title: 'Content',
    properties: {
      text: component.properties?.text || 'Button',
      url: component.properties?.url || '',
      target: component.properties?.target || '_self'
    }
  },
  {
    id: 'style',
    title: 'Style',
    properties: {
      backgroundColor: component.properties?.backgroundColor || '#007bff',
      color: component.properties?.color || '#ffffff',
      padding: component.properties?.padding || '12px 24px',
      borderRadius: component.properties?.borderRadius || '6px'
    }
  }
];

const ModularPropertiesPanel: React.FC<ModularPropertiesPanelProps> = ({
  selectedComponent,
  onPropertyChange,
  onSave,
  onReset
}) => {
  if (!selectedComponent) {
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="text-center text-gray-500 py-8">
            Select a component to edit its properties
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get property groups based on component type
  const getPropertyGroups = (): PropertyGroup[] => {
    switch (selectedComponent.type) {
      case 'text':
        return createTextPropertyGroups(selectedComponent);
      case 'image':
        return createImagePropertyGroups(selectedComponent);
      case 'button':
        return createButtonPropertyGroups(selectedComponent);
      default:
        return [];
    }
  };

  const propertyGroups = getPropertyGroups();

  const handlePropertyChange = (groupId: string, propertyKey: string, value: any) => {
    onPropertyChange(`${groupId}.${propertyKey}`, value);
  };

  const renderPropertyEditor = (group: PropertyGroup) => {
    const groupProps = group.properties;
    
    return (
      <div key={group.id} className="space-y-4">
        <h3 className="font-medium text-sm text-gray-700 border-b pb-2">
          {group.title}
        </h3>
        
        {Object.entries(groupProps).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            
            {typeof value === 'string' && (
              <input
                type="text"
                value={value}
                onChange={(e) => handlePropertyChange(group.id, key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            
            {typeof value === 'number' && (
              <input
                type="number"
                value={value}
                onChange={(e) => handlePropertyChange(group.id, key, parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            
            {typeof value === 'boolean' && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handlePropertyChange(group.id, key, e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Enable</span>
              </label>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center space-x-2">
          <Settings2 className="w-5 h-5" />
          <span>Properties</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-4 space-y-6">
          {propertyGroups.map(renderPropertyEditor)}
          
          <div className="flex space-x-2 pt-4 border-t">
            <Button onClick={onSave} className="flex-1">
              Save
            </Button>
            <Button onClick={onReset} variant="outline" className="flex-1">
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModularPropertiesPanel;
