import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import type { Block } from '@/types/editor';
import { blockRegistry } from '@/core/registry/UnifiedBlockRegistry';
import GenericFallback from '@/components/core/fallbacks/GenericFallback';
import IntroFallback from '@/components/core/fallbacks/IntroFallback';
import QuestionFallback from '@/components/core/fallbacks/QuestionFallback';
import TransitionFallback from '@/components/core/fallbacks/TransitionFallback';
import ResultFallback from '@/components/core/fallbacks/ResultFallback';
import OfferFallback from '@/components/core/fallbacks/OfferFallback';
import { appLogger } from '@/lib/utils/appLogger';

export interface UniversalBlockRendererProps {
  block: Block;
  isSelected?: boolean;
  /**
   * @deprecated Use EditableBlock ou PreviewBlock em vez de isPreviewing
   */
  isPreviewing?: boolean;
  onUpdate?: (blockId: string, updates: any) => void;
  onDelete?: (blockId: string) => void;
  onSelect?: (blockId: string) => void;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const FallbackComponent: React.FC<{ block: Block }> = ({ block }) => {
  const t = String(block.type || '').toLowerCase();
  if (t.startsWith('intro-')) return <IntroFallback block={block} />;
  if (t.startsWith('question-') || t.startsWith('options-')) return <QuestionFallback block={block} />;
  if (t.startsWith('transition-')) return <TransitionFallback block={block} />;
  if (t.startsWith('result-')) return <ResultFallback block={block} />;
  if (t.startsWith('offer-') || t === 'cta' || t.includes('pricing')) return <OfferFallback block={block} />;
  return <GenericFallback block={block} />;
};

class BlockErrorBoundary extends React.Component<{ block: Block; children?: React.ReactNode }, { hasError: boolean; error?: any }> {
  constructor(props: { block: Block; children?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // Log não-invasivo para diagnóstico

    appLogger.error('[UniversalBlockRenderer] erro ao renderizar bloco', { data: [{
            block: this.props.block,
            error,
            info,
          }] });
  }

  componentDidUpdate(prevProps: Readonly<{ block: Block }>) {
    // Ao trocar de bloco, resetar estado de erro
    if (prevProps.block.id !== this.props.block.id && this.state.hasError) {

      this.setState({ hasError: false, error: undefined });
    }
  }

  render() {
    if (this.state.hasError) {
      const { block } = this.props;
      return (
        <div className="p-4 border-2 border-red-300 bg-red-50 rounded">
          <div className="text-sm font-medium text-red-700 mb-1">Erro ao renderizar bloco</div>
          <div className="text-xs text-red-700/90">Tipo: {block.type}</div>
          <div className="text-xs text-red-700/70">ID: {block.id}</div>
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

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
  // Debug log para question-hero
  if (block.type === 'question-hero') {
    appLogger.info('🎯 [UniversalBlockRenderer] Renderizando question-hero:', { data: [{
            blockId: block.id,
            type: block.type,
            content: block.content,
            properties: block.properties
          }] });
  }

  // Resolver componente via UnifiedBlockRegistry
  const EnhancedComponent = blockRegistry.getComponent(block.type);

  if (block.type === 'question-hero' && !EnhancedComponent) {
    appLogger.error('❌ [UniversalBlockRenderer] Componente question-hero NÃO encontrado no registry!');
  }

  const handleClick = React.useMemo(() => {
    if (onSelect) return () => onSelect(block.id);
    if (onClick) return onClick;
    return undefined;
  }, [block.id, onSelect, onClick]);

  const handleUpdate = React.useMemo(() =>
    onUpdate ? (updates: any) => onUpdate(block.id, updates) : undefined,
    [block.id, onUpdate]);

  const Wrapper = EnhancedComponent ?? ((props: any) => <FallbackComponent block={block} {...props} />);

  return (
    <div
      className={cn(
        'universal-block-renderer relative group transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        !isPreviewing && 'hover:shadow-sm cursor-pointer',
        className,
      )}
      style={style}
      onClick={!isPreviewing ? handleClick : undefined}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <BlockErrorBoundary block={block}>
        {/* Fallback de loading simples para possíveis componentes lazy dentro do registry */}
        <React.Suspense fallback={<div className="p-4 bg-gray-100 rounded animate-pulse text-sm text-gray-600">Carregando componente: {block.type}</div>}>
          <Wrapper
            block={block}
            isSelected={isSelected}
            isEditable={!isPreviewing}
            onClick={handleClick}
            onUpdate={handleUpdate ? (updates: Partial<Block>) => handleUpdate(updates) : undefined}
            onDelete={onDelete ? () => onDelete(block.id) : undefined}
          />
        </React.Suspense>
      </BlockErrorBoundary>
    </div>
  );
});

UniversalBlockRenderer.displayName = 'UniversalBlockRenderer(core)';

export { UniversalBlockRenderer };
export default UniversalBlockRenderer;
