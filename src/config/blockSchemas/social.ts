/**
 * 📱 SOCIAL BLOCK SCHEMAS
 * Schemas para blocos de compartilhamento social e interação
 */

import type { BlockSchemaRecord } from './types';
import { COMMON_FIELDS } from './types';

export const socialSchemas: BlockSchemaRecord = {
  'social-share-inline': {
    label: 'Compartilhamento Social',
    fields: [
      { key: 'title', label: 'Título', type: 'text', defaultValue: 'Compartilhe seu resultado!' },
      { key: 'platforms', label: 'Plataformas (JSON)', type: 'json', defaultValue: ['whatsapp', 'facebook', 'twitter', 'linkedin'] },
      { key: 'shareText', label: 'Texto de Compartilhamento', type: 'textarea' },
      { key: 'shareUrl', label: 'URL para Compartilhar', type: 'text' },
      { ...COMMON_FIELDS.size },
      { key: 'showLabels', label: 'Mostrar Labels', type: 'boolean', group: 'appearance', defaultValue: true },
      { key: 'showCounts', label: 'Mostrar Contadores', type: 'boolean', group: 'appearance', defaultValue: false },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'whatsapp-button': {
    label: 'Botão WhatsApp',
    fields: [
      { key: 'phoneNumber', label: 'Número (com código país)', type: 'text', required: true },
      { key: 'message', label: 'Mensagem Pré-definida', type: 'textarea' },
      { key: 'buttonText', label: 'Texto do Botão', type: 'text', defaultValue: 'Falar no WhatsApp' },
      { key: 'showIcon', label: 'Mostrar Ícone', type: 'boolean', defaultValue: true },
      { ...COMMON_FIELDS.size },
      { key: 'fullWidth', label: 'Largura Total', type: 'boolean', defaultValue: false },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'instagram-embed': {
    label: 'Embed Instagram',
    fields: [
      { key: 'postUrl', label: 'URL do Post', type: 'text', required: true },
      { key: 'caption', label: 'Legenda', type: 'text' },
      { key: 'showCaption', label: 'Mostrar Legenda', type: 'boolean', defaultValue: true },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'faq-inline': {
    label: 'FAQ (Perguntas Frequentes)',
    fields: [
      { key: 'title', label: 'Título', type: 'text', defaultValue: 'Perguntas Frequentes' },
      { key: 'items', label: 'Itens (JSON)', type: 'json', defaultValue: [
        { question: 'Pergunta 1?', answer: 'Resposta 1' },
        { question: 'Pergunta 2?', answer: 'Resposta 2' },
      ], description: 'Array: [{ question, answer }]' },
      { key: 'expandFirst', label: 'Expandir Primeiro', type: 'boolean', defaultValue: true },
      { key: 'allowMultiple', label: 'Permitir Múltiplos Abertos', type: 'boolean', defaultValue: false },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },
};
