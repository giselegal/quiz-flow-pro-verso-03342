// src/components/editor/quiz/QuizHeaderPropertiesPanel.tsx
// Painel de propriedades específico para o cabeçalho do quiz

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Eye,
  Image,
  Palette,
  Scale,
  Settings,
  Upload,
} from 'lucide-react';
import React, { useState } from 'react';

// Color picker moderno e elegante
const ColorPicker: React.FC<{
  value: string;
  onChange: (color: string) => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const presetColors = [
    '#B89B7A',
    '#432818',
    '#6B4F43',
    '#FAF9F7',
    '#E5DDD5',
    '#FEFEFE',
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#FF7675',
    '#00B894',
    '#0984E3',
    '#6C5CE7',
    '#FDCB6E',
    '#E17055',
  ];

  return (
    <div className="space-y-3">
      <Label className="text-xs font-medium" style={{ color: '#6B4F43' }}>
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded border-2 cursor-pointer"
          style={{ backgroundColor: value, borderColor: '#E5DDD5' }}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'color';
            input.value = value;
            input.onchange = e => onChange((e.target as HTMLInputElement).value);
            input.click();
          }}
        />
        <Input
          value={value}
          onChange={e => onChange(e.target.value)}
          className="text-xs h-8"
          style={{ borderColor: '#E5DDD5' }}
        />
      </div>
      <div className="grid grid-cols-6 gap-1">
        {presetColors.map(color => (
          <button
            key={color}
            className="w-6 h-6 rounded border hover:scale-110 transition-transform"
            style={{ backgroundColor: color, borderColor: '#E5DDD5' }}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
    </div>
  );
};

import { HeaderProperties } from '@/config/headerPropertiesMapping';
import type { Block } from '@/types/editor';

interface QuizHeaderPropertiesPanelProps {
  selectedBlock?: Block;
  onUpdate?: (blockId: string, properties: HeaderProperties) => void;
}

export const QuizHeaderPropertiesPanel: React.FC<QuizHeaderPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
}) => {
  const [activeTab, setActiveTab] = useState('general');

  const properties = selectedBlock?.properties as HeaderProperties || {};

  const handlePropertyUpdate = (key: keyof HeaderProperties, value: any) => {
    if (selectedBlock && onUpdate) {
      onUpdate(selectedBlock.id, {
        ...properties,
        [key]: value
      } as HeaderProperties);
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#FEFEFE' }}>
      <div className="border-b p-3" style={{ borderColor: '#E5DDD5' }}>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{ backgroundColor: '#B89B7A' }}
          >
            <Settings className="h-3 w-3 text-white" />
          </div>
          <h2 className="font-semibold text-sm" style={{ color: '#432818' }}>
            Cabeçalho do Quiz
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-8">
            <TabsTrigger value="general" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="logo" className="text-xs">
              <Image className="h-3 w-3 mr-1" />
              Logo
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs">
              <Palette className="h-3 w-3 mr-1" />
              Estilo
            </TabsTrigger>
            <TabsTrigger value="layout" className="text-xs">
              <Scale className="h-3 w-3 mr-1" />
              Layout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 m-0">
            <Card className="border" style={{ borderColor: '#E5DDD5' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: '#432818' }}>
                  Controles Principais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Habilitar Cabeçalho
                  </Label>
                  <Switch
                    checked={properties.enabled !== false}
                    onCheckedChange={checked => handlePropertyUpdate('enabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Mostrar Logo
                  </Label>
                  <Switch
                    checked={properties.showLogo !== false}
                    onCheckedChange={checked => handlePropertyUpdate('showLogo', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Barra Decorativa
                  </Label>
                  <Switch
                    checked={properties.showDecorativeBar !== false}
                    onCheckedChange={checked => handlePropertyUpdate('showDecorativeBar', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border" style={{ borderColor: '#E5DDD5' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: '#432818' }}>
                  Escala Geral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs" style={{ color: '#6B4F43' }}>
                      Tamanho
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {properties.scale || 100}%
                    </Badge>
                  </div>
                  <Slider
                    value={[properties.scale || 100]}
                    onValueChange={([value]) => handlePropertyUpdate('scale', value)}
                    min={50}
                    max={110}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs" style={{ color: '#6B4F43' }}>
                    <span>50%</span>
                    <span>100%</span>
                    <span>110%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logo" className="space-y-4 m-0">
            <Card className="border" style={{ borderColor: '#E5DDD5' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: '#432818' }}>
                  Upload da Logo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    URL da Logo
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={properties.logoUrl || ''}
                      onChange={e => handlePropertyUpdate('logoUrl', e.target.value)}
                      placeholder="https://..."
                      className="text-xs"
                      style={{ borderColor: '#E5DDD5' }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      style={{ borderColor: '#B89B7A', color: '#B89B7A' }}
                    >
                      <Upload className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Texto Alternativo
                  </Label>
                  <Input
                    value={properties.logoAlt || 'Logo'}
                    onChange={e => handlePropertyUpdate('logoAlt', e.target.value)}
                    className="text-xs mt-1"
                    style={{ borderColor: '#E5DDD5' }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs" style={{ color: '#6B4F43' }}>
                      Tamanho da Logo
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {properties.logoSize || 100}px
                    </Badge>
                  </div>
                  <Slider
                    value={[properties.logoSize || 100]}
                    onValueChange={([value]) => handlePropertyUpdate('logoSize', value)}
                    min={50}
                    max={200}
                    step={10}
                    className="w-full"
                  />
                </div>

                {/* Preview da logo */}
                {properties.logoUrl && (
                  <div className="mt-3 p-2 border rounded" style={{ borderColor: '#E5DDD5' }}>
                    <div className="text-xs mb-2" style={{ color: '#6B4F43' }}>
                      Preview:
                    </div>
                    <img
                      src={properties.logoUrl}
                      alt={properties.logoAlt || 'Logo'}
                      style={{
                        height: `${Math.min((properties.logoSize || 100) * 0.5, 60)}px`,
                        width: 'auto',
                        maxWidth: '100%',
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="style" className="space-y-4 m-0">
            <Card className="border" style={{ borderColor: '#E5DDD5' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: '#432818' }}>
                  Barra Decorativa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ColorPicker
                  value={properties.barColor || '#B89B7A'}
                  onChange={color => handlePropertyUpdate('barColor', color)}
                  label="Cor da Barra"
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs" style={{ color: '#6B4F43' }}>
                      Espessura
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {properties.barHeight || 4}px
                    </Badge>
                  </div>
                  <Slider
                    value={[properties.barHeight || 4]}
                    onValueChange={([value]) => handlePropertyUpdate('barHeight', value)}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Posição
                  </Label>
                  <Select
                    value={properties.barPosition || 'bottom'}
                    onValueChange={value => handlePropertyUpdate('barPosition', value)}
                  >
                    <SelectTrigger className="text-xs h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Superior</SelectItem>
                      <SelectItem value="bottom">Inferior</SelectItem>
                      <SelectItem value="both">Ambas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border" style={{ borderColor: '#E5DDD5' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: '#432818' }}>
                  Cor de Fundo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ColorPicker
                  value={properties.backgroundColor || 'transparent'}
                  onChange={color => handlePropertyUpdate('backgroundColor', color)}
                  label="Cor de Fundo"
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs" style={{ color: '#6B4F43' }}>
                      Opacidade
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {properties.backgroundOpacity || 100}%
                    </Badge>
                  </div>
                  <Slider
                    value={[properties.backgroundOpacity || 100]}
                    onValueChange={([value]) => handlePropertyUpdate('backgroundOpacity', value)}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4 m-0">
            <Card className="border" style={{ borderColor: '#E5DDD5' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: '#432818' }}>
                  Alinhamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Posição
                  </Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Button
                      variant={properties.alignment === 'left' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePropertyUpdate('alignment', 'left')}
                      className="text-xs"
                      style={{
                        backgroundColor:
                          properties.alignment === 'left' ? '#B89B7A' : 'transparent',
                        borderColor: '#B89B7A',
                        color: properties.alignment === 'left' ? '#FEFEFE' : '#B89B7A',
                      }}
                    >
                      <AlignLeft className="h-3 w-3 mr-1" />
                      Esq.
                    </Button>
                    <Button
                      variant={properties.alignment === 'center' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePropertyUpdate('alignment', 'center')}
                      className="text-xs"
                      style={{
                        backgroundColor:
                          properties.alignment === 'center' || !properties.alignment
                            ? '#B89B7A'
                            : 'transparent',
                        borderColor: '#B89B7A',
                        color:
                          properties.alignment === 'center' || !properties.alignment
                            ? '#FEFEFE'
                            : '#B89B7A',
                      }}
                    >
                      <AlignCenter className="h-3 w-3 mr-1" />
                      Centro
                    </Button>
                    <Button
                      variant={properties.alignment === 'right' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePropertyUpdate('alignment', 'right')}
                      className="text-xs"
                      style={{
                        backgroundColor:
                          properties.alignment === 'right' ? '#B89B7A' : 'transparent',
                        borderColor: '#B89B7A',
                        color: properties.alignment === 'right' ? '#FEFEFE' : '#B89B7A',
                      }}
                    >
                      <AlignRight className="h-3 w-3 mr-1" />
                      Dir.
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="border-t p-3" style={{ borderColor: '#E5DDD5' }}>
        <div className="text-xs" style={{ color: '#6B4F43' }}>
          Configurações salvas automaticamente
        </div>
      </div>
    </div>
  );
};
