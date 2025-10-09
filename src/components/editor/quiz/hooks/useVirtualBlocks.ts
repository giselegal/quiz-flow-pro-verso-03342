import { useCallback, useEffect, useRef, useState } from 'react';

// Definição mínima local para evitar dependência circular de types central não existente
export interface BlockComponent { id: string; type: string; order: number; parentId?: string | null; properties: Record<string, any>; content: Record<string, any>; }

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
    const { blocks, rowHeight = 86, overscan = 4, enabled = true } = opts;
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

    if (!enabled) {
        return {
            visible: blocks,
            topSpacer: 0,
            bottomSpacer: 0,
            total: blocks.length,
            scrollTop,
            setScrollTop,
            containerRef
        };
    }

    const total = blocks.length;
    const startIndex = Math.max(Math.floor(scrollTop / rowHeight) - overscan, 0);
    const viewportCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;
    const endIndex = Math.min(startIndex + viewportCount, total);
    const visible = blocks.slice(startIndex, endIndex);
    const topSpacer = startIndex * rowHeight;
    const bottomSpacer = (total - endIndex) * rowHeight;

    return { visible, topSpacer, bottomSpacer, total, scrollTop, setScrollTop, containerRef };
}
