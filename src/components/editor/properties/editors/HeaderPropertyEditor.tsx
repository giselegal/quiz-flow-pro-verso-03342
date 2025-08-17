import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Block } from '@/types/editor';
import { Layout, Palette, Settings, Type } from 'lucide-react';
import React from 'react';
import { PropertyColorPicker } from '../components/PropertyColorPicker';
import { PropertyInput } from '../components/PropertyInput';
import { PropertySlider } from '../components/PropertySlider';

interface HeaderPropertyEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  isPreviewMode?: boolean;
}

export const HeaderPropertyEditor: React.FC<HeaderPropertyEditorProps> = ({
  block,
  onUpdate,
  isPreviewMode = false,
}) => {
  // Propriedades de conteúdo
  const title = block.content?.title || '';
  const subtitle = block.content?.subtitle || '';
  const headerType = block.content?.headerType || 'main';

  // Propriedades de elementos de interface
  const showLogo = block.content?.showLogo || false;
  const showProgress = block.content?.showProgress || false;
  const showNavigation = block.content?.showNavigation || false;

  // Propriedades de escala e dimensões
  const logoScale = block.content?.logoScale || 100;
  const containerScale = block.content?.containerScale || 100;
  const progressBarThickness = block.content?.progressBarThickness || 4;
  const progressValue = block.content?.progressValue || 0;

  // Propriedades de margens
  const marginTop = block.content?.marginTop || 0;
  const marginBottom = block.content?.marginBottom || 0;
  const marginLeft = block.content?.marginLeft || 0;
  const marginRight = block.content?.marginRight || 0;
  const paddingTop = block.content?.paddingTop || 24;
  const paddingBottom = block.content?.paddingBottom || 24;
  const paddingLeft = block.content?.paddingLeft || 24;
  const paddingRight = block.content?.paddingRight || 24;

  // Propriedades de cores
  const textColor = block.content?.textColor || '#6B4F43';
  const backgroundColor = block.content?.backgroundColor || '#F8F9FA';
  const containerBackgroundColor = block.content?.containerBackgroundColor || 'transparent';
  const progressBarColor = block.content?.progressBarColor || '#B89B7A';

  const handleContentUpdate = (field: string, value: any) => {
    const updates = {
      content: {
        ...block.content,
        [field]: value,
      },
    };
    onUpdate(updates);
  };

  if (isPreviewMode) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div
          className={`space-y-1 ${headerType === 'hero' ? 'text-center' : ''}`}
          style={{
            color: textColor,
            backgroundColor: backgroundColor,
            padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
            margin: `${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px`,
            transform: `scale(${containerScale / 100})`,
          }}
        >
          {showLogo && (
            <div className="mb-4">
              <div
                className="w-16 h-16 bg-gray-300 rounded-lg mx-auto flex items-center justify-center"
                style={{ transform: `scale(${logoScale / 100})` }}
              >
                LOGO
              </div>
            </div>
          )}

          <h2
            className={`font-bold ${
              headerType === 'hero' ? 'text-2xl' : headerType === 'section' ? 'text-xl' : 'text-lg'
            }`}
            style={{ color: textColor }}
          >
            {title || 'Título do Header'}
          </h2>

          {subtitle && (
            <p className="text-sm opacity-80" style={{ color: textColor }}>
              {subtitle}
            </p>
          )}

          {showProgress && (
            <div className="mt-4">
              <div
                className="w-full bg-gray-200 rounded-full overflow-hidden"
                style={{ height: `${progressBarThickness}px` }}
              >
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${progressValue}%`,
                    backgroundColor: progressBarColor,
                  }}
                />
              </div>
            </div>
          )}

          {showNavigation && (
            <div className="mt-4 flex justify-between">
              <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center">←</div>
              <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center">→</div>
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
          Propriedades do Header
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* === CONTEÚDO === */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Type className="h-4 w-4" />
            Conteúdo
          </h3>

          <PropertyInput
            label="Título"
            value={title}
            onChange={value => handleContentUpdate('title', value)}
            required={true}
            placeholder="Digite o título principal..."
          />

          <PropertyInput
            label="Subtítulo"
            value={subtitle}
            onChange={value => handleContentUpdate('subtitle', value)}
            placeholder="Digite o subtítulo (opcional)..."
          />

          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo do Header</Label>
            <Select
              value={headerType}
              onValueChange={value => handleContentUpdate('headerType', value)}
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
        </div>

        <Separator />

        {/* === ELEMENTOS DE INTERFACE === */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Elementos de Interface
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showLogo">Mostrar Logo</Label>
                <p className="text-xs text-gray-500">Exibe o logo do quiz no header</p>
              </div>
              <Switch
                id="showLogo"
                checked={showLogo}
                onCheckedChange={checked => handleContentUpdate('showLogo', checked)}
              />
            </div>

            {showLogo && (
              <PropertySlider
                label="Escala do Logo"
                value={logoScale}
                onChange={value => handleContentUpdate('logoScale', value)}
                min={50}
                max={200}
                step={5}
                unit="%"
              />
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showProgress">Mostrar Barra de Progresso</Label>
                <p className="text-xs text-gray-500">Exibe a barra de progresso do quiz</p>
              </div>
              <Switch
                id="showProgress"
                checked={showProgress}
                onCheckedChange={checked => handleContentUpdate('showProgress', checked)}
              />
            </div>

            {showProgress && (
              <div className="space-y-4">
                <PropertySlider
                  label="Progresso Atual"
                  value={progressValue}
                  onChange={value => handleContentUpdate('progressValue', value)}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                />

                <PropertySlider
                  label="Espessura da Barra"
                  value={progressBarThickness}
                  onChange={value => handleContentUpdate('progressBarThickness', value)}
                  min={2}
                  max={12}
                  step={1}
                  unit="px"
                />

                <PropertyColorPicker
                  label="Cor da Barra de Progresso"
                  value={progressBarColor}
                  onChange={value => handleContentUpdate('progressBarColor', value)}
                  allowTransparent={false}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showNavigation">Mostrar Navegação</Label>
                <p className="text-xs text-gray-500">Exibe botões de navegação discretos</p>
              </div>
              <Switch
                id="showNavigation"
                checked={showNavigation}
                onCheckedChange={checked => handleContentUpdate('showNavigation', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* === DIMENSÕES E ESCALAS === */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Dimensões e Escalas
          </h3>

          <PropertySlider
            label="Escala do Container"
            value={containerScale}
            onChange={value => handleContentUpdate('containerScale', value)}
            min={50}
            max={150}
            step={5}
            unit="%"
          />
        </div>

        <Separator />

        {/* === ESPAÇAMENTO === */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Espaçamento</h3>

          <div className="grid grid-cols-2 gap-4">
            <PropertySlider
              label="Margem Superior"
              value={marginTop}
              onChange={value => handleContentUpdate('marginTop', value)}
              min={0}
              max={100}
              step={4}
              unit="px"
            />

            <PropertySlider
              label="Margem Inferior"
              value={marginBottom}
              onChange={value => handleContentUpdate('marginBottom', value)}
              min={0}
              max={100}
              step={4}
              unit="px"
            />

            <PropertySlider
              label="Margem Esquerda"
              value={marginLeft}
              onChange={value => handleContentUpdate('marginLeft', value)}
              min={0}
              max={100}
              step={4}
              unit="px"
            />

            <PropertySlider
              label="Margem Direita"
              value={marginRight}
              onChange={value => handleContentUpdate('marginRight', value)}
              min={0}
              max={100}
              step={4}
              unit="px"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <PropertySlider
              label="Padding Superior"
              value={paddingTop}
              onChange={value => handleContentUpdate('paddingTop', value)}
              min={0}
              max={100}
              step={4}
              unit="px"
            />

            <PropertySlider
              label="Padding Inferior"
              value={paddingBottom}
              onChange={value => handleContentUpdate('paddingBottom', value)}
              min={0}
              max={100}
              step={4}
              unit="px"
            />

            <PropertySlider
              label="Padding Esquerdo"
              value={paddingLeft}
              onChange={value => handleContentUpdate('paddingLeft', value)}
              min={0}
              max={100}
              step={4}
              unit="px"
            />

            <PropertySlider
              label="Padding Direito"
              value={paddingRight}
              onChange={value => handleContentUpdate('paddingRight', value)}
              min={0}
              max={100}
              step={4}
              unit="px"
            />
          </div>
        </div>

        <Separator />

        {/* === CORES === */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Cores
          </h3>

          <PropertyColorPicker
            label="Cor do Texto"
            value={textColor}
            onChange={value => handleContentUpdate('textColor', value)}
            allowTransparent={false}
          />

          <PropertyColorPicker
            label="Cor de Fundo do Componente"
            value={backgroundColor}
            onChange={value => handleContentUpdate('backgroundColor', value)}
          />

          <PropertyColorPicker
            label="Cor de Fundo do Container"
            value={containerBackgroundColor}
            onChange={value => handleContentUpdate('containerBackgroundColor', value)}
          />
        </div>

        <Separator />

        {/* === PREVIEW === */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[#6B4F43] mb-2">Preview:</h4>
          <div
            className={`space-y-1 ${headerType === 'hero' ? 'text-center' : ''} border rounded-lg`}
            style={{
              color: textColor,
              backgroundColor: backgroundColor,
              padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
              margin: `${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px`,
              transform: `scale(${containerScale / 100})`,
              transformOrigin: 'center',
            }}
          >
            {showLogo && (
              <div className="mb-4">
                <div
                  className="w-16 h-16 bg-gray-300 rounded-lg mx-auto flex items-center justify-center text-xs"
                  style={{ transform: `scale(${logoScale / 100})` }}
                >
                  LOGO
                </div>
              </div>
            )}

            <h2
              className={`font-bold ${
                headerType === 'hero'
                  ? 'text-2xl'
                  : headerType === 'section'
                    ? 'text-xl'
                    : 'text-lg'
              }`}
              style={{ color: textColor }}
            >
              {title || 'Título do Header'}
            </h2>

            {subtitle && (
              <p className="text-sm opacity-80" style={{ color: textColor }}>
                {subtitle}
              </p>
            )}

            {showProgress && (
              <div className="mt-4">
                <div
                  className="w-full bg-gray-200 rounded-full overflow-hidden"
                  style={{ height: `${progressBarThickness}px` }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${progressValue}%`,
                      backgroundColor: progressBarColor,
                    }}
                  />
                </div>
              </div>
            )}

            {showNavigation && (
              <div className="mt-4 flex justify-between">
                <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center text-xs">
                  ←
                </div>
                <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center text-xs">
                  →
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
