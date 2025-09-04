import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Trash2, Upload, GripVertical } from 'lucide-react';
import { blocksRegistry } from '@/core/blocks/registry';

interface RegistryPropertiesPanelProps {
  selectedBlock: any;
  onUpdate: (blockId: string, updates: Record<string, any>) => void;
  onClose: () => void;
  onDelete: (blockId: string) => void;
}

// ✅ Enhanced Property Field for comprehensive no-code controls
interface EnhancedPropertyFieldProps {
  propertyKey: string;
  property: any;
  value: any;
  onChange: (value: any) => void;
}

const EnhancedPropertyField: React.FC<EnhancedPropertyFieldProps> = ({
  propertyKey,
  property,
  value,
  onChange,
}) => {
  const currentValue = value || property.default;

  const renderField = () => {
    switch (property.type) {
      case 'string':
        return (
          <Input
            value={currentValue || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={property.placeholder || property.label}
            className="text-sm"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={currentValue || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={property.placeholder || property.label}
            rows={property.rows || 3}
            className="text-sm"
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={currentValue || false}
              onCheckedChange={onChange}
              id={propertyKey}
            />
            <Label htmlFor={propertyKey} className="text-sm">
              {currentValue ? 'Ativado' : 'Desativado'}
            </Label>
          </div>
        );

      case 'select':
        return (
          <Select
            value={String(currentValue || property.default)}
            onValueChange={value => {
              const convertedValue = property.options?.find((opt: any) => String(opt.value) === value)?.value;
              onChange(convertedValue);
            }}
          >
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {property.options?.map((option: any) => (
                <SelectItem key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <div className="grid grid-cols-2 gap-2">
            {property.options?.map((option: any) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-md border text-sm transition-colors ${currentValue === option.value
                    ? 'border-amber-500 bg-amber-50 text-amber-900'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
              >
                {option.icon && <span>{option.icon}</span>}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        );

      case 'range':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">
                {property.min}{property.unit || ''}
              </span>
              <span className="text-sm font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded">
                {currentValue || property.default}{property.unit || ''}
              </span>
              <span className="text-xs text-gray-600">
                {property.max}{property.unit || ''}
              </span>
            </div>
            <Slider
              value={[currentValue || property.default]}
              onValueChange={([value]) => onChange(value)}
              min={property.min || 0}
              max={property.max || 100}
              step={property.step || 1}
              className="w-full"
            />
          </div>
        );

      case 'color':
        return (
          <div className="flex space-x-2">
            <input
              type="color"
              value={currentValue || property.default}
              onChange={e => onChange(e.target.value)}
              className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
            />
            <Input
              value={currentValue || property.default}
              onChange={e => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 text-sm"
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-2">
            <Input
              value={currentValue || ''}
              onChange={e => onChange(e.target.value)}
              placeholder="URL da imagem"
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                <Upload className="h-3 w-3 mr-1" />
                Upload
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
            onChange={e => onChange(parseFloat(e.target.value) || property.default)}
            placeholder={property.placeholder}
            className="text-sm"
          />
        );

      case 'options-array':
        return (
          <OptionsArrayEditor
            value={currentValue || property.default || []}
            onChange={onChange}
            label={property.label}
          />
        );

      default:
        return (
          <Input
            value={currentValue || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={property.placeholder || property.label}
            className="text-sm"
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Label className="text-sm font-medium text-gray-700">
            {property.label}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {property.description && (
            <p className="text-xs text-gray-500 mt-1">{property.description}</p>
          )}
        </div>
        {property.unit && (
          <span className="text-xs text-gray-400 ml-2">{property.unit}</span>
        )}
      </div>
      <div className="mt-2">{renderField()}</div>
    </div>
  );
};

// ✅ Advanced Options Array Editor for Quiz Options
interface OptionsArrayEditorProps {
  value: any[];
  onChange: (value: any[]) => void;
  label: string;
}

const OptionsArrayEditor: React.FC<OptionsArrayEditorProps> = ({ value = [], onChange, label }) => {
  const handleAddOption = () => {
    const newOption = {
      id: `option-${Date.now()}`,
      text: 'Nova opção',
      description: 'Descrição da nova opção',
      imageUrl: 'https://via.placeholder.com/256x256',
      value: `option-${value.length + 1}`,
      category: 'Categoria',
      points: 1,
    };
    onChange([...value, newOption]);
  };

  const handleUpdateOption = (index: number, updates: any) => {
    const newValue = [...value];
    newValue[index] = { ...newValue[index], ...updates };
    onChange(newValue);
  };

  const handleRemoveOption = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleMoveOption = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < value.length) {
      const newValue = [...value];
      [newValue[index], newValue[newIndex]] = [newValue[newIndex], newValue[index]];
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Quick Config */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
            📝 {label} ({value.length} opções)
          </h4>
          <Button onClick={handleAddOption} size="sm" className="text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Adicionar Opção
          </Button>
        </div>

        {/* Quick Configuration */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1 text-blue-700">Preset</label>
            <Select defaultValue="custom">
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">🎨 Personalizado</SelectItem>
                <SelectItem value="style-quiz">👗 Quiz de Estilo</SelectItem>
                <SelectItem value="multiple-choice">☑️ Múltipla Escolha</SelectItem>
                <SelectItem value="rating">⭐ Avaliação</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-blue-700">Tipo de Conteúdo</label>
            <Select defaultValue="image-text">
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image-text">🖼️ Imagem + Texto</SelectItem>
                <SelectItem value="text-only">📝 Apenas Texto</SelectItem>
                <SelectItem value="image-only">📷 Apenas Imagem</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button
              onClick={() => {
                const sampleOptions = [
                  { id: '1', text: 'Opção A', description: 'Primeira opção', imageUrl: 'https://via.placeholder.com/256', value: 'a', category: 'Categoria A', points: 1 },
                  { id: '2', text: 'Opção B', description: 'Segunda opção', imageUrl: 'https://via.placeholder.com/256', value: 'b', category: 'Categoria B', points: 2 },
                  { id: '3', text: 'Opção C', description: 'Terceira opção', imageUrl: 'https://via.placeholder.com/256', value: 'c', category: 'Categoria C', points: 3 },
                  { id: '4', text: 'Opção D', description: 'Quarta opção', imageUrl: 'https://via.placeholder.com/256', value: 'd', category: 'Categoria D', points: 4 },
                ];
                onChange(sampleOptions);
              }}
              variant="outline"
              size="sm"
              className="text-xs w-full"
            >
              🚀 Gerar Exemplo
            </Button>
          </div>
        </div>
      </div>

      {/* Options List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {value.map((option, index) => (
          <div key={option.id || index} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
            {/* Option Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                <div className="w-6 h-6 bg-blue-500 text-white rounded text-xs flex items-center justify-center font-bold">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-sm font-medium text-gray-700">Opção {index + 1}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => handleMoveOption(index, 'up')}
                  disabled={index === 0}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  ↑
                </Button>
                <Button
                  onClick={() => handleMoveOption(index, 'down')}
                  disabled={index === value.length - 1}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  ↓
                </Button>
                <Button
                  onClick={() => handleRemoveOption(index)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Option Content */}
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                {/* Image Preview */}
                <div className="space-y-2">
                  <Label className="text-xs">Imagem</Label>
                  <div className="relative group">
                    <div className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                      {option.imageUrl ? (
                        <img src={option.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-gray-400">
                          <Upload className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-xs">Imagem</span>
                        </div>
                      )}
                    </div>
                    <Input
                      placeholder="URL da imagem..."
                      value={option.imageUrl || ''}
                      onChange={(e) => handleUpdateOption(index, { imageUrl: e.target.value })}
                      className="text-xs mt-1"
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="col-span-2 space-y-3">
                  <div>
                    <Label className="text-xs">Texto Principal</Label>
                    <Textarea
                      placeholder="Ex: Natural & Confortável"
                      value={option.text || ''}
                      onChange={(e) => handleUpdateOption(index, { text: e.target.value })}
                      className="text-sm resize-none"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Descrição</Label>
                    <Input
                      placeholder="Ex: Amo roupas confortáveis e práticas"
                      value={option.description || ''}
                      onChange={(e) => handleUpdateOption(index, { description: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  {/* Quick Settings */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Valor/ID</Label>
                      <Input
                        placeholder="1a"
                        value={option.value || option.id || ''}
                        onChange={(e) => handleUpdateOption(index, { value: e.target.value, id: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Categoria</Label>
                      <Input
                        placeholder="Natural"
                        value={option.category || ''}
                        onChange={(e) => handleUpdateOption(index, { category: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Pontos</Label>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={option.points || 1}
                          onChange={(e) => handleUpdateOption(index, { points: parseInt(e.target.value) || 1 })}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {value.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-sm mb-4">Nenhuma opção configurada</p>
            <Button onClick={handleAddOption} size="sm">
              <Plus className="h-3 w-3 mr-1" />
              Adicionar Primeira Opção
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ Property Field Renderer
interface PropertyFieldProps {
  schema: PropSchema;
  value: any;
  onChange: (value: any) => void;
}

const PropertyField: React.FC<PropertyFieldProps> = ({ schema, value, onChange }) => {
  const currentValue = value ?? schema.default;

  const renderField = () => {
    switch (schema.kind) {
      case 'text':
        return (
          <Input
            type="text"
            value={currentValue || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder}
            required={schema.required}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={currentValue || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder}
            rows={3}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={currentValue || 0}
            onChange={(e) => onChange(Number(e.target.value))}
            min={schema.min}
            max={schema.max}
            step={schema.step}
          />
        );

      case 'range':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {schema.min || 0}
              </span>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {currentValue || schema.default || 0}{schema.unit || ''}
              </span>
              <span className="text-sm text-gray-600">
                {schema.max || 100}
              </span>
            </div>
            <Slider
              value={[currentValue || schema.default || 0]}
              onValueChange={(vals) => onChange(vals[0])}
              min={schema.min || 0}
              max={schema.max || 100}
              step={schema.step || 1}
              className="w-full"
            />
          </div>
        );

      case 'switch':
        return (
          <div className="flex items-center justify-between">
            <span className="text-sm">{schema.label}</span>
            <Switch
              checked={Boolean(currentValue)}
              onCheckedChange={onChange}
            />
          </div>
        );

      case 'color':
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentValue || '#ffffff'}
              onChange={(e) => onChange(e.target.value)}
              className="w-12 h-8 border rounded cursor-pointer"
            />
            <Input
              type="text"
              value={currentValue || '#ffffff'}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#ffffff"
              className="flex-1 font-mono text-sm"
            />
          </div>
        );

      case 'select':
        return (
          <Select value={currentValue} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={`Selecionar ${schema.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {schema.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'url':
        return (
          <Input
            type="url"
            value={currentValue || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder || 'https://...'}
          />
        );

      case 'array':
        // Special handling for options arrays
        if (schema.key === 'options') {
          return (
            <OptionsArrayEditor
              value={currentValue || []}
              onChange={onChange}
              label={schema.label}
            />
          );
        }
        // Generic array editor for other arrays
        return (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Array editor not implemented for this field</div>
            <Textarea
              value={JSON.stringify(currentValue || [], null, 2)}
              onChange={(e) => {
                try {
                  onChange(JSON.parse(e.target.value));
                } catch (e) {
                  // Ignore parse errors during editing
                }
              }}
              rows={4}
              className="font-mono text-xs"
            />
          </div>
        );

      default:
        return (
          <Input
            type="text"
            value={currentValue || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {schema.kind !== 'switch' && (
        <Label className="text-sm font-medium flex items-center gap-2">
          {schema.label}
          {schema.required && <span className="text-red-500 text-xs">*</span>}
        </Label>
      )}
      {renderField()}
      {schema.description && (
        <p className="text-xs text-gray-500">{schema.description}</p>
      )}
    </div>
  );
};

const RegistryPropertiesPanel: React.FC<RegistryPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onClose,
  onDelete,
}) => {
  if (!selectedBlock) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="text-4xl mb-2">🎯</div>
        <p>Selecione um componente para editar suas propriedades</p>
      </div>
    );
  }

  // Try to get enhanced block definition first, then fall back to registry
  const enhancedDefinition = getEnhancedBlockDefinition(selectedBlock.type);
  const blockDefinition = blocksRegistry[selectedBlock.type];

  // 🎯 Use enhanced definition if available, especially for options-grid
  const useEnhancedPanel = enhancedDefinition && selectedBlock.type === 'options-grid';

  if (useEnhancedPanel) {
    // Render enhanced properties panel for options-grid
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-amber-50 to-white">
        {/* Enhanced Header for Options Grid */}
        <div className="bg-white border-b border-amber-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-lg">
                🎯
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{enhancedDefinition.name}</h2>
                <p className="text-sm text-amber-600">
                  Painel No-Code Completo - Todas as Configurações do Backend
                </p>
              </div>
            </div>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-gray-600">Sistema No-Code Ativo</span>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
            <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
              {Object.keys(enhancedDefinition.properties).length} propriedades
            </span>
          </div>
        </div>

        {/* Enhanced Properties Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {(() => {
            const propertiesByCategory = Object.entries(enhancedDefinition.properties).reduce((acc, [key, property]) => {
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
                <div key={categoryKey} className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
                  {/* Category Header */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-amber-800 tracking-wide">
                        {categoryLabels[categoryKey as keyof typeof categoryLabels] || `📋 ${categoryKey}`}
                      </h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
                      <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                        {categoryProperties.length} {categoryProperties.length === 1 ? 'propriedade' : 'propriedades'}
                      </span>
                    </div>
                  </div>

                  {/* Category Properties */}
                  <div className="p-4 space-y-4">
                    {categoryProperties.map(([key, property]) => {
                      // Handle conditional display
                      if ((property as any).conditional) {
                        const conditionMet = Object.entries((property as any).conditional).every(([condKey, condValue]) => {
                          const condCurrentValue = selectedBlock.properties?.[condKey];
                          return condCurrentValue === condValue;
                        });
                        if (!conditionMet) return null;
                      }

                      return (
                        <div key={key} className="bg-amber-50/30 rounded-lg p-3 border border-amber-100">
                          <EnhancedPropertyField
                            propertyKey={key}
                            property={property}
                            value={selectedBlock.properties?.[key]}
                            onChange={(value) => onUpdate(selectedBlock.id, { [key]: value })}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            });
          })()}
        </div>

        {/* Actions Footer */}
        <div className="bg-white border-t border-amber-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              💡 <strong>Dica:</strong> Todas as configurações do backend estão disponíveis aqui!
            </div>
            <Button
              onClick={() => onDelete(selectedBlock.id)}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Fall back to original implementation for other block types
  if (!blockDefinition) {
    return (
      <div className="p-6 text-center">
        <div className="text-4xl mb-2">❌</div>
        <h3 className="text-lg font-semibold mb-2">Tipo de bloco não suportado</h3>
        <p className="text-gray-600 mb-4">O tipo "{selectedBlock.type}" não foi encontrado no registro</p>
        <Button
          onClick={() => onDelete(selectedBlock.id)}
          variant="destructive"
          size="sm"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir Bloco
        </Button>
      </div>
    );
  }

  // Group properties by category (original implementation)
  const groupedProps = blockDefinition.propsSchema.reduce((acc, prop) => {
    const category = prop.category || 'default';
    if (!acc[category]) acc[category] = [];
    acc[category].push(prop);
    return acc;
  }, {} as Record<string, PropSchema[]>);

  const categoryIcons: Record<string, string> = {
    content: '📝',
    layout: '📐',
    style: '🎨',
    behavior: '⚙️',
    advanced: '🔧',
    animation: '✨',
    accessibility: '♿',
    seo: '🔍',
  };

  const categoryNames: Record<string, string> = {
    content: 'Conteúdo',
    layout: 'Layout & Posicionamento',
    style: 'Aparência & Estilo',
    behavior: 'Comportamento',
    advanced: 'Configurações Avançadas',
    animation: 'Animações & Efeitos',
    accessibility: 'Acessibilidade',
    seo: 'SEO & Metadados',
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
              {blockDefinition.icon || '🧩'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{blockDefinition.title}</h2>
              <p className="text-sm text-gray-500 font-mono">
                {selectedBlock.id.slice(0, 12)}...
              </p>
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-gray-600">Propriedades no-code ativas</span>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            {blockDefinition.propsSchema.length} propriedades
          </span>
        </div>
      </div>

      {/* Properties Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {Object.entries(groupedProps).map(([category, props]) => (
          <div key={category} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Category Header */}
            <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{categoryIcons[category] || '📋'}</span>
                <h3 className="text-sm font-bold text-gray-800 tracking-wide">
                  {categoryNames[category] || category.toUpperCase()}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  {props.length}
                </span>
              </div>
            </div>

            {/* Category Properties */}
            <div className="p-4 space-y-4">
              {props.map((prop) => {
                // Handle conditional display
                if (prop.when) {
                  const conditionValue = selectedBlock.properties?.[prop.when.key];
                  if (conditionValue !== prop.when.value) {
                    return null;
                  }
                }

                return (
                  <div key={prop.key} className="bg-gray-50/50 rounded-lg p-3 border border-gray-100">
                    <PropertyField
                      schema={prop}
                      value={selectedBlock.properties?.[prop.key]}
                      onChange={(value) => onUpdate(selectedBlock.id, { [prop.key]: value })}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Actions Footer */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Sistema de propriedades baseado em registro
          </div>
          <Button
            onClick={() => onDelete(selectedBlock.id)}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistryPropertiesPanel;