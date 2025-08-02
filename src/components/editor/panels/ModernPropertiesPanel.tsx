import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Type, Layout, Palette, Settings, Image, ArrowRight, Plus, Trash2, 
  Star, Eye, EyeOff, Copy, RotateCcw, Save, Sparkles, Zap, Layers,
  MousePointer, Monitor, Smartphone, Tablet, AlignLeft, AlignCenter, 
  AlignRight, Bold, Italic, Underline, Link, Upload, Download,
  ChevronDown, ChevronRight, Info, CheckCircle, AlertCircle
} from 'lucide-react';
import { blockDefinitions, type PropertySchema } from '../../../config/blockDefinitionsClean';
import { type BlockData } from "../../../types/blocks";
import { cn } from "@/lib/utils";

interface ModernPropertiesPanelProps {
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

// Categorias de estilo para quiz
const STYLE_CATEGORIES = [
  { id: 'Natural', name: 'Natural', color: '#8B7355', gradient: 'from-amber-100 to-stone-100' },
  { id: 'Clássico', name: 'Clássico', color: '#4A4A4A', gradient: 'from-slate-100 to-gray-100' },
  { id: 'Contemporâneo', name: 'Contemporâneo', color: '#2563EB', gradient: 'from-blue-100 to-indigo-100' },
  { id: 'Elegante', name: 'Elegante', color: '#7C3AED', gradient: 'from-purple-100 to-violet-100' },
  { id: 'Romântico', name: 'Romântico', color: '#EC4899', gradient: 'from-pink-100 to-rose-100' },
  { id: 'Sexy', name: 'Sexy', color: '#EF4444', gradient: 'from-red-100 to-pink-100' },
  { id: 'Dramático', name: 'Dramático', color: '#1F2937', gradient: 'from-gray-100 to-slate-100' },
  { id: 'Criativo', name: 'Criativo', color: '#F59E0B', gradient: 'from-yellow-100 to-orange-100' },
];

// Função auxiliar para obter definição do bloco
const getBlockDefinition = (type: string) => 
  blockDefinitions.find(block => block.type === type);

// Componente para input de propriedade individual
const PropertyField: React.FC<{
  schema: PropertySchema;
  value: any;
  onChange: (value: any) => void;
  className?: string;
}> = ({ schema, value, onChange, className }) => {
  const [expanded, setExpanded] = useState(false);

  const renderInput = () => {
    switch (schema.type) {
      case 'text-input':
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder}
            className="h-9"
          />
        );

      case 'text-area':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder}
            rows={schema.rows || 3}
            className="min-h-[80px]"
          />
        );

      case 'number-input':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            min={schema.min}
            max={schema.max}
            step={schema.step}
            className="h-9"
          />
        );

      case 'range-slider':
        return (
          <div className="space-y-2">
            <Slider
              value={[value || schema.defaultValue || 0]}
              onValueChange={([val]) => onChange(val)}
              min={schema.min || 0}
              max={schema.max || 100}
              step={schema.step || 1}
              className="w-full"
            />
            <div className="text-xs text-center text-gray-500">
              {value || schema.defaultValue || 0}{schema.unit || ''}
            </div>
          </div>
        );

      case 'boolean-switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value || false}
              onCheckedChange={onChange}
            />
            <span className="text-sm text-gray-600">
              {value ? 'Ativado' : 'Desativado'}
            </span>
          </div>
        );

      case 'color-picker':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="w-10 h-9 rounded border border-gray-300 cursor-pointer"
            />
            <Input
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 h-9 font-mono"
            />
          </div>
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {schema.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'file-upload':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Escolher arquivo
              </Button>
            </div>
            {value && (
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
                {value}
              </div>
            )}
          </div>
        );

      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder}
            className="h-9"
          />
        );
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">
          {schema.label}
          {schema.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {schema.description && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => setExpanded(!expanded)}
          >
            <Info className="w-3 h-3 text-gray-400" />
          </Button>
        )}
      </div>
      {expanded && schema.description && (
        <p className="text-xs text-gray-500 bg-blue-50 p-2 rounded border">
          {schema.description}
        </p>
      )}
      {renderInput()}
    </div>
  );
};

