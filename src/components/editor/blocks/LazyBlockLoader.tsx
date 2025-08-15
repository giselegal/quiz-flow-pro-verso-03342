// @ts-nocheck
import { lazy, ComponentType, ReactNode, Suspense, useState, useEffect } from 'react';
import { Block } from '@/types/editor';
import { SimpleBlockFallback } from './ProductionBlockBoundary';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * 🚀 LAZY BLOCK LOADER - SISTEMA DE CARREGAMENTO OTIMIZADO
 *
 * Carrega componentes sob demanda para otimizar performance
 * - Lazy loading automático
 * - Skeletons durante carregamento
 * - Cache inteligente
 * - Fallbacks robustos
 */

interface LazyBlockProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  [key: string]: any;
}

// Cache de componentes carregados
const componentCache = new Map<string, ComponentType<any>>();

// Mapeamento de componentes para lazy loading
const LAZY_COMPONENTS = {
  // ACTION COMPONENTS
  'advanced-cta': () => lazy(() => import('@/components/editor/blocks/AdvancedCTABlock')),
  'advanced-cta-inline': () =>
    lazy(() => import('@/components/editor/blocks/AdvancedCTAInlineBlock')),
  button: () => lazy(() => import('@/components/editor/blocks/ButtonBlock')),
  'button-inline': () => lazy(() => import('@/components/editor/blocks/ButtonInlineBlock')),
  'cta-inline': () => lazy(() => import('@/components/editor/blocks/CTAInlineBlock')),
  'cta-section-inline': () =>
    lazy(() => import('@/components/editor/blocks/CTASectionInlineBlock')),
  'final-cta': () => lazy(() => import('@/components/editor/blocks/FinalCTABlock')),
  'final-value-proposition-inline': () =>
    lazy(() => import('@/components/editor/blocks/FinalValuePropositionInlineBlock')),
  'secure-purchase': () => lazy(() => import('@/components/editor/blocks/SecurePurchaseBlock')),

  // TEXT COMPONENTS
  'basic-text': () => lazy(() => import('@/components/editor/blocks/BasicTextBlock')),
  'heading-inline': () => lazy(() => import('@/components/editor/blocks/HeadingInlineBlock')),
  'rich-text': () => lazy(() => import('@/components/editor/blocks/RichTextBlock')),
  text: () => lazy(() => import('@/components/editor/blocks/TextBlock')),
  'text-inline': () => lazy(() => import('@/components/editor/blocks/TextInlineBlock')),

  // QUIZ COMPONENTS
  'quiz-intro-header': () => lazy(() => import('@/components/editor/blocks/QuizIntroHeaderBlock')),
  'quiz-question': () => lazy(() => import('@/components/editor/blocks/QuizQuestionBlock')),
  'quiz-option': () => lazy(() => import('@/components/editor/blocks/QuizOptionBlock')),
  'quiz-progress': () => lazy(() => import('@/components/editor/blocks/QuizProgressBlock')),
  'quiz-result-header': () =>
    lazy(() => import('@/components/editor/blocks/QuizResultHeaderBlock')),
  'options-grid': () => lazy(() => import('@/components/editor/blocks/OptionsGridBlock')),

  // MEDIA COMPONENTS
  image: () => lazy(() => import('@/components/editor/blocks/ImageBlock')),
  'image-inline': () => lazy(() => import('@/components/editor/blocks/ImageInlineBlock')),
  video: () => lazy(() => import('@/components/editor/blocks/VideoBlock')),
  'video-player': () => lazy(() => import('@/components/editor/blocks/VideoPlayerBlock')),

  // LAYOUT COMPONENTS
  spacer: () => lazy(() => import('@/components/editor/blocks/SpacerBlock')),
  'spacer-inline': () => lazy(() => import('@/components/editor/blocks/SpacerInlineBlock')),
  'section-divider': () => lazy(() => import('@/components/editor/blocks/SectionDividerBlock')),

  // PRICING COMPONENTS
  'pricing-inline': () => lazy(() => import('@/components/editor/blocks/PricingInlineBlock')),
  'price-comparison': () => lazy(() => import('@/components/editor/blocks/PriceComparisonBlock')),
  'dynamic-pricing': () => lazy(() => import('@/components/editor/blocks/DynamicPricingBlock')),

  // SOCIAL PROOF COMPONENTS
  'testimonial-inline': () =>
    lazy(() => import('@/components/editor/blocks/TestimonialInlineBlock')),
  testimonials: () => lazy(() => import('@/components/editor/blocks/TestimonialsBlock')),

  // FAQ COMPONENTS
  faq: () => lazy(() => import('@/components/editor/blocks/FAQBlock')),
  'faq-section': () => lazy(() => import('@/components/editor/blocks/FAQSectionBlock')),

  // URGENCY COMPONENTS
  'countdown-timer': () => lazy(() => import('@/components/editor/blocks/CountdownTimerBlock')),
  'urgency-timer': () => lazy(() => import('@/components/editor/blocks/UrgencyTimerBlock')),

  // FEEDBACK COMPONENTS
  'progress-inline': () => lazy(() => import('@/components/editor/blocks/ProgressInlineBlock')),
  loader: () => lazy(() => import('@/components/editor/blocks/LoaderBlock')),

  // FORMS COMPONENTS
  'form-input': () => lazy(() => import('@/components/editor/blocks/FormInputBlock')),
  'form-container': () => lazy(() => import('@/components/editor/blocks/FormContainerBlock')),
  'lead-form': () => lazy(() => import('@/components/editor/blocks/LeadFormBlock')),

  // ANALYTICS COMPONENTS
  'chart-area': () => lazy(() => import('@/components/editor/blocks/ChartAreaBlock')),
  'stats-metrics': () => lazy(() => import('@/components/editor/blocks/StatsMetricsBlock')),
} as const;

