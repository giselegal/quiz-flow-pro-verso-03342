/**
 * 💰 OFFER BLOCK SCHEMAS
 * Schemas para blocos de oferta, CTA, preços e urgência
 */

import type { BlockSchemaRecord } from './types';
import { COMMON_FIELDS } from './types';

export const offerSchemas: BlockSchemaRecord = {
  'CTAButton': {
    label: 'Botão CTA',
    fields: [
      { key: 'text', label: 'Texto do Botão', type: 'text', required: true, defaultValue: 'Clique Aqui' },
      { key: 'url', label: 'URL de Destino', type: 'text', group: 'action' },
      {
        key: 'variant',
        label: 'Variante',
        type: 'select',
        group: 'style',
        options: [
          { label: 'Primário', value: 'primary' },
          { label: 'Secundário', value: 'secondary' },
          { label: 'Outline', value: 'outline' },
        ],
        defaultValue: 'primary',
      },
      { ...COMMON_FIELDS.size },
      { key: 'fullWidth', label: 'Largura Total', type: 'boolean', defaultValue: false },
      { key: 'icon', label: 'Ícone (nome Lucide)', type: 'text', group: 'appearance' },
      { key: 'loading', label: 'Mostrar Loading', type: 'boolean', defaultValue: false },
      { key: 'disabled', label: 'Desabilitado', type: 'boolean', defaultValue: false },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'cta-button-inline': {
    label: 'Botão CTA (Inline)',
    fields: [
      { key: 'text', label: 'Texto', type: 'text', required: true, defaultValue: 'QUERO AGORA' },
      { key: 'url', label: 'URL de Destino', type: 'text' },
      {
        key: 'variant',
        label: 'Estilo',
        type: 'select',
        options: [
          { label: 'Primário', value: 'primary' },
          { label: 'Secundário', value: 'secondary' },
          { label: 'Sucesso', value: 'success' },
        ],
        defaultValue: 'primary',
      },
      { ...COMMON_FIELDS.size },
      { key: 'fullWidth', label: 'Largura Total', type: 'boolean', defaultValue: true },
      { key: 'pulse', label: 'Animação Pulse', type: 'boolean', defaultValue: false },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'urgency-timer-inline': {
    label: 'Timer de Urgência',
    fields: [
      { key: 'initialMinutes', label: 'Minutos Iniciais', type: 'number', group: 'timer', defaultValue: 15 },
      { key: 'autoStart', label: 'Iniciar Automaticamente', type: 'boolean', group: 'timer', defaultValue: true },
      { key: 'showSeconds', label: 'Mostrar Segundos', type: 'boolean', group: 'timer', defaultValue: true },
      { key: 'timerLabel', label: 'Rótulo do Timer', type: 'text', group: 'content', defaultValue: '⚡ OFERTA EXPIRA EM:' },
      { key: 'urgencyMessage', label: 'Mensagem de Urgência', type: 'text', group: 'content', defaultValue: 'Restam apenas alguns minutos!' },
      {
        key: 'spacing',
        label: 'Espaçamento Interno',
        type: 'select',
        group: 'layout',
        defaultValue: 'md',
        options: [
          { label: 'Nenhum', value: 'none' },
          { label: 'Pequeno', value: 'sm' },
          { label: 'Médio', value: 'md' },
          { label: 'Grande', value: 'lg' },
        ],
      },
      { ...COMMON_FIELDS.backgroundColor, defaultValue: '#dc2626' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'pulseColor', label: 'Cor de Destaque', type: 'color', group: 'style', defaultValue: '#fbbf24' },
      { key: 'showAlert', label: 'Mostrar Alerta', type: 'boolean', group: 'style', defaultValue: true },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'value-anchoring': {
    label: 'Ancoragem de Valor',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'O Que Você Recebe Hoje' },
      { key: 'showPricing', label: 'Mostrar Preço', type: 'boolean', group: 'content', defaultValue: true },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'pricing-block-inline': {
    label: 'Bloco de Preços',
    fields: [
      { key: 'originalPrice', label: 'Preço Original', type: 'text', defaultValue: 'R$ 497' },
      { key: 'currentPrice', label: 'Preço Atual', type: 'text', required: true, defaultValue: 'R$ 97' },
      { key: 'installments', label: 'Parcelas', type: 'text', defaultValue: '12x de R$ 9,70' },
      { key: 'discount', label: 'Desconto', type: 'text', defaultValue: '80% OFF' },
      { key: 'showBadge', label: 'Mostrar Badge', type: 'boolean', defaultValue: true },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'guarantee-inline': {
    label: 'Garantia',
    fields: [
      { key: 'title', label: 'Título', type: 'text', defaultValue: 'Garantia de 7 Dias' },
      { key: 'description', label: 'Descrição', type: 'textarea', defaultValue: 'Se não gostar, devolvemos seu dinheiro' },
      { key: 'iconUrl', label: 'URL do Ícone', type: 'text' },
      { key: 'showIcon', label: 'Mostrar Ícone', type: 'boolean', defaultValue: true },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'testimonial-inline': {
    label: 'Depoimento',
    fields: [
      { key: 'name', label: 'Nome', type: 'text', required: true },
      { key: 'text', label: 'Depoimento', type: 'textarea', required: true },
      { key: 'avatarUrl', label: 'URL do Avatar', type: 'text' },
      { key: 'rating', label: 'Avaliação (1-5)', type: 'number', min: 1, max: 5, defaultValue: 5 },
      { key: 'showStars', label: 'Mostrar Estrelas', type: 'boolean', defaultValue: true },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },
};
