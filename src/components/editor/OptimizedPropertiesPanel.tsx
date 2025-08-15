
/**
 * 🚀 OptimizedPropertiesPanel - Painel de Propriedades Otimizado
 * 
 * Combina as melhores características:
 * - React Hook Form + Zod para performance e validação
 * - useUnifiedProperties para propriedades dinâmicas
 * - Interface moderna com abas e gradientes
 * - Debouncing otimizado e re-renders mínimos
 * - Suporte completo a todos os tipos de propriedades
 */

import React, { useState, useMemo, useCallback } from 'react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Badge } from '@/components/ui/badge';

// Visual Controls
import ColorPicker from '@/components/visual-controls/ColorPicker';
import SizeSlider from '@/components/visual-controls/SizeSlider';

// Icons
import { 
  Settings, 
  Paintbrush, 
  Layout, 
  Type, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Trash2,
  X
} from 'lucide-react';

// Hooks
import {
  UnifiedBlock,
  UnifiedProperty,
  useUnifiedProperties,
  PropertyType
} from '@/hooks/useUnifiedProperties';
import { useBlockForm } from '@/hooks/useBlockForm';

// Array Editor Component for Quiz Options
const ArrayEditor: React.FC<{
  items: any[];
  onChange: (items: any[]) => void;
  itemSchema?: any;
  addButtonText?: string;
}> = ({ items = [], onChange, addButtonText = "Adicionar Item" }) => {
  const addItem = () => {
    const newItem = typeof items[0] === 'string' 
      ? '' 
      : { text: '', value: '' };
    onChange([...items, newItem]);
  };

  const updateItem = (index: number, value: any) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            value={typeof item === 'string' ? item : item.text || ''}
            onChange={(e) => {
              const newValue = typeof item === 'string' 
                ? e.target.value 
                : { ...item, text: e.target.value };
              updateItem(index, newValue);
            }}
            placeholder={`Item ${index + 1}`}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeItem(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        className="w-full"
      >
        {addButtonText}
      </Button>
    </div>
  );
};

interface OptimizedPropertiesPanelProps {
  selectedBlock: UnifiedBlock | null;
  onUpdate?: (blockId: string, updates: Partial<UnifiedBlock>) => void;
  onClose?: () => void;
  onDelete?: (blockId: string) => void;
  isPreviewMode?: boolean;
  onTogglePreview?: () => void;
}

