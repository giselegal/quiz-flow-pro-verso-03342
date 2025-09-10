import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  X, Trash2, RotateCcw, Plus, Minus, Upload, Eye, EyeOff,
  Info, Palette, Image, Settings, Layout, Type, Check,
  RefreshCw, Save, AlertCircle, Cloud, CloudOff,
  MoveUp, MoveDown, Sparkles
} from 'lucide-react';
import { blocksRegistry, type PropSchema, type PropKind } from '@/core/blocks/registry';
import { debounce } from 'lodash';

interface RegistryPropertiesPanelProps {
  selectedBlock: any;
  onUpdate: (blockId: string, updates: Record<string, any>) => void;
  onClose: () => void;
  onDelete: (blockId: string) => void;
}

// ✨ TIPOS AVANÇADOS PARA PROPRIEDADES MODERNAS
interface ModernPropSchema extends PropSchema {
  icon?: React.ComponentType<any>;
  gradient?: boolean;
  preview?: boolean;
  advanced?: boolean;
  group?: string;
  tooltip?: string;
  validation?: (value: any) => boolean;
  defaultValue?: any;
  type?: PropKind;
  acceptedFormats?: string[];
  helpText?: string;
}

// ✨ CATEGORIAS MODERNAS PARA AGRUPAMENTO
const CATEGORIES = {
  content: { label: 'Conteúdo', icon: Type, color: 'text-blue-600' },
  layout: { label: 'Layout', icon: Layout, color: 'text-green-600' },
  style: { label: 'Estilo', icon: Palette, color: 'text-purple-600' },
  validation: { label: 'Validação', icon: Check, color: 'text-orange-600' },
  behavior: { label: 'Comportamento', icon: Settings, color: 'text-red-600' },
  general: { label: 'Geral', icon: Sparkles, color: 'text-gray-600' }
};

// ✨ HOOK PARA SINCRONIZAÇÃO BIDIRECIONAL COM BACKEND
const useBackendSync = (selectedBlock: any, onUpdate: Function) => {
  const [localState, setLocalState] = useState(() => ({
    ...selectedBlock?.properties || {},
    ...selectedBlock?.content || {}
  }));
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Sincronizar quando o bloco selecionado mudar
  useEffect(() => {
    if (selectedBlock) {
      const newState = {
        ...selectedBlock.properties || {},
        ...selectedBlock.content || {}
      };
      setLocalState(newState);
      setHasUnsavedChanges(false);
      setSaveProgress(0);
    }
  }, [selectedBlock?.id]);

  // Salvar automaticamente com debounce e feedback visual
  const debouncedSave = useMemo(() => {
    return debounce(async (updates: Record<string, any>) => {
      if (!selectedBlock) return;

      setIsSaving(true);
      setSaveProgress(25);

      try {
        setSaveProgress(50);

        const properties: Record<string, any> = {};
        const content: Record<string, any> = {};

        Object.entries(updates).forEach(([key, value]) => {
          // Campos que tradicionalmente são conteúdo
          const contentFields = ['title', 'subtitle', 'description', 'text', 'question', 'options', 'placeholder'];

          if (contentFields.includes(key)) {
            content[key] = value;
          } else {
            properties[key] = value;
          }
        });

        setSaveProgress(75);

        // Chamar onUpdate com a estrutura correta
        const updatePayload: any = {};
        if (Object.keys(properties).length > 0) updatePayload.properties = properties;
        if (Object.keys(content).length > 0) updatePayload.content = content;

        await onUpdate(selectedBlock.id, updatePayload);

        setSaveProgress(100);
        setHasUnsavedChanges(false);
        setLastSaved(new Date());

        // Reset do progresso após um tempo
        setTimeout(() => setSaveProgress(0), 1000);

      } catch (error) {
        console.error('❌ Erro ao salvar no backend:', error);
        setSaveProgress(0);
      } finally {
        setIsSaving(false);
      }
    }, 800);
  }, [selectedBlock?.id, onUpdate]);

  const updateField = useCallback((key: string, value: any) => {
    setLocalState((prev: any) => {
      const newState = { ...prev, [key]: value };
      setHasUnsavedChanges(true);
      debouncedSave(newState);
      return newState;
    });
  }, [debouncedSave]);

  const resetField = useCallback((key: string, defaultValue: any) => {
    updateField(key, defaultValue);
  }, [updateField]);

  return {
    localState,
    isSaving,
    hasUnsavedChanges,
    saveProgress,
    lastSaved,
    updateField,
    resetField
  };
};

