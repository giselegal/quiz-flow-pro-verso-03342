/**
 * 🔄 LAZY BLOCK WRAPPER - Fase 5 Gargalos
 * 
 * Wrapper que usa IntersectionObserver para lazy rendering de blocos.
 * Renderiza placeholder até o bloco entrar no viewport.
 * 
 * @version 1.0.0
 */

import React, { useState, useRef, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface LazyBlockWrapperProps {
  /** ID único do bloco */
  blockId: string;
  /** Conteúdo a renderizar quando visível */
  children: React.ReactNode;
  /** Altura mínima do placeholder */
  minHeight?: number;
  /** Margem do root para pré-carregar (ex: "100px") */
  rootMargin?: string;
  /** Threshold para trigger (0-1) */
  threshold?: number;
  /** Classe CSS adicional */
  className?: string;
  /** Callback quando entra no viewport */
  onVisible?: (blockId: string) => void;
  /** Manter renderizado após ficar visível uma vez */
  keepMounted?: boolean;
  /** Placeholder customizado */
  placeholder?: React.ReactNode;
  /** Prioridade alta - renderiza imediatamente */
  priority?: 'high' | 'normal' | 'low';
}

// ============================================================================
// DEFAULT PLACEHOLDER
// ============================================================================

const DefaultPlaceholder: React.FC<{ minHeight: number }> = ({ minHeight }) => (
  <div
    className="w-full bg-muted/30 rounded-lg animate-pulse flex items-center justify-center"
    style={{ minHeight }}
  >
    <div className="flex flex-col items-center gap-2 text-muted-foreground">
      <div className="w-8 h-8 rounded-full bg-muted/50" />
      <div className="h-3 w-20 bg-muted/50 rounded" />
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const LazyBlockWrapper: React.FC<LazyBlockWrapperProps> = memo(({
  blockId,
  children,
  minHeight = 100,
  rootMargin = '200px',
  threshold = 0.1,
  className,
  onVisible,
  keepMounted = true,
  placeholder,
  priority = 'normal',
}) => {
  const [isVisible, setIsVisible] = useState(priority === 'high');
  const [hasBeenVisible, setHasBeenVisible] = useState(priority === 'high');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Se prioridade alta, não precisa de observer
    if (priority === 'high') return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setHasBeenVisible(true);
            onVisible?.(blockId);

            // Se keepMounted, desconectar observer após primeira visibilidade
            if (keepMounted) {
              observer.disconnect();
            }
          } else if (!keepMounted) {
            setIsVisible(false);
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [blockId, rootMargin, threshold, onVisible, keepMounted, priority]);

  // Determinar se deve renderizar conteúdo
  const shouldRender = isVisible || (keepMounted && hasBeenVisible);

  return (
    <div
      ref={ref}
      className={cn('lazy-block-wrapper', className)}
      data-block-id={blockId}
      data-visible={isVisible}
      data-rendered={shouldRender}
      style={{ minHeight: shouldRender ? undefined : minHeight }}
    >
      {shouldRender ? children : (placeholder || <DefaultPlaceholder minHeight={minHeight} />)}
    </div>
  );
});

LazyBlockWrapper.displayName = 'LazyBlockWrapper';

// ============================================================================
// BATCH LAZY LOADER
// ============================================================================

interface BatchLazyBlocksProps {
  /** Array de blocos para renderizar */
  blocks: Array<{ id: string; [key: string]: any }>;
  /** Função que renderiza cada bloco */
  renderBlock: (block: any, index: number) => React.ReactNode;
  /** Altura estimada de cada bloco */
  estimatedBlockHeight?: number;
  /** Número de blocos para renderizar imediatamente */
  immediateRenderCount?: number;
  /** Classe CSS do container */
  className?: string;
}

/**
 * Componente que renderiza múltiplos blocos com lazy loading
 */
export const BatchLazyBlocks: React.FC<BatchLazyBlocksProps> = memo(({
  blocks,
  renderBlock,
  estimatedBlockHeight = 120,
  immediateRenderCount = 3,
  className,
}) => {
  return (
    <div className={cn('batch-lazy-blocks space-y-4', className)}>
      {blocks.map((block, index) => (
        <LazyBlockWrapper
          key={block.id}
          blockId={block.id}
          minHeight={estimatedBlockHeight}
          priority={index < immediateRenderCount ? 'high' : 'normal'}
          rootMargin="300px"
        >
          {renderBlock(block, index)}
        </LazyBlockWrapper>
      ))}
    </div>
  );
});

BatchLazyBlocks.displayName = 'BatchLazyBlocks';

// ============================================================================
// EXPORTS
// ============================================================================

export default LazyBlockWrapper;
