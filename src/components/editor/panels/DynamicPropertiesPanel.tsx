import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PropertyInput } from './block-properties/PropertyInput';
import { QuestionPropertiesPanel } from '../properties/QuestionPropertiesPanel';
import { allBlockDefinitions, type PropertySchema as OriginalPropertySchema } from '@/config/blockDefinitions';
import { type BlockData } from '@/components/editor/blocks';

// Função auxiliar local
const getBlockDefinition = (type: string) => 
  allBlockDefinitions.find(block => block.type === type);

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
}

export const DynamicPropertiesPanel: React.FC<DynamicPropertiesPanelProps> = ({
  selectedBlock,
  funnelConfig,
  onBlockPropertyChange,
  onNestedPropertyChange,
  onFunnelConfigChange
}) => {
  
  // Função para obter valor de propriedade aninhada (ex: colors.primary)
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Handler para mudanças de propriedades
  const handlePropertyChange = (schema: OriginalPropertySchema, value: any) => {
    if (schema.nestedPath) {
      onNestedPropertyChange(schema.nestedPath, value);
    } else {
      onBlockPropertyChange(schema.key, value);
    }
  };

  // Handler para arrays
  const handleArrayAdd = (schema: OriginalPropertySchema) => {
    const currentValue = selectedBlock?.properties?.[schema.key] || [];
    const newItem = schema.itemSchema?.reduce((item, itemProp) => {
      item[itemProp.key] = itemProp.defaultValue || '';
      return item;
    }, {} as any) || {};
    
    onBlockPropertyChange(schema.key, [...currentValue, newItem]);
  };

  const handleArrayRemove = (schema: OriginalPropertySchema, index: number) => {
    const currentValue = selectedBlock?.properties?.[schema.key] || [];
    const newValue = currentValue.filter((_: any, i: number) => i !== index);
    onBlockPropertyChange(schema.key, newValue);
  };

  const handleArrayUpdate = (schema: OriginalPropertySchema, index: number, field: string, value: any) => {
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
        <div className="p-4 space-y-6 bg-[#2D3748] text-white">
          <Card className="bg-[#1A202C] border-[#4A5568]">
            <CardHeader>
              <CardTitle className="text-sm text-[#F7FAFC]">Configurações do Funil</CardTitle>
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
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    );
  }

  // Verificar se é um bloco de questão de quiz (incluindo quiz-question-configurable)
  const isQuizQuestionBlock = selectedBlock.type === 'quiz-question' || 
                              selectedBlock.type === 'quiz-question-configurable' ||
                              selectedBlock.type === 'QuizQuestionBlock' ||
                              selectedBlock.type === 'QuizQuestionBlockConfigurable';

  // Se for um bloco de questão de quiz, usar o painel especializado
  if (isQuizQuestionBlock) {
    return (
      <QuestionPropertiesPanel
        selectedBlock={selectedBlock}
        onBlockPropertyChange={onBlockPropertyChange}
        onNestedPropertyChange={onNestedPropertyChange}
      />
    );
  }

  // Encontrar a definição do bloco selecionado
  const blockDefinition = getBlockDefinition(selectedBlock.type);
  
  if (!blockDefinition) {
    return (
      <ScrollArea className="h-full">
        <div className="p-4 bg-[#2D3748] text-white">
          <Card className="bg-[#1A202C] border-[#4A5568]">
            <CardContent className="pt-6">
              <p className="text-sm text-[#E2E8F0]">
                Tipo de bloco não reconhecido: {selectedBlock.type}
              </p>
              <p className="text-xs text-[#A0AEC0] mt-2">
                Para questões de quiz, use o tipo "quiz-question-configurable"
              </p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2 sm:p-4 space-y-3 sm:space-y-6 bg-[#2D3748] text-white">
        {/* Cabeçalho do bloco */}
        <Card className="bg-[#1A202C] border-[#4A5568]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-[#F7FAFC]">
                {blockDefinition.name}
              </CardTitle>
              {blockDefinition.isNew && (
                <Badge variant="secondary" className="text-xs bg-[#4A5568] text-[#E2E8F0]">
                  Novo!
                </Badge>
              )}
            </div>
            <p className="text-xs text-[#A0AEC0]">
              {blockDefinition.description}
            </p>
          </CardHeader>
        </Card>

        {/* Propriedades do bloco */}
        {blockDefinition.propertiesSchema && (
          <Card className="bg-[#1A202C] border-[#4A5568]">
            <CardHeader>
              <CardTitle className="text-sm text-[#F7FAFC]">Propriedades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {blockDefinition.propertiesSchema.map((schema) => {
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
      </div>
    </ScrollArea>
  );
};
