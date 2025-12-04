/**
 * 📝 CONTENT BLOCK SCHEMAS
 * Schemas para blocos de texto, imagem e mídia
 */

import type { BlockSchemaRecord } from './types';
import { COMMON_FIELDS } from './types';

export const contentSchemas: BlockSchemaRecord = {
  'text': {
    label: 'Texto',
    fields: [
      { key: 'content', label: 'Conteúdo', type: 'textarea' },
      { key: 'text', label: 'Texto', type: 'textarea' },
      { key: 'html', label: 'HTML', type: 'textarea' },
      { key: 'fontSize', label: 'Tamanho da Fonte', type: 'text' },
      { key: 'fontWeight', label: 'Peso da Fonte', type: 'text' },
      { key: 'textAlign', label: 'Alinhamento', type: 'text' },
      { key: 'color', label: 'Cor', type: 'color' },
      { key: 'lineHeight', label: 'Altura da Linha', type: 'text' },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
      { ...COMMON_FIELDS.scale },
    ],
  },

  'text-inline': {
    label: 'Texto (Inline)',
    fields: [
      { key: 'content', label: 'Conteúdo', type: 'textarea' },
      { key: 'fontSize', label: 'Tamanho da Fonte', type: 'text' },
      { key: 'fontWeight', label: 'Peso da Fonte', type: 'text' },
      { key: 'textAlign', label: 'Alinhamento', type: 'text' },
      { key: 'color', label: 'Cor', type: 'color' },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
      { ...COMMON_FIELDS.scale },
      { ...COMMON_FIELDS.scaleOrigin },
    ],
  },

  'image-display-inline': {
    label: 'Imagem',
    fields: [
      { key: 'src', label: 'URL da Imagem', type: 'text' },
      { key: 'alt', label: 'Texto Alternativo', type: 'text' },
      { key: 'width', label: 'Largura', type: 'number' },
      { key: 'height', label: 'Altura', type: 'number' },
      { key: 'containerPosition', label: 'Posição', type: 'text' },
      { ...COMMON_FIELDS.marginBottom },
      { ...COMMON_FIELDS.scale, description: 'Ajuste o tamanho visual da imagem. 100% = tamanho base.' },
      { ...COMMON_FIELDS.scaleOrigin },
    ],
  },

  'image-inline': {
    label: 'Imagem (Inline)',
    fields: [
      { key: 'src', label: 'URL da Imagem', type: 'text' },
      { key: 'alt', label: 'Texto Alternativo', type: 'text' },
      { key: 'width', label: 'Largura', type: 'number' },
      { key: 'height', label: 'Altura', type: 'number' },
      { ...COMMON_FIELDS.marginBottom },
      { ...COMMON_FIELDS.scale },
      { ...COMMON_FIELDS.scaleOrigin },
    ],
  },

  'video-embed': {
    label: 'Vídeo Embed',
    fields: [
      { key: 'videoUrl', label: 'URL do Vídeo', type: 'text', required: true },
      { key: 'autoplay', label: 'Autoplay', type: 'boolean', defaultValue: false },
      { key: 'muted', label: 'Sem Som', type: 'boolean', defaultValue: true },
      { key: 'loop', label: 'Loop', type: 'boolean', defaultValue: false },
      { key: 'controls', label: 'Mostrar Controles', type: 'boolean', defaultValue: true },
      { key: 'aspectRatio', label: 'Proporção', type: 'select', options: [
        { label: '16:9', value: '16/9' },
        { label: '4:3', value: '4/3' },
        { label: '1:1', value: '1/1' },
        { label: '9:16', value: '9/16' },
      ], defaultValue: '16/9' },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'before-after-inline': {
    label: 'Antes e Depois',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Sua Transformação' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea', group: 'content' },
      { key: 'beforeImage', label: 'URL Imagem Antes', type: 'text', group: 'content' },
      { key: 'afterImage', label: 'URL Imagem Depois', type: 'text', group: 'content' },
      { key: 'beforeLabel', label: 'Rótulo Antes', type: 'text', group: 'content', defaultValue: 'ANTES' },
      { key: 'afterLabel', label: 'Rótulo Depois', type: 'text', group: 'content', defaultValue: 'DEPOIS' },
      {
        key: 'layoutStyle',
        label: 'Layout',
        type: 'select',
        group: 'layout',
        defaultValue: 'side-by-side',
        options: [
          { label: 'Lado a Lado', value: 'side-by-side' },
          { label: 'Com Troca (Toggle)', value: 'toggle' },
        ],
      },
      { key: 'showComparison', label: 'Mostrar Comparação', type: 'boolean', group: 'layout', defaultValue: true },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },
};
