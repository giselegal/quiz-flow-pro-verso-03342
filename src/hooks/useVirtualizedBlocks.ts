/**
 * 🚀 useVirtualizedBlocks - Virtualização para Listas Grandes de Blocos
 * 
 * Renderiza apenas blocos visíveis na viewport para melhorar performance
 * quando há mais de 50 blocos em um step.
 * 
 * Features:
 * - Lazy rendering de blocos off-screen
 * - Scroll virtual com placeholder heights
 * - Auto-ativa quando > threshold
 * 
 * @version 1.0.0
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import type { Block } from '@/types/editor';

export interface UseVirtualizedBlocksOptions {
  /** Lista completa de blocos */
  blocks: Block[];
  /** Altura estimada de cada bloco (px) */
  estimatedBlockHeight?: number;
  /** Threshold para ativar virtualização */
  threshold?: number;
  /** Overscan (blocos extras renderizados acima/abaixo) */
  overscan?: number;
}

export interface VirtualizedBlocksResult {
  /** Indica se virtualização está ativa */
  isVirtualized: boolean;
  /** Blocos visíveis para renderizar */
  visibleBlocks: Block[];
  /** Altura total do container virtual */
  totalHeight: number;
  /** Offset do primeiro bloco visível */
  offsetY: number;
  /** Ref para o container de scroll */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Handler para scroll */
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

/**
 * Hook de virtualização para listas de blocos
 */
export function useVirtualizedBlocks({
  blocks,
  estimatedBlockHeight = 150,
  threshold = 50,
  overscan = 3,
}: UseVirtualizedBlocksOptions): VirtualizedBlocksResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Ativar virtualização apenas se passar do threshold
  const isVirtualized = blocks.length > threshold;

  // Atualizar altura do container
  useEffect(() => {
    if (!containerRef.current) return;

    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Calcular blocos visíveis
  const { visibleBlocks, totalHeight, offsetY } = useMemo(() => {
    if (!isVirtualized) {
      return {
        visibleBlocks: blocks,
        totalHeight: 0,
        offsetY: 0,
      };
    }

    const totalHeight = blocks.length * estimatedBlockHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / estimatedBlockHeight) - overscan);
    const endIndex = Math.min(
      blocks.length,
      Math.ceil((scrollTop + containerHeight) / estimatedBlockHeight) + overscan
    );

    const visibleBlocks = blocks.slice(startIndex, endIndex);
    const offsetY = startIndex * estimatedBlockHeight;

    return {
      visibleBlocks,
      totalHeight,
      offsetY,
    };
  }, [blocks, isVirtualized, scrollTop, containerHeight, estimatedBlockHeight, overscan]);

  // Handler de scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setScrollTop(target.scrollTop);
  };

  return {
    isVirtualized,
    visibleBlocks,
    totalHeight,
    offsetY,
    containerRef,
    onScroll: handleScroll,
  };
}

export default useVirtualizedBlocks;
