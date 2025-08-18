/**
 * 🎨 CanvasSettings - Configurações visuais do canvas
 * Permite alterar cor de fundo e outras propriedades visuais do canvas
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Monitor, Palette, Settings, Smartphone, Tablet } from 'lucide-react';
import React, { useState } from 'react';

interface CanvasSettingsProps {
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  className?: string;
}

const CanvasSettings: React.FC<CanvasSettingsProps> = ({
  backgroundColor = '#FFFFFF',
  onBackgroundColorChange,
  className = '',
}) => {
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const viewportSizes = {
    desktop: { icon: Monitor, label: 'Desktop', width: '100%' },
    tablet: { icon: Tablet, label: 'Tablet', width: '768px' },
    mobile: { icon: Smartphone, label: 'Mobile', width: '375px' },
  };

  const presetBackgrounds = [
    { value: '#FFFFFF', label: 'Branco', preview: true },
    { value: '#F9F5F1', label: 'Creme', preview: true },
    { value: '#FAF9F7', label: 'Off-White', preview: true },
    { value: '#F3F4F6', label: 'Cinza Muito Claro', preview: true },
    { value: '#E5E7EB', label: 'Cinza Claro', preview: true },
    { value: '#432818', label: 'Marrom Escuro', preview: true },
    { value: 'transparent', label: 'Transparente', preview: false },
  ];

  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="w-5 h-5" />
            Configurações do Canvas
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Cor de Fundo do Canvas */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Cor de Fundo do Canvas
            </Label>

            {/* Presets Rápidos */}
            <div className="grid grid-cols-4 gap-2">
              {presetBackgrounds.map(preset => (
                <button
                  key={preset.value}
                  onClick={() => onBackgroundColorChange(preset.value)}
                  className={`
                    relative h-12 rounded-lg border-2 transition-all hover:scale-105 flex items-center justify-center
                    ${
                      backgroundColor === preset.value
                        ? 'border-[#B89B7A] ring-2 ring-[#B89B7A]/20'
                        : 'border-gray-200 hover:border-[#B89B7A]'
                    }
                  `}
                  style={{
                    backgroundColor: preset.value === 'transparent' ? 'transparent' : preset.value,
                  }}
                  title={preset.label}
                >
                  {preset.value === 'transparent' && (
                    <div
                      className="absolute inset-0 rounded-lg"
                      style={{
                        backgroundImage:
                          'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                        backgroundSize: '8px 8px',
                        backgroundPosition: '0 0, 0 4px, 4px -4px, 4px 0px',
                      }}
                    />
                  )}
                  <span className="text-xs font-medium absolute bottom-0 left-0 right-0 bg-black/75 text-white py-1 rounded-b-lg text-center">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Color Picker Completo */}
            <ColorPicker
              value={backgroundColor}
              onChange={onBackgroundColorChange}
              label="Personalizar Cor"
              showPreview={true}
              className="mt-3"
            />
          </div>

          {/* Modo de Visualização */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Modo de Visualização
            </Label>

            <Select value={viewportMode} onValueChange={(value: any) => setViewportMode(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar modo de visualização" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(viewportSizes).map(([key, config]) => {
                  const IconComponent = config.icon;
                  if (!key || key === '') return null;
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <span>{config.label}</span>
                        <span style={{ color: '#8B7355' }}>({config.width})</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Preview do Canvas */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Preview</Label>
            <div style={{ borderColor: '#E5DDD5' }}>
              <div style={{ borderColor: '#E5DDD5', backgroundColor }}>
                {backgroundColor === 'transparent' && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                      backgroundSize: '12px 12px',
                      backgroundPosition: '0 0, 0 6px, 6px -6px, 6px 0px',
                    }}
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-8 bg-[#B89B7A] rounded mb-2 mx-auto"></div>
                    <div style={{ color: '#8B7355' }}>Canvas Preview</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reset */}
          <Button
            variant="outline"
            onClick={() => onBackgroundColorChange('#FFFFFF')}
            className="w-full"
          >
            Restaurar Padrão (#FFFFFF)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CanvasSettings;
