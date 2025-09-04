/**
 * 🎛️ NOCODE PROPERTIES PANEL - PAINEL DE PROPRIEDADES COMPLETO
 * 
 * Painel de propriedades NOCODE que exibe e edita TODAS as informações configuráveis
 * de cada bloco/etapa do quiz, incluindo textos de configuração, valores dinâmicos
 * e suporte para interpolação (ex: {userName}).
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  Settings,
  Palette,
  Type,
  Layout,
  Zap,
  Eye,
  RotateCcw,
  Copy,
  Sparkles,
  Filter,
  Code,
  Info,
  AlertCircle,
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserName } from '@/hooks/useUserName';
import { useQuizResult } from '@/hooks/useQuizResult';
import EnhancedValidationSystem, { ValidationContext } from './EnhancedValidationSystem';
import type { Block } from '@/types/editor';

// ===== INTERFACES =====

interface NoCodePropertiesPanelProps {
  selectedBlock?: Block | null;
  currentStep?: number;
  totalSteps?: number;
  onUpdate?: (updates: Record<string, any>) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onReset?: () => void;
  onClose?: () => void;
  onStepChange?: (step: number) => void;
  previewMode?: boolean;
  onPreviewToggle?: (enabled: boolean) => void;
}

interface PropertyField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'boolean' | 'color' | 'range' | 'array' | 'object';
  category: PropertyCategory;
  value: any;
  defaultValue?: any;
  description?: string;
  placeholder?: string;
  options?: Array<{ value: any; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  isEditable: boolean;
  isAdvanced?: boolean;
  supportsInterpolation?: boolean;
  validation?: (value: any) => boolean | string;
}

enum PropertyCategory {
  CONTENT = 'content',
  STYLE = 'style', 
  LAYOUT = 'layout',
  BEHAVIOR = 'behavior',
  ADVANCED = 'advanced',
  ANIMATION = 'animation',
  ACCESSIBILITY = 'accessibility',
  SEO = 'seo'
}

interface InterpolationVariable {
  key: string;
  label: string;
  description: string;
  example: string;
  value: string;
}

// ===== INTERPOLATION SYSTEM =====

/**
 * Sistema de interpolação dinâmica para variáveis do quiz
 */
