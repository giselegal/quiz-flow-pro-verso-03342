// src/components/steps/step01/IntroPropertiesPanel.tsx
// Painel de propriedades para o bloco de introdução da etapa 1

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { QUIZ_CONFIGURATION } from '@/config/quizConfiguration';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Image,
  Palette,
  RotateCcw,
  Scale,
  Settings,
  Type,
  Upload,
} from 'lucide-react';
import React, { useState } from 'react';

// Color picker para cores de fundo
const BackgroundColorPicker: React.FC<{
  value: string;
  onChange: (color: string) => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const brandColors = [
    'transparent',
    '#FEFEFE',
    '#FAF9F7',
    '#E5DDD5',
    '#B89B7A',
    '#6B4F43',
    '#432818',
  ];

  const backgroundPresets = ['#FFFFFF', '#F8F9FA', '#F1F3F4', '#E8EAED', '#DADCE0', '#F0F0F0'];

  return (
    <div className="space-y-3">
      <Label className="text-xs font-medium" style={{ color: '#6B4F43' }}>
        {label}
      </Label>

      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded border-2 cursor-pointer"
          style={{
            background:
              value === 'transparent'
                ? 'repeating-linear-gradient(45deg, #ccc 0, #ccc 2px, transparent 2px, transparent 10px)'
                : value,
            borderColor: '#E5DDD5',
          }}
          onClick={() => {
            if (value !== 'transparent') {
              const input = document.createElement('input');
              input.type = 'color';
              input.value = value.startsWith('#') ? value : '#FFFFFF';
              input.onchange = e => onChange((e.target as HTMLInputElement).value);
              input.click();
            }
          }}
        />
        <Input
          value={value}
          onChange={e => onChange(e.target.value)}
          className="text-xs h-8"
          style={{ borderColor: '#E5DDD5' }}
        />
      </div>

      {/* Cores da marca */}
      <div>
        <Label className="text-xs mb-2" style={{ color: '#6B4F43' }}>
          Cores da Marca
        </Label>
        <div className="grid grid-cols-7 gap-1">
          {brandColors.map(color => (
            <button
              key={color}
              className="w-6 h-6 rounded border hover:scale-110 transition-transform"
              style={{
                backgroundColor: color === 'transparent' ? 'white' : color,
                backgroundImage:
                  color === 'transparent'
                    ? 'repeating-linear-gradient(45deg, #ccc 0, #ccc 2px, transparent 2px, transparent 10px)'
                    : 'none',
                borderColor: '#E5DDD5',
              }}
              onClick={() => onChange(color)}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Presets de fundo */}
      <div>
        <Label className="text-xs mb-2" style={{ color: '#6B4F43' }}>
          Presets
        </Label>
        <div className="grid grid-cols-6 gap-1">
          {backgroundPresets.map(color => (
            <button
              key={color}
              className="w-6 h-6 rounded border hover:scale-110 transition-transform"
              style={{ backgroundColor: color, borderColor: '#E5DDD5' }}
              onClick={() => onChange(color)}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface IntroPropertiesPanelProps {
  selectedBlock?: any;
  onUpdate?: (blockId: string, updates: Record<string, any>) => void;
}

export const IntroPropertiesPanel: React.FC<IntroPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
}) => {
  const [activeTab, setActiveTab] = useState('content');

  const properties = selectedBlock?.properties || {};
  const introStep =
    QUIZ_CONFIGURATION.steps.find(step => step.type === 'intro') || QUIZ_CONFIGURATION.steps[0];

  const handlePropertyUpdate = (key: string, value: any) => {
    if (selectedBlock && onUpdate) {
      // Passar as atualizações como properties
      const updatedProperties = {
        ...properties,
        [key]: value,
      };

      onUpdate(selectedBlock.id, { properties: updatedProperties });
    }
  };

  const resetToDefault = () => {
    if (selectedBlock && onUpdate) {
      const defaultProperties = {
        title: introStep.title,
        descriptionTop: introStep.descriptionTop,
        descriptionBottom: introStep.descriptionBottom,
        imageIntro: introStep.imageIntro,
        inputLabel: introStep.inputLabel,
        inputPlaceholder: introStep.inputPlaceholder,
        buttonText: introStep.buttonText,
        privacyText: introStep.privacyText,
        footerText: introStep.footerText,
        required: introStep.required,
        scale: 100,
        alignment: 'center',
        backgroundColor: 'transparent',
        backgroundOpacity: 100,
      };

      onUpdate(selectedBlock.id, { properties: defaultProperties });
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#FEFEFE' }}>
      <div className="border-b p-3" style={{ borderColor: '#E5DDD5' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ backgroundColor: QUIZ_CONFIGURATION.design.primaryColor }}
            >
              <Settings className="h-3 w-3 text-white" />
            </div>
            <h2 className="font-semibold text-sm" style={{ color: '#432818' }}>
              Introdução - Etapa 1
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefault}
            style={{ borderColor: '#E5DDD5', color: '#6B4F43' }}
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-8">
            <TabsTrigger value="content" className="text-xs">
              <Type className="h-3 w-3 mr-1" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="image" className="text-xs">
              <Image className="h-3 w-3 mr-1" />
              Imagem
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

          <TabsContent value="content" className="space-y-4 m-0">
            <Card className="border" style={{ borderColor: '#E5DDD5' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: '#432818' }}>
                  Textos Principais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Título
                  </Label>
                  <Input
                    value={properties.title || introStep.title}
                    onChange={e => handlePropertyUpdate('title', e.target.value)}
                    className="text-xs mt-1"
                    style={{ borderColor: '#E5DDD5' }}
                  />
                </div>

                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Descrição Superior
                  </Label>
                  <Textarea
                    value={properties.descriptionTop || introStep.descriptionTop}
                    onChange={e => handlePropertyUpdate('descriptionTop', e.target.value)}
                    className="text-xs min-h-[60px] mt-1"
                    style={{ borderColor: '#E5DDD5' }}
                  />
                </div>

                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Descrição Inferior
                  </Label>
                  <Textarea
                    value={properties.descriptionBottom || introStep.descriptionBottom}
                    onChange={e => handlePropertyUpdate('descriptionBottom', e.target.value)}
                    className="text-xs min-h-[60px] mt-1"
                    style={{ borderColor: '#E5DDD5' }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border" style={{ borderColor: '#E5DDD5' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: '#432818' }}>
                  Input do Usuário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Label do Input
                  </Label>
                  <Input
                    value={properties.inputLabel || introStep.inputLabel}
                    onChange={e => handlePropertyUpdate('inputLabel', e.target.value)}
                    className="text-xs mt-1"
                    style={{ borderColor: '#E5DDD5' }}
                  />
                </div>

                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Placeholder
                  </Label>
                  <Input
                    value={properties.inputPlaceholder || introStep.inputPlaceholder}
                    onChange={e => handlePropertyUpdate('inputPlaceholder', e.target.value)}
                    className="text-xs mt-1"
                    style={{ borderColor: '#E5DDD5' }}
                  />
                </div>

                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Texto do Botão
                  </Label>
                  <Input
                    value={properties.buttonText || introStep.buttonText}
                    onChange={e => handlePropertyUpdate('buttonText', e.target.value)}
                    className="text-xs mt-1"
                    style={{ borderColor: '#E5DDD5' }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Campo Obrigatório
                  </Label>
                  <Switch
                    checked={
                      properties.required !== undefined ? properties.required : introStep.required
                    }
                    onCheckedChange={checked => handlePropertyUpdate('required', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border" style={{ borderColor: '#E5DDD5' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: '#432818' }}>
                  Textos Secundários
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Texto de Privacidade
                  </Label>
                  <Textarea
                    value={properties.privacyText || introStep.privacyText}
                    onChange={e => handlePropertyUpdate('privacyText', e.target.value)}
                    className="text-xs min-h-[40px] mt-1"
                    style={{ borderColor: '#E5DDD5' }}
                  />
                </div>

                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Texto do Footer
                  </Label>
                  <Input
                    value={properties.footerText || introStep.footerText}
                    onChange={e => handlePropertyUpdate('footerText', e.target.value)}
                    className="text-xs mt-1"
                    style={{ borderColor: '#E5DDD5' }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="image" className="space-y-4 m-0">
            <Card className="border" style={{ borderColor: '#E5DDD5' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: '#432818' }}>
                  Imagem de Introdução
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    URL da Imagem
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={properties.imageIntro || introStep.imageIntro}
                      onChange={e => handlePropertyUpdate('imageIntro', e.target.value)}
                      placeholder="https://..."
                      className="text-xs"
                      style={{ borderColor: '#E5DDD5' }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      style={{
                        borderColor: QUIZ_CONFIGURATION.design.primaryColor,
                        color: QUIZ_CONFIGURATION.design.primaryColor,
                      }}
                    >
                      <Upload className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Preview da imagem */}
                {(properties.imageIntro || introStep.imageIntro) && (
                  <div className="mt-3 p-2 border rounded" style={{ borderColor: '#E5DDD5' }}>
                    <div className="text-xs mb-2" style={{ color: '#6B4F43' }}>
                      Preview:
                    </div>
                    <img
                      src={properties.imageIntro || introStep.imageIntro}
                      alt="Preview da imagem"
                      className="w-full max-h-40 object-cover rounded"
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
                  Cor de Fundo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <BackgroundColorPicker
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
                  Escala e Alinhamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Escala */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs" style={{ color: '#6B4F43' }}>
                      Escala
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

                {/* Alinhamento */}
                <div>
                  <Label className="text-xs mb-2" style={{ color: '#6B4F43' }}>
                    Alinhamento
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={properties.alignment === 'left' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePropertyUpdate('alignment', 'left')}
                      className="text-xs"
                      style={{
                        backgroundColor:
                          properties.alignment === 'left'
                            ? QUIZ_CONFIGURATION.design.primaryColor
                            : 'transparent',
                        borderColor: QUIZ_CONFIGURATION.design.primaryColor,
                        color:
                          properties.alignment === 'left'
                            ? '#FEFEFE'
                            : QUIZ_CONFIGURATION.design.primaryColor,
                      }}
                    >
                      <AlignLeft className="h-3 w-3 mr-1" />
                      Esq.
                    </Button>
                    <Button
                      variant={
                        properties.alignment === 'center' || !properties.alignment
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() => handlePropertyUpdate('alignment', 'center')}
                      className="text-xs"
                      style={{
                        backgroundColor:
                          properties.alignment === 'center' || !properties.alignment
                            ? QUIZ_CONFIGURATION.design.primaryColor
                            : 'transparent',
                        borderColor: QUIZ_CONFIGURATION.design.primaryColor,
                        color:
                          properties.alignment === 'center' || !properties.alignment
                            ? '#FEFEFE'
                            : QUIZ_CONFIGURATION.design.primaryColor,
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
                          properties.alignment === 'right'
                            ? QUIZ_CONFIGURATION.design.primaryColor
                            : 'transparent',
                        borderColor: QUIZ_CONFIGURATION.design.primaryColor,
                        color:
                          properties.alignment === 'right'
                            ? '#FEFEFE'
                            : QUIZ_CONFIGURATION.design.primaryColor,
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
        <div className="flex items-center justify-between">
          <div className="text-xs" style={{ color: '#6B4F43' }}>
            Configurações baseadas no JSON
          </div>
          <Badge variant="outline" className="text-xs">
            Etapa 1/21
          </Badge>
        </div>
      </div>
    </div>
  );
};
