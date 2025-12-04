/**
 * 📐 LAYOUT BLOCK SCHEMAS
 * Schemas para blocos de layout, container e navegação
 */

import type { BlockSchemaRecord } from './types';
import { COMMON_FIELDS } from './types';

export const layoutSchemas: BlockSchemaRecord = {
  'container': {
    label: 'Container',
    fields: [
      { key: 'maxWidth', label: 'Largura Máxima', type: 'text', defaultValue: '100%' },
      { key: 'padding', label: 'Padding', type: 'text' },
      { key: 'centered', label: 'Centralizado', type: 'boolean', defaultValue: true },
      { ...COMMON_FIELDS.backgroundColor },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'section': {
    label: 'Seção',
    fields: [
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'padding', label: 'Padding', type: 'text', defaultValue: '24px' },
      { ...COMMON_FIELDS.backgroundColor },
      { key: 'borderRadius', label: 'Arredondamento', type: 'number', defaultValue: 0 },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'spacer': {
    label: 'Espaçador',
    fields: [
      { key: 'height', label: 'Altura (px)', type: 'number', defaultValue: 24 },
      { key: 'showDivider', label: 'Mostrar Divisor', type: 'boolean', defaultValue: false },
      { key: 'dividerColor', label: 'Cor do Divisor', type: 'color', defaultValue: '#e5e5e5' },
    ],
  },

  'divider': {
    label: 'Divisor',
    fields: [
      { key: 'thickness', label: 'Espessura', type: 'number', defaultValue: 1 },
      { key: 'color', label: 'Cor', type: 'color', defaultValue: '#e5e5e5' },
      { key: 'style', label: 'Estilo', type: 'select', options: [
        { label: 'Sólido', value: 'solid' },
        { label: 'Tracejado', value: 'dashed' },
        { label: 'Pontilhado', value: 'dotted' },
      ], defaultValue: 'solid' },
      { key: 'width', label: 'Largura', type: 'text', defaultValue: '100%' },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'navigation-buttons': {
    label: 'Botões de Navegação',
    fields: [
      { key: 'showBack', label: 'Mostrar Voltar', type: 'boolean', defaultValue: true },
      { key: 'showNext', label: 'Mostrar Próximo', type: 'boolean', defaultValue: true },
      { key: 'backText', label: 'Texto Voltar', type: 'text', defaultValue: 'Voltar' },
      { key: 'nextText', label: 'Texto Próximo', type: 'text', defaultValue: 'Continuar' },
      { key: 'alignment', label: 'Alinhamento', type: 'select', options: [
        { label: 'Esquerda', value: 'left' },
        { label: 'Centro', value: 'center' },
        { label: 'Direita', value: 'right' },
        { label: 'Distribuído', value: 'between' },
      ], defaultValue: 'between' },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'progress-bar': {
    label: 'Barra de Progresso',
    fields: [
      { key: 'value', label: 'Valor Atual', type: 'number', defaultValue: 50 },
      { key: 'max', label: 'Valor Máximo', type: 'number', defaultValue: 100 },
      { key: 'showLabel', label: 'Mostrar Label', type: 'boolean', defaultValue: true },
      { key: 'showPercentage', label: 'Mostrar Percentual', type: 'boolean', defaultValue: true },
      { key: 'color', label: 'Cor', type: 'color', defaultValue: '#B89B7A' },
      { key: 'height', label: 'Altura', type: 'number', defaultValue: 8 },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'mentor-section-inline': {
    label: 'Seção da Mentora',
    fields: [
      { key: 'mentorName', label: 'Nome', type: 'text', group: 'content', defaultValue: 'Gisele Galvão' },
      { key: 'mentorTitle', label: 'Título', type: 'text', group: 'content' },
      { key: 'mentorImage', label: 'Imagem', type: 'text', group: 'content' },
      { key: 'mentorBio', label: 'Bio', type: 'textarea', group: 'content' },
      { key: 'showCredentials', label: 'Mostrar Credenciais', type: 'boolean', defaultValue: true },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },
};
