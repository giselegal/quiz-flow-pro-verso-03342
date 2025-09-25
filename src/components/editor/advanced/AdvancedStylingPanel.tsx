import React, { useState, useCallback } from 'react';
import { Block } from '@/types/editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Type, 
  Layout, 
  Sparkles, 
  Copy, 
  Undo2,
  Eye,
  Code2
} from 'lucide-react';

interface AdvancedStylingPanelProps {
  block: Block | null;
  onStyleUpdate: (blockId: string, styles: any) => void;
  onClose: () => void;
}

interface ThemePreset {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  effects: {
    shadow: boolean;
    gradient: boolean;
    animation: string;
  };
}

const themePresets: ThemePreset[] = [
  {
    id: 'modern',
    name: 'Moderno',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif'
    },
    effects: {
      shadow: true,
      gradient: false,
      animation: 'slide-in'
    }
  },
  {
    id: 'elegant',
    name: 'Elegante',
    colors: {
      primary: '#1f2937',
      secondary: '#6b7280',
      accent: '#f3f4f6',
      background: '#ffffff',
      text: '#111827'
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Source Sans Pro, sans-serif'
    },
    effects: {
      shadow: true,
      gradient: false,
      animation: 'fade-in'
    }
  },
  {
    id: 'vibrant',
    name: 'Vibrante',
    colors: {
      primary: '#ec4899',
      secondary: '#8b5cf6',
      accent: '#f59e0b',
      background: '#fef7ff',
      text: '#701a75'
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Nunito, sans-serif'
    },
    effects: {
      shadow: true,
      gradient: true,
      animation: 'bounce-in'
    }
  }
];

