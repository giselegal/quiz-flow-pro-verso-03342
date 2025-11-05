/**
 * 🧪 SETUP DE TESTES - Configuração global para Vitest
 */

import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import React from 'react';
// Carrega polyfill robusto de matchMedia ANTES de qualquer import que possa usar
import '@/test/polyfills/matchMedia';
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