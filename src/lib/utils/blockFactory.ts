/**
 * 🏭 Block Factory - Cria blocos com defaults apropriados
 * 
 * FASE 3: Completado com todos os tipos de blocos do BlockTypeZ
 * 
 * Garante que todos os blocos tenham:
 * - ID único via nanoid
 * - Propriedades padrão por tipo
 * - Campo calculationRule
 * - Timestamps de criação
 */

import { generateBlockId } from './generateId';
import type { QuizBlock } from '@/schemas/quiz-schema.zod';

export interface BlockDefaults {
  [key: string]: Record<string, any>;
}

/**
 * Tipos de blocos válidos (alinhado com BlockTypeZ)
 */
export const VALID_BLOCK_TYPES = [
  // Progress & Navigation
  'question-progress',
  'question-navigation',
  
  // Intro Blocks
  'intro-logo',
  'intro-logo-header',
  'intro-title',
  'intro-subtitle',
  'intro-description',
  'intro-image',
  'intro-form',
  'intro-button',
  'quiz-intro-header',
  
  // Question Blocks
  'question-title',
  'question-description',
  'options-grid',
  'form-input',
  'question-hero',
  'transition-hero',
  'CTAButton',
  
  // Transition Blocks
  'transition-title',
  'transition-text',
  'transition-button',
  'transition-image',
  
  // Result Blocks
  'result-header',
  'result-title',
  'result-description',
  'result-image',
  'result-display',
  'result-guide-image',
  'result-congrats',
  'quiz-score-display',
  'result-main',
  'result-progress-bars',
  'result-secondary-styles',
  'result-cta',
  'result-share',
  
  // Offer Blocks
  'offer-hero',
  'quiz-offer-hero',
  'offer-card',
  'benefits-list',
  'testimonials',
  'pricing',
  'guarantee',
  'urgency-timer',
  'value-anchoring',
  'secure-purchase',
  'cta-button',
  
  // Generic Content
  'text',
  'text-inline',
  'heading',
  'image',
  'button',
  
  // Layout
  'container',
  'spacer',
  'divider',
  'footer-copyright',
] as const;

export type ValidBlockType = typeof VALID_BLOCK_TYPES[number];

/**
 * Propriedades padrão por tipo de bloco
 * Alinhado com BlockTypeZ do schema Zod
 */
export const BLOCK_DEFAULTS: BlockDefaults = {
  // ========== INTRODUÇÃO ==========
  'intro-logo-header': {
    title: 'Título Principal',
    subtitle: 'Subtítulo descritivo',
    showLogo: true,
    alignment: 'center',
    logoUrl: '',
  },
  'intro-logo': {
    logoUrl: '',
    alignment: 'center',
  },
  'intro-title': {
    text: 'Título',
    alignment: 'center',
  },
  'intro-subtitle': {
    text: 'Subtítulo',
    alignment: 'center',
  },
  'intro-description': {
    text: 'Descrição aqui...',
    alignment: 'center',
  },
  'intro-image': {
    src: '',
    alt: 'Imagem de introdução',
  },
  'intro-form': {
    fields: [],
    submitText: 'Continuar',
  },
  'intro-button': {
    text: 'Começar',
    variant: 'primary',
    action: 'next',
  },
  'quiz-intro-header': {
    title: 'Quiz',
    subtitle: '',
  },
  
  // ========== PERGUNTAS ==========
  'question-title': {
    title: 'Pergunta',
    subtitle: '',
    alignment: 'center',
  },
  'question-description': {
    text: 'Descrição da pergunta',
  },
  'question-progress': {
    showPercentage: true,
    showStepCount: true,
  },
  'question-navigation': {
    showBack: true,
    showNext: true,
  },
  'question-hero': {
    title: 'Hero Question',
    subtitle: '',
    imageUrl: '',
  },
  
  // ========== OPÇÕES ==========
  'options-grid': {
    options: [
      { id: 'opt1', text: 'Opção 1', value: 'opt1' },
      { id: 'opt2', text: 'Opção 2', value: 'opt2' },
    ],
    columns: 2,
    multiSelect: false,
  },
  'form-input': {
    label: 'Campo',
    placeholder: 'Digite aqui...',
    type: 'text',
    required: false,
  },
  
  // ========== TRANSIÇÃO ==========
  'transition-title': {
    text: 'Carregando...',
    alignment: 'center',
  },
  'transition-text': {
    text: 'Analisando suas respostas...',
    alignment: 'center',
  },
  'transition-button': {
    text: 'Continuar',
    action: 'next',
  },
  'transition-image': {
    src: '',
    alt: 'Imagem de transição',
  },
  'transition-hero': {
    title: 'Transição',
    subtitle: '',
    imageUrl: '',
  },
  
  // ========== RESULTADOS ==========
  'result-header': {
    title: 'Seu Resultado',
    subtitle: 'Parabéns!',
    alignment: 'center',
  },
  'result-title': {
    text: 'Resultado',
    alignment: 'center',
  },
  'result-description': {
    text: 'Baseado nas suas respostas...',
    alignment: 'center',
  },
  'result-image': {
    src: '',
    alt: 'Imagem de resultado',
  },
  'result-display': {
    showScore: true,
    showPercentage: true,
  },
  'result-guide-image': {
    src: '',
    alt: 'Guia',
  },
  'result-congrats': {
    title: 'Parabéns!',
    message: 'Você completou o quiz!',
  },
  'quiz-score-display': {
    showScore: true,
    showPercentage: true,
    label: 'Sua pontuação:',
  },
  'result-main': {
    title: 'Resultado Principal',
    description: '',
  },
  'result-progress-bars': {
    bars: [],
    showLabels: true,
  },
  'result-secondary-styles': {
    styles: [],
  },
  'result-cta': {
    headline: 'Próximo passo',
    buttonText: 'Ver mais',
    buttonUrl: '#',
  },
  'result-share': {
    platforms: ['whatsapp', 'facebook', 'twitter'],
    message: 'Confira meu resultado!',
  },
  
  // ========== OFERTAS ==========
  'offer-hero': {
    title: 'Oferta Especial',
    subtitle: 'Aproveite agora!',
    imageUrl: '',
  },
  'quiz-offer-hero': {
    title: 'Sua Recomendação',
    description: '',
  },
  'offer-card': {
    title: 'Produto',
    price: 97,
    description: '',
  },
  'benefits-list': {
    title: 'Benefícios',
    items: ['Benefício 1', 'Benefício 2', 'Benefício 3'],
  },
  'testimonials': {
    items: [],
  },
  'pricing': {
    originalPrice: 197,
    salePrice: 97,
    currency: 'BRL',
    showDiscount: true,
  },
  'guarantee': {
    days: 7,
    text: 'Garantia incondicional de 7 dias',
  },
  'urgency-timer': {
    duration: 600,
    showHours: true,
    showMinutes: true,
    showSeconds: true,
  },
  'value-anchoring': {
    originalValue: 997,
    currentValue: 97,
  },
  'secure-purchase': {
    badges: ['ssl', 'garantia', 'suporte'],
  },
  
  // ========== CTA ==========
  'cta-button': {
    text: 'Clique Aqui',
    variant: 'primary',
    action: 'next',
    url: '',
  },
  'CTAButton': {
    text: 'Clique Aqui',
    variant: 'primary',
    action: 'next',
    url: '',
  },
  
  // ========== CONTEÚDO GENÉRICO ==========
  'text': {
    content: '',
    alignment: 'left',
  },
  'text-inline': {
    content: '',
  },
  'heading': {
    text: 'Título',
    level: 'h2',
    alignment: 'left',
  },
  'image': {
    src: '',
    alt: 'Imagem',
    aspectRatio: '16:9',
  },
  'button': {
    text: 'Botão',
    variant: 'primary',
    action: 'next',
  },
  
  // ========== LAYOUT ==========
  'container': {
    direction: 'column',
    gap: 16,
    padding: 16,
  },
  'spacer': {
    height: 24,
  },
  'divider': {
    style: 'solid',
    color: 'border',
  },
  'footer-copyright': {
    text: '© 2025 - Todos os direitos reservados',
  },
};

