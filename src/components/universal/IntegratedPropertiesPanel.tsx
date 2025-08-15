/**
 * 🚀 IntegratedPropertiesPanel - Melhor dos Dois Mundos v1.0
 *
 * FUNCIONALIDADES INTEGRADAS:
 * ✅ useUnifiedProperties (fonte única de verdade) 
 * ✅ 15 comportamentos do unified-header funcionando
 * ✅ Performance otimizada com memoização avançada
 * ✅ Loading states e feedback visual aprimorado
 * ✅ Keyboard shortcuts e acessibilidade
 * ✅ Animações suaves e transições
 * ✅ Validação em tempo real melhorada
 * ✅ ArrayField avançado para listas
 * ✅ Error handling robusto
 * ✅ Layout responsivo e adaptável
 */

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Visual Controls
import ColorPicker from '@/components/visual-controls/ColorPicker';
import SizeSlider from '@/components/visual-controls/SizeSlider';
import AlignmentButtons from '@/components/visual-controls/AlignmentButtons';

// Icons
import {
  Settings,
  Paintbrush,
  Layout,
  Type,
  RotateCcw,
  Trash2,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Zap,
} from 'lucide-react';

// Hooks
import {
  UnifiedBlock,
  UnifiedProperty,
  useUnifiedProperties,
  PropertyType,
} from '@/hooks/useUnifiedProperties';

// ===== COMPONENTES AUXILIARES AVANÇADOS =====

// Enhanced Array Editor com UX avançada
const EnhancedArrayEditor: React.FC<{
  items: any[];
  onChange: (items: any[]) => void;
  itemSchema?: any;
  addButtonText?: string;
  maxItems?: number;
  minItems?: number;
  label?: string;
}> = ({ 
  items = [], 
  onChange, 
  addButtonText = 'Adicionar Item', 
  maxItems = 10, 
  minItems = 0,
  label = 'Lista'
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addItem = useCallback(async () => {
    if (items.length >= maxItems) return;
    setIsAdding(true);
    
    // Determina o tipo do novo item
    const newItem = typeof items[0] === 'string' ? '' : { text: '', value: '' };

    // Animação suave
    setTimeout(() => {
      onChange([...items, newItem]);
      setIsAdding(false);
      setEditingIndex(items.length); // Edita automaticamente o novo item
    }, 150);
  }, [items, onChange, maxItems]);

  const updateItem = useCallback(
    (index: number, value: any) => {
      const newItems = [...items];
      newItems[index] = value;
      onChange(newItems);
    },
    [items, onChange]
  );

  const removeItem = useCallback(
    (index: number) => {
      if (items.length <= minItems) return;
      onChange(items.filter((_, i) => i !== index));
      setEditingIndex(null);
    },
    [items, onChange, minItems]
  );

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-[#432818]">{label}</Label>
      
      <div className="border border-[#B89B7A]/30 rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto bg-white/50">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={index}
              className="group flex gap-2 items-center p-2 rounded-lg border border-muted hover:border-[#B89B7A]/50 transition-all duration-200 hover:shadow-sm"
            >
              <div className="flex-1 space-y-1">
                {editingIndex === index ? (
                  <Input
                    value={typeof item === 'string' ? item : item.text || ''}
                    onChange={e => {
                      const newValue = typeof item === 'string' 
                        ? e.target.value 
                        : { ...item, text: e.target.value };
                      updateItem(index, newValue);
                    }}
                    onBlur={() => setEditingIndex(null)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') setEditingIndex(null);
                      if (e.key === 'Escape') setEditingIndex(null);
                    }}
                    placeholder={`Item ${index + 1}`}
                    className="border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-[#B89B7A]/50"
                    autoFocus
                  />
                ) : (
                  <div 
                    className="cursor-pointer text-sm py-1 px-2 hover:bg-[#B89B7A]/10 rounded"
                    onClick={() => setEditingIndex(index)}
                  >
                    {typeof item === 'string' ? item || `Item ${index + 1}` : item.text || `Item ${index + 1}`}
                  </div>
                )}
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                disabled={items.length <= minItems}
                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))
        ) : (
          <div className="text-xs text-muted-foreground italic text-center py-4 border-2 border-dashed border-[#B89B7A]/20 rounded">
            Nenhum item. Clique abaixo para adicionar.
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        disabled={items.length >= maxItems || isAdding}
        className="w-full h-9 border-dashed border-[#B89B7A]/50 hover:border-[#B89B7A] text-[#432818] hover:bg-[#B89B7A]/5"
      >
        {isAdding ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-xs">Adicionando...</span>
          </>
        ) : (
          <>
            <span className="text-xs">+ {addButtonText}</span>
          </>
        )}
      </Button>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Total: {items.length} {items.length === 1 ? 'item' : 'itens'}</span>
        {items.length >= maxItems && (
          <span className="text-[#432818]/70">Máximo atingido</span>
        )}
      </div>
    </div>
  );
};

