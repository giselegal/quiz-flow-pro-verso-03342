/**
 * 📐 BLOCK SCHEMA TYPES
 * Definições de tipos para schemas de propriedades de blocos
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'range'
  | 'boolean'
  | 'color'
  | 'options-list'
  | 'select'
  | 'json';

export interface BlockFieldSchema {
  key: string;
  label: string;
  type: FieldType;
  options?: Array<{ label: string; value: string | number }>;
  min?: number;
  max?: number;
  step?: number;
  group?: string;
  defaultValue?: unknown;
  required?: boolean;
  hidden?: boolean;
  showIf?: string;
  description?: string;
}

export interface BlockSchema {
  label: string;
  fields: BlockFieldSchema[];
}

export type BlockSchemaRecord = Record<string, BlockSchema>;

// Common field presets for reuse
export const COMMON_FIELDS = {
  marginTop: { key: 'marginTop', label: 'Margem Superior', type: 'number' as FieldType, group: 'spacing' },
  marginBottom: { key: 'marginBottom', label: 'Margem Inferior', type: 'number' as FieldType, group: 'spacing' },
  marginLeft: { key: 'marginLeft', label: 'Margem Esquerda', type: 'number' as FieldType, group: 'spacing' },
  marginRight: { key: 'marginRight', label: 'Margem Direita', type: 'number' as FieldType, group: 'spacing' },
  backgroundColor: { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color' as FieldType, group: 'style' },
  textColor: { key: 'color', label: 'Cor do Texto', type: 'color' as FieldType, group: 'style' },
  scale: {
    key: 'scale',
    label: 'Escala (%)',
    type: 'range' as FieldType,
    min: 10,
    max: 300,
    step: 1,
    group: 'transform',
    defaultValue: 100,
  },
  scaleOrigin: {
    key: 'scaleOrigin',
    label: 'Origem da Escala',
    type: 'select' as FieldType,
    group: 'transform',
    options: [
      { label: 'Centro', value: 'center' },
      { label: 'Topo Centro', value: 'top center' },
      { label: 'Base Centro', value: 'bottom center' },
    ],
  },
  alignment: {
    key: 'textAlign',
    label: 'Alinhamento',
    type: 'select' as FieldType,
    options: [
      { label: 'Esquerda', value: 'left' },
      { label: 'Centro', value: 'center' },
      { label: 'Direita', value: 'right' },
    ],
    defaultValue: 'center',
  },
  size: {
    key: 'size',
    label: 'Tamanho',
    type: 'select' as FieldType,
    options: [
      { label: 'Pequeno', value: 'sm' },
      { label: 'Médio', value: 'md' },
      { label: 'Grande', value: 'lg' },
    ],
    defaultValue: 'md',
  },
};
