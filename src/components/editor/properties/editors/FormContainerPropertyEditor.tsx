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
import { Eye, FileText, Layout, Palette, Settings } from 'lucide-react';
import React from 'react';
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
  // Propriedades de conteúdo
  const title = block.content?.title || '';
  const placeholder = block.content?.placeholder || '';
  const buttonText = block.content?.buttonText || '';

  // Propriedades de comportamento
  const fieldType = block.content?.fieldType || 'text';
  const required = block.content?.required || false;
  const enableButtonOnlyWhenValid = block.content?.enableButtonOnlyWhenValid || false;
  const showValidationFeedback = block.content?.showValidationFeedback || false;
  const autoAdvanceOnComplete = block.content?.autoAdvanceOnComplete || false;
  const dataKey = block.content?.dataKey || 'userName';

  // Mensagens
  const requiredMessage = block.content?.requiredMessage || '';
  const validationMessage = block.content?.validationMessage || '';
  const successMessage = block.content?.successMessage || '';

  // Propriedades de estilo
  const backgroundColor = block.content?.backgroundColor || '#FFFFFF';
  const borderColor = block.content?.borderColor || '#B89B7A';
  const textColor = block.content?.textColor || '#432818';
  const labelColor = block.content?.labelColor || '#432818';
  const buttonBackgroundColor = block.content?.buttonBackgroundColor || '#B89B7A';
  const buttonTextColor = block.content?.buttonTextColor || '#FFFFFF';

  // Propriedades de dimensões
  const fontSize =
    typeof block.content?.fontSize === 'number'
      ? block.content.fontSize
      : parseInt(block.content?.fontSize || '16') || 16;
  const borderRadius =
    typeof block.content?.borderRadius === 'number'
      ? block.content.borderRadius
      : parseInt(block.content?.borderRadius || '8') || 8;
  const marginTop = block.content?.marginTop || 0;
  const marginBottom = block.content?.marginBottom || 0;
  const paddingTop = block.content?.paddingTop || 16;
  const paddingBottom = block.content?.paddingBottom || 16;
  const paddingLeft = block.content?.paddingLeft || 16;
  const paddingRight = block.content?.paddingRight || 16;

  const handleContentUpdate = (field: string, value: any) => {
    const updates = {
      content: {
        ...block.content,
        [field]: value,
      },
    };
    onUpdate(updates);
  };

  const fieldTypeOptions = [
    { value: 'text', label: 'Texto' },
    { value: 'email', label: 'Email' },
    { value: 'tel', label: 'Telefone' },
    { value: 'number', label: 'Número' },
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
          {title && (
            <label className="block text-sm font-medium" style={{ color: labelColor }}>
              {title}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          <input
            type={fieldType}
            placeholder={placeholder}
            className="w-full px-3 py-2 rounded border"
            style={{
              borderColor: borderColor,
              color: textColor,
              fontSize: `${fontSize}px`,
              borderRadius: `${borderRadius}px`,
            }}
            disabled
          />

          <button
            className="w-full py-3 px-4 rounded font-medium"
            style={{
              backgroundColor: buttonBackgroundColor,
              color: buttonTextColor,
              borderRadius: `${borderRadius}px`,
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

      <CardContent className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* === CONTEÚDO === */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Conteúdo
          </h3>

          <PropertyInput
            label="Título/Label"
            value={title}
            onChange={value => handleContentUpdate('title', value)}
            required={true}
            placeholder="NOME"
          />

          <PropertyInput
            label="Placeholder"
            value={placeholder}
            onChange={value => handleContentUpdate('placeholder', value)}
            placeholder="Digite seu nome"
          />

          <PropertyInput
            label="Texto do Botão"
            value={buttonText}
            onChange={value => handleContentUpdate('buttonText', value)}
            required={true}
            placeholder="Quero Descobrir meu Estilo Agora!"
          />

          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo de Campo</Label>
            <Select
              value={fieldType}
              onValueChange={value => handleContentUpdate('fieldType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fieldTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* === COMPORTAMENTO === */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Comportamento
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="required">Campo Obrigatório</Label>
                <p className="text-xs text-gray-500">Torna o preenchimento obrigatório</p>
              </div>
              <Switch
                id="required"
                checked={required}
                onCheckedChange={checked => handleContentUpdate('required', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableButtonOnlyWhenValid">Botão Apenas se Válido</Label>
                <p className="text-xs text-gray-500">Habilita botão só quando campo válido</p>
              </div>
              <Switch
                id="enableButtonOnlyWhenValid"
                checked={enableButtonOnlyWhenValid}
                onCheckedChange={checked =>
                  handleContentUpdate('enableButtonOnlyWhenValid', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showValidationFeedback">Mostrar Feedback</Label>
                <p className="text-xs text-gray-500">Exibe mensagens de validação</p>
              </div>
              <Switch
                id="showValidationFeedback"
                checked={showValidationFeedback}
                onCheckedChange={checked => handleContentUpdate('showValidationFeedback', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoAdvanceOnComplete">Avançar Automaticamente</Label>
                <p className="text-xs text-gray-500">Vai para próxima etapa automaticamente</p>
              </div>
              <Switch
                id="autoAdvanceOnComplete"
                checked={autoAdvanceOnComplete}
                onCheckedChange={checked => handleContentUpdate('autoAdvanceOnComplete', checked)}
              />
            </div>

            <PropertyInput
              label="Chave de Dados"
              value={dataKey}
              onChange={value => handleContentUpdate('dataKey', value)}
              placeholder="userName"
            />
          </div>
        </div>

        <Separator />

        {/* === MENSAGENS === */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Mensagens</h3>

          <PropertyInput
            label="Mensagem de Campo Obrigatório"
            value={requiredMessage}
            onChange={value => handleContentUpdate('requiredMessage', value)}
            placeholder="Por favor, digite seu nome para continuar"
          />

          <PropertyInput
            label="Mensagem de Validação"
            value={validationMessage}
            onChange={value => handleContentUpdate('validationMessage', value)}
            placeholder="Digite seu nome para continuar"
          />

          <PropertyInput
            label="Mensagem de Sucesso"
            value={successMessage}
            onChange={value => handleContentUpdate('successMessage', value)}
            placeholder="Perfeito! Vamos descobrir seu estilo!"
          />
        </div>

        <Separator />

        {/* === DIMENSÕES === */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Dimensões e Espaçamento
          </h3>

          <PropertySlider
            label="Tamanho da Fonte"
            value={fontSize}
            onChange={value => handleContentUpdate('fontSize', value)}
            min={12}
            max={24}
            step={1}
            unit="px"
          />

          <PropertySlider
            label="Arredondamento das Bordas"
            value={borderRadius}
            onChange={value => handleContentUpdate('borderRadius', value)}
            min={0}
            max={20}
            step={1}
            unit="px"
          />

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
              max={50}
              step={2}
              unit="px"
            />

            <PropertySlider
              label="Padding Inferior"
              value={paddingBottom}
              onChange={value => handleContentUpdate('paddingBottom', value)}
              min={0}
              max={50}
              step={2}
              unit="px"
            />

            <PropertySlider
              label="Padding Esquerdo"
              value={paddingLeft}
              onChange={value => handleContentUpdate('paddingLeft', value)}
              min={0}
              max={50}
              step={2}
              unit="px"
            />

            <PropertySlider
              label="Padding Direito"
              value={paddingRight}
              onChange={value => handleContentUpdate('paddingRight', value)}
              min={0}
              max={50}
              step={2}
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
            label="Cor de Fundo"
            value={backgroundColor}
            onChange={value => handleContentUpdate('backgroundColor', value)}
          />

          <PropertyColorPicker
            label="Cor da Borda"
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
            label="Cor do Label"
            value={labelColor}
            onChange={value => handleContentUpdate('labelColor', value)}
            allowTransparent={false}
          />

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
        </div>

        <Separator />

        {/* === PREVIEW === */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[#6B4F43] mb-2 flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview:
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
            {title && (
              <label className="block text-sm font-medium" style={{ color: labelColor }}>
                {title}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}

            <input
              type={fieldType}
              placeholder={placeholder}
              className="w-full px-3 py-2 border"
              style={{
                borderColor: borderColor,
                color: textColor,
                fontSize: `${fontSize}px`,
                borderRadius: `${borderRadius}px`,
              }}
              disabled
            />

            <button
              className="w-full py-3 px-4 font-medium"
              style={{
                backgroundColor: buttonBackgroundColor,
                color: buttonTextColor,
                borderRadius: `${borderRadius}px`,
              }}
              disabled
            >
              {buttonText}
            </button>

            {showValidationFeedback && validationMessage && (
              <p className="text-xs text-gray-500 mt-1">{validationMessage}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