export const AdvancedStylingPanel: React.FC<AdvancedStylingPanelProps> = ({
  block,
  onStyleUpdate,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('colors');
  const [previewMode, setPreviewMode] = useState(false);
  const [customStyles, setCustomStyles] = useState<any>({});

  const handleStyleChange = useCallback((property: string, value: any) => {
    const newStyles = { ...customStyles, [property]: value };
    setCustomStyles(newStyles);
    
    if (block) {
      onStyleUpdate(block.id, newStyles);
    }
  }, [block, customStyles, onStyleUpdate]);

  const applyPreset = useCallback((preset: ThemePreset) => {
    const presetStyles = {
      backgroundColor: preset.colors.background,
      color: preset.colors.text,
      fontFamily: preset.fonts.body,
      '--primary-color': preset.colors.primary,
      '--secondary-color': preset.colors.secondary,
      '--accent-color': preset.colors.accent,
      boxShadow: preset.effects.shadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
      background: preset.effects.gradient 
        ? `linear-gradient(135deg, ${preset.colors.primary}, ${preset.colors.secondary})`
        : preset.colors.background,
      animation: preset.effects.animation,
    };

    setCustomStyles(presetStyles);
    
    if (block) {
      onStyleUpdate(block.id, presetStyles);
    }
  }, [block, onStyleUpdate]);

  if (!block) {
    return (
      <Card className="w-80">
        <CardContent className="p-6 text-center text-muted-foreground">
          <Palette className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Selecione um bloco para personalizar o estilo</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-96 max-h-[700px] overflow-hidden flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Estilo Avançado
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={previewMode ? 'default' : 'outline'}
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Code2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{block.type}</Badge>
          <Badge variant="outline">#{block.id.slice(-6)}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors" className="text-xs">
              <Palette className="w-3 h-3 mr-1" />
              Cores
            </TabsTrigger>
            <TabsTrigger value="typography" className="text-xs">
              <Type className="w-3 h-3 mr-1" />
              Texto
            </TabsTrigger>
            <TabsTrigger value="layout" className="text-xs">
              <Layout className="w-3 h-3 mr-1" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="effects" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Efeitos
            </TabsTrigger>
          </TabsList>

          {/* Theme Presets */}
          <div className="mt-4 mb-6">
            <h4 className="text-sm font-semibold mb-3">Temas Predefinidos</h4>
            <div className="grid grid-cols-3 gap-2">
              {themePresets.map((preset) => (
                <Button
                  key={preset.id}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset)}
                  className="h-auto p-2 flex flex-col items-center gap-1"
                >
                  <div className="flex gap-1 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: preset.colors.primary }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: preset.colors.secondary }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: preset.colors.accent }}
                    />
                  </div>
                  <span className="text-xs">{preset.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <Separator className="mb-4" />

          <TabsContent value="colors" className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Cor Principal</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={customStyles.color || '#000000'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    value={customStyles.color || '#000000'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    className="flex-1 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm">Cor de Fundo</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={customStyles.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    value={customStyles.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="flex-1 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm">Cor da Borda</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={customStyles.borderColor || '#e5e7eb'}
                    onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    value={customStyles.borderColor || '#e5e7eb'}
                    onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                    className="flex-1 text-xs"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Tamanho da Fonte</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Slider
                    value={[parseInt(customStyles.fontSize?.replace('px', '') || '16')]}
                    onValueChange={([value]) => handleStyleChange('fontSize', `${value}px`)}
                    max={48}
                    min={8}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs w-12 text-center">
                    {customStyles.fontSize || '16px'}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-sm">Peso da Fonte</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Slider
                    value={[parseInt(customStyles.fontWeight || '400')]}
                    onValueChange={([value]) => handleStyleChange('fontWeight', value.toString())}
                    max={900}
                    min={100}
                    step={100}
                    className="flex-1"
                  />
                  <span className="text-xs w-12 text-center">
                    {customStyles.fontWeight || '400'}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-sm">Altura da Linha</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Slider
                    value={[parseFloat(customStyles.lineHeight || '1.5')]}
                    onValueChange={([value]) => handleStyleChange('lineHeight', value.toString())}
                    max={3}
                    min={1}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-xs w-12 text-center">
                    {customStyles.lineHeight || '1.5'}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Espaçamento Interno</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Slider
                    value={[parseInt(customStyles.padding?.replace('px', '') || '16')]}
                    onValueChange={([value]) => handleStyleChange('padding', `${value}px`)}
                    max={64}
                    min={0}
                    step={4}
                    className="flex-1"
                  />
                  <span className="text-xs w-12 text-center">
                    {customStyles.padding || '16px'}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-sm">Margem Externa</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Slider
                    value={[parseInt(customStyles.margin?.replace('px', '') || '8')]}
                    onValueChange={([value]) => handleStyleChange('margin', `${value}px`)}
                    max={64}
                    min={0}
                    step={4}
                    className="flex-1"
                  />
                  <span className="text-xs w-12 text-center">
                    {customStyles.margin || '8px'}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-sm">Raio da Borda</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Slider
                    value={[parseInt(customStyles.borderRadius?.replace('px', '') || '8')]}
                    onValueChange={([value]) => handleStyleChange('borderRadius', `${value}px`)}
                    max={32}
                    min={0}
                    step={2}
                    className="flex-1"
                  />
                  <span className="text-xs w-12 text-center">
                    {customStyles.borderRadius || '8px'}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Sombra</Label>
                <Switch
                  checked={!!customStyles.boxShadow}
                  onCheckedChange={(checked) => 
                    handleStyleChange('boxShadow', 
                      checked ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm">Gradiente</Label>
                <Switch
                  checked={!!customStyles.background?.includes('gradient')}
                  onCheckedChange={(checked) => 
                    handleStyleChange('background', 
                      checked 
                        ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                        : customStyles.backgroundColor || '#ffffff'
                    )
                  }
                />
              </div>

              <div>
                <Label className="text-sm">Opacidade</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Slider
                    value={[parseFloat(customStyles.opacity || '1')]}
                    onValueChange={([value]) => handleStyleChange('opacity', value.toString())}
                    max={1}
                    min={0}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-xs w-12 text-center">
                    {Math.round((parseFloat(customStyles.opacity || '1')) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Action Buttons */}
      <div className="border-t p-3 bg-muted/50 flex gap-2">
        <Button size="sm" className="flex-1">
          <Copy className="w-3 h-3 mr-1" />
          Copiar Estilo
        </Button>
        <Button size="sm" variant="outline" onClick={() => setCustomStyles({})}>
          <Undo2 className="w-3 h-3 mr-1" />
          Resetar
        </Button>
      </div>
    </Card>
  );
};