/**
 * Cria um novo bloco com ID único e propriedades padrão
 * Retorna um bloco tipado compatível com QuizBlock
 */
export function createBlock(
  blockType: ValidBlockType,
  overrides: Record<string, any> = {},
  order: number = 0
): QuizBlock {
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
    calculationRule: undefined,
    metadata: {
      editable: true,
      reorderable: true,
      reusable: true,
      deletable: true,
    },
  };
}

/**
 * Clona um bloco existente com novo ID único
 */
export function cloneBlock(block: QuizBlock, newOrder?: number): QuizBlock {
  const cloned = JSON.parse(JSON.stringify(block));
  
  return {
    ...cloned,
    id: generateBlockId(block.type || 'block'),
    order: newOrder ?? (block.order || 0) + 1,
    metadata: {
      ...cloned.metadata,
      editable: true,
      reorderable: true,
      reusable: true,
      deletable: true,
    },
  };
}

/**
 * Lista todos os tipos de blocos disponíveis
 */
export function getAvailableBlockTypes(): ValidBlockType[] {
  return [...VALID_BLOCK_TYPES];
}

/**
 * Obtém defaults para um tipo de bloco
 */
export function getBlockDefaults(blockType: string): Record<string, any> {
  return BLOCK_DEFAULTS[blockType] || {};
}

/**
 * Verifica se um tipo de bloco é suportado
 */
export function isValidBlockType(blockType: string): blockType is ValidBlockType {
  return VALID_BLOCK_TYPES.includes(blockType as ValidBlockType);
}

/**
 * Obtém blocos agrupados por categoria
 */
export function getBlocksByCategory(): Record<string, ValidBlockType[]> {
  return {
    intro: ['intro-logo', 'intro-logo-header', 'intro-title', 'intro-subtitle', 'intro-description', 'intro-image', 'intro-form', 'intro-button', 'quiz-intro-header'],
    question: ['question-title', 'question-description', 'question-progress', 'question-navigation', 'question-hero', 'options-grid', 'form-input'],
    transition: ['transition-title', 'transition-text', 'transition-button', 'transition-image', 'transition-hero'],
    result: ['result-header', 'result-title', 'result-description', 'result-image', 'result-display', 'result-guide-image', 'result-congrats', 'quiz-score-display', 'result-main', 'result-progress-bars', 'result-secondary-styles', 'result-cta', 'result-share'],
    offer: ['offer-hero', 'quiz-offer-hero', 'offer-card', 'benefits-list', 'testimonials', 'pricing', 'guarantee', 'urgency-timer', 'value-anchoring', 'secure-purchase'],
    cta: ['cta-button', 'CTAButton'],
    content: ['text', 'text-inline', 'heading', 'image', 'button'],
    layout: ['container', 'spacer', 'divider', 'footer-copyright'],
  };
}
