import React, { memo, useMemo, Suspense } from 'react';
import { appLogger } from '@/utils/logger';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { blockRendererDebug } from '@/components/editor/debug/BlockRendererDebug';
import { cacheManager } from '@/utils/cache/LRUCache';
import { useLogger } from '@/utils/logger/SmartLogger';

// 🎯 UNIFIED BLOCK REGISTRY - Lazy loading com code splitting
import { unifiedBlockRegistry } from '@/registry/UnifiedBlockRegistry';

// 🔄 REMOVIDOS 90+ imports estáticos - Agora usa UnifiedBlockRegistry
// Todos os componentes são carregados via lazy loading ou cache do registry

export interface UniversalBlockRendererProps {
  block: Block;
  isSelected?: boolean;
  /**
   * @deprecated Use EditableBlock or PreviewBlock instead
   * Esta prop será removida na próxima versão
   */
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
        className={cn('p-4 border border-gray-300 rounded', domProps.className)}
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
  'quiz-options': OptionsGridBlock,
  'quiz-header': QuizHeaderBlock,
  'quiz-title': QuizTitleBlock,
  'options-grid': OptionsGridBlock,
  'options grid': OptionsGridBlock, // ✅ alias com espaço

  // Text & Heading
  'text-inline': TextInlineBlock,
  'heading-inline': HeadingInlineBlock,
  heading: HeadingInlineBlock,
  headline: HeadingInlineBlock,
  'headline-inline': HeadingInlineBlock,

  // Question blocks
  'question-navigation': QuestionNavigationBlock,
  'quiz-navigation': QuestionNavigationBlock,
  'question-progress': QuestionProgressBlock, // ✅ CORRIGIDO: usar componente específico
  'question-text': QuestionTextBlock,
  'question-title': QuestionTextBlock, // alias
  'question-number': QuestionNumberBlock,
  'question-instructions': QuestionInstructionsBlock,

  // Intro blocks
  'intro-form': IntroFormBlock,
  'intro-title': IntroTitleBlock,
  'intro-description': IntroDescriptionBlock,
  'intro-image': IntroImageBlock,
  'intro-logo': IntroLogoBlock,
  'intro-logo-header': IntroLogoHeaderBlock,

  // Buttons & CTA
  'button-inline': ButtonInlineBlock,
  'cta-inline': ButtonInlineBlock,
  'CTAButton': CTAButtonBlock,

  // Form
  'form-input': FormInputBlock,
  'image-inline': ImageInlineBlock,

  // Footer
  'footer-copyright': FooterCopyrightBlock,

  // Other components
  'fashion-ai-generator': FashionAIGeneratorBlock,
  'mentor-section-inline': MentorSectionInlineBlock,
  'testimonial-card-inline': TestimonialCardInlineBlock,
  testimonials: TestimonialsInlineBlock,
  'testimonials-carousel-inline': TestimonialsCarouselInlineBlock,

  // Sections (compatibilidade)
  'question-hero': QuestionHeroSection,
  'transition-hero': TransitionHeroSection,
  'result-congrats': ResultHeaderBlock, // alias
  'result-progress-bars': ResultSecondaryStylesBlock, // alias

  // Step20 Components
  'step20-result-header': Step20ResultHeaderBlock,
  'step20-style-reveal': Step20StyleRevealBlock,
  'step20-user-greeting': Step20UserGreetingBlock,
  'step20-compatibility': Step20CompatibilityBlock,
  'step20-secondary-styles': Step20SecondaryStylesBlock,
  'step20-personalized-offer': Step20PersonalizedOfferBlock,
  'step20-complete-template': Step20ResultHeaderBlock,

  // ✅ Result calculation
  'result-calculation': ResultCalculationSection,
  ResultCalculationSection,

  // ✅ Transition Blocks (Steps 12 & 19)
  'transition-title': TransitionTitleBlock,
  'transition-loader': TransitionLoaderBlock,
  'transition-text': TransitionTextBlock,
  'transition-progress': TransitionProgressBlock,
  'transition-message': TransitionMessageBlock,

