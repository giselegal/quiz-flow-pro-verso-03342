import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { BlockDefinition, EditableContent, PropertySchema } from '@/types/editor';
import { GripVertical, Plus, Trash2, Upload, X } from 'lucide-react';

// ✅ Componente especializado para editar arrays de opções de quiz
interface OptionsArrayEditorProps {
  value: any[];
  onChange: (value: any[]) => void;
  property: any;
}

const OptionsArrayEditor: React.FC<OptionsArrayEditorProps> = ({ value, onChange, property }) => {
  const handleAddItem = () => {
    const currentItems = value || [];
    const itemNumber = currentItems.length + 1;
    
    const newItem = {
      id: `option-${itemNumber}`,
      text: `Nova opção ${itemNumber}`,
      imageUrl: `https://via.placeholder.com/200x200/E5DDD5/8B7355?text=Opção+${itemNumber}`,
      value: `option-${itemNumber}`,
      category: 'Geral',
      points: 1,
    };

    onChange([...currentItems, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: string, fieldValue: any) => {
    const newValue = [...value];
    newValue[index] = { ...newValue[index], [field]: fieldValue };
    onChange(newValue);
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < value.length) {
      const newValue = [...value];
      [newValue[index], newValue[newIndex]] = [newValue[newIndex], newValue[index]];
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {property.label} ({value.length} {value.length === 1 ? 'opção' : 'opções'})
        </span>
        <Button size="sm" onClick={handleAddItem} className="text-xs">
          <Plus className="h-3 w-3 mr-1" />
          Adicionar Opção
        </Button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {value.map((item, index) => (
          <Card key={item.id || index} className="p-4 border-l-4 border-l-amber-500">
            <div className="space-y-3">
              {/* Header do Item */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-amber-700">
                    Opção {index + 1}
                    {item.category && (
                      <span className="ml-2 text-xs text-gray-500">({item.category})</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMoveItem(index, 'up')}
                    disabled={index === 0}
                    className="h-6 w-6 p-0"
                    title="Mover para cima"
                  >
                    ↑
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMoveItem(index, 'down')}
                    disabled={index === value.length - 1}
                    className="h-6 w-6 p-0"
                    title="Mover para baixo"
                  >
                    ↓
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveItem(index)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                    title="Remover opção"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Edição dos campos da opção */}
              <div className="grid grid-cols-1 gap-3">
                {/* Texto da opção */}
                <div>
                  <Label className="text-xs font-medium text-gray-700">Texto da Opção</Label>
                  <Textarea
                    value={item.text || ''}
                    onChange={e => handleUpdateItem(index, 'text', e.target.value)}
                    placeholder="Descreva esta opção..."
                    rows={2}
                    className="text-sm mt-1"
                  />
                </div>

                {/* Campos em linha: ID e Valor */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs font-medium text-gray-700">ID Único</Label>
                    <Input
                      value={item.id || ''}
                      onChange={e => handleUpdateItem(index, 'id', e.target.value)}
                      placeholder="option-1"
                      className="text-sm mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-700">Valor</Label>
                    <Input
                      value={item.value || ''}
                      onChange={e => handleUpdateItem(index, 'value', e.target.value)}
                      placeholder="valor-opcao"
                      className="text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Categoria e Pontos */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs font-medium text-gray-700">Categoria/Estilo</Label>
                    <Input
                      value={item.category || ''}
                      onChange={e => handleUpdateItem(index, 'category', e.target.value)}
                      placeholder="Ex: Natural, Clássico"
                      className="text-sm mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-700">
                      Pontos: {item.points || 1}
                    </Label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={item.points || 1}
                      onChange={e => handleUpdateItem(index, 'points', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
                    />
                  </div>
                </div>

                {/* Imagem */}
                <div>
                  <Label className="text-xs font-medium text-gray-700">Imagem da Opção</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={item.imageUrl || ''}
                      onChange={e => handleUpdateItem(index, 'imageUrl', e.target.value)}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="text-sm flex-1"
                    />
                    <Button size="sm" variant="outline" className="px-2">
                      <Upload className="h-3 w-3" />
                    </Button>
                  </div>
                  {item.imageUrl && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={item.imageUrl}
                        alt={item.text || 'Opção'}
                        className="w-16 h-16 object-cover rounded border"
                        onError={e => {
                          (e.target as HTMLImageElement).src = 
                            `https://via.placeholder.com/200x200/E5DDD5/8B7355?text=Erro`;
                        }}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUpdateItem(index, 'imageUrl', '')}
                        className="text-xs text-red-600"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Remover Imagem
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {value.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-sm text-gray-600 mb-3">Nenhuma opção configurada</p>
          <Button size="sm" onClick={handleAddItem} className="bg-amber-600 hover:bg-amber-700">
            <Plus className="h-3 w-3 mr-1" />
            Criar Primeira Opção
          </Button>
        </div>
      )}
    </div>
  );
};

// ✅ Componente para editar arrays (especialmente opções de quiz)
interface ArrayEditorProps {
  value: any[];
  onChange: (value: any[]) => void;
  property: PropertySchema;
}

const ArrayEditor: React.FC<ArrayEditorProps> = ({ value, onChange, property }) => {
  const handleAddItem = () => {
    // 🎯 SISTEMA 1: ID Semântico para diferentes tipos
    const currentItems = value || [];
    const itemNumber = currentItems.length + 1;

    const newItem =
      property.label.includes('opções') || property.label.includes('options')
        ? {
            id: `option-${itemNumber}`,
            text: 'Nova opção',
            imageUrl: 'https://via.placeholder.com/150x150',
            value: `value-option-${itemNumber}`,
            category: 'Geral',
            points: 1,
          }
        : property.defaultValue || '';

    onChange([...value, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, updates: any) => {
    const newValue = [...value];
    newValue[index] =
      typeof newValue[index] === 'object' ? { ...newValue[index], ...updates } : updates;
    onChange(newValue);
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < value.length) {
      const newValue = [...value];
      [newValue[index], newValue[newIndex]] = [newValue[newIndex], newValue[index]];
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {property.label} ({value.length} {value.length === 1 ? 'item' : 'itens'})
        </span>
        <Button size="sm" onClick={handleAddItem} className="text-xs">
          <Plus className="h-3 w-3 mr-1" />
          Adicionar
        </Button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {value.map((item, index) => (
          <Card key={index} className="p-3">
            <div className="space-y-3">
              {/* Header do Item */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">Item {index + 1}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMoveItem(index, 'up')}
                    disabled={index === 0}
                    className="h-6 w-6 p-0"
                  >
                    ↑
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMoveItem(index, 'down')}
                    disabled={index === value.length - 1}
                    className="h-6 w-6 p-0"
                  >
                    ↓
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveItem(index)}
                    style={{ color: '#432818' }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Edição do Item - Se for objeto (opção de quiz) */}
              {typeof item === 'object' && item !== null ? (
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">Texto</Label>
                    <Textarea
                      value={item.text || ''}
                      onChange={e => handleUpdateItem(index, { text: e.target.value })}
                      placeholder="Texto da opção..."
                      rows={2}
                      className="text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Valor</Label>
                      <Input
                        value={item.value || ''}
                        onChange={e => handleUpdateItem(index, { value: e.target.value })}
                        placeholder="valor"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Categoria</Label>
                      <Input
                        value={item.category || ''}
                        onChange={e => handleUpdateItem(index, { category: e.target.value })}
                        placeholder="categoria"
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">URL da Imagem</Label>
                    <div className="flex gap-2">
                      <Input
                        value={item.imageUrl || ''}
                        onChange={e => handleUpdateItem(index, { imageUrl: e.target.value })}
                        placeholder="https://..."
                        className="text-sm"
                      />
                      <Button size="sm" variant="outline" className="px-2">
                        <Upload className="h-3 w-3" />
                      </Button>
                    </div>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.text}
                        className="w-16 h-16 object-cover rounded border mt-2"
                      />
                    )}
                  </div>

                  <div>
                    <Label className="text-xs">Pontos: {item.points || 1}</Label>
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      value={item.points || 1}
                      onChange={e =>
                        handleUpdateItem(index, {
                          points: parseInt(e.target.value),
                        })
                      }
                      className="text-sm"
                    />
                  </div>
                </div>
              ) : (
                /* Edição Simples - Se for string ou primitivo */
                <Input
                  value={item || ''}
                  onChange={e => handleUpdateItem(index, e.target.value)}
                  placeholder="Digite o valor..."
                  className="text-sm"
                />
              )}
            </div>
          </Card>
        ))}
      </div>

      {value.length === 0 && (
        <div style={{ borderColor: '#E5DDD5' }}>
          <div className="text-2xl mb-2">📝</div>
          <p className="text-sm">Nenhum item adicionado</p>
          <Button size="sm" onClick={handleAddItem} className="mt-2">
            <Plus className="h-3 w-3 mr-1" />
            Adicionar Primeiro Item
          </Button>
        </div>
      )}
    </div>
  );
};

interface DynamicPropertiesPanelProps {
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

const DynamicPropertiesPanel: React.FC<DynamicPropertiesPanelProps> = ({
  block,
  blockDefinition,
  onUpdateBlock,
  onClose,
}) => {
  const handlePropertyChange = (key: string, value: any) => {
    // 🎯 Update both content and properties for maximum compatibility
    const updatedContent = {
      ...block.content,
      [key]: value,
    };
    
    const updatedProperties = {
      ...(block.properties || {}),
      [key]: value,
    };

    // Update the block with both content and properties
    onUpdateBlock(block.id, {
      ...updatedContent,
      properties: updatedProperties,
    });
  };

  const renderPropertyInput = (key: string, property: any) => {
    const currentValue = (block.content as any)[key] || (block.properties as any)?.[key] || property.default;

    // 🔒 Conditional rendering: check if property should be shown
    if (property.conditional) {
      const conditionMet = Object.entries(property.conditional).every(([condKey, condValue]) => {
        const condCurrentValue = (block.content as any)[condKey] || (block.properties as any)?.[condKey];
        return condCurrentValue === condValue;
      });
      if (!conditionMet) return null;
    }

    switch (property.type) {
      case 'string':
        return (
          <Input
            value={currentValue || ''}
            onChange={e => handlePropertyChange(key, e.target.value)}
            placeholder={property.placeholder || property.label}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={currentValue || ''}
            onChange={e => handlePropertyChange(key, e.target.value)}
            placeholder={property.placeholder || property.label}
            rows={property.rows || 3}
          />
        );

      case 'boolean':
        return (
          <Switch
            checked={currentValue || false}
            onCheckedChange={checked => handlePropertyChange(key, checked)}
          />
        );

      case 'select':
        return (
          <Select
            value={String(currentValue || property.default)}
            onValueChange={value => {
              // Convert back to appropriate type
              const convertedValue = property.options?.find((opt: any) => String(opt.value) === value)?.value;
              handlePropertyChange(key, convertedValue);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {property.options
                ?.filter((option: any) => option.value !== undefined && option.value !== '')
                .map((option: any) => (
                  <SelectItem key={String(option.value)} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {property.options?.map((option: any) => (
              <div key={option.value} className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handlePropertyChange(key, option.value)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md border transition-colors ${
                    currentValue === option.value
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  {option.icon && <span>{option.icon}</span>}
                  <span className="text-sm">{option.label}</span>
                </button>
              </div>
            ))}
          </div>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {property.min}{property.unit || ''}
              </span>
              <span className="text-sm font-medium">
                {currentValue || property.default}{property.unit || ''}
              </span>
              <span className="text-sm text-gray-600">
                {property.max}{property.unit || ''}
              </span>
            </div>
            <input
              type="range"
              min={property.min || 0}
              max={property.max || 100}
              step={property.step || 1}
              value={currentValue || property.default}
              onChange={e => handlePropertyChange(key, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #B89B7A 0%, #B89B7A ${
                  ((currentValue - (property.min || 0)) / ((property.max || 100) - (property.min || 0))) * 100
                }%, #e5e5e5 ${
                  ((currentValue - (property.min || 0)) / ((property.max || 100) - (property.min || 0))) * 100
                }%, #e5e5e5 100%)`,
              }}
            />
          </div>
        );

      case 'color':
        return (
          <div className="flex space-x-2">
            <input
              type="color"
              value={currentValue || property.default}
              onChange={e => handlePropertyChange(key, e.target.value)}
              className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
            />
            <Input
              value={currentValue || property.default}
              onChange={e => handlePropertyChange(key, e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-2">
            <Input
              value={currentValue || ''}
              onChange={e => handlePropertyChange(key, e.target.value)}
              placeholder="URL da imagem ou caminho"
            />
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                <Upload className="h-3 w-3 mr-1" />
                Fazer Upload
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                📷 Galeria
              </Button>
            </div>
            {currentValue && (
              <img
                src={currentValue}
                alt="Preview"
                className="w-20 h-20 object-cover rounded border"
                onError={e => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </div>
        );

      case 'number':
        return (
          <Input
            type="number"
            min={property.min}
            max={property.max}
            step={property.step || 1}
            value={currentValue || ''}
            onChange={e => handlePropertyChange(key, parseFloat(e.target.value) || property.default)}
            placeholder={property.placeholder || property.label}
          />
        );

      case 'array':
        return (
          <ArrayEditor
            value={currentValue || property.default || []}
            onChange={value => handlePropertyChange(key, value)}
            property={property}
          />
        );

      case 'options-array':
        return (
          <OptionsArrayEditor
            value={currentValue || property.default || []}
            onChange={value => handlePropertyChange(key, value)}
            property={property}
          />
        );

      default:
        return (
          <Input
            value={currentValue || ''}
            onChange={e => handlePropertyChange(key, e.target.value)}
            placeholder={property.placeholder || property.label}
          />
        );
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header do Properties Panel */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">{blockDefinition.name}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Propriedades do componente</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-auto">
        {/* 🎯 Categorized Properties Display */}
        {(() => {
          const propertiesByCategory = Object.entries(blockDefinition.properties).reduce((acc, [key, property]) => {
            const category = (property as any).category || 'general';
            if (!acc[category]) acc[category] = [];
            acc[category].push([key, property]);
            return acc;
          }, {} as Record<string, [string, any][]>);

          const categoryLabels = {
            content: '📝 Conteúdo',
            layout: '📐 Layout',
            images: '🖼️ Imagens',
            styling: '🎨 Estilização',
            sizing: '📏 Dimensionamento',
            behavior: '⚙️ Comportamento',
            navigation: '🚀 Navegação',
            buttons: '🔘 Botões',
            validation: '✅ Validação',
            general: '⚙️ Geral',
          };

          const categoryOrder = ['content', 'layout', 'images', 'styling', 'sizing', 'behavior', 'navigation', 'buttons', 'validation', 'general'];

          return categoryOrder.map(categoryKey => {
            const categoryProperties = propertiesByCategory[categoryKey];
            if (!categoryProperties || categoryProperties.length === 0) return null;

            return (
              <div key={categoryKey} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-amber-200">
                  <h4 className="text-sm font-semibold text-amber-800">
                    {categoryLabels[categoryKey as keyof typeof categoryLabels] || `📋 ${categoryKey}`}
                  </h4>
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    {categoryProperties.length} {categoryProperties.length === 1 ? 'propriedade' : 'propriedades'}
                  </span>
                </div>
                
                <div className="space-y-4 pl-2">
                  {categoryProperties.map(([key, property]) => {
                    const renderedInput = renderPropertyInput(key, property);
                    if (!renderedInput) return null; // Skip conditional properties that don't meet requirements

                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Label className="text-sm font-medium text-gray-700">
                              {(property as any).label}
                              {(property as any).required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </Label>
                            {(property as any).description && (
                              <p className="text-xs text-gray-500 mt-1">
                                {(property as any).description}
                              </p>
                            )}
                          </div>
                          {(property as any).unit && (
                            <span className="text-xs text-gray-400 ml-2">
                              {(property as any).unit}
                            </span>
                          )}
                        </div>
                        <div className="mt-2">
                          {renderedInput}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          });
        })()}

        {Object.keys(blockDefinition.properties).length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-3">⚙️</div>
            <p className="text-sm">Nenhuma propriedade configurável</p>
            <p className="text-xs text-gray-400 mt-1">
              Este componente não possui propriedades editáveis
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicPropertiesPanel;
