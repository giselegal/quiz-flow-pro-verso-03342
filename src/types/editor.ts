Nova Estratégia de Implementação
Em vez de criar um novo componente de grupo (LayoutPropertiesGroup), vamos fazer com que as propriedades de layout sejam tratadas como propriedades padrão para todos os tipos de blocos. Isso significa que a lógica de renderização e validação será adaptada para lidar com maxWidth e alignment automaticamente.

Aqui está o novo plano:

Atualizar a Definição do Tipo de Propriedades: Vamos ajustar a definição de tipo dos blocos para que maxWidth e alignment sejam propriedades opcionais em qualquer tipo de componente.

Modificar a Lógica de Propriedades Comuns: A nossa função getCommonProperties será o cérebro da operação. Ela vai garantir que, independentemente do tipo de bloco, as propriedades de maxWidth e alignment sejam sempre consideradas para a edição em lote.

Refatorar a Renderização do Painel: Vamos modificar o renderPropertyInput para que ele saiba como renderizar os componentes de Slider e Select para estas novas propriedades universais.

Atualizar o Schema de Validação: O createValidationSchema será ajustado para sempre incluir a validação para maxWidth e alignment.

Esta abordagem é mais alinhada com o que você pediu: ter um controle de layout que se aplica a cada componente, individualmente ou em lote, sem a necessidade de um grupo separado.

Instruções para Implementação
Passo 1: Atualizar o Arquivo OptimizedPropertiesPanel.tsx
Vamos começar por alterar o seu arquivo principal para garantir que as novas propriedades de layout são tratadas como propriedades padrão do sistema.

TypeScript

// @/components/editor/OptimizedPropertiesPanel.tsx
import React, { useEffect, useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Tabs,
  TabsList,
  TabsContent,
} from '@/components/ui/tabs';
import {
  ScrollArea,
  ScrollBar,
} from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ColorPicker } from '@/components/ui/color-picker';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/use-debounce';
import { Type, Edit3, CheckCircle, XCircle } from 'lucide-react';
import { BlockDefinition, EditableContent } from '@/types/editor';

// Adicionamos as propriedades de layout ao tipo de conteúdo editável
declare module '@/types/editor' {
  interface EditableContent {
    // Estas propriedades serão padrão para todos os blocos
    maxWidth?: number;
    alignment?: 'left' | 'center' | 'right';
    // ... outras propriedades
  }
}

// ... (Resto dos imports e definições de tipo) ...

// Função auxiliar para criar o schema de validação
const createValidationSchema = (properties: Record<string, any>) => {
  const schemaFields: Record<string, any> = {};

  // Adiciona as propriedades de layout como campos universais e opcionais
  schemaFields.maxWidth = z.number().min(10).max(100).optional();
  schemaFields.alignment = z.enum(['left', 'center', 'right']).optional();

  // Mapeia o resto das propriedades do bloco
  Object.entries(properties).forEach(([key, property]) => {
    switch (property.type) {
      case 'text':
        schemaFields[key] = z.string().optional();
        break;
      case 'number':
        let numberSchema = z.number().optional();
        if (property.min !== undefined) numberSchema = numberSchema.min(property.min);
        if (property.max !== undefined) numberSchema = numberSchema.max(property.max);
        schemaFields[key] = numberSchema;
        break;
      case 'boolean':
        schemaFields[key] = z.boolean().optional();
        break;
      case 'color':
        schemaFields[key] = z.string().optional();
        break;
      case 'select':
        const options = property.options || [];
        schemaFields[key] = z.enum(options.map((o: any) => o.value || o)).optional();
        break;
      default:
        schemaFields[key] = z.any().optional();
    }
  });

  return z.object(schemaFields);
};

// ... (Resto do código, como a definição do componente e a interface de props) ...
Passo 2: Otimizar a Lógica de getCommonProperties
Esta função agora precisa de garantir que as propriedades maxWidth e alignment sejam sempre incluídas, a menos que sejam explicitamente excluídas por uma definição de bloco.

