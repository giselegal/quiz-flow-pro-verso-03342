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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Block } from '@/types/editor';
import { Eye, FileText, Layout, Palette, Settings, MousePointer, Navigation } from 'lucide-react';
import React, { useState } from 'react';
import { PropertyColorPicker } from '../components/PropertyColorPicker';
import { PropertyInput } from '../components/PropertyInput';
import { PropertySlider } from '../components/PropertySlider';

interface FormContainerPropertyEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  isPreviewMode?: boolean;
}

export const FormContainerPropertyEditor: React.FC<FormContainerPropertyEditorProps> = ({
  block,
  onUpdate,
  isPreviewMode = false,
}) => {
  const [activeTab, setActiveTab] = useState('fields');

  // === CAMPOS DISPONÍVEIS ===
  const showNameField = block.content?.showNameField ?? true;
  const showEmailField = block.content?.showEmailField ?? false;
  const showPhoneField = block.content?.showPhoneField ?? false;

  // === TEXTOS DOS CAMPOS ===
  const nameLabel = block.content?.nameLabel || 'NOME';
  const namePlaceholder = block.content?.namePlaceholder || 'Digite seu nome';
  const nameRequired = block.content?.nameRequired ?? true;
  const nameRequiredMessage = block.content?.nameRequiredMessage || 'Por favor, digite seu nome para continuar';

  const emailLabel = block.content?.emailLabel || 'EMAIL';
  const emailPlaceholder = block.content?.emailPlaceholder || 'Digite seu email';
  const emailRequired = block.content?.emailRequired ?? false;
  const emailRequiredMessage = block.content?.emailRequiredMessage || 'Por favor, digite seu email para continuar';

  const phoneLabel = block.content?.phoneLabel || 'TELEFONE';
  const phonePlaceholder = block.content?.phonePlaceholder || 'Digite seu telefone';
  const phoneRequired = block.content?.phoneRequired ?? false;
  const phoneRequiredMessage = block.content?.phoneRequiredMessage || 'Por favor, digite seu telefone para continuar';

  // === BOTÃO ===
  const buttonText = block.content?.buttonText || 'Quero Descobrir meu Estilo Agora!';
  const enableButtonOnlyWhenValid = block.content?.enableButtonOnlyWhenValid ?? true;
  const buttonBackgroundColor = block.content?.buttonBackgroundColor || '#B89B7A';
  const buttonTextColor = block.content?.buttonTextColor || '#FFFFFF';
  const buttonBorderRadius = block.content?.buttonBorderRadius ?? 8;
  const buttonFontSize = block.content?.buttonFontSize ?? 16;
  const buttonFontWeight = block.content?.buttonFontWeight || 'medium';
  const buttonPaddingY = block.content?.buttonPaddingY ?? 12;
  const buttonPaddingX = block.content?.buttonPaddingX ?? 24;
  const buttonShadow = block.content?.buttonShadow || 'none';
  const buttonHoverEffect = block.content?.buttonHoverEffect ?? true;

  // === NAVEGAÇÃO ===
  const nextUrl = block.content?.nextUrl || '';
  const nextStep = block.content?.nextStep ?? 2;
  const navigationMode = block.content?.navigationMode || 'step'; // 'step' ou 'url'

  // === COMPORTAMENTO ===
  const autoAdvanceOnComplete = block.content?.autoAdvanceOnComplete ?? false;
  const showValidationFeedback = block.content?.showValidationFeedback ?? true;
  const dataKey = block.content?.dataKey || 'userData';

  // === ESTILO GERAL ===
  const backgroundColor = block.content?.backgroundColor || '#FFFFFF';
  const borderColor = block.content?.borderColor || '#B89B7A';
  const textColor = block.content?.textColor || '#432818';
  const labelColor = block.content?.labelColor || '#432818';
  const fontSize = block.content?.fontSize ?? 16;
  const borderRadius = block.content?.borderRadius ?? 8;
  const marginTop = block.content?.marginTop ?? 0;
  const marginBottom = block.content?.marginBottom ?? 0;
  const paddingTop = block.content?.paddingTop ?? 24;
  const paddingBottom = block.content?.paddingBottom ?? 24;
  const paddingLeft = block.content?.paddingLeft ?? 24;
  const paddingRight = block.content?.paddingRight ?? 24;

  const handleContentUpdate = (field: string, value: any) => {
    const updates = {
      content: {
        ...block.content,
        [field]: value,
      },
    };
    onUpdate(updates);
  };

  const shadowOptions = [
    { value: 'none', label: 'Sem Sombra' },
    { value: 'sm', label: 'Pequena' },
    { value: 'md', label: 'Média' },
    { value: 'lg', label: 'Grande' },
    { value: 'xl', label: 'Extra Grande' },
  ];

  const fontWeightOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'medium', label: 'Médio' },
    { value: 'semibold', label: 'Semi-Bold' },
    { value: 'bold', label: 'Bold' },
  ];

  if (isPreviewMode) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div
          className="space-y-4"
          style={{
            backgroundColor: backgroundColor,
            padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
            margin: `${marginTop}px 0 ${marginBottom}px 0`,
            borderRadius: `${borderRadius}px`,
          }}
        >
          {showNameField && (
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: labelColor }}>
                {nameLabel}
                {nameRequired && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                placeholder={namePlaceholder}
                className="w-full px-3 py-2 rounded border"
                style={{
                  borderColor: borderColor,
                  color: textColor,
                  fontSize: `${fontSize}px`,
                  borderRadius: `${borderRadius}px`,
                }}
                disabled
              />
            </div>
          )}

          {showEmailField && (
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: labelColor }}>
                {emailLabel}
                {emailRequired && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="email"
                placeholder={emailPlaceholder}
                className="w-full px-3 py-2 rounded border"
                style={{
                  borderColor: borderColor,
                  color: textColor,
                  fontSize: `${fontSize}px`,
                  borderRadius: `${borderRadius}px`,
                }}
                disabled
              />
            </div>
          )}

          {showPhoneField && (
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: labelColor }}>
                {phoneLabel}
                {phoneRequired && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="tel"
                placeholder={phonePlaceholder}
                className="w-full px-3 py-2 rounded border"
                style={{
                  borderColor: borderColor,
                  color: textColor,
                  fontSize: `${fontSize}px`,
                  borderRadius: `${borderRadius}px`,
                }}
                disabled
              />
            </div>
          )}

          <button
            className={`w-full font-${buttonFontWeight} ${buttonShadow !== 'none' ? `shadow-${buttonShadow}` : ''} ${buttonHoverEffect ? 'hover:scale-105 transition-transform' : ''}`}
            style={{
              backgroundColor: buttonBackgroundColor,
              color: buttonTextColor,
              borderRadius: `${buttonBorderRadius}px`,
              fontSize: `${buttonFontSize}px`,
              padding: `${buttonPaddingY}px ${buttonPaddingX}px`,
            }}
            disabled
          >
            {buttonText}
          </button>
        </div>
      </div>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-[#B89B7A]" />
          Propriedades do Formulário
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 h-8">
            <TabsTrigger value="fields" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              Campos
            </TabsTrigger>
            <TabsTrigger value="button" className="text-xs">
              <MousePointer className="h-3 w-3 mr-1" />
              Botão
            </TabsTrigger>
            <TabsTrigger value="navigation" className="text-xs">
              <Navigation className="h-3 w-3 mr-1" />
              Navegação
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs">
              <Palette className="h-3 w-3 mr-1" />
              Estilo
            </TabsTrigger>
            <TabsTrigger value="behavior" className="text-xs">
              <Settings className="h-3 w-3 mr-1" />
              Comportamento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fields" className="space-y-4 m-0">
            <div className="space-y-4">
              {/* === CAMPO NOME === */}
              <div className="space-y-3 p-3 border rounded">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Campo Nome</h4>
                  <Switch
                    checked={showNameField}
                    onCheckedChange={checked => handleContentUpdate('showNameField', checked)}
                  />
                </div>

                {showNameField && (
                  <div className="space-y-3">
                    <PropertyInput
                      label="Label"
                      value={nameLabel}
                      onChange={value => handleContentUpdate('nameLabel', value)}
                      placeholder="NOME"
                    />
                    <PropertyInput
                      label="Placeholder"
                      value={namePlaceholder}
                      onChange={value => handleContentUpdate('namePlaceholder', value)}
                      placeholder="Digite seu nome"
                    />
                    <div className="flex items-center justify-between">
                      <Label>Campo Obrigatório</Label>
                      <Switch
                        checked={nameRequired}
                        onCheckedChange={checked => handleContentUpdate('nameRequired', checked)}
                      />
                    </div>
                    {nameRequired && (
                      <PropertyInput
                        label="Mensagem de Erro"
                        value={nameRequiredMessage}
                        onChange={value => handleContentUpdate('nameRequiredMessage', value)}
                        placeholder="Por favor, digite seu nome para continuar"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* === CAMPO EMAIL === */}
              <div className="space-y-3 p-3 border rounded">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Campo Email</h4>
                  <Switch
                    checked={showEmailField}
                    onCheckedChange={checked => handleContentUpdate('showEmailField', checked)}
                  />
                </div>

                {showEmailField && (
                  <div className="space-y-3">
                    <PropertyInput
                      label="Label"
                      value={emailLabel}
                      onChange={value => handleContentUpdate('emailLabel', value)}
                      placeholder="EMAIL"
                    />
                    <PropertyInput
                      label="Placeholder"
                      value={emailPlaceholder}
                      onChange={value => handleContentUpdate('emailPlaceholder', value)}
                      placeholder="Digite seu email"
                    />
                    <div className="flex items-center justify-between">
                      <Label>Campo Obrigatório</Label>
                      <Switch
                        checked={emailRequired}
                        onCheckedChange={checked => handleContentUpdate('emailRequired', checked)}
                      />
                    </div>
                    {emailRequired && (
                      <PropertyInput
                        label="Mensagem de Erro"
                        value={emailRequiredMessage}
                        onChange={value => handleContentUpdate('emailRequiredMessage', value)}
                        placeholder="Por favor, digite seu email para continuar"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* === CAMPO TELEFONE === */}
              <div className="space-y-3 p-3 border rounded">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Campo Telefone</h4>
                  <Switch
                    checked={showPhoneField}
                    onCheckedChange={checked => handleContentUpdate('showPhoneField', checked)}
                  />
                </div>

                {showPhoneField && (
                  <div className="space-y-3">
                    <PropertyInput
                      label="Label"
                      value={phoneLabel}
                      onChange={value => handleContentUpdate('phoneLabel', value)}
                      placeholder="TELEFONE"
                    />
                    <PropertyInput
                      label="Placeholder"
                      value={phonePlaceholder}
                      onChange={value => handleContentUpdate('phonePlaceholder', value)}
                      placeholder="Digite seu telefone"
                    />
                    <div className="flex items-center justify-between">
                      <Label>Campo Obrigatório</Label>
                      <Switch
                        checked={phoneRequired}
                        onCheckedChange={checked => handleContentUpdate('phoneRequired', checked)}
                      />
                    </div>
                    {phoneRequired && (
                      <PropertyInput
                        label="Mensagem de Erro"
                        value={phoneRequiredMessage}
                        onChange={value => handleContentUpdate('phoneRequiredMessage', value)}
                        placeholder="Por favor, digite seu telefone para continuar"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="button" className="space-y-4 m-0">
            <div className="space-y-4">
              <PropertyInput
                label="Texto do Botão"
                value={buttonText}
                onChange={value => handleContentUpdate('buttonText', value)}
                required={true}
                placeholder="Quero Descobrir meu Estilo Agora!"
              />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ativar Apenas Quando Válido</Label>
                  <p className="text-xs text-gray-500">Botão só fica ativo após preencher campos obrigatórios</p>
                </div>
                <Switch
                  checked={enableButtonOnlyWhenValid}
                  onCheckedChange={checked => handleContentUpdate('enableButtonOnlyWhenValid', checked)}
                />
              </div>

              <PropertyColorPicker
                label="Cor de Fundo do Botão"
                value={buttonBackgroundColor}
                onChange={value => handleContentUpdate('buttonBackgroundColor', value)}
                allowTransparent={false}
              />

              <PropertyColorPicker
                label="Cor do Texto do Botão"
                value={buttonTextColor}
                onChange={value => handleContentUpdate('buttonTextColor', value)}
                allowTransparent={false}
              />

              <PropertySlider
                label="Tamanho da Fonte"
                value={buttonFontSize}
                onChange={value => handleContentUpdate('buttonFontSize', value)}
                min={12}
                max={24}
                step={1}
                unit="px"
              />

              <div className="space-y-2">
                <Label>Peso da Fonte</Label>
                <Select
                  value={buttonFontWeight}
                  onValueChange={value => handleContentUpdate('buttonFontWeight', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontWeightOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <PropertySlider
                label="Arredondamento"
                value={buttonBorderRadius}
                onChange={value => handleContentUpdate('buttonBorderRadius', value)}
                min={0}
                max={25}
                step={1}
                unit="px"
              />

              <div className="grid grid-cols-2 gap-4">
                <PropertySlider
                  label="Padding Vertical"
                  value={buttonPaddingY}
                  onChange={value => handleContentUpdate('buttonPaddingY', value)}
                  min={8}
                  max={32}
                  step={2}
                  unit="px"
                />

                <PropertySlider
                  label="Padding Horizontal"
                  value={buttonPaddingX}
                  onChange={value => handleContentUpdate('buttonPaddingX', value)}
                  min={16}
                  max={64}
                  step={4}
                  unit="px"
                />
              </div>

              <div className="space-y-2">
                <Label>Sombra</Label>
                <Select
                  value={buttonShadow}
                  onValueChange={value => handleContentUpdate('buttonShadow', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {shadowOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Efeito Hover</Label>
                  <p className="text-xs text-gray-500">Animação ao passar o mouse</p>
                </div>
                <Switch
                  checked={buttonHoverEffect}
                  onCheckedChange={checked => handleContentUpdate('buttonHoverEffect', checked)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="navigation" className="space-y-4 m-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Modo de Navegação</Label>
                <Select
                  value={navigationMode}
                  onValueChange={value => handleContentUpdate('navigationMode', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="step">Próxima Etapa</SelectItem>
                    <SelectItem value="url">URL Personalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {navigationMode === 'step' ? (
                <PropertySlider
                  label="Próxima Etapa"
                  value={nextStep}
                  onChange={value => handleContentUpdate('nextStep', value)}
                  min={1}
                  max={50}
                  step={1}
                />
              ) : (
                <PropertyInput
                  label="URL de Destino"
                  value={nextUrl}
                  onChange={value => handleContentUpdate('nextUrl', value)}
                  placeholder="https://exemplo.com/proxima-pagina"
                />
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Avançar Automaticamente</Label>
                  <p className="text-xs text-gray-500">Vai para próxima etapa automaticamente após preencher</p>
                </div>
                <Switch
                  checked={autoAdvanceOnComplete}
                  onCheckedChange={checked => handleContentUpdate('autoAdvanceOnComplete', checked)}
                />
              </div>

              <PropertyInput
                label="Chave de Dados (Supabase)"
                value={dataKey}
                onChange={value => handleContentUpdate('dataKey', value)}
                placeholder="userData"
              />
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-4 m-0">
            <div className="space-y-4">
              <PropertyColorPicker
                label="Cor de Fundo"
                value={backgroundColor}
                onChange={value => handleContentUpdate('backgroundColor', value)}
              />

              <PropertyColorPicker
                label="Cor da Borda dos Campos"
                value={borderColor}
                onChange={value => handleContentUpdate('borderColor', value)}
                allowTransparent={false}
              />

              <PropertyColorPicker
                label="Cor do Texto"
                value={textColor}
                onChange={value => handleContentUpdate('textColor', value)}
                allowTransparent={false}
              />

              <PropertyColorPicker
                label="Cor dos Labels"
                value={labelColor}
                onChange={value => handleContentUpdate('labelColor', value)}
                allowTransparent={false}
              />

              <PropertySlider
                label="Tamanho da Fonte dos Campos"
                value={fontSize}
                onChange={value => handleContentUpdate('fontSize', value)}
                min={12}
                max={24}
                step={1}
                unit="px"
              />

              <PropertySlider
                label="Arredondamento dos Campos"
                value={borderRadius}
                onChange={value => handleContentUpdate('borderRadius', value)}
                min={0}
                max={20}
                step={1}
                unit="px"
              />
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4 m-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mostrar Feedback de Validação</Label>
                  <p className="text-xs text-gray-500">Exibe mensagens de erro/sucesso</p>
                </div>
                <Switch
                  checked={showValidationFeedback}
                  onCheckedChange={checked => handleContentUpdate('showValidationFeedback', checked)}
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-[#6B4F43]">Espaçamento</h4>
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
                    label="Padding Superior"
                    value={paddingTop}
                    onChange={value => handleContentUpdate('paddingTop', value)}
                    min={0}
                    max={80}
                    step={4}
                    unit="px"
                  />

                  <PropertySlider
                    label="Padding Inferior"
                    value={paddingBottom}
                    onChange={value => handleContentUpdate('paddingBottom', value)}
                    min={0}
                    max={80}
                    step={4}
                    unit="px"
                  />

                  <PropertySlider
                    label="Padding Esquerdo"
                    value={paddingLeft}
                    onChange={value => handleContentUpdate('paddingLeft', value)}
                    min={0}
                    max={80}
                    step={4}
                    unit="px"
                  />

                  <PropertySlider
                    label="Padding Direito"
                    value={paddingRight}
                    onChange={value => handleContentUpdate('paddingRight', value)}
                    min={0}
                    max={80}
                    step={4}
                    unit="px"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        {/* === PREVIEW === */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[#6B4F43] mb-2 flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview Ao Vivo:
          </h4>
          <div
            className="space-y-4 border rounded-lg"
            style={{
              backgroundColor: backgroundColor,
              padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
              margin: `${marginTop}px 0 ${marginBottom}px 0`,
              borderRadius: `${borderRadius}px`,
            }}
          >
            {showNameField && (
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: labelColor }}>
                  {nameLabel}
                  {nameRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="text"
                  placeholder={namePlaceholder}
                  className="w-full px-3 py-2 border"
                  style={{
                    borderColor: borderColor,
                    color: textColor,
                    fontSize: `${fontSize}px`,
                    borderRadius: `${borderRadius}px`,
                  }}
                  disabled
                />
                {showValidationFeedback && nameRequired && (
                  <p className="text-xs text-gray-500 mt-1">{nameRequiredMessage}</p>
                )}
              </div>
            )}

            {showEmailField && (
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: labelColor }}>
                  {emailLabel}
                  {emailRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="email"
                  placeholder={emailPlaceholder}
                  className="w-full px-3 py-2 border"
                  style={{
                    borderColor: borderColor,
                    color: textColor,
                    fontSize: `${fontSize}px`,
                    borderRadius: `${borderRadius}px`,
                  }}
                  disabled
                />
              </div>
            )}

            {showPhoneField && (
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: labelColor }}>
                  {phoneLabel}
                  {phoneRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="tel"
                  placeholder={phonePlaceholder}
                  className="w-full px-3 py-2 border"
                  style={{
                    borderColor: borderColor,
                    color: textColor,
                    fontSize: `${fontSize}px`,
                    borderRadius: `${borderRadius}px`,
                  }}
                  disabled
                />
              </div>
            )}

            <button
              className={`w-full font-${buttonFontWeight} ${buttonShadow !== 'none' ? `shadow-${buttonShadow}` : ''} ${buttonHoverEffect ? 'hover:scale-105 transition-transform' : ''} ${enableButtonOnlyWhenValid ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{
                backgroundColor: buttonBackgroundColor,
                color: buttonTextColor,
                borderRadius: `${buttonBorderRadius}px`,
                fontSize: `${buttonFontSize}px`,
                padding: `${buttonPaddingY}px ${buttonPaddingX}px`,
              }}
              disabled
            >
              {buttonText}
            </button>

            {navigationMode === 'step' && (
              <p className="text-xs text-gray-500 text-center">
                → Próxima etapa: {nextStep}
              </p>
            )}

            {navigationMode === 'url' && nextUrl && (
              <p className="text-xs text-gray-500 text-center">
                → Redirecionar para: {nextUrl}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
