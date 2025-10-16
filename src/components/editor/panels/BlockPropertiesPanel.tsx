/**
 * 🎛️ BLOCK PROPERTIES PANEL
 * 
 * Painel para edição de propriedades de blocos selecionados
 * - Formulário dinâmico baseado no tipo de bloco
 * - Validação em tempo real
 * - Preview ao vivo
 */

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import type { StepBlockSchema } from '@/data/stepBlockSchemas';

interface BlockPropertiesPanelProps {
  block: StepBlockSchema | null;
  onUpdate: (blockId: string, updates: Partial<StepBlockSchema>) => void;
}

export function BlockPropertiesPanel({ block, onUpdate }: BlockPropertiesPanelProps) {
  const [localProps, setLocalProps] = useState<Record<string, any>>({});

  // Sincronizar com o bloco selecionado
  useEffect(() => {
    if (block) {
      setLocalProps(block.props);
    }
  }, [block?.id]);

  if (!block) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Info className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium mb-2">Nenhum bloco selecionado</p>
        <p className="text-xs text-muted-foreground">
          Selecione um bloco na lista para editar suas propriedades
        </p>
      </div>
    );
  }

  const handlePropChange = (key: string, value: any) => {
    const newProps = { ...localProps, [key]: value };
    setLocalProps(newProps);
    onUpdate(block.id, { props: newProps });
  };

  // Renderizar campos baseados no tipo de bloco
  const renderFields = () => {
    switch (block.type) {
      case 'LogoBlock':
        return (
          <>
            <div className="space-y-2">
              <Label>URL da Logo</Label>
              <Input
                value={localProps.logoUrl || ''}
                onChange={(e) => handlePropChange('logoUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Largura (px)</Label>
                <Input
                  type="number"
                  value={localProps.width || 132}
                  onChange={(e) => handlePropChange('width', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Altura (px)</Label>
                <Input
                  type="number"
                  value={localProps.height || 55}
                  onChange={(e) => handlePropChange('height', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Barra Decorativa</Label>
              <Switch
                checked={localProps.showDecorator ?? true}
                onCheckedChange={(checked) => handlePropChange('showDecorator', checked)}
              />
            </div>

            {localProps.showDecorator && (
              <div className="space-y-2">
                <Label>Cor da Barra</Label>
                <Input
                  type="color"
                  value={localProps.decoratorColor || '#B89B7A'}
                  onChange={(e) => handlePropChange('decoratorColor', e.target.value)}
                />
              </div>
            )}
          </>
        );

      case 'HeadlineBlock':
        return (
          <>
            <div className="space-y-2">
              <Label>Texto</Label>
              <Textarea
                value={localProps.text || ''}
                onChange={(e) => handlePropChange('text', e.target.value)}
                placeholder="Digite o texto do título"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Suporta HTML para formatação
              </p>
            </div>

            <div className="space-y-2">
              <Label>Nível do Título</Label>
              <Select
                value={localProps.level || 'h2'}
                onValueChange={(value) => handlePropChange('level', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">H1 (Muito Grande)</SelectItem>
                  <SelectItem value="h2">H2 (Grande)</SelectItem>
                  <SelectItem value="h3">H3 (Médio)</SelectItem>
                  <SelectItem value="h4">H4 (Pequeno)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tamanho da Fonte</Label>
              <Select
                value={localProps.fontSize || 'text-2xl'}
                onValueChange={(value) => handlePropChange('fontSize', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text-xl">Extra Pequeno</SelectItem>
                  <SelectItem value="text-2xl">Pequeno</SelectItem>
                  <SelectItem value="text-3xl">Médio</SelectItem>
                  <SelectItem value="text-4xl">Grande</SelectItem>
                  <SelectItem value="text-5xl">Extra Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Alinhamento</Label>
              <Select
                value={localProps.align || 'center'}
                onValueChange={(value) => handlePropChange('align', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Esquerda</SelectItem>
                  <SelectItem value="center">Centro</SelectItem>
                  <SelectItem value="right">Direita</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cor do Texto</Label>
              <Input
                type="color"
                value={localProps.color || '#000000'}
                onChange={(e) => handlePropChange('color', e.target.value)}
              />
            </div>
          </>
        );

      case 'ImageBlock':
        return (
          <>
            <div className="space-y-2">
              <Label>URL da Imagem</Label>
              <Input
                value={localProps.src || ''}
                onChange={(e) => handlePropChange('src', e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>Texto Alternativo</Label>
              <Input
                value={localProps.alt || ''}
                onChange={(e) => handlePropChange('alt', e.target.value)}
                placeholder="Descrição da imagem"
              />
            </div>

            <div className="space-y-2">
              <Label>Largura Máxima</Label>
              <Input
                value={localProps.maxWidth || '300px'}
                onChange={(e) => handlePropChange('maxWidth', e.target.value)}
                placeholder="300px"
              />
            </div>

            <div className="space-y-2">
              <Label>Proporção (Aspect Ratio)</Label>
              <Input
                value={localProps.aspectRatio || '1'}
                onChange={(e) => handlePropChange('aspectRatio', e.target.value)}
                placeholder="1 ou 16/9"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Bordas Arredondadas</Label>
              <Switch
                checked={localProps.rounded ?? true}
                onCheckedChange={(checked) => handlePropChange('rounded', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Sombra</Label>
              <Switch
                checked={localProps.shadow ?? false}
                onCheckedChange={(checked) => handlePropChange('shadow', checked)}
              />
            </div>
          </>
        );

      case 'ButtonBlock':
        return (
          <>
            <div className="space-y-2">
              <Label>Texto do Botão</Label>
              <Input
                value={localProps.text || ''}
                onChange={(e) => handlePropChange('text', e.target.value)}
                placeholder="Clique aqui"
              />
            </div>

            <div className="space-y-2">
              <Label>Tamanho</Label>
              <Select
                value={localProps.size || 'md'}
                onValueChange={(value) => handlePropChange('size', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Pequeno</SelectItem>
                  <SelectItem value="md">Médio</SelectItem>
                  <SelectItem value="lg">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cor de Fundo</Label>
              <Input
                type="color"
                value={localProps.bgColor || '#B89B7A'}
                onChange={(e) => handlePropChange('bgColor', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Cor do Texto</Label>
              <Input
                type="color"
                value={localProps.textColor || '#ffffff'}
                onChange={(e) => handlePropChange('textColor', e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Largura Total</Label>
              <Switch
                checked={localProps.fullWidth ?? true}
                onCheckedChange={(checked) => handlePropChange('fullWidth', checked)}
              />
            </div>
          </>
        );

      case 'TextBlock':
        return (
          <>
            <div className="space-y-2">
              <Label>Texto</Label>
              <Textarea
                value={localProps.text || ''}
                onChange={(e) => handlePropChange('text', e.target.value)}
                placeholder="Digite o texto"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Tamanho</Label>
              <Select
                value={localProps.size || 'text-base'}
                onValueChange={(value) => handlePropChange('size', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text-xs">Extra Pequeno</SelectItem>
                  <SelectItem value="text-sm">Pequeno</SelectItem>
                  <SelectItem value="text-base">Normal</SelectItem>
                  <SelectItem value="text-lg">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Alinhamento</Label>
              <Select
                value={localProps.align || 'center'}
                onValueChange={(value) => handlePropChange('align', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Esquerda</SelectItem>
                  <SelectItem value="center">Centro</SelectItem>
                  <SelectItem value="right">Direita</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'SpacerBlock':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Altura (px): {localProps.height || 20}</Label>
              <Slider
                value={[localProps.height || 20]}
                onValueChange={([value]) => handlePropChange('height', value)}
                min={0}
                max={200}
                step={4}
              />
            </div>
          </div>
        );

      case 'ProgressBarBlock':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Progresso (%): {localProps.progress || 0}</Label>
                <Slider
                  value={[localProps.progress || 0]}
                  onValueChange={([value]) => handlePropChange('progress', value)}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Altura (px)</Label>
              <Input
                type="number"
                value={localProps.height || 8}
                onChange={(e) => handlePropChange('height', parseInt(e.target.value))}
                min={4}
                max={24}
              />
            </div>

            <div className="space-y-2">
              <Label>Cor de Preenchimento</Label>
              <Input
                type="color"
                value={localProps.fillColor || '#B89B7A'}
                onChange={(e) => handlePropChange('fillColor', e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Animado</Label>
              <Switch
                checked={localProps.animated ?? true}
                onCheckedChange={(checked) => handlePropChange('animated', checked)}
              />
            </div>
          </>
        );

      default:
        return (
          <div className="text-sm text-muted-foreground">
            Tipo de bloco não reconhecido: {block.type}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border-l">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg mb-1">Propriedades</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{block.type}</Badge>
          {!block.editable && (
            <Badge variant="secondary" className="text-xs">Somente leitura</Badge>
          )}
        </div>
      </div>

      {/* Properties Form */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {block.editable === false ? (
            <div className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg">
              Este bloco não pode ser editado diretamente.
            </div>
          ) : (
            renderFields()
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex items-center gap-2">
          {block.deletable === false && (
            <Badge variant="secondary" className="text-xs">
              Não pode ser deletado
            </Badge>
          )}
          {block.movable === false && (
            <Badge variant="secondary" className="text-xs">
              Posição fixa
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
