/**
 * 🎛️ DYNAMIC PROPERTIES PANEL - Painel de Propriedades Automático
 * 
 * Painel que carrega automaticamente as propriedades editáveis
 * de qualquer componente baseado na API
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useComponentConfiguration } from '@/hooks/useComponentConfiguration';
import { ComponentDefinition, PropertyCategory } from '@/types/componentConfiguration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Save, RotateCcw, Eye, EyeOff, Zap, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Importar editores de propriedades
import { PROPERTY_EDITOR_REGISTRY } from '@/components/editor/properties/core/propertyEditors';

interface DynamicPropertiesPanelProps {
  componentId: string;
  funnelId?: string;
  selectedComponent?: any;
  onPropertyChange?: (key: string, value: any) => void;
  onPreviewToggle?: (enabled: boolean) => void;
  onSave?: () => void;
  onReset?: () => void;
}

export default function DynamicPropertiesPanel({
  componentId,
  funnelId,
  selectedComponent,
  onPropertyChange,
  onPreviewToggle,
  onSave,
  onReset
}: DynamicPropertiesPanelProps) {
  
  // ============================================================================
  // STATE AND API CONNECTION
  // ============================================================================
  
  const {
    properties,
    isLoading,
    error,
    connectionStatus,
    updateProperty,
    updateProperties,
    resetToDefaults,
    componentDefinition,
    hasUnsavedChanges,
    lastSaved
  } = useComponentConfiguration({
    componentId,
    funnelId,
    realTimeSync: true,
    autoSave: false, // Manual save for editor
    cacheEnabled: true
  });
  
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const [activeCategory, setActiveCategory] = useState<PropertyCategory>(PropertyCategory.CONTENT);
  
  // ============================================================================
  // LOADING STATE
  // ============================================================================
  
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="text-sm text-gray-600">Carregando propriedades...</span>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // ============================================================================
  // ERROR STATE
  // ============================================================================
  
  if (error || !componentDefinition) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Definição do componente não encontrada'}
            <div className="mt-2 text-xs text-gray-500">
              Component ID: {componentId}
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // ============================================================================
  // PROPERTIES CATEGORIZATION
  // ============================================================================
  
  const categorizedProperties = useMemo(() => {
    const categories: Record<PropertyCategory, typeof componentDefinition.properties> = {
      [PropertyCategory.CONTENT]: [],
      [PropertyCategory.LAYOUT]: [],
      [PropertyCategory.VISUAL]: [],
      [PropertyCategory.BEHAVIOR]: [],
      [PropertyCategory.ADVANCED]: [],
    };
    
    componentDefinition.properties.forEach(prop => {
      const category = prop.category as PropertyCategory || PropertyCategory.ADVANCED;
      if (categories[category]) {
        categories[category].push(prop);
      }
    });
    
    // Remover categorias vazias
    Object.keys(categories).forEach(cat => {
      if (categories[cat as PropertyCategory].length === 0) {
        delete categories[cat as PropertyCategory];
      }
    });
    
    return categories;
  }, [componentDefinition.properties]);
  
  // ============================================================================
  // HANDLERS
  // ============================================================================
  
  const handlePropertyUpdate = async (key: string, value: any) => {
    try {
      await updateProperty(key, value);
      onPropertyChange?.(key, value);
    } catch (error) {
      console.error(`Failed to update property ${key}:`, error);
    }
  };
  
  const handleSave = async () => {
    try {
      await updateProperties(properties);
      onSave?.();
    } catch (error) {
      console.error('Failed to save properties:', error);
    }
  };
  
  const handleReset = async () => {
    try {
      await resetToDefaults();
      onReset?.();
    } catch (error) {
      console.error('Failed to reset properties:', error);
    }
  };
  
  const handlePreviewToggle = () => {
    const newState = !previewEnabled;
    setPreviewEnabled(newState);
    onPreviewToggle?.(newState);
  };
  
  // ============================================================================
  // RENDER PROPERTY EDITOR
  // ============================================================================
  
  const renderPropertyEditor = (propDef: typeof componentDefinition.properties[0]) => {
    const EditorComponent = PROPERTY_EDITOR_REGISTRY[propDef.type] || PROPERTY_EDITOR_REGISTRY['text'];
    const currentValue = properties[propDef.key] ?? propDef.defaultValue;
    
    return (
      <div key={propDef.key} className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            {propDef.label}
          </label>
          {propDef.editor.realTimeSync && (
            <Badge variant="secondary" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Real-time
            </Badge>
          )}
        </div>
        
        {propDef.description && (
          <p className="text-xs text-gray-500">{propDef.description}</p>
        )}
        
        <EditorComponent
          property={{
            key: propDef.key,
            label: propDef.label,
            type: propDef.type,
            value: currentValue,
            ...propDef.editor.props
          }}
          onChange={handlePropertyUpdate}
        />
        
        {propDef.validation?.required && !currentValue && (
          <p className="text-xs text-red-500">Este campo é obrigatório</p>
        )}
      </div>
    );
  };
  
  // ============================================================================
  // CATEGORY TABS
  // ============================================================================
  
  const categoryLabels = {
    [PropertyCategory.CONTENT]: 'Conteúdo',
    [PropertyCategory.LAYOUT]: 'Layout',
    [PropertyCategory.VISUAL]: 'Visual',
    [PropertyCategory.BEHAVIOR]: 'Comportamento',
    [PropertyCategory.ADVANCED]: 'Avançado',
  };
  
  const categoryIcons = {
    [PropertyCategory.CONTENT]: '📝',
    [PropertyCategory.LAYOUT]: '📐',
    [PropertyCategory.VISUAL]: '🎨',
    [PropertyCategory.BEHAVIOR]: '⚡',
    [PropertyCategory.ADVANCED]: '🔧',
  };
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      
      {/* HEADER */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {componentDefinition.name}
            </h2>
            <p className="text-sm text-gray-500">{componentDefinition.description}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* API Status */}
            <Badge 
              variant={connectionStatus === 'connected' ? 'default' : 'destructive'}
              className="text-xs"
            >
              {connectionStatus === 'connected' ? '🟢' : '🔴'} API
            </Badge>
            
            {/* Preview Toggle */}
            <Button
              size="sm"
              variant="outline"
              onClick={handlePreviewToggle}
              className="flex items-center space-x-1"
            >
              {previewEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="hidden sm:inline">Preview</span>
            </Button>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              className="flex items-center space-x-1"
            >
              <Save className="w-4 h-4" />
              <span>Salvar</span>
              {hasUnsavedChanges && (
                <Badge variant="secondary" className="ml-1 text-xs">!</Badge>
              )}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="flex items-center space-x-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </Button>
          </div>
          
          {lastSaved && (
            <div className="text-xs text-gray-500 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Salvo {new Date(lastSaved).toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* PROPERTIES TABS */}
      <div className="flex-1 overflow-hidden">
        <Tabs 
          value={activeCategory} 
          onValueChange={(value) => setActiveCategory(value as PropertyCategory)}
          className="h-full flex flex-col"
        >
          {/* Tabs List */}
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 p-1 m-2">
            {Object.keys(categorizedProperties).map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="text-xs flex items-center space-x-1"
              >
                <span>{categoryIcons[category as PropertyCategory]}</span>
                <span className="hidden sm:inline">
                  {categoryLabels[category as PropertyCategory]}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {categorizedProperties[category as PropertyCategory].length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* Tabs Content */}
          <div className="flex-1 overflow-y-auto">
            {Object.entries(categorizedProperties).map(([category, props]) => (
              <TabsContent key={category} value={category} className="p-4 space-y-4">
                <div className="space-y-6">
                  {props.map(renderPropertyEditor)}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
      
      {/* FOOTER - Debug Info */}
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Component ID: {componentId}</span>
            <span>Properties: {componentDefinition.properties.length}</span>
          </div>
          {funnelId && (
            <div>Funnel ID: {funnelId}</div>
          )}
          <div className="flex justify-between">
            <span>Endpoint: {componentDefinition.apiEndpoint}</span>
            <span className={`${connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
              {connectionStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SPECIALIZED PANELS
// ============================================================================

/**
 * Painel específico para componentes de quiz
 */
export function QuizPropertiesPanel(props: Omit<DynamicPropertiesPanelProps, 'componentId'>) {
  return <DynamicPropertiesPanel {...props} componentId="quiz-options-grid" />;
}

/**
 * Painel compacto para sidebar
 */
export function CompactPropertiesPanel(props: DynamicPropertiesPanelProps) {
  return (
    <div className="w-80 max-w-sm">
      <DynamicPropertiesPanel {...props} />
    </div>
  );
}