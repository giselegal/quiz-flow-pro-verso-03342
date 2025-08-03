import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSyncedScroll } from '@/hooks/useSyncedScroll';
import { 
  X, 
  Info, 
  Plus, 
  Trash2, 
  GripVertical, 
  Eye, 
  EyeOff,
  Palette,
  Settings,
  Layout,
  Type,
  CheckCircle,
  Upload,
  Edit3
} from 'lucide-react';
import { BlockDefinition, EditableContent } from '@/types/editor';

// 🎯 Interface para uma opção
interface OptionItem {
  id: string;
  text: string;
  value: string;
  category?: string;
  styleCategory?: string;
  points?: number;
  imageUrl?: string;
}

// 🔧 Editor de Array de Opções
const OptionsArrayEditor: React.FC<{
  value: OptionItem[];
  onChange: (options: OptionItem[]) => void;
}> = ({ value = [], onChange }) => {
  const addOption = () => {
    const newOption: OptionItem = {
      id: `option-${Date.now()}`,
      text: 'Nova opção',
      value: `value-${Date.now()}`,
      category: 'Geral',
      styleCategory: 'Geral',
      points: 1,
      imageUrl: 'https://via.placeholder.com/100x100'
    };
    onChange([...value, newOption]);
  };

  const removeOption = (index: number) => {
    const newOptions = value.filter((_, i) => i !== index);
    onChange(newOptions);
  };

  const updateOption = (index: number, field: keyof OptionItem, newValue: string | number) => {
    const newOptions = [...value];
    newOptions[index] = { ...newOptions[index], [field]: newValue };
    onChange(newOptions);
  };

  const moveOption = (index: number, direction: 'up' | 'down') => {
    const newOptions = [...value];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newOptions.length) {
      [newOptions[index], newOptions[targetIndex]] = [newOptions[targetIndex], newOptions[index]];
      onChange(newOptions);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Opções ({value.length})
        </span>
        <Button onClick={addOption} size="sm" variant="outline">
          <Plus className="w-3 h-3 mr-1" />
          Adicionar
        </Button>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {value.map((option, index) => (
          <Card key={option.id} className="p-3 border border-gray-200">
            <div className="space-y-2">
              {/* Header com controles */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  <span className="text-xs font-medium text-gray-600">
                    Opção {index + 1}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => moveOption(index, 'up')}
                    disabled={index === 0}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                  >
                    ↑
                  </Button>
                  <Button
                    onClick={() => moveOption(index, 'down')}
                    disabled={index === value.length - 1}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                  >
                    ↓
                  </Button>
                  <Button
                    onClick={() => removeOption(index)}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Campos de edição */}
              <div className="grid gap-2">
                <div>
                  <Label className="text-xs">Texto</Label>
                  <Input
                    value={option.text}
                    onChange={(e) => updateOption(index, 'text', e.target.value)}
                    placeholder="Texto da opção"
                    className="text-xs"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Valor</Label>
                    <Input
                      value={option.value}
                      onChange={(e) => updateOption(index, 'value', e.target.value)}
                      placeholder="Valor único"
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Categoria</Label>
                    <Input
                      value={option.category || ''}
                      onChange={(e) => updateOption(index, 'category', e.target.value)}
                      placeholder="Categoria"
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Pontos</Label>
                    <Input
                      type="number"
                      value={option.points || 1}
                      onChange={(e) => updateOption(index, 'points', parseInt(e.target.value) || 1)}
                      min="1"
                      max="10"
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Estilo</Label>
                    <Input
                      value={option.styleCategory || ''}
                      onChange={(e) => updateOption(index, 'styleCategory', e.target.value)}
                      placeholder="Categoria de estilo"
                      className="text-xs"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">URL da Imagem</Label>
                  <div className="flex gap-2">
                    <Input
                      value={option.imageUrl || ''}
                      onChange={(e) => updateOption(index, 'imageUrl', e.target.value)}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="text-xs flex-1"
                    />
                    {option.imageUrl && (
                      <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={option.imageUrl} 
                          alt={option.text}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {value.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <p className="text-sm">Nenhuma opção adicionada</p>
          <p className="text-xs text-gray-400 mt-1">
            Clique em "Adicionar" para criar a primeira opção
          </p>
        </div>
      )}
    </div>
  );
};

interface EnhancedPropertiesPanelProps {
  block: {
    id: string;
    type: string;
    content: EditableContent;
    properties?: Record<string, any>;
  };
  blockDefinition: BlockDefinition;
  onUpdateBlock: (id: string, content: Partial<EditableContent>) => void;
  onClose: () => void;
}

// 🎨 Color Picker Component
const ColorPicker: React.FC<{
  value: string;
  onChange: (color: string) => void;
  label: string;
}> = ({ value, onChange, label }) => (
  <div className="flex items-center gap-2">
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-8 h-8 p-0 border-2"
          style={{ backgroundColor: value || '#ffffff' }}
        >
          <Palette className="w-4 h-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <HexColorPicker color={value || '#ffffff'} onChange={onChange} />
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#ffffff"
          className="mt-2"
        />
      </PopoverContent>
    </Popover>
    <span className="text-xs text-gray-500">{value || 'Nenhuma cor'}</span>
  </div>
);

// 🎛️ Property Group Card
const PropertyGroup: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}> = ({ title, icon, children, defaultExpanded = true }) => (
  <Card className="border border-gray-200 shadow-sm">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-700">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0 space-y-4">
      {children}
    </CardContent>
  </Card>
);

// 🏷️ Property Field
const PropertyField: React.FC<{
  label: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ label, description, required, children }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      {description && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3 h-3 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-48">{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
    {children}
  </div>
);

const EnhancedPropertiesPanel: React.FC<EnhancedPropertiesPanelProps> = ({
  block,
  blockDefinition,
  onUpdateBlock,
  onClose
}) => {
  const { scrollRef } = useSyncedScroll({ source: 'properties' });
  
  const handlePropertyChange = (key: string, value: any) => {
    onUpdateBlock(block.id, {
      ...block.content,
      [key]: value
    });
  };

  // 🎯 Categorizar propriedades por grupos
  const categorizeProperties = () => {
    const properties = blockDefinition.properties;
    const categories = {
      general: {},
      layout: {},
      styling: {},
      content: {},
      behavior: {},
      validation: {},
      advanced: {}
    };

    Object.entries(properties).forEach(([key, prop]) => {
      const category = (prop as any).category || 'general';
      (categories as any)[category][key] = prop;
    });

    return categories;
  };

  const categorizedProps = categorizeProperties();

  // 🎨 Renderizar input baseado no tipo
  const renderPropertyInput = (key: string, property: any) => {
    const currentValue = (block.content as any)[key] || property.default;

    switch (property.type) {
      case 'string':
        return (
          <Input
            value={currentValue || ''}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
            placeholder={property.placeholder || property.label}
            className="text-sm"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={currentValue || ''}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
            placeholder={property.placeholder || property.label}
            rows={property.rows || 3}
            className="text-sm resize-none"
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {currentValue ? 'Ativado' : 'Desativado'}
            </span>
            <Switch
              checked={currentValue || false}
              onCheckedChange={(checked) => handlePropertyChange(key, checked)}
            />
          </div>
        );

      case 'select':
        return (
          <Select 
            value={currentValue || property.default} 
            onValueChange={(value) => handlePropertyChange(key, value)}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder={`Selecione ${property.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {property.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'number':
        return (
          <Input
            type="number"
            value={currentValue || ''}
            onChange={(e) => handlePropertyChange(key, parseFloat(e.target.value) || 0)}
            placeholder={property.placeholder || property.label}
            min={property.min}
            max={property.max}
            step={property.step}
            className="text-sm"
          />
        );

      case 'range':
        return (
          <div className="space-y-2">
            <Slider
              value={[currentValue || property.default || 0]}
              onValueChange={(value) => handlePropertyChange(key, value[0])}
              max={property.max || 100}
              min={property.min || 0}
              step={property.step || 1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{property.min || 0}</span>
              <span className="font-medium">{currentValue || property.default || 0}</span>
              <span>{property.max || 100}</span>
            </div>
          </div>
        );

      case 'color':
        return (
          <ColorPicker
            value={currentValue || property.default}
            onChange={(color) => handlePropertyChange(key, color)}
            label={property.label}
          />
        );

      case 'array':
        // Para o caso específico de 'options' do options-grid
        if (key === 'options') {
          return <OptionsArrayEditor 
            value={currentValue || []} 
            onChange={(newOptions) => handlePropertyChange(key, newOptions)}
          />;
        }
        
        return (
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar {property.label}
            </Button>
            <div className="text-xs text-gray-500">
              Editor de array genérico (em desenvolvimento)
            </div>
          </div>
        );

      default:
        return (
          <Input
            value={currentValue || ''}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
            placeholder={property.placeholder || property.label}
            className="text-sm"
          />
        );
    }
  };

  // 🎯 Renderizar grupo de propriedades
  const renderPropertyGroup = (title: string, icon: React.ReactNode, properties: Record<string, any>) => {
    if (Object.keys(properties).length === 0) return null;

    return (
      <PropertyGroup title={title} icon={icon}>
        {Object.entries(properties).map(([key, property]) => (
          <PropertyField
            key={key}
            label={property.label}
            description={property.description}
            required={property.required}
          >
            {renderPropertyInput(key, property)}
          </PropertyField>
        ))}
      </PropertyGroup>
    );
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      {/* 🎨 Header Premium */}
      <div className="p-4 bg-gradient-to-r from-stone-700 to-yellow-700 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold">{blockDefinition.name}</h3>
              <p className="text-xs text-white/80">ID: {block.id}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {blockDefinition.description && (
          <p className="text-sm text-white/90 mt-2">{blockDefinition.description}</p>
        )}
      </div>

      {/* 🎛️ Properties Content */}
      <div ref={scrollRef} className="flex-1 overflow-auto">
        <Tabs defaultValue="properties" className="h-full">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
            <TabsTrigger value="properties" className="text-xs">
              <Settings className="w-3 h-3 mr-1" />
              Propriedades
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs">
              <Palette className="w-3 h-3 mr-1" />
              Estilo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="p-4 space-y-4 mt-0">
            {renderPropertyGroup("Geral", <Type className="w-4 h-4" />, categorizedProps.general)}
            {renderPropertyGroup("Conteúdo", <Type className="w-4 h-4" />, categorizedProps.content)}
            {renderPropertyGroup("Layout", <Layout className="w-4 h-4" />, categorizedProps.layout)}
            {renderPropertyGroup("Comportamento", <CheckCircle className="w-4 h-4" />, categorizedProps.behavior)}
            {renderPropertyGroup("Validação", <CheckCircle className="w-4 h-4" />, categorizedProps.validation)}
          </TabsContent>

          <TabsContent value="style" className="p-4 space-y-4 mt-0">
            {renderPropertyGroup("Estilização", <Palette className="w-4 h-4" />, categorizedProps.styling)}
            {renderPropertyGroup("Avançado", <Settings className="w-4 h-4" />, categorizedProps.advanced)}
          </TabsContent>
        </Tabs>

        {/* 🚨 Fallback para propriedades não categorizadas */}
        {Object.keys(blockDefinition.properties).length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm font-medium">Nenhuma propriedade disponível</p>
            <p className="text-xs text-gray-400 mt-1">
              Este componente não possui propriedades editáveis
            </p>
          </div>
        )}
      </div>

      {/* 🎯 Footer Actions */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {Object.keys(blockDefinition.properties).length} propriedades
          </Badge>
          <Badge variant="outline" className="text-xs">
            {blockDefinition.category}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPropertiesPanel;
