/**
 * 📝 EDITOR PROPERTIES PANEL - PAINEL DE PROPRIEDADES UNIFICADO
 *
 * Painel central para edição de propriedades de blocos
 * Integra com o sistema de preview em tempo real
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import {
  ChevronDown,
  ChevronRight,
  Code,
  Copy,
  Eye,
  Info,
  Layout,
  MousePointer,
  Palette,
  RotateCcw,
  Save,
  Settings,
  Trash2,
  Type,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

export interface EditorPropertiesPanelProps {
  /** Bloco atualmente selecionado */
  selectedBlock: Block | null;
  /** Callback quando propriedades do bloco são atualizadas */
  onBlockUpdate: (blockId: string, updates: Partial<Block>) => void;
  /** Callback quando o bloco é duplicado */
  onBlockDuplicate?: (blockId: string) => void;
  /** Callback quando o bloco é deletado */
  onBlockDelete?: (blockId: string) => void;
  /** Modo de preview ativo */
  previewMode: boolean;
  /** Callback quando o preview é ativado/desativado */
  onPreviewToggle?: (enabled: boolean) => void;
  /** Propriedades disponíveis para o tipo de bloco */
  availableProperties?: PropertyConfig[];
  /** Classe CSS adicional */
  className?: string;
}

export interface PropertyConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'boolean' | 'color' | 'image';
  description?: string;
  options?: Array<{ value: string; label: string }>;
  defaultValue?: any;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
  category: 'content' | 'style' | 'behavior' | 'advanced';
}

interface PropertyCategory {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  expanded: boolean;
}

/**
 * 📝 Painel de Propriedades Unificado
 *
 * Permite editar todas as propriedades de um bloco em tempo real
 */
