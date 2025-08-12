// Simplified Template File
// Placeholder templates to avoid complex type issues

import type { BlockData } from '../types/blocks';

export function getEtapa1Template(): BlockData[] {
  return [
    {
      id: 'etapa1-titulo',
      type: 'title-standalone',
      content: {},
      order: 0,
      properties: {
        text: 'Descubra Seu Estilo Pessoal',
        size: 'h1',
        color: '#1a1a1a',
        alignment: 'center',
      },
    },
  ];
}

export function getEtapa2Template(): BlockData[] {
  return [
    {
      id: 'etapa2-titulo',
      type: 'title-standalone',
      content: {},
      order: 0,
      properties: {
        text: 'Questão 1',
        size: 'h2',
        color: '#1a1a1a',
        alignment: 'center',
      },
    },
  ];
}

export function getEtapa3Template(): BlockData[] {
  return [
    {
      id: 'etapa3-titulo',
      type: 'title-standalone',
      content: {},
      order: 0,
      properties: {
        text: 'Questão 2',
        size: 'h2',
        color: '#1a1a1a',
        alignment: 'center',
      },
    },
  ];
}

export function getEtapa12Template(): BlockData[] {
  return [
    {
      id: 'etapa12-titulo',
      type: 'title-standalone',
      content: {},
      order: 0,
      properties: {
        text: 'Questão Estratégica',
        size: 'h2',
        color: '#1a1a1a',
        alignment: 'center',
      },
    },
  ];
}

export function getEtapa13Template(): BlockData[] {
  return [
    {
      id: 'etapa13-titulo',
      type: 'title-standalone',
      content: {},
      order: 0,
      properties: {
        text: 'Questão Estratégica 2',
        size: 'h2',
        color: '#1a1a1a',
        alignment: 'center',
      },
    },
  ];
}

export function getEtapa14Template(): BlockData[] {
  return [
    {
      id: 'etapa14-titulo',
      type: 'title-standalone',
      content: {},
      order: 0,
      properties: {
        text: 'Questão 14',
        size: 'h2',
        color: '#1a1a1a',
        alignment: 'center',
      },
    },
  ];
}

export function getEtapa18Template(): BlockData[] {
  return [
    {
      id: 'etapa18-titulo',
      type: 'title-standalone',
      content: {},
      order: 0,
      properties: {
        text: 'Questão de Preço',
        size: 'h2',
        color: '#1a1a1a',
        alignment: 'center',
      },
    },
  ];
}

export function getEtapa21Template(): BlockData[] {
  return [
    {
      id: 'etapa21-titulo',
      type: 'title-standalone',
      content: {},
      order: 0,
      properties: {
        text: 'CTA Final',
        size: 'h2',
        color: '#1a1a1a',
        alignment: 'center',
      },
    },
  ];
}

export function getEtapaTemplate(etapaId: string): BlockData[] {
  switch (etapaId) {
    case 'etapa-1':
      return getEtapa1Template();
    case 'etapa-2':
      return getEtapa2Template();
    case 'etapa-3':
      return getEtapa3Template();
    case 'etapa-12':
      return getEtapa12Template();
    case 'etapa-13':
      return getEtapa13Template();
    case 'etapa-14':
      return getEtapa14Template();
    case 'etapa-18':
      return getEtapa18Template();
    case 'etapa-21':
      return getEtapa21Template();
    default:
      return [
        {
          id: `${etapaId}-default`,
          type: 'text',
          content: {},
          order: 0,
          properties: { text: 'Template padrão' },
        },
      ];
  }
}
