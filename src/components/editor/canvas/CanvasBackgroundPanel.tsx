// src/components/editor/canvas/CanvasBackgroundPanel.tsx
// Painel para configurar cores de fundo do canvas

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
import { Palette, RotateCcw } from 'lucide-react';

// Color picker integrado
const CanvasColorPicker: React.FC<{
  value: string;
  onChange: (color: string) => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const brandColors = ['#FEFEFE', '#FAF9F7', '#E5DDD5', '#B89B7A', '#6B4F43', '#432818'];

  const backgroundPresets = [
    '#FFFFFF',
    '#F8F9FA',
    '#F1F3F4',
    '#E8EAED',
    '#DADCE0',
    '#BDC1C6',
    '#9AA0A6',
    '#5F6368',
    '#3C4043',
    '#202124',
    '#000000',
    'transparent',
  ];

  const gradients = [
    'linear-gradient(135deg, #FEFEFE 0%, #FAF9F7 100%)',
    'linear-gradient(135deg, #B89B7A 0%, #6B4F43 100%)',
    'linear-gradient(135deg, #E5DDD5 0%, #B89B7A 100%)',
    'radial-gradient(circle, #FEFEFE 0%, #E5DDD5 100%)',
  ];

  return (
    <div className="space-y-3">
      <Label className="text-xs font-medium" style={{ color: '#6B4F43' }}>
        {label}
      </Label>

      {/* Cor atual */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded border-2 cursor-pointer"
          style={{ background: value, borderColor: '#E5DDD5' }}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'color';
            input.value = value.startsWith('#') ? value : '#FFFFFF';
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

      {/* Cores da marca */}
      <div>
        <Label className="text-xs mb-2" style={{ color: '#6B4F43' }}>
          Cores da Marca
        </Label>
        <div className="grid grid-cols-6 gap-1">
          {brandColors.map(color => (
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

      {/* Presets de fundo */}
      <div>
        <Label className="text-xs mb-2" style={{ color: '#6B4F43' }}>
          Presets de Fundo
        </Label>
        <div className="grid grid-cols-6 gap-1">
          {backgroundPresets.map(color => (
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

      {/* Gradientes */}
      <div>
        <Label className="text-xs mb-2" style={{ color: '#6B4F43' }}>
          Gradientes
        </Label>
        <div className="grid grid-cols-2 gap-1">
          {gradients.map((gradient, index) => (
            <button
              key={index}
              className="w-full h-6 rounded border hover:scale-105 transition-transform"
              style={{ background: gradient, borderColor: '#E5DDD5' }}
              onClick={() => onChange(gradient)}
              title={`Gradiente ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface CanvasBackgroundPanelProps {
  canvasProperties?: {
    backgroundColor?: string;
    backgroundOpacity?: number;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
  };
  onUpdate?: (updates: Record<string, any>) => void;
}

export const CanvasBackgroundPanel: React.FC<CanvasBackgroundPanelProps> = ({
  canvasProperties = {},
  onUpdate,
}) => {
  const {
    backgroundColor = '#FEFEFE',
    backgroundOpacity = 100,
    backgroundImage = '',
    backgroundSize = 'cover',
    backgroundPosition = 'center',
    backgroundRepeat = 'no-repeat',
  } = canvasProperties;

  const handleUpdate = (key: string, value: any) => {
    if (onUpdate) {
      onUpdate({ [key]: value });
    }
  };

  const resetToDefault = () => {
    if (onUpdate) {
      onUpdate({
        backgroundColor: '#FEFEFE',
        backgroundOpacity: 100,
        backgroundImage: '',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      });
    }
  };

  return (
    <Card className="border" style={{ borderColor: '#E5DDD5' }}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2" style={{ color: '#432818' }}>
            <Palette className="h-4 w-4" />
            Fundo do Canvas
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefault}
            style={{ borderColor: '#E5DDD5', color: '#6B4F43' }}
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cor de fundo */}
        <CanvasColorPicker
          value={backgroundColor}
          onChange={color => handleUpdate('backgroundColor', color)}
          label="Cor de Fundo"
        />

        {/* Opacidade */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs" style={{ color: '#6B4F43' }}>
              Opacidade
            </Label>
            <Badge variant="outline" className="text-xs">
              {backgroundOpacity}%
            </Badge>
          </div>
          <Slider
            value={[backgroundOpacity]}
            onValueChange={([value]) => handleUpdate('backgroundOpacity', value)}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        {/* Imagem de fundo */}
        <div>
          <Label className="text-xs" style={{ color: '#6B4F43' }}>
            Imagem de Fundo (URL)
          </Label>
          <Input
            value={backgroundImage}
            onChange={e => handleUpdate('backgroundImage', e.target.value)}
            placeholder="https://..."
            className="text-xs mt-1"
            style={{ borderColor: '#E5DDD5' }}
          />
        </div>

        {/* Configurações da imagem de fundo */}
        {backgroundImage && (
          <div
            className="space-y-3 p-2 rounded border"
            style={{ borderColor: '#E5DDD5', backgroundColor: '#FAF9F7' }}
          >
            <div>
              <Label className="text-xs" style={{ color: '#6B4F43' }}>
                Tamanho
              </Label>
              <Select
                value={backgroundSize}
                onValueChange={value => handleUpdate('backgroundSize', value)}
              >
                <SelectTrigger className="text-xs h-8 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">Cobrir (cover)</SelectItem>
                  <SelectItem value="contain">Conter (contain)</SelectItem>
                  <SelectItem value="auto">Automático</SelectItem>
                  <SelectItem value="100% 100%">Esticar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs" style={{ color: '#6B4F43' }}>
                Posição
              </Label>
              <Select
                value={backgroundPosition}
                onValueChange={value => handleUpdate('backgroundPosition', value)}
              >
                <SelectTrigger className="text-xs h-8 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="center">Centro</SelectItem>
                  <SelectItem value="top">Topo</SelectItem>
                  <SelectItem value="bottom">Base</SelectItem>
                  <SelectItem value="left">Esquerda</SelectItem>
                  <SelectItem value="right">Direita</SelectItem>
                  <SelectItem value="top left">Topo Esquerda</SelectItem>
                  <SelectItem value="top right">Topo Direita</SelectItem>
                  <SelectItem value="bottom left">Base Esquerda</SelectItem>
                  <SelectItem value="bottom right">Base Direita</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs" style={{ color: '#6B4F43' }}>
                Repetição
              </Label>
              <Select
                value={backgroundRepeat}
                onValueChange={value => handleUpdate('backgroundRepeat', value)}
              >
                <SelectTrigger className="text-xs h-8 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-repeat">Não repetir</SelectItem>
                  <SelectItem value="repeat">Repetir</SelectItem>
                  <SelectItem value="repeat-x">Repetir horizontalmente</SelectItem>
                  <SelectItem value="repeat-y">Repetir verticalmente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Preview */}
        <div>
          <Label className="text-xs mb-2" style={{ color: '#6B4F43' }}>
            Preview
          </Label>
          <div
            className="w-full h-12 rounded border"
            style={{
              backgroundColor,
              backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
              backgroundSize,
              backgroundPosition,
              backgroundRepeat,
              opacity: backgroundOpacity / 100,
              borderColor: '#E5DDD5',
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
