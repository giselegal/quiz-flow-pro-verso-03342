// =====================================================================
// components/editor/AdvancedPropertyPanel.tsx - Painel de Propriedades Avançado
// =====================================================================

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { 
  Trash2, Plus, ChevronDown, ChevronRight, Palette, 
  Layout, Settings, Target, Sparkles, Sliders, Globe,
  Move, GripVertical, Type, Image as ImageIcon, Eye, EyeOff
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SimpleSortableItem } from './components/SimpleSortableItem';
import { ColorPicker } from './components/ColorPicker';
import { RichTextEditor } from './components/RichTextEditor';
import { PropertyTemplates } from './components/PropertyTemplates';
import { PropertyHistory } from './components/PropertyHistory';
import { usePropertyHistory } from '../../hooks/usePropertyHistory';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useDebouncedCallback } from '../../hooks/useDebounce';

interface BlockProperties {
  // Layout
  layout?: 'vertical' | 'horizontal' | 'grid';
  direction?: 'row' | 'column';
  alignment?: 'left' | 'center' | 'right' | 'justify';
  spacing?: number;
  columns?: number;
  
  // Opções
  options?: Array<{
    id: string;
    text: string;
    image?: string;
    value: string;
  }>;
  description?: string;
  
  // Validações
  required?: boolean;
  multipleChoice?: boolean;
  autoAdvance?: boolean;
  maxSelections?: number;
  
  // Novas configurações de autoavanço
  autoAdvanceOnComplete?: boolean;
  enableButtonOnlyWhenValid?: boolean;
  autoAdvanceDelay?: number;
  requiredSelections?: number;
  showValidationFeedback?: boolean;
  questionId?: string;
  
  // Estilização
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  // Personalização
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonText?: string;
  
  // Avançado
  customCSS?: string;
  animation?: 'none' | 'fade' | 'slide' | 'bounce';
  delay?: number;
  
  // Geral
  visible?: boolean;
  id?: string;
  className?: string;
}

interface AdvancedPropertyPanelProps {
  selectedBlockId: string | null;
  properties: BlockProperties;
  onPropertyChange: (key: string, value: any) => void;
  onDeleteBlock?: () => void;
}

