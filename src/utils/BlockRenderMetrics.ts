const counters = new Map<string, number>();

export function incrementBlockRender(id: string) {
    counters.set(id, (counters.get(id) || 0) + 1);
}

export function getBlockRenderCount(id: string): number {
    return counters.get(id) || 0;
}

export function getTopRendered(limit = 10) {
    return Array.from(counters.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([id, count]) => ({ id, count }));
}

export function allRenderStats() {
    return {
        total: counters.size,
        entries: Array.from(counters.entries())
    };
}
