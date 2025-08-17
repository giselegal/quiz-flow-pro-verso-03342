// @ts-nocheck
// src/components/editor/quiz/QuizHeaderPropertiesPanel.tsx
// Painel de propriedades específico para o cabeçalho do quiz

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEditor } from '@/context/EditorContext';
import { Eye, Image, Palette, Scale, Settings, Upload, Award } from 'lucide-react';
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

import { HeaderProperties, defaultHeaderProperties } from '@/config/headerPropertiesMapping';
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

  const properties = (selectedBlock?.properties as HeaderProperties) || defaultHeaderProperties;

  const handlePropertyUpdate = (key: keyof HeaderProperties, value: any) => {
    if (selectedBlock && onUpdate) {
      const updatedProperties = {
        ...properties,
        [key]: value,
      } as HeaderProperties;

      onUpdate(selectedBlock.id, updatedProperties);
    }
  };

  // ✅ NOVO: Acesso ao sistema de quiz
  const { quizState } = useEditor();

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
          <TabsList className="grid w-full grid-cols-5 h-8">
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
            <TabsTrigger value="results" className="text-xs">
              <Award className="h-3 w-3 mr-1" />
              Resultados
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
                    Barra de Progresso
                  </Label>
                  <Switch
                    checked={properties.showProgress}
                    onCheckedChange={checked => handlePropertyUpdate('showProgress', checked)}
                  />
                </div>

                {properties.showProgress && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs" style={{ color: '#6B4F43' }}>
                          Valor do Progresso
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          {properties.progressValue}%
                        </Badge>
                      </div>
                      <Slider
                        value={[properties.progressValue]}
                        onValueChange={([value]) => handlePropertyUpdate('progressValue', value)}
                        min={0}
                        max={properties.progressMax}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs" style={{ color: '#6B4F43' }}>
                          Valor Máximo
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          {properties.progressMax}
                        </Badge>
                      </div>
                      <Slider
                        value={[properties.progressMax]}
                        onValueChange={([value]) => handlePropertyUpdate('progressMax', value)}
                        min={1}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between">
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Botão Voltar
                  </Label>
                  <Switch
                    checked={properties.showBackButton}
                    onCheckedChange={checked => handlePropertyUpdate('showBackButton', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Fixar no Topo
                  </Label>
                  <Switch
                    checked={properties.isSticky}
                    onCheckedChange={checked => handlePropertyUpdate('isSticky', checked)}
                  />
                </div>

                {/* ✅ NOVO: Controles de Pontuação */}
                <div className="flex items-center justify-between">
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Mostrar Pontuação
                  </Label>
                  <Switch
                    checked={properties.showScore || false}
                    onCheckedChange={checked => handlePropertyUpdate('showScore', checked)}
                  />
                </div>

                {properties.showScore && (
                  <div className="space-y-2 p-2 rounded" style={{ backgroundColor: '#FAF9F7' }}>
                    <div className="text-xs font-medium" style={{ color: '#432818' }}>
                      Status do Quiz
                    </div>
                    <div className="text-xs" style={{ color: '#6B4F43' }}>
                      Respostas: {Object.keys(quizState.userAnswers).length}/10
                    </div>
                    {quizState.currentScore && (
                      <>
                        <div className="text-xs" style={{ color: '#6B4F43' }}>
                          Pontuação: {quizState.currentScore.percentage}%
                        </div>
                        <div className="text-xs" style={{ color: '#6B4F43' }}>
                          Perfil: {quizState.currentScore.profile}
                        </div>
                      </>
                    )}
                    {quizState.isQuizCompleted && (
                      <Badge variant="outline" className="text-xs">
                        Quiz Completo
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logo" className="space-y-4 m-0">
            <Card className="border" style={{ borderColor: '#E5DDD5' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: '#432818' }}>
                  Configurações da Logo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    URL da Logo
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={properties.logoUrl}
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
                    value={properties.logoAlt}
                    onChange={e => handlePropertyUpdate('logoAlt', e.target.value)}
                    className="text-xs mt-1"
                    style={{ borderColor: '#E5DDD5' }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs" style={{ color: '#6B4F43' }}>
                      Largura
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {properties.logoWidth}px
                    </Badge>
                  </div>
                  <Slider
                    value={[properties.logoWidth]}
                    onValueChange={([value]) => handlePropertyUpdate('logoWidth', value)}
                    min={50}
                    max={400}
                    step={10}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs" style={{ color: '#6B4F43' }}>
                      Altura
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {properties.logoHeight}px
                    </Badge>
                  </div>
                  <Slider
                    value={[properties.logoHeight]}
                    onValueChange={([value]) => handlePropertyUpdate('logoHeight', value)}
                    min={50}
                    max={400}
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
                      alt={properties.logoAlt}
                      style={{
                        width: `${properties.logoWidth}px`,
                        height: `${properties.logoHeight}px`,
                        objectFit: 'contain',
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
                  Aparência
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ColorPicker
                  value={properties.backgroundColor}
                  onChange={color => handlePropertyUpdate('backgroundColor', color)}
                  label="Cor de Fundo"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4 m-0">
            <Card className="border" style={{ borderColor: '#E5DDD5' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: '#432818' }}>
                  Espaçamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs" style={{ color: '#6B4F43' }}>
                      Margem Superior
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {properties.marginTop}px
                    </Badge>
                  </div>
                  <Slider
                    value={[properties.marginTop]}
                    onValueChange={([value]) => handlePropertyUpdate('marginTop', value)}
                    min={0}
                    max={100}
                    step={4}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs" style={{ color: '#6B4F43' }}>
                      Margem Inferior
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {properties.marginBottom}px
                    </Badge>
                  </div>
                  <Slider
                    value={[properties.marginBottom]}
                    onValueChange={([value]) => handlePropertyUpdate('marginBottom', value)}
                    min={0}
                    max={100}
                    step={4}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4 m-0">
            <Card className="border" style={{ borderColor: '#E5DDD5' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: '#432818' }}>
                  Estilo Predominante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Nome do Estilo
                  </Label>
                  <Switch
                    checked={properties.showPredominantStyleName ?? true}
                    onCheckedChange={checked =>
                      handlePropertyUpdate('showPredominantStyleName', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Descrição do Estilo
                  </Label>
                  <Switch
                    checked={properties.showPredominantStyleDescription ?? true}
                    onCheckedChange={checked =>
                      handlePropertyUpdate('showPredominantStyleDescription', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Barra de Porcentagem
                  </Label>
                  <Switch
                    checked={properties.showPredominantStylePercentage ?? true}
                    onCheckedChange={checked =>
                      handlePropertyUpdate('showPredominantStylePercentage', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Imagem do Estilo
                  </Label>
                  <Switch
                    checked={properties.showPredominantStyleImage ?? true}
                    onCheckedChange={checked =>
                      handlePropertyUpdate('showPredominantStyleImage', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Imagem do Guia
                  </Label>
                  <Switch
                    checked={properties.showPredominantStyleGuide ?? false}
                    onCheckedChange={checked =>
                      handlePropertyUpdate('showPredominantStyleGuide', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border" style={{ borderColor: '#E5DDD5' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: '#432818' }}>
                  Estilos Secundários
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Nome do 2º Estilo
                  </Label>
                  <Switch
                    checked={properties.showSecondaryStyleName ?? true}
                    onCheckedChange={checked =>
                      handlePropertyUpdate('showSecondaryStyleName', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Barra do 2º Estilo
                  </Label>
                  <Switch
                    checked={properties.showSecondaryStylePercentage ?? true}
                    onCheckedChange={checked =>
                      handlePropertyUpdate('showSecondaryStylePercentage', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Nome do 3º Estilo
                  </Label>
                  <Switch
                    checked={properties.showThirdStyleName ?? true}
                    onCheckedChange={checked => handlePropertyUpdate('showThirdStyleName', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Barra do 3º Estilo
                  </Label>
                  <Switch
                    checked={properties.showThirdStylePercentage ?? true}
                    onCheckedChange={checked =>
                      handlePropertyUpdate('showThirdStylePercentage', checked)
                    }
                  />
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
