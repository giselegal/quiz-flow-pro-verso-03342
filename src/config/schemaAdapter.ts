// Adapter utilitário para transformar nossos BlockFieldSchemas em um formato
// unificado consumível (inspirado no UnifiedPropertySchema), sem acoplar
// diretamente ao Zod.

import type { BlockSchema, BlockFieldSchema, FieldType } from './blockPropertySchemas';

// Versão leve do UnifiedProperty (evita dependência direta de Zod aqui)
export interface UnifiedPropertyLite {
  key: string;
  type: string; // equivalente a PropertyType
  label: string;
  description?: string;
  category?: string; // equivalente a PropertyCategory
  defaultValue?: any;
  required?: boolean;
  options?: Array<{ label: string; value: any }>;
  min?: number;
  max?: number;
  step?: number;
}

const typeMap: Record<FieldType, string> = {
  text: 'text',
  textarea: 'textarea',
  number: 'number',
  range: 'range',
  boolean: 'boolean',
  color: 'color',
  select: 'select',
  json: 'json',
  'options-list': 'array',
};

const categoryMap: Record<string, string> = {
  content: 'content',
  style: 'style',
  layout: 'layout',
  behavior: 'behavior',
  validation: 'behavior',
  transform: 'style',
  spacing: 'layout',
  navigation: 'behavior',
  images: 'content',
  scoring: 'behavior',
  rules: 'advanced',
  design: 'style',
  visibility: 'behavior',
  advanced: 'advanced',
  animation: 'animation',
  accessibility: 'accessibility',
  seo: 'seo',
};

export function adaptFieldToUnifiedProperty(field: BlockFieldSchema): UnifiedPropertyLite {
  const mappedType = typeMap[field.type] || 'text';
  const mappedCategory = categoryMap[field.group || ''] || 'advanced';
  return {
    key: field.key,
    type: mappedType,
    label: field.label,
    description: field.description,
    category: mappedCategory,
    defaultValue: field.defaultValue,
    required: field.required,
    options: field.options,
    min: field.min,
    max: field.max,
    step: field.step,
  };
}

export function adaptSchemaToUnifiedProperties(schema: BlockSchema): UnifiedPropertyLite[] {
  return schema.fields.map(adaptFieldToUnifiedProperty);
}