TypeScript

// Dentro do componente OptimizedPropertiesPanel
const getCommonProperties = useCallback((): {
  commonProps: Record<string, any>;
  initialValues: Record<string, any>;
  mixedValues: Record<string, boolean>;
} => {
  if (blocks.length === 0) {
    return { commonProps: {}, initialValues: {}, mixedValues: {} };
  }

  // Definições padrão para as propriedades de layout
  const defaultLayoutProps = {
    maxWidth: { type: 'range', label: 'Tamanho Máximo', min: 10, max: 100, category: 'layout' },
    alignment: { type: 'select', label: 'Alinhamento', options: [{ value: 'left', label: 'Esquerda' }, { value: 'center', label: 'Centro' }, { value: 'right', label: 'Direita' }], category: 'layout' },
  };

  // 1. Encontrar as propriedades comuns a todos os blocos
  const firstBlockType = blocks[0].type;
  let commonProps = {
    ...defaultLayoutProps, // Começamos com as propriedades de layout padrão
    ...(blockDefinitions[firstBlockType]?.properties || {}),
  };

  blocks.slice(1).forEach(block => {
    const currentProps = {
      ...defaultLayoutProps, // Adicionamos novamente as propriedades padrão
      ...(blockDefinitions[block.type]?.properties || {}),
    };

    commonProps = Object.fromEntries(
      Object.entries(commonProps).filter(([key]) => currentProps[key])
    );
  });

  // 2. Determinar os valores iniciais e mistos
  const initialValues: Record<string, any> = {};
  const mixedValues: Record<string, boolean> = {};

  Object.keys(commonProps).forEach(key => {
    const firstValue = blocks[0].content[key];
    const isMixed = blocks.some(block => block.content[key] !== firstValue);

    mixedValues[key] = isMixed;
    initialValues[key] = isMixed ? undefined : firstValue;
  });

  return { commonProps, initialValues, mixedValues };
}, [blocks, blockDefinitions]);

const { commonProps, initialValues, mixedValues } = getCommonProperties();
Passo 3: Refatorar a Renderização dos Campos
Agora, o nosso renderPropertyInput precisa de saber como renderizar os novos tipos de input (range e select) para as propriedades universais.

TypeScript

// Dentro do componente OptimizedPropertiesPanel
const renderPropertyInput = useCallback(
  (key: string, property: any) => {
    const error = errors[key]?.message;

    switch (property.type) {
      case 'text':
        // ... (código existente) ...
      case 'number':
        // ... (código existente) ...
      case 'boolean':
        // ... (código existente) ...
      case 'color':
        // ... (código existente) ...

      // Novo case para o tipo `range` (usado pelo maxWidth)
      case 'range':
        return (
          <Controller
            control={control}
            name={key}
            render={({ field }) => (
              <div className="space-y-2">
                <Slider
                  value={[field.value ?? property.default ?? property.max]}
                  onValueChange={value => field.onChange(value[0])}
                  max={property.max || 100}
                  min={property.min || 10}
                  step={property.step || 5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{property.min || 10}%</span>
                  <span className="font-medium">{field.value ?? property.default ?? property.max}%</span>
                  <span>{property.max || 100}%</span>
                </div>
              </div>
            )}
          />
        );

      // Novo case para o tipo `select` (usado pelo alignment)
      case 'select':
        return (
          <Controller
            control={control}
            name={key}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder={`Selecione o ${property.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {property.options?.map((option: any) => (
                    <SelectItem key={option.value || option} value={option.value || option}>
                      {option.label || option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );

      default:
        return null;
    }
  },
  [control, errors]
);
O que fazer agora
Atualize o OptimizedPropertiesPanel.tsx: Substitua o código existente pelas novas versões das funções createValidationSchema, getCommonProperties e renderPropertyInput.