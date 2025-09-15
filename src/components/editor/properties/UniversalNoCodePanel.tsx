/**
 * 🎨 PAINEL UNIVERSAL NOCODE
 *
 * Interface principal para edição de propriedades com:
 * - Extração automática de todas as propriedades
 * - Sistema de interpolação visual
 * - Categorização inteligente
 * - Validação em tempo real
 * - Preview instantâneo
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search,
  Filter,
  RotateCcw,
  Copy,
  Trash2,
  Settings,
  Paintbrush,
  Layout,
  Zap,
  Shield,
  Code,
  Info,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Block } from '@/types/editor';
import { 
  PropertyField,
  CategorizedProperties,
  propertyExtractionService
} from '@/services/PropertyExtractionService';
import { InterpolationField } from './InterpolationSystem';
import { OptionsArrayEditor } from './OptionsArrayEditor';
import { ConditionalFieldsWrapper } from './ConditionalFieldsWrapper';
import { PropertyPreview } from './PropertyPreview';

interface UniversalNoCodePanelProps {
  selectedBlock?: Block | null;
  activeStageId: string;
  allBlocks?: Block[];
  onUpdate: (blockId: string, updates: Record<string, any>) => void;
  onDuplicate?: (blockId: string) => void;
  onDelete?: (blockId: string) => void;
  onReset?: (blockId: string) => void;
}

export const UniversalNoCodePanel: React.FC<UniversalNoCodePanelProps> = ({
  selectedBlock,
  activeStageId,
  onUpdate,
  onDuplicate,
  onDelete,
  onReset
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('content');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Extrair e categorizar propriedades
  const { extractedProperties, categorizedProperties } = useMemo(() => {
    if (!selectedBlock) {
      return { extractedProperties: [], categorizedProperties: {} };
    }

    const extracted = propertyExtractionService.extractAllProperties(selectedBlock);
    const withInterpolation = propertyExtractionService.identifyInterpolationFields(extracted);
    const categorized = propertyExtractionService.categorizeProperties(withInterpolation);

    return { 
      extractedProperties: withInterpolation,
      categorizedProperties: categorized 
    };
  }, [selectedBlock]);

  // Filtrar propriedades baseado na busca
  const filteredProperties = useMemo(() => {
    const filtered: CategorizedProperties = {};

    Object.entries(categorizedProperties).forEach(([category, properties]) => {
      const matchingProps = properties.filter(prop => {
        const matchesSearch = !searchQuery || 
          prop.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prop.key.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesAdvanced = showAdvanced || !prop.isAdvanced;

        return matchesSearch && matchesAdvanced;
      });

      if (matchingProps.length > 0) {
        filtered[category] = matchingProps;
      }
    });

    return filtered;
  }, [categorizedProperties, searchQuery, showAdvanced]);

  // Estatísticas do bloco
  const blockStats = useMemo(() => {
    const totalProps = extractedProperties.length;
    const requiredProps = extractedProperties.filter(p => p.isRequired).length;
    const interpolatedProps = extractedProperties.filter(p => p.supportsInterpolation).length;
    const categories = Object.keys(categorizedProperties).length;

    return { totalProps, requiredProps, interpolatedProps, categories };
  }, [extractedProperties, categorizedProperties]);

  // Atualizar propriedade
  const handlePropertyUpdate = useCallback((property: PropertyField, newValue: any) => {
    if (!selectedBlock) return;

    const updates: Record<string, any> = {};
    
    // Tratar propriedades aninhadas (ex: content.title)
    if (property.key.includes('.')) {
      const [parent, child] = property.key.split('.');
      const parentData = (selectedBlock as any)[parent] || {};
      updates[parent] = {
        ...parentData,
        [child]: newValue
      };
    } else {
      updates[property.key] = newValue;
    }

    onUpdate(selectedBlock.id, updates);
  }, [selectedBlock, onUpdate]);

  // Toggle categoria colapsada
  const toggleCategory = useCallback((category: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  }, [collapsedCategories]);

  if (!selectedBlock) {
    return (
      <Card className="h-full p-6">
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Settings className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Nenhum Bloco Selecionado</h3>
            <p className="text-sm text-muted-foreground">
              Selecione um bloco no canvas para editar suas propriedades
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Header com informações do bloco */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{selectedBlock.type}</Badge>
            <Badge variant="secondary">{activeStageId}</Badge>
          </div>
          <div className="flex items-center gap-1">
            {onDuplicate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDuplicate(selectedBlock.id)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReset?.(selectedBlock.id)}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(selectedBlock.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-muted-foreground">
            {blockStats.totalProps} propriedades
          </div>
          <div className="text-muted-foreground">
            {blockStats.categories} categorias
          </div>
          <div className="text-muted-foreground">
            {blockStats.requiredProps} obrigatórias
          </div>
          <div className="text-muted-foreground">
            {blockStats.interpolatedProps} dinâmicas
          </div>
        </div>

        {/* Busca e filtros */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar propriedades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                id="show-advanced"
                checked={showAdvanced}
                onCheckedChange={setShowAdvanced}
              />
              <Label htmlFor="show-advanced" className="text-xs">
                Avançadas
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs por categoria */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="content" className="text-xs">
            <Info className="w-3 h-3 mr-1" />
            Conteúdo
          </TabsTrigger>
          <TabsTrigger value="style" className="text-xs">
            <Paintbrush className="w-3 h-3 mr-1" />
            Estilo
          </TabsTrigger>
          <TabsTrigger value="layout" className="text-xs">
            <Layout className="w-3 h-3 mr-1" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="behavior" className="text-xs">
            <Zap className="w-3 h-3 mr-1" />
            Ação
          </TabsTrigger>
          <TabsTrigger value="validation" className="text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Validação
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo das tabs com preview sidebar */}
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 min-w-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {Object.entries(filteredProperties).map(([category, properties]) => {
                  if (selectedCategory !== 'all' && category !== selectedCategory) return null;
                  
                  return (
                    <CategorySection
                      key={category}
                      category={category}
                      properties={properties}
                      allProperties={extractedProperties}
                      isCollapsed={collapsedCategories.has(category)}
                      onToggle={() => toggleCategory(category)}
                      onPropertyUpdate={handlePropertyUpdate}
                    />
                  );
                })}
                
                {Object.keys(filteredProperties).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Filter className="w-8 h-8 mx-auto mb-2" />
                    <p>Nenhuma propriedade encontrada</p>
                    <p className="text-xs">Tente ajustar os filtros</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Preview sidebar para options-grid */}
          {selectedBlock?.type === 'options-grid' && (
            <div className="w-80 border-l bg-muted/20">
              <PropertyPreview
                block={selectedBlock}
                properties={extractedProperties}
              />
            </div>
          )}
        </div>
      </Tabs>
    </Card>
  );
};

