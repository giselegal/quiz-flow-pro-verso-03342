/**
 * 🌐 UNIVERSAL BLOCK SCHEMAS
 * Schemas universais aplicáveis a qualquer bloco
 */

import type { BlockSchemaRecord } from './types';

export const universalSchemas: BlockSchemaRecord = {
  'universal-default': {
    label: 'Propriedades Universais',
    fields: [
      {
        key: 'scale',
        label: 'Escala (%)',
        type: 'range',
        min: 10,
        max: 300,
        step: 1,
        group: 'transform',
        defaultValue: 100,
        description: 'Tamanho uniforme do bloco. 100% = tamanho natural.',
      },
      {
        key: 'scaleX',
        label: 'Escala X (fator)',
        type: 'range',
        min: 0.1,
        max: 3,
        step: 0.01,
        group: 'transform',
        description: 'Fator de escala apenas no eixo X (largura).',
      },
      {
        key: 'scaleY',
        label: 'Escala Y (fator)',
        type: 'range',
        min: 0.1,
        max: 3,
        step: 0.01,
        group: 'transform',
        description: 'Fator de escala apenas no eixo Y (altura).',
      },
      {
        key: 'scaleOrigin',
        label: 'Origem da Escala',
        type: 'select',
        options: [
          { label: 'Centro', value: 'center' },
          { label: 'Topo', value: 'top' },
          { label: 'Topo Centro', value: 'top center' },
          { label: 'Topo Esquerda', value: 'top left' },
          { label: 'Topo Direita', value: 'top right' },
          { label: 'Centro Esquerda', value: 'center left' },
          { label: 'Centro Direita', value: 'center right' },
          { label: 'Base', value: 'bottom' },
          { label: 'Base Centro', value: 'bottom center' },
          { label: 'Base Esquerda', value: 'bottom left' },
          { label: 'Base Direita', value: 'bottom right' },
        ],
        group: 'transform',
      },
      {
        key: 'scaleClass',
        label: 'Classe Tailwind de Escala',
        type: 'text',
        group: 'transform',
        description: 'Opcional: ex. scale-95 md:scale-100',
      },
    ],
  },
};
