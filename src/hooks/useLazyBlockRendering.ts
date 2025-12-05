/**
 * 🔄 USE LAZY BLOCK RENDERING - Fase 5 Gargalos
 * 
 * Hook para gerenciar lazy rendering de blocos com IntersectionObserver.
 * Otimiza performance renderizando apenas blocos visíveis.
 * 
 * @version 1.0.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  LAZY_ROOT_MARGIN,
  LAZY_THRESHOLD,
  IMMEDIATE_RENDER_COUNT,
} from '@/components/editor/performance/constants';

// ============================================================================
// TYPES
// ============================================================================

export interface UseLazyBlockRenderingOptions {
  /** IDs dos blocos para monitorar */
  blockIds: string[];
  /** Número de blocos para renderizar imediatamente */
  immediateCount?: number;
  /** Margem do root do IntersectionObserver */
  rootMargin?: string;
  /** Threshold do IntersectionObserver */
  threshold?: number;
  /** Ref do container scrollável (opcional) */
  containerRef?: React.RefObject<HTMLElement>;
  /** Manter blocos montados após visibilidade */
  keepMounted?: boolean;
}

export interface UseLazyBlockRenderingReturn {
  /** Set de IDs de blocos que devem ser renderizados */
  visibleBlockIds: Set<string>;
  /** Verifica se um bloco específico deve ser renderizado */
  shouldRenderBlock: (blockId: string) => boolean;
  /** Registra um elemento de bloco para observação */
  registerBlockRef: (blockId: string, element: HTMLElement | null) => void;
  /** Força a renderização de um bloco específico */
  forceRenderBlock: (blockId: string) => void;
  /** Estatísticas de renderização */
  stats: {
    total: number;
    rendered: number;
    percentage: number;
  };
}

// ============================================================================
// HOOK
// ============================================================================

export function useLazyBlockRendering({
  blockIds,
  immediateCount = IMMEDIATE_RENDER_COUNT,
  rootMargin = LAZY_ROOT_MARGIN,
  threshold = LAZY_THRESHOLD,
  containerRef,
  keepMounted = true,
}: UseLazyBlockRenderingOptions): UseLazyBlockRenderingReturn {
  // Set de blocos visíveis (ou que já foram visíveis se keepMounted)
  const [visibleBlockIds, setVisibleBlockIds] = useState<Set<string>>(() => {
    // Renderizar imediatamente os primeiros N blocos
    const initial = new Set<string>();
    blockIds.slice(0, immediateCount).forEach(id => initial.add(id));
    return initial;
  });

  // Refs para os elementos dos blocos
  const blockRefs = useRef<Map<string, HTMLElement>>(new Map());
  
  // Ref para o observer
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Callback quando um bloco fica visível
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    setVisibleBlockIds(prev => {
      const next = new Set(prev);
      let changed = false;

      entries.forEach(entry => {
        const blockId = entry.target.getAttribute('data-block-id');
        if (!blockId) return;

        if (entry.isIntersecting) {
          if (!next.has(blockId)) {
            next.add(blockId);
            changed = true;
          }
        } else if (!keepMounted) {
          if (next.has(blockId)) {
            next.delete(blockId);
            changed = true;
          }
        }
      });

      return changed ? next : prev;
    });
  }, [keepMounted]);

  // Configurar IntersectionObserver
  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: containerRef?.current || null,
      rootMargin,
      threshold,
    });

    // Observar blocos já registrados
    blockRefs.current.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [handleIntersection, containerRef, rootMargin, threshold]);

  // Atualizar blocos imediatos quando blockIds muda
  useEffect(() => {
    setVisibleBlockIds(prev => {
      const next = new Set(prev);
      blockIds.slice(0, immediateCount).forEach(id => next.add(id));
      return next;
    });
  }, [blockIds, immediateCount]);

  // Registrar ref de um bloco
  const registerBlockRef = useCallback((blockId: string, element: HTMLElement | null) => {
    if (element) {
      element.setAttribute('data-block-id', blockId);
      blockRefs.current.set(blockId, element);
      observerRef.current?.observe(element);
    } else {
      const existing = blockRefs.current.get(blockId);
      if (existing) {
        observerRef.current?.unobserve(existing);
        blockRefs.current.delete(blockId);
      }
    }
  }, []);

  // Verificar se um bloco deve ser renderizado
  const shouldRenderBlock = useCallback((blockId: string): boolean => {
    return visibleBlockIds.has(blockId);
  }, [visibleBlockIds]);

  // Forçar renderização de um bloco
  const forceRenderBlock = useCallback((blockId: string) => {
    setVisibleBlockIds(prev => {
      if (prev.has(blockId)) return prev;
      const next = new Set(prev);
      next.add(blockId);
      return next;
    });
  }, []);

  // Calcular estatísticas
  const stats = {
    total: blockIds.length,
    rendered: visibleBlockIds.size,
    percentage: blockIds.length > 0 
      ? Math.round((visibleBlockIds.size / blockIds.length) * 100) 
      : 100,
  };

  return {
    visibleBlockIds,
    shouldRenderBlock,
    registerBlockRef,
    forceRenderBlock,
    stats,
  };
}

export default useLazyBlockRendering;
