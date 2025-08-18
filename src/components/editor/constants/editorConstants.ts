export type PreviewMode = 'desktop' | 'tablet' | 'mobile';

export const PREVIEW_DIMENSIONS = {
  desktop: { width: '100%', maxWidth: '1200px' },
  tablet: { width: '768px', maxWidth: '768px' },
  mobile: { width: '375px', maxWidth: '375px' },
};

export const AVAILABLE_BLOCKS = [
  // === COMPONENTES BÁSICOS ===
  { type: 'heading', name: 'Título', icon: '📝', category: 'text' },
  { type: 'text', name: 'Texto', icon: '📄', category: 'text' },
  { type: 'image', name: 'Imagem', icon: '🖼️', category: 'media' },
  { type: 'button', name: 'Botão', icon: '🔘', category: 'interactive' },
  { type: 'cta', name: 'Call to Action', icon: '🎯', category: 'interactive' },
  { type: 'spacer', name: 'Espaçador', icon: '➖', category: 'layout' },
  {
    type: 'form-input',
    name: 'Campo de Entrada',
    icon: '📝',
    category: 'form',
  },
  { type: 'list', name: 'Lista', icon: '📋', category: 'text' },

  // === COMPONENTES QUIZ PRINCIPAIS ===
  {
    type: 'options-grid',
    name: 'Grade de Opções',
    icon: '⚏',
    category: 'quiz',
  },
  {
    type: 'vertical-canvas-header',
    name: 'Cabeçalho Quiz',
    icon: '🏷️',
    category: 'quiz',
  },
  {
    type: 'quiz-question',
    name: 'Questão do Quiz',
    icon: '❓',
    category: 'quiz',
  },
  { type: 'quiz-progress', name: 'Progresso', icon: '📊', category: 'quiz' },
  { type: 'quiz-transition', name: 'Transição', icon: '🔄', category: 'quiz' },

  // === COMPONENTES INLINE ESSENCIAIS ===
  { type: 'text-inline', name: 'Texto Inline', icon: '📝', category: 'inline' },
  {
    type: 'heading-inline',
    name: 'Título Inline',
    icon: '📰',
    category: 'inline',
  },
  {
    type: 'button-inline',
    name: 'Botão Inline',
    icon: '🔘',
    category: 'inline',
  },
  {
    type: 'badge-inline',
    name: 'Badge Inline',
    icon: '🏷️',
    category: 'inline',
  },
  {
    type: 'progress-inline',
    name: 'Progresso Inline',
    icon: '📈',
    category: 'inline',
  },
  {
    type: 'image-display-inline',
    name: 'Imagem Inline',
    icon: '🖼️',
    category: 'inline',
  },
  {
    type: 'style-card-inline',
    name: 'Card de Estilo',
    icon: '🎨',
    category: 'inline',
  },
  {
    type: 'result-card-inline',
    name: 'Card de Resultado',
    icon: '🏆',
    category: 'inline',
  },
  {
    type: 'countdown-inline',
    name: 'Countdown',
    icon: '⏱️',
    category: 'inline',
  },
  { type: 'stat-inline', name: 'Estatística', icon: '📊', category: 'inline' },
  {
    type: 'pricing-card-inline',
    name: 'Card de Preço',
    icon: '💰',
    category: 'inline',
  },

  // === COMPONENTES DAS 21 ETAPAS DO QUIZ ===
  {
    type: 'quiz-start-page-inline',
    name: 'Página Inicial do Quiz',
    icon: '🚀',
    category: '21-etapas',
  },
  {
    type: 'quiz-personal-info-inline',
    name: 'Informações Pessoais',
    icon: '👤',
    category: '21-etapas',
  },
  {
    type: 'quiz-experience-inline',
    name: 'Experiência',
    icon: '📚',
    category: '21-etapas',
  },
  {
    type: 'quiz-certificate-inline',
    name: 'Certificado',
    icon: '🏅',
    category: '21-etapas',
  },
  {
    type: 'quiz-leaderboard-inline',
    name: 'Ranking',
    icon: '🏆',
    category: '21-etapas',
  },
  {
    type: 'quiz-badges-inline',
    name: 'Badges',
    icon: '🎖️',
    category: '21-etapas',
  },
  {
    type: 'quiz-evolution-inline',
    name: 'Evolução',
    icon: '📈',
    category: '21-etapas',
  },
  {
    type: 'quiz-networking-inline',
    name: 'Networking',
    icon: '🤝',
    category: '21-etapas',
  },
  {
    type: 'quiz-development-plan-inline',
    name: 'Plano de Desenvolvimento',
    icon: '📋',
    category: '21-etapas',
  },
  {
    type: 'quiz-goals-dashboard-inline',
    name: 'Dashboard de Metas',
    icon: '🎯',
    category: '21-etapas',
  },
  {
    type: 'quiz-final-results-inline',
    name: 'Resultados Finais',
    icon: '🏁',
    category: '21-etapas',
  },
  {
    type: 'quiz-offer-cta-inline',
    name: 'CTA de Oferta',
    icon: '💎',
    category: '21-etapas',
  },

  // === COMPONENTES DE RESULTADO (ETAPA 20) ===
  {
    type: 'result-header-inline',
    name: 'Cabeçalho do Resultado',
    icon: '🎊',
    category: 'resultado',
  },
  {
    type: 'before-after-inline',
    name: 'Antes e Depois',
    icon: '🔄',
    category: 'resultado',
  },
  {
    type: 'bonus-list-inline',
    name: 'Lista de Bônus',
    icon: '🎁',
    category: 'resultado',
  },
  {
    type: 'step-header-inline',
    name: 'Cabeçalho de Etapa',
    icon: '📌',
    category: 'resultado',
  },
  {
    type: 'testimonial-card-inline',
    name: 'Card de Depoimento',
    icon: '💭',
    category: 'resultado',
  },
  {
    type: 'testimonials-inline',
    name: 'Depoimentos',
    icon: '🗣️',
    category: 'resultado',
  },

  // === COMPONENTES DE OFERTA (ETAPA 21) ===
  {
    type: 'quiz-offer-pricing-inline',
    name: 'Preço da Oferta',
    icon: '💰',
    category: 'oferta',
  },
  {
    type: 'loading-animation',
    name: 'Animação de Carregamento',
    icon: '⏳',
    category: 'oferta',
  },

  // === COMPONENTES MODERNOS ===
  {
    type: 'video-player',
    name: 'Player de Vídeo',
    icon: '🎬',
    category: 'media',
  },
  {
    type: 'faq-section',
    name: 'Seção de FAQ',
    icon: '❓',
    category: 'content',
  },
  {
    type: 'testimonials',
    name: 'Grade de Depoimentos',
    icon: '🌟',
    category: 'content',
  },
  { type: 'guarantee', name: 'Garantia', icon: '✅', category: 'content' },

  // === COMPONENTES ESTRATÉGICOS ===
  {
    type: 'strategic-question-image',
    name: 'Questão Estratégica com Imagem',
    icon: '🎯',
    category: 'strategic',
  },
  {
    type: 'strategic-question-main',
    name: 'Questão Estratégica Principal',
    icon: '🎪',
    category: 'strategic',
  },
  {
    type: 'strategic-question-inline',
    name: 'Questão Estratégica Inline',
    icon: '🎲',
    category: 'strategic',
  },
];

export interface QuizStep {
  id: string;
  name: string;
  order: number;
  blocksCount: number;
  isActive: boolean;
  type: string;
  description: string;
  multiSelect?: number;
}