const useInterpolationSystem = () => {
  const userName = useUserName();
  const { primaryStyle } = useQuizResult();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [offerPrice, setOfferPrice] = useState('R$ 297,00');

  // Variáveis disponíveis para interpolação
  const availableVariables: InterpolationVariable[] = useMemo(() => [
    {
      key: 'userName',
      label: 'Nome do Usuário',
      description: 'Nome preenchido pelo usuário no quiz',
      example: 'Ana',
      value: userName || 'Usuário'
    },
    {
      key: 'resultStyle',
      label: 'Estilo Predominante',
      description: 'Resultado calculado do quiz de estilo',
      example: 'Clássico',
      value: primaryStyle?.style || 'Seu Estilo'
    },
    {
      key: 'quizStep',
      label: 'Etapa Atual',
      description: 'Número da etapa atual do quiz',
      example: '5',
      value: currentStep.toString()
    },
    {
      key: 'offerPrice',
      label: 'Preço da Oferta',
      description: 'Preço especial da consultoria',
      example: 'R$ 297,00',
      value: offerPrice
    },
    {
      key: 'resultPercentage',
      label: 'Porcentagem do Resultado',
      description: 'Porcentagem do estilo predominante',
      example: '85%',
      value: primaryStyle?.percentage ? `${Math.round(primaryStyle.percentage)}%` : '0%'
    }
  ], [userName, primaryStyle, currentStep, offerPrice]);

  // Interpolação de texto
  const interpolateText = useCallback((text: string): string => {
    if (!text || typeof text !== 'string') return text;

    let interpolated = text;
    availableVariables.forEach(variable => {
      const pattern = new RegExp(`\\{${variable.key}\\}`, 'g');
      interpolated = interpolated.replace(pattern, variable.value);
    });

    return interpolated;
  }, [availableVariables]);

  // Validação de interpolação
  const validateInterpolation = useCallback((text: string): { isValid: boolean; errors: string[] } => {
    if (!text || typeof text !== 'string') return { isValid: true, errors: [] };

    const errors: string[] = [];
    const variablePattern = /\{([^}]+)\}/g;
    const matches = Array.from(text.matchAll(variablePattern));

    matches.forEach(match => {
      const variableKey = match[1];
      const isValidVariable = availableVariables.some(v => v.key === variableKey);
      
      if (!isValidVariable) {
        errors.push(`Variável desconhecida: {${variableKey}}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [availableVariables]);

  return {
    availableVariables,
    interpolateText,
    validateInterpolation,
    setCurrentStep,
    setOfferPrice
  };
};

// ===== PROPERTY DISCOVERY =====

/**
 * Extrai todas as propriedades de um bloco recursivamente
 */
const extractAllProperties = (block: Block): PropertyField[] => {
  const properties: PropertyField[] = [];

  // Extrair propriedades do objeto properties
  if (block.properties) {
    Object.entries(block.properties).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        properties.push(createPropertyField(`properties.${key}`, key, value, block.type));
      }
    });
  }

  // Extrair propriedades do objeto content
  if (block.content) {
    Object.entries(block.content).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'children') {
        properties.push(createPropertyField(`content.${key}`, `Content ${key}`, value, block.type));
      }
    });
  }

  // Propriedades básicas do bloco
  const basicFields = [
    { key: 'id', value: block.id, label: 'ID do Bloco' },
    { key: 'type', value: block.type, label: 'Tipo' },
    { key: 'order', value: block.order, label: 'Ordem' }
  ];

  basicFields.forEach(field => {
    properties.push(createPropertyField(field.key, field.label, field.value, block.type, PropertyCategory.ADVANCED));
  });

  return properties;
};

/**
 * Cria um campo de propriedade baseado no valor e contexto
 */
const createPropertyField = (
  key: string, 
  label: string, 
  value: any, 
  blockType: string, 
  category?: PropertyCategory
): PropertyField => {
  const inferredType = inferFieldType(value);
  const inferredCategory = category || categorizeProperty(key, inferredType);
  
  return {
    key,
    label: formatLabel(label),
    type: inferredType,
    category: inferredCategory,
    value,
    defaultValue: getDefaultValue(inferredType),
    description: `Propriedade do bloco ${blockType}`,
    placeholder: getPlaceholder(label, inferredType),
    isEditable: true,
    isAdvanced: inferredCategory === PropertyCategory.ADVANCED,
    supportsInterpolation: inferredType === 'text' || inferredType === 'textarea',
    validation: getValidation(inferredType)
  };
};

/**
 * Infere o tipo de campo baseado no valor
 */
const inferFieldType = (value: any): PropertyField['type'] => {
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object' && value !== null) return 'object';
  
  const stringValue = String(value);
  
  // Detectar cores
  if (stringValue.match(/^#[0-9A-Fa-f]{6}$/) || 
      stringValue.match(/^rgb\(/) || 
      stringValue.match(/^hsl\(/)) {
    return 'color';
  }
  
  // Detectar texto longo
  if (stringValue.length > 100) {
    return 'textarea';
  }
  
  return 'text';
};

/**
 * Categoriza propriedades baseado na chave e tipo
 */
const categorizeProperty = (key: string, type: PropertyField['type']): PropertyCategory => {
  const keyLower = key.toLowerCase();
  
  if (keyLower.includes('text') || keyLower.includes('title') || 
      keyLower.includes('content') || keyLower.includes('label')) {
    return PropertyCategory.CONTENT;
  }
  
  if (keyLower.includes('color') || keyLower.includes('font') || 
      keyLower.includes('background') || type === 'color') {
    return PropertyCategory.STYLE;
  }
  
  if (keyLower.includes('width') || keyLower.includes('height') || 
      keyLower.includes('margin') || keyLower.includes('padding')) {
    return PropertyCategory.LAYOUT;
  }
  
  if (keyLower.includes('click') || keyLower.includes('hover') || 
      keyLower.includes('enable') || type === 'boolean') {
    return PropertyCategory.BEHAVIOR;
  }
  
  if (keyLower.includes('animation') || keyLower.includes('transition')) {
    return PropertyCategory.ANIMATION;
  }
  
  if (keyLower.includes('aria') || keyLower.includes('alt')) {
    return PropertyCategory.ACCESSIBILITY;
  }
  
  if (keyLower.includes('meta') || keyLower.includes('seo')) {
    return PropertyCategory.SEO;
  }
  
  return PropertyCategory.ADVANCED;
};

/**
 * Utilitários para propriedades
 */
const formatLabel = (label: string): string => {
  return label
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim();
};

const getDefaultValue = (type: PropertyField['type']): any => {
  switch (type) {
    case 'boolean': return false;
    case 'number': return 0;
    case 'array': return [];
    case 'object': return {};
    case 'color': return '#000000';
    default: return '';
  }
};

const getPlaceholder = (label: string, type: PropertyField['type']): string => {
  switch (type) {
    case 'text': return `Digite ${label.toLowerCase()}...`;
    case 'textarea': return `Conteúdo de ${label.toLowerCase()}...`;
    case 'number': return '0';
    case 'color': return '#000000';
    default: return '';
  }
};

const getValidation = (type: PropertyField['type']) => {
  switch (type) {
    case 'color':
      return (value: string) => {
        if (!value) return true;
        return /^#[0-9A-Fa-f]{6}$/.test(value) || 'Cor inválida (use formato #RRGGBB)';
      };
    default:
      return () => true;
  }
};

// ===== METADATA DAS CATEGORIAS =====

const CATEGORY_META = {
  [PropertyCategory.CONTENT]: {
    icon: Type,
    label: 'Conteúdo',
    description: 'Textos, títulos e mídia',
    color: 'text-blue-600'
  },
  [PropertyCategory.STYLE]: {
    icon: Palette,
    label: 'Estilo',
    description: 'Cores, fontes e aparência',
    color: 'text-purple-600'
  },
  [PropertyCategory.LAYOUT]: {
    icon: Layout,
    label: 'Layout',
    description: 'Tamanho, posição e espaçamento',
    color: 'text-green-600'
  },
  [PropertyCategory.BEHAVIOR]: {
    icon: Zap,
    label: 'Comportamento',
    description: 'Interações e regras',
    color: 'text-orange-600'
  },
  [PropertyCategory.ANIMATION]: {
    icon: Sparkles,
    label: 'Animação',
    description: 'Transições e efeitos',
    color: 'text-pink-600'
  },
  [PropertyCategory.ACCESSIBILITY]: {
    icon: Eye,
    label: 'Acessibilidade',
    description: 'Suporte a leitores de tela',
    color: 'text-indigo-600'
  },
  [PropertyCategory.SEO]: {
    icon: Search,
    label: 'SEO',
    description: 'Otimização para buscadores',
    color: 'text-teal-600'
  },
  [PropertyCategory.ADVANCED]: {
    icon: Settings,
    label: 'Avançado',
    description: 'Configurações técnicas',
    color: 'text-gray-600'
  }
};

// ===== COMPONENTE PRINCIPAL =====

export const NoCodePropertiesPanel: React.FC<NoCodePropertiesPanelProps> = ({
  selectedBlock,
  currentStep = 1,
  totalSteps = 21,
  onUpdate,
  onDelete,
  onDuplicate,
  onClose,
  previewMode = false,
  onPreviewToggle
}) => {
  // Estados locais
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeCategory, setActiveCategory] = useState<PropertyCategory>(PropertyCategory.CONTENT);
  const [tempValues, setTempValues] = useState<Record<string, any>>({});
  const [showInterpolationHelper, setShowInterpolationHelper] = useState(false);

  // Hooks de interpolação
  const {
    availableVariables,
    interpolateText,
    validateInterpolation,
    setCurrentStep: setInterpolationStep
  } = useInterpolationSystem();

  // Atualizar step para interpolação
  useEffect(() => {
    setInterpolationStep(currentStep);
  }, [currentStep, setInterpolationStep]);

  // Extrair propriedades do bloco selecionado
  const allProperties = useMemo(() => {
    if (!selectedBlock) return [];
    return extractAllProperties(selectedBlock);
  }, [selectedBlock]);

  // Propriedades filtradas
  const filteredProperties = useMemo(() => {
    let filtered = allProperties;

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(prop =>
        prop.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prop.description && prop.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrar por categoria ativa
    filtered = filtered.filter(prop => prop.category === activeCategory);

    // Filtrar propriedades avançadas se necessário
    if (!showAdvanced) {
      filtered = filtered.filter(prop => !prop.isAdvanced);
    }

    return filtered;
  }, [allProperties, searchTerm, activeCategory, showAdvanced]);

  // Propriedades agrupadas por categoria
  const propertiesByCategory = useMemo(() => {
    const grouped = new Map<PropertyCategory, PropertyField[]>();
    
    Object.values(PropertyCategory).forEach(category => {
      const categoryProps = allProperties.filter(prop => prop.category === category);
      if (categoryProps.length > 0) {
        grouped.set(category, categoryProps);
      }
    });

    return grouped;
  }, [allProperties]);

  // Handlers
  const handlePropertyChange = useCallback((key: string, value: any) => {
    setTempValues(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSaveChanges = useCallback(() => {
    if (onUpdate && Object.keys(tempValues).length > 0) {
      onUpdate(tempValues);
      setTempValues({});
    }
  }, [onUpdate, tempValues]);

  const handleDiscardChanges = useCallback(() => {
    setTempValues({});
  }, []);

  const handleResetToDefaults = useCallback(() => {
    if (!selectedBlock || !onUpdate) return;

    const defaults: Record<string, any> = {};
    allProperties.forEach(prop => {
      if (prop.defaultValue !== undefined) {
        defaults[prop.key] = prop.defaultValue;
      }
    });

    onUpdate(defaults);
    setTempValues({});
  }, [selectedBlock, allProperties, onUpdate]);

  const handleAutoFix = useCallback((propertyKey: string, value: any) => {
    handlePropertyChange(propertyKey, value);
  }, [handlePropertyChange]);

  // Contexto de validação
  const validationContext: ValidationContext = useMemo(() => ({
    propertyKey: '',
    propertyType: 'text',
    blockType: selectedBlock?.type || '',
    stepNumber: currentStep,
    availableVariables: availableVariables.map(v => v.key),
    otherProperties: { ...selectedBlock?.properties, ...selectedBlock?.content, ...tempValues }
  }), [selectedBlock, currentStep, availableVariables, tempValues]);

  const getCurrentValue = useCallback((property: PropertyField) => {
    return tempValues[property.key] !== undefined ? tempValues[property.key] : property.value;
  }, [tempValues]);

  // Renderizar campo de propriedade
  const renderPropertyField = useCallback((property: PropertyField) => {
    const currentValue = getCurrentValue(property);
    const hasChanges = tempValues[property.key] !== undefined;
    const validation = property.supportsInterpolation ? validateInterpolation(currentValue) : { isValid: true, errors: [] };

    const updateValue = (newValue: any) => {
      handlePropertyChange(property.key, newValue);
    };

    return (
      <div key={property.key} className="space-y-3 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              {property.label}
              {property.supportsInterpolation && (
                <Badge variant="outline" className="text-xs">
                  Interpolação
                </Badge>
              )}
              {hasChanges && (
                <Badge variant="default" className="text-xs">
                  Alterado
                </Badge>
              )}
            </Label>
            {property.description && (
              <p className="text-xs text-gray-500 mt-1">{property.description}</p>
            )}
          </div>
          
          {property.supportsInterpolation && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setShowInterpolationHelper(!showInterpolationHelper)}
                  >
                    <Code className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver variáveis disponíveis</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Campo de entrada */}
        <div className="space-y-2">
          {renderFieldInput(property, currentValue, updateValue, hasChanges)}
          
          {/* Validação */}
          {!validation.isValid && (
            <div className="flex items-center gap-1 text-red-600 text-xs">
              <AlertCircle className="w-3 h-3" />
              <span>{validation.errors[0]}</span>
            </div>
          )}

          {/* Preview interpolado */}
          {property.supportsInterpolation && currentValue && validation.isValid && (
            <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <div className="flex items-center gap-1 text-blue-600 mb-1">
                <Eye className="w-3 h-3" />
                <span className="font-medium">Preview:</span>
              </div>
              <div className="text-blue-800">{interpolateText(currentValue)}</div>
            </div>
          )}
        </div>
      </div>
    );
  }, [getCurrentValue, tempValues, handlePropertyChange, validateInterpolation, interpolateText, showInterpolationHelper]);

  // Renderizar input baseado no tipo
  const renderFieldInput = (
    property: PropertyField, 
    value: any, 
    onChange: (value: any) => void, 
    hasChanges: boolean
  ) => {
    const baseClassName = cn(hasChanges && 'border-blue-500 bg-blue-50');

    switch (property.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={property.placeholder}
            className={baseClassName}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={property.placeholder}
            className={cn('min-h-[80px]', baseClassName)}
          />
        );

      case 'number':
      case 'range':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            min={property.min}
            max={property.max}
            step={property.step}
            className={baseClassName}
          />
        );

      case 'boolean':
        return (
          <Switch
            checked={Boolean(value)}
            onCheckedChange={onChange}
          />
        );

      case 'color':
        return (
          <div className="flex gap-2">
            <Input
              type="color"
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className={cn('flex-1', baseClassName)}
            />
          </div>
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger className={baseClassName}>
              <SelectValue placeholder={`Selecione ${property.label}`} />
            </SelectTrigger>
            <SelectContent>
              {property.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'array':
        return (
          <div className="text-sm text-gray-500 p-2 border rounded">
            Array: {Array.isArray(value) ? value.length : 0} items
          </div>
        );

      case 'object':
        return (
          <div className="text-sm text-gray-500 p-2 border rounded">
            Object: {typeof value === 'object' && value ? Object.keys(value).length : 0} keys
          </div>
        );

      default:
        return (
          <Input
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={property.placeholder}
            className={baseClassName}
          />
        );
    }
  };

  // Estado sem bloco selecionado
  if (!selectedBlock) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center text-muted-foreground">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Nenhum Componente Selecionado</p>
          <p className="text-sm">
            Clique em um componente no canvas para editar suas propriedades
          </p>
        </CardContent>
      </Card>
    );
  }

  const hasUnsavedChanges = Object.keys(tempValues).length > 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Propriedades NOCODE
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {/* Preview toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={previewMode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPreviewToggle?.(!previewMode)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{previewMode ? 'Desativar' : 'Ativar'} Preview</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Close button */}
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            )}
          </div>
        </div>

        {/* Informações do bloco */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selectedBlock.type}</Badge>
            <span className="text-sm text-gray-600 truncate">{selectedBlock.id}</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Etapa {currentStep} de {totalSteps} • {allProperties.length} propriedades
          </div>
        </div>

        {/* Status de alterações */}
        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-700">
              {Object.keys(tempValues).length} alteração(ões) não salva(s)
            </span>
          </div>
        )}

        {/* Sistema de validação */}
        <EnhancedValidationSystem
          properties={{ ...selectedBlock.properties, ...selectedBlock.content, ...tempValues }}
          context={validationContext}
          onValidationChange={() => {}} // Placeholder function
          onAutoFix={handleAutoFix}
          className="mb-3"
        />

        {/* Busca e filtros */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar propriedades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-advanced"
                checked={showAdvanced}
                onCheckedChange={setShowAdvanced}
              />
              <Label htmlFor="show-advanced" className="text-sm">
                Mostrar Avançadas
              </Label>
            </div>
            <Badge variant="outline" className="text-xs">
              {filteredProperties.length} de {allProperties.length}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <Separator className="flex-shrink-0" />

      {/* Helper de interpolação */}
      {showInterpolationHelper && (
        <div className="p-4 bg-amber-50 border-b border-amber-200 flex-shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-4 h-4 text-amber-600" />
            <span className="font-medium text-amber-800">Variáveis Disponíveis</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {availableVariables.map(variable => (
              <div key={variable.key} className="text-sm">
                <code className="bg-white px-2 py-1 rounded border text-amber-700">
                  {`{${variable.key}}`}
                </code>
                <span className="text-amber-700 ml-2">{variable.description}</span>
                <span className="text-amber-600 ml-2 font-medium">→ {variable.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo com tabs */}
      <div className="flex-1 flex flex-col min-h-0">
        <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as PropertyCategory)}>
          {/* Category Tabs */}
          <div className="border-b px-4 py-2 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-4 gap-1">
              {Array.from(propertiesByCategory.keys()).slice(0, 4).map((category: PropertyCategory) => {
                const meta = CATEGORY_META[category];
                const Icon = meta.icon;
                const count = propertiesByCategory.get(category)?.length || 0;

                return (
                  <TabsTrigger
                    key={String(category)}
                    value={String(category)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{meta.label}</span>
                    <Badge variant="secondary" className="text-xs h-4 px-1">
                      {count}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Propriedades com scroll */}
          <ScrollArea className="flex-1">
            {Array.from(propertiesByCategory.keys()).map((category: PropertyCategory) => (
              <TabsContent key={String(category)} value={String(category)} className="mt-0">
                <div className="p-4 space-y-4">
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map(renderPropertyField)
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhuma propriedade encontrada</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </div>

      {/* Footer Actions */}
      <Separator className="flex-shrink-0" />
      <div className="p-4 space-y-2 flex-shrink-0">
        {/* Salvar/Descartar alterações */}
        {hasUnsavedChanges && (
          <div className="flex gap-2">
            <Button onClick={handleSaveChanges} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
            <Button variant="outline" onClick={handleDiscardChanges}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Ações rápidas */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetToDefaults}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Restaurar Padrões
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onDuplicate}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Duplicar
          </Button>
        </div>

        {/* Ação de deletar */}
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="w-full"
        >
          Excluir Componente
        </Button>
      </div>
    </div>
  );
};

export default NoCodePropertiesPanel;