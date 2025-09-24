/**
 * 🚀 VIRTUAL SCROLLING SYSTEM
 * 
 * Sistema de virtual scrolling para otimizar renderização
 * de listas grandes de blocks e componentes
 * 
 * FUNCIONALIDADES:
 * ✅ Renderização apenas de itens visíveis
 * ✅ Performance otimizada para 10,000+ items
 * ✅ Smooth scrolling
 * ✅ Dynamic item heights
 * ✅ Buffer zones para melhor UX
 * ✅ Memory efficient
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLogger } from '@/utils/logger/SmartLogger';
import { cacheManager } from '@/utils/cache/LRUCache';
import { cleanupManager, registerEventListener, registerResizeObserver } from '@/utils/cleanup/AutoCleanupSystem';

export interface VirtualItem {
  id: string;
  index: number;
  height?: number;
  estimatedHeight?: number;
  data: any;
}

export interface VirtualScrollingProps<T> {
  items: T[];
  itemHeight: number | ((item: T, index: number) => number);
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  containerHeight: number;
  containerWidth?: number;
  bufferSize?: number; // Número de itens extras para renderizar fora da viewport
  className?: string;
  getItemId?: (item: T, index: number) => string;
  onScroll?: (scrollTop: number, scrollHeight: number, clientHeight: number) => void;
  overscan?: number; // Quantidade de itens para renderizar além do visível
}

export interface VirtualScrollingState {
  scrollTop: number;
  visibleRange: { start: number; end: number };
  itemHeights: Map<string, number>;
  totalHeight: number;
}

// ✅ CACHE PARA HEIGHTS E POSIÇÕES
const heightsCache = cacheManager.getCache<number>('virtual-heights');
const positionsCache = cacheManager.getCache<number>('virtual-positions');

/**
 * 🎯 COMPONENTE PRINCIPAL DE VIRTUAL SCROLLING
 */
export const VirtualScrolling = <T extends any>({
  items,
  itemHeight,
  renderItem,
  containerHeight,
  containerWidth = 800,
  bufferSize = 5,
  className = '',
  getItemId = (_item: T, index: number) => `item-${index}`, // Usar underscore para parâmetros não utilizados
  onScroll,
  overscan = 3
}: VirtualScrollingProps<T>) => {
  const logger = useLogger('VirtualScrolling');
  const containerRef = useRef<HTMLDivElement>(null);
  const componentId = useMemo(() => `virtual-scroll-${Math.random().toString(36).substr(2, 9)}`, []);

  // ✅ STATE DO VIRTUAL SCROLLING
  const [state, setState] = useState<VirtualScrollingState>({
    scrollTop: 0,
    visibleRange: { start: 0, end: 0 },
    itemHeights: new Map(),
    totalHeight: 0
  });

  // ✅ CALCULAR ALTURA DOS ITENS
  const getItemHeight = useCallback((item: T, index: number): number => {
    const itemId = getItemId(item, index);

    // Cache primeiro
    const cached = heightsCache.get(itemId);
    if (cached) return cached;

    // Calcular altura
    const height = typeof itemHeight === 'function'
      ? itemHeight(item, index)
      : itemHeight;

    // Cachear resultado
    heightsCache.set(itemId, height);

    return height;
  }, [itemHeight, getItemId]);

  // ✅ CALCULAR POSIÇÕES DOS ITENS
  const getItemPositions = useMemo(() => {
    let currentTop = 0;
    const positions = new Map<number, number>();

    for (let i = 0; i < items.length; i++) {
      const cacheKey = `pos-${i}`;
      const cached = positionsCache.get(cacheKey);

      if (cached !== null) {
        positions.set(i, cached);
        currentTop = cached + getItemHeight(items[i], i);
      } else {
        positions.set(i, currentTop);
        positionsCache.set(cacheKey, currentTop);
        currentTop += getItemHeight(items[i], i);
      }
    }

    return positions;
  }, [items, getItemHeight]);

  // ✅ CALCULAR RANGE VISÍVEL
  const getVisibleRange = useCallback((scrollTop: number) => {
    let startIndex = 0;
    let endIndex = items.length - 1;

    // Busca binária para encontrar o início
    let low = 0;
    let high = items.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const position = getItemPositions.get(mid) || 0;

      if (position < scrollTop) {
        startIndex = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    // Encontrar o fim
    const viewportBottom = scrollTop + containerHeight;
    for (let i = startIndex; i < items.length; i++) {
      const position = getItemPositions.get(i) || 0;
      if (position > viewportBottom) {
        endIndex = i;
        break;
      }
    }

    // Aplicar buffer e overscan
    const bufferedStart = Math.max(0, startIndex - bufferSize - overscan);
    const bufferedEnd = Math.min(items.length - 1, endIndex + bufferSize + overscan);

    return { start: bufferedStart, end: bufferedEnd };
  }, [items.length, getItemPositions, containerHeight, bufferSize, overscan]);

  // ✅ HANDLER DE SCROLL
  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLDivElement;
    const newScrollTop = target.scrollTop;
    const newVisibleRange = getVisibleRange(newScrollTop);

    setState(prev => ({
      ...prev,
      scrollTop: newScrollTop,
      visibleRange: newVisibleRange
    }));

    // Callback opcional
    if (onScroll) {
      onScroll(newScrollTop, target.scrollHeight, target.clientHeight);
    }

    logger.debug('Scroll updated', {
      scrollTop: newScrollTop,
      visibleRange: newVisibleRange,
      visibleItems: newVisibleRange.end - newVisibleRange.start + 1
    });
  }, [getVisibleRange, onScroll, logger]);

  // ✅ SETUP DE EVENT LISTENERS
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cleanupScrollId = registerEventListener(
      container,
      'scroll',
      handleScroll,
      { passive: true },
      componentId
    );

    const { cleanupId: resizeCleanupId } = registerResizeObserver(
      (entries) => {
        for (const _entry of entries) {
          // Re-calcular range quando container redimensiona
          const newVisibleRange = getVisibleRange(state.scrollTop);
          setState(prev => ({
            ...prev,
            visibleRange: newVisibleRange
          }));
        }
      },
      componentId
    );

    // Calcular range inicial
    const initialRange = getVisibleRange(0);
    setState(prev => ({
      ...prev,
      visibleRange: initialRange,
      totalHeight: Array.from(getItemPositions.values()).reduce((max, pos, i) => {
        const item = items[i];
        return item ? Math.max(max, pos + getItemHeight(item, i)) : max;
      }, 0)
    }));

    return () => {
      cleanupManager.cleanup(cleanupScrollId);
      cleanupManager.cleanup(resizeCleanupId);
    };
  }, [items, handleScroll, getVisibleRange, state.scrollTop, getItemPositions, getItemHeight, componentId]);

  // ✅ CLEANUP AO DESMONTAR
  useEffect(() => {
    return () => {
      cleanupManager.cleanupComponent(componentId);
    };
  }, [componentId]);

  // ✅ CALCULAR TOTAL HEIGHT
  const totalHeight = useMemo(() => {
    if (items.length === 0) return 0;

    const lastPosition = getItemPositions.get(items.length - 1) || 0;
    const lastItemHeight = getItemHeight(items[items.length - 1], items.length - 1);

    return lastPosition + lastItemHeight;
  }, [items, getItemPositions, getItemHeight]);

  // ✅ RENDERIZAR ITENS VISÍVEIS
  const visibleItems = useMemo(() => {
    const rendered = [];

    for (let i = state.visibleRange.start; i <= state.visibleRange.end && i < items.length; i++) {
      const item = items[i];
      const itemId = getItemId(item, i);
      const top = getItemPositions.get(i) || 0;
      const height = getItemHeight(item, i);

      const style: React.CSSProperties = {
        position: 'absolute',
        top,
        left: 0,
        right: 0,
        height,
        width: '100%'
      };

      rendered.push(
        <div key={itemId} style={style}>
          {renderItem(item, i, style)}
        </div>
      );
    }

    return rendered;
  }, [state.visibleRange, items, getItemId, getItemPositions, getItemHeight, renderItem]);

  // ✅ LOG DE PERFORMANCE
  useEffect(() => {
    const renderDuration = performance.now();
    logger.performance('virtual-scroll-render', renderDuration);

    logger.debug('Virtual scroll stats', {
      totalItems: items.length,
      visibleItems: state.visibleRange.end - state.visibleRange.start + 1,
      totalHeight,
      scrollTop: state.scrollTop
    });
  }, [state.visibleRange, items.length, totalHeight, state.scrollTop, logger]);

  return (
    <div
      ref={containerRef}
      className={`virtual-scrolling-container overflow-auto ${className}`}
      style={{
        height: containerHeight,
        width: containerWidth,
        position: 'relative'
      }}
    >
      {/* ✅ SPACER VIRTUAL PARA MANTER SCROLL HEIGHT */}
      <div
        style={{
          height: totalHeight,
          width: '100%',
          position: 'relative'
        }}
      >
        {visibleItems}
      </div>
    </div>
  );
};

