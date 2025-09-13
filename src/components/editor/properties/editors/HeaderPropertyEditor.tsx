import { Badge } from '@/components/ui/badge';
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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Block } from '@/types/editor';
import { Eye, Image, Layout, Palette, Type } from 'lucide-react';
import React, { useState } from 'react';

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
        <button
          className="w-8 h-8 rounded border-2 cursor-pointer"
          style={{ backgroundColor: value, borderColor: '#E5DDD5' }}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'color';
            input.value = value;
            input.onchange = e => onChange((e.target as HTMLInputElement).value);
            input.click();
          }}
          aria-label={`Escolher cor para ${label}`}
          title={`Cor atual: ${value}`}
        />
        <Input 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          className="text-xs h-8" 
          aria-label={`Valor da cor para ${label}`}
        />
      </div>
      <div className="grid grid-cols-6 gap-1">
        {presetColors.map(color => (
          <button
            key={color}
            className="w-6 h-6 rounded border hover:scale-110 transition-transform"
            style={{ backgroundColor: color, borderColor: '#E5DDD5' }}
            onClick={() => onChange(color)}
            aria-label={`Definir cor como ${color}`}
            title={color}
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
            className={`font-bold ${properties.headerType === 'hero'
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
              <div>
                <Label htmlFor="header-title">Título</Label>
                <Input
                  id="header-title"
                  value={properties.title}
                  onChange={e => handlePropertyUpdate('title', e.target.value)}
                  placeholder="Digite o título principal..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="header-subtitle">Subtítulo</Label>
                <Input
                  id="header-subtitle"
                  value={properties.subtitle}
                  onChange={e => handlePropertyUpdate('subtitle', e.target.value)}
                  placeholder="Digite o subtítulo (opcional)..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="header-headerType">Tipo do Header</Label>
                <Select
                  value={properties.headerType}
                  onValueChange={value => handlePropertyUpdate('headerType', value)}
                >
                  <SelectTrigger id="header-headerType">
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
                  <Label htmlFor="header-showProgress">Barra de Progresso</Label>
                  <p className="text-xs text-gray-500">Exibe o progresso do quiz</p>
                </div>
                <Switch
                  id="header-showProgress"
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
                    <div className="space-y-2">
                      <Label htmlFor="header-progressValue" className="text-xs">
                        Valor: {properties.progressValue}
                      </Label>
                      <input
                        type="range"
                        id="header-progressValue"
                        min={0}
                        max={properties.progressMax}
                        step={1}
                        value={properties.progressValue}
                        onChange={e => handlePropertyUpdate('progressValue', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="header-progressMax" className="text-xs">
                      Total de Etapas: {properties.progressMax}
                    </Label>
                    <input
                      type="range"
                      id="header-progressMax"
                      min={1}
                      max={50}
                      step={1}
                      value={properties.progressMax}
                      onChange={e => handlePropertyUpdate('progressMax', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="header-progressBarThickness" className="text-xs">
                      Espessura da Barra: {properties.progressBarThickness}px
                    </Label>
                    <input
                      type="range"
                      id="header-progressBarThickness"
                      min={2}
                      max={20}
                      step={1}
                      value={properties.progressBarThickness}
                      onChange={e => handlePropertyUpdate('progressBarThickness', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="logo" className="space-y-4 m-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="header-showLogo">Exibir Logo</Label>
                  <p className="text-xs text-gray-500">Mostra/oculta o logo no header</p>
                </div>
                <Switch
                  id="header-showLogo"
                  checked={properties.showLogo}
                  onCheckedChange={checked => handlePropertyUpdate('showLogo', checked)}
                />
              </div>

              {properties.showLogo && (
                <>
                  <div>
                    <Label htmlFor="header-logoUrl">URL do Logo</Label>
                    <Input
                      id="header-logoUrl"
                      value={properties.logoUrl}
                      onChange={e => handlePropertyUpdate('logoUrl', e.target.value)}
                      placeholder="https://exemplo.com/logo.png"
                    />
                  </div>

                  <div>
                    <Label htmlFor="header-logoAlt">Texto Alternativo</Label>
                    <Input
                      id="header-logoAlt"
                      value={properties.logoAlt}
                      onChange={e => handlePropertyUpdate('logoAlt', e.target.value)}
                      placeholder="Descrição do logo"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="header-logoWidth" className="text-xs">
                        Largura: {properties.logoWidth}px
                      </Label>
                      <input
                        type="range"
                        id="header-logoWidth"
                        min={50}
                        max={300}
                        step={10}
                        value={properties.logoWidth}
                        onChange={e => handlePropertyUpdate('logoWidth', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="header-logoHeight" className="text-xs">
                        Altura: {properties.logoHeight}px
                      </Label>
                      <input
                        type="range"
                        id="header-logoHeight"
                        min={30}
                        max={200}
                        step={5}
                        value={properties.logoHeight}
                        onChange={e => handlePropertyUpdate('logoHeight', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="header-logoScale" className="text-xs">
                      Escala do Logo: {properties.logoScale}%
                    </Label>
                    <input
                      type="range"
                      id="header-logoScale"
                      min={50}
                      max={200}
                      step={5}
                      value={properties.logoScale}
                      onChange={e => handlePropertyUpdate('logoScale', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

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

              <div className="space-y-2">
                <Label htmlFor="header-containerScale" className="text-xs">
                  Escala do Container: {properties.containerScale}%
                </Label>
                <input
                  type="range"
                  id="header-containerScale"
                  min={50}
                  max={150}
                  step={5}
                  value={properties.containerScale}
                  onChange={e => handlePropertyUpdate('containerScale', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4 m-0">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-[#6B4F43]">Margens</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="header-marginTop" className="text-xs">
                    Superior: {properties.marginTop}px
                  </Label>
                  <input
                    type="range"
                    id="header-marginTop"
                    min={0}
                    max={100}
                    step={4}
                    value={properties.marginTop}
                    onChange={e => handlePropertyUpdate('marginTop', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="header-marginBottom" className="text-xs">
                    Inferior: {properties.marginBottom}px
                  </Label>
                  <input
                    type="range"
                    id="header-marginBottom"
                    min={0}
                    max={100}
                    step={4}
                    value={properties.marginBottom}
                    onChange={e => handlePropertyUpdate('marginBottom', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <h4 className="text-sm font-medium text-[#6B4F43]">Padding</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="header-paddingTop" className="text-xs">
                    Superior: {properties.paddingTop}px
                  </Label>
                  <input
                    type="range"
                    id="header-paddingTop"
                    min={0}
                    max={100}
                    step={4}
                    value={properties.paddingTop}
                    onChange={e => handlePropertyUpdate('paddingTop', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="header-paddingBottom" className="text-xs">
                    Inferior: {properties.paddingBottom}px
                  </Label>
                  <input
                    type="range"
                    id="header-paddingBottom"
                    min={0}
                    max={100}
                    step={4}
                    value={properties.paddingBottom}
                    onChange={e => handlePropertyUpdate('paddingBottom', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="header-paddingLeft" className="text-xs">
                    Esquerdo: {properties.paddingLeft}px
                  </Label>
                  <input
                    type="range"
                    id="header-paddingLeft"
                    min={0}
                    max={100}
                    step={4}
                    value={properties.paddingLeft}
                    onChange={e => handlePropertyUpdate('paddingLeft', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="header-paddingRight" className="text-xs">
                    Direito: {properties.paddingRight}px
                  </Label>
                  <input
                    type="range"
                    id="header-paddingRight"
                    min={0}
                    max={100}
                    step={4}
                    value={properties.paddingRight}
                    onChange={e => handlePropertyUpdate('paddingRight', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
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
              className={`font-bold ${properties.headerType === 'hero'
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
