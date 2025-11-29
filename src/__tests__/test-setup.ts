/**
 * 🧪 SETUP DE TESTES - Configuração global para Vitest
 */

import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import React from 'react';

// Polyfill de matchMedia inline
if (typeof window !== 'undefined' && !window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
}

// Stub de IndexedDB para testes que carregam serviços de storage/imagens
// Nota: reutiliza o mock mais completo já presente no repositório
import '../__tests__/setup/indexeddb.mock';

// Mock global de next-themes para evitar dependências de DOM complexas nos testes
vi.mock('next-themes', () => {
    return {
        ThemeProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
        useTheme: () => ({ theme: 'light', setTheme: () => { } }),
    };
});

// Estende os matchers do Vitest com os do jest-dom
expect.extend(matchers);

// Assegura que o `expect` global aponte para o `expect` do Vitest.
// Em alguns ambientes/mocks antigos o `expect` pode ser substituído por Chai,
// causando erros como "Invalid Chai property: toHaveTextContent".
// Forçamos aqui para evitar colisões entre bibliotecas de assertion.
;(globalThis as any).expect = expect;

// Cleanup automático após cada teste
afterEach(() => {
    cleanup();
});

// Mock global do localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => {
            return store[key] || null;
        },
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

if (typeof (globalThis as any).window !== 'undefined') {
    Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
    });
} else {
    (globalThis as any).localStorage = localStorageMock;
}

// Garantir que globalThis.matchMedia referencia window.matchMedia
if (typeof window !== 'undefined') {
    (globalThis as any).matchMedia = (window as any).matchMedia;
}

// Mock global do ResizeObserver
class ResizeObserverMock {
    observe() {
        // do nothing
    }
    unobserve() {
        // do nothing
    }
    disconnect() {
        // do nothing
    }
}

if (typeof window !== 'undefined') {
    (window as any).ResizeObserver = ResizeObserverMock;
} else {
    (globalThis as any).ResizeObserver = ResizeObserverMock;
}

// Mock rápido de fetch para assets de template JSON usados pelos serviços
// Evita timeouts e falhas quando paths /templates/*.json não existem no ambiente de teste.
if (!(globalThis as any).__TEMPLATE_FETCH_MOCK_INSTALLED) {
    try {
        const originalFetch: typeof fetch | undefined = (globalThis as any).fetch;
        const mockMap: Record<string, any> = {
            '/templates/quiz21-v4.json': {
                steps: [
                    { id: 'step-01', blocks: [ { id: 'b1', type: 'TextBlock', content: { text: 'Intro' } } ] },
                    { id: 'step-02', blocks: [] }
                ]
            },
            '/templates/quiz21-complete.json': {
                steps: [
                    { id: 'step-01', blocks: [ { id: 'b1', type: 'TextBlock', content: { text: 'Intro' } } ] },
                    { id: 'step-02', blocks: [] }
                ]
            }
        };

        // Modular steps ex: /templates/step-01-v3.json
        const getModular = (url: string) => {
            const match = url.match(/\/templates\/(step-\d{2})-v3\.json/);
            if (!match) return null;
            const stepId = match[1];
            if (stepId === 'step-01') {
                return [ { id: 'b1', type: 'TextBlock', content: { text: 'Intro Modular' } } ];
            }
            return [];
        };

        if (originalFetch) {
            (globalThis as any).fetch = async (input: any, init?: any) => {
                const url = typeof input === 'string' ? input : input?.url;
                if (typeof url === 'string') {
                    if (mockMap[url]) {
                        return new Response(JSON.stringify(mockMap[url]), { status: 200, headers: { 'Content-Type': 'application/json' } });
                    }
                    const modular = getModular(url);
                    if (modular) {
                        return new Response(JSON.stringify(modular), { status: 200, headers: { 'Content-Type': 'application/json' } });
                    }
                }
                // fallback para fetch real
                return originalFetch(input, init);
            };
            (globalThis as any).__TEMPLATE_FETCH_MOCK_INSTALLED = true;
        }
    } catch (err) {
        // Silencioso: não falhar setup por mock
        // console.warn('Fetch mock setup falhou', err);
    }
}