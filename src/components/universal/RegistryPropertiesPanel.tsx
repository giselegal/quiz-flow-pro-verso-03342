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
import {
  X, Trash2, RotateCcw, Plus, Minus, Upload, Eye, EyeOff,
  Info, Palette, Image, Settings, Layout, Type, Check,
  RefreshCw, Save
} from 'lucide-react';
import { blocksRegistry, type PropSchema } from '@/core/blocks/registry';
import QuizQuestionPropertiesPanel from '@/components/editor/properties/QuizQuestionPropertiesPanel';

interface RegistryPropertiesPanelProps {
  selectedBlock: any;
  onUpdate: (blockId: string, updates: Record<string, any>) => void;
  onClose: () => void;
  onDelete: (blockId: string) => void;
}

// ✨ CATEGORIAS MODERNAS PARA AGRUPAMENTO
const categoryIcons = {
  content: Type,
  layout: Layout,
  style: Palette,
  validation: Check,
  behavior: Settings,
  general: Settings
};

const categoryLabels = {
  content: 'Conteúdo',
  layout: 'Layout',
  style: 'Estilo',
  validation: 'Validação',
  behavior: 'Comportamento',
  general: 'Geral'
};

// ✨ HOOK PARA SINCRONIZAÇÃO BIDIRECIONAL COM BACKEND
const useBackendSync = (selectedBlock: any, onUpdate: Function) => {
  const [localState, setLocalState] = useState(() => ({
    ...selectedBlock?.properties || {},
    ...selectedBlock?.content || {}
  }));
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Sincronizar quando o bloco selecionado mudar
  useEffect(() => {
    if (selectedBlock) {
      setLocalState({
        ...selectedBlock.properties || {},
        ...selectedBlock.content || {}
      });
      setHasUnsavedChanges(false);
      setSaveStatus('idle');
    }
  }, [selectedBlock?.id]);

  // Salvar automaticamente com debounce e feedback visual avançado
  const debouncedSave = useMemo(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (updates: Record<string, any>) => {
      setHasUnsavedChanges(true);
      setSaveStatus('saving');
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        setIsSaving(true);
        try {
          // Separar propriedades e conteúdo
          const properties: Record<string, any> = {};
          const content: Record<string, any> = {};

          Object.entries(updates).forEach(([key, value]) => {
            // Lógica para determinar se é propriedade ou conteúdo
            if (['title', 'subtitle', 'description', 'text', 'question', 'options'].includes(key)) {
              content[key] = value;
            } else {
              properties[key] = value;
            }
          });

          await onUpdate(selectedBlock.id, {
            ...(Object.keys(properties).length > 0 && { properties }),
            ...(Object.keys(content).length > 0 && { content })
          });

          setHasUnsavedChanges(false);
          setSaveStatus('saved');
          setLastSaved(new Date());

          // Reset status após 2 segundos
          setTimeout(() => setSaveStatus('idle'), 2000);

        } catch (error) {
          console.error('❌ Erro ao salvar:', error);
          setSaveStatus('error');
          setTimeout(() => setSaveStatus('idle'), 3000);
        } finally {
          setIsSaving(false);
        }
      }, 500);
    };
  }, [selectedBlock?.id, onUpdate]);

  const updateField = useCallback((key: string, value: any) => {
    setLocalState((prev: any) => {
      const newState = { ...prev, [key]: value };
      debouncedSave(newState);
      return newState;
    });
  }, [debouncedSave]);

  return {
    localState,
    updateField,
    isSaving,
    hasUnsavedChanges,
    saveStatus,
    lastSaved
  };
};


