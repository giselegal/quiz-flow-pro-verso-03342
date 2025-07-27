/**
 * ModernPropertyPanel - Painel de propriedades modernizado
 * 
 * Usa React Hook Form + Zod + Shadcn UI para uma experiência melhor
 */

import React from 'react';
import { useBlockForm } from '@/hooks/useBlockForm';
import { Block } from '@/hooks/useBlockForm';
import { PropertyGroup, PropertyField, PropertySection } from '@/components/ui/PropertyGroup';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Settings, Type, Palette, Layout, Eye, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernPropertyPanelProps {
  selectedBlock: Block | null;
  onUpdate: (updates: Partial<Block>) => void;
  className?: string;
}

export function ModernPropertyPanel({
  selectedBlock,
  onUpdate,
  className
}: ModernPropertyPanelProps) {
  const {
    form,
    updateProperty,
    errors,
    isValid,
    isDirty
  } = useBlockForm(selectedBlock, {
    onUpdate,
    debounceMs: 300,
    validateOnChange: true
  });

  if (!selectedBlock) {
    return (
      <div className={cn('h-full flex items-center justify-center p-6', className)}>
        <div className="text-center space-y-3">
          <Settings className="w-12 h-12 text-gray-400 mx-auto" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Nenhum bloco selecionado
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Selecione um bloco para editar suas propriedades
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { watch } = form;
  const formValues = watch();

  return (
    <div className={cn('h-full flex flex-col', className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Propriedades
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {selectedBlock.type}
              </Badge>
              {isDirty && (
                <Badge variant="secondary" className="text-xs">
                  Modificado
                </Badge>
              )}
              {!isValid && (
                <Badge variant="destructive" className="text-xs">
                  Erro
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {renderPropertiesForBlockType(
            selectedBlock.type,
            formValues,
            updateProperty,
            errors
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

/**
 * Renderiza propriedades específicas para cada tipo de bloco
 */
function renderPropertiesForBlockType(
  blockType: string,
  values: Record<string, any>,
  updateProperty: (key: string, value: any) => void,
  errors: Record<string, string>
) {
  switch (blockType) {
    case 'text':
    case 'text-inline':
      return renderTextProperties(values, updateProperty, errors);
    
    case 'rich-text':
      return renderRichTextProperties(values, updateProperty, errors);
    
    case 'header':
    case 'heading':
    case 'heading-inline':
      return renderHeaderProperties(values, updateProperty, errors);
    
    case 'button':
    case 'button-inline':
      return renderButtonProperties(values, updateProperty, errors);
    
    case 'image':
    case 'image-display-inline':
      return renderImageProperties(values, updateProperty, errors);
    
    case 'spacer':
      return renderSpacerProperties(values, updateProperty, errors);
    
    case 'quiz-step':
      return renderQuizStepProperties(values, updateProperty, errors);
    
    // ✅ COMPONENTES ESPECÍFICOS DAS 21 ETAPAS
    case 'quiz-intro-header':
      return renderQuizIntroHeaderProperties(values, updateProperty, errors);
    
    case 'options-grid':
      return renderOptionsGridProperties(values, updateProperty, errors);
    
    case 'form-input':
      return renderFormInputProperties(values, updateProperty, errors);
    
    case 'result-header-inline':
      return renderResultHeaderProperties(values, updateProperty, errors);
    
    case 'result-card-inline':
      return renderResultCardProperties(values, updateProperty, errors);
    
    case 'style-card-inline':
      return renderStyleCardProperties(values, updateProperty, errors);
    
    default:
      return renderGenericProperties(values, updateProperty, errors);
  }
}

/**
 * Propriedades para blocos de texto
 */
function renderTextProperties(
  values: any,
  updateProperty: (key: string, value: any) => void,
  errors: Record<string, string>
) {
  return (
    <>
      <PropertyGroup title="Conteúdo" description="Texto e formatação básica">
        <PropertyField label="Texto" error={errors.content} required>
          <Textarea
            value={values.content || ''}
            onChange={(e) => updateProperty('content', e.target.value)}
            placeholder="Digite o texto aqui..."
            rows={3}
          />
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Aparência" description="Estilo visual do texto">
        <PropertyField label="Tamanho da Fonte" error={errors.fontSize}>
          <div className="space-y-2">
            <Slider
              value={[values.fontSize || 16]}
              onValueChange={([value]) => updateProperty('fontSize', value)}
              min={8}
              max={72}
              step={1}
              className="flex-1"
            />
            <div className="text-xs text-gray-500 text-center">
              {values.fontSize || 16}px
            </div>
          </div>
        </PropertyField>

        <PropertyField label="Cor do Texto" error={errors.textColor}>
          <ColorPicker
            value={values.textColor || '#000000'}
            onChange={(color) => updateProperty('textColor', color)}
          />
        </PropertyField>

        <PropertyField label="Alinhamento" error={errors.textAlign}>
          <Select
            value={values.textAlign || 'left'}
            onValueChange={(value) => updateProperty('textAlign', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Esquerda</SelectItem>
              <SelectItem value="center">Centro</SelectItem>
              <SelectItem value="right">Direita</SelectItem>
            </SelectContent>
          </Select>
        </PropertyField>
      </PropertyGroup>
    </>
  );
}

/**
 * Propriedades para blocos de texto rico
 */
function renderRichTextProperties(
  values: any,
  updateProperty: (key: string, value: any) => void,
  errors: Record<string, string>
) {
  return (
    <>
      <PropertyGroup title="Configurações" description="Opções do editor de texto rico">
        <PropertyField label="Altura Mínima" error={errors.minHeight}>
          <div className="space-y-2">
            <Slider
              value={[values.minHeight || 100]}
              onValueChange={([value]) => updateProperty('minHeight', value)}
              min={50}
              max={500}
              step={10}
            />
            <div className="text-xs text-gray-500 text-center">
              {values.minHeight || 100}px
            </div>
          </div>
        </PropertyField>

        <PropertyField label="Texto de Placeholder" error={errors.placeholder}>
          <Input
            value={values.placeholder || ''}
            onChange={(e) => updateProperty('placeholder', e.target.value)}
            placeholder="Digite seu texto aqui..."
          />
        </PropertyField>
      </PropertyGroup>
    </>
  );
}

/**
 * Propriedades para blocos de cabeçalho
 */
function renderHeaderProperties(
  values: any,
  updateProperty: (key: string, value: any) => void,
  errors: Record<string, string>
) {
  return (
    <>
      <PropertyGroup title="Conteúdo" description="Texto do cabeçalho">
        <PropertyField label="Título" error={errors.content} required>
          <Input
            value={values.content || ''}
            onChange={(e) => updateProperty('content', e.target.value)}
            placeholder="Título do cabeçalho"
          />
        </PropertyField>

        <PropertyField label="Nível" error={errors.level}>
          <Select
            value={values.level || 'h1'}
            onValueChange={(value) => updateProperty('level', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="h1">H1 - Título Principal</SelectItem>
              <SelectItem value="h2">H2 - Subtítulo</SelectItem>
              <SelectItem value="h3">H3 - Seção</SelectItem>
              <SelectItem value="h4">H4 - Subseção</SelectItem>
              <SelectItem value="h5">H5 - Menor</SelectItem>
              <SelectItem value="h6">H6 - Mínimo</SelectItem>
            </SelectContent>
          </Select>
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Aparência" description="Estilo visual do cabeçalho">
        <PropertyField label="Tamanho da Fonte" error={errors.fontSize}>
          <div className="space-y-2">
            <Slider
              value={[values.fontSize || 32]}
              onValueChange={([value]) => updateProperty('fontSize', value)}
              min={12}
              max={96}
              step={2}
            />
            <div className="text-xs text-gray-500 text-center">
              {values.fontSize || 32}px
            </div>
          </div>
        </PropertyField>

        <PropertyField label="Cor do Texto" error={errors.textColor}>
          <ColorPicker
            value={values.textColor || '#1a202c'}
            onChange={(color) => updateProperty('textColor', color)}
          />
        </PropertyField>

        <PropertyField label="Alinhamento" error={errors.textAlign}>
          <Select
            value={values.textAlign || 'center'}
            onValueChange={(value) => updateProperty('textAlign', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Esquerda</SelectItem>
              <SelectItem value="center">Centro</SelectItem>
              <SelectItem value="right">Direita</SelectItem>
            </SelectContent>
          </Select>
        </PropertyField>
      </PropertyGroup>
    </>
  );
}

/**
 * Propriedades para blocos de botão
 */
function renderButtonProperties(
  values: any,
  updateProperty: (key: string, value: any) => void,
  errors: Record<string, string>
) {
  return (
    <>
      <PropertyGroup title="Conteúdo" description="Texto e ação do botão">
        <PropertyField label="Texto do Botão" error={errors.text} required>
          <Input
            value={values.text || ''}
            onChange={(e) => updateProperty('text', e.target.value)}
            placeholder="Clique aqui"
          />
        </PropertyField>

        <PropertyField label="Link/URL" error={errors.link}>
          <Input
            value={values.link || ''}
            onChange={(e) => updateProperty('link', e.target.value)}
            placeholder="https://exemplo.com"
            type="url"
          />
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Aparência" description="Cores e estilo do botão">
        <PropertyField label="Cor de Fundo" error={errors.backgroundColor}>
          <ColorPicker
            value={values.backgroundColor || '#3b82f6'}
            onChange={(color) => updateProperty('backgroundColor', color)}
          />
        </PropertyField>

        <PropertyField label="Cor do Texto" error={errors.textColor}>
          <ColorPicker
            value={values.textColor || '#ffffff'}
            onChange={(color) => updateProperty('textColor', color)}
          />
        </PropertyField>

        <PropertyField label="Largura Total">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={values.fullWidth || false}
              onCheckedChange={(checked) => updateProperty('fullWidth', checked)}
            />
            <span className="text-sm">Ocupar toda a largura</span>
          </div>
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Espaçamento" description="Padding e bordas">
        <PropertyField label="Padding Horizontal" error={errors.paddingX}>
          <div className="space-y-2">
            <Slider
              value={[values.paddingX || 16]}
              onValueChange={([value]) => updateProperty('paddingX', value)}
              min={0}
              max={48}
              step={2}
            />
            <div className="text-xs text-gray-500 text-center">
              {values.paddingX || 16}px
            </div>
          </div>
        </PropertyField>

        <PropertyField label="Padding Vertical" error={errors.paddingY}>
          <div className="space-y-2">
            <Slider
              value={[values.paddingY || 8]}
              onValueChange={([value]) => updateProperty('paddingY', value)}
              min={0}
              max={32}
              step={2}
            />
            <div className="text-xs text-gray-500 text-center">
              {values.paddingY || 8}px
            </div>
          </div>
        </PropertyField>

        <PropertyField label="Raio da Borda" error={errors.borderRadius}>
          <div className="space-y-2">
            <Slider
              value={[values.borderRadius || 6]}
              onValueChange={([value]) => updateProperty('borderRadius', value)}
              min={0}
              max={24}
              step={1}
            />
            <div className="text-xs text-gray-500 text-center">
              {values.borderRadius || 6}px
            </div>
          </div>
        </PropertyField>
      </PropertyGroup>
    </>
  );
}

/**
 * Propriedades para blocos de imagem
 */
function renderImageProperties(
  values: any,
  updateProperty: (key: string, value: any) => void,
  errors: Record<string, string>
) {
  return (
    <>
      <PropertyGroup title="Imagem" description="Fonte e configuração da imagem">
        <PropertyField label="URL da Imagem" error={errors.src} required>
          <ImageUploader
            value={values.src || ''}
            onChange={(url) => updateProperty('src', url)}
          />
        </PropertyField>

        <PropertyField label="Texto Alternativo" error={errors.alt} required>
          <Input
            value={values.alt || ''}
            onChange={(e) => updateProperty('alt', e.target.value)}
            placeholder="Descrição da imagem"
          />
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Dimensões" description="Tamanho e proporção">
        <PropertyField label="Largura" error={errors.width}>
          <Input
            type="number"
            value={values.width || ''}
            onChange={(e) => updateProperty('width', Number(e.target.value))}
            placeholder="Auto"
          />
        </PropertyField>

        <PropertyField label="Altura" error={errors.height}>
          <Input
            type="number"
            value={values.height || ''}
            onChange={(e) => updateProperty('height', Number(e.target.value))}
            placeholder="Auto"
          />
        </PropertyField>

        <PropertyField label="Ajuste" error={errors.objectFit}>
          <Select
            value={values.objectFit || 'cover'}
            onValueChange={(value) => updateProperty('objectFit', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cover">Cobrir (Cover)</SelectItem>
              <SelectItem value="contain">Conter (Contain)</SelectItem>
              <SelectItem value="fill">Preencher (Fill)</SelectItem>
              <SelectItem value="none">Nenhum</SelectItem>
              <SelectItem value="scale-down">Reduzir</SelectItem>
            </SelectContent>
          </Select>
        </PropertyField>
      </PropertyGroup>
    </>
  );
}

/**
 * Propriedades para blocos espaçadores
 */
function renderSpacerProperties(
  values: any,
  updateProperty: (key: string, value: any) => void,
  errors: Record<string, string>
) {
  return (
    <>
      <PropertyGroup title="Espaçamento" description="Altura e aparência do espaçador">
        <PropertyField label="Altura" error={errors.height} required>
          <div className="space-y-2">
            <Slider
              value={[values.height || 20]}
              onValueChange={([value]) => updateProperty('height', value)}
              min={1}
              max={200}
              step={1}
            />
            <div className="text-xs text-gray-500 text-center">
              {values.height || 20}px
            </div>
          </div>
        </PropertyField>

        <PropertyField label="Cor de Fundo">
          <ColorPicker
            value={values.backgroundColor || 'transparent'}
            onChange={(color) => updateProperty('backgroundColor', color)}
          />
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Borda" description="Linha divisória opcional">
        <PropertyField label="Estilo da Borda" error={errors.borderStyle}>
          <Select
            value={values.borderStyle || 'none'}
            onValueChange={(value) => updateProperty('borderStyle', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhuma</SelectItem>
              <SelectItem value="solid">Sólida</SelectItem>
              <SelectItem value="dashed">Tracejada</SelectItem>
              <SelectItem value="dotted">Pontilhada</SelectItem>
            </SelectContent>
          </Select>
        </PropertyField>

        {values.borderStyle !== 'none' && (
          <PropertyField label="Cor da Borda" error={errors.borderColor}>
            <ColorPicker
              value={values.borderColor || '#e5e7eb'}
              onChange={(color) => updateProperty('borderColor', color)}
            />
          </PropertyField>
        )}
      </PropertyGroup>
    </>
  );
}

/**
 * Propriedades para Quiz Step (versão básica)
 */
function renderQuizStepProperties(
  values: any,
  updateProperty: (key: string, value: any) => void,
  errors: Record<string, string>
) {
  return (
    <>
      <PropertyGroup title="Pergunta" description="Texto e formatação da pergunta">
        <PropertyField label="Texto da Pergunta" error={errors.questionText} required>
          <Textarea
            value={values.questionText || ''}
            onChange={(e) => updateProperty('questionText', e.target.value)}
            placeholder="Digite a pergunta aqui..."
            rows={2}
          />
        </PropertyField>

        <PropertyField label="Tamanho da Fonte" error={errors.questionTextSize}>
          <div className="space-y-2">
            <Slider
              value={[values.questionTextSize || 24]}
              onValueChange={([value]) => updateProperty('questionTextSize', value)}
              min={12}
              max={48}
              step={2}
            />
            <div className="text-xs text-gray-500 text-center">
              {values.questionTextSize || 24}px
            </div>
          </div>
        </PropertyField>

        <PropertyField label="Cor do Texto" error={errors.questionTextColor}>
          <ColorPicker
            value={values.questionTextColor || '#000000'}
            onChange={(color) => updateProperty('questionTextColor', color)}
          />
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Layout" description="Organização das opções">
        <PropertyField label="Colunas" error={errors.layout}>
          <Select
            value={values.layout || '2-columns'}
            onValueChange={(value) => updateProperty('layout', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-column">1 Coluna</SelectItem>
              <SelectItem value="2-columns">2 Colunas</SelectItem>
              <SelectItem value="3-columns">3 Colunas</SelectItem>
              <SelectItem value="4-columns">4 Colunas</SelectItem>
            </SelectContent>
          </Select>
        </PropertyField>

        <PropertyField label="Estilo das Opções" error={errors.optionStyle}>
          <Select
            value={values.optionStyle || 'card'}
            onValueChange={(value) => updateProperty('optionStyle', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Simples</SelectItem>
              <SelectItem value="card">Card</SelectItem>
            </SelectContent>
          </Select>
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Comportamento" description="Regras de seleção">
        <PropertyField label="Múltipla Escolha">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={values.isMultipleChoice || false}
              onCheckedChange={(checked) => updateProperty('isMultipleChoice', checked)}
            />
            <span className="text-sm">Permitir múltiplas seleções</span>
          </div>
        </PropertyField>

        <PropertyField label="Obrigatório">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={values.isRequired !== false}
              onCheckedChange={(checked) => updateProperty('isRequired', checked)}
            />
            <span className="text-sm">Seleção obrigatória</span>
          </div>
        </PropertyField>

        <PropertyField label="Avançar Automaticamente">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={values.autoProceed || false}
              onCheckedChange={(checked) => updateProperty('autoProceed', checked)}
            />
            <span className="text-sm">Avançar após seleção</span>
          </div>
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Cores" description="Paleta de cores do quiz">
        <PropertyField label="Cor Primária" error={errors.primaryColor}>
          <ColorPicker
            value={values.primaryColor || '#3b82f6'}
            onChange={(color) => updateProperty('primaryColor', color)}
          />
        </PropertyField>

        <PropertyField label="Cor Secundária" error={errors.secondaryColor}>
          <ColorPicker
            value={values.secondaryColor || '#ffffff'}
            onChange={(color) => updateProperty('secondaryColor', color)}
          />
        </PropertyField>

        <PropertyField label="Cor da Borda" error={errors.borderColor}>
          <ColorPicker
            value={values.borderColor || '#e5e7eb'}
            onChange={(color) => updateProperty('borderColor', color)}
          />
        </PropertyField>
      </PropertyGroup>
    </>
  );
}

/**
 * Propriedades genéricas para tipos não reconhecidos
 */
function renderGenericProperties(
  values: any,
  updateProperty: (key: string, value: any) => void,
  errors: Record<string, string>
) {
  return (
    <PropertyGroup title="Propriedades" description="Configurações disponíveis">
      <div className="space-y-4">
        {Object.entries(values).map(([key, value]) => (
          <PropertyField key={key} label={key} error={errors[key]}>
            {typeof value === 'boolean' ? (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={value}
                  onCheckedChange={(checked) => updateProperty(key, checked)}
                />
                <span className="text-sm">{key}</span>
              </div>
            ) : typeof value === 'number' ? (
              <Input
                type="number"
                value={value}
                onChange={(e) => updateProperty(key, Number(e.target.value))}
              />
            ) : (
              <Input
                value={String(value)}
                onChange={(e) => updateProperty(key, e.target.value)}
              />
            )}
          </PropertyField>
        ))}
      </div>
    </PropertyGroup>
  );
}

// ====================================================================
// 🎯 PROPRIEDADES ESPECÍFICAS DOS COMPONENTES DAS 21 ETAPAS DO FUNIL
// ====================================================================

/**
 * Propriedades para quiz-intro-header
 */
function renderQuizIntroHeaderProperties(
  values: any,
  updateProperty: (key: string, value: any) => void,
  errors: Record<string, string>
) {
  return (
    <>
      <PropertyGroup title="Logo" description="Configurações do logotipo">
        <PropertyField label="URL do Logo" error={errors.logoUrl} required>
          <ImageUploader
            value={values.logoUrl || ''}
            onChange={(url) => updateProperty('logoUrl', url)}
          />
        </PropertyField>

        <PropertyField label="Texto Alternativo" error={errors.logoAlt}>
          <Input
            value={values.logoAlt || ''}
            onChange={(e) => updateProperty('logoAlt', e.target.value)}
            placeholder="Logo da empresa"
          />
        </PropertyField>

        <PropertyField label="Largura do Logo" error={errors.logoWidth}>
          <div className="space-y-2">
            <Slider
              value={[values.logoWidth || 96]}
              onValueChange={([value]) => updateProperty('logoWidth', value)}
              min={32}
              max={200}
              step={4}
            />
            <div className="text-xs text-gray-500 text-center">
              {values.logoWidth || 96}px
            </div>
          </div>
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Progresso" description="Barra de progresso do quiz">
        <PropertyField label="Valor do Progresso" error={errors.progressValue}>
          <div className="space-y-2">
            <Slider
              value={[values.progressValue || 0]}
              onValueChange={([value]) => updateProperty('progressValue', value)}
              min={0}
              max={100}
              step={1}
            />
            <div className="text-xs text-gray-500 text-center">
              {values.progressValue || 0}%
            </div>
          </div>
        </PropertyField>

        <PropertyField label="Mostrar Botão Voltar">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={values.showBackButton !== false}
              onCheckedChange={(checked) => updateProperty('showBackButton', checked)}
            />
            <span className="text-sm">Exibir botão voltar</span>
          </div>
        </PropertyField>
      </PropertyGroup>
    </>
  );
}

/**
 * Propriedades para options-grid
 */
function renderOptionsGridProperties(
  values: any,
  updateProperty: (key: string, value: any) => void,
  errors: Record<string, string>
) {
  const options = values.options || [];

  return (
    <>
      <PropertyGroup title="Layout" description="Organização das opções">
        <PropertyField label="Colunas" error={errors.columns}>
          <Select
            value={String(values.columns || 2)}
            onValueChange={(value) => updateProperty('columns', Number(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Coluna</SelectItem>
              <SelectItem value="2">2 Colunas</SelectItem>
              <SelectItem value="3">3 Colunas</SelectItem>
              <SelectItem value="4">4 Colunas</SelectItem>
            </SelectContent>
          </Select>
        </PropertyField>

        <PropertyField label="Mostrar Imagens">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={values.showImages !== false}
              onCheckedChange={(checked) => updateProperty('showImages', checked)}
            />
            <span className="text-sm">Exibir imagens nas opções</span>
          </div>
        </PropertyField>

        <PropertyField label="Tamanho das Imagens" error={errors.imageSize}>
          <Select
            value={values.imageSize || 'large'}
            onValueChange={(value) => updateProperty('imageSize', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Pequeno</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
            </SelectContent>
          </Select>
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Seleção" description="Regras de seleção das opções">
        <PropertyField label="Múltipla Seleção">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={values.multipleSelection || false}
              onCheckedChange={(checked) => updateProperty('multipleSelection', checked)}
            />
            <span className="text-sm">Permitir seleção múltipla</span>
          </div>
        </PropertyField>

        <PropertyField label="Máximo de Seleções" error={errors.maxSelections}>
          <Input
            type="number"
            value={values.maxSelections || 1}
            onChange={(e) => updateProperty('maxSelections', Number(e.target.value))}
            min={1}
            max={10}
          />
        </PropertyField>

        <PropertyField label="Mensagem de Validação" error={errors.validationMessage}>
          <Input
            value={values.validationMessage || ''}
            onChange={(e) => updateProperty('validationMessage', e.target.value)}
            placeholder="Selecione uma opção"
          />
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Opções" description={`${options.length} opções configuradas`}>
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-2">⚠️ Opções gerenciadas pelo sistema</p>
          <p>As opções são automaticamente carregadas dos dados do quiz. Para editar as opções, modifique os dados das questões no arquivo de configuração.</p>
          {options.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                Opções atuais: {options.map((opt: any) => opt.text).join(', ')}
              </p>
            </div>
          )}
        </div>
      </PropertyGroup>
    </>
  );
}

/**
 * Propriedades para form-input
 */
function renderFormInputProperties(
  values: any,
  updateProperty: (key: string, value: any) => void,
  errors: Record<string, string>
) {
  return (
    <>
      <PropertyGroup title="Campo" description="Configurações do campo de entrada">
        <PropertyField label="Label" error={errors.label} required>
          <Input
            value={values.label || ''}
            onChange={(e) => updateProperty('label', e.target.value)}
            placeholder="Nome do campo"
          />
        </PropertyField>

        <PropertyField label="Placeholder" error={errors.placeholder}>
          <Input
            value={values.placeholder || ''}
            onChange={(e) => updateProperty('placeholder', e.target.value)}
            placeholder="Digite aqui..."
          />
        </PropertyField>

        <PropertyField label="Tipo de Campo" error={errors.inputType}>
          <Select
            value={values.inputType || 'text'}
            onValueChange={(value) => updateProperty('inputType', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Texto</SelectItem>
              <SelectItem value="email">E-mail</SelectItem>
              <SelectItem value="tel">Telefone</SelectItem>
              <SelectItem value="number">Número</SelectItem>
              <SelectItem value="textarea">Área de texto</SelectItem>
            </SelectContent>
          </Select>
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Validação" description="Regras de validação">
        <PropertyField label="Obrigatório">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={values.required !== false}
              onCheckedChange={(checked) => updateProperty('required', checked)}
            />
            <span className="text-sm">Campo obrigatório</span>
          </div>
        </PropertyField>

        <PropertyField label="Tamanho Mínimo" error={errors.minLength}>
          <Input
            type="number"
            value={values.minLength || ''}
            onChange={(e) => updateProperty('minLength', Number(e.target.value))}
            min={0}
            placeholder="0"
          />
        </PropertyField>

        <PropertyField label="Tamanho Máximo" error={errors.maxLength}>
          <Input
            type="number"
            value={values.maxLength || ''}
            onChange={(e) => updateProperty('maxLength', Number(e.target.value))}
            min={1}
            placeholder="Sem limite"
          />
        </PropertyField>
      </PropertyGroup>
    </>
  );
}

/**
 * Propriedades para result-header-inline
 */
function renderResultHeaderProperties(
  values: any,
  updateProperty: (key: string, value: any) => void,
  errors: Record<string, string>
) {
  return (
    <>
      <PropertyGroup title="Usuário" description="Personalização para o usuário">
        <PropertyField label="Nome do Usuário" error={errors.userName}>
          <Input
            value={values.userName || ''}
            onChange={(e) => updateProperty('userName', e.target.value)}
            placeholder="Nome será preenchido automaticamente"
          />
        </PropertyField>

        <PropertyField label="Mostrar Progresso">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={values.showProgress || false}
              onCheckedChange={(checked) => updateProperty('showProgress', checked)}
            />
            <span className="text-sm">Mostrar barra de progresso completa</span>
          </div>
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Logo" description="Configurações do logotipo">
        <PropertyField label="URL do Logo" error={errors.logoUrl}>
          <ImageUploader
            value={values.logoUrl || ''}
            onChange={(url) => updateProperty('logoUrl', url)}
          />
        </PropertyField>

        <PropertyField label="Largura do Logo" error={errors.logoWidth}>
          <div className="space-y-2">
            <Slider
              value={[values.logoWidth || 96]}
              onValueChange={([value]) => updateProperty('logoWidth', value)}
              min={48}
              max={200}
              step={4}
            />
            <div className="text-xs text-gray-500 text-center">
              {values.logoWidth || 96}px
            </div>
          </div>
        </PropertyField>
      </PropertyGroup>
    </>
  );
}

/**
 * Propriedades para result-card-inline
 */
function renderResultCardProperties(
  values: any,
  updateProperty: (key: string, value: any) => void,
  errors: Record<string, string>
) {
  return (
    <>
      <PropertyGroup title="Resultado" description="Informações do estilo predominante">
        <PropertyField label="Título do Card" error={errors.title} required>
          <Input
            value={values.title || ''}
            onChange={(e) => updateProperty('title', e.target.value)}
            placeholder="Seu Estilo Predominante"
          />
        </PropertyField>

        <PropertyField label="Nome do Estilo" error={errors.styleName}>
          <Input
            value={values.styleName || ''}
            onChange={(e) => updateProperty('styleName', e.target.value)}
            placeholder="Será preenchido automaticamente"
            disabled
          />
        </PropertyField>

        <PropertyField label="Porcentagem" error={errors.percentage}>
          <div className="space-y-2">
            <Slider
              value={[values.percentage || 85]}
              onValueChange={([value]) => updateProperty('percentage', value)}
              min={0}
              max={100}
              step={1}
            />
            <div className="text-xs text-gray-500 text-center">
              {values.percentage || 85}%
            </div>
          </div>
        </PropertyField>

        <PropertyField label="Descrição" error={errors.description}>
          <Textarea
            value={values.description || ''}
            onChange={(e) => updateProperty('description', e.target.value)}
            placeholder="Descrição do estilo..."
            rows={3}
          />
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Imagem" description="Imagem representativa do estilo">
        <PropertyField label="URL da Imagem" error={errors.imageUrl}>
          <ImageUploader
            value={values.imageUrl || ''}
            onChange={(url) => updateProperty('imageUrl', url)}
          />
        </PropertyField>

        <PropertyField label="Mostrar Compatibilidade">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={values.showMatch !== false}
              onCheckedChange={(checked) => updateProperty('showMatch', checked)}
            />
            <span className="text-sm">Exibir porcentagem de compatibilidade</span>
          </div>
        </PropertyField>
      </PropertyGroup>
    </>
  );
}

/**
 * Propriedades para style-card-inline
 */
function renderStyleCardProperties(
  values: any,
  updateProperty: (key: string, value: any) => void,
  errors: Record<string, string>
) {
  return (
    <>
      <PropertyGroup title="Estilo Secundário" description="Configurações do estilo complementar">
        <PropertyField label="Nome do Estilo" error={errors.styleName} required>
          <Input
            value={values.styleName || ''}
            onChange={(e) => updateProperty('styleName', e.target.value)}
            placeholder="Nome do estilo secundário"
          />
        </PropertyField>

        <PropertyField label="Porcentagem" error={errors.percentage}>
          <div className="space-y-2">
            <Slider
              value={[values.percentage || 20]}
              onValueChange={([value]) => updateProperty('percentage', value)}
              min={0}
              max={100}
              step={1}
            />
            <div className="text-xs text-gray-500 text-center">
              {values.percentage || 20}%
            </div>
          </div>
        </PropertyField>

        <PropertyField label="Descrição" error={errors.description}>
          <Textarea
            value={values.description || ''}
            onChange={(e) => updateProperty('description', e.target.value)}
            placeholder="Descrição do estilo secundário..."
            rows={2}
          />
        </PropertyField>

        <PropertyField label="URL da Imagem" error={errors.imageUrl}>
          <ImageUploader
            value={values.imageUrl || ''}
            onChange={(url) => updateProperty('imageUrl', url)}
          />
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Layout" description="Aparência do card">
        <PropertyField label="Modo Compacto">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={values.compact !== false}
              onCheckedChange={(checked) => updateProperty('compact', checked)}
            />
            <span className="text-sm">Usar layout compacto</span>
          </div>
        </PropertyField>
      </PropertyGroup>
    </>
  );
}

/**
 * Propriedades para text-inline
 */
function renderTextInlineProperties(
  values: any,
  updateProperty: (key: string, value: any) => void,
  errors: Record<string, string>
) {
  return (
    <>
      <PropertyGroup title="Conteúdo" description="Texto e formatação">
        <PropertyField label="Texto" error={errors.text} required>
          <Textarea
            value={values.text || ''}
            onChange={(e) => updateProperty('text', e.target.value)}
            placeholder="Digite o texto aqui..."
            rows={4}
          />
        </PropertyField>

        <PropertyField label="Tamanho do Texto" error={errors.size}>
          <Select
            value={values.size || 'medium'}
            onValueChange={(value) => updateProperty('size', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Pequeno</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
            </SelectContent>
          </Select>
        </PropertyField>

        <PropertyField label="Alinhamento" error={errors.align}>
          <Select
            value={values.align || 'left'}
            onValueChange={(value) => updateProperty('align', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Esquerda</SelectItem>
              <SelectItem value="center">Centro</SelectItem>
              <SelectItem value="right">Direita</SelectItem>
              <SelectItem value="justify">Justificado</SelectItem>
            </SelectContent>
          </Select>
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Estilo" description="Aparência do texto">
        <PropertyField label="Negrito">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={values.bold || false}
              onCheckedChange={(checked) => updateProperty('bold', checked)}
            />
            <span className="text-sm">Texto em negrito</span>
          </div>
        </PropertyField>

        <PropertyField label="Itálico">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={values.italic || false}
              onCheckedChange={(checked) => updateProperty('italic', checked)}
            />
            <span className="text-sm">Texto em itálico</span>
          </div>
        </PropertyField>

        <PropertyField label="Cor do Texto" error={errors.color}>
          <Input
            type="color"
            value={values.color || '#000000'}
            onChange={(e) => updateProperty('color', e.target.value)}
          />
        </PropertyField>
      </PropertyGroup>
    </>
  );
}

/**
 * Propriedades para heading-inline
 */
function renderHeadingInlineProperties(
  values: any,
  updateProperty: (key: string, value: any) => void,
  errors: Record<string, string>
) {
  return (
    <>
      <PropertyGroup title="Título" description="Configurações do cabeçalho">
        <PropertyField label="Texto do Título" error={errors.text} required>
          <Input
            value={values.text || ''}
            onChange={(e) => updateProperty('text', e.target.value)}
            placeholder="Digite o título aqui..."
          />
        </PropertyField>

        <PropertyField label="Nível do Título" error={errors.level}>
          <Select
            value={String(values.level || 2)}
            onValueChange={(value) => updateProperty('level', Number(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">H1 - Principal</SelectItem>
              <SelectItem value="2">H2 - Seção</SelectItem>
              <SelectItem value="3">H3 - Subseção</SelectItem>
              <SelectItem value="4">H4 - Parágrafo</SelectItem>
            </SelectContent>
          </Select>
        </PropertyField>

        <PropertyField label="Alinhamento" error={errors.align}>
          <Select
            value={values.align || 'center'}
            onValueChange={(value) => updateProperty('align', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Esquerda</SelectItem>
              <SelectItem value="center">Centro</SelectItem>
              <SelectItem value="right">Direita</SelectItem>
            </SelectContent>
          </Select>
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Estilo" description="Aparência do título">
        <PropertyField label="Cor do Texto" error={errors.color}>
          <Input
            type="color"
            value={values.color || '#1a1a1a'}
            onChange={(e) => updateProperty('color', e.target.value)}
          />
        </PropertyField>

        <PropertyField label="Margem Inferior" error={errors.marginBottom}>
          <div className="space-y-2">
            <Slider
              value={[values.marginBottom || 16]}
              onValueChange={([value]) => updateProperty('marginBottom', value)}
              min={0}
              max={48}
              step={4}
            />
            <div className="text-xs text-gray-500 text-center">
              {values.marginBottom || 16}px
            </div>
          </div>
        </PropertyField>
      </PropertyGroup>
    </>
  );
}

/**
 * Propriedades para image-display-inline
 */
function renderImageDisplayInlineProperties(
  values: any,
  updateProperty: (key: string, value: any) => void,
  errors: Record<string, string>
) {
  return (
    <>
      <PropertyGroup title="Imagem" description="Configurações da imagem">
        <PropertyField label="URL da Imagem" error={errors.src} required>
          <ImageUploader
            value={values.src || ''}
            onChange={(url) => updateProperty('src', url)}
          />
        </PropertyField>

        <PropertyField label="Texto Alternativo" error={errors.alt}>
          <Input
            value={values.alt || ''}
            onChange={(e) => updateProperty('alt', e.target.value)}
            placeholder="Descrição da imagem"
          />
        </PropertyField>

        <PropertyField label="Largura" error={errors.width}>
          <div className="space-y-2">
            <Slider
              value={[values.width || 300]}
              onValueChange={([value]) => updateProperty('width', value)}
              min={100}
              max={800}
              step={10}
            />
            <div className="text-xs text-gray-500 text-center">
              {values.width || 300}px
            </div>
          </div>
        </PropertyField>

        <PropertyField label="Altura" error={errors.height}>
          <div className="space-y-2">
            <Slider
              value={[values.height || 200]}
              onValueChange={([value]) => updateProperty('height', value)}
              min={100}
              max={600}
              step={10}
            />
            <div className="text-xs text-gray-500 text-center">
              {values.height || 200}px
            </div>
          </div>
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Layout" description="Posicionamento da imagem">
        <PropertyField label="Alinhamento" error={errors.align}>
          <Select
            value={values.align || 'center'}
            onValueChange={(value) => updateProperty('align', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Esquerda</SelectItem>
              <SelectItem value="center">Centro</SelectItem>
              <SelectItem value="right">Direita</SelectItem>
            </SelectContent>
          </Select>
        </PropertyField>

        <PropertyField label="Borda Arredondada" error={errors.rounded}>
          <Select
            value={values.rounded || 'none'}
            onValueChange={(value) => updateProperty('rounded', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sem borda</SelectItem>
              <SelectItem value="small">Pequena</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
              <SelectItem value="full">Circular</SelectItem>
            </SelectContent>
          </Select>
        </PropertyField>

        <PropertyField label="Sombra">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={values.shadow || false}
              onCheckedChange={(checked) => updateProperty('shadow', checked)}
            />
            <span className="text-sm">Adicionar sombra</span>
          </div>
        </PropertyField>
      </PropertyGroup>
    </>
  );
}

/**
 * Propriedades para button-inline
 */
function renderButtonInlineProperties(
  values: any,
  updateProperty: (key: string, value: any) => void,
  errors: Record<string, string>
) {
  return (
    <>
      <PropertyGroup title="Botão" description="Texto e ação do botão">
        <PropertyField label="Texto do Botão" error={errors.text} required>
          <Input
            value={values.text || ''}
            onChange={(e) => updateProperty('text', e.target.value)}
            placeholder="Clique aqui"
          />
        </PropertyField>

        <PropertyField label="Tipo de Ação" error={errors.actionType}>
          <Select
            value={values.actionType || 'next'}
            onValueChange={(value) => updateProperty('actionType', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="next">Próxima etapa</SelectItem>
              <SelectItem value="submit">Enviar formulário</SelectItem>
              <SelectItem value="finish">Finalizar quiz</SelectItem>
              <SelectItem value="custom">Ação personalizada</SelectItem>
            </SelectContent>
          </Select>
        </PropertyField>

        <PropertyField label="Desabilitado">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={values.disabled || false}
              onCheckedChange={(checked) => updateProperty('disabled', checked)}
            />
            <span className="text-sm">Botão desabilitado</span>
          </div>
        </PropertyField>
      </PropertyGroup>

      <PropertyGroup title="Estilo" description="Aparência do botão">
        <PropertyField label="Variante" error={errors.variant}>
          <Select
            value={values.variant || 'primary'}
            onValueChange={(value) => updateProperty('variant', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Primário</SelectItem>
              <SelectItem value="secondary">Secundário</SelectItem>
              <SelectItem value="outline">Contorno</SelectItem>
              <SelectItem value="ghost">Fantasma</SelectItem>
            </SelectContent>
          </Select>
        </PropertyField>

        <PropertyField label="Tamanho" error={errors.size}>
          <Select
            value={values.size || 'medium'}
            onValueChange={(value) => updateProperty('size', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Pequeno</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
            </SelectContent>
          </Select>
        </PropertyField>

        <PropertyField label="Largura Total">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={values.fullWidth || false}
              onCheckedChange={(checked) => updateProperty('fullWidth', checked)}
            />
            <span className="text-sm">Ocupar largura total</span>
          </div>
        </PropertyField>
      </PropertyGroup>
    </>
  );
}
