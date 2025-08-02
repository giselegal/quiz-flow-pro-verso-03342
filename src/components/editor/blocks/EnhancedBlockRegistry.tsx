import React, { lazy, Suspense } from 'react';
import { BlockLoadingSkeleton } from './BlockLoadingSkeleton';
import FallbackBlock from './FallbackBlock';

// 📦 ENHANCED BLOCK REGISTRY - Sistema Unificado de Componentes
// Baseado na auditoria: 191 arquivos, 157 blocks, 70 inline components

// ⚡ LAZY LOADING - Performance Optimization
const ENHANCED_BLOCK_REGISTRY = {
  // 🎯 BLOCKS BÁSICOS
  'text': lazy(() => import('./TextBlock')),
  'text-inline': lazy(() => import('./TextInlineBlock')),
  'heading': lazy(() => import('./HeadingInlineBlock')),
  'heading-inline': lazy(() => import('./HeadingInlineBlock')),
  'image': lazy(() => import('./ImageBlock')),
  'image-display-inline': lazy(() => import('./inline/ImageDisplayInlineBlock')),
  'button': lazy(() => import('./ButtonBlock')),
  'button-inline': lazy(() => import('./ButtonInlineBlock')),
  'paragraph': lazy(() => import('./BasicTextBlock')),
  'spacer': lazy(() => import('./SpacerBlock')),
  'spacer-inline': lazy(() => import('./SpacerInlineBlock')),

  // 🧠 BLOCKS DE QUIZ
  'quiz-question': lazy(() => import('./QuizQuestionBlock')),
  'quiz-question-configurable': lazy(() => import('./QuizQuestionBlockConfigurable')),
  'quiz-progress': lazy(() => import('./QuizProgressBlock')),
  'quiz-result': lazy(() => import('./QuizResultCalculatedBlock')),
  'quiz-result-calculated': lazy(() => import('./QuizResultCalculatedBlock')),
  'quiz-start-page': lazy(() => import('./QuizStartPageBlock')),
  'quiz-start-page-inline': lazy(() => import('./inline/QuizStartPageInlineBlock')),
  'quiz-transition': lazy(() => import('./QuizTransitionBlock')),
  'quiz-title': lazy(() => import('./QuizTitleBlock')),
  'quiz-intro-header': lazy(() => import('./QuizIntroHeaderBlock')),
  'quiz-funnel-step1': lazy(() => import('./QuizFunnelStep1Block')),
  'vertical-canvas-header': lazy(() => import('./VerticalCanvasHeaderBlock')),
  'options-grid': lazy(() => import('./OptionsGridBlock')),

  // 💰 BLOCKS DE VENDAS E OFERTA
  'pricing': lazy(() => import('./PricingSectionBlock')),
  'pricing-inline': lazy(() => import('./PricingInlineBlock')),
  'pricing-card-inline': lazy(() => import('./inline/PricingCardInlineBlock')),
  'advanced-pricing-table': lazy(() => import('./AdvancedPricingTableBlock')),
  'quiz-offer-pricing': lazy(() => import('./QuizOfferPricingBlock')),
  'quiz-offer-hero': lazy(() => import('./QuizOfferHeroBlock')),
  'quiz-offer-countdown': lazy(() => import('./QuizOfferCountdownBlock')),
  'quiz-offer-testimonials': lazy(() => import('./QuizOfferTestimonialsBlock')),
  'quiz-offer-faq': lazy(() => import('./QuizOfferFAQBlock')),
  'quiz-offer-final-cta': lazy(() => import('./QuizOfferFinalCTABlock')),
  'price-comparison': lazy(() => import('./PriceComparisonBlock')),
  'dynamic-pricing': lazy(() => import('./DynamicPricingBlock')),

  // 🎨 BLOCKS DE DESIGN E LAYOUT
  'style-card': lazy(() => import('./StyleCardBlock')),
  'style-card-inline': lazy(() => import('./StyleCardInlineBlock')),
  'result-card-inline': lazy(() => import('./inline/ResultCardInlineBlock')),
  'style-characteristics': lazy(() => import('./StyleCharacteristicsBlock')),
  'secondary-styles': lazy(() => import('./QuizResultSecondaryStylesBlock')),
  'carousel': lazy(() => import('./CarouselBlock')),
  'product-carousel': lazy(() => import('./ProductCarouselBlock')),
  'bonus-carousel': lazy(() => import('./BonusBlock')),
  'gallery': lazy(() => import('./AdvancedGalleryBlock')),
  'two-column': lazy(() => import('./inline/TwoColumnInlineBlock')),

  // 💬 BLOCKS DE CREDIBILIDADE
  'testimonials': lazy(() => import('./TestimonialsBlock')),
  'testimonials-grid': lazy(() => import('./TestimonialsGridBlock')),
  'testimonials-carousel': lazy(() => import('./TestimonialsCarouselBlock')),
  'testimonials-real': lazy(() => import('./TestimonialsRealBlock')),
  'testimonials-real-inline': lazy(() => import('./TestimonialsRealInlineBlock')),
  'testimonial-card-inline': lazy(() => import('./inline/TestimonialCardInlineBlock')),
  'testimonial-inline': lazy(() => import('./TestimonialInlineBlock')),
  'social-proof': lazy(() => import('./SocialProofBlock')),

  // ✅ BLOCKS DE GARANTIA E VALOR
  'guarantee': lazy(() => import('./GuaranteeBlock')),
  'guarantee-inline': lazy(() => import('./GuaranteeInlineBlock')),
  'benefits': lazy(() => import('./BenefitsListBlock')),
  'value-stack': lazy(() => import('./ValueStackBlock')),
  'value-stack-inline': lazy(() => import('./ValueStackInlineBlock')),
  'value-anchoring': lazy(() => import('./ValueAnchoringBlock')),
  'bonus': lazy(() => import('./BonusBlock')),
  'bonus-inline': lazy(() => import('./BonusInlineBlock')),
  'bonus-list-inline': lazy(() => import('./inline/BonusListInlineBlock')),

  // 🎯 BLOCKS DE CTA E AÇÃO
  'cta': lazy(() => import('./CTAInlineBlock')),
  'cta-section-inline': lazy(() => import('./CTASectionInlineBlock')),
  'advanced-cta': lazy(() => import('./AdvancedCTABlock')),
  'advanced-cta-inline': lazy(() => import('./AdvancedCTAInlineBlock')),
  'final-cta': lazy(() => import('./FinalCTABlock')),
  'hero-offer': lazy(() => import('./HeroOfferBlock')),
  'final-value-proposition-inline': lazy(() => import('./FinalValuePropositionInlineBlock')),

  // 📊 BLOCKS DE ESTATÍSTICAS E MÉTRICAS
  'stats-metrics': lazy(() => import('./StatsMetricsBlock')),
  'stat-inline': lazy(() => import('./StatInlineBlock')),
  'animated-stat-counter': lazy(() => import('./AnimatedStatCounterBlock')),
  'animated-charts': lazy(() => import('./AnimatedChartsBlock')),
  'chart-area': lazy(() => import('./ChartAreaBlock')),
  'chart-level': lazy(() => import('./ChartLevelBlock')),
  'progress-inline': lazy(() => import('./ProgressInlineBlock')),
  'progress-bar-step': lazy(() => import('./ProgressBarStepBlock')),

  // ⏰ BLOCKS DE URGÊNCIA E TEMPO
  'countdown': lazy(() => import('./CountdownTimerBlock')),
  'countdown-inline': lazy(() => import('./inline/CountdownInlineBlock')),
  'urgency-timer': lazy(() => import('./UrgencyTimerBlock')),
  'urgency-timer-inline': lazy(() => import('./UrgencyTimerInlineBlock')),
  'loading-animation': lazy(() => import('./LoaderBlock')),
  'loader-inline': lazy(() => import('./LoaderInlineBlock')),

  // 🎬 BLOCKS DE MÍDIA
  'video': lazy(() => import('./VideoBlock')),
  'video-player': lazy(() => import('./VideoPlayerBlock')),
  'video-player-inline': lazy(() => import('./VideoPlayerInlineBlock')),
  'audio': lazy(() => import('./AudioBlock')),
  'audio-player-inline': lazy(() => import('./AudioPlayerInlineBlock')),

  // ❓ BLOCKS DE CONTEÚDO
  'faq': lazy(() => import('./FAQBlock')),
  'faq-section': lazy(() => import('./FAQSectionBlock')),
  'faq-section-inline': lazy(() => import('./FAQSectionInlineBlock')),
  'quote': lazy(() => import('./QuoteBlock')),
  'rich-text': lazy(() => import('./RichTextBlock')),
  'list': lazy(() => import('./ListBlock')),

  // 🏷️ BLOCKS DE INTERFACE
  'badge-inline': lazy(() => import('./BadgeInlineBlock')),
  'notification-inline': lazy(() => import('./NotificationInlineBlock')),
  'alert': lazy(() => import('./AlertBlock')),
  'section-divider': lazy(() => import('./SectionDividerBlock')),
  'decorative-bar-inline': lazy(() => import('./DecorativeBarInlineBlock')),

  // 🔍 BLOCKS DE COMPARAÇÃO
  'comparison': lazy(() => import('./CompareBlock')),
  'comparison-inline': lazy(() => import('./ComparisonInlineBlock')),
  'comparison-table': lazy(() => import('./ComparisonTableBlock')),
  'comparison-table-inline': lazy(() => import('./ComparisonTableInlineBlock')),
  'before-after': lazy(() => import('./BeforeAfterBlock')),
  'before-after-inline': lazy(() => import('./BeforeAfterInlineBlock')),
  'pros-cons': lazy(() => import('./ProsConsBlock')),

  // 🎉 BLOCKS ESPECIAIS
  'confetti': lazy(() => import('./ConfettiBlock')),
  'interactive-quiz': lazy(() => import('./InteractiveQuizBlock')),
  'interactive-statistics': lazy(() => import('./InteractiveStatisticsBlock')),
  'marquee': lazy(() => import('./MarqueeBlock')),
  'script': lazy(() => import('./ScriptBlock')),

  // 🏆 BLOCKS DE RESULTADO
  'result-header': lazy(() => import('./ResultHeaderBlock')),
  'result-header-inline': lazy(() => import('./ResultHeaderInlineBlock')),
  'result-page-header': lazy(() => import('./ResultPageHeaderBlock')),
  'result-description': lazy(() => import('./ResultDescriptionBlock')),
  'modern-result-page': lazy(() => import('./ModernResultPageBlock')),
  'quiz-result-header': lazy(() => import('./QuizResultHeaderBlock')),
  'quiz-result-main-card': lazy(() => import('./QuizResultMainCardBlock')),

  // 💼 BLOCKS DE PRODUTO
  'product-features-grid': lazy(() => import('./ProductFeaturesGridBlock')),
  'product-offer': lazy(() => import('./ProductOfferBlock')),
  'mentor': lazy(() => import('./MentorBlock')),
  'mentor-section-inline': lazy(() => import('./MentorSectionInlineBlock')),

  // 📝 BLOCKS DE FORMULÁRIO
  'form-input': lazy(() => import('./FormInputBlock')),
  'terms': lazy(() => import('./TermsBlock')),
  'legal-notice-inline': lazy(() => import('./LegalNoticeInlineBlock')),
  'secure-purchase': lazy(() => import('./SecurePurchaseBlock')),

  // 🎨 BLOCKS AVANÇADOS
  'pain-points-grid': lazy(() => import('./PainPointsGridBlock')),
  'arguments': lazy(() => import('./ArgumentsBlock')),
  'strategic-question': lazy(() => import('./StrategicQuestionBlock')),
  'transformation-inline': lazy(() => import('./TransformationInlineBlock')),

  // 🔧 BLOCKS DE SISTEMA
  'fallback': lazy(() => import('./FallbackBlock')),
  'enhanced-fallback': lazy(() => import('./EnhancedFallbackBlock')),
};