  // ✅ Result Blocks (Step 20)
  'result-header': ResultHeaderBlock,
  'result-main': ResultMainBlock,
  'result-image': ResultImageBlock,
  'result-description': ResultDescriptionBlock,
  'result-characteristics': ResultCharacteristicsBlock,
  'result-cta': ResultCTABlock,
  'result-cta-primary': ResultCTAPrimaryBlock,
  'result-cta-secondary': ResultCTASecondaryBlock,
  'result-secondary-styles': ResultSecondaryStylesBlock,
  'result-style': ResultStyleBlock,
  'result-share': ResultShareBlock,

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
  'offer-hero': OfferHeroSectionInlineBlock,
  'offer-hero-section': OfferHeroSectionInlineBlock,
  'offer-benefits-list': BenefitsInlineBlock,
  'offer-testimonials': TestimonialsInlineBlock,
  'offer-pricing-table': QuizOfferPricingInlineBlock,
  'offer-faq-section': OfferFaqSectionInlineBlock,
  'offer-cta-section': QuizOfferCTAInlineBlock,
  pricing: QuizOfferPricingInlineBlock,
  guarantee: GuaranteeBlock,
  // Fallbacks para tipos básicos
  'text': createFallbackComponent('text'),
  'image': createFallbackComponent('image'),
  'button': createFallbackComponent('button'),
  'form': createFallbackComponent('form'),
  'spacer': createFallbackComponent('spacer'),
  'container': createFallbackComponent('container'),
  // Suporte a tipos genéricos de quiz e funnel
  'quiz': createFallbackComponent('quiz'),
  'funnel': createFallbackComponent('funnel'),
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
      const isValid = typeof enhancedComponent === 'function' || (typeof enhancedComponent === 'object' && enhancedComponent !== null && '$$typeof' in enhancedComponent);
      if (isValid) {
        component = enhancedComponent as React.FC<any>;
      } else {
        logger.error(`Enhanced registry retornou componente inválido para ${blockType}. Usando fallback de placeholder.`);
        component = BlockComponentRegistry['text'];
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
        availableInEnhanced: 'check EnhancedBlockRegistry',
      });
    }

    return null;
  }, [blockType, logger]);
};