// ✨ COMPONENTE MODERNO PARA CAMPOS DE IMAGEM
const ImageFieldEditor: React.FC<{
  schema: PropSchema;
  value: string;
  onUpdate: (value: string) => void;
  onSizeUpdate?: (width: number, height: number) => void;
  currentWidth?: number;
  currentHeight?: number;
}> = ({ schema, value, onUpdate, onSizeUpdate, currentWidth, currentHeight }) => {
  const [showPreview, setShowPreview] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulação de upload - em produção, fazer upload real
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdate(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3 p-3 border border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header com preview toggle */}
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-blue-700 flex items-center gap-2">
          <Image className="h-3 w-3" />
          {schema.label}
        </Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="h-6 w-6 p-0"
        >
          {showPreview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
        </Button>
      </div>

      {/* Preview da imagem */}
      {showPreview && value && (
        <div className="relative bg-white rounded border p-2">
          <img
            src={value}
            alt="Preview"
            className="max-w-full h-20 object-contain mx-auto rounded"
            style={{
              width: currentWidth ? `${currentWidth}px` : 'auto',
              height: currentHeight ? `${currentHeight}px` : 'auto'
            }}
          />
          <div className="absolute top-1 right-1 bg-black/50 text-white text-[8px] px-1 rounded">
            {currentWidth}x{currentHeight}
          </div>
        </div>
      )}

      {/* URL input */}
      <div className="space-y-1">
        <Input
          value={value}
          onChange={(e) => onUpdate(e.target.value)}
          placeholder="https://exemplo.com/imagem.jpg ou data:image/..."
          className="h-8 text-xs"
        />
      </div>

      {/* Upload button */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 h-8 text-xs"
        >
          <Upload className="h-3 w-3 mr-1" />
          Fazer Upload
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Controles de tamanho */}
      {onSizeUpdate && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[10px] text-gray-600">Largura</Label>
            <Slider
              defaultValue={[currentWidth || 100]}
              min={50}
              max={500}
              step={10}
              onValueChange={(vals) => onSizeUpdate(vals[0], currentHeight || 100)}
              className="mt-1"
            />
            <span className="text-[9px] text-gray-400">{currentWidth}px</span>
          </div>
          <div>
            <Label className="text-[10px] text-gray-600">Altura</Label>
            <Slider
              defaultValue={[currentHeight || 100]}
              min={50}
              max={500}
              step={10}
              onValueChange={(vals) => onSizeUpdate(currentWidth || 100, vals[0])}
              className="mt-1"
            />
            <span className="text-[9px] text-gray-400">{currentHeight}px</span>
          </div>
        </div>
      )}
    </div>
  );
};

