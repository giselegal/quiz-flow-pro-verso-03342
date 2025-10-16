/**
 * 🎯 UNIVERSAL PROPERTIES PANEL
 * Painel dinâmico de propriedades que se adapta ao tipo de bloco selecionado
 */

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface UniversalPropertiesPanelProps {
  blockType: string;
  properties: Record<string, any>;
  onPropertyChange: (key: string, value: any) => void;
  className?: string;
}

export const UniversalPropertiesPanel: React.FC<UniversalPropertiesPanelProps> = ({
  blockType,
  properties,
  onPropertyChange,
  className,
}) => {
  const renderLayoutProperties = () => (
    <AccordionItem value="layout">
      <AccordionTrigger className="text-sm font-medium">📐 Layout</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Largura</Label>
          <Input
            type="text"
            value={properties.width || 'auto'}
            onChange={(e) => onPropertyChange('width', e.target.value)}
            placeholder="auto, 100%, 300px"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Altura</Label>
          <Input
            type="text"
            value={properties.height || 'auto'}
            onChange={(e) => onPropertyChange('height', e.target.value)}
            placeholder="auto, 100%, 200px"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Largura Máxima</Label>
          <Input
            type="text"
            value={properties.maxWidth || '100%'}
            onChange={(e) => onPropertyChange('maxWidth', e.target.value)}
            placeholder="100%, 800px"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  const renderSpacingProperties = () => (
    <AccordionItem value="spacing">
      <AccordionTrigger className="text-sm font-medium">📏 Espaçamento</AccordionTrigger>
      <AccordionContent className="space-y-4">
        {/* Margins */}
        <div className="space-y-2">
          <Label className="text-xs">Margem Superior</Label>
          <Slider
            value={[properties.marginTop || 0]}
            onValueChange={([value]) => onPropertyChange('marginTop', value)}
            max={100}
            step={4}
          />
          <span className="text-xs text-muted-foreground">{properties.marginTop || 0}px</span>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Margem Inferior</Label>
          <Slider
            value={[properties.marginBottom || 0]}
            onValueChange={([value]) => onPropertyChange('marginBottom', value)}
            max={100}
            step={4}
          />
          <span className="text-xs text-muted-foreground">{properties.marginBottom || 0}px</span>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Margem Esquerda</Label>
          <Slider
            value={[properties.marginLeft || 0]}
            onValueChange={([value]) => onPropertyChange('marginLeft', value)}
            max={100}
            step={4}
          />
          <span className="text-xs text-muted-foreground">{properties.marginLeft || 0}px</span>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Margem Direita</Label>
          <Slider
            value={[properties.marginRight || 0]}
            onValueChange={([value]) => onPropertyChange('marginRight', value)}
            max={100}
            step={4}
          />
          <span className="text-xs text-muted-foreground">{properties.marginRight || 0}px</span>
        </div>

        {/* Paddings */}
        <div className="space-y-2">
          <Label className="text-xs">Padding Superior</Label>
          <Slider
            value={[properties.paddingTop || 0]}
            onValueChange={([value]) => onPropertyChange('paddingTop', value)}
            max={100}
            step={4}
          />
          <span className="text-xs text-muted-foreground">{properties.paddingTop || 0}px</span>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Padding Inferior</Label>
          <Slider
            value={[properties.paddingBottom || 0]}
            onValueChange={([value]) => onPropertyChange('paddingBottom', value)}
            max={100}
            step={4}
          />
          <span className="text-xs text-muted-foreground">{properties.paddingBottom || 0}px</span>
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  const renderVisualProperties = () => (
    <AccordionItem value="visual">
      <AccordionTrigger className="text-sm font-medium">🎨 Visual</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Cor de Fundo</Label>
          <Input
            type="color"
            value={properties.backgroundColor || '#ffffff'}
            onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Raio da Borda</Label>
          <Slider
            value={[properties.borderRadius || 0]}
            onValueChange={([value]) => onPropertyChange('borderRadius', value)}
            max={50}
            step={1}
          />
          <span className="text-xs text-muted-foreground">{properties.borderRadius || 0}px</span>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Opacidade</Label>
          <Slider
            value={[properties.opacity || 1]}
            onValueChange={([value]) => onPropertyChange('opacity', value)}
            max={1}
            step={0.1}
            min={0}
          />
          <span className="text-xs text-muted-foreground">{((properties.opacity || 1) * 100).toFixed(0)}%</span>
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  const renderTypographyProperties = () => {
    const textBlocks = ['text-inline', 'heading-inline', 'button-inline'];
    if (!textBlocks.includes(blockType)) return null;

    return (
      <AccordionItem value="typography">
        <AccordionTrigger className="text-sm font-medium">📝 Tipografia</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Tamanho da Fonte</Label>
            <Input
              type="text"
              value={properties.fontSize || '16px'}
              onChange={(e) => onPropertyChange('fontSize', e.target.value)}
              placeholder="16px, 1rem, 1.5em"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Peso da Fonte</Label>
            <Select
              value={properties.fontWeight?.toString() || '400'}
              onValueChange={(value) => onPropertyChange('fontWeight', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="300">Light (300)</SelectItem>
                <SelectItem value="400">Regular (400)</SelectItem>
                <SelectItem value="500">Medium (500)</SelectItem>
                <SelectItem value="600">Semibold (600)</SelectItem>
                <SelectItem value="700">Bold (700)</SelectItem>
                <SelectItem value="800">Extrabold (800)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Alinhamento</Label>
            <Select
              value={properties.textAlign || 'left'}
              onValueChange={(value) => onPropertyChange('textAlign', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Esquerda</SelectItem>
                <SelectItem value="center">Centro</SelectItem>
                <SelectItem value="right">Direita</SelectItem>
                <SelectItem value="justify">Justificado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Cor do Texto</Label>
            <Input
              type="color"
              value={properties.color || '#000000'}
              onChange={(e) => onPropertyChange('color', e.target.value)}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  const renderImageProperties = () => {
    const imageBlocks = ['image-display-inline', 'quiz-logo'];
    if (!imageBlocks.includes(blockType)) return null;

    return (
      <AccordionItem value="image">
        <AccordionTrigger className="text-sm font-medium">🖼️ Imagem</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">URL da Imagem</Label>
            <Input
              type="url"
              value={properties.src || properties.logoUrl || ''}
              onChange={(e) => onPropertyChange(blockType === 'quiz-logo' ? 'logoUrl' : 'src', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Texto Alternativo</Label>
            <Input
              type="text"
              value={properties.alt || properties.logoAlt || ''}
              onChange={(e) => onPropertyChange(blockType === 'quiz-logo' ? 'logoAlt' : 'alt', e.target.value)}
              placeholder="Descrição da imagem"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Ajuste de Objeto</Label>
            <Select
              value={properties.objectFit || 'cover'}
              onValueChange={(value) => onPropertyChange('objectFit', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contain">Contain</SelectItem>
                <SelectItem value="cover">Cover</SelectItem>
                <SelectItem value="fill">Fill</SelectItem>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="scale-down">Scale Down</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Propriedades</h3>
        <p className="text-xs text-muted-foreground">Tipo: {blockType}</p>
      </div>

      <Accordion type="multiple" className="w-full">
        {renderLayoutProperties()}
        {renderSpacingProperties()}
        {renderVisualProperties()}
        {renderTypographyProperties()}
        {renderImageProperties()}
      </Accordion>
    </div>
  );
};

export default UniversalPropertiesPanel;
