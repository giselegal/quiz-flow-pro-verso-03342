/**
 * 🚀 VIRTUALIZED LIST
 * 
 * Componente genérico de lista virtualizada usando @tanstack/react-virtual.
 * 
 * CARACTERÍSTICAS:
 * - Renderização eficiente de listas grandes
 * - Virtualização adaptativa (threshold-based)
 * - Performance otimizada com memo e callbacks
 * - Totalmente tipado com TypeScript
 * 
 * USO:
 * ```tsx
 * <VirtualizedList
 *   items={blocks}
 *   renderItem={(block) => <BlockCard block={block} />}
 *   estimatedItemHeight={80}
 *   threshold={20}
 * />
 * ```
 */

import React, { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface VirtualizedListProps<T> {
    /** Array de itens a renderizar */
    items: T[];

    /** Função que renderiza cada item */
    renderItem: (item: T, index: number) => React.ReactNode;

    /** Altura estimada de cada item (px) */
    estimatedItemHeight?: number;

    /** Limite para ativar virtualização (default: 20) */
    threshold?: number;

    /** Classe CSS do container */
    className?: string;

    /** Overscan (itens extras renderizados fora da viewport) */
    overscan?: number;

    /** Função para extrair key única de cada item */
    getItemKey?: (item: T, index: number) => string | number;

    /** Mensagem quando lista vazia */
    emptyMessage?: React.ReactNode;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Lista virtualizada genérica com threshold adaptativo
 */
export function VirtualizedList<T>({
    items,
    renderItem,
    estimatedItemHeight = 60,
    threshold = 20,
    className,
    overscan = 5,
    getItemKey,
    emptyMessage,
}: VirtualizedListProps<T>) {
    const parentRef = useRef<HTMLDivElement>(null);

    // Determinar se deve usar virtualização
    const shouldVirtualize = items.length > threshold;

    // Configurar virtualizador
    const rowVirtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => estimatedItemHeight,
        overscan,
        enabled: shouldVirtualize,
    });

    // Memoizar itens virtuais
    const virtualItems = useMemo(
        () => (shouldVirtualize ? rowVirtualizer.getVirtualItems() : []),
        [shouldVirtualize, rowVirtualizer]
    );

    // Lista vazia
    if (items.length === 0) {
        return (
            <div className={cn('flex items-center justify-center p-8 text-muted-foreground', className)}>
                {emptyMessage || 'Nenhum item para exibir'}
            </div>
        );
    }

    // Renderização não-virtualizada para listas pequenas
    if (!shouldVirtualize) {
        return (
            <div
                ref={parentRef}
                className={cn('overflow-auto', className)}
            >
                {items.map((item, index) => {
                    const key = getItemKey ? getItemKey(item, index) : index;
                    return (
                        <div key={key}>
                            {renderItem(item, index)}
                        </div>
                    );
                })}
            </div>
        );
    }

    // Renderização virtualizada para listas grandes
    return (
        <div
            ref={parentRef}
            className={cn('overflow-auto', className)}
        >
            <div
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                {virtualItems.map((virtualItem) => {
                    const item = items[virtualItem.index];
                    const key = getItemKey ? getItemKey(item, virtualItem.index) : virtualItem.index;

                    return (
                        <div
                            key={key}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: `${virtualItem.size}px`,
                                transform: `translateY(${virtualItem.start}px)`,
                            }}
                            data-index={virtualItem.index}
                            ref={rowVirtualizer.measureElement}
                        >
                            {renderItem(item, virtualItem.index)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================================================
// MEMOIZED VERSION
// ============================================================================

/**
 * Versão memoizada do VirtualizedList para evitar re-renders desnecessários
 */
export const MemoizedVirtualizedList = React.memo(
    VirtualizedList,
    (prev, next) => {
        // Re-render apenas se items ou renderItem mudarem
        return (
            prev.items === next.items &&
            prev.renderItem === next.renderItem &&
            prev.estimatedItemHeight === next.estimatedItemHeight &&
            prev.threshold === next.threshold
        );
    }
) as typeof VirtualizedList;
