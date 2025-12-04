/**
 * 🏆 RESULT BLOCK SCHEMAS
 * Schemas para blocos de resultado, pontuação e progresso
 */

import type { BlockSchemaRecord } from './types';
import { COMMON_FIELDS } from './types';

export const resultSchemas: BlockSchemaRecord = {
  'result-header-inline': {
    label: 'Cabeçalho de Resultado',
    fields: [
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'subtitle', label: 'Subtítulo', type: 'text' },
      { ...COMMON_FIELDS.alignment },
      { ...COMMON_FIELDS.backgroundColor },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
      { ...COMMON_FIELDS.scale },
      { ...COMMON_FIELDS.scaleOrigin },
    ],
  },

  'quiz-score-display': {
    label: 'Exibição de Pontuação',
    fields: [
      { key: 'score', label: 'Pontuação', type: 'number', required: true, defaultValue: 0 },
      { key: 'maxScore', label: 'Pontuação Máxima', type: 'number', defaultValue: 100 },
      { key: 'label', label: 'Rótulo', type: 'text', defaultValue: 'Sua Pontuação' },
      { key: 'showPercentage', label: 'Mostrar Percentual', type: 'boolean', defaultValue: true },
      { key: 'animateCounter', label: 'Animar Contador', type: 'boolean', defaultValue: true },
      { ...COMMON_FIELDS.size },
      { key: 'color', label: 'Cor', type: 'color', defaultValue: '#B89B7A' },
      { ...COMMON_FIELDS.backgroundColor, defaultValue: '#FAF9F7' },
      { key: 'borderRadius', label: 'Arredondamento', type: 'number', defaultValue: 8 },
    ],
  },

  'result-congrats': {
    label: 'Parabéns (Resultado)',
    fields: [
      { key: 'title', label: 'Título', type: 'text', required: true, defaultValue: 'Parabéns!' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea', defaultValue: 'Você completou o quiz!' },
      { key: 'emoji', label: 'Emoji', type: 'text', defaultValue: '🎉' },
      { key: 'showConfetti', label: 'Mostrar Confetti', type: 'boolean', defaultValue: true },
      {
        key: 'animationType',
        label: 'Animação',
        type: 'select',
        options: [
          { label: 'Fade In', value: 'fade' },
          { label: 'Slide Up', value: 'slideUp' },
          { label: 'Bounce', value: 'bounce' },
          { label: 'Scale', value: 'scale' },
        ],
        defaultValue: 'slideUp',
      },
      { ...COMMON_FIELDS.alignment },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'result-progress-bars': {
    label: 'Barras de Progresso (Resultado)',
    fields: [
      { key: 'title', label: 'Título', type: 'text', defaultValue: 'Seu Perfil' },
      {
        key: 'bars',
        label: 'Barras (JSON)',
        type: 'json',
        required: true,
        defaultValue: [
          { label: 'Clássico', value: 75, color: '#B89B7A' },
          { label: 'Moderno', value: 60, color: '#432818' },
          { label: 'Romântico', value: 85, color: '#F3E8D3' },
        ],
        description: 'Array de objetos: [{ label, value, color }]',
      },
      { key: 'showPercentage', label: 'Mostrar Porcentagens', type: 'boolean', defaultValue: true },
      { key: 'animate', label: 'Animar Barras', type: 'boolean', defaultValue: true },
      { key: 'barHeight', label: 'Altura das Barras', type: 'number', defaultValue: 24 },
      { key: 'spacing', label: 'Espaçamento', type: 'number', defaultValue: 12 },
      { key: 'borderRadius', label: 'Arredondamento', type: 'number', defaultValue: 12 },
    ],
  },

  'style-result-inline': {
    label: 'Resultado de Estilo',
    fields: [
      { key: 'styleName', label: 'Nome do Estilo', type: 'text', required: true },
      { key: 'styleDescription', label: 'Descrição', type: 'textarea' },
      { key: 'styleImage', label: 'Imagem do Estilo', type: 'text' },
      { key: 'percentage', label: 'Percentual', type: 'number', defaultValue: 85 },
      { key: 'showBadge', label: 'Mostrar Badge', type: 'boolean', defaultValue: true },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'secondary-styles-inline': {
    label: 'Estilos Secundários',
    fields: [
      { key: 'title', label: 'Título', type: 'text', defaultValue: 'Seus estilos secundários' },
      { key: 'styles', label: 'Estilos (JSON)', type: 'json', defaultValue: [] },
      { key: 'showPercentages', label: 'Mostrar Percentuais', type: 'boolean', defaultValue: true },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },
};
