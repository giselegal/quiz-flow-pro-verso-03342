import React, { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { getEnhancedBlockComponent } from '@/components/editor/blocks/EnhancedBlockRegistry';
import { blockRendererDebug } from '@/components/editor/debug/BlockRendererDebug';
import { cacheManager } from '@/utils/cache/LRUCache';
// Importações diretas para componentes críticos (performance)
import QuizIntroHeaderBlock from './QuizIntroHeaderBlock';
import OptionsGridBlock from './OptionsGridBlock';
import TextInlineBlock from './TextInlineBlock';
import ButtonInlineBlock from './ButtonInlineBlock';
import { FashionAIGeneratorBlock } from '@/components/blocks/ai';
import MentorSectionInlineBlock from './MentorSectionInlineBlock';
import TestimonialCardInlineBlock from './TestimonialCardInlineBlock';
import TestimonialsCarouselInlineBlock from './TestimonialsCarouselInlineBlock';

// @ts-nocheck
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
  'options-grid': OptionsGridBlock,
  'text-inline': TextInlineBlock,
  'button-inline': ButtonInlineBlock,
  'fashion-ai-generator': FashionAIGeneratorBlock,
  'mentor-section-inline': MentorSectionInlineBlock,
  'testimonial-card-inline': TestimonialCardInlineBlock,
  'testimonials-carousel-inline': TestimonialsCarouselInlineBlock,
  'text': createFallbackComponent('text'),
  'headline': createFallbackComponent('headline'),
  'image': createFallbackComponent('image'),
  'button': createFallbackComponent('button'),
  'form': createFallbackComponent('form'),
  'spacer': createFallbackComponent('spacer'),
  'container': createFallbackComponent('container'),
};

// ✅ SISTEMA HÍBRIDO: Cache crítico + EnhancedBlockRegistry completo
const getBlockComponent = (blockType: string) => {
  // Debug logging para troubleshooting
  console.log(`🔍 UniversalBlockRenderer: Buscando componente para tipo "${blockType}"`);

  // 1. Cache de componentes críticos para performance máxima
  if (BlockComponentRegistry[blockType]) {
    console.log(`✅ Componente encontrado no cache crítico: ${blockType}`);
    return BlockComponentRegistry[blockType];
  }

  // 2. Buscar no EnhancedBlockRegistry (150+ componentes)
  try {
    const enhancedComponent = getEnhancedBlockComponent(blockType);
    if (enhancedComponent) {
      console.log(`✅ Componente encontrado no EnhancedBlockRegistry: ${blockType}`);
      return enhancedComponent;
    }
  } catch (error) {
    console.error(`❌ Erro ao buscar componente no EnhancedBlockRegistry: ${blockType}`, error);
  }

  // 3. Log para componentes não encontrados
  console.warn(`⚠️ Componente não encontrado em nenhum registry: ${blockType}`);

  // 4. Fallback final
  return null;
};

// ✅ OTIMIZAÇÃO: LRU Cache para eliminar memory leaks
const componentCache = cacheManager.getCache<React.ComponentType<any> | null>('blockComponents', 50);
const renderCache = cacheManager.getCache<BlockRenderData>('blockRenders', 100);

interface BlockRenderData {
  timestamp: number;
  renderTime: number;
  blockType: string;
  isSelected: boolean;
}

const useBlockComponent = (blockType: string) => {
  return useMemo(() => {
    // Verificar cache LRU primeiro
    const cachedComponent = componentCache.get(blockType);
    if (cachedComponent !== null) {
      console.log(`🚀 Componente recuperado do LRU cache: ${blockType}`);

      // Atualizar stats de debug com LRU metrics
      const cacheStats = componentCache.getStats();
      blockRendererDebug.updateCacheStats({
        cacheSize: cacheStats.size,
        totalLookups: cacheStats.hits + cacheStats.misses,
        cacheHits: cacheStats.hits,
        cacheMisses: cacheStats.misses
      });

      return cachedComponent;
    }

    // Cache miss - buscar componente
    const component = getBlockComponent(blockType);

    // Armazenar no LRU cache
    componentCache.set(blockType, component);

    // Atualizar stats de debug
    const cacheStats = componentCache.getStats();
    blockRendererDebug.updateCacheStats({
      cacheSize: cacheStats.size,
      totalLookups: cacheStats.hits + cacheStats.misses,
      cacheHits: cacheStats.hits,
      cacheMisses: cacheStats.misses
    });

    return component;
  }, [blockType]);
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
  // ✅ MONITORAMENTO DE PERFORMANCE
  const renderStartTime = React.useRef<number>();

  React.useEffect(() => {
    renderStartTime.current = performance.now();
  });

  React.useEffect(() => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;

      // Armazenar render data no cache para análise
      const renderData: BlockRenderData = {
        timestamp: Date.now(),
        renderTime,
        blockType: block.type,
        isSelected
      };
      renderCache.set(`${block.id}-${Date.now()}`, renderData);

      // Registrar estatísticas de render
      blockRendererDebug.logRender({
        blockType: block.type,
        blockId: block.id,
        renderTime,
        timestamp: Date.now(),
        isSelected,
        isPreviewing,
        hasComponent: !!BlockComponent
      });

      if (renderTime > 50) { // Log apenas renders lentos
        console.warn(`⚠️ Render lento detectado`, {
          blockType: block.type,
          blockId: block.id,
          renderTime: `${renderTime.toFixed(2)}ms`,
          isSelected,
          isPreviewing
        });
      }
    }
  });

  // ✅ OTIMIZAÇÃO: Usar hook cacheado ao invés de lookup direto
  const BlockComponent = useBlockComponent(block.type);

  // ✅ LOG DE RENDERIZAÇÃO PARA DEBUG
  React.useEffect(() => {
    console.log(`🎨 Renderizando bloco:`, {
      type: block.type,
      id: block.id,
      hasComponent: !!BlockComponent,
      isSelected,
      isPreviewing,
      timestamp: new Date().toISOString()
    });
  }, [block.type, block.id, BlockComponent, isSelected, isPreviewing]);

  // ✅ OTIMIZAÇÃO: Memoizar handlers com dependências estáveis
  const handleUpdate = useMemo(() =>
    onUpdate ? (updates: any) => onUpdate(block.id, updates) : undefined
    , [block.id, onUpdate]);

  const handleClick = useMemo(() => {
    if (onSelect) {
      return () => onSelect(block.id);
    } else if (onClick) {
      return onClick;
    }
    return undefined;
  }, [block.id, onSelect, onClick]);

  if (!BlockComponent) {
    // Log detalhado para debug
    console.error(`❌ UniversalBlockRenderer: Componente não encontrado`, {
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
              console.log('🔍 Debug info:', {
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
          <BlockComponent
            block={block}
            isSelected={isSelected}
            isPreviewing={isPreviewing}
            onUpdate={handleUpdate}
          />
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