const RegistryPropertiesPanel: React.FC<RegistryPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate: _onUpdate,
  onClose,
  onDelete,
}) => {
  // ✨ USAR HOOK DE SINCRONIZAÇÃO BIDIRECIONAL
  const {
    localState,
    updateField,
    isSaving,
    hasUnsavedChanges,
    saveStatus,
    lastSaved
  } = useBackendSync(selectedBlock, _onUpdate);

  if (!selectedBlock) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="text-4xl mb-2">🎯</div>
        <p>Selecione um bloco no canvas para editar suas propriedades.</p>
      </div>
    );
  }

  const blockDefinition = blocksRegistry[selectedBlock.type];

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

  const isQuestionBlock = (
    selectedBlock.type === 'options-grid' ||
    selectedBlock.type === 'quiz-question' ||
    selectedBlock.type === 'quiz-question-inline'
  );

  // ✨ VERIFICAR CONDIÇÕES DEPENDSON/WHEN
  const isFieldVisible = (schema: PropSchema): boolean => {
    // Verificar dependsOn (campo deve existir e ter valor)
    if (schema.dependsOn) {
      for (const dep of schema.dependsOn) {
        const depValue = localState[dep];
        if (!depValue && depValue !== 0 && depValue !== false) {
          return false;
        }
      }
    }

    // Verificar condição when (campo específico deve ter valor específico)
    if (schema.when) {
      const conditionValue = localState[schema.when.key];
      if (conditionValue !== schema.when.value) {
        return false;
      }
    }

    return true;
  };

  // ✨ AGRUPAMENTO INTELIGENTE POR CATEGORIAS
  const groupedSchemas = useMemo(() => {
    const groups: Record<string, PropSchema[]> = {};
    (blockDefinition.propsSchema || []).forEach(schema => {
      // Filtrar por condições dependsOn/when
      if (!isFieldVisible(schema)) return;

      const cat = schema.category || 'general';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(schema);
    });
    return groups;
  }, [blockDefinition.propsSchema, localState]);

  // ✨ RENDERIZADOR DE CAMPO MODERNO E INTUITIVO
  const renderModernField = (schema: PropSchema) => {
    const value = localState[schema.key] ?? schema.default ?? '';
    const isModified = value !== (schema.default ?? '');

    // Helper para tooltip com informações
    const renderFieldWithTooltip = (field: React.ReactNode, helpText?: string) => {
      if (!helpText) return field;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                {field}
                <Info className="absolute -top-1 -right-1 h-3 w-3 text-blue-400 opacity-60" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-48">{helpText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    };

    // Label comum moderno
    const commonLabel = (
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Label htmlFor={schema.key} className="text-xs font-medium text-gray-700">
            {schema.label}
            {schema.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {isModified && (
            <Badge variant="secondary" className="text-[8px] px-1 py-0">
              modificado
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Indicador de valor atual para sliders */}
          {schema.kind === 'range' && typeof value === 'number' && (
            <span className="text-[10px] text-blue-600 font-mono font-bold bg-blue-50 px-1 rounded">
              {value}{schema.unit || ''}
            </span>
          )}
          {/* Botão de reset individual */}
          {isModified && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateField(schema.key, schema.default ?? '')}
              className="h-5 w-5 p-0 hover:bg-red-100 hover:text-red-600"
              title="Resetar para valor padrão"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    );

    const fieldContent = (() => {
      switch (schema.kind) {
        case 'text':
          return (
            <Input
              id={schema.key}
              value={value}
              placeholder={schema.placeholder}
              onChange={e => updateField(schema.key, e.target.value)}
              className="h-9 text-sm transition-all focus:ring-2 focus:ring-blue-500"
            />
          );

        case 'textarea':
          return (
            <Textarea
              id={schema.key}
              value={value}
              placeholder={schema.placeholder}
              onChange={e => updateField(schema.key, e.target.value)}
              className="text-sm min-h-[80px] transition-all focus:ring-2 focus:ring-blue-500"
            />
          );

        case 'color':
          return (
            <div className="flex gap-2 items-center">
              <Input
                type="color"
                id={schema.key}
                value={value || '#ffffff'}
                onChange={e => updateField(schema.key, e.target.value)}
                className="h-9 w-16 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={value}
                onChange={e => updateField(schema.key, e.target.value)}
                placeholder="#ffffff"
                className="h-9 font-mono text-sm flex-1"
              />
              <div
                className="w-9 h-9 rounded border-2 border-gray-200"
                style={{ backgroundColor: value || '#ffffff' }}
                title="Preview da cor"
              />
            </div>
          );

        case 'number':
          return (
            <Input
              type="number"
              id={schema.key}
              value={value}
              min={schema.min}
              max={schema.max}
              step={schema.step}
              onChange={e => updateField(schema.key, e.target.value === '' ? '' : Number(e.target.value))}
              className="h-9 text-sm"
            />
          );

        case 'range':
          return (
            <div className="space-y-2">
              <Slider
                defaultValue={[typeof value === 'number' ? value : schema.min || 0]}
                min={schema.min ?? 0}
                max={schema.max ?? 100}
                step={schema.step ?? 1}
                onValueChange={vals => updateField(schema.key, vals[0])}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>{schema.min ?? 0}{schema.unit || ''}</span>
                <span>{schema.max ?? 100}{schema.unit || ''}</span>
              </div>
            </div>
          );

        case 'select':
          return (
            <Select
              value={value}
              onValueChange={val => updateField(schema.key, val)}
            >
              <SelectTrigger id={schema.key} className="h-9 text-sm">
                <SelectValue placeholder={schema.placeholder || 'Selecione...'} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {schema.options?.map(opt => (
                  <SelectItem key={opt.value} value={String(opt.value)} className="text-sm">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );

        case 'switch':
          return (
            <div className="flex items-center justify-between py-2">
              <div className="flex-1">
                <Label htmlFor={schema.key} className="text-sm text-gray-700 cursor-pointer">
                  {schema.label}
                </Label>
                {schema.description && (
                  <p className="text-xs text-gray-500 mt-1">{schema.description}</p>
                )}
              </div>
              <Switch
                id={schema.key}
                checked={!!value}
                onCheckedChange={val => updateField(schema.key, val)}
                className="ml-3"
              />
            </div>
          );

        case 'url':
          return (
            <Input
              id={schema.key}
              type="url"
              value={value}
              placeholder={schema.placeholder || 'https://...'}
              onChange={e => updateField(schema.key, e.target.value)}
              className="h-9 text-sm"
            />
          );

        case 'url':
          return (
            <ImageFieldEditor
              schema={schema}
              value={value}
              onUpdate={val => updateField(schema.key, val)}
              onSizeUpdate={(width, height) => {
                updateField(`${schema.key}Width`, width);
                updateField(`${schema.key}Height`, height);
              }}
              currentWidth={localState[`${schema.key}Width`]}
              currentHeight={localState[`${schema.key}Height`]}
            />
          );

        case 'array':
          return (
            <div className="border border-gray-200 rounded-lg p-3 space-y-3 bg-gray-50">
              {(Array.isArray(value) ? value : []).map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-2 bg-white p-2 rounded border">
                  <span className="text-xs text-gray-400 w-6 text-center">{index + 1}</span>
                  <Input
                    value={item}
                    onChange={e => {
                      const newArray = [...(Array.isArray(value) ? value : [])];
                      newArray[index] = e.target.value;
                      updateField(schema.key, newArray);
                    }}
                    className="h-8 text-sm flex-1"
                    placeholder={`Item ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newArray = [...(Array.isArray(value) ? value : [])];
                      newArray.splice(index, 1);
                      updateField(schema.key, newArray);
                    }}
                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newArray = [...(Array.isArray(value) ? value : []), ''];
                  updateField(schema.key, newArray);
                }}
                className="h-9 w-full border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </div>
          );

        default:
          return (
            <div className="text-xs italic text-gray-400 p-2 border border-dashed rounded">
              Tipo não suportado: {schema.kind}
            </div>
          );
      }
    })();

    return (
      <div key={schema.key} className="space-y-1">
        {schema.kind !== 'switch' && commonLabel}
        {renderFieldWithTooltip(fieldContent, schema.description)}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* ✨ CABEÇALHO MODERNO COM INDICADORES */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Ícone do bloco */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              {blockDefinition.icon || '🧩'}
            </div>
            {/* Informações do bloco */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {blockDefinition.title}
                {hasUnsavedChanges && (
                  <Badge variant="outline" className="text-[10px] text-orange-600 border-orange-200">
                    não salvo
                  </Badge>
                )}
                {isSaving && (
                  <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-200 animate-pulse">
                    salvando...
                  </Badge>
                )}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm text-gray-500 font-mono">
                  ID: {selectedBlock.id.slice(0, 8)}...
                </p>
                <Badge variant="secondary" className="text-[10px]">
                  {selectedBlock.type}
                </Badge>
              </div>
            </div>
          </div>
          {/* Controles do cabeçalho */}
          <div className="flex items-center gap-2">
            {/* Indicador de status */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className={`w-2 h-2 rounded-full ${saveStatus === 'saving' ? 'bg-blue-400 animate-pulse' :
                  saveStatus === 'error' ? 'bg-red-400 animate-bounce' :
                    saveStatus === 'saved' ? 'bg-green-400' :
                      hasUnsavedChanges ? 'bg-orange-400' : 'bg-green-400'
                }`} />
              <span className={`${saveStatus === 'error' ? 'text-red-600' :
                  saveStatus === 'saved' ? 'text-green-600' : ''
                }`}>
                {saveStatus === 'saving' ? 'Salvando...' :
                  saveStatus === 'error' ? 'Erro ao salvar' :
                    saveStatus === 'saved' ? 'Salvo com sucesso' :
                      hasUnsavedChanges ? 'Alterações pendentes' : 'Sincronizado'}
              </span>
              {saveStatus === 'saved' && lastSaved && (
                <span className="text-gray-400 ml-1">
                  ({lastSaved.toLocaleTimeString()})
                </span>
              )}
            </div>
            <Button onClick={onClose} variant="ghost" size="sm" className="hover:bg-gray-100">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ✨ CONTEÚDO PRINCIPAL COM SCROLL SUAVE */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {isQuestionBlock ? (
          <QuizQuestionPropertiesPanel
            block={selectedBlock}
            onUpdate={(updates) => {
              Object.entries(updates).forEach(([key, value]) => {
                updateField(key, value);
              });
            }}
            onDelete={() => onDelete(selectedBlock.id)}
          />
        ) : (
          <div className="space-y-6">
            {/* ✨ PREVIEW EM TEMPO REAL MODERNO */}
            <Card className="border-blue-200 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview em Tempo Real
                  <Badge variant="outline" className="text-[10px] ml-auto">
                    {Object.keys(localState).length} propriedades
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {Object.keys(localState).length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {Object.entries(localState).slice(0, 8).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-2 bg-white/70 rounded border border-blue-100">
                        <span className="text-xs font-medium text-blue-800 truncate max-w-20">
                          {key}
                        </span>
                        <span className="text-xs text-gray-700 text-right font-mono bg-white px-2 py-1 rounded border">
                          {typeof value === 'string' && value.length > 25
                            ? `"${value.slice(0, 25)}..."`
                            : typeof value === 'string'
                              ? `"${value}"`
                              : JSON.stringify(value).length > 30
                                ? JSON.stringify(value).slice(0, 30) + '...'
                                : JSON.stringify(value)
                          }
                        </span>
                      </div>
                    ))}
                    {Object.keys(localState).length > 8 && (
                      <div className="text-center text-xs text-blue-600 mt-2">
                        +{Object.keys(localState).length - 8} mais propriedades...
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-xs text-gray-400 py-6">
                    <Settings className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    Nenhuma propriedade configurada ainda
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ✨ CATEGORIAS MODERNAS COM ÍCONES */}
            {Object.entries(groupedSchemas).map(([category, schemas]) => {
              const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons] || Settings;
              const categoryLabel = categoryLabels[category as keyof typeof categoryLabels] || category;

              return (
                <Card key={category} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-gray-100">
                    <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <CategoryIcon className="h-4 w-4 text-gray-600" />
                      {categoryLabel}
                      <Badge variant="outline" className="text-[10px] ml-auto">
                        {schemas.length} {schemas.length === 1 ? 'campo' : 'campos'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    {schemas.map(schema => renderModernField(schema))}
                  </CardContent>
                </Card>
              );
            })}

            {/* Caso não haja propriedades */}
            {(!blockDefinition.propsSchema || blockDefinition.propsSchema.length === 0) && (
              <Card className="border-dashed border-gray-300">
                <CardContent className="text-center py-12">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Nenhuma propriedade configurável
                  </h3>
                  <p className="text-sm text-gray-400">
                    Este bloco não possui propriedades editáveis definidas.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* ✨ RODAPÉ COM AÇÕES PRINCIPAIS */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <RefreshCw className="h-4 w-4" />
            <span>Sincronização automática com backend</span>
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-[10px] text-orange-600">
                Salvando em {Math.ceil(500 / 1000)}s...
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => {
              // Reset todas as propriedades
              Object.keys(localState).forEach(key => {
                const schema = blockDefinition.propsSchema?.find(s => s.key === key);
                if (schema) {
                  updateField(key, schema.default ?? '');
                }
              });
            }}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Tudo
            </Button>
            <Button
              onClick={() => onDelete(selectedBlock.id)}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir Bloco
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistryPropertiesPanel;