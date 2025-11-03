/**
 * 🎯 BLOCK COMPLEXITY MAP - Sistema Híbrido Inteligente
 * 
 * Mapeia cada tipo de bloco como SIMPLE (JSON) ou COMPLEX (TSX)
 * Usado pelo UnifiedBlockRegistry para decidir qual renderizador usar
 */

export type BlockComplexity = 'SIMPLE' | 'COMPLEX';

export interface BlockComplexityConfig {
  complexity: BlockComplexity;
  reason: string;
  component?: string; // Path do componente TSX (apenas para COMPLEX)
  template?: string; // Path do template HTML (apenas para SIMPLE)
}

/**
 * Mapa de complexidade de todos os blocos do quiz21StepsComplete
 */
export const BLOCK_COMPLEXITY_MAP: Record<string, BlockComplexityConfig> = {
  // =============================================
  // SIMPLE BLOCKS (JSON-driven) - ~25 blocos
  // =============================================
  
  // =============================================
  // INTRO BLOCKS (Step 01) - COMPLEX (React Components)
  // =============================================
  'intro-logo': {
    complexity: 'COMPLEX',
    reason: 'Componente React com lógica de fallback e compatibilidade JSON v3',
    component: '@/components/editor/blocks/atomic/IntroLogoBlock',
  },
  'intro-title': {
    complexity: 'COMPLEX',
    reason: 'Componente React com sanitização HTML e parsing de color tags',
    component: '@/components/editor/blocks/atomic/IntroTitleBlock',
  },
  'intro-description': {
    complexity: 'COMPLEX',
    reason: 'Componente React com suporte a HTML sanitizado',
    component: '@/components/editor/blocks/atomic/IntroDescriptionBlock',
  },
  'intro-image': {
    complexity: 'COMPLEX',
    reason: 'Componente React com lazy loading e error handling',
    component: '@/components/editor/blocks/atomic/IntroImageBlock',
  },
  
  // Text Blocks (Universal)
  'text': {
    complexity: 'SIMPLE',
    reason: 'Texto puro sem interatividade',
    template: 'text-inline.html',
  },
  'text-inline': {
    complexity: 'SIMPLE',
    reason: 'Texto inline sem lógica',
    template: 'text-inline.html',
  },
  'heading-inline': {
    complexity: 'SIMPLE',
    reason: 'Cabeçalho HTML simples',
    template: 'heading-inline.html',
  },
  
  // Image Blocks (Universal)
  'image': {
    complexity: 'SIMPLE',
    reason: 'Tag img HTML básica',
    template: 'image-inline.html',
  },
  'image-inline': {
    complexity: 'SIMPLE',
    reason: 'Imagem estática sem eventos',
    template: 'image-inline.html',
  },
  'image-display-inline': {
    complexity: 'SIMPLE',
    reason: 'Display de imagem sem lógica',
    template: 'image-inline.html',
  },
  
  // Button Blocks (Basic)
  'button': {
    complexity: 'SIMPLE',
    reason: 'Botão HTML com evento simples',
    template: 'button-inline.html',
  },
  'button-inline': {
    complexity: 'SIMPLE',
    reason: 'Botão básico sem validação complexa',
    template: 'button-inline.html',
  },
  
  // Question Blocks (Steps 02-11) - COMPLEX (React Components)
  'question-progress': {
    complexity: 'COMPLEX',
    reason: 'Componente React com cálculo de percentual e animações',
    component: '@/components/editor/blocks/atomic/QuestionProgressBlock',
  },
  'question-text': {
    complexity: 'COMPLEX',
    reason: 'Componente React com suporte a subtítulo e formatação',
    component: '@/components/editor/blocks/atomic/QuestionTextBlock',
  },
  'question-number': {
    complexity: 'COMPLEX',
    reason: 'Componente React com lógica de numeração e estilização',
    component: '@/components/editor/blocks/atomic/QuestionNumberBlock',
  },
  
  // Transition Blocks (Steps 12, 19) - COMPLEX (React Components)
  'transition-title': {
    complexity: 'COMPLEX',
    reason: 'Componente React com suporte a animações e HTML',
    component: '@/components/editor/blocks/atomic/TransitionTitleBlock',
  },
  'transition-text': {
    complexity: 'COMPLEX',
    reason: 'Componente React com suporte a HTML sanitizado',
    component: '@/components/editor/blocks/atomic/TransitionTextBlock',
  },
  'transition-image': {
    complexity: 'COMPLEX',
    reason: 'Componente React com lazy loading',
    component: '@/components/editor/blocks/atomic/TransitionImageBlock',
  },
  
  // Result Blocks (Step 20) - COMPLEX (React Components)
  'result-header': {
    complexity: 'COMPLEX',
    reason: 'Componente React com dados dinâmicos do resultado',
    component: '@/components/editor/blocks/atomic/ResultHeaderBlock',
  },
  'result-description': {
    complexity: 'COMPLEX',
    reason: 'Componente React com HTML sanitizado e placeholders',
    component: '@/components/editor/blocks/atomic/ResultDescriptionBlock',
  },
  'result-image': {
    complexity: 'COMPLEX',
    reason: 'Componente React com lazy loading e fallback',
    component: '@/components/editor/blocks/atomic/ResultImageBlock',
  },
  
  // Layout Blocks
  'decorative-bar-inline': {
    complexity: 'SIMPLE',
    reason: 'Barra decorativa CSS pura',
    template: 'decorative-bar-inline.html',
  },
  'legal-notice-inline': {
    complexity: 'SIMPLE',
    reason: 'Aviso legal estático',
    template: 'legal-notice-inline.html',
  },
  'footer-copyright': {
    complexity: 'SIMPLE',
    reason: 'Rodapé de copyright estático',
    template: 'footer-copyright.html',
  },
  
  // Offer Blocks (Step 21) - Simples
  'offer-hero': {
    complexity: 'SIMPLE',
    reason: 'Hero da oferta sem interatividade',
    template: 'offer-hero.html',
  },
  'offer-benefits': {
    complexity: 'SIMPLE',
    reason: 'Lista de benefícios estática',
    template: 'offer-benefits.html',
  },
  
  // =============================================
  // COMPLEX BLOCKS (TSX) - ~10 blocos
  // =============================================
  
  // CTA & Interactive Buttons
  'CTAButton': {
    complexity: 'COMPLEX',
    reason: 'Componente React com navegação e contextData',
    component: '@/components/editor/blocks/atomic/CTAButtonBlock',
  },
  'cta-button': {
    complexity: 'COMPLEX',
    reason: 'Alias de CTAButton com mesma lógica',
    component: '@/components/editor/blocks/atomic/CTAButtonBlock',
  },
  
  // Quiz Interactive Blocks
  'options-grid': {
    complexity: 'COMPLEX',
    reason: 'Lógica de seleção, validação, tracking de respostas',
    component: '@/components/editor/blocks/OptionsGridBlock',
  },
  'quiz-options': {
    complexity: 'COMPLEX',
    reason: 'Alias de options-grid com mesma complexidade',
    component: '@/components/editor/blocks/OptionsGridBlock',
  },
  'quiz-options-grid-connected': {
    complexity: 'COMPLEX',
    reason: 'Conectado ao estado do quiz, API calls',
    component: '@/components/editor/blocks/ConnectedOptionsGridBlock',
  },
  
  // Form Blocks
  'form-input': {
    complexity: 'COMPLEX',
    reason: 'Validação react-hook-form, controle de estado',
    component: '@/components/editor/blocks/FormInputBlock',
  },
  'intro-form': {
    complexity: 'COMPLEX',
    reason: 'Formulário completo com validação e submissão',
    component: '@/components/editor/blocks/atomic/IntroFormBlock',
  },
  'lead-form': {
    complexity: 'COMPLEX',
    reason: 'Captura de lead com validação e integração API',
    component: '@/components/editor/blocks/LeadFormBlock',
  },
  'connected-lead-form': {
    complexity: 'COMPLEX',
    reason: 'Formulário conectado ao backend',
    component: '@/components/editor/blocks/ConnectedLeadFormBlock',
  },
  
  // AI & Advanced Features
  'fashion-ai-generator': {
    complexity: 'COMPLEX',
    reason: 'Integração IA, API calls, estados complexos',
    component: '@/components/blocks/ai/FashionAIGeneratorBlock',
  },
  
  // Navigation & State Management
  'question-navigation': {
    complexity: 'COMPLEX',
    reason: 'Controle de navegação, validação de step',
    component: '@/components/editor/blocks/atomic/QuestionNavigationBlock',
  },
  'quiz-navigation': {
    complexity: 'COMPLEX',
    reason: 'Navegação global do quiz com estado',
    component: '@/components/editor/blocks/QuizNavigationBlock',
  },
  
  // Animated Components
  'transition-loader': {
    complexity: 'COMPLEX',
    reason: 'Animações complexas, setTimeout/setInterval',
    component: '@/components/editor/blocks/atomic/TransitionLoaderBlock',
  },
  'quiz-transition-loader': {
    complexity: 'COMPLEX',
    reason: 'Loader animado com progresso',
    component: '@/components/editor/blocks/QuizTransitionLoaderBlock',
  },
  'loading-animation': {
    complexity: 'COMPLEX',
    reason: 'Animações CSS/JS complexas',
    component: '@/components/editor/blocks/LoaderInlineBlock',
  },
  'gradient-animation': {
    complexity: 'COMPLEX',
    reason: 'Animações de gradiente com keyframes',
    component: '@/components/editor/blocks/GradientAnimationBlock',
  },
  
  // Carousels & Interactive Lists
  'testimonials-carousel-inline': {
    complexity: 'COMPLEX',
    reason: 'Carousel com estado, navegação, autoplay',
    component: '@/components/editor/blocks/TestimonialsCarouselInlineBlock',
  },
  'style-cards-grid': {
    complexity: 'COMPLEX',
    reason: 'Grid interativo com seleção',
    component: '@/components/editor/blocks/StyleCardsGridBlock',
  },
  
  // Result Advanced Blocks
  'result-progress-bars': {
    complexity: 'COMPLEX',
    reason: 'Barras animadas com cálculos dinâmicos',
    component: '@/components/editor/blocks/ResultProgressBarsBlock',
  },
  'step20-compatibility': {
    complexity: 'COMPLEX',
    reason: 'Cálculo de compatibilidade com lógica complexa',
    component: '@/components/editor/blocks/Step20ModularBlocks',
  },
  
  // Offer Interactive Blocks
  'urgency-timer-inline': {
    complexity: 'COMPLEX',
    reason: 'Timer com countdown, localStorage',
    component: '@/components/editor/blocks/UrgencyTimerInlineBlock',
  },
  'offer-pricing': {
    complexity: 'COMPLEX',
    reason: 'Cálculos de preço, seleção de planos',
    component: '@/components/editor/blocks/PricingBlock',
  },
};

