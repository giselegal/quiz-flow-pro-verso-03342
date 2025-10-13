import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BlockComponent } from '../types';

interface UseVirtualBlocksOptions {
    blocks: BlockComponent[];
    rowHeight?: number; // média estimada
    overscan?: number;
    scrollContainerId?: string; // id ou seletor do container rolável
    enabled?: boolean;
}

export interface VirtualBlocksResult {
    visible: BlockComponent[];
    topSpacer: number;
    bottomSpacer: number;
    total: number;
    scrollTop: number;
    setScrollTop: (n: number) => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

export function useVirtualBlocks(opts: UseVirtualBlocksOptions): VirtualBlocksResult {
    const { blocks = [], rowHeight = 86, overscan = 4, enabled = true } = opts;

    // ✅ PROTEÇÃO: Validação defensiva de entrada
    const safeBlocks = useMemo(() => {
        return Array.isArray(blocks) ? blocks : [];
    }, [blocks]);

    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(600);

    const onScroll = useCallback(() => {
        if (!containerRef.current) return;
        setScrollTop(containerRef.current.scrollTop);
    }, []);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const handle = () => setViewportHeight(el.clientHeight || 600);
        handle();
        el.addEventListener('scroll', onScroll);
        window.addEventListener('resize', handle);
        return () => {
            el.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', handle);
        };
    }, [onScroll]);

    // ✅ OTIMIZAÇÃO: Memoizar cálculo de blocos visíveis
    const visibleBlocks = useMemo(() => {
        if (!enabled) {
            return safeBlocks;
        }

        const total = safeBlocks.length;
        const startIndex = Math.max(Math.floor(scrollTop / rowHeight) - overscan, 0);
        const viewportCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;
        const endIndex = Math.min(startIndex + viewportCount, total);

        return safeBlocks.slice(startIndex, endIndex);
    }, [enabled, safeBlocks, scrollTop, rowHeight, overscan, viewportHeight]);

    // ✅ OTIMIZAÇÃO: Memoizar cálculo de spacers
    const { topSpacer, bottomSpacer } = useMemo(() => {
        if (!enabled) {
            return { topSpacer: 0, bottomSpacer: 0 };
        }

        const total = safeBlocks.length;
        const startIndex = Math.max(Math.floor(scrollTop / rowHeight) - overscan, 0);
        const viewportCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;
        const endIndex = Math.min(startIndex + viewportCount, total);

        return {
            topSpacer: startIndex * rowHeight,
            bottomSpacer: (total - endIndex) * rowHeight
        };
    }, [enabled, safeBlocks.length, scrollTop, rowHeight, overscan, viewportHeight]);

    return {
        visible: visibleBlocks,
        topSpacer,
        bottomSpacer,
        total: safeBlocks.length,
        scrollTop,
        setScrollTop,
        containerRef
    };
}
