import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Eye,
    Image,
    Palette,
    Settings,
    Type,
    X
} from "lucide-react";
import React, { useState } from "react";

interface ComponentSpecificPropertiesPanelProps {
  selectedBlock: {
    id: string;
    type: string;
    properties?: Record<string, any>;
    content?: Record<string, any>;
  };
  onUpdate: (blockId: string, updates: Record<string, any>) => void;
  onClose?: () => void;
  onPreview?: () => void;
}

/**
 * Painel de Propriedades Específico por Componente
 * 
 * Este componente mostra apenas as propriedades relevantes para o componente selecionado.
 * Diferentes tipos de componentes terão diferentes conjuntos de propriedades.
 */
export const ComponentSpecificPropertiesPanel: React.FC<ComponentSpecificPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onClose,
  onPreview,
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'content' | 'behavior'>('content');

  const handlePropertyUpdate = (property: string, value: any) => {
    onUpdate(selectedBlock.id, { [property]: value });
  };

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="w-4 h-4" />;
      case 'button':
        return <Settings className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getComponentDisplayName = (type: string) => {
    const names: Record<string, string> = {
      text: 'Texto',
      button: 'Botão',
      image: 'Imagem',
      input: 'Campo de Entrada',
      heading: 'Título',
      paragraph: 'Parágrafo',
      divider: 'Divisor',
      spacer: 'Espaçador',
    };
    return names[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Renderizar propriedades específicas por tipo de componente
  const renderTextProperties = () => (
    <div className="space-y-4">
      {/* Conteúdo */}
      <div className="space-y-2">
        <Label htmlFor="text-content">Texto</Label>
        <Textarea
          id="text-content"
          value={selectedBlock.properties?.text || selectedBlock.content?.text || ''}
          onChange={(e) => handlePropertyUpdate('text', e.target.value)}
          placeholder="Digite o texto aqui..."
          rows={3}
        />
      </div>

      {/* Alinhamento */}
      <div className="space-y-2">
        <Label>Alinhamento</Label>
        <div className="flex space-x-2">
          {[
            { value: 'left', icon: <AlignLeft className="w-4 h-4" />, label: 'Esquerda' },
            { value: 'center', icon: <AlignCenter className="w-4 h-4" />, label: 'Centro' },
            { value: 'right', icon: <AlignRight className="w-4 h-4" />, label: 'Direita' },
          ].map((align) => (
            <Button
              key={align.value}
              variant={selectedBlock.properties?.textAlign === align.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePropertyUpdate('textAlign', align.value)}
              className="flex-1"
            >
              {align.icon}
            </Button>
          ))}
        </div>
      </div>

      {/* Tamanho da fonte */}
      <div className="space-y-2">
        <Label htmlFor="font-size">Tamanho da Fonte</Label>
        <Select
          value={selectedBlock.properties?.fontSize?.toString() || '16'}
          onValueChange={(value) => handlePropertyUpdate('fontSize', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">12px</SelectItem>
            <SelectItem value="14">14px</SelectItem>
            <SelectItem value="16">16px</SelectItem>
            <SelectItem value="18">18px</SelectItem>
            <SelectItem value="20">20px</SelectItem>
            <SelectItem value="24">24px</SelectItem>
            <SelectItem value="28">28px</SelectItem>
            <SelectItem value="32">32px</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cor do texto */}
      <div className="space-y-2">
        <Label htmlFor="text-color">Cor do Texto</Label>
        <div className="flex space-x-2">
          <Input
            id="text-color"
            type="color"
            value={selectedBlock.properties?.color || selectedBlock.properties?.textColor || '#000000'}
            onChange={(e) => handlePropertyUpdate('textColor', e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input
            value={selectedBlock.properties?.color || selectedBlock.properties?.textColor || '#000000'}
            onChange={(e) => handlePropertyUpdate('textColor', e.target.value)}
            placeholder="#000000"
            className="flex-1"
          />
        </div>
      </div>

      {/* Peso da fonte */}
      <div className="space-y-2">
        <Label>Peso da Fonte</Label>
        <Select
          value={selectedBlock.properties?.fontWeight?.toString() || 'normal'}
          onValueChange={(value) => handlePropertyUpdate('fontWeight', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="300">Leve</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="500">Médio</SelectItem>
            <SelectItem value="600">Semi-negrito</SelectItem>
            <SelectItem value="bold">Negrito</SelectItem>
            <SelectItem value="800">Extra-negrito</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderButtonProperties = () => (
    <div className="space-y-4">
      {/* Texto do botão */}
      <div className="space-y-2">
        <Label htmlFor="button-text">Texto do Botão</Label>
        <Input
          id="button-text"
          value={selectedBlock.properties?.text || 'Clique aqui'}
          onChange={(e) => handlePropertyUpdate('text', e.target.value)}
          placeholder="Digite o texto do botão..."
        />
      </div>

      {/* Estilo do botão */}
      <div className="space-y-2">
        <Label>Estilo</Label>
        <Select
          value={selectedBlock.properties?.variant || selectedBlock.properties?.style || 'primary'}
          onValueChange={(value) => handlePropertyUpdate('variant', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primário</SelectItem>
            <SelectItem value="secondary">Secundário</SelectItem>
            <SelectItem value="outline">Contorno</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tamanho do botão */}
      <div className="space-y-2">
        <Label>Tamanho</Label>
        <Select
          value={selectedBlock.properties?.size || 'medium'}
          onValueChange={(value) => handlePropertyUpdate('size', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Pequeno</SelectItem>
            <SelectItem value="medium">Médio</SelectItem>
            <SelectItem value="large">Grande</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cor de fundo */}
      <div className="space-y-2">
        <Label htmlFor="bg-color">Cor de Fundo</Label>
        <div className="flex space-x-2">
          <Input
            id="bg-color"
            type="color"
            value={selectedBlock.properties?.backgroundColor || '#B89B7A'}
            onChange={(e) => handlePropertyUpdate('backgroundColor', e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input
            value={selectedBlock.properties?.backgroundColor || '#B89B7A'}
            onChange={(e) => handlePropertyUpdate('backgroundColor', e.target.value)}
            placeholder="#B89B7A"
            className="flex-1"
          />
        </div>
      </div>

      {/* Cor do texto */}
      <div className="space-y-2">
        <Label htmlFor="button-text-color">Cor do Texto</Label>
        <div className="flex space-x-2">
          <Input
            id="button-text-color"
            type="color"
            value={selectedBlock.properties?.textColor || '#ffffff'}
            onChange={(e) => handlePropertyUpdate('textColor', e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input
            value={selectedBlock.properties?.textColor || '#ffffff'}
            onChange={(e) => handlePropertyUpdate('textColor', e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      {/* Largura total */}
      <div className="flex items-center space-x-2">
        <Switch
          id="full-width"
          checked={selectedBlock.properties?.fullWidth || false}
          onCheckedChange={(checked) => handlePropertyUpdate('fullWidth', checked)}
        />
        <Label htmlFor="full-width">Largura total</Label>
      </div>

      {/* Efeito hover */}
      <div className="flex items-center space-x-2">
        <Switch
          id="hover-effect"
          checked={selectedBlock.properties?.hoverEffect !== false}
          onCheckedChange={(checked) => handlePropertyUpdate('hoverEffect', checked)}
        />
        <Label htmlFor="hover-effect">Efeito hover</Label>
      </div>
    </div>
  );

  const renderImageProperties = () => (
    <div className="space-y-4">
      {/* URL da imagem */}
      <div className="space-y-2">
        <Label htmlFor="image-url">URL da Imagem</Label>
        <Input
          id="image-url"
          value={selectedBlock.properties?.src || selectedBlock.properties?.url || ''}
          onChange={(e) => handlePropertyUpdate('src', e.target.value)}
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>

      {/* Texto alternativo */}
      <div className="space-y-2">
        <Label htmlFor="alt-text">Texto Alternativo</Label>
        <Input
          id="alt-text"
          value={selectedBlock.properties?.alt || ''}
          onChange={(e) => handlePropertyUpdate('alt', e.target.value)}
          placeholder="Descrição da imagem..."
        />
      </div>

      {/* Largura */}
      <div className="space-y-2">
        <Label htmlFor="image-width">Largura</Label>
        <Input
          id="image-width"
          value={selectedBlock.properties?.width || ''}
          onChange={(e) => handlePropertyUpdate('width', e.target.value)}
          placeholder="auto, 100%, 300px..."
        />
      </div>

      {/* Altura */}
      <div className="space-y-2">
        <Label htmlFor="image-height">Altura</Label>
        <Input
          id="image-height"
          value={selectedBlock.properties?.height || ''}
          onChange={(e) => handlePropertyUpdate('height', e.target.value)}
          placeholder="auto, 200px..."
        />
      </div>

      {/* Ajuste da imagem */}
      <div className="space-y-2">
        <Label>Ajuste da Imagem</Label>
        <Select
          value={selectedBlock.properties?.objectFit || 'cover'}
          onValueChange={(value) => handlePropertyUpdate('objectFit', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cover">Cobrir</SelectItem>
            <SelectItem value="contain">Conter</SelectItem>
            <SelectItem value="fill">Preencher</SelectItem>
            <SelectItem value="none">Nenhum</SelectItem>
            <SelectItem value="scale-down">Reduzir</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alinhamento */}
      <div className="space-y-2">
        <Label>Alinhamento</Label>
        <div className="flex space-x-2">
          {[
            { value: 'left', icon: <AlignLeft className="w-4 h-4" />, label: 'Esquerda' },
            { value: 'center', icon: <AlignCenter className="w-4 h-4" />, label: 'Centro' },
            { value: 'right', icon: <AlignRight className="w-4 h-4" />, label: 'Direita' },
          ].map((align) => (
            <Button
              key={align.value}
              variant={selectedBlock.properties?.textAlign === align.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePropertyUpdate('textAlign', align.value)}
              className="flex-1"
            >
              {align.icon}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPropertiesByType = () => {
    switch (selectedBlock.type) {
      case 'text':
      case 'heading':
      case 'paragraph':
        return renderTextProperties();
      case 'button':
        return renderButtonProperties();
      case 'image':
        return renderImageProperties();
      default:
        return (
          <div className="text-center text-gray-500 py-8">
            <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Propriedades não disponíveis para este tipo de componente.</p>
          </div>
        );
    }
  };

  return (
    <Card className="h-full border-l-4 border-l-blue-500">
      <CardHeader className="pb-3 bg-blue-50/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getComponentIcon(selectedBlock.type)}
            <CardTitle className="text-lg">
              {getComponentDisplayName(selectedBlock.type)}
            </CardTitle>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              Editando
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            {onPreview && (
              <Button variant="ghost" size="sm" onClick={onPreview}>
                <Eye className="w-4 h-4" />
              </Button>
            )}
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            ID: {selectedBlock.id}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Tipo: {selectedBlock.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-4">
            {/* Abas de propriedades */}
            <div className="flex space-x-1 mb-4 p-1 bg-gray-100 rounded-lg">
              {[
                { id: 'content', label: 'Conteúdo', icon: <Type className="w-3 h-3" /> },
                { id: 'style', label: 'Visual', icon: <Palette className="w-3 h-3" /> },
                { id: 'behavior', label: 'Comportamento', icon: <Settings className="w-3 h-3" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Propriedades específicas do componente */}
            {activeTab === 'content' && renderPropertiesByType()}
            
            {activeTab === 'style' && (
              <div className="space-y-4">
                {/* Margens */}
                <div className="space-y-2">
                  <Label>Margem Externa</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="margin-top" className="text-xs">Topo</Label>
                      <Input
                        id="margin-top"
                        type="number"
                        value={selectedBlock.properties?.marginTop || 0}
                        onChange={(e) => handlePropertyUpdate('marginTop', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="margin-bottom" className="text-xs">Base</Label>
                      <Input
                        id="margin-bottom"
                        type="number"
                        value={selectedBlock.properties?.marginBottom || 0}
                        onChange={(e) => handlePropertyUpdate('marginBottom', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'behavior' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-editable"
                    checked={selectedBlock.properties?.isEditable !== false}
                    onCheckedChange={(checked) => handlePropertyUpdate('isEditable', checked)}
                  />
                  <Label htmlFor="is-editable">Editável inline</Label>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ComponentSpecificPropertiesPanel;
