import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Plus, Layout, Eye, Code2 } from 'lucide-react';

import { 
  ModularComponent, 
  FlexContainer, 
  TextModule, 
  ImageModule, 
  ButtonModule 
} from './ModularComponent';

import { 
  ModularPropertiesPanel,
  createTextPropertyGroups,
  createImagePropertyGroups,
  createButtonPropertyGroups
} from './ModularPropertiesPanel';

// =====================================================================
// 🎯 MODULAR EDITOR - Editor de Componentes Modulares com Flexbox
// =====================================================================

interface ComponentData {
  id: string;
  type: 'text' | 'image' | 'button' | 'container';
  properties: Record<string, any>;
  children?: ComponentData[];
}

interface ModularEditorProps {
  initialComponents?: ComponentData[];
  onComponentsChange?: (components: ComponentData[]) => void;
  className?: string;
}

export const ModularEditor: React.FC<ModularEditorProps> = ({
  initialComponents = [],
  onComponentsChange,
  className = ''
}) => {
  const [components, setComponents] = useState<ComponentData[]>(initialComponents);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const selectedComponent = components.find(comp => comp.id === selectedComponentId);

  // =====================================================================
  // 🔧 COMPONENT MANAGEMENT
  // =====================================================================

  const addComponent = (type: ComponentData['type']) => {
    const newComponent: ComponentData = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      properties: getDefaultPropertiesForType(type)
    };

    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    setSelectedComponentId(newComponent.id);
    onComponentsChange?.(newComponents);
  };

  const updateComponent = (id: string, properties: Record<string, any>) => {
    const newComponents = components.map(comp => 
      comp.id === id 
        ? { ...comp, properties: { ...comp.properties, ...properties } }
        : comp
    );
    setComponents(newComponents);
    onComponentsChange?.(newComponents);
  };

  const deleteComponent = (id: string) => {
    const newComponents = components.filter(comp => comp.id !== id);
    setComponents(newComponents);
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
    onComponentsChange?.(newComponents);
  };

  const duplicateComponent = (id: string) => {
    const componentToDuplicate = components.find(comp => comp.id === id);
    if (!componentToDuplicate) return;

    const newComponent: ComponentData = {
      ...componentToDuplicate,
      id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    setSelectedComponentId(newComponent.id);
    onComponentsChange?.(newComponents);
  };

  const moveComponent = (id: string, direction: 'up' | 'down') => {
    const currentIndex = components.findIndex(comp => comp.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= components.length) return;

    const newComponents = [...components];
    const [movedComponent] = newComponents.splice(currentIndex, 1);
    newComponents.splice(newIndex, 0, movedComponent);

    setComponents(newComponents);
    onComponentsChange?.(newComponents);
  };

  // =====================================================================
  // 🎨 PROPERTY MANAGEMENT
  // =====================================================================

  const handlePropertyChange = (groupId: string, propertyKey: string, value: any) => {
    if (!selectedComponentId) return;

    const newProperties = {
      [propertyKey]: value
    };

    updateComponent(selectedComponentId, newProperties);
  };

  const getPropertyGroups = () => {
    if (!selectedComponent) return [];

    switch (selectedComponent.type) {
      case 'text':
        return createTextPropertyGroups(selectedComponent.properties);
      case 'image':
        return createImagePropertyGroups(selectedComponent.properties);
      case 'button':
        return createButtonPropertyGroups(selectedComponent.properties);
      default:
        return [];
    }
  };

  // =====================================================================
  // 🔧 HELPERS
  // =====================================================================

  const getDefaultPropertiesForType = (type: ComponentData['type']) => {
    switch (type) {
      case 'text':
        return {
          text: 'Novo texto editável',
          size: 'base',
          weight: 'normal',
          color: '#000000',
          align: 'left'
        };
      case 'image':
        return {
          src: 'https://via.placeholder.com/300x200?text=Nova+Imagem',
          alt: 'Nova imagem',
          width: 300,
          height: 200,
          objectFit: 'cover',
          rounded: false
        };
      case 'button':
        return {
          text: 'Novo botão',
          variant: 'primary',
          size: 'md',
          fullWidth: false,
          disabled: false
        };
      default:
        return {};
    }
  };

  const renderComponent = (component: ComponentData) => {
    const commonProps = {
      id: component.id,
      isSelected: selectedComponentId === component.id,
      isEditable: !previewMode,
      onSelect: setSelectedComponentId,
      onEdit: setSelectedComponentId,
      onDelete: deleteComponent,
      onDuplicate: duplicateComponent,
      onMove: moveComponent
    };

    switch (component.type) {
      case 'text':
        return (
          <TextModule
            key={component.id}
            {...commonProps}
            {...component.properties}
          />
        );
      case 'image':
        return (
          <ImageModule
            key={component.id}
            {...commonProps}
            {...component.properties}
          />
        );
      case 'button':
        return (
          <ButtonModule
            key={component.id}
            {...commonProps}
            {...component.properties}
            onClick={() => console.log('Botão clicado:', component.id)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`modular-editor h-screen flex ${className}`}>
      {/* 📱 CANVAS AREA */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layout className="h-5 w-5" />
            <h1 className="font-semibold">Editor Modular</h1>
            <Badge variant="outline">{components.length} componentes</Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={previewMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-1" />
              {previewMode ? 'Editar' : 'Preview'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('Export:', components)}
            >
              <Code2 className="h-4 w-4 mr-1" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gray-50 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <FlexContainer 
              direction="column" 
              gap={16}
              className="min-h-96 bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-200 p-6"
            >
              {components.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">Nenhum componente adicionado</p>
                    <p className="text-sm">Use o painel lateral para adicionar componentes</p>
                  </div>
                </div>
              ) : (
                components.map(renderComponent)
              )}
            </FlexContainer>
          </div>
        </div>
      </div>

      {/* 🎛️ SIDEBAR */}
      <div className="w-80 bg-white border-l flex flex-col">
        {/* Add Components */}
        <div className="p-4 border-b">
          <h2 className="font-medium mb-3 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Componentes
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addComponent('text')}
              className="flex flex-col items-center p-3 h-auto"
            >
              <Type className="h-4 w-4 mb-1" />
              <span className="text-xs">Texto</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => addComponent('image')}
              className="flex flex-col items-center p-3 h-auto"
            >
              <Image className="h-4 w-4 mb-1" />
              <span className="text-xs">Imagem</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => addComponent('button')}
              className="flex flex-col items-center p-3 h-auto"
            >
              <Plus className="h-4 w-4 mb-1" />
              <span className="text-xs">Botão</span>
            </Button>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="flex-1 overflow-hidden">
          {selectedComponent ? (
            <ModularPropertiesPanel
              componentId={selectedComponent.id}
              componentType={selectedComponent.type}
              propertyGroups={getPropertyGroups()}
              onPropertyChange={handlePropertyChange}
              onSave={() => console.log('Salvo:', selectedComponent)}
              onReset={() => {
                const defaultProps = getDefaultPropertiesForType(selectedComponent.type);
                updateComponent(selectedComponent.id, defaultProps);
              }}
              className="h-full border-none"
            />
          ) : (
            <div className="p-4 text-center text-gray-500">
              <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Selecione um componente para editar suas propriedades</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
