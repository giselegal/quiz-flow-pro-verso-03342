import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface UseVirtualListOptions<T> {
    items: T[];
    itemHeight: number;          // Altura estimada média (px)
    overscan?: number;           // Quantidade de itens extra antes/depois
    enabled?: boolean;           // Permite desabilitar sem desmontar lógica
    dynamicHeight?: boolean;     // Futuro: medir itens reais
    debounceResizeMs?: number;
    debounceScrollMs?: number;
}

export interface VirtualListResult<T> {
    containerRef: React.RefObject<HTMLDivElement>;
    scrollTop: number;
    containerHeight: number;
    startIndex: number;
    endIndex: number;
    visibleItems: T[];
    topPad: number;
    bottomPad: number;
    total: number;
    enabled: boolean;
    recompute: () => void;
}

/**
 * Hook simples de virtualização (baseline) – baseado em altura fixa estimada.
 * Não faz medição de itens individuais (isso pode ser incrementado depois com ResizeObserver por item).
 */
export function useVirtualList<T>(options: UseVirtualListOptions<T>): VirtualListResult<T> {
    const {
        items,
        itemHeight,
        overscan = 6,
        enabled = true,
        debounceResizeMs = 80,
        debounceScrollMs = 16
    } = options;

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [containerHeight, setContainerHeight] = useState(600);

    // ResizeObserver para atualizar altura do container
    useEffect(() => {
        if (!enabled) return;
        const el = containerRef.current;
        if (!el) return;

        let timeoutId: any = null;
        const ro = new ResizeObserver(() => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setContainerHeight(el.clientHeight || 600);
            }, debounceResizeMs);
        });
        ro.observe(el);
        setContainerHeight(el.clientHeight || 600);

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            ro.disconnect();
        };
    }, [enabled, debounceResizeMs]);

    // Scroll handler
    useEffect(() => {
        if (!enabled) return;
        const el = containerRef.current;
        if (!el) return;

        let raf: number | null = null;
        const onScroll = () => {
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                setScrollTop(el.scrollTop || 0);
            });
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            if (raf) cancelAnimationFrame(raf);
            el.removeEventListener('scroll', onScroll);
        };
    }, [enabled, debounceScrollMs]);

    const { startIndex, endIndex, topPad, bottomPad } = useMemo(() => {
        if (!enabled) {
            return { startIndex: 0, endIndex: items.length, topPad: 0, bottomPad: 0 };
        }
        const visibleCount = Math.max(1, Math.ceil(containerHeight / itemHeight));
        let start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
        let end = Math.min(items.length, start + visibleCount + overscan * 2);

        // Ajuste final se estiver no fim e faltando preencher viewport
        if (end - start < visibleCount && end === items.length) {
            start = Math.max(0, items.length - (visibleCount + overscan * 2));
        }

        const top = start * itemHeight;
        const bottom = Math.max(0, (items.length - end) * itemHeight);
        return { startIndex: start, endIndex: end, topPad: top, bottomPad: bottom };
    }, [items.length, containerHeight, scrollTop, itemHeight, overscan, enabled]);

    const visibleItems = useMemo(() => items.slice(startIndex, endIndex), [items, startIndex, endIndex]);

    const recompute = useCallback(() => {
        // Força recálculo externo – útil se itemHeight mudar dinamicamente
        setScrollTop(prev => prev);
    }, []);

    return {
        containerRef,
        scrollTop,
        containerHeight,
        startIndex,
        endIndex,
        visibleItems,
        topPad,
        bottomPad,
        total: items.length,
        enabled,
        recompute
    };
}

export default useVirtualList;