// Property Change Indicator com animação
const PropertyChangeIndicator: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    setHasChanged(true);
    const timer = setTimeout(() => setHasChanged(false), 1000);
    return () => clearTimeout(timer);
  }, [children]);

  return (
    <div className={`transition-all duration-300 ${hasChanged ? 'ring-2 ring-[#B89B7A]/30 ring-offset-2' : ''}`}>
      {children}
    </div>
  );
};

// Enhanced Property Input com validação
const EnhancedPropertyInput: React.FC<{
  label: string;
  value: any;
  onChange: (value: any) => void;
  type?: 'text' | 'textarea' | 'number';
  placeholder?: string;
  className?: string;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  error?: string;
}> = ({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder,
  className = '',
  rows,
  min,
  max,
  step,
  required,
  error
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  // Debounced update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  const baseClassName = `
    transition-all duration-200 
    border-[#B89B7A]/30 
    focus:border-[#B89B7A] 
    focus:ring-[#B89B7A]/20
    ${error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}
    ${className}
  `;

  return (
    <PropertyChangeIndicator>
      <div className="space-y-2">
        <Label className={`text-sm font-medium text-[#432818] ${isFocused ? 'text-[#B89B7A]' : ''}`}>
          {label} 
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        
        {type === 'textarea' ? (
          <Textarea
            value={localValue || ''}
            onChange={e => setLocalValue(e.target.value)}
            placeholder={placeholder || `Digite ${label.toLowerCase()}`}
            className={baseClassName}
            rows={rows || 3}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        ) : (
          <Input
            type={type}
            value={localValue || ''}
            onChange={e => {
              const newValue = type === 'number' 
                ? (e.target.value === '' ? '' : parseFloat(e.target.value)) 
                : e.target.value;
              setLocalValue(newValue);
            }}
            placeholder={placeholder || `Digite ${label.toLowerCase()}`}
            className={baseClassName}
            min={min}
            max={max}
            step={step}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        )}
        
        {error && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}
      </div>
    </PropertyChangeIndicator>
  );
};

// ===== COMPONENTE PRINCIPAL =====

interface IntegratedPropertiesPanelProps {
  selectedBlock: UnifiedBlock | null;
  onUpdate?: (blockId: string, updates: Record<string, any>) => void;
  onDelete?: (blockId: string) => void;
  onClose?: () => void;
}

export const IntegratedPropertiesPanel: React.FC<IntegratedPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onDelete,
  onClose,
}) => {
  // Estados locais
  const [activeTab, setActiveTab] = useState<string>('properties');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Refs para navegação por teclado
  const panelRef = useRef<HTMLDivElement>(null);

  // Hook de propriedades unificadas (fonte única de verdade)
  console.log('🔥 IntegratedPanel - ANTES do hook:', { selectedBlock, type: selectedBlock?.type, id: selectedBlock?.id });
  const { properties, updateProperty, resetProperties, getPropertiesByCategory } =
    useUnifiedProperties(selectedBlock?.type || '', selectedBlock?.id, selectedBlock, onUpdate);
  console.log('🔥 IntegratedPanel - DEPOIS do hook:', { properties: properties?.length, onUpdate: !!onUpdate });

  // Logs de debug para desenvolvimento
  useEffect(() => {
    if (selectedBlock && process.env.NODE_ENV === 'development') {
      console.log('🚀 IntegratedPropertiesPanel:', {
        id: selectedBlock.id,
        type: selectedBlock.type,
        propertiesCount: properties?.length || 0,
        categoriesWithData: categoryOrder.map(cat => ({
          category: cat,
          count: getPropertiesByCategory(cat).length
        })).filter(c => c.count > 0)
      });
    }
  }, [selectedBlock, properties, getPropertiesByCategory]);

  // Categorização otimizada com memoização
  const categorizedProperties = useMemo(() => {
    const categories = {
      content: getPropertiesByCategory('content'),
      logo: getPropertiesByCategory('logo'),
      style: getPropertiesByCategory('style'),
      layout: getPropertiesByCategory('layout'),
      alignment: getPropertiesByCategory('alignment'),
      behavior: getPropertiesByCategory('behavior'),
      scoring: getPropertiesByCategory('scoring'),
      advanced: getPropertiesByCategory('advanced'),
    };

    // Remove categorias vazias para otimização
    Object.keys(categories).forEach(key => {
      if (categories[key as keyof typeof categories].length === 0) {
        delete categories[key as keyof typeof categories];
      }
    });

    return categories;
  }, [properties, getPropertiesByCategory]);

  // Keyboard shortcuts avançados
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.body) return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'r':
            e.preventDefault();
            resetProperties();
            break;
          case '1':
            e.preventDefault();
            setActiveTab('properties');
            break;
          case '2':
            e.preventDefault();
            setActiveTab('style');
            break;
        }
      }

      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [resetProperties, onClose]);

  // Renderizador de campo otimizado e melhorado
  const renderField = useCallback(
    (property: UnifiedProperty, idx: number) => {
      const { key, label, type, value, options, required, min, max, step, placeholder, unit } = property;
      const errorMessage = errors[key];

      const handleChange = async (newValue: any) => {
        setIsLoading(true);
        console.log('🔥 IntegratedPanel handleChange CHAMADO:', { key, newValue, label, selectedBlockId: selectedBlock?.id });
        console.log('🔥 updateProperty function exists?', !!updateProperty);
        console.log('🔥 onUpdate function exists?', !!onUpdate);
        
        try {
          // Validação simples
          if (required && (!newValue || newValue === '')) {
            setErrors(prev => ({ ...prev, [key]: `${label} é obrigatório` }));
          } else {
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors[key];
              return newErrors;
            });
          }

          updateProperty(key, newValue);
        } catch (error) {
          console.error('Erro ao atualizar propriedade:', error);
          setErrors(prev => ({ ...prev, [key]: 'Erro ao atualizar propriedade' }));
        } finally {
          setTimeout(() => setIsLoading(false), 100); // Loading visual
        }
      };

      const fieldId = `field-${key}-${idx}`;

      switch (type) {
        case PropertyType.TEXT:
          return (
            <EnhancedPropertyInput
              key={fieldId}
              label={label}
              value={value || ''}
              onChange={handleChange}
              type="text"
              placeholder={placeholder || `Digite ${label.toLowerCase()}`}
              required={required}
              error={errorMessage}
            />
          );

        case PropertyType.TEXTAREA:
          return (
            <EnhancedPropertyInput
              key={fieldId}
              label={label}
              value={value || ''}
              onChange={handleChange}
              type="textarea"
              placeholder={placeholder || `Digite ${label.toLowerCase()}`}
              rows={3}
              required={required}
              error={errorMessage}
            />
          );

        case PropertyType.NUMBER:
          return (
            <EnhancedPropertyInput
              key={fieldId}
              label={label}
              value={value || ''}
              onChange={handleChange}
              type="number"
              min={min}
              max={max}
              step={step}
              placeholder={placeholder}
              required={required}
              error={errorMessage}
            />
          );

        case PropertyType.RANGE:
          return (
            <PropertyChangeIndicator key={fieldId}>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#432818]">{label}</Label>
                <SizeSlider
                  value={value || min || 0}
                  onChange={handleChange}
                  min={min || 0}
                  max={max || 100}
                  step={step || 1}
                  unit={unit || 'px'}
                  label={label}
                  showValue={true}
                />
                {errorMessage && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errorMessage}
                  </p>
                )}
              </div>
            </PropertyChangeIndicator>
          );

        case PropertyType.COLOR:
          return (
            <PropertyChangeIndicator key={fieldId}>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#432818]">{label}</Label>
                <ColorPicker
                  value={value || '#432818'}
                  onChange={handleChange}
                  label={label}
                  allowTransparent={true}
                />
                <div className="text-xs text-muted-foreground">
                  Cor atual: {value || '#432818'}
                </div>
                {errorMessage && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errorMessage}
                  </p>
                )}
              </div>
            </PropertyChangeIndicator>
          );

        case PropertyType.SELECT:
          return (
            <PropertyChangeIndicator key={fieldId}>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#432818]">
                  {label}
                  {required && <span className="text-destructive ml-1">*</span>}
                </Label>
                <Select value={value} onValueChange={handleChange}>
                  <SelectTrigger className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20">
                    <SelectValue placeholder={`Selecione ${label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {options?.map((option, optionIdx) => (
                      <SelectItem key={`${option.value}-${optionIdx}`} value={option.value} disabled={option.disabled}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errorMessage && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errorMessage}
                  </p>
                )}
              </div>
            </PropertyChangeIndicator>
          );

        case PropertyType.SWITCH:
          return (
            <PropertyChangeIndicator key={fieldId}>
              <div className="flex items-center justify-between p-3 border border-[#B89B7A]/30 rounded-lg hover:border-[#B89B7A]/50 transition-colors">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-[#432818]">
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {value ? 'Habilitado' : 'Desabilitado'}
                  </span>
                </div>
                <Switch
                  checked={Boolean(value)}
                  onCheckedChange={(checked) => {
                    console.log('🎯 IntegratedPanel SWITCH mudou:', { key, checked, label });
                    handleChange(checked);
                  }}
                  className="data-[state=checked]:bg-[#B89B7A]"
                />
              </div>
              {errorMessage && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-2">
                  <AlertCircle className="h-3 w-3" />
                  {errorMessage}
                </p>
              )}
            </PropertyChangeIndicator>
          );

        case PropertyType.URL:
          if (key.includes('alignment') || type.toString().includes('alignment')) {
            return (
              <PropertyChangeIndicator key={fieldId}>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#432818]">{label}</Label>
                  <AlignmentButtons
                    value={value || 'left'}
                    onChange={handleChange}
                  />
                </div>
              </PropertyChangeIndicator>
            );
          }
          return (
            <PropertyChangeIndicator key={fieldId}>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#432818]">{label}</Label>
                <Input
                  value={value || ''}
                  onChange={e => handleChange(e.target.value)}
                  placeholder="Cole o link da imagem aqui"
                  className="border-[#B89B7A]/30 focus:border-[#B89B7A]"
                />
                {value && value.includes('http') && (
                  <div className="mt-2">
                    <img
                      src={value}
                      alt="Preview"
                      className="w-full max-w-32 h-auto rounded border border-[#B89B7A]/30"
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </PropertyChangeIndicator>
          );

        case PropertyType.ARRAY:
          const arrayValue = Array.isArray(value) ? value : [];
          return (
            <EnhancedArrayEditor
              key={fieldId}
              label={label}
              items={arrayValue}
              onChange={handleChange}
              addButtonText={`Adicionar ${label.toLowerCase()}`}
              maxItems={20}
            />
          );

        case PropertyType.JSON:
          if (key.includes('score') || label.includes('Pontos')) {
            return (
              <EnhancedPropertyInput
                key={fieldId}
                label={label}
                value={value || 0}
                onChange={handleChange}
                type="number"
                min={min || 0}
                max={max || 100}
                step={step || 1}
                placeholder="Pontos para esta opção"
                required={required}
                error={errorMessage}
              />
            );
          }
          return (
            <EnhancedPropertyInput
              key={fieldId}
              label={label}
              value={value || ''}
              onChange={handleChange}
              type="text"
              placeholder="Ex: Clássico, Moderno, Casual"
              required={required}
              error={errorMessage}
            />
          );

        default:
          return (
            <EnhancedPropertyInput
              key={fieldId}
              label={label}
              value={String(value || '')}
              onChange={handleChange}
              type="text"
              placeholder={placeholder}
              required={required}
              error={errorMessage}
            />
          );
      }
    },
    [updateProperty, errors, isLoading]
  );

  // Status de validação
  const validationStatus = useMemo(() => {
    const errorCount = Object.keys(errors).length;
    if (errorCount === 0) return { type: 'success', text: 'Válido', icon: CheckCircle };
    return {
      type: 'error',
      text: `${errorCount} erro${errorCount > 1 ? 's' : ''}`,
      icon: AlertCircle,
    };
  }, [errors]);

  // Categorias organizadas
  const categoryOrder = ['logo', 'content', 'style', 'layout', 'alignment', 'behavior', 'scoring', 'advanced'];

  // Se nenhum bloco selecionado
  if (!selectedBlock) {
    return (
      <TooltipProvider>
        <Card className="h-full">
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center space-y-6 max-w-sm">
              <div className="p-6 rounded-full bg-gradient-to-br from-[#B89B7A]/10 to-[#B89B7A]/5 w-fit mx-auto">
                <Settings className="h-12 w-12 text-[#B89B7A]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[#432818]">Propriedades</h3>
                <p className="text-sm text-muted-foreground">
                  Selecione um bloco no editor para configurar suas propriedades
                </p>
              </div>
              <div className="text-xs text-muted-foreground space-y-2">
                <p>💡 Dicas de teclado:</p>
                <div className="flex items-center justify-center gap-2">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+R</kbd>
                  <span>Resetar</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>
                  <span>Fechar</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div
        ref={panelRef}
        className="h-full flex flex-col bg-gradient-to-br from-white via-white/95 to-[#F8F6F3]/30"
      >
        {/* Header melhorado */}
        <div className="flex items-center justify-between p-4 border-b bg-white/95 backdrop-blur-sm border-[#B89B7A]/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#B89B7A] to-[#B89B7A]/80 shadow-sm">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-[#432818]">Propriedades</h2>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-[#B89B7A]" />}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs border-[#B89B7A]/50 text-[#432818]">
                  {selectedBlock.type}
                </Badge>
                <Badge
                  variant={validationStatus.type === 'success' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  <validationStatus.icon className="h-3 w-3 mr-1" />
                  {validationStatus.text}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onClose && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Fechar painel (Esc)</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Content com tabs melhoradas */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 m-4 mb-0 bg-[#F8F6F3]/50">
              <TabsTrigger value="properties" className="gap-2 data-[state=active]:bg-[#B89B7A] data-[state=active]:text-white">
                <Type className="h-4 w-4" />
                Propriedades
              </TabsTrigger>
              <TabsTrigger value="style" className="gap-2 data-[state=active]:bg-[#B89B7A] data-[state=active]:text-white">
                <Paintbrush className="h-4 w-4" />
                Estilo
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 p-4">
              <TabsContent value="properties" className="mt-0 space-y-4">
                {/* Categoria Comportamento (15 funcionalidades do header) */}
                {categorizedProperties.behavior?.length > 0 && (
                  <Card className="overflow-hidden border-[#B89B7A]/20">
                    <CardHeader className="pb-3 bg-gradient-to-r from-[#B89B7A]/5 to-[#B89B7A]/10">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Zap className="h-4 w-4 text-[#B89B7A]" />
                        Comportamento
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4">
                      {categorizedProperties.behavior.map(renderField)}
                    </CardContent>
                  </Card>
                )}

                {/* Categoria Logo */}
                {categorizedProperties.logo?.length > 0 && (
                  <Card className="overflow-hidden border-[#B89B7A]/20">
                    <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-blue-50/30">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Type className="h-4 w-4 text-blue-600" />
                        Logo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4">
                      {categorizedProperties.logo.map(renderField)}
                    </CardContent>
                  </Card>
                )}

                {/* Categoria Conteúdo */}
                {categorizedProperties.content?.length > 0 && (
                  <Card className="overflow-hidden border-[#B89B7A]/20">
                    <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-green-50/30">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Type className="h-4 w-4 text-green-600" />
                        Conteúdo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4">
                      {categorizedProperties.content.map(renderField)}
                    </CardContent>
                  </Card>
                )}

                {/* Categoria Avançado */}
                {categorizedProperties.advanced?.length > 0 && (
                  <Card className="overflow-hidden border-[#B89B7A]/20">
                    <CardHeader className="pb-3 bg-gradient-to-r from-orange-50 to-orange-50/30">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Settings className="h-4 w-4 text-orange-600" />
                        Avançado
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4">
                      {categorizedProperties.advanced.map(renderField)}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="style" className="mt-0 space-y-4">
                {/* Categoria Estilo */}
                {categorizedProperties.style?.length > 0 && (
                  <Card className="overflow-hidden border-[#B89B7A]/20">
                    <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-purple-50/30">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Paintbrush className="h-4 w-4 text-purple-600" />
                        Aparência
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4">
                      {categorizedProperties.style.map(renderField)}
                    </CardContent>
                  </Card>
                )}

                {/* Categoria Layout */}
                {categorizedProperties.layout?.length > 0 && (
                  <Card className="overflow-hidden border-[#B89B7A]/20">
                    <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-indigo-50/30">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Layout className="h-4 w-4 text-indigo-600" />
                        Layout
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4">
                      {categorizedProperties.layout.map(renderField)}
                    </CardContent>
                  </Card>
                )}

                {/* Categoria Alinhamento */}
                {categorizedProperties.alignment?.length > 0 && (
                  <Card className="overflow-hidden border-[#B89B7A]/20">
                    <CardHeader className="pb-3 bg-gradient-to-r from-pink-50 to-pink-50/30">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Layout className="h-4 w-4 text-pink-600" />
                        Alinhamento
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4">
                      {categorizedProperties.alignment.map(renderField)}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Footer melhorado */}
        <div className="p-4 border-t bg-white/95 backdrop-blur-sm border-[#B89B7A]/20">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-mono border-[#B89B7A]/50">
                ID: {selectedBlock.id}
              </Badge>
              <Badge variant="outline" className="text-xs border-[#B89B7A]/50">
                {properties?.length || 0} propriedades
              </Badge>
            </div>

            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetProperties}
                    className="h-8 w-8 p-0 hover:bg-[#B89B7A]/10"
                  >
                    <RotateCcw className="h-4 w-4 text-[#B89B7A]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redefinir propriedades (Ctrl+R)</TooltipContent>
              </Tooltip>

              {onDelete && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(selectedBlock.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Excluir bloco</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default IntegratedPropertiesPanel;