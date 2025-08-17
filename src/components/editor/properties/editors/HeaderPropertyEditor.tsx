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
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Block } from '@/types/editor';
import { Eye, Image, Layout, Palette, Type, Upload } from 'lucide-react';
import React, { useState } from 'react';
import { PropertyInput } from '../components/PropertyInput';
import { PropertySlider } from '../components/PropertySlider';

interface HeaderPropertyEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  isPreviewMode?: boolean;
}

// Color picker component
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
  ];

  return (
    <div className="space-y-3">
      <Label className="text-xs font-medium text-[#6B4F43]">{label}</Label>
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
        <Input value={value} onChange={e => onChange(e.target.value)} className="text-xs h-8" />
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

export const HeaderPropertyEditor: React.FC<HeaderPropertyEditorProps> = ({
  block,
  onUpdate,
  isPreviewMode = false,
}) => {
  const [activeTab, setActiveTab] = useState('general');

  // Propriedades consolidadas (combina content e properties para compatibilidade)
  const properties = {
    // Conteúdo básico
    title: block.content?.title || block.properties?.title || '',
    subtitle: block.content?.subtitle || block.properties?.subtitle || '',
    headerType: block.content?.headerType || block.properties?.headerType || 'main',

    // Logo
    logoUrl:
      block.content?.logoUrl ||
      block.properties?.logoUrl ||
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    logoAlt: block.content?.logoAlt || block.properties?.logoAlt || 'Logo Gisele Galvão',
    logoWidth: block.content?.logoWidth || block.properties?.logoWidth || 120,
    logoHeight: block.content?.logoHeight || block.properties?.logoHeight || 50,
    showLogo: block.content?.showLogo ?? block.properties?.showLogo ?? true,
    logoScale: block.content?.logoScale || block.properties?.logoScale || 100,

    // Progresso
    showProgress: block.content?.showProgress ?? block.properties?.showProgress ?? true,
    progressValue: block.content?.progressValue || block.properties?.progressValue || 1,
    progressMax: block.content?.progressMax || block.properties?.progressMax || 21,
    progressBarThickness:
      block.content?.progressBarThickness || block.properties?.progressBarThickness || 6,
    progressBarColor:
      block.content?.progressBarColor || block.properties?.progressBarColor || '#B89B7A',

    // Navegação
    showNavigation: block.content?.showNavigation ?? block.properties?.showNavigation ?? false,
    showBackButton: block.content?.showBackButton ?? block.properties?.showBackButton ?? true,

    // Layout
    isSticky: block.content?.isSticky ?? block.properties?.isSticky ?? false,
    containerScale: block.content?.containerScale || block.properties?.containerScale || 100,

    // Margens e padding
    marginTop: block.content?.marginTop || block.properties?.marginTop || 0,
    marginBottom: block.content?.marginBottom || block.properties?.marginBottom || 24,
    marginLeft: block.content?.marginLeft || block.properties?.marginLeft || 0,
    marginRight: block.content?.marginRight || block.properties?.marginRight || 0,
    paddingTop: block.content?.paddingTop || block.properties?.paddingTop || 16,
    paddingBottom: block.content?.paddingBottom || block.properties?.paddingBottom || 16,
    paddingLeft: block.content?.paddingLeft || block.properties?.paddingLeft || 24,
    paddingRight: block.content?.paddingRight || block.properties?.paddingRight || 24,

    // Cores
    textColor: block.content?.textColor || block.properties?.textColor || '#432818',
    backgroundColor:
      block.content?.backgroundColor || block.properties?.backgroundColor || '#FFFFFF',
    containerBackgroundColor:
      block.content?.containerBackgroundColor ||
      block.properties?.containerBackgroundColor ||
      'transparent',
  };

  const handlePropertyUpdate = (field: string, value: any) => {
    // Atualiza tanto content quanto properties para compatibilidade total
    const updates = {
      content: {
        ...block.content,
        [field]: value,
      },
      properties: {
        ...block.properties,
        [field]: value,
      },
    };

    console.log('🔄 HeaderPropertyEditor - Updating property:', field, '=', value);
    console.log('🔄 HeaderPropertyEditor - Full updates:', updates);

    onUpdate(updates);
  };

  if (isPreviewMode) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div
          className={`space-y-1 ${properties.headerType === 'hero' ? 'text-center' : ''}`}
          style={{
            color: properties.textColor,
            backgroundColor: properties.backgroundColor,
            padding: `${properties.paddingTop}px ${properties.paddingRight}px ${properties.paddingBottom}px ${properties.paddingLeft}px`,
            margin: `${properties.marginTop}px ${properties.marginRight}px ${properties.marginBottom}px ${properties.marginLeft}px`,
            transform: `scale(${properties.containerScale / 100})`,
          }}
        >
          {properties.showLogo && (
            <div className="mb-4">
              <img
                src={properties.logoUrl}
                alt={properties.logoAlt}
                style={{
                  width: `${properties.logoWidth}px`,
                  height: `${properties.logoHeight}px`,
                  transform: `scale(${properties.logoScale / 100})`,
                }}
                className="mx-auto object-contain"
              />
            </div>
          )}

          <h2
            className={`font-bold ${
              properties.headerType === 'hero'
                ? 'text-2xl'
                : properties.headerType === 'section'
                  ? 'text-xl'
                  : 'text-lg'
            }`}
            style={{ color: properties.textColor }}
          >
            {properties.title || 'Título do Header'}
          </h2>

          {properties.subtitle && (
            <p className="text-sm opacity-80" style={{ color: properties.textColor }}>
              {properties.subtitle}
            </p>
          )}

          {properties.showProgress && (
            <div className="mt-4">
              <div
                className="w-full bg-gray-200 rounded-full overflow-hidden"
                style={{ height: `${properties.progressBarThickness}px` }}
              >
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${(Math.min(properties.progressValue, properties.progressMax) / properties.progressMax) * 100}%`,
                    backgroundColor: properties.progressBarColor,
                  }}
                />
              </div>
              <div className="text-xs mt-1 text-center" style={{ color: properties.textColor }}>
                {properties.progressValue} de {properties.progressMax}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Type className="h-5 w-5 text-[#B89B7A]" />
          Propriedades do Header Consolidado
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
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
              <Layout className="h-3 w-3 mr-1" />
              Layout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 m-0">
            <div className="space-y-4">
              <PropertyInput
                label="Título"
                value={properties.title}
                onChange={value => handlePropertyUpdate('title', value)}
                required={true}
                placeholder="Digite o título principal..."
              />

              <PropertyInput
                label="Subtítulo"
                value={properties.subtitle}
                onChange={value => handlePropertyUpdate('subtitle', value)}
                placeholder="Digite o subtítulo (opcional)..."
              />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo do Header</Label>
                <Select
                  value={properties.headerType}
                  onValueChange={value => handlePropertyUpdate('headerType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Principal</SelectItem>
                    <SelectItem value="section">Seção</SelectItem>
                    <SelectItem value="hero">Hero</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showProgress">Barra de Progresso</Label>
                  <p className="text-xs text-gray-500">Exibe o progresso do quiz</p>
                </div>
                <Switch
                  id="showProgress"
                  checked={properties.showProgress}
                  onCheckedChange={checked => handlePropertyUpdate('showProgress', checked)}
                />
              </div>

              {properties.showProgress && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Progresso Atual</Label>
                      <Badge variant="outline" className="text-xs">
                        {properties.progressValue}/{properties.progressMax}
                      </Badge>
                    </div>
                    <PropertySlider
                      label=""
                      value={properties.progressValue}
                      onChange={value => handlePropertyUpdate('progressValue', value)}
                      min={0}
                      max={properties.progressMax}
                      step={1}
                    />
                  </div>

                  <PropertySlider
                    label="Total de Etapas"
                    value={properties.progressMax}
                    onChange={value => handlePropertyUpdate('progressMax', value)}
                    min={1}
                    max={50}
                    step={1}
                  />

                  <PropertySlider
                    label="Espessura da Barra"
                    value={properties.progressBarThickness}
                    onChange={value => handlePropertyUpdate('progressBarThickness', value)}
                    min={2}
                    max={20}
                    step={1}
                    unit="px"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="logo" className="space-y-4 m-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showLogo">Exibir Logo</Label>
                  <p className="text-xs text-gray-500">Mostra/oculta o logo no header</p>
                </div>
                <Switch
                  id="showLogo"
                  checked={properties.showLogo}
                  onCheckedChange={checked => handlePropertyUpdate('showLogo', checked)}
                />
              </div>

              {properties.showLogo && (
                <>
                  <PropertyInput
                    label="URL do Logo"
                    value={properties.logoUrl}
                    onChange={value => handlePropertyUpdate('logoUrl', value)}
                    placeholder="https://exemplo.com/logo.png"
                  />

                  <PropertyInput
                    label="Texto Alternativo"
                    value={properties.logoAlt}
                    onChange={value => handlePropertyUpdate('logoAlt', value)}
                    placeholder="Descrição do logo"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <PropertySlider
                      label="Largura"
                      value={properties.logoWidth}
                      onChange={value => handlePropertyUpdate('logoWidth', value)}
                      min={50}
                      max={300}
                      step={10}
                      unit="px"
                    />

                    <PropertySlider
                      label="Altura"
                      value={properties.logoHeight}
                      onChange={value => handlePropertyUpdate('logoHeight', value)}
                      min={30}
                      max={200}
                      step={5}
                      unit="px"
                    />
                  </div>

                  <PropertySlider
                    label="Escala do Logo"
                    value={properties.logoScale}
                    onChange={value => handlePropertyUpdate('logoScale', value)}
                    min={50}
                    max={200}
                    step={5}
                    unit="%"
                  />

                  <div className="mt-3 p-2 border rounded">
                    <div className="text-xs mb-2 text-[#6B4F43]">Preview:</div>
                    <img
                      src={properties.logoUrl}
                      alt={properties.logoAlt}
                      style={{
                        width: `${properties.logoWidth}px`,
                        height: `${properties.logoHeight}px`,
                        transform: `scale(${properties.logoScale / 100})`,
                      }}
                      className="object-contain border"
                      onError={e => {
                        e.currentTarget.src = 'https://via.placeholder.com/120x50?text=Logo';
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-4 m-0">
            <div className="space-y-4">
              <ColorPicker
                value={properties.textColor}
                onChange={color => handlePropertyUpdate('textColor', color)}
                label="Cor do Texto"
              />

              <ColorPicker
                value={properties.backgroundColor}
                onChange={color => handlePropertyUpdate('backgroundColor', color)}
                label="Cor de Fundo"
              />

              {properties.showProgress && (
                <ColorPicker
                  value={properties.progressBarColor}
                  onChange={color => handlePropertyUpdate('progressBarColor', color)}
                  label="Cor da Barra de Progresso"
                />
              )}

              <PropertySlider
                label="Escala do Container"
                value={properties.containerScale}
                onChange={value => handlePropertyUpdate('containerScale', value)}
                min={50}
                max={150}
                step={5}
                unit="%"
              />
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4 m-0">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-[#6B4F43]">Margens</h4>
              <div className="grid grid-cols-2 gap-4">
                <PropertySlider
                  label="Superior"
                  value={properties.marginTop}
                  onChange={value => handlePropertyUpdate('marginTop', value)}
                  min={0}
                  max={100}
                  step={4}
                  unit="px"
                />

                <PropertySlider
                  label="Inferior"
                  value={properties.marginBottom}
                  onChange={value => handlePropertyUpdate('marginBottom', value)}
                  min={0}
                  max={100}
                  step={4}
                  unit="px"
                />
              </div>

              <h4 className="text-sm font-medium text-[#6B4F43]">Padding</h4>
              <div className="grid grid-cols-2 gap-4">
                <PropertySlider
                  label="Superior"
                  value={properties.paddingTop}
                  onChange={value => handlePropertyUpdate('paddingTop', value)}
                  min={0}
                  max={100}
                  step={4}
                  unit="px"
                />

                <PropertySlider
                  label="Inferior"
                  value={properties.paddingBottom}
                  onChange={value => handlePropertyUpdate('paddingBottom', value)}
                  min={0}
                  max={100}
                  step={4}
                  unit="px"
                />

                <PropertySlider
                  label="Esquerdo"
                  value={properties.paddingLeft}
                  onChange={value => handlePropertyUpdate('paddingLeft', value)}
                  min={0}
                  max={100}
                  step={4}
                  unit="px"
                />

                <PropertySlider
                  label="Direito"
                  value={properties.paddingRight}
                  onChange={value => handlePropertyUpdate('paddingRight', value)}
                  min={0}
                  max={100}
                  step={4}
                  unit="px"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        {/* PREVIEW FINAL */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[#6B4F43] flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview Ao Vivo:
          </h4>
          <div
            className={`space-y-1 border rounded-lg ${properties.headerType === 'hero' ? 'text-center' : ''}`}
            style={{
              color: properties.textColor,
              backgroundColor: properties.backgroundColor,
              padding: `${properties.paddingTop}px ${properties.paddingRight}px ${properties.paddingBottom}px ${properties.paddingLeft}px`,
              margin: `${properties.marginTop}px ${properties.marginRight}px ${properties.marginBottom}px ${properties.marginLeft}px`,
              transform: `scale(${properties.containerScale / 100})`,
              transformOrigin: 'center',
            }}
          >
            {properties.showLogo && (
              <div className="mb-4">
                <img
                  src={properties.logoUrl}
                  alt={properties.logoAlt}
                  style={{
                    width: `${properties.logoWidth}px`,
                    height: `${properties.logoHeight}px`,
                    transform: `scale(${properties.logoScale / 100})`,
                  }}
                  className="mx-auto object-contain"
                  onError={e => {
                    e.currentTarget.src = 'https://via.placeholder.com/120x60?text=Logo';
                  }}
                />
              </div>
            )}

            <h2
              className={`font-bold ${
                properties.headerType === 'hero'
                  ? 'text-2xl'
                  : properties.headerType === 'section'
                    ? 'text-xl'
                    : 'text-lg'
              }`}
              style={{ color: properties.textColor }}
            >
              {properties.title || 'Título do Header'}
            </h2>

            {properties.subtitle && (
              <p className="text-sm opacity-80" style={{ color: properties.textColor }}>
                {properties.subtitle}
              </p>
            )}

            {properties.showProgress && (
              <div className="mt-4">
                <div
                  className="w-full bg-gray-200 rounded-full overflow-hidden"
                  style={{ height: `${properties.progressBarThickness}px` }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${(Math.min(properties.progressValue, properties.progressMax) / properties.progressMax) * 100}%`,
                      backgroundColor: properties.progressBarColor,
                    }}
                  />
                </div>
                <div className="text-xs mt-1 text-center" style={{ color: properties.textColor }}>
                  {properties.progressValue} de {properties.progressMax} etapas
                </div>
              </div>
            )}

            {properties.showBackButton && (
              <div className="mt-4 flex">
                <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center text-xs">
                  ←
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