// 📋 DEFINIÇÕES DE SCHEMA PARA PROPRIEDADES
export interface PropertySchema {
  key: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'color' | 'image' | 'array' | 'object' | 'rich-text';
  label: string;
  description?: string;
  required?: boolean;
  tooltip?: string;
  options?: Array<{ value: string; label: string }>;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface BlockDefinition {
  type: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  component: React.LazyExoticComponent<any>;
  editor?: React.LazyExoticComponent<any>;
  defaultProps: Record<string, any>;
  schema: PropertySchema[];
  tags?: string[];
  isActive?: boolean;
}

// 🏷️ CATEGORIAS DE BLOCKS
export const BLOCK_CATEGORIES = {
  'basico': {
    name: 'Básico',
    icon: '📝',
    description: 'Componentes fundamentais',
    color: '#3B82F6'
  },
  'quiz': {
    name: 'Quiz',
    icon: '🧠',
    description: 'Elementos de quiz e questionários',
    color: '#8B5CF6'
  },
  'vendas': {
    name: 'Vendas',
    icon: '💰',
    description: 'Componentes de venda e pricing',
    color: '#10B981'
  },
  'design': {
    name: 'Design',
    icon: '🎨',
    description: 'Layouts e elementos visuais',
    color: '#F59E0B'
  },
  'credibilidade': {
    name: 'Credibilidade',
    icon: '💬',
    description: 'Depoimentos e prova social',
    color: '#EF4444'
  },
  'cta': {
    name: 'Call to Action',
    icon: '🎯',
    description: 'Botões e chamadas para ação',
    color: '#06B6D4'
  },
  'midia': {
    name: 'Mídia',
    icon: '🎬',
    description: 'Vídeo, áudio e imagens',
    color: '#84CC16'
  },
  'metricas': {
    name: 'Métricas',
    icon: '📊',
    description: 'Estatísticas e gráficos',
    color: '#6366F1'
  },
  'especiais': {
    name: 'Especiais',
    icon: '✨',
    description: 'Efeitos e componentes únicos',
    color: '#EC4899'
  },
  'avancado': {
    name: 'Avançado',
    icon: '🚀',
    description: 'Componentes complexos',
    color: '#64748B'
  }
} as const;

// 🎯 DEFINIÇÕES COMPLETAS DE BLOCKS
export const BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  // Exemplo de definição completa
  'quiz-question': {
    type: 'quiz-question',
    name: 'Questão do Quiz',
    category: 'quiz',
    icon: '❓',
    description: 'Pergunta com múltiplas opções de resposta',
    component: ENHANCED_BLOCK_REGISTRY['quiz-question'],
    defaultProps: {
      question: 'Qual é a sua pergunta?',
      options: ['Opção 1', 'Opção 2', 'Opção 3'],
      multiSelect: false,
      showTimer: false,
      timeLimit: 30
    },
    schema: [
      {
        key: 'question',
        type: 'textarea',
        label: 'Pergunta',
        description: 'A pergunta principal do quiz',
        required: true
      },
      {
        key: 'options',
        type: 'array',
        label: 'Opções de Resposta',
        description: 'Lista de opções disponíveis'
      },
      {
        key: 'multiSelect',
        type: 'boolean',
        label: 'Múltipla Escolha',
        description: 'Permitir seleção de múltiplas opções'
      },
      {
        key: 'showTimer',
        type: 'boolean',
        label: 'Mostrar Timer',
        description: 'Exibir cronômetro para a pergunta'
      },
      {
        key: 'timeLimit',
        type: 'number',
        label: 'Tempo Limite (segundos)',
        description: 'Tempo máximo para responder',
        validation: { min: 5, max: 300 }
      }
    ],
    tags: ['quiz', 'pergunta', 'interativo'],
    isActive: true
  },

  'testimonials-grid': {
    type: 'testimonials-grid',
    name: 'Grade de Depoimentos',
    category: 'credibilidade',
    icon: '💬',
    description: 'Grade responsiva com depoimentos de clientes',
    component: ENHANCED_BLOCK_REGISTRY['testimonials-grid'],
    defaultProps: {
      title: 'O que nossos clientes dizem',
      testimonials: [
        {
          name: 'João Silva',
          role: 'Cliente Satisfeito',
          content: 'Excelente produto!',
          avatar: '',
          rating: 5
        }
      ],
      columns: 3,
      showRating: true
    },
    schema: [
      {
        key: 'title',
        type: 'text',
        label: 'Título da Seção',
        required: true
      },
      {
        key: 'testimonials',
        type: 'array',
        label: 'Depoimentos',
        description: 'Lista de depoimentos dos clientes'
      },
      {
        key: 'columns',
        type: 'select',
        label: 'Número de Colunas',
        options: [
          { value: '1', label: '1 Coluna' },
          { value: '2', label: '2 Colunas' },
          { value: '3', label: '3 Colunas' },
          { value: '4', label: '4 Colunas' }
        ],
        defaultValue: '3'
      },
      {
        key: 'showRating',
        type: 'boolean',
        label: 'Mostrar Avaliação',
        description: 'Exibir estrelas de avaliação'
      }
    ],
    tags: ['depoimentos', 'credibilidade', 'social-proof'],
    isActive: true
  }

