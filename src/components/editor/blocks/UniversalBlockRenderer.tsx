import React, { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { getEnhancedBlockComponent } from '@/components/editor/blocks/enhancedBlockRegistry';
import { blockRendererDebug } from '@/components/editor/debug/BlockRendererDebug';
import { cacheManager } from '@/utils/cache/LRUCache';
import { useLogger } from '@/utils/logger/SmartLogger';

// Importações diretas para componentes críticos (performance)
import QuizIntroHeaderBlock from './QuizIntroHeaderBlock';
import OptionsGridBlock from './OptionsGridBlock';
import TextInlineBlock from './TextInlineBlock';
import ButtonInlineBlock from './ButtonInlineBlock';
import { FashionAIGeneratorBlock } from '@/components/blocks/ai';
import MentorSectionInlineBlock from './MentorSectionInlineBlock';
import TestimonialCardInlineBlock from './TestimonialCardInlineBlock';
import TestimonialsCarouselInlineBlock from './TestimonialsCarouselInlineBlock';

// Importações adicionais de quiz components
import QuizQuestionBlock from './QuizQuestionBlock';
import QuizOptionBlock from './QuizOptionBlock';
import QuizHeaderBlock from './QuizHeaderBlock';
import QuizTitleBlock from './QuizTitleBlock';
import FormInputBlock from './FormInputBlock';
import QuizOptionsGridBlock from '@/components/blocks/quiz/QuizOptionsGridBlock';

// Importações dos componentes Step20
import {
  Step20ResultHeaderBlock,
  Step20StyleRevealBlock,
  Step20UserGreetingBlock,
  Step20CompatibilityBlock,
  Step20SecondaryStylesBlock,
  Step20PersonalizedOfferBlock
} from './Step20ModularBlocks';

// ✅ HÍBRIDO: Componente de cálculo de resultado (Step 20)
import { default as ResultCalculationSection } from '@/components/blocks/ResultCalculationSection';

// ✅ FASE 3A: Importações dos novos componentes inline
import ImageDisplayInlineBlock from '@/components/blocks/inline/ImageDisplayInlineBlock';
import DecorativeBarInlineBlock from '@/components/blocks/inline/DecorativeBarInlineBlock';
import LeadFormBlock from '@/components/blocks/inline/LeadFormBlock';
import ResultCardInlineBlock from '@/components/blocks/inline/ResultCardInlineBlock';
import ResultDisplayBlock from '@/components/blocks/inline/ResultDisplayBlock';
import LoadingAnimationBlock from '@/components/blocks/inline/LoadingAnimationBlock';
import SpinnerBlock from '@/components/blocks/inline/SpinnerBlock';
import OfferHeaderInlineBlock from '@/components/blocks/inline/OfferHeaderInlineBlock';
import OfferHeroSectionInlineBlock from '@/components/blocks/inline/OfferHeroSectionInlineBlock';
import BenefitsInlineBlock from '@/components/blocks/inline/BenefitsInlineBlock';
import TestimonialsInlineBlock from '@/components/blocks/inline/TestimonialsInlineBlock';
import QuizOfferPricingInlineBlock from '@/components/blocks/inline/QuizOfferPricingInlineBlock';
import OfferFaqSectionInlineBlock from '@/components/blocks/inline/OfferFaqSectionInlineBlock';
import QuizOfferCTAInlineBlock from '@/components/blocks/inline/QuizOfferCTAInlineBlock';

export interface UniversalBlockRendererProps {
  block: Block;
  isSelected?: boolean;
  isPreviewing?: boolean;
  mode?: 'editor' | 'preview' | 'production';
  onUpdate?: (blockId: string, updates: any) => void;
  onDelete?: (blockId: string) => void;
  onSelect?: (blockId: string) => void;
  onPropertyChange?: (key: any, value: any) => void;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

// ✅ CACHE PARA DADOS DE RENDERIZAÇÃO
const renderCache = cacheManager.getCache('render');

// ✅ CACHE PARA COMPONENTES RESOLVIDOS
const componentCache = cacheManager.getCache('components');

interface BlockRenderData {
  timestamp: number;
  renderTime: number;
  blockType: string;
  isSelected: boolean;
}

const createFallbackComponent = (type: string) => {
  return (props: any) => {
    const { isSelected, isPreviewing, onUpdate, block, ...domProps } = props;

    return (
      <div
        {...domProps}
        className={cn("p-4 border border-gray-300 rounded", domProps.className)}
      >
        <div className="text-sm text-gray-600">
          {type === 'text' && (block?.content?.text || block?.content?.content || 'Texto')}
          {type === 'headline' && (block?.content?.text || 'Título')}
          {type === 'image' && 'Imagem'}
          {type === 'button' && (block?.content?.text || 'Botão')}
          {type === 'form' && 'Formulário'}
          {type === 'spacer' && ''}
          {type === 'container' && 'Container'}
        </div>
      </div>
    );
  };
};

const BlockComponentRegistry: Record<string, React.FC<any>> = {
  'quiz-intro-header': QuizIntroHeaderBlock,
  'quiz-question': QuizQuestionBlock,
  'quiz-option': QuizOptionBlock,
  'quiz-options': QuizOptionsGridBlock,
  'quiz-header': QuizHeaderBlock,
  'quiz-title': QuizTitleBlock,
  'options-grid': OptionsGridBlock,
  'text-inline': TextInlineBlock,
  'button-inline': ButtonInlineBlock,
  'form-input': FormInputBlock,
  'fashion-ai-generator': FashionAIGeneratorBlock,
  'mentor-section-inline': MentorSectionInlineBlock,
  'testimonial-card-inline': TestimonialCardInlineBlock,
  'testimonials-carousel-inline': TestimonialsCarouselInlineBlock,
  // Step20 Components
  'step20-result-header': Step20ResultHeaderBlock,
  'step20-style-reveal': Step20StyleRevealBlock,
  'step20-user-greeting': Step20UserGreetingBlock,
  'step20-compatibility': Step20CompatibilityBlock,
  'step20-secondary-styles': Step20SecondaryStylesBlock,
  'step20-personalized-offer': Step20PersonalizedOfferBlock,
  'step20-complete-template': Step20ResultHeaderBlock, // TODO: se quiser renderização compacta usar Step20CompleteTemplateBlock diretamente em outro fluxo
  // ✅ HÍBRIDO: Componente de cálculo de resultado (Step 20)
  'result-calculation': ResultCalculationSection,
  // ✅ FASE 3A: Componentes inline específicos
  'image-display-inline': ImageDisplayInlineBlock,
  'decorative-bar-inline': DecorativeBarInlineBlock,
  'lead-form': LeadFormBlock,
  'result-card-inline': ResultCardInlineBlock,
  'result-display': ResultDisplayBlock,
  'loading-animation': LoadingAnimationBlock,
  'spinner': SpinnerBlock,
  // ✅ FASE 3A: Componentes de Offer
  'offer-header': OfferHeaderInlineBlock,
  'offer-hero-section': OfferHeroSectionInlineBlock,
  'offer-benefits-list': BenefitsInlineBlock,
  'offer-testimonials': TestimonialsInlineBlock,
  'offer-pricing-table': QuizOfferPricingInlineBlock,
  'offer-faq-section': OfferFaqSectionInlineBlock,
  'offer-cta-section': QuizOfferCTAInlineBlock,
  // Fallbacks para tipos básicos
  'text': createFallbackComponent('text'),
  'headline': createFallbackComponent('headline'),
  'image': createFallbackComponent('image'),
  'button': createFallbackComponent('button'),
  'form': createFallbackComponent('form'),
  'spacer': createFallbackComponent('spacer'),
  'container': createFallbackComponent('container'),
  // Suporte a tipos genéricos de quiz e funnel
  'quiz': createFallbackComponent('quiz'),
  'funnel': createFallbackComponent('funnel')
};

// ✅ HOOK OTIMIZADO PARA RECUPERAÇÃO DE COMPONENTES
const useBlockComponent = (blockType: string): React.ComponentType<any> | null => {
  const logger = useLogger('BlockComponent');

  return useMemo(() => {
    // Verificar cache primeiro
    const cached = componentCache.get(blockType);
    if (cached) {
      logger.debug(`Cache hit para componente: ${blockType}`);
      return cached as React.ComponentType<any>;
    }

    logger.debug(`Resolvendo componente: ${blockType}`);

    // Tentar registry direto primeiro (performance crítica)
    let component = BlockComponentRegistry[blockType];

    if (!component) {
      // Fallback para enhanced registry - converter para React.FC
      const enhancedComponent = getEnhancedBlockComponent(blockType);
      if (enhancedComponent) {
        component = enhancedComponent as React.FC<any>;
      }
    }

    if (component) {
      // Cachear componente resolvido
      componentCache.set(blockType, component);
      logger.debug(`Componente ${blockType} cacheado com sucesso`);
      return component as React.ComponentType<any>;
    } else {
      logger.warn(`Componente não encontrado: ${blockType}`, {
        availableInRegistry: Object.keys(BlockComponentRegistry),
        availableInEnhanced: 'check EnhancedBlockRegistry'
      });
    }

    return null;
  }, [blockType, logger]);
};

const UniversalBlockRenderer: React.FC<UniversalBlockRendererProps> = memo(({
  block,
  isSelected = false,
  isPreviewing = false,
  onUpdate,
  onDelete,
  onSelect,
  className,
  style,
  onClick,
}) => {
  const logger = useLogger('BlockRenderer');

  // ✅ MONITORAMENTO DE PERFORMANCE
  const renderStartTime = React.useRef<number>();

  React.useEffect(() => {
    renderStartTime.current = performance.now();
  });

  // ✅ OTIMIZAÇÃO: Usar hook cacheado ao invés de lookup direto
  const BlockComponent = useBlockComponent(block.type);

  React.useEffect(() => {
    if (!renderStartTime.current) return;
    const renderTime = performance.now() - renderStartTime.current;

    // Sample rate: só registra 1 a cada N renders por bloco para reduzir ruído
    const SAMPLE_RATE = 10; // 10%
    const shouldSample = (Math.abs(hashCode(block.id)) % 100) < SAMPLE_RATE;

    if (shouldSample) {
      const now = Date.now();
      const renderData: BlockRenderData = {
        timestamp: now,
        renderTime,
        blockType: block.type,
        isSelected
      };
      // LRU já limita tamanho, mas ainda assim evitar explosão de chaves
      renderCache.set(`${block.id}-${now % 10_000}`, renderData);

      blockRendererDebug.logRender({
        blockType: block.type,
        blockId: block.id,
        renderTime,
        timestamp: now,
        isSelected,
        isPreviewing,
        hasComponent: !!BlockComponent
      });
    }

    if (renderTime > 50) {
      logger.warn(`Slow render: ${block.type}`, {
        blockId: block.id,
        renderTime: `${renderTime.toFixed(2)}ms`,
        isSelected,
        isPreviewing
      });
    }
  });

  function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
  }

  // ✅ LOG DE RENDERIZAÇÃO (apenas em desenvolvimento)
  React.useEffect(() => {
    logger.render(`UniversalBlockRenderer[${block.type}]`, {
      blockId: block.id,
      isSelected,
      isPreviewing,
      hasComponent: !!BlockComponent
    });
  }, [block.type, block.id, BlockComponent, isSelected, isPreviewing, logger]);

  // ✅ OTIMIZAÇÃO: Memoizar handlers com dependências estáveis
  const handleUpdate = React.useMemo(() =>
    onUpdate ? (updates: any) => onUpdate(block.id, updates) : undefined
    , [block.id, onUpdate]);

  const handleClick = React.useMemo(() => {
    if (onSelect) {
      return () => onSelect(block.id);
    } else if (onClick) {
      return onClick;
    }
    return undefined;
  }, [block.id, onSelect, onClick]);

  if (!BlockComponent) {
    // Log detalhado para debug
    logger.error(`Componente não encontrado`, {
      blockType: block.type,
      blockId: block.id,
      availableInCache: Array.from(componentCache.keys()),
      availableInRegistry: Object.keys(BlockComponentRegistry)
    });

    return (
      <div
        className={cn(
          "p-4 border-2 border-dashed border-red-300 bg-red-50 rounded",
          className
        )}
        style={style}
        onClick={!isPreviewing ? handleClick : undefined}
        data-block-id={block.id}
        data-block-type={block.type}
      >
        <div className="text-sm text-red-700 font-medium mb-2">
          ⚠️ Componente não encontrado: {block.type}
        </div>
        <div className="text-xs text-red-600 mb-2">
          ID: {block.id}
        </div>
        <div className="text-xs text-red-500">
          Verifique se o componente está registrado no EnhancedBlockRegistry
        </div>
        {!isPreviewing && (
          <button
            onClick={() => {
              const cacheStats = componentCache.getStats();
              logger.info('Debug info:', {
                blockType: block.type,
                blockId: block.id,
                blockContent: block.content,
                blockProperties: block.properties,
                availableComponents: Object.keys(BlockComponentRegistry),
                cacheStats: cacheStats
              });
            }}
            className="mt-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
          >
            Debug Info
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'universal-block-renderer relative group transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        !isPreviewing && 'hover:shadow-sm cursor-pointer',
        className
      )}
      style={style}
      onClick={!isPreviewing ? handleClick : undefined}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {!isPreviewing && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(block.id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          ×
        </button>
      )}

      {!isPreviewing && isSelected && (
        <div className="absolute top-0 left-0 -mt-6 text-xs bg-blue-500 text-white px-2 py-1 rounded z-10">
          {block.type} #{block.id}
        </div>
      )}

      {/* ✅ RENDERIZAÇÃO COM ERROR BOUNDARY E LOGGING */}
      <React.Suspense
        fallback={
          <div className="p-4 bg-gray-100 rounded animate-pulse">
            <div className="text-sm text-gray-600">
              🔄 Carregando componente: {block.type}
            </div>
          </div>
        }
      >
        <ErrorBoundary blockType={block.type} blockId={block.id}>
          {BlockComponent && (
            <BlockComponent
              block={block}
              isSelected={isSelected}
              isPreviewing={isPreviewing}
              onUpdate={handleUpdate}
            />
          )}
        </ErrorBoundary>
      </React.Suspense>
    </div>
  );
});

// ✅ ERROR BOUNDARY PARA COMPONENTES
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; blockType: string; blockId: string },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; blockType: string; blockId: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`🚨 Erro ao renderizar componente ${this.props.blockType}:`, {
      blockType: this.props.blockType,
      blockId: this.props.blockId,
      error: error.message,
      stack: error.stack,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border-2 border-dashed border-red-400 bg-red-50 rounded">
          <div className="text-sm text-red-700 font-medium mb-2">
            💥 Erro na renderização: {this.props.blockType}
          </div>
          <div className="text-xs text-red-600 mb-2">
            ID: {this.props.blockId}
          </div>
          <div className="text-xs text-red-500">
            {this.state.error?.message || 'Erro desconhecido'}
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: undefined });
              console.log('🔄 Tentando renderizar novamente:', this.props.blockType);
            }}
            className="mt-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
          >
            🔄 Tentar Novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

UniversalBlockRenderer.displayName = 'UniversalBlockRenderer';

export { UniversalBlockRenderer };
export default UniversalBlockRenderer;
