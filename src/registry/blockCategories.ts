/**
 * 🎯 FASE 3.1: CATEGORIZAÇÃO DE BLOCOS POR CRITICIDADE
 * 
 * Define quais blocos devem ser carregados imediatamente (CRITICAL)
 * e quais podem usar lazy loading com code splitting (LAZY)
 * 
 * META: -40% no bundle inicial
 */

// ============================================================================
// BLOCOS CRÍTICOS (Carregamento Imediato)
// ============================================================================

/**
 * Blocos essenciais que devem estar disponíveis imediatamente
 * para garantir FCP (First Contentful Paint) rápido
 */
export const CRITICAL_BLOCKS = [
  // Blocos fundamentais
  'text',
  'text-inline',
  'heading',
  'heading-inline',
  'headline',
  'headline-inline',
  'image',
  'image-inline',
  'button',
  'button-inline',
  
  // Quiz core (etapa inicial sempre carrega)
  'quiz-intro-header',
  'quiz-step',
  'quiz-progress',
  'quiz-progress-bar',
  'options-grid',
  'quiz-options',
  'quiz-options-inline',
  'form-input',
  
  // Atomic blocks - Intro (Step 1)
  'intro-logo',
  'intro-logo-header',
  'intro-title',
  'intro-image',
  'intro-description',
  'intro-form',
  'decorative-bar',
  'decorative-bar-inline',
  'legal-notice',
  'legal-notice-inline',
  
  // Blocos de transição (Step 12, 19)
  'quiz-transition-loader',
  'transition-title',
  'transition-loader',
  'transition-text',
  'transition-progress',
  'transition-message',
] as const;

// ============================================================================
// BLOCOS LAZY (Code Splitting)
// ============================================================================

/**
 * Blocos não-críticos que podem ser carregados sob demanda
 * Carregados quando o step que os contém é acessado
 */
export const LAZY_BLOCKS = [
  // Ofertas e conversão (Step 21 - carrega por último)
  'pricing-card',
  'urgency-timer-inline',
  'before-after-inline',
  'bonus',
  'bonus-inline',
  'secure-purchase',
  'value-anchoring',
  'mentor-section-inline',
  
  // Elementos visuais não-essenciais
  'countdown',
  'stat',
  'badge',
  'divider',
  'spacer',
  'gradient-animation',
  
  // Testimonials (importante mas não crítico)
  'testimonial-card-inline',
  'testimonials-carousel-inline',
  'testimonials',
  'testimonials-grid',
  
  // Step 20 - Result (carrega após conclusão)
  'result-header-inline',
  'modular-result-header',
  'quiz-result-style',
  'secondary-styles',
  'quiz-result-secondary',
  'result-card',
  'result-congrats',
  'result-main',
  'result-style',
  'result-image',
  'result-description',
  'result-header',
  'result-characteristics',
  'result-cta',
  'result-cta-primary',
  'result-cta-secondary',
  'result-progress-bars',
  'result-secondary-styles',
  'result-share',
  
  // Step 20 Modular
  'step20-result-header',
  'step20-style-reveal',
  'step20-user-greeting',
  'step20-compatibility',
  'step20-secondary-styles',
  'step20-personalized-offer',
  'step20-complete-template',
  
  // Advanced components
  'quiz-logo',
  'quiz-back-button',
  'quiz-question-header',
  'quiz-result-header',
  'quiz-offer-hero',
  'quiz-advanced-question',
  'quiz-style-question',
  'style-card-inline',
  'style-cards-grid',
  
  // AI Features
  'fashion-ai-generator',
  
  // Forms avançados
  'lead-form',
  'connected-lead-form',
  'connected-template-wrapper',
  
  // Containers e sections
  'container',
  'section',
  'box',
  'form-container',
  'hero',
  'quiz-transition',
  
  // Question blocks (Steps 02-11)
  'question-progress',
  'question-number',
  'question-text',
  'question-title',
  'question-instructions',
  'question-navigation',
  
  // Sections V3
  'question-hero',
  'transition-hero',
  'offer-hero',
  'pricing',
  
  // Outros
  'benefits',
  'benefits-list',
  'guarantee',
  'quiz-navigation',
  'sales-hero',
  'strategic-question',
  'quiz-processing',
  'progress-bar',
  'progress-inline',
  'loader-inline',
  'loading-animation',
  'transition-subtitle',
  'transition-image',
  'transition-description',
  'footer-copyright',
  'image-display-inline',
] as const;

// ============================================================================
// HELPER TYPES & FUNCTIONS
// ============================================================================

export type CriticalBlockType = typeof CRITICAL_BLOCKS[number];
export type LazyBlockType = typeof LAZY_BLOCKS[number];
export type BlockCategory = 'critical' | 'lazy';

/**
 * Verifica se um bloco é crítico (deve ser carregado imediatamente)
 */
export function isCriticalBlock(blockType: string): boolean {
  return CRITICAL_BLOCKS.includes(blockType as any);
}

/**
 * Verifica se um bloco deve usar lazy loading
 */
export function isLazyBlock(blockType: string): boolean {
  return LAZY_BLOCKS.includes(blockType as any);
}

/**
 * Obtém a categoria de um bloco
 */
export function getBlockCategory(blockType: string): BlockCategory {
  if (isCriticalBlock(blockType)) return 'critical';
  if (isLazyBlock(blockType)) return 'lazy';
  
  // Default: lazy para blocos desconhecidos (mais seguro)
  return 'lazy';
}

/**
 * Estatísticas de categorização
 */
export function getCategorizationStats() {
  return {
    critical: CRITICAL_BLOCKS.length,
    lazy: LAZY_BLOCKS.length,
    total: CRITICAL_BLOCKS.length + LAZY_BLOCKS.length,
    criticalPercentage: Math.round((CRITICAL_BLOCKS.length / (CRITICAL_BLOCKS.length + LAZY_BLOCKS.length)) * 100),
  };
}

// ============================================================================
// PRELOAD STRATEGIES
// ============================================================================

/**
 * Blocos que devem ser pré-carregados quando usuário avança no quiz
 * Carregados de forma não-bloqueante em background
 */
export const PRELOAD_STRATEGIES = {
  // Pré-carregar blocos de resultado quando usuário chegar em Step 15+
  result: {
    triggerStep: 15,
    blocks: [
      'step20-result-header',
      'step20-style-reveal',
      'result-congrats',
      'result-cta-primary',
    ],
  },
  
  // Pré-carregar blocos de oferta quando usuário chegar em Step 18+
  offer: {
    triggerStep: 18,
    blocks: [
      'pricing-card',
      'urgency-timer-inline',
      'bonus-inline',
      'testimonials',
    ],
  },
} as const;

/**
 * Obtém blocos para pré-carregar baseado no step atual
 */
export function getPreloadBlocks(currentStep: number): string[] {
  const blocks: string[] = [];
  
  Object.values(PRELOAD_STRATEGIES).forEach(strategy => {
    if (currentStep >= strategy.triggerStep) {
      blocks.push(...strategy.blocks);
    }
  });
  
  return [...new Set(blocks)]; // Remove duplicatas
}
