import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PropertyInput } from './block-properties/PropertyInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageIcon, Type, Layout, Palette, ArrowRight, Zap, Plus, Trash2, Star, Tag, Settings, Upload, Eye, EyeOff } from 'lucide-react';
import { blockDefinitions, type PropertySchema } from '../../../config/blockDefinitions';
import { type BlockData } from "../../../types/blocks";

// Função auxiliar local
const getBlockDefinition = (type: string) => 
  blockDefinitions.find(block => block.type === type);

// Categorias de estilo disponíveis para perguntas de quiz
const STYLE_CATEGORIES = [
  { id: 'Natural', name: 'Natural', color: '#8B7355' },
  { id: 'Clássico', name: 'Clássico', color: '#4A4A4A' },
  { id: 'Contemporâneo', name: 'Contemporâneo', color: '#2563EB' },
  { id: 'Elegante', name: 'Elegante', color: '#7C3AED' },
  { id: 'Romântico', name: 'Romântico', color: '#EC4899' },
  { id: 'Sexy', name: 'Sexy', color: '#EF4444' },
  { id: 'Dramático', name: 'Dramático', color: '#1F2937' },
  { id: 'Criativo', name: 'Criativo', color: '#F59E0B' },
];

interface DynamicPropertiesPanelProps {
  selectedBlock: BlockData | null;
  funnelConfig: {
    name?: string;
    description?: string;
    isPublished?: boolean;
    theme?: string;
  };
  onBlockPropertyChange: (key: string, value: any) => void;
  onNestedPropertyChange: (path: string, value: any) => void;
  onFunnelConfigChange: (config: any) => void;
  onDeleteBlock?: (id: string) => void;
}