/**
 * Seção de categoria de propriedades
 */
const CategorySection: React.FC<{
  category: string;
  properties: PropertyField[];
  allProperties: PropertyField[];
  isCollapsed: boolean;
  onToggle: () => void;
  onPropertyUpdate: (property: PropertyField, value: any) => void;
}> = ({ category, properties, allProperties, isCollapsed, onToggle, onPropertyUpdate }) => {
  const categoryInfo = getCategoryInfo(category);

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="w-full justify-between p-2 h-auto"
      >
        <div className="flex items-center gap-2">
          <categoryInfo.icon className="w-4 h-4" />
          <span className="font-medium">{categoryInfo.label}</span>
          <Badge variant="secondary" className="text-xs">
            {properties.length}
          </Badge>
        </div>
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>

      {!isCollapsed && (
        <div className="space-y-3 pl-4">
          {properties.map(property => (
            <ConditionalFieldsWrapper
              key={property.key}
              property={property}
              allProperties={allProperties}
            >
              <PropertyEditor
                property={property}
                onUpdate={onPropertyUpdate}
              />
            </ConditionalFieldsWrapper>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Editor individual de propriedade
 */
const PropertyEditor: React.FC<{
  property: PropertyField;
  onUpdate: (property: PropertyField, value: any) => void;
}> = ({ property, onUpdate }) => {
  const handleChange = useCallback((value: any) => {
    onUpdate(property, value);
  }, [property, onUpdate]);

  // Renderizar campo baseado no tipo
  switch (property.type) {
    case 'interpolated-text':
      return (
        <InterpolationField
          label={property.label}
          value={property.value || ''}
          onChange={handleChange}
          availableVariables={property.availableVariables}
          placeholder={property.placeholder}
          description={property.description}
          multiline={property.key.includes('content') || property.key.includes('description')}
          required={property.isRequired}
        />
      );

    case 'textarea':
      return (
        <div className="space-y-1">
          <Label className="text-sm">{property.label}</Label>
          <Textarea
            value={property.value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={property.placeholder}
            className="min-h-[80px]"
          />
          {property.description && (
            <p className="text-xs text-muted-foreground">{property.description}</p>
          )}
        </div>
      );

    case 'boolean':
      return (
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm">{property.label}</Label>
            {property.description && (
              <p className="text-xs text-muted-foreground">{property.description}</p>
            )}
          </div>
          <Switch
            checked={!!property.value}
            onCheckedChange={handleChange}
          />
        </div>
      );

    case 'number':
    case 'range':
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">{property.label}</Label>
            <span className="text-xs text-muted-foreground">{property.value}</span>
          </div>
          <Slider
            value={[property.value || 0]}
            onValueChange={([value]) => handleChange(value)}
            min={property.min || 0}
            max={property.max || 100}
            step={property.step || 1}
          />
          {property.description && (
            <p className="text-xs text-muted-foreground">{property.description}</p>
          )}
        </div>
      );

    case 'select':
      return (
        <div className="space-y-1">
          <Label className="text-sm">{property.label}</Label>
          <Select value={property.value || ''} onValueChange={handleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {property.options?.map((option, index) => {
                const key = typeof option === 'string' ? option : option.value;
                const label = typeof option === 'string' ? option : option.label;
                return (
                  <SelectItem key={`${key}-${index}`} value={key}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {property.description && (
            <p className="text-xs text-muted-foreground">{property.description}</p>
          )}
        </div>
      );

    case 'color':
      return (
        <div className="space-y-1">
          <Label className="text-sm">{property.label}</Label>
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded border border-border"
              style={{ backgroundColor: property.value || '#000000' }}
            />
            <Input
              type="color"
              value={property.value || '#000000'}
              onChange={(e) => handleChange(e.target.value)}
              className="w-16 h-8 p-0 border-0"
            />
            <Input
              value={property.value || '#000000'}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
          {property.description && (
            <p className="text-xs text-muted-foreground">{property.description}</p>
          )}
        </div>
      );

    case 'array':
      if (property.key === 'options') {
        return (
          <OptionsArrayEditor
            value={property.value || []}
            onChange={handleChange}
          />
        );
      }
      return (
        <div className="space-y-1">
          <Label className="text-sm">{property.label}</Label>
          <div className="text-xs text-muted-foreground">
            Array de {Array.isArray(property.value) ? property.value.length : 0} itens
          </div>
          {property.description && (
            <p className="text-xs text-muted-foreground">{property.description}</p>
          )}
        </div>
      );

    default:
      return (
        <div className="space-y-1">
          <Label className="text-sm">{property.label}</Label>
          <Input
            value={property.value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={property.placeholder}
          />
          {property.description && (
            <p className="text-xs text-muted-foreground">{property.description}</p>
          )}
        </div>
      );
  }
};

/**
 * Obtém informações da categoria
 */
function getCategoryInfo(category: string) {
  const categoryMap: Record<string, { label: string; icon: any }> = {
    content: { label: 'Conteúdo', icon: Info },
    style: { label: 'Estilo', icon: Paintbrush },
    layout: { label: 'Layout', icon: Layout },
    behavior: { label: 'Comportamento', icon: Zap },
    validation: { label: 'Validação', icon: Shield },
    accessibility: { label: 'Acessibilidade', icon: Shield },
    advanced: { label: 'Avançado', icon: Code },
    metadata: { label: 'Metadados', icon: Info }
  };

  return categoryMap[category] || { label: category, icon: Info };
}

export default UniversalNoCodePanel;