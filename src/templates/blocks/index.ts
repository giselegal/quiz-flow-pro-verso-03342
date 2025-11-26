/**
 * 🎨 BLOCOS REUTILIZÁVEIS
 * 
 * Biblioteca de blocos comuns que podem ser usados em qualquer funnel
 */

import type { Block } from '../schemas';

// ============================================================================
// HEADER BLOCKS
// ============================================================================

export const createHeaderBlock = (overrides?: Partial<Block>): Block => ({
  id: 'header-default',
  type: 'quiz-intro-header',
  order: 0,
  properties: {
    showLogo: true,
    logoPosition: 'center',
    showProgress: true,
    progressValue: 0,
    progressMax: 100,
    backgroundColor: '#FAF9F7',
    ...overrides?.properties,
  },
  content: {
    logoUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_132,h_55,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png',
    logoAlt: 'Logo',
    ...overrides?.content,
  },
  ...overrides,
});

// ============================================================================
// FORM BLOCKS
// ============================================================================

export const createFormBlock = (overrides?: Partial<Block>): Block => ({
  id: 'form-default',
  type: 'quiz-intro-form',
  order: 3,
  properties: {
    buttonText: 'Continuar',
    buttonStyle: 'primary',
    ...overrides?.properties,
  },
  content: {
    fields: [
      { name: 'name', type: 'text', placeholder: 'Seu nome', required: true },
      { name: 'email', type: 'email', placeholder: 'Seu e-mail', required: true },
    ],
    ...overrides?.content,
  },
  ...overrides,
});

// ============================================================================
// CTA BLOCKS
// ============================================================================

export const createCTABlock = (overrides?: Partial<Block>): Block => ({
  id: 'cta-default',
  type: 'button',
  order: 4,
  properties: {
    backgroundColor: '#B89B7A',
    textColor: '#FFFFFF',
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 'bold',
    ...overrides?.properties,
  },
  content: {
    buttonText: 'Começar Agora',
    buttonUrl: '#',
    ...overrides?.content,
  },
  ...overrides,
});

// ============================================================================
// TEXT BLOCKS
// ============================================================================

export const createTitleBlock = (text: string, overrides?: Partial<Block>): Block => ({
  id: 'title-default',
  type: 'quiz-intro-title',
  order: 1,
  properties: {
    level: 'h1',
    align: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    ...overrides?.properties,
  },
  content: {
    text,
    ...overrides?.content,
  },
  ...overrides,
});

export const createDescriptionBlock = (text: string, overrides?: Partial<Block>): Block => ({
  id: 'description-default',
  type: 'quiz-intro-description',
  order: 2,
  properties: {
    align: 'center',
    fontSize: 16,
    color: '#6B7280',
    ...overrides?.properties,
  },
  content: {
    text,
    ...overrides?.content,
  },
  ...overrides,
});

// ============================================================================
// EXPORT ALL
// ============================================================================

export const SharedBlocks = {
  header: createHeaderBlock,
  form: createFormBlock,
  cta: createCTABlock,
  title: createTitleBlock,
  description: createDescriptionBlock,
};

export default SharedBlocks;
