export interface VirtualWindowResult<T> {
    enabled: boolean;
    visible: T[];
    topSpacer: number;
    bottomSpacer: number;
}

export interface ComputeVirtualWindowOptions<T> {
    items: T[];
    getKey?: (item: T) => any; // reservado para heurísticas futuras
    scrollTop: number;
    viewportHeight: number;
    estimatedRowHeight: number;
    overscan: number;
    threshold: number; // quantidade mínima para ativar
    disable?: boolean; // força desativação (ex: drag em progresso)
}

/**
 * Calcula janela de virtualização simples (lista vertical homogênea aproximada).
 * Mantido puro para testes unitários.
 */
export function computeVirtualWindow<T>(opts: ComputeVirtualWindowOptions<T>): VirtualWindowResult<T> {
    const { items, scrollTop, viewportHeight, estimatedRowHeight, overscan, threshold, disable } = opts;
    if (disable || items.length <= threshold) {
        return { enabled: false, visible: items, topSpacer: 0, bottomSpacer: 0 };
    }
    const total = items.length;
    const startIndex = Math.max(Math.floor(scrollTop / estimatedRowHeight) - overscan, 0);
    const viewportCount = Math.ceil(viewportHeight / estimatedRowHeight) + overscan * 2;
    const endIndex = Math.min(startIndex + viewportCount, total);
    const visible = items.slice(startIndex, endIndex);
    return {
        enabled: true,
        visible,
        topSpacer: startIndex * estimatedRowHeight,
        bottomSpacer: (total - endIndex) * estimatedRowHeight,
    };
}

// Helper para cenários de teste sintéticos
export function simulateWindow(total: number, cfg: Omit<ComputeVirtualWindowOptions<number>, 'items'>) {
    return computeVirtualWindow({ ...cfg, items: Array.from({ length: total }, (_, i) => i) });
}
