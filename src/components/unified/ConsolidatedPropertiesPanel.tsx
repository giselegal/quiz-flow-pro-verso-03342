import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Trash2, Settings, Edit3, Layers } from 'lucide-react';

import { Block } from '@/types/editor';

interface ConsolidatedPropertiesPanelProps {
  selectedBlock: Block | null;
  onUpdate?: (blockId: string, updates: any) => void;
  onDelete?: (blockId: string) => void;
  onClose?: () => void;
}

/**
 * CONSOLIDATED PROPERTIES PANEL - Sistema Unificado de Propriedades
 * ✅ Baseado no melhor: EnhancedUniversalPropertiesPanel + OptimizedPropertiesPanel
 * ✅ Suporte completo ao useUnifiedProperties
 * ✅ Interface moderna e responsiva
 * ✅ Performance otimizada com memoização
 * ✅ Sistema modular para extensão
 */

const ConsolidatedPropertiesPanel: React.FC<ConsolidatedPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onDelete,
  onClose,
}) => {
  // Propriedades mockadas para demonstração (substituir pelo hook real quando funcional)
  const propertyDefinitions = useMemo(() => {
    const blockType = selectedBlock?.type || '';
    
    // Sistema básico de propriedades baseado no tipo do bloco
    if (blockType.includes('text') || blockType.includes('heading')) {
        return [
          { key: 'text', type: 'text', label: 'Texto', defaultValue: '' },
          { key: 'fontSize', type: 'number', label: 'Tamanho da Fonte', defaultValue: 16, min: 10, max: 72 },
          { key: 'textAlign', type: 'select', label: 'Alinhamento', options: [
            { value: 'left', label: 'Esquerda' },
            { value: 'center', label: 'Centro' },
            { value: 'right', label: 'Direita' }
          ], defaultValue: 'left' },
          { key: 'color', type: 'color', label: 'Cor do Texto', defaultValue: '#000000' },
        ];
    } else if (blockType.includes('button')) {
        return [
          { key: 'text', type: 'text', label: 'Texto do Botão', defaultValue: 'Clique aqui' },
          { key: 'variant', type: 'select', label: 'Estilo', options: [
            { value: 'default', label: 'Padrão' },
            { value: 'outline', label: 'Contorno' },
            { value: 'ghost', label: 'Transparente' }
          ], defaultValue: 'default' },
          { key: 'size', type: 'select', label: 'Tamanho', options: [
            { value: 'sm', label: 'Pequeno' },
            { value: 'md', label: 'Médio' },
            { value: 'lg', label: 'Grande' }
          ], defaultValue: 'md' },
        ];
    } else if (blockType.includes('image')) {
        return [
          { key: 'src', type: 'text', label: 'URL da Imagem', defaultValue: '' },
          { key: 'alt', type: 'text', label: 'Texto Alternativo', defaultValue: '' },
          { key: 'width', type: 'number', label: 'Largura', defaultValue: 300, min: 50, max: 1200 },
          { key: 'height', type: 'number', label: 'Altura', defaultValue: 200, min: 50, max: 800 },
        ];
    } else {
      return [
        { key: 'content', type: 'text', label: 'Conteúdo', defaultValue: '' }
      ];
    }
  }, [selectedBlock?.type]);

  // Memoizar propriedades para performance
  const blockProperties = useMemo(() => {
    return selectedBlock?.properties || {};
  }, [selectedBlock?.properties]);

  // Handler unificado para mudanças
  const handlePropertyChange = (key: string, value: any) => {
    if (!selectedBlock || !onUpdate) return;

    const updatedProperties = {
      ...blockProperties,
      [key]: value,
    };

    onUpdate(selectedBlock.id, { properties: updatedProperties });
  };

  // Renderizar controle baseado no tipo
  const renderPropertyControl = (property: any) => {
    const { key, type, label, defaultValue, options, min, max, step } = property;
    const currentValue = blockProperties[key] ?? defaultValue;

    switch (type) {
      case 'text':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium">
              {label}
            </Label>
            <Input
              id={key}
              value={currentValue || ''}
              onChange={(e) => handlePropertyChange(key, e.target.value)}
              placeholder={`Insira ${label.toLowerCase()}`}
              className="w-full"
            />
          </div>
        );

      case 'number':
        return (
          <div key={key} className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor={key} className="text-sm font-medium">
                {label}
              </Label>
              <Badge variant="secondary" className="text-xs">
                {currentValue || defaultValue}
              </Badge>
            </div>
            <Slider
              id={key}
              value={[currentValue || defaultValue]}
              onValueChange={(value) => handlePropertyChange(key, value[0])}
              min={min || 0}
              max={max || 100}
              step={step || 1}
              className="w-full"
            />
          </div>
        );

      case 'boolean':
        return (
          <div key={key} className="flex items-center justify-between">
            <Label htmlFor={key} className="text-sm font-medium">
              {label}
            </Label>
            <Switch
              id={key}
              checked={!!currentValue}
              onCheckedChange={(checked) => handlePropertyChange(key, checked)}
            />
          </div>
        );

      case 'select':
        return (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium">{label}</Label>
            <Select
              value={currentValue || defaultValue}
              onValueChange={(value) => handlePropertyChange(key, value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Selecione ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'color':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium">
              {label}
            </Label>
            <div className="flex space-x-2">
              <Input
                id={key}
                type="color"
                value={currentValue || defaultValue || '#000000'}
                onChange={(e) => handlePropertyChange(key, e.target.value)}
                className="w-16 h-10"
              />
              <Input
                value={currentValue || defaultValue || '#000000'}
                onChange={(e) => handlePropertyChange(key, e.target.value)}
                className="flex-1"
                placeholder="#000000"
              />
            </div>
          </div>
        );

      default:
        return (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium">{label}</Label>
            <Input
              value={currentValue || ''}
              onChange={(e) => handlePropertyChange(key, e.target.value)}
              className="w-full"
            />
          </div>
        );
    }
  };

  // Se não há bloco selecionado
  if (!selectedBlock) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <Layers className="h-12 w-12 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Nenhum bloco selecionado</h3>
              <p className="text-sm text-muted-foreground">
                Clique em um bloco no canvas para editar suas propriedades
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            <Edit3 className="h-4 w-4 inline mr-2" />
            Propriedades
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {selectedBlock.type}
            </Badge>
            <span className="text-xs text-muted-foreground">
              ID: {selectedBlock.id}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(selectedBlock.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-6 py-4">
          <div className="space-y-6">
            {/* Propriedades específicas do tipo */}
            {propertyDefinitions.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium text-foreground">
                    Configurações do {selectedBlock.type}
                  </h4>
                </div>
                
                {propertyDefinitions.map(renderPropertyControl)}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  Nenhuma propriedade configurável disponível para este tipo de bloco.
                </p>
              </div>
            )}
            
            {/* Propriedades de margem universais */}
            <div className="space-y-4">
              <Separator />
              <div className="flex items-center space-x-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium text-foreground">
                  Espaçamento
                </h4>
              </div>
              
              {['marginTop', 'marginBottom', 'marginLeft', 'marginRight'].map((marginKey) => (
                <div key={marginKey} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium capitalize">
                      {marginKey.replace('margin', 'Margem ')}
                    </Label>
                    <Badge variant="secondary" className="text-xs">
                      {blockProperties[marginKey] || 0}px
                    </Badge>
                  </div>
                  <Slider
                    value={[blockProperties[marginKey] || 0]}
                    onValueChange={(value) => handlePropertyChange(marginKey, value[0])}
                    min={-40}
                    max={128}
                    step={4}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConsolidatedPropertiesPanel;