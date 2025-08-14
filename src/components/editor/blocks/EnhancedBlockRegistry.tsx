// @ts-nocheck
import React, { lazy, Suspense } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// Skeleton simples inline
const BlockLoadingSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div style={{ backgroundColor: '#E5DDD5' }}>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
        <div className="h-3 bg-gray-300 rounded w-4/6"></div>
      </div>
    </div>
  </div>
);

// Simple inline fallback component for missing blocks
const InlineFallbackBlock: React.FC<{
  block: any;
  blockType?: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}> = ({ block, blockType, isSelected = false, onClick, className = '' }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={cn(
        // Layout base
        'w-full min-h-[80px] p-4 rounded-lg border-2 border-dashed transition-all duration-200',
        // Estados visuais
        'border-stone-300 bg-stone-50 hover:bg-stone-100',
        isSelected && 'border-yellow-500 bg-stone-100 ring-2 ring-yellow-200',
        // Cursor
        'cursor-pointer',
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-stone-600" />
        </div>
        <div className="flex-grow">
          <h4 className="text-sm font-semibold text-stone-700 mb-1">Componente não encontrado</h4>
          <p className="text-xs text-stone-700 mb-2">
            Tipo:{' '}
            <code className="bg-stone-200 px-1 rounded">
              {blockType || block.type || 'unknown'}
            </code>
          </p>
          <div className="flex items-center space-x-2 text-xs text-stone-600">
            <Info className="w-3 h-3" />
            <span>Clique para configurar no painel de propriedades →</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 📦 ENHANCED BLOCK REGISTRY - Sistema Unificado de Componentes
// Baseado na auditoria: 191 arquivos, 157 blocks, 70 inline components

// ⚡ LAZY LOADING - Performance Optimization
export const ENHANCED_BLOCK_REGISTRY = {
  // 🎯 BLOCKS BÁSICOS
  text: lazy(() => import('./TextBlock')),
  'text-inline': lazy(() => import('./TextInlineBlock')),
  'heading-inline': lazy(() => import('./HeadingInlineBlock')),
  image: lazy(() => import('./ImageBlock')),
  'image-display-inline': lazy(() => import('./ImageDisplayInline')),
  button: lazy(() => import('./ButtonBlock')),
  'button-inline': lazy(() => import('./ButtonInlineBlock')),
  spacer: lazy(() => import('./SpacerBlock')),
  'spacer-inline': lazy(() => import('./SpacerInlineBlock')),
  alert: lazy(() => import('./AlertBlock')),

  // 🧠 BLOCKS DE QUIZ
  'quiz-question': lazy(() => import('../quiz/QuizQuestionBlock')),
  'quiz-progress': lazy(() => import('./QuizProgressBlock')),
  'quiz-result-calculated': lazy(() => import('./QuizResultCalculatedBlock')),
  'quiz-start-page': lazy(() => import('./QuizStartPageBlock')),
  'quiz-transition': lazy(() => import('./QuizTransitionBlock')),
  'quiz-title': lazy(() => import('./QuizTitleBlock')),
  'quiz-intro-header': lazy(() => import('./QuizIntroHeaderBlock')),
  'vertical-canvas-header': lazy(() => import('./VerticalCanvasHeaderBlock')),
  'options-grid': lazy(() => import('./OptionsGridBlock')),

  // 💰 BLOCKS DE VENDAS E OFERTA
  'pricing-inline': lazy(() => import('./PricingInlineBlock')),
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
  'secondary-styles': lazy(() => import('./QuizResultSecondaryStylesBlock')),
  carousel: lazy(() => import('./CarouselBlock')),
  'product-carousel': lazy(() => import('./ProductCarouselBlock')),
  bonus: lazy(() => import('./BonusBlock')),

  // 💬 BLOCKS DE CREDIBILIDADE
  testimonials: lazy(() => import('./TestimonialsBlock')),
  'testimonials-grid': lazy(() => import('./TestimonialsGridBlock')),
  'testimonials-real-inline': lazy(() => import('./TestimonialsRealInlineBlock')),
  'testimonial-inline': lazy(() => import('./TestimonialInlineBlock')),
  'social-proof': lazy(() => import('./SocialProofBlock')),

  // ✅ BLOCKS DE GARANTIA E VALOR
  guarantee: lazy(() => import('./GuaranteeBlock')),
  'guarantee-inline': lazy(() => import('./GuaranteeInlineBlock')),
  benefits: lazy(() => import('./BenefitsListBlock')),
  'value-stack': lazy(() => import('./ValueStackBlock')),
  'value-stack-inline': lazy(() => import('./ValueStackInlineBlock')),
  'value-anchoring': lazy(() => import('./ValueAnchoringBlock')),
  'bonus-inline': lazy(() => import('./BonusInlineBlock')),

  // 🎯 BLOCKS DE CTA E AÇÃO
  cta: lazy(() => import('./CTAInlineBlock')),
  'cta-section-inline': lazy(() => import('./CTASectionInlineBlock')),
  'advanced-cta': lazy(() => import('./AdvancedCTABlock')),
  'advanced-cta-inline': lazy(() => import('./AdvancedCTAInlineBlock')),
  'final-cta': lazy(() => import('./FinalCTABlock')),
  'final-value-proposition-inline': lazy(() => import('./FinalValuePropositionInlineBlock')),

  // 📊 BLOCKS DE ESTATÍSTICAS E MÉTRICAS
  'stats-metrics': lazy(() => import('./StatsMetricsBlock')),
  'stat-inline': lazy(() => import('./StatInlineBlock')),
  'animated-stat-counter': lazy(() => import('./AnimatedStatCounterBlock')),
  'chart-level': lazy(() => import('./ChartLevelBlock')),
  'progress-inline': lazy(() => import('./ProgressInlineBlock')),
  'progress-bar-step': lazy(() => import('./ProgressBarStepBlock')),

  // ⏰ BLOCKS DE URGÊNCIA E TEMPO
  countdown: lazy(() => import('./CountdownTimerBlock')),
  'urgency-timer': lazy(() => import('./UrgencyTimerBlock')),
  'urgency-timer-inline': lazy(() => import('./UrgencyTimerInlineBlock')),
  loader: lazy(() => import('./LoaderBlock')),
  'loader-inline': lazy(() => import('./LoaderInlineBlock')),

  // 🎬 BLOCKS DE MÍDIA
  'video-player-inline': lazy(() => import('./VideoPlayerInlineBlock')),
  'audio-player-inline': lazy(() => import('./AudioPlayerInlineBlock')),

  // ❓ BLOCKS DE CONTEÚDO
  faq: lazy(() => import('./FAQBlock')),
  'faq-section': lazy(() => import('./FAQSectionBlock')),
  'faq-section-inline': lazy(() => import('./FAQSectionInlineBlock')),
  quote: lazy(() => import('./QuoteBlock')),
  'rich-text': lazy(() => import('./RichTextBlock')),
  list: lazy(() => import('./ListBlock')),

  // 🏷️ BLOCKS DE INTERFACE
  'badge-inline': lazy(() => import('./BadgeInlineBlock')),
  'notification-inline': lazy(() => import('./NotificationInlineBlock')),
  'section-divider': lazy(() => import('./SectionDividerBlock')),
  'decorative-bar-inline': lazy(() => import('./DecorativeBarInlineBlock')),

  // 🔍 BLOCKS DE COMPARAÇÃO
  comparison: lazy(() => import('./CompareBlock')),
  'comparison-inline': lazy(() => import('./ComparisonInlineBlock')),
  'comparison-table': lazy(() => import('./ComparisonTableBlock')),
  'comparison-table-inline': lazy(() => import('./ComparisonTableInlineBlock')),
  'before-after': lazy(() => import('./BeforeAfterBlock')),
  'before-after-inline': lazy(() => import('./BeforeAfterInlineBlock')),
  'pros-cons': lazy(() => import('./ProsConsBlock')),

  // 🎉 BLOCKS ESPECIAIS
  confetti: lazy(() => import('./ConfettiBlock')),
  marquee: lazy(() => import('./MarqueeBlock')),
  script: lazy(() => import('./ScriptBlock')),

  // 🏆 BLOCKS DE RESULTADO
  'result-header': lazy(() => import('./ResultHeaderBlock')),
  'result-header-inline': lazy(() => import('./ResultHeaderInlineBlock')),
  'result-page-header': lazy(() => import('./ResultPageHeaderBlock')),
  'result-description': lazy(() => import('./ResultDescriptionBlock')),
  'modern-result-page': lazy(() => import('./ModernResultPageBlock')),
  'quiz-result-header': lazy(() => import('./QuizResultHeaderBlock')),
  'quiz-result-main-card': lazy(() => import('./QuizResultMainCardBlock')),

  // 💼 BLOCKS DE PRODUTO
  'product-offer': lazy(() => import('./ProductOfferBlock')),
  mentor: lazy(() => import('./MentorBlock')),
  'mentor-section-inline': lazy(() => import('./MentorSectionInlineBlock')),

  // 📝 BLOCKS DE FORMULÁRIO
  'form-input': lazy(() => import('./FormInputBlock')),
  terms: lazy(() => import('./TermsBlock')),
  'legal-notice-inline': lazy(() => import('./LegalNoticeInlineBlock')),
  'secure-purchase': lazy(() => import('./SecurePurchaseBlock')),

  // 🎨 BLOCKS AVANÇADOS
  arguments: lazy(() => import('./ArgumentsBlock')),
  'strategic-question': lazy(() => import('./StrategicQuestionBlock')),
  'transformation-inline': lazy(() => import('./TransformationInlineBlock')),

  // 🔧 BLOCKS DE SISTEMA
  fallback: lazy(() => import('./FallbackBlock')),
  'enhanced-fallback': lazy(() => import('./EnhancedFallbackBlock')),
} as const;

// 📋 DEFINIÇÕES DE SCHEMA PARA PROPRIEDADES
export interface PropertySchema {
  key: string;
  type:
    | 'text'
    | 'textarea'
    | 'number'
    | 'boolean'
    | 'select'
    | 'color'
    | 'image'
    | 'array'
    | 'object'
    | 'rich-text';
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
  basico: {
    name: 'Básico',
    icon: '📝',
    description: 'Componentes fundamentais',
    color: '#B89B7A',
  },
  quiz: {
    name: 'Quiz',
    icon: '🧠',
    description: 'Elementos de quiz e questionários',
    color: '#B89B7A',
  },
  vendas: {
    name: 'Vendas',
    icon: '💰',
    description: 'Componentes de venda e pricing',
    color: '#10B981',
  },
  design: {
    name: 'Design',
    icon: '🎨',
    description: 'Layouts e elementos visuais',
    color: '#F59E0B',
  },
  credibilidade: {
    name: 'Credibilidade',
    icon: '💬',
    description: 'Depoimentos e prova social',
    color: '#aa6b5d',
  },
  cta: {
    name: 'Call to Action',
    icon: '🎯',
    description: 'Botões e chamadas para ação',
    color: '#06B6D4',
  },
  midia: {
    name: 'Mídia',
    icon: '🎬',
    description: 'Vídeo, áudio e imagens',
    color: '#84CC16',
  },
  metricas: {
    name: 'Métricas',
    icon: '📊',
    description: 'Estatísticas e gráficos',
    color: '#6366F1',
  },
  especiais: {
    name: 'Especiais',
    icon: '✨',
    description: 'Efeitos e componentes únicos',
    color: '#EC4899',
  },
  avancado: {
    name: 'Avançado',
    icon: '🚀',
    description: 'Componentes complexos',
    color: '#64748B',
  },
} as const;

// 🎯 DEFINIÇÕES COMPLETAS DE BLOCKS
export const BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
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
      timeLimit: 30,
    },
    schema: [
      {
        key: 'question',
        type: 'textarea',
        label: 'Pergunta',
        description: 'A pergunta principal do quiz',
        required: true,
      },
      {
        key: 'options',
        type: 'array',
        label: 'Opções de Resposta',
        description: 'Lista de opções disponíveis',
      },
      {
        key: 'multiSelect',
        type: 'boolean',
        label: 'Múltipla Escolha',
        description: 'Permitir seleção de múltiplas opções',
      },
      {
        key: 'showTimer',
        type: 'boolean',
        label: 'Mostrar Timer',
        description: 'Exibir cronômetro para a pergunta',
      },
      {
        key: 'timeLimit',
        type: 'number',
        label: 'Tempo Limite (segundos)',
        description: 'Tempo máximo para responder',
        validation: { min: 5, max: 300 },
      },
    ],
    tags: ['quiz', 'pergunta', 'interativo'],
    isActive: true,
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
          rating: 5,
        },
      ],
      columns: 3,
      showRating: true,
    },
    schema: [
      {
        key: 'title',
        type: 'text',
        label: 'Título da Seção',
        required: true,
      },
      {
        key: 'testimonials',
        type: 'array',
        label: 'Depoimentos',
        description: 'Lista de depoimentos dos clientes',
      },
      {
        key: 'columns',
        type: 'select',
        label: 'Número de Colunas',
        options: [
          { value: '1', label: '1 Coluna' },
          { value: '2', label: '2 Colunas' },
          { value: '3', label: '3 Colunas' },
          { value: '4', label: '4 Colunas' },
        ],
        defaultValue: '3',
      },
      {
        key: 'showRating',
        type: 'boolean',
        label: 'Mostrar Avaliação',
        description: 'Exibir estrelas de avaliação',
      },
    ],
    tags: ['depoimentos', 'credibilidade', 'social-proof'],
    isActive: true,
  },
};

// 🔧 UTILITY FUNCTIONS
export function getBlockComponent(type: string): React.ComponentType<any> | null {
  const registry = ENHANCED_BLOCK_REGISTRY as Record<string, React.LazyExoticComponent<any>>;
  const component = registry[type];
  return component ? component as React.ComponentType<any> : null;
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
  return Object.values(BLOCK_DEFINITIONS).filter(
    block =>
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
  disabled = false,
}) => {
  const blockDef = getBlockDefinition(block.type);
  const Component = getBlockComponent(block.type);

  // Fallback para componentes não encontrados
  if (!Component || !blockDef) {
    return (
      <InlineFallbackBlock
        block={block}
        blockType={block.type}
        isSelected={isSelected}
        onClick={onClick}
      />
    );
  }

  // Merge default props com props do block
  const mergedProps = {
    ...blockDef.defaultProps,
    ...block.properties,
    block,
    isSelected,
    onClick,
    onPropertyChange,
    disabled,
  };

  return (
    <Suspense fallback={<BlockLoadingSkeleton />}>
      <div className={`block-wrapper ${isSelected ? 'selected' : ''}`}>
        <Component {...(mergedProps as any)} />
      </div>
    </Suspense>
  );
};

export default UniversalBlockRendererV2;