export const EditorPropertiesPanel: React.FC<EditorPropertiesPanelProps> = ({
  selectedBlock,
  onBlockUpdate,
  onBlockDuplicate,
  onBlockDelete,
  previewMode,
  onPreviewToggle,
  availableProperties = [],
  className,
}) => {
  // Estado local para controle de categorias expandidas
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['content', 'style'])
  );

  // Estado local para valores temporários (antes de salvar)
  const [tempValues, setTempValues] = useState<Record<string, any>>({});

  // Propriedades padrão baseadas no tipo de bloco
  const defaultProperties = useMemo((): PropertyConfig[] => {
    if (!selectedBlock) return [];

    const baseProperties: PropertyConfig[] = [
      {
        key: 'id',
        label: 'ID do Bloco',
        type: 'text',
        description: 'Identificador único do bloco',
        category: 'advanced',
        validation: { required: true },
      },
      {
        key: 'type',
        label: 'Tipo',
        type: 'select',
        description: 'Tipo do bloco',
        category: 'advanced',
        options: [
          { value: 'text', label: 'Texto' },
          { value: 'image', label: 'Imagem' },
          { value: 'button', label: 'Botão' },
          { value: 'form', label: 'Formulário' },
          { value: 'quiz-question', label: 'Questão Quiz' },
          { value: 'quiz-options', label: 'Opções Quiz' },
          { value: 'quiz-result', label: 'Resultado Quiz' },
        ],
      },
      {
        key: 'order',
        label: 'Ordem',
        type: 'number',
        description: 'Ordem de exibição do bloco',
        category: 'behavior',
        validation: { min: 0 },
      },
    ];

    // Propriedades específicas por tipo de bloco
    const typeSpecificProperties: Record<string, PropertyConfig[]> = {
      text: [
        {
          key: 'content.text',
          label: 'Texto',
          type: 'textarea',
          description: 'Conteúdo do texto',
          category: 'content',
          validation: { required: true },
        },
        {
          key: 'properties.fontSize',
          label: 'Tamanho da Fonte',
          type: 'select',
          category: 'style',
          options: [
            { value: 'text-sm', label: 'Pequeno' },
            { value: 'text-base', label: 'Normal' },
            { value: 'text-lg', label: 'Grande' },
            { value: 'text-xl', label: 'Extra Grande' },
            { value: 'text-2xl', label: 'XXL' },
          ],
        },
        {
          key: 'properties.textAlign',
          label: 'Alinhamento',
          type: 'select',
          category: 'style',
          options: [
            { value: 'text-left', label: 'Esquerda' },
            { value: 'text-center', label: 'Centro' },
            { value: 'text-right', label: 'Direita' },
          ],
        },
        {
          key: 'properties.color',
          label: 'Cor do Texto',
          type: 'color',
          category: 'style',
        },
      ],
      image: [
        {
          key: 'content.src',
          label: 'URL da Imagem',
          type: 'text',
          description: 'URL ou caminho da imagem',
          category: 'content',
          validation: { required: true },
        },
        {
          key: 'content.alt',
          label: 'Texto Alternativo',
          type: 'text',
          description: 'Descrição da imagem para acessibilidade',
          category: 'content',
        },
        {
          key: 'properties.width',
          label: 'Largura',
          type: 'select',
          category: 'style',
          options: [
            { value: 'w-auto', label: 'Automática' },
            { value: 'w-full', label: 'Completa' },
            { value: 'w-1/2', label: '50%' },
            { value: 'w-1/3', label: '33%' },
            { value: 'w-1/4', label: '25%' },
          ],
        },
        {
          key: 'properties.rounded',
          label: 'Bordas Arredondadas',
          type: 'boolean',
          category: 'style',
        },
      ],
      button: [
        {
          key: 'content.text',
          label: 'Texto do Botão',
          type: 'text',
          description: 'Texto exibido no botão',
          category: 'content',
          validation: { required: true },
        },
        {
          key: 'properties.variant',
          label: 'Variante',
          type: 'select',
          category: 'style',
          options: [
            { value: 'default', label: 'Padrão' },
            { value: 'outline', label: 'Contorno' },
            { value: 'secondary', label: 'Secundário' },
            { value: 'destructive', label: 'Destrutivo' },
          ],
        },
        {
          key: 'properties.size',
          label: 'Tamanho',
          type: 'select',
          category: 'style',
          options: [
            { value: 'sm', label: 'Pequeno' },
            { value: 'default', label: 'Normal' },
            { value: 'lg', label: 'Grande' },
          ],
        },
        {
          key: 'properties.onClick',
          label: 'Ação ao Clicar',
          type: 'select',
          category: 'behavior',
          options: [
            { value: 'nextStep', label: 'Próxima Etapa' },
            { value: 'prevStep', label: 'Etapa Anterior' },
            { value: 'submit', label: 'Enviar Formulário' },
            { value: 'custom', label: 'Ação Customizada' },
          ],
        },
      ],
    };

    return [
      ...baseProperties,
      ...(typeSpecificProperties[selectedBlock.type] || []),
      ...availableProperties,
    ];
  }, [selectedBlock, availableProperties]);

  // Agrupar propriedades por categoria
  const categorizedProperties = useMemo(() => {
    const categories: PropertyCategory[] = [
      { key: 'content', label: 'Conteúdo', icon: Type, expanded: true },
      { key: 'style', label: 'Estilo', icon: Palette, expanded: true },
      { key: 'behavior', label: 'Comportamento', icon: MousePointer, expanded: false },
      { key: 'advanced', label: 'Avançado', icon: Code, expanded: false },
    ];

    const grouped = categories.map(category => ({
      ...category,
      expanded: expandedCategories.has(category.key),
      properties: defaultProperties.filter(prop => prop.category === category.key),
    }));

    return grouped;
  }, [defaultProperties, expandedCategories]);

  // Obter valor atual de uma propriedade
  const getPropertyValue = useCallback(
    (property: PropertyConfig): any => {
      if (!selectedBlock) return property.defaultValue;

      // Verificar se há valor temporário
      if (tempValues[property.key] !== undefined) {
        return tempValues[property.key];
      }

      // Obter valor do bloco usando notação de ponto
      const keys = property.key.split('.');
      let value = selectedBlock as any;

      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) break;
      }

      return value !== undefined ? value : property.defaultValue;
    },
    [selectedBlock, tempValues]
  );

  // Atualizar valor temporário
  const updateTempValue = useCallback((property: PropertyConfig, value: any) => {
    setTempValues(prev => ({
      ...prev,
      [property.key]: value,
    }));
  }, []);

  // Salvar alterações
  const saveChanges = useCallback(() => {
    if (!selectedBlock || Object.keys(tempValues).length === 0) return;

    const updates: any = {};

    // Construir objeto de atualizações
    Object.entries(tempValues).forEach(([key, value]) => {
      const keys = key.split('.');
      let current = updates;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current)) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
    });

    onBlockUpdate(selectedBlock.id, updates);
    setTempValues({});
  }, [selectedBlock, tempValues, onBlockUpdate]);

  // Descartar alterações
  const discardChanges = useCallback(() => {
    setTempValues({});
  }, []);

  // Toggle categoria expandida
  const toggleCategory = useCallback((categoryKey: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryKey)) {
        newSet.delete(categoryKey);
      } else {
        newSet.add(categoryKey);
      }
      return newSet;
    });
  }, []);

  // Renderizar campo de propriedade
  const renderPropertyField = (property: PropertyConfig) => {
    const value = getPropertyValue(property);
    const hasChanges = tempValues[property.key] !== undefined;

    const updateValue = (newValue: any) => {
      updateTempValue(property, newValue);
    };

    switch (property.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={e => updateValue(e.target.value)}
            placeholder={property.label}
            className={cn(hasChanges && 'border-blue-500')}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={e => updateValue(e.target.value)}
            placeholder={property.label}
            className={cn('min-h-[80px]', hasChanges && 'border-blue-500')}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={e => updateValue(Number(e.target.value))}
            min={property.validation?.min}
            max={property.validation?.max}
            className={cn(hasChanges && 'border-blue-500')}
          />
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={updateValue}>
            <SelectTrigger className={cn(hasChanges && 'border-blue-500')}>
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

      case 'boolean':
        return <Switch checked={value || false} onCheckedChange={updateValue} />;

      case 'color':
        return (
          <div className="flex gap-2">
            <Input
              type="color"
              value={value || '#000000'}
              onChange={e => updateValue(e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              value={value || ''}
              onChange={e => updateValue(e.target.value)}
              placeholder="#000000"
              className={cn('flex-1', hasChanges && 'border-blue-500')}
            />
          </div>
        );

      default:
        return (
          <Input
            value={value || ''}
            onChange={e => updateValue(e.target.value)}
            placeholder={property.label}
            className={cn(hasChanges && 'border-blue-500')}
          />
        );
    }
  };

  if (!selectedBlock) {
    return (
      <Card className={cn('h-full flex flex-col', className)}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Propriedades
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Layout className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Selecione um bloco para editar suas propriedades</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasUnsavedChanges = Object.keys(tempValues).length > 0;

  return (
    <Card className={cn('h-full flex flex-col overflow-hidden', className)}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Propriedades
          </CardTitle>

          {/* Preview toggle */}
          <Button
            variant={previewMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPreviewToggle?.(!previewMode)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Info do bloco selecionado */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{selectedBlock.type}</Badge>
          <span className="text-sm text-gray-600 truncate">{selectedBlock.id}</span>
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
      </CardHeader>

      <Separator className="flex-shrink-0" />

      {/* Propriedades com scroll otimizado */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {categorizedProperties.map(category => (
              <div key={category.key}>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-2 h-auto"
                  onClick={() => toggleCategory(category.key)}
                >
                  <div className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    <span className="font-medium">{category.label}</span>
                    <Badge variant="outline" className="text-xs">
                      {category.properties.length}
                    </Badge>
                  </div>
                  {category.expanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>

                {category.expanded && (
                  <div className="mt-2 space-y-3 pl-4">
                    {category.properties.map(property => (
                      <div key={property.key} className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        {property.label}
                        {property.validation?.required && <span className="text-red-500">*</span>}
                      </Label>
                      {renderPropertyField(property)}
                      {property.description && (
                        <p className="text-xs text-gray-500">{property.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Ações */}
      <Separator />
      <div className="p-4 space-y-2">
        {/* Salvar/Descartar alterações */}
        {hasUnsavedChanges && (
          <div className="flex gap-2">
            <Button onClick={saveChanges} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button variant="outline" onClick={discardChanges}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Ações do bloco */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBlockDuplicate?.(selectedBlock.id)}
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-2" />
            Duplicar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBlockDelete?.(selectedBlock.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EditorPropertiesPanel;
