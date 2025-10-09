import { vi } from 'vitest';

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

// Mock fetch para impedir chamadas HTTP reais durante testes (evita ECONNREFUSED)
if (typeof (global as any).fetch === 'undefined' || !(global as any).__FETCH_MOCK_INSTALLED__) {
    const mockFetch: typeof fetch = async (input: any, init?: any) => {
        const url = typeof input === 'string' ? input : input?.url || '';
        // Interceptar chamadas a localhost ou rotas /api/components
        if (/localhost:3000|:\\?3000|\/api\/components\//i.test(url)) {
            // Retornar resposta simulada mínima
            return new Response(JSON.stringify({}), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }) as any;
        }
        // Fallback padrão: resposta vazia
        return new Response(JSON.stringify({}), { status: 200, headers: { 'Content-Type': 'application/json' } }) as any;
    };
    (global as any).fetch = mockFetch;
    (global as any).__FETCH_MOCK_INSTALLED__ = true;
}
