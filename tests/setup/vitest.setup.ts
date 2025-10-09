import { vi } from 'vitest';

// ============================================================================
// MOCK DE FETCH (colocado no topo para garantir aplicação antes de imports que o usem)
// ============================================================================
; (function ensureFetchMock() {
    const shouldInstall = true; // Forçar instalação sempre
    if (shouldInstall) {
        const mockFetch: typeof fetch = async (input: any, init?: any) => {
            const url = typeof input === 'string' ? input : input?.url || '';
            // Interceptar qualquer chamada a localhost:3000 ou rota /api/
            if (/localhost:3000|:\\?3000|\/_?api\//i.test(url)) {
                return new Response(JSON.stringify({ mock: true, url, ok: true }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }) as any;
            }
            return new Response(JSON.stringify({ mock: true, url }), { status: 200, headers: { 'Content-Type': 'application/json' } }) as any;
        };
        (global as any).fetch = mockFetch;
    }
})();

// Mock indexedDB mínimo para evitar erros em hooks que o utilizam
if (typeof (global as any).indexedDB === 'undefined') {
    (global as any).indexedDB = {
        open: () => ({ addEventListener() { }, result: {}, onsuccess: null, onerror: null })
    };
}

// Mock localStorage simples
if (typeof (global as any).localStorage === 'undefined') {
    const store: Record<string, string> = {};
    (global as any).localStorage = {
        getItem: (k: string) => (k in store ? store[k] : null),
        setItem: (k: string, v: string) => { store[k] = String(v); },
        removeItem: (k: string) => { delete store[k]; },
        clear: () => { Object.keys(store).forEach(k => delete store[k]); }
    } as Storage;
}

// Evitar ruído de consola em testes (pode ajustar conforme necessidade)
const originalError = console.error;
console.error = (...args) => {
    if (/(Warning: ReactDOM.render is no longer supported|deprecated)/i.test(args[0])) return;
    originalError(...args);
};

// Registrar steps de produção se disponível (try/catch para evitar falhas em imports parciais)
try {
    const { registerProductionSteps } = require('@/components/editor/unified');
    registerProductionSteps?.();
} catch { }

// Ajustar timers para testes que usam setTimeout curto
vi.useFakeTimers();

// (Removido bloco anterior de mock duplicado)