  // TODO: Adicionar definições para todos os 150+ componentes
  // Esta é uma estrutura base que será expandida
};

// 🔧 UTILITY FUNCTIONS
export function getBlockComponent(type: string): React.LazyExoticComponent<any> | null {
  return ENHANCED_BLOCK_REGISTRY[type] || null;
}

export function getBlockDefinition(type: string): BlockDefinition | null {
  return BLOCK_DEFINITIONS[type] || null;
}

export function getBlocksByCategory(category: string): BlockDefinition[] {
  return Object.values(BLOCK_DEFINITIONS).filter(block => block.category === category);
}

export function getAllBlockTypes(): string[] {
  return Object.keys(ENHANCED_BLOCK_REGISTRY);
}

export function searchBlocks(query: string): BlockDefinition[] {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(BLOCK_DEFINITIONS).filter(block =>
    block.name.toLowerCase().includes(lowercaseQuery) ||
    block.description.toLowerCase().includes(lowercaseQuery) ||
    block.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

// 🎨 UNIVERSAL BLOCK RENDERER V2 - Enhanced
export interface BlockRendererProps {
  block: {
    id: string;
    type: string;
    properties: Record<string, any>;
  };
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
}

export const UniversalBlockRendererV2: React.FC<BlockRendererProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  disabled = false
}) => {
  const blockDef = getBlockDefinition(block.type);
  const Component = getBlockComponent(block.type);

  // Fallback para componentes não encontrados
  if (!Component || !blockDef) {
    return (
      <FallbackBlock 
        blockType={block.type}
        message={`Componente "${block.type}" não encontrado`}
      />
    );
  }

  // Merge default props com props do block
  const mergedProps = {
    ...blockDef.defaultProps,
    ...block.properties,
    isSelected,
    onClick,
    onPropertyChange,
    disabled
  };

  return (
    <Suspense fallback={<BlockLoadingSkeleton />}>
      <div className={`block-wrapper ${isSelected ? 'selected' : ''}`}>
        <Component {...mergedProps} />
      </div>
    </Suspense>
  );
};

export default UniversalBlockRendererV2;