/**
 * Verifica se um bloco é simples (JSON-driven)
 */
export function isSimpleBlock(blockType: string): boolean {
  const config = BLOCK_COMPLEXITY_MAP[blockType];
  return config?.complexity === 'SIMPLE';
}

/**
 * Verifica se um bloco é complexo (TSX)
 */
export function isComplexBlock(blockType: string): boolean {
  const config = BLOCK_COMPLEXITY_MAP[blockType];
  return config?.complexity === 'COMPLEX';
}

/**
 * Obtém o caminho do componente TSX (apenas para blocos complexos)
 */
export function getComponentPath(blockType: string): string | null {
  const config = BLOCK_COMPLEXITY_MAP[blockType];
  return config?.complexity === 'COMPLEX' ? config.component || null : null;
}

/**
 * Obtém o caminho do template HTML (apenas para blocos simples)
 */
export function getTemplatePath(blockType: string): string | null {
  const config = BLOCK_COMPLEXITY_MAP[blockType];
  return config?.complexity === 'SIMPLE' ? config.template || null : null;
}

/**
 * Lista todos os tipos de blocos simples
 */
export function getSimpleBlockTypes(): string[] {
  return Object.entries(BLOCK_COMPLEXITY_MAP)
    .filter(([_, config]) => config.complexity === 'SIMPLE')
    .map(([type]) => type);
}

/**
 * Lista todos os tipos de blocos complexos
 */
export function getComplexBlockTypes(): string[] {
  return Object.entries(BLOCK_COMPLEXITY_MAP)
    .filter(([_, config]) => config.complexity === 'COMPLEX')
    .map(([type]) => type);
}

/**
 * Estatísticas do mapeamento
 */
export function getComplexityStats() {
  const simple = getSimpleBlockTypes();
  const complex = getComplexBlockTypes();
  const total = simple.length + complex.length;
  
  return {
    simple: simple.length,
    complex: complex.length,
    total,
    simplePercentage: Math.round((simple.length / total) * 100),
    complexPercentage: Math.round((complex.length / total) * 100),
  };
}
