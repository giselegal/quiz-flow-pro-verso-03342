/**
 * 🎯 TIPOS BASE DO SISTEMA DE SCHEMAS
 * 
 * Define a estrutura de tipos reutilizável e genérica para o sistema de schemas.
 * Utiliza generics para type-safety e inferência automática.
 */

/**
 * Tipo genérico para valores de campo com type-safety
 */
export type FieldValue<T = any> = T;

/**
 * Validador genérico com contexto completo
 */
export type FieldValidator<T = any> = (
  value: T,
  allValues: Record<string, any>
) => string | null;

/**
 * Condição de visibilidade genérica
 */
export type FieldCondition = (values: Record<string, any>) => boolean;

/**
 * Tipos de campo suportados
 */
export type FieldType =
  | 'string'
  | 'richtext'
  | 'number'
  | 'boolean'
  | 'color'
  | 'select'
  | 'enum'
  | 'options-list'
  | 'array'
  | 'object'
  | 'json';

/**
 * Schema de campo com tipagem genérica
 */
export interface BlockFieldSchema<T = any> {
  key: string;
  label: string;
  type: FieldType;
  group: string;
  
  // Valores
  default?: T;
  placeholder?: string;
  
  // Validação
  required?: boolean;
  validate?: FieldValidator<T>;
  
  // Visibilidade condicional
  when?: FieldCondition;
  
  // Configurações específicas por tipo
  min?: number;
  max?: number;
  step?: number;
  enumValues?: string[];
  
  // Metadados
  description?: string;
  helpText?: string;
  
  // UI hints
  rows?: number; // para textarea
  disabled?: boolean;
}

/**
 * Grupo de campos relacionados
 */
export interface FieldGroup {
  id: string;
  label: string;
  description?: string;
  order?: number;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

/**
 * Schema completo de um bloco
 */
export interface BlockSchema {
  type: string;
  label: string;
  description?: string;
  icon?: string;
  category?: string;
  
  properties: BlockFieldSchema[];
  groups: FieldGroup[];
  
  // Metadados para otimização
  version?: string;
  deprecated?: boolean;
  replacedBy?: string;
}

/**
 * Registry de schemas com lazy loading
 */
export type SchemaRegistry = Map<string, () => Promise<BlockSchema>>;

/**
 * Helper type para extrair o tipo de valor de um schema
 */
export type InferSchemaValue<S extends BlockFieldSchema> = S extends BlockFieldSchema<infer T>
  ? T
  : never;

/**
 * Helper type para criar schemas type-safe
 */
export type TypedBlockSchema<T extends Record<string, any>> = BlockSchema & {
  properties: {
    [K in keyof T]: BlockFieldSchema<T[K]>;
  }[keyof T][];
};
