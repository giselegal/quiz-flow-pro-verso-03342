/**
 * 🎯 EDITOR AVANÇADO DE PROPRIEDADES DE QUESTÃO
 * 
 * Sistema completo para edição visual de questões de quiz com:
 * - Editor de texto da pergunta com preview
 * - Gerenciamento dinâmico de opções
 * - Configurações avançadas de seleção e validação
 * - Score values por opção
 * - Preview em tempo real
 * - Integração com editores avançados existentes
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Trash2,
  GripVertical,
  Eye,
  Type,
  Target,
  CheckCircle2,
  Palette,
  Layout,
  Zap,
  HelpCircle
} from 'lucide-react';

import { PropertyType, PropertyCategory } from '@/hooks/useUnifiedProperties';

// Importar editores avançados existentes
import BoxModelEditor from '../core/BoxModelEditor';
import AnimationPreviewEditor from '../core/AnimationPreviewEditor';
import ScoreValuesEditor from '../core/ScoreValuesEditor';

// Tooltip library for contextual help
const questionTooltips = {
  title: {
    title: 'Título da Questão',
    content: 'Define o texto principal da questão que será exibido aos usuários.',
    examples: ['Qual é o seu objetivo principal?', 'Como você prefere aprender?']
  },
  options: {
    title: 'Opções de Resposta',
    content: 'Lista de opções disponíveis para o usuário escolher.',
    examples: [{ text: 'Opção A', value: 'a', score: 10 }]
  },
  scoring: {
    title: 'Sistema de Pontuação',
    content: 'Configura como as respostas são pontuadas e avaliadas.',
    examples: ['Pontuação por opção', 'Pontuação global']
  },
  layout: {
    title: 'Layout e Apresentação',
    content: 'Controla a aparência visual e disposição dos elementos.',
    examples: ['Grid', 'Lista', 'Cards']
  },
  animation: {
    title: 'Animações',
    content: 'Efeitos visuais para transições e interações.',
    examples: ['Fade in', 'Slide up', 'Bounce']
  }
};

// Simple tooltip component
const TooltipHelper: React.FC<{ content: string; children: React.ReactNode }> = ({
  content,
  children
}) => (
  <div className="relative group inline-block">
    {children}
    <div className="invisible group-hover:visible absolute z-10 w-64 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg -top-12 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      {content}
      <div className="absolute top-full left-4 w-2 h-2 bg-gray-800 transform rotate-45 -mt-1"></div>
    </div>
  </div>
);// Types
interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
  value?: string;
  scoreValues?: Record<string, number>;
}

interface QuestionProperties {
  // Content
  question?: string;
  title?: string;
  text?: string;
  description?: string;
  questionId?: string;

  // Options
  options?: QuestionOption[];

  // Selection Rules
  multipleSelection?: boolean;
  requiredSelections?: number;
  maxSelections?: number;
  minSelections?: number;

  // Validation
  enableButtonOnlyWhenValid?: boolean;
  showValidationFeedback?: boolean;
  validationMessage?: string;
  progressMessage?: string;
  showSelectionCount?: boolean;

  // Behavior
  autoAdvanceOnComplete?: boolean;
  autoAdvanceDelay?: number;
  showImages?: boolean;

  // Styling
  columns?: number;
  responsiveColumns?: boolean;
  selectionStyle?: 'border' | 'background' | 'shadow';
  selectedColor?: string;
  hoverColor?: string;
  gridGap?: number;

  // Layout
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  padding?: string;
  margin?: string;
  borderRadius?: string;
  boxShadow?: string;

  // Typography
  fontSize?: string;
  fontWeight?: string;
  color?: string;

  // Animation
  animation?: any;

  // Score values globais
  scoreValues?: Record<string, number>;

  [key: string]: any;
}

interface QuestionPropertyEditorProps {
  block: {
    id: string;
    type: string;
    properties: QuestionProperties;
    content?: any;
  };
  onUpdate: (updates: Partial<QuestionProperties>) => void;
  onValidate?: (isValid: boolean) => void;
  isPreviewMode?: boolean;
  onDelete?: () => void;
}

export const QuestionPropertyEditor: React.FC<QuestionPropertyEditorProps> = ({
  block,
  onUpdate,
  onValidate,
  isPreviewMode = false,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState('content');
  const [previewMode, setPreviewMode] = useState(false);

  const properties = block.properties || {};

  // 🔍 DEBUG: Verificar dados recebidos
  console.group('🔍 DEBUG QuestionPropertyEditor');
  console.log('block:', block);
  console.log('block.properties:', block.properties);
  console.log('properties.options:', properties.options);
  console.groupEnd();

  // Estado local para opções com drag & drop (futuro)
  const [localOptions, setLocalOptions] = useState<QuestionOption[]>(
    properties.options || []
  );

  useEffect(() => {
    console.log('🔍 useEffect - Atualizando localOptions com:', properties.options);
    setLocalOptions(properties.options || []);
  }, [properties.options]);

  // Handlers
  const handlePropertyChange = useCallback((key: string, value: any) => {
    onUpdate({ [key]: value });

    // Validação básica
    if (onValidate) {
      const questionText = key === 'question' || key === 'text' || key === 'title'
        ? value
        : properties.question || properties.text || properties.title;
      onValidate(!!questionText);
    }
  }, [onUpdate, onValidate, properties]);

  const handleOptionUpdate = useCallback((index: number, updates: Partial<QuestionOption>) => {
    console.log('🔍 handleOptionUpdate chamado:', { index, updates });
    const newOptions = [...localOptions];
    newOptions[index] = { ...newOptions[index], ...updates };
    setLocalOptions(newOptions);
    console.log('🔍 Atualizando options para:', newOptions);
    handlePropertyChange('options', newOptions);
  }, [localOptions, handlePropertyChange]);

  const handleAddOption = useCallback(() => {
    const newOption: QuestionOption = {
      id: `option-${Date.now()}`,
      text: `Opção ${localOptions.length + 1}`,
      imageUrl: '',
      value: '',
      scoreValues: {}
    };
    const newOptions = [...localOptions, newOption];
    setLocalOptions(newOptions);
    handlePropertyChange('options', newOptions);
  }, [localOptions, handlePropertyChange]);

  const handleRemoveOption = useCallback((index: number) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);
    handlePropertyChange('options', newOptions);
  }, [localOptions, handlePropertyChange]);

  // Preview do componente
  const renderPreview = () => (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          {properties.question || properties.title || properties.text || 'Título da pergunta'}
        </h3>
        {properties.description && (
          <p className="text-gray-600 mb-4">{properties.description}</p>
        )}

        <div className="space-y-3">
          {localOptions.map((option, index) => (
            <div
              key={option.id}
              className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                {option.imageUrl && (
                  <img
                    src={option.imageUrl}
                    alt=""
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <div className="font-medium">{option.text || `Opção ${index + 1}`}</div>
                  {option.value && (
                    <div className="text-sm text-gray-500">Valor: {option.value}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {properties.showSelectionCount && (
          <div className="mt-4 text-sm text-gray-600">
            Seleções: 0 de {properties.maxSelections || localOptions.length}
          </div>
        )}
      </div>
    </div>
  );

  if (isPreviewMode) {
    return (
      <div className="p-4">
        {renderPreview()}
      </div>
    );
  }

  const tabs = [
    {
      id: 'content',
      label: 'Conteúdo',
      icon: Type,
      description: 'Texto e opções da questão'
    },
    {
      id: 'validation',
      label: 'Validação',
      icon: CheckCircle2,
      description: 'Regras de seleção e validação'
    },
    {
      id: 'behavior',
      label: 'Comportamento',
      icon: Zap,
      description: 'Auto-avançar e interações'
    },
    {
      id: 'styling',
      label: 'Visual',
      icon: Palette,
      description: 'Cores, layout e animações'
    },
    {
      id: 'scoring',
      label: 'Pontuação',
      icon: Target,
      description: 'Score values por opção'
    }
  ];

  return (
    <div className="properties-panel h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Editor de Questão</h2>
              <p className="text-sm text-gray-400">
                {block.type} • ID: {block.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={previewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>

            {onDelete && (
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Preview Mode */}
      {previewMode && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-sm">Preview em Tempo Real</span>
            <Badge variant="secondary" className="text-xs">
              {localOptions.length} opções
            </Badge>
          </div>
          {renderPreview()}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center gap-1 py-2 px-1"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Tabs value={activeTab} className="w-full">

          {/* CONTEÚDO */}
          <TabsContent value="content" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-white">
                  <Type className="w-4 h-4" />
                  Pergunta Principal
                  <TooltipHelper content={questionTooltips.title.content}>
                    <HelpCircle className="w-3 h-3 text-gray-400 hover:text-gray-300 cursor-help" />
                  </TooltipHelper>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">{/* Conteúdo continua igual */}
                <div className="space-y-2">
                  <Label htmlFor="question">Texto da Pergunta</Label>
                  <Textarea
                    id="question"
                    placeholder="Ex: Qual seu estilo favorito?"
                    value={properties.question || properties.title || properties.text || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      handlePropertyChange('question', value);
                      handlePropertyChange('title', value);
                      handlePropertyChange('text', value);
                    }}
                    className="resize-none"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (Opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Informações adicionais sobre a pergunta..."
                    value={properties.description || ''}
                    onChange={(e) => handlePropertyChange('description', e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="questionId">ID da Questão</Label>
                  <Input
                    id="questionId"
                    placeholder="Ex: q1, style-question, etc."
                    value={properties.questionId || ''}
                    onChange={(e) => handlePropertyChange('questionId', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Identificador único para tracking e analytics
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Opções Dinâmicas */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layout className="w-4 h-4" />
                    Opções da Questão
                    <Badge variant="secondary">{localOptions.length}</Badge>
                    <TooltipHelper content={questionTooltips.options.content}>
                      <HelpCircle className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                    </TooltipHelper>
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={handleAddOption}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {localOptions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Layout className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>Nenhuma opção adicionada</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddOption}
                      className="mt-2"
                    >
                      Criar primeira opção
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {localOptions.map((option, index) => (
                      <Card key={option.id} className="border-dashed">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-2">
                              <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                            </div>

                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  Opção {index + 1}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 gap-3">
                                <div>
                                  <Label className="text-xs">Texto</Label>
                                  <Input
                                    placeholder="Texto da opção..."
                                    value={option.text}
                                    onChange={(e) => handleOptionUpdate(index, { text: e.target.value })}
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label className="text-xs">Imagem URL</Label>
                                    <Input
                                      placeholder="https://..."
                                      value={option.imageUrl || ''}
                                      onChange={(e) => handleOptionUpdate(index, { imageUrl: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Valor</Label>
                                    <Input
                                      placeholder="valor..."
                                      value={option.value || ''}
                                      onChange={(e) => handleOptionUpdate(index, { value: e.target.value })}
                                    />
                                  </div>
                                </div>

                                {option.imageUrl && (
                                  <div className="flex justify-center">
                                    <img
                                      src={option.imageUrl}
                                      alt="Preview"
                                      className="w-16 h-16 object-cover rounded border"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveOption(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* VALIDAÇÃO */}
          <TabsContent value="validation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Regras de Seleção
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Seleção Múltipla</Label>
                    <p className="text-xs text-gray-500">
                      Permitir mais de uma opção selecionada
                    </p>
                  </div>
                  <Switch
                    checked={properties.multipleSelection || false}
                    onCheckedChange={(checked) => handlePropertyChange('multipleSelection', checked)}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mínimo de Seleções</Label>
                    <Input
                      type="number"
                      min="0"
                      value={properties.minSelections || 1}
                      onChange={(e) => handlePropertyChange('minSelections', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Máximo de Seleções</Label>
                    <Input
                      type="number"
                      min="1"
                      value={properties.maxSelections || localOptions.length}
                      onChange={(e) => handlePropertyChange('maxSelections', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Mensagem de Validação</Label>
                  <Input
                    placeholder="Ex: Selecione ao menos uma opção..."
                    value={properties.validationMessage || ''}
                    onChange={(e) => handlePropertyChange('validationMessage', e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Mostrar Contador</Label>
                    <p className="text-xs text-gray-500">
                      Exibir "X de Y seleções"
                    </p>
                  </div>
                  <Switch
                    checked={properties.showSelectionCount || false}
                    onCheckedChange={(checked) => handlePropertyChange('showSelectionCount', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* COMPORTAMENTO */}
          <TabsContent value="behavior" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Auto-Avançar e Interações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto-Avançar</Label>
                    <p className="text-xs text-gray-500">
                      Avançar automaticamente após seleção
                    </p>
                  </div>
                  <Switch
                    checked={properties.autoAdvanceOnComplete || false}
                    onCheckedChange={(checked) => handlePropertyChange('autoAdvanceOnComplete', checked)}
                  />
                </div>

                {properties.autoAdvanceOnComplete && (
                  <div className="space-y-2">
                    <Label>Delay (milissegundos)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      value={properties.autoAdvanceDelay || 1000}
                      onChange={(e) => handlePropertyChange('autoAdvanceDelay', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-gray-500">
                      Tempo de espera antes de avançar
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Exibir Imagens</Label>
                    <p className="text-xs text-gray-500">
                      Mostrar imagens nas opções
                    </p>
                  </div>
                  <Switch
                    checked={properties.showImages !== false}
                    onCheckedChange={(checked) => handlePropertyChange('showImages', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* VISUAL/STYLING */}
          <TabsContent value="styling" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Layout e Cores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Colunas</Label>
                    <Input
                      type="number"
                      min="1"
                      max="4"
                      value={properties.columns || 1}
                      onChange={(e) => handlePropertyChange('columns', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gap da Grid</Label>
                    <Input
                      type="number"
                      min="0"
                      value={properties.gridGap || 16}
                      onChange={(e) => handlePropertyChange('gridGap', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cor Selecionada</Label>
                    <Input
                      type="color"
                      value={properties.selectedColor || '#3B82F6'}
                      onChange={(e) => handlePropertyChange('selectedColor', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cor Hover</Label>
                    <Input
                      type="color"
                      value={properties.hoverColor || '#60A5FA'}
                      onChange={(e) => handlePropertyChange('hoverColor', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Box Model Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  Espaçamento (Box Model)
                  <TooltipHelper content={questionTooltips.layout.content}>
                    <HelpCircle className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                  </TooltipHelper>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <BoxModelEditor
                    property={{
                      key: 'padding',
                      value: properties.padding,
                      type: PropertyType.OBJECT,
                      label: 'Padding',
                      category: PropertyCategory.LAYOUT
                    }}
                    onChange={handlePropertyChange}
                  />
                  <BoxModelEditor
                    property={{
                      key: 'margin',
                      value: properties.margin,
                      type: PropertyType.OBJECT,
                      label: 'Margin',
                      category: PropertyCategory.LAYOUT
                    }}
                    onChange={handlePropertyChange}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Animation Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  Animações
                  <TooltipHelper content={questionTooltips.animation.content}>
                    <HelpCircle className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                  </TooltipHelper>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimationPreviewEditor
                  property={{
                    key: 'animation',
                    value: properties.animation,
                    type: PropertyType.OBJECT,
                    label: 'Animation',
                    category: PropertyCategory.ANIMATION
                  }}
                  onChange={handlePropertyChange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* PONTUAÇÃO */}
          <TabsContent value="scoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Sistema de Pontuação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreValuesEditor
                  property={{
                    key: 'scoreValues',
                    value: properties.scoreValues,
                    type: PropertyType.OBJECT,
                    label: 'Score Values',
                    category: PropertyCategory.BEHAVIOR
                  }}
                  onChange={handlePropertyChange}
                />
              </CardContent>
            </Card>

            {/* Score por opção individual */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  Pontuação por Opção
                  <TooltipHelper content={questionTooltips.scoring.content}>
                    <HelpCircle className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                  </TooltipHelper>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {localOptions.map((option, index) => (
                    <div key={option.id} className="border rounded-lg p-3">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="outline">Opção {index + 1}</Badge>
                        <span className="text-sm font-medium truncate">
                          {option.text || 'Sem texto'}
                        </span>
                      </div>

                      <ScoreValuesEditor
                        property={{
                          key: `option-${index}-scores`,
                          value: option.scoreValues || {},
                          type: PropertyType.OBJECT,
                          label: `Option ${index + 1} Scores`,
                          category: PropertyCategory.BEHAVIOR
                        }}
                        onChange={(_key, value) => {
                          handleOptionUpdate(index, { scoreValues: value });
                        }}
                      />
                    </div>
                  ))}

                  {localOptions.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <Target className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Adicione opções na aba Conteúdo para configurar pontuações</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer Stats */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>{localOptions.length} opções configuradas</span>
            <span>•</span>
            <span>Seleção: {properties.multipleSelection ? 'Múltipla' : 'Única'}</span>
            {properties.scoreValues && Object.keys(properties.scoreValues).length > 0 && (
              <>
                <span>•</span>
                <span>{Object.keys(properties.scoreValues).length} scores globais</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {properties.autoAdvanceOnComplete && (
              <Badge variant="secondary" className="text-xs">Auto-avançar</Badge>
            )}
            {properties.multipleSelection && (
              <Badge variant="secondary" className="text-xs">Multi-seleção</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPropertyEditor;
