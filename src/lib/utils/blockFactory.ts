/**
 * 🏭 Block Factory - Cria blocos com defaults apropriados
 * 
 * Garante que todos os blocos tenham:
 * - ID único via nanoid
 * - Propriedades padrão por tipo
 * - Timestamps de criação
 */

import { generateBlockId } from './generateId';

export interface BlockDefaults {
  [key: string]: Record<string, any>;
}

/**
 * Propriedades padrão por tipo de bloco
 */
export const BLOCK_DEFAULTS: BlockDefaults = {
  // Introdução
  'intro-logo-header': {
    title: 'Título Principal',
    subtitle: 'Subtítulo descritivo',
    showLogo: true,
    alignment: 'center',
  },
  'intro-headline': {
    text: 'Seu título aqui',
    size: 'lg',
    alignment: 'center',
  },
  'intro-subheadline': {
    text: 'Subtítulo ou descrição',
    size: 'md',
    alignment: 'center',
  },
  'intro-cta-button': {
    text: 'Começar Agora',
    variant: 'primary',
    size: 'lg',
  },
  
  // Conteúdo
  'text-heading': {
    text: 'Título da Seção',
    level: 'h2',
    alignment: 'left',
  },
  'text-paragraph': {
    text: 'Digite seu texto aqui...',
    alignment: 'left',
  },
  'text-list': {
    items: ['Item 1', 'Item 2', 'Item 3'],
    style: 'bullet',
  },
  'media-image': {
    src: '',
    alt: 'Descrição da imagem',
    aspectRatio: '16:9',
  },
  'media-video': {
    src: '',
    autoplay: false,
    controls: true,
  },
  
  // Perguntas
  'question-multiple-choice': {
    question: 'Qual sua preferência?',
    options: [
      { label: 'Opção A', value: 'a', points: 1 },
      { label: 'Opção B', value: 'b', points: 1 },
      { label: 'Opção C', value: 'c', points: 1 },
    ],
    allowMultiple: false,
  },
  'question-single-choice': {
    question: 'Escolha uma opção:',
    options: [
      { label: 'Sim', value: 'yes', points: 1 },
      { label: 'Não', value: 'no', points: 0 },
    ],
  },
  'question-text-input': {
    question: 'Digite sua resposta:',
    placeholder: 'Sua resposta...',
    required: true,
  },
  'question-scale': {
    question: 'Em uma escala de 1 a 10:',
    min: 1,
    max: 10,
    step: 1,
  },
  
  // Resultados
  'result-score': {
    showScore: true,
    showPercentage: true,
    label: 'Sua pontuação:',
  },
  'result-category': {
    categories: [],
    showCategory: true,
  },
  'result-recommendation': {
    title: 'Sua Recomendação',
    description: 'Baseado nas suas respostas...',
  },
  
  // Ofertas
  'offer-cta': {
    headline: 'Aproveite esta oferta exclusiva!',
    buttonText: 'Quero Aproveitar',
    buttonUrl: '#',
  },
  'offer-pricing': {
    originalPrice: 197,
    salePrice: 97,
    currency: 'BRL',
    showDiscount: true,
  },
  'offer-guarantee': {
    days: 7,
    text: 'Garantia incondicional de 7 dias',
  },
  
  // Layout
  'layout-container': {
    direction: 'column',
    gap: 16,
    padding: 16,
  },
  'layout-columns': {
    columns: 2,
    gap: 16,
  },
  
  // Navegação
  'navigation-button': {
    text: 'Continuar',
    action: 'next',
  },
  'navigation-progress': {
    showPercentage: true,
    showStepCount: true,
  },
};

/**
 * Cria um novo bloco com ID único e propriedades padrão
 */
export function createBlock(
  blockType: string,
  overrides: Record<string, any> = {},
  order: number = 0
): any {
  const defaults = BLOCK_DEFAULTS[blockType] || {};
  
  return {
    id: generateBlockId(blockType),
    type: blockType,
    order,
    properties: {
      ...defaults,
      ...overrides,
    },
    content: {},
    parentId: null,
    metadata: {
      createdAt: new Date().toISOString(),
      version: 1,
    },
  };
}

/**
 * Clona um bloco existente com novo ID único
 */
export function cloneBlock(block: any, newOrder?: number): any {
  return {
    ...JSON.parse(JSON.stringify(block)),
    id: generateBlockId(block.type || 'block'),
    order: newOrder ?? (block.order || 0) + 1,
    metadata: {
      ...block.metadata,
      clonedFrom: block.id,
      clonedAt: new Date().toISOString(),
      version: 1,
    },
  };
}

/**
 * Lista todos os tipos de blocos disponíveis
 */
export function getAvailableBlockTypes(): string[] {
  return Object.keys(BLOCK_DEFAULTS);
}

/**
 * Obtém defaults para um tipo de bloco
 */
export function getBlockDefaults(blockType: string): Record<string, any> {
  return BLOCK_DEFAULTS[blockType] || {};
}
