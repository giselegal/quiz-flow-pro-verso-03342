/**
 * 🎬 INTRO & HEADER BLOCK SCHEMAS
 * Schemas para blocos de introdução, cabeçalhos e elementos decorativos
 */

import type { BlockSchemaRecord } from './types';
import { COMMON_FIELDS } from './types';

export const introSchemas: BlockSchemaRecord = {
  'quiz-intro-header': {
    label: 'Cabeçalho do Quiz',
    fields: [
      { key: 'logoUrl', label: 'Logo', type: 'text' },
      { key: 'logoAlt', label: 'Texto Alternativo', type: 'text' },
      { key: 'logoWidth', label: 'Largura do Logo', type: 'number' },
      { key: 'logoHeight', label: 'Altura do Logo', type: 'number' },
      { key: 'progressValue', label: 'Valor do Progresso', type: 'number' },
      { key: 'progressMax', label: 'Máximo do Progresso', type: 'number' },
      { key: 'showBackButton', label: 'Mostrar Voltar', type: 'boolean' },
      { key: 'showProgress', label: 'Mostrar Progresso', type: 'boolean' },
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'subtitle', label: 'Subtítulo', type: 'text' },
      { key: 'alignment', label: 'Alinhamento', type: 'text' },
      {
        key: 'fontSize',
        label: 'Tamanho da Fonte',
        type: 'select',
        group: 'style',
        options: [
          { label: 'Pequeno', value: 'sm' },
          { label: 'Normal', value: 'base' },
          { label: 'Grande', value: 'lg' },
          { label: 'Extra', value: 'xl' },
        ],
        defaultValue: 'base',
      },
      {
        key: 'fontWeight',
        label: 'Peso da Fonte',
        type: 'select',
        group: 'style',
        options: [
          { label: 'Fino', value: 'light' },
          { label: 'Normal', value: 'normal' },
          { label: 'Médio', value: 'medium' },
          { label: 'Negrito', value: 'bold' },
        ],
        defaultValue: 'normal',
      },
      { key: 'type', label: 'Tipo', type: 'text' },
      { key: 'containerWidth', label: 'Largura do Container', type: 'text' },
      { key: 'containerPosition', label: 'Posição do Container', type: 'text' },
      { key: 'spacing', label: 'Espaçamento Interno', type: 'text' },
      { ...COMMON_FIELDS.backgroundColor },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
      { ...COMMON_FIELDS.scale },
      { ...COMMON_FIELDS.scaleOrigin },
    ],
  },

  'decorative-bar-inline': {
    label: 'Barra Decorativa',
    fields: [
      { key: 'width', label: 'Largura', type: 'text' },
      { key: 'height', label: 'Altura', type: 'number' },
      { key: 'color', label: 'Cor', type: 'color' },
      { ...COMMON_FIELDS.backgroundColor },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
      { ...COMMON_FIELDS.scale },
      { ...COMMON_FIELDS.scaleOrigin },
    ],
  },

  'intro-logo-header': {
    label: 'Cabeçalho com Logo',
    fields: [
      { key: 'logoUrl', label: 'URL do Logo', type: 'text', required: true },
      { key: 'logoAlt', label: 'Texto Alternativo', type: 'text', defaultValue: 'Logo' },
      { key: 'logoWidth', label: 'Largura', type: 'number', defaultValue: 120 },
      { key: 'showProgress', label: 'Mostrar Progresso', type: 'boolean', defaultValue: true },
      { key: 'progressValue', label: 'Progresso Atual', type: 'number', defaultValue: 0 },
      { key: 'progressMax', label: 'Progresso Máximo', type: 'number', defaultValue: 100 },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },
};
