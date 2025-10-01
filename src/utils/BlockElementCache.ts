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
}

export const globalBlockElementCache = new BlockElementCache();