// Skeleton personalizado para diferentes tipos de componentes
const getLoadingSkeleton = (blockType: string): ReactNode => {
  if (blockType.includes('text') || blockType.includes('heading')) {
    return (
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (blockType.includes('button') || blockType.includes('cta')) {
    return (
      <div className="p-4 flex justify-center">
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    );
  }

  if (blockType.includes('image') || blockType.includes('video')) {
    return (
      <div className="p-4">
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (blockType.includes('quiz')) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-6 w-2/3" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
        </div>
      </div>
    );
  }

  // Skeleton genérico
  return (
    <div className="p-4">
      <Skeleton className="h-20 w-full rounded-lg" />
    </div>
  );
};

/**
 * Carrega componente de forma lazy com cache
 */
export const loadLazyComponent = async (
  blockType: string
): Promise<ComponentType<LazyBlockProps> | null> => {
  // Verificar cache primeiro
  if (componentCache.has(blockType)) {
    return componentCache.get(blockType)!;
  }

  // Verificar se existe lazy loader para o tipo
  const lazyLoader = LAZY_COMPONENTS[blockType as keyof typeof LAZY_COMPONENTS];
  if (!lazyLoader) {
    console.warn(`⚠️ Lazy loader não encontrado para: ${blockType}`);
    return null;
  }

  try {
    const LazyComponent = lazyLoader();
    const LoadedComponent = await LazyComponent;
    const Component = LoadedComponent.default || LoadedComponent;

    // Adicionar ao cache
    componentCache.set(blockType, Component);

    return Component;
  } catch (error) {
    console.error(`❌ Erro ao carregar componente lazy ${blockType}:`, error);
    return null;
  }
};

/**
 * Wrapper para componente lazy com Suspense
 */
export const LazyBlockWrapper: React.FC<LazyBlockProps> = props => {
  const { block } = props;
  const blockType = block.type;

  // Se não tem lazy loader, retorna fallback
  if (!LAZY_COMPONENTS[blockType as keyof typeof LAZY_COMPONENTS]) {
    return (
      <SimpleBlockFallback
        blockType={blockType}
        blockId={block.id}
        message="Componente não disponível para lazy loading"
      />
    );
  }

  const LazyComponent = LAZY_COMPONENTS[blockType as keyof typeof LAZY_COMPONENTS]();

  return (
    <Suspense fallback={getLoadingSkeleton(blockType)}>
      <LazyComponent block={block} {...props} />
    </Suspense>
  );
};

/**
 * Sistema de preload inteligente
 * Precarrega componentes baseado no uso
 */
export const preloadPopularComponents = () => {
  const popularComponents = [
    'text-inline',
    'heading-inline',
    'button-inline',
    'image-inline',
    'spacer-inline',
    'quiz-question',
    'quiz-option',
  ];

  popularComponents.forEach(async componentType => {
    try {
      await loadLazyComponent(componentType);
      console.log(`✅ Preloaded: ${componentType}`);
    } catch (error) {
      console.warn(`⚠️ Failed to preload: ${componentType}`, error);
    }
  });
};

/**
 * Hook para usar lazy loading
 */
export const useLazyComponent = (blockType: string) => {
  const [component, setComponent] = useState<ComponentType<LazyBlockProps> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadComponent = async () => {
      try {
        setLoading(true);
        setError(null);

        const comp = await loadLazyComponent(blockType);

        if (isMounted) {
          setComponent(comp);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadComponent();

    return () => {
      isMounted = false;
    };
  }, [blockType]);

  return { component, loading, error };
};

export default LazyBlockWrapper;