export const AdvancedPropertyPanel: React.FC<AdvancedPropertyPanelProps> = ({
  selectedBlockId,
  properties,
  onPropertyChange,
  onDeleteBlock
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    layout: true,
    options: true,
    validations: true,
    styling: true,
    customization: true,
    advanced: false,
    general: true
  });

  // Property history management
  const {
    history,
    currentIndex,
    canUndo,
    canRedo,
    saveToHistory,
    undo,
    redo,
    goToEntry,
    clearHistory
  } = usePropertyHistory(properties);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Debounced property change to improve performance
  const debouncedPropertyChange = useDebouncedCallback(onPropertyChange, 300);

  // Property change handler with history tracking
  const handlePropertyChangeWithHistory = useCallback((key: string, value: any, description?: string) => {
    const newProperties = { ...properties, [key]: value };
    saveToHistory(newProperties, description || `Alteração em ${key}`);
    debouncedPropertyChange(key, value);
  }, [properties, saveToHistory, debouncedPropertyChange]);

  // History navigation handlers
  const handleUndo = useCallback(() => {
    const previousProperties = undo();
    if (previousProperties) {
      Object.entries(previousProperties).forEach(([key, value]) => {
        onPropertyChange(key, value);
      });
    }
    return previousProperties;
  }, [undo, onPropertyChange]);

  const handleRedo = useCallback(() => {
    const nextProperties = redo();
    if (nextProperties) {
      Object.entries(nextProperties).forEach(([key, value]) => {
        onPropertyChange(key, value);
      });
    }
    return nextProperties;
  }, [redo, onPropertyChange]);

  const handleGoToEntry = useCallback((index: number) => {
    const targetProperties = goToEntry(index);
    if (targetProperties) {
      Object.entries(targetProperties).forEach(([key, value]) => {
        onPropertyChange(key, value);
      });
    }
    return targetProperties;
  }, [goToEntry, onPropertyChange]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: canUndo ? handleUndo : undefined,
    onRedo: canRedo ? handleRedo : undefined,
    onDelete: onDeleteBlock
  });

  const toggleSection = useCallback((sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  }, []);

  const handleOptionReorder = useCallback((event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const options = properties.options || [];
      const oldIndex = options.findIndex(item => item.id === active.id);
      const newIndex = options.findIndex(item => item.id === over.id);
      
      const newOptions = arrayMove(options, oldIndex, newIndex);
      handlePropertyChangeWithHistory('options', newOptions, 'Reordenação de opções');
    }
  }, [properties.options, handlePropertyChangeWithHistory]);

  const addOption = useCallback(() => {
    const newOption = {
      id: `option-${Date.now()}`,
      text: `Opção ${(properties.options?.length || 0) + 1}`,
      value: `option_${(properties.options?.length || 0) + 1}`,
      image: ''
    };
    
    const options = [...(properties.options || []), newOption];
    handlePropertyChangeWithHistory('options', options, 'Adição de nova opção');
  }, [properties.options, handlePropertyChangeWithHistory]);

  const updateOption = useCallback((optionId: string, field: string, value: string) => {
    const options = properties.options?.map(option => 
      option.id === optionId ? { ...option, [field]: value } : option
    ) || [];
    handlePropertyChangeWithHistory('options', options, `Atualização de opção: ${field}`);
  }, [properties.options, handlePropertyChangeWithHistory]);

  const removeOption = useCallback((optionId: string) => {
    const options = properties.options?.filter(option => option.id !== optionId) || [];
    handlePropertyChangeWithHistory('options', options, 'Remoção de opção');
  }, [properties.options, handlePropertyChangeWithHistory]);

  // Memoized options for better performance
  const sortedOptions = useMemo(() => {
    return properties.options || [];
  }, [properties.options]);

  const handleApplyTemplate = useCallback((templateProperties: Record<string, any>) => {
    const newProperties = { ...properties, ...templateProperties };
    saveToHistory(newProperties, `Aplicação de template`);
    Object.entries(templateProperties).forEach(([key, value]) => {
      onPropertyChange(key, value);
    });
  }, [onPropertyChange, properties, saveToHistory]);

  if (!selectedBlockId) {
    return (
      <div className="h-full p-6 bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center space-y-4 max-w-xs">
          <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
            <Settings className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Painel de Propriedades
            </h3>
            <p className="text-gray-600 text-sm mb-1">
              Selecione um componente no canvas para editá-lo
            </p>
            <p className="text-xs text-blue-600">
              💡 Toda edição acontece aqui no painel
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Painel de Propriedades</h2>
            <p className="text-sm text-gray-500">Configure o bloco selecionado</p>
            <p className="text-xs text-blue-600 mt-1">Clique em um componente no canvas para editá-lo aqui</p>
          </div>
          <div className="flex items-center space-x-2">
            <PropertyHistory
              history={history}
              currentIndex={currentIndex}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onGoToEntry={handleGoToEntry}
              onClearHistory={clearHistory}
            />
            <PropertyTemplates onApplyTemplate={handleApplyTemplate} />
            {onDeleteBlock && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDeleteBlock}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Layout Card */}
        <Card className="shadow-sm border border-gray-200 rounded-lg">
          <Collapsible 
            open={expandedSections.layout} 
            onOpenChange={() => toggleSection('layout')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Layout className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-base">Layout</CardTitle>
                  </div>
                  {expandedSections.layout ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Layout</Label>
                    <Select 
                      value={properties.layout || 'vertical'} 
                      onValueChange={(value) => onPropertyChange('layout', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vertical">Vertical</SelectItem>
                        <SelectItem value="horizontal">Horizontal</SelectItem>
                        <SelectItem value="grid">Grade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Direção</Label>
                    <Select 
                      value={properties.direction || 'column'} 
                      onValueChange={(value) => onPropertyChange('direction', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="row">Linha</SelectItem>
                        <SelectItem value="column">Coluna</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Alinhamento</Label>
                  <Select 
                    value={properties.alignment || 'left'} 
                    onValueChange={(value) => onPropertyChange('alignment', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Esquerda</SelectItem>
                      <SelectItem value="center">Centro</SelectItem>
                      <SelectItem value="right">Direita</SelectItem>
                      <SelectItem value="justify">Justificado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Espaçamento</Label>
                  <div className="mt-2">
                    <Slider
                      value={[properties.spacing || 16]}
                      onValueChange={([value]) => onPropertyChange('spacing', value)}
                      min={0}
                      max={64}
                      step={4}
                    />
                    <div className="text-xs text-gray-500 mt-1 text-center">
                      {properties.spacing || 16}px
                    </div>
                  </div>
                </div>

                {properties.layout === 'grid' && (
                  <div>
                    <Label className="text-sm font-medium">Colunas</Label>
                    <Input
                      type="number"
                      value={properties.columns || 2}
                      onChange={(e) => onPropertyChange('columns', parseInt(e.target.value))}
                      min={1}
                      max={6}
                      className="mt-1"
                    />
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Options Card */}
        <Card className="shadow-sm border border-gray-200 rounded-lg">
          <Collapsible 
            open={expandedSections.options} 
            onOpenChange={() => toggleSection('options')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-base">Opções</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {properties.options?.length || 0}
                    </Badge>
                  </div>
                  {expandedSections.options ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <Label className="text-sm font-medium">Descrição</Label>
                  <RichTextEditor
                    value={properties.description || ''}
                    onChange={(value) => onPropertyChange('description', value)}
                    placeholder="Descrição das opções..."
                  />
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium">Lista de Opções</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                      className="h-8"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleOptionReorder}
                  >
                    <SortableContext
                      items={sortedOptions.map(opt => opt.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {sortedOptions.map((option, index) => (
                          <SimpleSortableItem key={option.id} id={option.id}>
                            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                              <div className="flex items-center space-x-2 flex-1">
                                <GripVertical className="w-4 h-4 text-gray-400 cursor-grab active:cursor-grabbing" />
                                <div className="flex-1 space-y-2">
                                  <Input
                                    value={option.text}
                                    onChange={(e) => updateOption(option.id, 'text', e.target.value)}
                                    placeholder="Texto da opção"
                                    className="h-8"
                                  />
                                  <Input
                                    value={option.image || ''}
                                    onChange={(e) => updateOption(option.id, 'image', e.target.value)}
                                    placeholder="URL da imagem (opcional)"
                                    className="h-8"
                                  />
                                  {option.image && (
                                    <div className="relative">
                                      <img
                                        src={option.image}
                                        alt="Preview"
                                        className="w-full h-16 object-cover rounded border"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col space-y-1">
                                <Badge variant="secondary" className="text-xs">
                                  #{index + 1}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeOption(option.id)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </SimpleSortableItem>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Validations Card */}
        <Card className="shadow-sm border border-gray-200 rounded-lg">
          <Collapsible 
            open={expandedSections.validations} 
            onOpenChange={() => toggleSection('validations')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-orange-600" />
                    <CardTitle className="text-base">Validações</CardTitle>
                  </div>
                  {expandedSections.validations ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Múltipla Escolha</Label>
                  <Switch
                    checked={properties.multipleChoice || false}
                    onCheckedChange={(checked) => onPropertyChange('multipleChoice', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Obrigatório</Label>
                  <Switch
                    checked={properties.required || false}
                    onCheckedChange={(checked) => onPropertyChange('required', checked)}
                  />
                </div>

                {/* === CONFIGURAÇÕES DE AUTOAVANÇO === */}
                <Separator className="my-4" />
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Configurações de Auto-Avanço
                  </h4>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Auto-avanço ao completar</Label>
                    <Switch
                      checked={properties.autoAdvanceOnComplete || false}
                      onCheckedChange={(checked) => onPropertyChange('autoAdvanceOnComplete', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Botão apenas quando válido</Label>
                    <Switch
                      checked={properties.enableButtonOnlyWhenValid || false}
                      onCheckedChange={(checked) => onPropertyChange('enableButtonOnlyWhenValid', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Mostrar feedback de validação</Label>
                    <Switch
                      checked={properties.showValidationFeedback || false}
                      onCheckedChange={(checked) => onPropertyChange('showValidationFeedback', checked)}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Seleções obrigatórias</Label>
                    <div className="mt-2">
                      <Slider
                        value={[properties.requiredSelections || 3]}
                        onValueChange={([value]) => onPropertyChange('requiredSelections', value)}
                        min={1}
                        max={10}
                        step={1}
                      />
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        {properties.requiredSelections || 3} seleções obrigatórias
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Delay do auto-avanço (ms)</Label>
                    <div className="mt-2">
                      <Slider
                        value={[properties.autoAdvanceDelay || 800]}
                        onValueChange={([value]) => onPropertyChange('autoAdvanceDelay', value)}
                        min={200}
                        max={3000}
                        step={100}
                      />
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        {properties.autoAdvanceDelay || 800}ms de delay
                      </div>
                    </div>
                  </div>
                </div>

                {/* === CONFIGURAÇÕES LEGACY === */}
                <Separator className="my-4" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Auto-avançar (legacy)</Label>
                    <Switch
                      checked={properties.autoAdvance || false}
                      onCheckedChange={(checked) => onPropertyChange('autoAdvance', checked)}
                    />
                  </div>

                  {properties.multipleChoice && (
                    <div>
                      <Label className="text-sm font-medium">Máximo de Seleções (legacy)</Label>
                      <div className="mt-2">
                        <Slider
                          value={[properties.maxSelections || 3]}
                          onValueChange={([value]) => onPropertyChange('maxSelections', value)}
                          min={1}
                          max={10}
                          step={1}
                        />
                        <div className="text-xs text-gray-500 mt-1 text-center">
                          {properties.maxSelections || 3} seleções
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Styling Card */}
        <Card className="shadow-sm border border-gray-200 rounded-lg">
          <Collapsible 
            open={expandedSections.styling} 
            onOpenChange={() => toggleSection('styling')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Palette className="w-5 h-5 text-purple-600" />
                    <CardTitle className="text-base">Estilização</CardTitle>
                  </div>
                  {expandedSections.styling ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Cor de Fundo</Label>
                    <ColorPicker
                      value={properties.backgroundColor || '#ffffff'}
                      onChange={(color) => onPropertyChange('backgroundColor', color)}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Cor do Texto</Label>
                    <ColorPicker
                      value={properties.textColor || '#000000'}
                      onChange={(color) => onPropertyChange('textColor', color)}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Cor da Borda</Label>
                  <ColorPicker
                    value={properties.borderColor || '#e5e7eb'}
                    onChange={(color) => onPropertyChange('borderColor', color)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Borda Arredondada</Label>
                    <div className="mt-2">
                      <Slider
                        value={[properties.borderRadius || 8]}
                        onValueChange={([value]) => onPropertyChange('borderRadius', value)}
                        min={0}
                        max={32}
                        step={2}
                      />
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        {properties.borderRadius || 8}px
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Espessura da Borda</Label>
                    <div className="mt-2">
                      <Slider
                        value={[properties.borderWidth || 1]}
                        onValueChange={([value]) => onPropertyChange('borderWidth', value)}
                        min={0}
                        max={8}
                        step={1}
                      />
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        {properties.borderWidth || 1}px
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Sombra</Label>
                  <Select 
                    value={properties.shadow || 'sm'} 
                    onValueChange={(value) => onPropertyChange('shadow', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma</SelectItem>
                      <SelectItem value="sm">Pequena</SelectItem>
                      <SelectItem value="md">Média</SelectItem>
                      <SelectItem value="lg">Grande</SelectItem>
                      <SelectItem value="xl">Extra Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Customization Card */}
        <Card className="shadow-sm border border-gray-200 rounded-lg">
          <Collapsible 
            open={expandedSections.customization} 
            onOpenChange={() => toggleSection('customization')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-pink-600" />
                    <CardTitle className="text-base">Personalização</CardTitle>
                  </div>
                  {expandedSections.customization ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <Label className="text-sm font-medium">Título</Label>
                  <Input
                    value={properties.title || ''}
                    onChange={(e) => onPropertyChange('title', e.target.value)}
                    placeholder="Título do bloco"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Subtítulo</Label>
                  <Input
                    value={properties.subtitle || ''}
                    onChange={(e) => onPropertyChange('subtitle', e.target.value)}
                    placeholder="Subtítulo do bloco"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Placeholder</Label>
                  <Input
                    value={properties.placeholder || ''}
                    onChange={(e) => onPropertyChange('placeholder', e.target.value)}
                    placeholder="Texto de placeholder"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Texto do Botão</Label>
                  <Input
                    value={properties.buttonText || ''}
                    onChange={(e) => onPropertyChange('buttonText', e.target.value)}
                    placeholder="Texto do botão"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Advanced Card */}
        <Card className="shadow-sm border border-gray-200 rounded-lg">
          <Collapsible 
            open={expandedSections.advanced} 
            onOpenChange={() => toggleSection('advanced')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-5 h-5 text-indigo-600" />
                    <CardTitle className="text-base">Avançado</CardTitle>
                  </div>
                  {expandedSections.advanced ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <Label className="text-sm font-medium">CSS Personalizado</Label>
                  <Textarea
                    value={properties.customCSS || ''}
                    onChange={(e) => onPropertyChange('customCSS', e.target.value)}
                    placeholder="/* CSS personalizado */"
                    rows={4}
                    className="font-mono text-sm mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Animação</Label>
                  <Select 
                    value={properties.animation || 'none'} 
                    onValueChange={(value) => onPropertyChange('animation', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma</SelectItem>
                      <SelectItem value="fade">Fade</SelectItem>
                      <SelectItem value="slide">Slide</SelectItem>
                      <SelectItem value="bounce">Bounce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {properties.animation !== 'none' && (
                  <div>
                    <Label className="text-sm font-medium">Delay da Animação</Label>
                    <div className="mt-2">
                      <Slider
                        value={[properties.delay || 0]}
                        onValueChange={([value]) => onPropertyChange('delay', value)}
                        min={0}
                        max={2000}
                        step={100}
                      />
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        {properties.delay || 0}ms
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* General Card */}
        <Card className="shadow-sm border border-gray-200 rounded-lg">
          <Collapsible 
            open={expandedSections.general} 
            onOpenChange={() => toggleSection('general')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-gray-600" />
                    <CardTitle className="text-base">Geral</CardTitle>
                  </div>
                  {expandedSections.general ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Visível</Label>
                  <Switch
                    checked={properties.visible !== false}
                    onCheckedChange={(checked) => onPropertyChange('visible', checked)}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">ID do Elemento</Label>
                  <Input
                    value={properties.id || ''}
                    onChange={(e) => onPropertyChange('id', e.target.value)}
                    placeholder="elemento-id"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Classes CSS</Label>
                  <Input
                    value={properties.className || ''}
                    onChange={(e) => onPropertyChange('className', e.target.value)}
                    placeholder="classe-1 classe-2"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </div>
  );
};