// ✨ COMPONENTE MODERNO PARA CAMPOS DE IMAGEM
const ImageFieldEditor: React.FC<{
  schema: ModernPropSchema;
  value: string;
  onUpdate: (value: string) => void;
  onSizeUpdate?: (width: number, height: number) => void;
  currentWidth?: number;
  currentHeight?: number;
}> = ({ schema, value, onUpdate, onSizeUpdate, currentWidth = 200, currentHeight = 150 }) => {
  const [showPreview, setShowPreview] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulação de upload - em produção, fazer upload real
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdate(e.target?.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    onUpdate(url);
  };

  return (
    <div className="space-y-3">
      {/* Miniatura e controles */}
      <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
        {/* Miniatura da imagem */}
        <div className="relative w-16 h-12 bg-gray-100 rounded border overflow-hidden flex-shrink-0">
          {value && showPreview ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setShowPreview(false)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Image className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Controles de upload */}
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-1"
            >
              {isUploading ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <Upload className="w-3 h-3" />
              )}
              {isUploading ? 'Enviando...' : 'Substituir'}
            </Button>

            {value && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1"
              >
                {showPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </Button>
            )}
          </div>

          {/* Campo de URL */}
          <Input
            placeholder="ou cole URL da imagem..."
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="text-xs"
          />
        </div>
      </div>

      {/* Controles de tamanho */}
      {onSizeUpdate && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-medium text-gray-600">Largura</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[currentWidth]}
                onValueChange={([width]) => onSizeUpdate(width, currentHeight)}
                min={50}
                max={800}
                step={10}
                className="flex-1"
              />
              <span className="text-xs text-gray-500 w-12">{currentWidth}px</span>
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Altura</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[currentHeight]}
                onValueChange={([height]) => onSizeUpdate(currentWidth, height)}
                min={50}
                max={600}
                step={10}
                className="flex-1"
              />
              <span className="text-xs text-gray-500 w-12">{currentHeight}px</span>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={schema.acceptedFormats?.join(',') || 'image/*'}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

// ✨ COMPONENTE PARA OPTIONS ARRAY EDITOR MODERNO
const OptionsArrayEditor: React.FC<{
  value: any[];
  onUpdate: (value: any[]) => void;
  schema: ModernPropSchema;
}> = ({ value = [], onUpdate, schema }) => {
  const addOption = () => {
    const newOption = { id: Date.now().toString(), text: '', imageUrl: '' };
    onUpdate([...value, newOption]);
  };

  const updateOption = (index: number, field: string, newValue: string) => {
    const updated = value.map((option, i) =>
      i === index ? { ...option, [field]: newValue } : option
    );
    onUpdate(updated);
  };

  const removeOption = (index: number) => {
    onUpdate(value.filter((_, i) => i !== index));
  };

  const moveOption = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= value.length) return;

    const updated = [...value];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onUpdate(updated);
  };

  return (
    <div className="space-y-3">
      {value.map((option, index) => (
        <Card key={option.id || index} className="p-3">
          <div className="space-y-3">
            {/* Controles de ordem */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                Opção {index + 1}
              </Badge>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveOption(index, 'up')}
                  disabled={index === 0}
                  className="h-6 w-6 p-0"
                >
                  <MoveUp className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveOption(index, 'down')}
                  disabled={index === value.length - 1}
                  className="h-6 w-6 p-0"
                >
                  <MoveDown className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(index)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Campo de texto */}
            <Input
              placeholder="Texto da opção..."
              value={option.text || ''}
              onChange={(e) => updateOption(index, 'text', e.target.value)}
              className="font-medium"
            />

            {/* Campo de imagem (se aplicável) */}
            {(option.imageUrl !== undefined || schema.key === 'options') && (
              <ImageFieldEditor
                schema={{ ...schema, label: 'Imagem da opção' }}
                value={option.imageUrl || ''}
                onUpdate={(url) => updateOption(index, 'imageUrl', url)}
              />
            )}
          </div>
        </Card>
      ))}

      {/* Botão para adicionar opção */}
      <Button
        variant="outline"
        onClick={addOption}
        className="w-full border-dashed border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Opção
      </Button>
    </div>
  );
};