// Componente principal
export const ModernPropertiesPanel: React.FC<ModernPropertiesPanelProps> = ({
  selectedBlock,
  funnelConfig,
  onBlockPropertyChange,
  onNestedPropertyChange,
  onFunnelConfigChange,
  onDeleteBlock
}) => {
  const [activeTab, setActiveTab] = useState('content');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Resetar tab quando mudar de bloco
  useEffect(() => {
    setActiveTab('content');
    setShowAdvanced(false);
  }, [selectedBlock?.id]);

  // Se nenhum bloco selecionado, mostrar configurações do funil
  if (!selectedBlock) {
    return (
      <div className="h-full bg-gradient-to-br from-gray-50 to-white border-l border-gray-200">
        <div className="p-6 border-b bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Configurações</h3>
              <p className="text-sm text-gray-500">Funil de conversão</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-120px)]">
          <div className="p-6 space-y-6">
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span>Informações Gerais</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <PropertyField
                  schema={{
                    key: 'name',
                    label: 'Nome do Funil',
                    type: 'text-input',
                    placeholder: 'Ex: Quiz Descoberta de Estilo',
                    required: true
                  }}
                  value={funnelConfig.name}
                  onChange={(value) => onFunnelConfigChange({ ...funnelConfig, name: value })}
                />
                
                <PropertyField
                  schema={{
                    key: 'description',
                    label: 'Descrição',
                    type: 'text-area',
                    placeholder: 'Descreva o objetivo deste funil...',
                    rows: 3
                  }}
                  value={funnelConfig.description}
                  onChange={(value) => onFunnelConfigChange({ ...funnelConfig, description: value })}
                />
                
                <PropertyField
                  schema={{
                    key: 'isPublished',
                    label: 'Status de Publicação',
                    type: 'boolean-switch'
                  }}
                  value={funnelConfig.isPublished}
                  onChange={(value) => onFunnelConfigChange({ ...funnelConfig, isPublished: value })}
                />
                
                <PropertyField
                  schema={{
                    key: 'theme',
                    label: 'Tema Visual',
                    type: 'select',
                    options: [
                      { value: 'default', label: '🎨 Padrão' },
                      { value: 'light', label: '☀️ Claro' },
                      { value: 'dark', label: '🌙 Escuro' },
                      { value: 'elegant', label: '✨ Elegante' },
                      { value: 'modern', label: '🚀 Moderno' },
                      { value: 'minimalist', label: '🎯 Minimalista' }
                    ]
                  }}
                  value={funnelConfig.theme || 'default'}
                  onChange={(value) => onFunnelConfigChange({ ...funnelConfig, theme: value })}
                />
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Obter definição do bloco
  const blockDefinition = getBlockDefinition(selectedBlock.type);

  // Verificar se é bloco de questão de quiz
  const isQuizQuestionBlock = 
    selectedBlock.type === 'quiz-question-inline' || 
    selectedBlock.type === 'quiz-question-configurable' ||
    selectedBlock.type.toLowerCase().includes('question');

  // Handlers para questões de quiz
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

  const handleRemoveOption = (index: number) => {
    const options = selectedBlock.properties?.options || [];
    const newOptions = options.filter((_: any, i: number) => i !== index);
    onBlockPropertyChange('options', newOptions);
  };

  const handleUpdateOption = (index: number, field: string, value: any) => {
    const options = selectedBlock.properties?.options || [];
    const newOptions = options.map((option: any, i: number) => 
      i === index ? { ...option, [field]: value } : option
    );
    onBlockPropertyChange('options', newOptions);
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-white border-l border-gray-200">
      {/* Header */}
      <div className="p-6 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {blockDefinition?.name || selectedBlock.type}
            </h3>
            <p className="text-sm text-gray-500">
              {blockDefinition?.description || 'Configurar propriedades'}
            </p>
          </div>
          {onDeleteBlock && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDeleteBlock(selectedBlock.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white/60 backdrop-blur-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 m-4 mb-0 bg-gray-100/80">
            <TabsTrigger value="content" className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Type className="w-3 h-3 mr-1" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Palette className="w-3 h-3 mr-1" />
              Estilo
            </TabsTrigger>
            <TabsTrigger value="layout" className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Layout className="w-3 h-3 mr-1" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Zap className="w-3 h-3 mr-1" />
              Avançado
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <ScrollArea className="h-[calc(100%-160px)]">
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Aba de Conteúdo */}
            <TabsContent value="content" className="space-y-6 mt-0">
              {isQuizQuestionBlock ? (
                <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <MousePointer className="w-4 h-4 text-blue-500" />
                      <span>Questão do Quiz</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <PropertyField
                      schema={{
                        key: 'question',
                        label: 'Pergunta Principal',
                        type: 'text-area',
                        placeholder: 'Digite a pergunta que será exibida',
                        required: true,
                        rows: 2
                      }}
                      value={selectedBlock.properties?.question}
                      onChange={(value) => onBlockPropertyChange('question', value)}
                    />
                    
                    <PropertyField
                      schema={{
                        key: 'subtitle',
                        label: 'Subtítulo (opcional)',
                        type: 'text-input',
                        placeholder: 'Texto adicional para esclarecer a pergunta'
                      }}
                      value={selectedBlock.properties?.subtitle}
                      onChange={(value) => onBlockPropertyChange('subtitle', value)}
                    />

                    {/* Opções de resposta */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">
                          Opções de Resposta
                        </Label>
                        <Button size="sm" onClick={handleAddOption} className="h-8">
                          <Plus className="w-3 h-3 mr-1" />
                          Adicionar
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {(selectedBlock.properties?.options || []).map((option: any, index: number) => (
                          <Card key={option.id || index} className="border border-gray-200">
                            <CardContent className="p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">
                                  Opção {index + 1}
                                </Badge>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleRemoveOption(index)}
                                  className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                              
                              <PropertyField
                                schema={{
                                  key: 'text',
                                  label: 'Texto da Opção',
                                  type: 'text-area',
                                  placeholder: 'Digite o texto que aparecerá no botão',
                                  rows: 2
                                }}
                                value={option.text}
                                onChange={(value) => handleUpdateOption(index, 'text', value)}
                              />

                              <div className="grid grid-cols-2 gap-3">
                                <PropertyField
                                  schema={{
                                    key: 'styleCategory',
                                    label: 'Categoria',
                                    type: 'select',
                                    options: STYLE_CATEGORIES.map(cat => ({
                                      value: cat.id,
                                      label: cat.name
                                    }))
                                  }}
                                  value={option.styleCategory}
                                  onChange={(value) => handleUpdateOption(index, 'styleCategory', value)}
                                />
                                
                                <PropertyField
                                  schema={{
                                    key: 'points',
                                    label: 'Pontos',
                                    type: 'number-input',
                                    min: 0,
                                    max: 10,
                                    step: 1
                                  }}
                                  value={option.points}
                                  onChange={(value) => handleUpdateOption(index, 'points', value)}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // Propriedades de conteúdo para outros tipos de bloco
                blockDefinition?.properties?.filter(prop => prop.category === 'content' || !prop.category).map((schema) => (
                  <Card key={schema.key} className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <PropertyField
                        schema={schema}
                        value={selectedBlock.properties?.[schema.key]}
                        onChange={(value) => onBlockPropertyChange(schema.key, value)}
                      />
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Aba de Estilo */}
            <TabsContent value="style" className="space-y-6 mt-0">
              <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-purple-500" />
                    <span>Aparência</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {blockDefinition?.properties?.filter(prop => prop.category === 'style').map((schema) => (
                    <PropertyField
                      key={schema.key}
                      schema={schema}
                      value={selectedBlock.properties?.[schema.key]}
                      onChange={(value) => onBlockPropertyChange(schema.key, value)}
                    />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba de Layout */}
            <TabsContent value="layout" className="space-y-6 mt-0">
              <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base flex items-center space-x-2">
                    <Layout className="w-4 h-4 text-green-500" />
                    <span>Posicionamento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {blockDefinition?.properties?.filter(prop => prop.category === 'layout').map((schema) => (
                    <PropertyField
                      key={schema.key}
                      schema={schema}
                      value={selectedBlock.properties?.[schema.key]}
                      onChange={(value) => onBlockPropertyChange(schema.key, value)}
                    />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Avançado */}
            <TabsContent value="advanced" className="space-y-6 mt-0">
              <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span>Configurações Avançadas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {blockDefinition?.properties?.filter(prop => prop.category === 'advanced').map((schema) => (
                    <PropertyField
                      key={schema.key}
                      schema={schema}
                      value={selectedBlock.properties?.[schema.key]}
                      onChange={(value) => onBlockPropertyChange(schema.key, value)}
                    />
                  ))}
                  
                  {/* Seção de debug */}
                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="w-full"
                    >
                      {showAdvanced ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                      Informações de Debug
                    </Button>
                    
                    {showAdvanced && (
                      <div className="mt-3 p-3 bg-gray-50 rounded text-xs font-mono">
                        <div><strong>ID:</strong> {selectedBlock.id}</div>
                        <div><strong>Tipo:</strong> {selectedBlock.type}</div>
                        <div><strong>Propriedades:</strong></div>
                        <pre className="mt-1 text-xs overflow-auto">
                          {JSON.stringify(selectedBlock.properties, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ModernPropertiesPanel;