export const DynamicPropertiesPanel: React.FC<DynamicPropertiesPanelProps> = ({
  selectedBlock,
  funnelConfig,
  onBlockPropertyChange,
  onNestedPropertyChange,
  onFunnelConfigChange,
  onDeleteBlock
}) => {
  const [activeTab, setActiveTab] = useState('content');
  
  // Resetar tab quando mudar de bloco
  useEffect(() => {
    setActiveTab('content');
  }, [selectedBlock?.id]);
  
  // Função para obter valor de propriedade aninhada (ex: colors.primary)
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Handler para mudanças de propriedades
  const handlePropertyChange = (schema: PropertySchema, value: any) => {
    if (schema.nestedPath) {
      onNestedPropertyChange(schema.nestedPath, value);
    } else {
      onBlockPropertyChange(schema.key, value);
    }
  };

  // Handler para arrays
  const handleArrayAdd = (schema: PropertySchema) => {
    const currentValue = selectedBlock?.properties?.[schema.key] || [];
    const newItem = schema.itemSchema?.reduce((item, itemProp) => {
      item[itemProp.key] = itemProp.defaultValue || '';
      return item;
    }, {} as any) || {};
    
    onBlockPropertyChange(schema.key, [...currentValue, newItem]);
  };

  const handleArrayRemove = (schema: PropertySchema, index: number) => {
    const currentValue = selectedBlock?.properties?.[schema.key] || [];
    const newValue = currentValue.filter((_: any, i: number) => i !== index);
    onBlockPropertyChange(schema.key, newValue);
  };

  const handleArrayUpdate = (schema: PropertySchema, index: number, field: string, value: any) => {
    const currentValue = selectedBlock?.properties?.[schema.key] || [];
    const newValue = currentValue.map((item: any, i: number) => 
      i === index ? { ...item, [field]: value } : item
    );
    onBlockPropertyChange(schema.key, newValue);
  };

  // Se nenhum bloco selecionado, mostrar configurações do funil
  if (!selectedBlock) {
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Configurações do Funil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PropertyInput
                schema={{
                  key: 'name',
                  label: 'Nome do Funil',
                  type: 'text-input',
                  placeholder: 'Quiz CaktoQuiz'
                }}
                currentValue={funnelConfig.name}
                onValueChange={(value) => onFunnelConfigChange({ ...funnelConfig, name: value })}
              />
              
              <PropertyInput
                schema={{
                  key: 'description',
                  label: 'Descrição',
                  type: 'text-area',
                  placeholder: 'Descrição do funil...',
                  rows: 3
                }}
                currentValue={funnelConfig.description}
                onValueChange={(value) => onFunnelConfigChange({ ...funnelConfig, description: value })}
              />
              
              <PropertyInput
                schema={{
                  key: 'isPublished',
                  label: 'Publicado',
                  type: 'boolean-switch'
                }}
                currentValue={funnelConfig.isPublished}
                onValueChange={(value) => onFunnelConfigChange({ ...funnelConfig, isPublished: value })}
              />
              
              <PropertyInput
                schema={{
                  key: 'theme',
                  label: 'Tema',
                  type: 'select',
                  options: [
                    { value: 'default', label: 'Padrão' },
                    { value: 'light', label: 'Claro' },
                    { value: 'dark', label: 'Escuro' },
                    { value: 'elegant', label: 'Elegante' },
                    { value: 'modern', label: 'Moderno' },
                    { value: 'minimalist', label: 'Minimalista' }
                  ]
                }}
                currentValue={funnelConfig.theme || 'default'}
                onValueChange={(value) => onFunnelConfigChange({ ...funnelConfig, theme: value })}
              />
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    );
  }

  // Encontrar a definição do bloco selecionado
  const blockDefinition = getBlockDefinition(selectedBlock.type);
  
  // Verificar se é um bloco de questão de quiz
  const isQuizQuestionBlock = 
    selectedBlock.type === 'quiz-question' || 
    selectedBlock.type === 'quiz-question-configurable' ||
    selectedBlock.type === 'QuizQuestionBlock' ||
    selectedBlock.type === 'QuizQuestionBlockConfigurable' ||
    selectedBlock.type.toLowerCase().includes('question');
  
  // Handler para adicionar opção em blocos de questão
  const handleAddOption = () => {
    const options = selectedBlock.properties?.options || [];
    const newOption = {
      id: `option-${Date.now()}`,
      text: 'Nova opção',
      imageUrl: '',
      styleCategory: 'Natural',
      points: 1,
      keywords: []
    };
    
    onBlockPropertyChange('options', [...options, newOption]);
  };
  
  // Handler para remover opção
  const handleRemoveOption = (index: number) => {
    const options = selectedBlock.properties?.options || [];
    const newOptions = options.filter((_: any, i: number) => i !== index);
    onBlockPropertyChange('options', newOptions);
  };
  
  // Handler para atualizar opção
  const handleUpdateOption = (index: number, field: string, value: any) => {
    const options = selectedBlock.properties?.options || [];
    const newOptions = options.map((option: any, i: number) => 
      i === index ? { ...option, [field]: value } : option
    );
    onBlockPropertyChange('options', newOptions);
  };

  // Se o bloco não for reconhecido, mostrar mensagem
  if (!blockDefinition && !isQuizQuestionBlock) {
    return (
      <ScrollArea className="h-full">
        <div className="p-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500">
                Tipo de bloco não reconhecido: {selectedBlock.type}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Para questões de quiz, use o tipo "quiz-question-configurable"
              </p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    );
  }

  // Renderizar painel unificado com abas
  return (
    <ScrollArea className="h-full">
      <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
        {/* Cabeçalho do bloco */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">
                {blockDefinition?.name || selectedBlock.type}
              </CardTitle>
              {/* Removido badge para isNew */}
            </div>
            <p className="text-xs text-gray-500">
              {blockDefinition?.description || `Bloco do tipo ${selectedBlock.type}`}
            </p>
          </CardHeader>
        </Card>

        {/* Painel com abas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="content" className="text-xs flex items-center gap-1">
              <Type className="w-3 h-3" />
              <span>Conteúdo</span>
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs flex items-center gap-1">
              <Palette className="w-3 h-3" />
              <span>Estilo</span>
            </TabsTrigger>
            <TabsTrigger value="layout" className="text-xs flex items-center gap-1">
              <Layout className="w-3 h-3" />
              <span>Layout</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>Avançado</span>
            </TabsTrigger>
          </TabsList>

          {/* Aba de Conteúdo */}
          <TabsContent value="content" className="space-y-4">
            {/* Para blocos de questão de quiz */}
            {isQuizQuestionBlock && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Configuração da Questão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="question">Pergunta</Label>
                    <Textarea
                      id="question"
                      value={selectedBlock.properties?.question || ''}
                      onChange={(e) => onBlockPropertyChange('question', e.target.value)}
                      placeholder="Digite a pergunta"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtítulo</Label>
                    <Input
                      id="subtitle"
                      value={selectedBlock.properties?.subtitle || ''}
                      onChange={(e) => onBlockPropertyChange('subtitle', e.target.value)}
                      placeholder="Digite o subtítulo (opcional)"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Opções</Label>
                    <div className="space-y-3 pb-2">
                      {(selectedBlock.properties?.options || []).map((option: any, index: number) => (
                        <Card key={option.id || index} className="p-3">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label>Opção {index + 1}</Label>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleRemoveOption(index)}
                                className="h-7 w-7 p-0 text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <Textarea
                              value={option.text || ''}
                              onChange={(e) => handleUpdateOption(index, 'text', e.target.value)}
                              placeholder="Texto da opção"
                              rows={2}
                            />
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">Categoria</Label>
                                <Select
                                  value={option.styleCategory || 'Natural'}
                                  onValueChange={(value) => handleUpdateOption(index, 'styleCategory', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Categoria" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {STYLE_CATEGORIES.map((category) => (
                                      <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label className="text-xs">Pontos</Label>
                                <Input
                                  type="number"
                                  min={0}
                                  max={10}
                                  value={option.points || 1}
                                  onChange={(e) => handleUpdateOption(index, 'points', parseInt(e.target.value))}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-xs">URL da Imagem</Label>
                              <Input
                                value={option.imageUrl || ''}
                                onChange={(e) => handleUpdateOption(index, 'imageUrl', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddOption} 
                      className="w-full mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Opção
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Renderizar campos de conteúdo de definição de bloco */}
            {blockDefinition?.propertiesSchema && (
              <Card>
                <CardContent className="pt-4 space-y-4">
                  {blockDefinition.propertiesSchema
                    .filter(schema => schema.group === 'content' || !schema.group)
                    .map((schema) => {
                      const currentValue = schema.nestedPath 
                        ? getNestedValue(selectedBlock.properties, schema.nestedPath)
                        : selectedBlock.properties?.[schema.key];

                      return (
                        <PropertyInput
                          key={schema.key}
                          schema={schema as any}
                          currentValue={currentValue}
                          onValueChange={(value) => handlePropertyChange(schema, value)}
                          onAddItem={() => handleArrayAdd(schema)}
                          onRemoveItem={(index) => handleArrayRemove(schema, index)}
                          onUpdateItem={(index, field, value) => handleArrayUpdate(schema, index, field, value)}
                        />
                      );
                    })}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Aba de Estilo */}
          <TabsContent value="style" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Estilo Visual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={selectedBlock.properties?.backgroundColor || '#ffffff'}
                      onChange={(e) => onBlockPropertyChange('backgroundColor', e.target.value)}
                      className="w-12 h-10"
                    />
                    <Input
                      value={selectedBlock.properties?.backgroundColor || '#ffffff'}
                      onChange={(e) => onBlockPropertyChange('backgroundColor', e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="textColor">Cor do Texto</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={selectedBlock.properties?.textColor || '#000000'}
                      onChange={(e) => onBlockPropertyChange('textColor', e.target.value)}
                      className="w-12 h-10"
                    />
                    <Input
                      value={selectedBlock.properties?.textColor || '#000000'}
                      onChange={(e) => onBlockPropertyChange('textColor', e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="borderRadius">Arredondamento de Bordas</Label>
                  <Input
                    id="borderRadius"
                    value={selectedBlock.properties?.borderRadius || '4px'}
                    onChange={(e) => onBlockPropertyChange('borderRadius', e.target.value)}
                    placeholder="4px"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="textAlign">Alinhamento do Texto</Label>
                  <Select
                    value={selectedBlock.properties?.textAlign || 'left'}
                    onValueChange={(value) => onBlockPropertyChange('textAlign', value)}
                  >
                    <SelectTrigger id="textAlign">
                      <SelectValue placeholder="Alinhamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Esquerda</SelectItem>
                      <SelectItem value="center">Centro</SelectItem>
                      <SelectItem value="right">Direita</SelectItem>
                      <SelectItem value="justify">Justificado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Renderizar campos de estilo de definição de bloco */}
                {blockDefinition?.propertiesSchema
                  .filter(schema => schema.group === 'style')
                  .map((schema) => {
                    const currentValue = schema.nestedPath 
                      ? getNestedValue(selectedBlock.properties, schema.nestedPath)
                      : selectedBlock.properties?.[schema.key];

                    return (
                      <PropertyInput
                        key={schema.key}
                        schema={schema as any}
                        currentValue={currentValue}
                        onValueChange={(value) => handlePropertyChange(schema, value)}
                        onAddItem={() => handleArrayAdd(schema)}
                        onRemoveItem={(index) => handleArrayRemove(schema, index)}
                        onUpdateItem={(index, field, value) => handleArrayUpdate(schema, index, field, value)}
                      />
                    );
                  })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Layout */}
          <TabsContent value="layout" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Posicionamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="padding">Espaçamento Interno (Padding)</Label>
                  <Input
                    id="padding"
                    value={selectedBlock.properties?.padding || '16px'}
                    onChange={(e) => onBlockPropertyChange('padding', e.target.value)}
                    placeholder="16px"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="margin">Margem Externa (Margin)</Label>
                  <Input
                    id="margin"
                    value={selectedBlock.properties?.margin || '0px'}
                    onChange={(e) => onBlockPropertyChange('margin', e.target.value)}
                    placeholder="0px"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="width">Largura</Label>
                  <Input
                    id="width"
                    value={selectedBlock.properties?.width || '100%'}
                    onChange={(e) => onBlockPropertyChange('width', e.target.value)}
                    placeholder="100%"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height">Altura</Label>
                  <Input
                    id="height"
                    value={selectedBlock.properties?.height || 'auto'}
                    onChange={(e) => onBlockPropertyChange('height', e.target.value)}
                    placeholder="auto"
                  />
                </div>
                
                {/* Renderizar campos de layout de definição de bloco */}
                {blockDefinition?.propertiesSchema
                  .filter(schema => schema.group === 'layout')
                  .map((schema) => {
                    const currentValue = schema.nestedPath 
                      ? getNestedValue(selectedBlock.properties, schema.nestedPath)
                      : selectedBlock.properties?.[schema.key];

                    return (
                      <PropertyInput
                        key={schema.key}
                        schema={schema as any}
                        currentValue={currentValue}
                        onValueChange={(value) => handlePropertyChange(schema, value)}
                        onAddItem={() => handleArrayAdd(schema)}
                        onRemoveItem={(index) => handleArrayRemove(schema, index)}
                        onUpdateItem={(index, field, value) => handleArrayUpdate(schema, index, field, value)}
                      />
                    );
                  })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Avançado */}
          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Configurações Avançadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id">ID do Elemento</Label>
                  <Input
                    id="id"
                    value={selectedBlock.id || ''}
                    disabled
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customClass">Classe CSS Personalizada</Label>
                  <Input
                    id="customClass"
                    value={selectedBlock.properties?.customClass || ''}
                    onChange={(e) => onBlockPropertyChange('customClass', e.target.value)}
                    placeholder="classe-personalizada"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hidden"
                    checked={selectedBlock.properties?.hidden || false}
                    onCheckedChange={(checked) => onBlockPropertyChange('hidden', checked)}
                  />
                  <Label htmlFor="hidden">Ocultar Elemento</Label>
                </div>
                
                {/* Renderizar campos avançados de definição de bloco */}
                {blockDefinition?.propertiesSchema
                  .filter(schema => schema.group === 'advanced')
                  .map((schema) => {
                    const currentValue = schema.nestedPath 
                      ? getNestedValue(selectedBlock.properties, schema.nestedPath)
                      : selectedBlock.properties?.[schema.key];

                    return (
                      <PropertyInput
                        key={schema.key}
                        schema={schema as any}
                        currentValue={currentValue}
                        onValueChange={(value) => handlePropertyChange(schema, value)}
                        onAddItem={() => handleArrayAdd(schema)}
                        onRemoveItem={(index) => handleArrayRemove(schema, index)}
                        onUpdateItem={(index, field, value) => handleArrayUpdate(schema, index, field, value)}
                      />
                    );
                  })}
              </CardContent>
            </Card>
            
            {/* Botão para excluir bloco */}
            {onDeleteBlock && (
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => onDeleteBlock(selectedBlock.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Bloco
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};
