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
import { Textarea } from '@/components/ui/textarea';
import { Block } from '@/types/editor';
import { AlignCenter, AlignLeft, AlignRight, Eye, FileText, Palette, Type } from 'lucide-react';
import React from 'react';
import { PropertyNumber } from '../components/PropertyNumber';

interface TextPropertyEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  isPreviewMode?: boolean;
}

export const TextPropertyEditor: React.FC<TextPropertyEditorProps> = ({
  block,
  onUpdate,
  isPreviewMode = false,
}) => {
  // Propriedades específicas do texto
  const text = block.content?.text || '';
  const textType = block.content?.textType || 'paragraph';
  const fontSize = block.content?.fontSize || 16;
  const fontWeight = block.content?.fontWeight || 'normal';
  const textAlign = block.content?.textAlign || 'left';
  const color = block.content?.color || '#000000';
  const backgroundColor = block.content?.backgroundColor || 'transparent';
  const isMarkdown = block.content?.isMarkdown || false;
  const maxLength = block.content?.maxLength || 1000;
  const placeholder = block.content?.placeholder || '';

  const handleContentUpdate = (field: string, value: any) => {
    const updates = {
      content: {
        ...block.content,
        [field]: value,
      },
    };
    onUpdate(updates);
  };

  const textTypeOptions = [
    { value: 'heading1', label: 'Título 1 (H1)' },
    { value: 'heading2', label: 'Título 2 (H2)' },
    { value: 'heading3', label: 'Título 3 (H3)' },
    { value: 'paragraph', label: 'Parágrafo' },
    { value: 'lead', label: 'Texto Destacado' },
    { value: 'small', label: 'Texto Pequeno' },
    { value: 'caption', label: 'Legenda' },
  ];

  const fontWeightOptions = [
    { value: 'light', label: 'Leve' },
    { value: 'normal', label: 'Normal' },
    { value: 'medium', label: 'Médio' },
    { value: 'semibold', label: 'Semi Negrito' },
    { value: 'bold', label: 'Negrito' },
    { value: 'extrabold', label: 'Extra Negrito' },
  ];

  const alignmentOptions = [
    { value: 'left', label: 'Esquerda', icon: AlignLeft },
    { value: 'center', label: 'Centro', icon: AlignCenter },
    { value: 'right', label: 'Direita', icon: AlignRight },
  ];

  const renderPreview = () => {
    const numericFontSize = typeof fontSize === 'number' ? fontSize : parseInt(fontSize) || 16;

    const baseStyles = {
      fontSize: `${numericFontSize}px`,
      fontWeight,
      textAlign: textAlign as 'left' | 'center' | 'right',
      color,
      backgroundColor,
      padding: backgroundColor !== 'transparent' ? '8px 12px' : '0',
      borderRadius: backgroundColor !== 'transparent' ? '4px' : '0',
      lineHeight: '1.5',
    };

    const typeStyles = {
      heading1: {
        fontSize: Math.max(numericFontSize, 32),
        fontWeight: 'bold',
        marginBottom: '16px',
      },
      heading2: {
        fontSize: Math.max(numericFontSize, 24),
        fontWeight: 'bold',
        marginBottom: '12px',
      },
      heading3: {
        fontSize: Math.max(numericFontSize, 20),
        fontWeight: 'semibold',
        marginBottom: '8px',
      },
      paragraph: { fontSize: numericFontSize, lineHeight: '1.6' },
      lead: { fontSize: Math.max(numericFontSize, 18), fontWeight: 'medium' },
      small: { fontSize: Math.min(numericFontSize, 14) },
      caption: { fontSize: Math.min(numericFontSize, 12), opacity: 0.8 },
    };

    const finalStyles = {
      ...baseStyles,
      ...typeStyles[textType as keyof typeof typeStyles],
    };

    return <div style={finalStyles}>{text || placeholder || 'Digite o texto aqui...'}</div>;
  };

  if (isPreviewMode) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-[#B89B7A]" />
            Preview: Texto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-gray-50 min-h-[100px] flex items-center justify-center">
            {renderPreview()}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#B89B7A]" />
          Propriedades: Texto
          <Badge variant="secondary" className="ml-auto">
            {text.length}/{maxLength}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Conteúdo do Texto */}
        <div className="space-y-2">
          <Label htmlFor="text">Conteúdo do Texto</Label>
          <Textarea
            id="text"
            value={text}
            onChange={e => handleContentUpdate('text', e.target.value)}
            placeholder={placeholder || 'Digite o texto aqui...'}
            className="min-h-[120px] resize-none"
            maxLength={maxLength}
          />
          {placeholder && (
            <div className="space-y-2">
              <Label htmlFor="placeholder">Texto de Placeholder</Label>
              <Input
                id="placeholder"
                value={placeholder}
                onChange={e => handleContentUpdate('placeholder', e.target.value)}
                placeholder="Texto mostrado quando vazio..."
              />
            </div>
          )}
        </div>

        <Separator />

        {/* Tipo e Estilo */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Type className="h-4 w-4" />
            Tipo e Formatação
          </h3>

          <div className="space-y-2">
            <Label htmlFor="textType">Tipo de Texto</Label>
            <Select
              value={textType}
              onValueChange={value => handleContentUpdate('textType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {textTypeOptions
                  .filter(option => option.value && option.value !== '')
                  .map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <PropertyNumber
                label="Tamanho da Fonte"
                value={fontSize}
                onChange={(value: number) => handleContentUpdate('fontSize', value)}
                min={8}
                max={72}
                step={1}
              />
              <span className="text-xs text-gray-500">pixels</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontWeight">Peso da Fonte</Label>
              <Select
                value={fontWeight}
                onValueChange={value => handleContentUpdate('fontWeight', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontWeightOptions
                    .filter(option => option.value && option.value !== '')
                    .map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Alinhamento */}
        <div className="space-y-2">
          <Label>Alinhamento do Texto</Label>
          <div className="flex gap-2">
            {alignmentOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => handleContentUpdate('textAlign', value)}
                className={`flex items-center justify-center p-2 rounded border transition-colors ${
                  textAlign === value
                    ? 'border-[#B89B7A] bg-[#B89B7A]/10 text-[#B89B7A]'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                title={label}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Cores */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Cores
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Cor do Texto</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="color"
                  value={color}
                  onChange={e => handleContentUpdate('color', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={color}
                  onChange={e => handleContentUpdate('color', e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Cor de Fundo</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="backgroundColor"
                  value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                  onChange={e => handleContentUpdate('backgroundColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={backgroundColor}
                  onChange={e => handleContentUpdate('backgroundColor', e.target.value)}
                  placeholder="transparent"
                  className="flex-1"
                />
              </div>
              {backgroundColor !== 'transparent' && (
                <button
                  onClick={() => handleContentUpdate('backgroundColor', 'transparent')}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  Remover fundo
                </button>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Configurações Avançadas */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Configurações Avançadas</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isMarkdown">Suporte a Markdown</Label>
              <p className="text-sm text-gray-500">
                Permite formatação com Markdown (negrito, itálico, etc.)
              </p>
            </div>
            <Switch
              id="isMarkdown"
              checked={isMarkdown}
              onCheckedChange={checked => handleContentUpdate('isMarkdown', checked)}
            />
          </div>

          <div className="space-y-2">
            <PropertyNumber
              label="Limite de Caracteres"
              value={maxLength}
              onChange={(value: number) => handleContentUpdate('maxLength', value)}
              min={10}
              max={5000}
              step={10}
            />
            <span className="text-xs text-gray-500">caracteres</span>
          </div>
        </div>

        <Separator />

        {/* Preview */}
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="border rounded-lg p-4 bg-gray-50 min-h-[60px] flex items-center">
            {renderPreview()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
