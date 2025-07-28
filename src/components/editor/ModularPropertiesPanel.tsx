
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Palette, 
  Type, 
  Layout, 
  Image, 
  Link, 
  Code, 
  Eye, 
  EyeOff,
  Trash2
} from 'lucide-react';

interface ModularPropertiesPanelProps {
  selectedBlockId?: string | null;
  onClose?: () => void;
  onUpdate?: (properties: any) => void;
  onDelete?: () => void;
}

export const ModularPropertiesPanel: React.FC<ModularPropertiesPanelProps> = ({
  selectedBlockId,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState('content');
  const [properties, setProperties] = useState({
    content: {
      title: '',
      text: '',
      buttonText: '',
      buttonUrl: '',
      imageUrl: ''
    },
    style: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      fontSize: '16px',
      fontWeight: 'normal',
      padding: '16px',
      borderRadius: '8px'
    },
    layout: {
      width: '100%',
      height: 'auto',
      alignment: 'left',
      spacing: '16px'
    },
    animation: {
      type: 'none',
      duration: '0.3s',
      delay: '0s'
    }
  });

  const handlePropertyChange = (section: string, key: string, value: any) => {
    setProperties(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    
    onUpdate?.(properties);
  };

  if (!selectedBlockId) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            Selecione um bloco para editar suas propriedades
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Propriedades do Bloco</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">
              <Type className="w-4 h-4 mr-2" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="style">
              <Palette className="w-4 h-4 mr-2" />
              Estilo
            </TabsTrigger>
            <TabsTrigger value="layout">
              <Layout className="w-4 h-4 mr-2" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="animation">
              <Eye className="w-4 h-4 mr-2" />
              Animação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="p-4 space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={properties.content.title}
                onChange={(e) => handlePropertyChange('content', 'title', e.target.value)}
                placeholder="Digite o título"
              />
            </div>

            <div>
              <Label htmlFor="text">Texto</Label>
              <Textarea
                id="text"
                value={properties.content.text}
                onChange={(e) => handlePropertyChange('content', 'text', e.target.value)}
                placeholder="Digite o texto"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="buttonText">Texto do Botão</Label>
              <Input
                id="buttonText"
                value={properties.content.buttonText}
                onChange={(e) => handlePropertyChange('content', 'buttonText', e.target.value)}
                placeholder="Clique aqui"
              />
            </div>

            <div>
              <Label htmlFor="buttonUrl">URL do Botão</Label>
              <Input
                id="buttonUrl"
                value={properties.content.buttonUrl}
                onChange={(e) => handlePropertyChange('content', 'buttonUrl', e.target.value)}
                placeholder="https://exemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="imageUrl">URL da Imagem</Label>
              <Input
                id="imageUrl"
                value={properties.content.imageUrl}
                onChange={(e) => handlePropertyChange('content', 'imageUrl', e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </TabsContent>

          <TabsContent value="style" className="p-4 space-y-4">
            <div>
              <Label htmlFor="backgroundColor">Cor de Fundo</Label>
              <Input
                id="backgroundColor"
                type="color"
                value={properties.style.backgroundColor}
                onChange={(e) => handlePropertyChange('style', 'backgroundColor', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="textColor">Cor do Texto</Label>
              <Input
                id="textColor"
                type="color"
                value={properties.style.textColor}
                onChange={(e) => handlePropertyChange('style', 'textColor', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="fontSize">Tamanho da Fonte</Label>
              <Select
                value={properties.style.fontSize}
                onValueChange={(value) => handlePropertyChange('style', 'fontSize', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12px">12px</SelectItem>
                  <SelectItem value="14px">14px</SelectItem>
                  <SelectItem value="16px">16px</SelectItem>
                  <SelectItem value="18px">18px</SelectItem>
                  <SelectItem value="20px">20px</SelectItem>
                  <SelectItem value="24px">24px</SelectItem>
                  <SelectItem value="32px">32px</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fontWeight">Peso da Fonte</Label>
              <Select
                value={properties.style.fontWeight}
                onValueChange={(value) => handlePropertyChange('style', 'fontWeight', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Negrito</SelectItem>
                  <SelectItem value="lighter">Mais Leve</SelectItem>
                  <SelectItem value="bolder">Mais Negrito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="padding">Padding</Label>
              <Input
                id="padding"
                value={properties.style.padding}
                onChange={(e) => handlePropertyChange('style', 'padding', e.target.value)}
                placeholder="16px"
              />
            </div>

            <div>
              <Label htmlFor="borderRadius">Border Radius</Label>
              <Input
                id="borderRadius"
                value={properties.style.borderRadius}
                onChange={(e) => handlePropertyChange('style', 'borderRadius', e.target.value)}
                placeholder="8px"
              />
            </div>
          </TabsContent>

          <TabsContent value="layout" className="p-4 space-y-4">
            <div>
              <Label htmlFor="width">Largura</Label>
              <Input
                id="width"
                value={properties.layout.width}
                onChange={(e) => handlePropertyChange('layout', 'width', e.target.value)}
                placeholder="100%"
              />
            </div>

            <div>
              <Label htmlFor="height">Altura</Label>
              <Input
                id="height"
                value={properties.layout.height}
                onChange={(e) => handlePropertyChange('layout', 'height', e.target.value)}
                placeholder="auto"
              />
            </div>

            <div>
              <Label htmlFor="alignment">Alinhamento</Label>
              <Select
                value={properties.layout.alignment}
                onValueChange={(value) => handlePropertyChange('layout', 'alignment', value)}
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

            <div>
              <Label htmlFor="spacing">Espaçamento</Label>
              <Input
                id="spacing"
                value={properties.layout.spacing}
                onChange={(e) => handlePropertyChange('layout', 'spacing', e.target.value)}
                placeholder="16px"
              />
            </div>
          </TabsContent>

          <TabsContent value="animation" className="p-4 space-y-4">
            <div>
              <Label htmlFor="animationType">Tipo de Animação</Label>
              <Select
                value={properties.animation.type}
                onValueChange={(value) => handlePropertyChange('animation', 'type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  <SelectItem value="fade">Fade</SelectItem>
                  <SelectItem value="slide">Slide</SelectItem>
                  <SelectItem value="scale">Scale</SelectItem>
                  <SelectItem value="bounce">Bounce</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration">Duração</Label>
              <Input
                id="duration"
                value={properties.animation.duration}
                onChange={(e) => handlePropertyChange('animation', 'duration', e.target.value)}
                placeholder="0.3s"
              />
            </div>

            <div>
              <Label htmlFor="delay">Delay</Label>
              <Input
                id="delay"
                value={properties.animation.delay}
                onChange={(e) => handlePropertyChange('animation', 'delay', e.target.value)}
                placeholder="0s"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
