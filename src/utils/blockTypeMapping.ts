// @ts-nocheck
// =====================================================================
// utils/blockTypeMapping.ts - Mapeamento de tipos de bloco
// =====================================================================

/**
 * Mapeia tipos de bloco do template para tipos suportados pelo renderer
 */
export const mapBlockType = (originalType: string): string => {
  const typeMapping: Record<string, string> = {
    // Tipos básicos
    text: 'text',
    heading: 'heading',
    image: 'image',
    button: 'button',
    spacer: 'spacer',

    // Componentes quiz
    'quiz-question': 'quiz-question',
    'quiz-progress': 'quiz-progress',
    'quiz-transition': 'quiz-transition',
    'options-grid': 'options-grid',
    'vertical-canvas-header': 'vertical-canvas-header',

    // Componentes inline
    'quiz-start-page-inline': 'text-inline', // Temporário fallback
    'quiz-personal-info-inline': 'text-inline',
    'quiz-experience-inline': 'text-inline',
    'quiz-certificate-inline': 'text-inline',
    'quiz-leaderboard-inline': 'text-inline',
    'quiz-badges-inline': 'badge-inline',
    'quiz-evolution-inline': 'text-inline',
    'quiz-networking-inline': 'text-inline',
    'quiz-development-plan-inline': 'text-inline',
    'quiz-goals-dashboard-inline': 'text-inline',
    'quiz-final-results-inline': 'text-inline',
    'quiz-offer-cta-inline': 'button-inline',
    'quiz-offer-pricing-inline': 'pricing-card-inline',

    // Componentes de resultado
    'result-header-inline': 'heading-inline',
    'result-card-inline': 'text-inline',
    'before-after-inline': 'text-inline',
    'bonus-list-inline': 'text-inline',
    'step-header-inline': 'heading-inline',
    'testimonial-card-inline': 'text-inline',
    'countdown-inline': 'countdown-inline',
    'countdown-timer-inline': 'countdown-inline',
    'countdown-timer-real': 'countdown-inline',
    'stat-inline': 'stat-inline',
    'pricing-card-inline': 'pricing-card-inline',
    'price-highlight-inline': 'pricing-card-inline',

    // Componentes CTA modernos
    'cta-button-modern': 'button-inline',
    'cta-modern': 'cta',

    // Fallbacks
    'form-input': 'form-input',
    list: 'list',
  };

  return typeMapping[originalType] || 'text-inline';
};

/**
 * Normaliza um bloco para garantir compatibilidade
 */
export const normalizeBlock = (block: any): any => {
  return {
    ...block,
    type: mapBlockType(block.type),
    properties: {
      ...block.content,
      ...block.properties,
      // Preservar o content original se já existir, senão usar fallbacks
      content:
        block.properties?.content ||
        block.content?.title ||
        block.content?.question ||
        'Componente sem conteúdo definido',
    },
  };
};
