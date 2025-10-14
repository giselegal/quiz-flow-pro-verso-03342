/**
 * 🔌 COMPATIBILITY ADAPTER
 * 
 * Adapta o novo sistema de schemas para funcionar com código legado
 * sem breaking changes. Permite migração gradual.
 */

import { BlockSchema as NewBlockSchema, BlockFieldSchema as NewBlockFieldSchema } from './base/types';
import { SchemaAPI } from './dynamic';

/**
 * Tipo legado de BasePropertySchema
 */
export interface LegacyPropertySchema {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'enum' | 'richtext' | 'options-list';
  group?: string;
  default?: any;
  placeholder?: string;
  required?: boolean;
  validate?: (value: any, allValues: Record<string, any>) => string | null;
  when?: (values: Record<string, any>) => boolean;
  min?: number;
  max?: number;
  step?: number;
  enumValues?: string[];
  description?: string;
  rows?: number;
  disabled?: boolean;
}

/**
 * Tipo legado de BlockSchema
 */
export interface LegacyBlockSchema {
  type: string;
  label?: string;
  description?: string;
  groups: Array<{
    id: string;
    label: string;
    description?: string;
    order?: number;
  }>;
  properties: LegacyPropertySchema[];
}

/**
 * Converte novo BlockFieldSchema para formato legado
 */
function convertFieldToLegacy(field: NewBlockFieldSchema): LegacyPropertySchema {
  // Mapeia tipos novos para tipos legados
  const typeMap: Record<string, LegacyPropertySchema['type']> = {
    'string': 'string',
    'richtext': 'richtext',
    'number': 'number',
    'boolean': 'boolean',
    'color': 'color',
    'select': 'select',
    'enum': 'enum',
    'options-list': 'options-list',
    'array': 'options-list', // Fallback
    'object': 'string', // Fallback
    'json': 'string', // Fallback
  };

  return {
    key: field.key,
    label: field.label,
    type: typeMap[field.type] || 'string',
    group: field.group,
    default: field.default,
    placeholder: field.placeholder,
    required: field.required,
    validate: field.validate,
    when: field.when,
    min: field.min,
    max: field.max,
    step: field.step,
    enumValues: field.enumValues,
    description: field.description,
    rows: field.rows,
    disabled: field.disabled,
  };
}

/**
 * Converte novo BlockSchema para formato legado
 */
function convertSchemaToLegacy(schema: NewBlockSchema): LegacyBlockSchema {
  return {
    type: schema.type,
    label: schema.label,
    description: schema.description,
    groups: schema.groups,
    properties: schema.properties.map(convertFieldToLegacy),
  };
}

/**
 * Adapter para getBlockSchema (compatibilidade com código legado)
 */
export async function getBlockSchema(type: string): Promise<LegacyBlockSchema | null> {
  const newSchema = await SchemaAPI.get(type);
  if (!newSchema) return null;
  return convertSchemaToLegacy(newSchema);
}

/**
 * Versão síncrona (usa cache)
 */
export function getBlockSchemaSync(type: string): LegacyBlockSchema | null {
  const newSchema = SchemaAPI.getSync(type);
  if (!newSchema) return null;
  return convertSchemaToLegacy(newSchema);
}

/**
 * Map de schemas legados para migração gradual
 * Permite manter schemas antigos funcionando enquanto novos são criados
 */
const legacySchemaMap = new Map<string, LegacyBlockSchema>();

/**
 * Registra um schema legado temporariamente
 */
export function registerLegacySchema(schema: LegacyBlockSchema): void {
  legacySchemaMap.set(schema.type, schema);
}

/**
 * Obtém schema (tenta novo sistema primeiro, depois legado)
 */
export function getHybridSchema(type: string): LegacyBlockSchema | null {
  // Tenta cache do novo sistema
  const newSchema = SchemaAPI.getSync(type);
  if (newSchema) {
    return convertSchemaToLegacy(newSchema);
  }

  // Fallback para legado
  return legacySchemaMap.get(type) || null;
}

/**
 * Exporta tipos para uso em código legado
 */
export type BasePropertySchema = LegacyPropertySchema;
export type { LegacyBlockSchema as BlockSchema };