export const OptimizedPropertiesPanel: React.FC<OptimizedPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onClose,
  onDelete,
  isPreviewMode = false,
  onTogglePreview,
}) => {
  // Estado local
  const [activeTab, setActiveTab] = useState<string>('properties');

  // Hook de propriedades unificadas
  const { 
    properties, 
    updateProperty, 
    resetProperties, 
    getPropertiesByCategory 
  } = useUnifiedProperties(
    selectedBlock?.type || '',
    selectedBlock?.id,
    selectedBlock,
    onUpdate
  );

  // Hook de formulário otimizado
  const { 
    updateProperty: formUpdateProperty, 
    errors,
    isValid,
    isDirty 
  } = useBlockForm(
    selectedBlock ? {
      id: selectedBlock.id,
      type: selectedBlock.type,
      properties: selectedBlock.properties || {}
    } : null,
    {
      onUpdate: onUpdate ? (updates) => {
        if (selectedBlock) {
          onUpdate(selectedBlock.id, updates);
        }
      } : undefined,
      debounceMs: 300,
      validateOnChange: true
    }
  );

  // Categorias organizadas
  const categorizedProperties = useMemo(() => {
    const categories = {
      content: getPropertiesByCategory('content'),
      style: getPropertiesByCategory('style'),
      layout: getPropertiesByCategory('layout'),
      behavior: getPropertiesByCategory('behavior'),
      advanced: getPropertiesByCategory('advanced')
    };

    // Remove categorias vazias
    Object.keys(categories).forEach(key => {
      if (categories[key as keyof typeof categories].length === 0) {
        delete categories[key as keyof typeof categories];
      }
    });

    return categories;
  }, [properties, getPropertiesByCategory]);

  // Renderizador de campo otimizado
  const renderField = useCallback((property: UnifiedProperty) => {
    const { key, label, type, value, options, required, min, max, step, placeholder } = property;

    const fieldId = `field-${key}`;
    const hasError = key in errors;
    const errorMessage = errors[key];

    const baseClasses = "border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20 transition-colors";
    const errorClasses = hasError ? "border-red-300 focus:border-red-500 focus:ring-red-200" : baseClasses;

    const handleChange = (newValue: any) => {
      updateProperty(key, newValue);
      formUpdateProperty(key, newValue);
    };

    switch (type) {
      case PropertyType.TEXT:
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={fieldId} className="text-sm font-medium text-[#6B4F43] flex items-center gap-1">
              {label}
              {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={fieldId}
              value={value || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder || `Digite ${label.toLowerCase()}`}
              className={errorClasses}
            />
            {hasError && <p className="text-xs text-red-500">{errorMessage}</p>}
          </div>
        );

      case PropertyType.TEXTAREA:
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={fieldId} className="text-sm font-medium text-[#6B4F43] flex items-center gap-1">
              {label}
              {required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={fieldId}
              value={value || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder || `Digite ${label.toLowerCase()}`}
              className={errorClasses}
              rows={3}
            />
            {hasError && <p className="text-xs text-red-500">{errorMessage}</p>}
          </div>
        );

      case PropertyType.NUMBER:
      case PropertyType.RANGE:
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={fieldId} className="text-sm font-medium text-[#6B4F43] flex items-center gap-1">
              {label}
              {required && <span className="text-red-500">*</span>}
            </Label>
            {type === PropertyType.RANGE ? (
              <SizeSlider
                value={value || min || 0}
                onChange={handleChange}
                min={min}
                max={max}
                step={step}
                label={label}
              />
            ) : (
              <Input
                id={fieldId}
                type="number"
                value={value || ''}
                onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
                min={min}
                max={max}
                step={step}
                placeholder={placeholder}
                className={errorClasses}
              />
            )}
            {hasError && <p className="text-xs text-red-500">{errorMessage}</p>}
          </div>
        );

      case PropertyType.COLOR:
        return (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium text-[#6B4F43] flex items-center gap-1">
              {label}
              {required && <span className="text-red-500">*</span>}
            </Label>
            <ColorPicker
              value={value || '#000000'}
              onChange={handleChange}
              label={label}
            />
            {hasError && <p className="text-xs text-red-500">{errorMessage}</p>}
          </div>
        );

      case PropertyType.SELECT:
        return (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium text-[#6B4F43] flex items-center gap-1">
              {label}
              {required && <span className="text-red-500">*</span>}
            </Label>
            <Select value={value} onValueChange={handleChange}>
              <SelectTrigger className={errorClasses}>
                <SelectValue placeholder={`Selecione ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && <p className="text-xs text-red-500">{errorMessage}</p>}
          </div>
        );

      case PropertyType.SWITCH:
        return (
          <div key={key} className="flex items-center justify-between space-y-0 p-3 border rounded-md border-[#B89B7A]/30">
            <Label className="text-sm font-medium text-[#6B4F43] flex items-center gap-1">
              {label}
              {required && <span className="text-red-500">*</span>}
            </Label>
            <Switch
              checked={Boolean(value)}
              onCheckedChange={handleChange}
            />
            {hasError && <p className="text-xs text-red-500">{errorMessage}</p>}
          </div>
        );

      case PropertyType.ARRAY:
        return (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium text-[#6B4F43] flex items-center gap-1">
              {label}
              {required && <span className="text-red-500">*</span>}
            </Label>
            <ArrayEditor
              items={Array.isArray(value) ? value : []}
              onChange={handleChange}
              addButtonText={`Adicionar ${label.toLowerCase()}`}
            />
            {hasError && <p className="text-xs text-red-500">{errorMessage}</p>}
          </div>
        );

      default:
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={fieldId} className="text-sm font-medium text-[#6B4F43] flex items-center gap-1">
              {label}
              {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={fieldId}
              value={String(value || '')}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
              className={errorClasses}
            />
            {hasError && <p className="text-xs text-red-500">{errorMessage}</p>}
          </div>
        );
    }
  }, [updateProperty, formUpdateProperty, errors]);

  // Se nenhum bloco selecionado
  if (!selectedBlock) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <Settings className="h-12 w-12 text-[#B89B7A] mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-[#6B4F43]">Propriedades</h3>
              <p className="text-sm text-[#8B7355] mt-1">
                Selecione um bloco no editor para configurar suas propriedades
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white via-[#FEFDFB] to-[#F8F6F0]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white/90 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#B89B7A] to-[#D4C2A8]">
            <Settings className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-[#6B4F43]">Propriedades</h2>
            <Badge variant="outline" className="text-xs bg-[#E5DDD5] text-[#6B4F43] border-[#B89B7A]/30">
              {selectedBlock.type}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Validation Status */}
          <Badge variant={isValid ? "default" : "destructive"} className="text-xs">
            {isValid ? "✓" : "!"}
          </Badge>
          
          {/* Preview Toggle */}
          {onTogglePreview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onTogglePreview}
              className={`h-8 w-8 p-0 ${isPreviewMode ? 'bg-[#E5DDD5]' : ''}`}
              title="Toggle Preview"
            >
              {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}

          {/* Close Button */}
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="h-8 w-8 p-0"
              title="Fechar"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content with Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 m-4 mb-0 bg-[#E5DDD5]/50">
            <TabsTrigger 
              value="properties" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#6B4F43]"
            >
              <Type className="h-4 w-4 mr-1" />
              Propriedades
            </TabsTrigger>
            <TabsTrigger 
              value="style" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#6B4F43]"
            >
              <Paintbrush className="h-4 w-4 mr-1" />
              Estilo
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto p-4 pt-2">
            <TabsContent value="properties" className="mt-0 space-y-4">
              {categorizedProperties.content?.length > 0 && (
                <Card className="border-[#B89B7A]/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Type className="h-4 w-4 text-[#B89B7A]" />
                      Conteúdo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categorizedProperties.content.map(renderField)}
                  </CardContent>
                </Card>
              )}

              {categorizedProperties.behavior?.length > 0 && (
                <Card className="border-[#B89B7A]/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Settings className="h-4 w-4 text-[#B89B7A]" />
                      Comportamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categorizedProperties.behavior.map(renderField)}
                  </CardContent>
                </Card>
              )}

              {categorizedProperties.advanced?.length > 0 && (
                <Card className="border-[#B89B7A]/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Settings className="h-4 w-4 text-[#B89B7A]" />
                      Avançado
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categorizedProperties.advanced.map(renderField)}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="style" className="mt-0 space-y-4">
              {categorizedProperties.style?.length > 0 && (
                <Card className="border-[#B89B7A]/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Paintbrush className="h-4 w-4 text-[#B89B7A]" />
                      Aparência
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categorizedProperties.style.map(renderField)}
                  </CardContent>
                </Card>
              )}

              {categorizedProperties.layout?.length > 0 && (
                <Card className="border-[#B89B7A]/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Layout className="h-4 w-4 text-[#B89B7A]" />
                      Layout
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categorizedProperties.layout.map(renderField)}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t bg-white/90 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              ID: {selectedBlock.id}
            </Badge>
            {isDirty && (
              <Badge variant="secondary" className="text-xs">
                Modificado
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetProperties}
              title="Redefinir Propriedades"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(selectedBlock.id)}
                title="Excluir Bloco"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedPropertiesPanel;