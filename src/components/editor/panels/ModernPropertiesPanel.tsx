
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2, Type, Palette, Layout, Zap } from 'lucide-react';
import { blockDefinitions } from '@/config/blockDefinitionsClean';
import { PropertyField } from './PropertyField';

interface ModernPropertiesPanelProps {
  selectedBlock: any | null;
  funnelConfig?: any;
  onBlockPropertyChange: (key: string, value: any) => void;
  onNestedPropertyChange: (path: string, value: any) => void;
  onFunnelConfigChange: (configUpdates: any) => void;
  onDeleteBlock: (id: string) => void;
}

export const ModernPropertiesPanel: React.FC<ModernPropertiesPanelProps> = ({
  selectedBlock,
  funnelConfig,
  onBlockPropertyChange,
  onNestedPropertyChange,
  onFunnelConfigChange,
  onDeleteBlock,
}) => {
  if (!selectedBlock) {
    return (
      <div className="h-full bg-gradient-to-br from-gray-50 to-white border-l border-gray-200">
        <div className="p-6 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Configurações do Funil</h3>
              <p className="text-sm text-gray-500">Configure as propriedades globais</p>
            </div>
          </div>

          <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
            <div className="p-4 space-y-4">
              <PropertyField
                property={{
                  key: 'name',
                  label: 'Nome do Funil',
                  type: 'text-input',
                  required: true,
                  placeholder: 'Digite o nome do funil'
                }}
                value={funnelConfig?.name || ''}
                onChange={(value) => onFunnelConfigChange({ name: value })}
              />

              <PropertyField
                property={{
                  key: 'description',
                  label: 'Descrição',
                  type: 'text-area',
                  rows: 3,
                  placeholder: 'Descreva o objetivo do funil'
                }}
                value={funnelConfig?.description || ''}
                onChange={(value) => onFunnelConfigChange({ description: value })}
              />

              <PropertyField
                property={{
                  key: 'isPublished',
                  label: 'Publicado',
                  type: 'boolean-switch'
                }}
                value={funnelConfig?.isPublished || false}
                onChange={(value) => onFunnelConfigChange({ isPublished: value })}
              />

              <PropertyField
                property={{
                  key: 'theme',
                  label: 'Tema Visual',
                  type: 'select',
                  options: [
                    { label: 'Padrão', value: 'default' },
                    { label: 'Moderno', value: 'modern' },
                    { label: 'Elegante', value: 'elegant' },
                    { label: 'Minimalista', value: 'minimal' },
                    { label: 'Vibrante', value: 'vibrant' },
                    { label: 'Profissional', value: 'professional' }
                  ]
                }}
                value={funnelConfig?.theme || 'default'}
                onChange={(value) => onFunnelConfigChange({ theme: value })}
              />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const blockDefinition = blockDefinitions.find(def => def.type === selectedBlock.type);

  if (!blockDefinition || !blockDefinition.properties) {
    return (
      <div className="h-full bg-gradient-to-br from-gray-50 to-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <p>Definição de bloco não encontrada para:</p>
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">{selectedBlock.type}</code>
        </div>
      </div>
    );
  }

  const renderPropertyFields = (properties: any[], group: string) => {
    return properties
      .filter(prop => prop.group === group)
      .map((property: any) => (
        <PropertyField
          key={property.key}
          property={property}
          value={selectedBlock.properties?.[property.key] || property.defaultValue}
          onChange={(value) => onBlockPropertyChange(property.key, value)}
        />
      ));
  };

  // Handle special quiz question blocks
  const isQuizQuestionBlock = 
    selectedBlock.type === 'quiz-question-inline' || 
    selectedBlock.type === 'quiz-question-configurable' ||
    selectedBlock.type.toLowerCase().includes('question');

  const styleCategories = [
    { id: 'Natural', color: '#8B7355', gradient: 'from-amber-100 to-stone-100' },
    { id: 'Clássico', color: '#4A4A4A', gradient: 'from-slate-100 to-gray-100' },
    { id: 'Contemporâneo', color: '#2563EB', gradient: 'from-blue-100 to-indigo-100' },
    { id: 'Elegante', color: '#7C3AED', gradient: 'from-purple-100 to-violet-100' },
    { id: 'Romântico', color: '#EC4899', gradient: 'from-pink-100 to-rose-100' },
    { id: 'Sexy', color: '#EF4444', gradient: 'from-red-100 to-pink-100' },
    { id: 'Dramático', color: '#1F2937', gradient: 'from-gray-100 to-slate-100' },
    { id: 'Criativo', color: '#F59E0B', gradient: 'from-yellow-100 to-orange-100' }
  ];

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-white border-l border-gray-200">
      <ScrollArea className="h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Type className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {blockDefinition.name || selectedBlock.type}
                </h3>
                <p className="text-xs text-gray-500">{blockDefinition.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => onDeleteBlock(selectedBlock.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="content" className="p-4">
          <TabsList className="grid grid-cols-4 w-full mb-6 bg-gray-100/50">
            <TabsTrigger value="content" className="flex items-center gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Type className="w-3.5 h-3.5 text-blue-500" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="style" className="flex items-center gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Palette className="w-3.5 h-3.5 text-purple-500" />
              Estilo
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Layout className="w-3.5 h-3.5 text-green-500" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Zap className="w-3.5 h-3.5 text-orange-500" />
              Avançado
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
              <div className="p-4 space-y-4">
                {isQuizQuestionBlock ? (
                  <div className="space-y-4">
                    <PropertyField
                      property={{
                        key: 'question',
                        label: 'Pergunta',
                        type: 'text-area',
                        required: true,
                        rows: 2,
                        placeholder: 'Digite a pergunta...'
                      }}
                      value={selectedBlock.properties?.question || ''}
                      onChange={(value) => onBlockPropertyChange('question', value)}
                    />

                    <PropertyField
                      property={{
                        key: 'subtitle',
                        label: 'Subtítulo',
                        type: 'text-input',
                        placeholder: 'Subtítulo opcional...'
                      }}
                      value={selectedBlock.properties?.subtitle || ''}
                      onChange={(value) => onBlockPropertyChange('subtitle', value)}
                    />

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-gray-700">Opções de Resposta</h4>
                      {(selectedBlock.properties?.options || []).map((option: any, index: number) => (
                        <Card key={index} className="p-3 border border-gray-200">
                          <div className="space-y-3">
                            <PropertyField
                              property={{
                                key: `option_${index}_text`,
                                label: `Opção ${index + 1}`,
                                type: 'text-area',
                                rows: 2
                              }}
                              value={option.text || ''}
                              onChange={(value) => {
                                const newOptions = [...(selectedBlock.properties?.options || [])];
                                newOptions[index] = { ...newOptions[index], text: value };
                                onBlockPropertyChange('options', newOptions);
                              }}
                            />

                            <div className="grid grid-cols-2 gap-3">
                              <PropertyField
                                property={{
                                  key: `option_${index}_category`,
                                  label: 'Categoria de Estilo',
                                  type: 'select',
                                  options: styleCategories.map(cat => ({ 
                                    label: cat.id, 
                                    value: cat.id 
                                  }))
                                }}
                                value={option.styleCategory || 'Natural'}
                                onChange={(value) => {
                                  const newOptions = [...(selectedBlock.properties?.options || [])];
                                  newOptions[index] = { ...newOptions[index], styleCategory: value };
                                  onBlockPropertyChange('options', newOptions);
                                }}
                              />

                              <PropertyField
                                property={{
                                  key: `option_${index}_points`,
                                  label: 'Pontos',
                                  type: 'number-input',
                                  min: 0,
                                  max: 10,
                                  defaultValue: 1
                                }}
                                value={option.points || 1}
                                onChange={(value) => {
                                  const newOptions = [...(selectedBlock.properties?.options || [])];
                                  newOptions[index] = { ...newOptions[index], points: value };
                                  onBlockPropertyChange('options', newOptions);
                                }}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  renderPropertyFields(blockDefinition.properties, 'content')
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
              <div className="p-4 space-y-4">
                {renderPropertyFields(blockDefinition.properties, 'style')}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
              <div className="p-4 space-y-4">
                {renderPropertyFields(blockDefinition.properties, 'layout')}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
              <div className="p-4 space-y-4">
                {renderPropertyFields(blockDefinition.properties, 'advanced')}
                
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-sm text-gray-700 mb-3">Debug</h4>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">
                      <strong>ID:</strong> {selectedBlock.id}
                    </div>
                    <div className="text-xs text-gray-500">
                      <strong>Tipo:</strong> {selectedBlock.type}
                    </div>
                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-700">Propriedades</summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono overflow-x-auto">
                        {JSON.stringify(selectedBlock.properties, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
};
