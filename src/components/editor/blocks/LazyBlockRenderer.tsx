/**
 * 🚀 LAZY BLOCK RENDERER - SPRINT 2 Fase 2
 * 
 * Renderizador de blocos com lazy loading via blockRegistry
 * Inspirado em UniversalBlockRenderer com melhorias do SPRINT 2
 * 
 * Características:
 * ✅ Lazy loading automático via blockRegistry
 * ✅ Suspense boundaries com skeleton loading
 * ✅ Error boundaries integradas
 * ✅ Performance otimizada com React.memo
 * ✅ Integração com useBlockLoading para tracking
 */

import React, { memo, Suspense, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Block } from '@/types/editor';
import { blockRegistry } from '@/registry/blockRegistry';
import { BlockSkeleton } from './BlockSkeleton';
import { useBlockLoading } from '@/hooks/useBlockLoading';

export interface LazyBlockRendererProps {
  block: Block;
  isSelected?: boolean;
  isEditable?: boolean;
  onUpdate?: (blockId: string, updates: Partial<Block>) => void;
  onDelete?: (blockId: string) => void;
  onSelect?: (blockId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Componente de fallback quando bloco não é encontrado no registry
 */
const FallbackBlockComponent: React.FC<{ block: Block }> = ({ block }) => (
  <div className="p-4 border-2 border-dashed border-muted bg-muted/10 rounded">
    <div className="text-sm text-muted-foreground font-medium mb-1">
      ⚠️ Componente não encontrado
    </div>
    <div className="text-xs text-muted-foreground/70">
      Tipo: <code className="bg-muted px-1 py-0.5 rounded">{block.type}</code>
    </div>
    <div className="text-xs text-muted-foreground/70">
      ID: <code className="bg-muted px-1 py-0.5 rounded">{block.id}</code>
    </div>
  </div>
);

/**
 * Error Boundary específica para renderização de blocos
 * Captura erros sem quebrar toda a página
 */
class BlockErrorBoundary extends React.Component<
  { block: Block; children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { block: Block; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[LazyBlockRenderer] Erro ao renderizar bloco:', {
      blockId: this.props.block.id,
      blockType: this.props.block.type,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  componentDidUpdate(prevProps: { block: Block }) {
    // Reset error ao mudar de bloco
    if (prevProps.block.id !== this.props.block.id && this.state.hasError) {
      this.setState({ hasError: false, error: undefined });
    }
  }

  render() {
    if (this.state.hasError) {
      const { block } = this.props;
      return (
        <div className="p-4 border-2 border-destructive bg-destructive/10 rounded">
          <div className="text-sm font-medium text-destructive mb-1">
            ❌ Erro ao renderizar bloco
          </div>
          <div className="text-xs text-destructive/90">
            Tipo: <code className="bg-destructive/20 px-1 py-0.5 rounded">{block.type}</code>
          </div>
          <div className="text-xs text-destructive/90">
            ID: <code className="bg-destructive/20 px-1 py-0.5 rounded">{block.id}</code>
          </div>
          {this.state.error && (
            <details className="mt-2 text-xs text-destructive/70">
              <summary className="cursor-pointer">Detalhes do erro</summary>
              <pre className="mt-1 p-2 bg-destructive/20 rounded text-[10px] overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Componente principal: LazyBlockRenderer
 * 
 * Renderiza blocos de forma lazy com tracking de loading
 */
const LazyBlockRendererComponent: React.FC<LazyBlockRendererProps> = ({
  block,
  isSelected = false,
  isEditable = false,
  onUpdate,
  onDelete,
  onSelect,
  className,
  style,
}) => {
  // 🎯 Hook de loading para tracking
  const { setBlockLoading } = useBlockLoading();

  // 🚀 Resolver componente via blockRegistry (lazy)
  const BlockComponent = React.useMemo(() => {
    try {
      return blockRegistry.getComponent(block.type);
    } catch (error) {
      console.warn(`[LazyBlockRenderer] Bloco não encontrado no registry: ${block.type}`, error);
      return null;
    }
  }, [block.type]);

  // 📊 Tracking de loading do bloco
  useEffect(() => {
    setBlockLoading(block.id, true);
    
    // Simular delay mínimo para tracking (remover em produção se desnecessário)
    const timer = setTimeout(() => {
      setBlockLoading(block.id, false);
    }, 50);

    return () => {
      clearTimeout(timer);
      setBlockLoading(block.id, false);
    };
  }, [block.id, block.type, setBlockLoading]);

  // 🎨 Handlers memoizados para performance
  const handleClick = React.useCallback(() => {
    if (onSelect && !isEditable) {
      onSelect(block.id);
    }
  }, [block.id, onSelect, isEditable]);

  const handleUpdate = React.useCallback(
    (updates: Partial<Block>) => {
      if (onUpdate) {
        onUpdate(block.id, updates);
      }
    },
    [block.id, onUpdate],
  );

  const handleDelete = React.useCallback(() => {
    if (onDelete) {
      onDelete(block.id);
    }
  }, [block.id, onDelete]);

  const handleSelect = React.useCallback(() => {
    if (onSelect) {
      onSelect(block.id);
    }
  }, [block.id, onSelect]);

  // 🔄 Componente wrapper (fallback se não encontrado)
  const Wrapper = BlockComponent || FallbackBlockComponent;

  return (
    <div
      className={cn(
        'lazy-block-renderer relative group transition-all duration-200',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        isEditable && 'hover:shadow-sm cursor-pointer',
        className,
      )}
      style={style}
      onClick={handleClick}
      data-block-id={block.id}
      data-block-type={block.type}
      data-testid={`block-${block.id}`}
    >
      <BlockErrorBoundary block={block}>
        <Suspense
          fallback={
            <BlockSkeleton
              variant="medium"
              className="animate-pulse"
            />
          }
        >
          <Wrapper
            block={block}
            isSelected={isSelected}
            isEditable={isEditable}
          />
        </Suspense>
      </BlockErrorBoundary>
    </div>
  );
};

// 🎯 Memoização para performance - evitar re-renders desnecessários
const arePropsEqual = (
  prev: LazyBlockRendererProps,
  next: LazyBlockRendererProps,
): boolean => {
  return (
    prev.block.id === next.block.id &&
    prev.block.type === next.block.type &&
    prev.isSelected === next.isSelected &&
    prev.isEditable === next.isEditable &&
    JSON.stringify(prev.block.properties) === JSON.stringify(next.block.properties) &&
    JSON.stringify(prev.block.content) === JSON.stringify(next.block.content)
  );
};

export const LazyBlockRenderer = memo(LazyBlockRendererComponent, arePropsEqual);

LazyBlockRenderer.displayName = 'LazyBlockRenderer';

export default LazyBlockRenderer;