// ✨ RENDERIZADOR DE CAMPO MODERNO
const ModernFieldRenderer: React.FC<{
  schema: ModernPropSchema;
  value: any;
  onUpdate: (value: any) => void;
  onReset: () => void;
}> = ({ schema, value, onUpdate, onReset }) => {
  const isModified = value !== schema.defaultValue;

  const renderField = () => {
    switch (schema.kind) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder={schema.placeholder || `Digite ${schema.label.toLowerCase()}...`}
            className="w-full"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder={schema.placeholder || `Digite ${schema.label.toLowerCase()}...`}
            rows={3}
            className="w-full resize-none"
          />
        );

      case 'number':
        if (schema.min !== undefined && schema.max !== undefined) {
          // Usar slider para números com range
          return (
            <div className="space-y-2">
              <Slider
                value={[value || schema.defaultValue || 0]}
                onValueChange={([val]) => onUpdate(val)}
                min={schema.min}
                max={schema.max}
                step={schema.step || 1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{schema.min}{schema.unit}</span>
                <span className="font-medium">{value || 0}{schema.unit}</span>
                <span>{schema.max}{schema.unit}</span>
              </div>
            </div>
          );
        } else {
          return (
            <Input
              type="number"
              value={value || ''}
              onChange={(e) => onUpdate(Number(e.target.value))}
              placeholder={schema.placeholder}
              min={schema.min}
              max={schema.max}
              step={schema.step}
              className="w-full"
            />
          );
        }

      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={Boolean(value)}
              onCheckedChange={onUpdate}
              id={schema.key}
            />
            <Label
              htmlFor={schema.key}
              className="text-sm font-medium cursor-pointer"
            >
              {Boolean(value) ? 'Ativado' : 'Desativado'}
            </Label>
          </div>
        );

      case 'color':
        return (
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => onUpdate(e.target.value)}
              className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
            />
            <Input
              value={value || ''}
              onChange={(e) => onUpdate(e.target.value)}
              placeholder="#000000"
              className="flex-1 font-mono text-sm"
            />
            {isModified && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-8 w-8 p-0"
                title="Resetar cor"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            )}
          </div>
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={onUpdate}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Selecione ${schema.label.toLowerCase()}...`} />
            </SelectTrigger>
            <SelectContent>
              {schema.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <Slider
              value={[value || schema.defaultValue || 0]}
              onValueChange={([val]) => onUpdate(val)}
              min={schema.min || 0}
              max={schema.max || 100}
              step={schema.step || 1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{schema.min || 0}{schema.unit}</span>
              <span className="font-medium">{value || 0}{schema.unit}</span>
              <span>{schema.max || 100}{schema.unit}</span>
            </div>
          </div>
        );

      case 'array':
        if (schema.key === 'options') {
          return (
            <OptionsArrayEditor
              value={value || []}
              onUpdate={onUpdate}
              schema={schema}
            />
          );
        } else {
          // Array simples
          return (
            <div className="space-y-2">
              {(Array.isArray(value) ? value : []).map((item: any, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item || ''}
                    onChange={(e) => {
                      const newArray = [...(Array.isArray(value) ? value : [])];
                      newArray[index] = e.target.value;
                      onUpdate(newArray);
                    }}
                    placeholder={`Item ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newArray = [...(Array.isArray(value) ? value : [])];
                      newArray.splice(index, 1);
                      onUpdate(newArray);
                    }}
                    className="h-10 w-10 p-0 text-red-500"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newArray = [...(Array.isArray(value) ? value : []), ''];
                  onUpdate(newArray);
                }}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Item
              </Button>
            </div>
          );
        }

      case 'url':
        if (schema.key.includes('image') || schema.key.includes('logo') || schema.key.includes('src')) {
          return (
            <ImageFieldEditor
              schema={schema}
              value={value || ''}
              onUpdate={onUpdate}
            />
          );
        } else {
          return (
            <Input
              type="url"
              value={value || ''}
              onChange={(e) => onUpdate(e.target.value)}
              placeholder={schema.placeholder || 'https://...'}
              className="w-full"
            />
          );
        }

      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder={schema.placeholder}
            className="w-full"
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {/* Label com tooltip e reset */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-gray-700">
            {schema.label}
            {schema.required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </Label>
          {schema.tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{schema.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {isModified && schema.kind !== 'color' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-6 w-6 p-0"
            title="Resetar para valor padrão"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Campo */}
      {renderField()}

      {/* Texto de ajuda */}
      {schema.helpText && (
        <p className="text-xs text-gray-500">{schema.helpText}</p>
      )}
    </div>
  );
};

// ✨ COMPONENTE PRINCIPAL DO PAINEL
const RegistryPropertiesPanel: React.FC<RegistryPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onClose,
  onDelete
}) => {
  const {
    localState,
    isSaving,
    hasUnsavedChanges,
    saveProgress,
    lastSaved,
    updateField,
    resetField
  } = useBackendSync(selectedBlock, onUpdate);

  if (!selectedBlock) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 p-6">
        <div className="text-center">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Nenhum bloco selecionado</p>
          <p className="text-sm">Clique em um elemento para editar suas propriedades</p>
        </div>
      </div>
    );
  }

  const blockDef = blocksRegistry[selectedBlock.type];
  if (!blockDef?.propsSchema) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <p className="text-lg font-medium">Tipo de bloco não suportado</p>
          <p className="text-sm">O tipo "{selectedBlock.type}" não tem propriedades editáveis</p>
        </div>
      </div>
    );
  }

  // Agrupar schemas por categoria
  const groupedSchemas = blockDef.propsSchema.reduce((acc, schema) => {
    const category = schema.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(schema);
    return acc;
  }, {} as Record<string, ModernPropSchema[]>);

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-white">
        {/* Header com status de salvamento */}
        <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                {blockDef.icon || '🧩'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {blockDef.title}
                </h2>
                <p className="text-sm text-gray-500 font-mono">
                  {selectedBlock.id}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-9 w-9 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Status de salvamento */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {isSaving ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />
                  <span className="text-blue-600">Salvando...</span>
                </>
              ) : hasUnsavedChanges ? (
                <>
                  <CloudOff className="w-3 h-3 text-orange-500" />
                  <span className="text-orange-600">Alterações não salvas</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3 h-3 text-green-500" />
                  <span className="text-green-600">
                    {lastSaved ? `Salvo ${lastSaved.toLocaleTimeString()}` : 'Sincronizado'}
                  </span>
                </>
              )}
            </div>

            {saveProgress > 0 && saveProgress < 100 && (
              <Progress value={saveProgress} className="w-20 h-2" />
            )}
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {Object.entries(groupedSchemas).map(([category, schemas]) => {
              const categoryDef = CATEGORIES[category as keyof typeof CATEGORIES] || CATEGORIES.general;
              const CategoryIcon = categoryDef.icon;

              return (
                <Card key={category} className="border border-gray-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CategoryIcon className={`w-4 h-4 ${categoryDef.color}`} />
                      {categoryDef.label}
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {schemas.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    {schemas.map((schema) => {
                      // Verificar condições dependsOn
                      if (schema.dependsOn) {
                        const shouldShow = schema.dependsOn.every(dep => {
                          const depValue = localState[dep];
                          return depValue !== undefined && depValue !== null && depValue !== '';
                        });
                        if (!shouldShow) return null;
                      }

                      // Verificar condições when
                      if (schema.when) {
                        const shouldShow = Object.entries(schema.when).every(([key, expectedValue]) => {
                          return localState[key] === expectedValue;
                        });
                        if (!shouldShow) return null;
                      }

                      return (
                        <ModernFieldRenderer
                          key={schema.key}
                          schema={schema as ModernPropSchema}
                          value={localState[schema.key]}
                          onUpdate={(value) => updateField(schema.key, value)}
                          onReset={() => resetField(schema.key, schema.defaultValue)}
                        />
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Footer com ações principais */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(selectedBlock.id)}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Excluir Bloco
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Fechar
              </Button>
              <Button
                size="sm"
                disabled={!hasUnsavedChanges}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default RegistryPropertiesPanel;