// ✅ HOOK PARA USAR VIRTUAL SCROLLING COM BLOCKS
export const useVirtualBlockList = (blocks: any[], containerHeight: number) => {
  const defaultRenderBlock = useCallback((block: any, index: number, style: React.CSSProperties) => {
    return (
      <div style={style} className="virtual-block-item">
        <div className="p-2 border-b">
          <strong>Block {index}</strong>
          <div>{block.title || block.name || 'Unnamed Block'}</div>
          <div className="text-sm text-gray-600">{block.type || 'Unknown Type'}</div>
        </div>
      </div>
    );
  }, []);

  const handleScroll = useCallback((scrollTop: number) => {
    // Lógica de scroll para blocks
    console.log('Block scroll:', scrollTop);
  }, []);

  return {
    visibleItems: blocks,
    totalHeight: Math.min(blocks.length * 50, containerHeight),
    containerProps: {},
    listProps: {},
    VirtualScrollingComponent: VirtualScrolling,
    renderBlock: defaultRenderBlock,
    handleScroll,
    itemHeight: 50,
    bufferSize: 5
  };
};

// ✅ COMPONENTE DE EXEMPLO PARA LISTA DE BLOCKS
export const VirtualBlockList: React.FC<{
  blocks: any[];
  containerHeight: number;
  onBlockClick?: (block: any, index: number) => void;
}> = ({ blocks, containerHeight, onBlockClick }) => {
  const { VirtualScrollingComponent, renderBlock, handleScroll, itemHeight, bufferSize } =
    useVirtualBlockList(blocks, containerHeight);

  const renderBlockWithClick = useCallback((block: any, index: number, style: React.CSSProperties) => {
    return (
      <div
        style={style}
        className="virtual-block-item cursor-pointer hover:bg-gray-50"
        onClick={() => onBlockClick?.(block, index)}
      >
        {renderBlock(block, index, style)}
      </div>
    );
  }, [renderBlock, onBlockClick]);

  return (
    <VirtualScrollingComponent
      items={blocks}
      itemHeight={itemHeight}
      renderItem={renderBlockWithClick}
      containerHeight={containerHeight}
      bufferSize={bufferSize}
      onScroll={handleScroll}
      className="virtual-block-list"
      getItemId={(block) => block.id || `block-${block.index}`}
    />
  );
};

export default VirtualScrolling;
