// Pequeno util para medir desempenho de funções pontuais
export function measure<T>(label: string, fn: () => T): T {
    const enabled = (import.meta as any)?.env?.VITE_EDITOR_DEBUG_PERF === 'true';
    if (!enabled) return fn();
    const start = performance.now();
    try {
        return fn();
    } finally {
        const end = performance.now();
        // eslint-disable-next-line no-console
        console.log(`⏱️ [perf] ${label}: ${(end - start).toFixed(2)}ms`);
    }
}
