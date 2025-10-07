import { vi } from 'vitest';

// Mock indexedDB mínimo para evitar erros em hooks que o utilizam
if (typeof (global as any).indexedDB === 'undefined') {
  (global as any).indexedDB = {
    open: () => ({ addEventListener() {}, result: {}, onsuccess: null, onerror: null })
  };
}

// Mock localStorage simples
if (typeof (global as any).localStorage === 'undefined') {
  const store: Record<string, string> = {};
  (global as any).localStorage = {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };
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
} catch {}

// Ajustar timers para testes que usam setTimeout curto
vi.useFakeTimers();