const UniversalBlockRenderer: React.FC<UniversalBlockRendererProps> = memo(({
  block,
  isSelected = false,
  isPreviewing = false, // @deprecated - Use EditableBlock ou PreviewBlock
  onUpdate,
  onDelete,
  onSelect,
  className,
  style,
  onClick,
}) => {
  const logger = useLogger('BlockRenderer');
  // Garante ID seguro para logs, métricas e attributes mesmo quando houver dados incompletos em runtime
  const safeBlockId = (block && typeof (block as any).id === 'string') ? (block as any).id : '';

  // 🚨 DEPRECATION WARNING
  if (isPreviewing !== undefined && process.env.NODE_ENV === 'development') {
    appLogger.warn(
      '⚠️ DEPRECATION WARNING: A prop \'isPreviewing\' está deprecated.\n' +
      'Use EditableBlock para modo edição ou PreviewBlock para preview.\n' +
      `Block ID: ${block.id}, Type: ${block.type}`,
    );
  }

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
    const shouldSample = (Math.abs(hashCode(safeBlockId)) % 100) < SAMPLE_RATE;

    if (shouldSample) {
      const now = Date.now();
      const renderData: BlockRenderData = {
        timestamp: now,
        renderTime,
        blockType: block.type,
        isSelected,
      };
      // LRU já limita tamanho, mas ainda assim evitar explosão de chaves
      renderCache.set(`${safeBlockId}-${now % 10_000}`, renderData);

      blockRendererDebug.logRender({
        blockType: block.type,
        blockId: safeBlockId,
        renderTime,
        timestamp: now,
        isSelected,
        isPreviewing,
        hasComponent: !!BlockComponent,
      });
    }

    if (renderTime > 50) {
      logger.warn(`Slow render: ${block.type}`, {
        blockId: block.id,
        renderTime: `${renderTime.toFixed(2)}ms`,
        isSelected,
        isPreviewing,
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
      blockId: safeBlockId,
      isSelected,
      isPreviewing,
      hasComponent: !!BlockComponent,
    });
  }, [block.type, safeBlockId, BlockComponent, isSelected, isPreviewing, logger]);

  // ✅ OTIMIZAÇÃO: Memoizar handlers com dependências estáveis
  const handleUpdate = React.useMemo(() =>
    onUpdate ? (updates: any) => onUpdate(safeBlockId, updates) : undefined
    , [safeBlockId, onUpdate]);

  const handleClick = React.useMemo(() => {
    if (onSelect) {
      return () => onSelect(safeBlockId);
    } else if (onClick) {
      return onClick;
    }
    return undefined;
  }, [safeBlockId, onSelect, onClick]);

  if (!BlockComponent) {
    // Log detalhado para debug
    logger.error('Componente não encontrado', {
      blockType: block.type,
      blockId: safeBlockId,
      availableInCache: Array.from(componentCache.keys()),
      availableInRegistry: Object.keys(BlockComponentRegistry),
    });

    return (
      <div
        className={cn(
          'p-4 border-2 border-dashed border-red-300 bg-red-50 rounded',
          className,
        )}
        style={style}
        onClick={!isPreviewing ? handleClick : undefined}
        data-block-id={safeBlockId}
        data-block-type={block.type}
      >
        <div className="text-sm text-red-700 font-medium mb-2">
          ⚠️ Componente não encontrado: {block.type}
        </div>
        <div className="text-xs text-red-600 mb-2">
          ID: {safeBlockId}
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
                cacheStats,
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

  // 🎯 MODO DE OPERAÇÃO: Determinar baseado em isPreviewing (legacy)
  const isEditMode = !isPreviewing;

  return (
    <div
      className={cn(
        'universal-block-renderer relative group transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        isEditMode && 'hover:shadow-sm cursor-pointer',
        className,
      )}
      style={style}
      onClick={isEditMode ? handleClick : undefined}
      data-block-id={safeBlockId}
      data-block-type={block.type}
    >
      {/* 🎯 CONTROLES DE EDIÇÃO - Apenas em modo edição */}
      {isEditMode && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(safeBlockId);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          ×
        </button>
      )}

      {isEditMode && isSelected && (
        <div className="absolute top-0 left-0 -mt-6 text-xs bg-blue-500 text-white px-2 py-1 rounded z-10">
          {block.type} #{safeBlockId}
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
        <ErrorBoundary blockType={block.type} blockId={safeBlockId}>
          {/* Nota: ErrorBoundary recebe o ID "cru" do bloco; caso esteja ausente, passamos o safeBlockId para rastreamento estável */}
          {BlockComponent && (
            <BlockComponent
              // ✅ CORE PROPS - AtomicBlockProps padrão
              block={block}
              isSelected={isSelected}
              isEditable={!isPreviewing}

              // ✅ CALLBACKS - Assinaturas corretas
              onClick={handleClick}

              onUpdate={handleUpdate ? (updates: Partial<Block>) => {
                // ✅ Adapter: AtomicBlockProps (updates) → UniversalBlockRenderer (blockId, updates)
                handleUpdate(updates);
              } : undefined}

              onDelete={onDelete ? () => onDelete(safeBlockId) : undefined}

            // ❌ REMOVED: isPreviewing (deprecated - use isEditable instead)
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
    appLogger.error(`🚨 Erro ao renderizar componente ${this.props.blockType}:`, {
      blockType: this.props.blockType,
      blockId: this.props.blockId,
      error: error.message,
      stack: error.stack,
      errorInfo,
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
              appLogger.debug('🔄 Tentando renderizar novamente:', this.props.blockType);
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
