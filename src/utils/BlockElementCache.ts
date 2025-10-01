import React from 'react';

export interface CachedElementEntry {
    id: string;
    element: React.ReactElement;
    version: number; // incrementa quando bloco muda
    lastUsedAt: number;
}

export class BlockElementCache {
    private map = new Map<string, CachedElementEntry>();
    private renderVersions = new Map<string, number>();
    private maxSize: number;
    private ttlMs: number; // tempo máximo sem uso antes de expirar

    constructor(options: { maxSize?: number; ttlMs?: number } = {}) {
        this.maxSize = options.maxSize ?? 500;
        this.ttlMs = options.ttlMs ?? 60_000; // padrão 60s
    }

    get(id: string): React.ReactElement | null {
        const entry = this.map.get(id);
        if (!entry) return null;
        entry.lastUsedAt = Date.now();
        return entry.element;
    }

    set(id: string, element: React.ReactElement): void {
        const v = (this.renderVersions.get(id) || 0) + 1;
        this.renderVersions.set(id, v);
        this.map.set(id, { id, element, version: v, lastUsedAt: Date.now() });
        this.prune();
    }

    invalidate(id: string): void {
        this.map.delete(id);
        this.renderVersions.delete(id);
    }

    bulkInvalidate(ids: string[]): void {
        ids.forEach(id => this.invalidate(id));
    }

    touch(ids: string[]): void {
        const now = Date.now();
        ids.forEach(id => {
            const entry = this.map.get(id);
            if (entry) entry.lastUsedAt = now;
        });
    }

    stats() {
        return {
            size: this.map.size,
            ids: Array.from(this.map.keys()),
            versions: Array.from(this.renderVersions.entries()).map(([id, v]) => ({ id, v }))
        };
    }

    prune(): void {
        const now = Date.now();
        // TTL pruning
        for (const [id, entry] of this.map.entries()) {
            if (now - entry.lastUsedAt > this.ttlMs) {
                this.invalidate(id);
            }
        }
        // LRU pruning se acima do maxSize
        if (this.map.size <= this.maxSize) return;
        const sorted = Array.from(this.map.values()).sort((a, b) => a.lastUsedAt - b.lastUsedAt);
        const excess = sorted.length - this.maxSize;
        for (let i = 0; i < excess; i++) {
            this.invalidate(sorted[i].id);
        }
    }
}
export const globalBlockElementCache = new BlockElementCache({ maxSize: 800, ttlMs: 120_000 });
