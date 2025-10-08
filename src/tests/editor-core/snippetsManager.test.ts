import { describe, it, beforeEach, expect } from 'vitest';
import { snippetsManager } from '@/utils/snippetsManager';

// Mock simples de localStorage
class MemoryStorage {
    store: Record<string, string> = {};
    getItem(k: string) { return this.store[k] ?? null; }
    setItem(k: string, v: string) { this.store[k] = v; }
    removeItem(k: string) { delete this.store[k]; }
    clear() { this.store = {}; }
}

// @ts-ignore
global.window = global.window || {};
if (!(global.window as any).localStorage) {
    Object.defineProperty(global.window, 'localStorage', {
        value: new MemoryStorage(),
        writable: false,
        configurable: true
    });
}
// Evita atribuição direta a global.localStorage (readonly em alguns ambientes)

describe('snippetsManager', () => {
    beforeEach(() => {
        // @ts-ignore
        global.localStorage.clear();
    });

    it('cria e lista snippet', () => {
        const snip = snippetsManager.create('Meu Snippet', [{ id: 'b1', type: 'heading' }]);
        const list = snippetsManager.list();
        expect(list.length).toBe(1);
        expect(list[0].name).toBe('Meu Snippet');
        expect(list[0].blocks[0].id).toBe('b1');
        expect(list[0].id).toBe(snip.id);
    });

    it('atualiza snippet', () => {
        const snip = snippetsManager.create('Old', []);
        const updated = snippetsManager.update(snip.id, { name: 'New' });
        expect(updated?.name).toBe('New');
    });

    it('remove snippet', () => {
        const snip = snippetsManager.create('Temp', []);
        snippetsManager.remove(snip.id);
        expect(snippetsManager.list().length).toBe(0);
    });
});
