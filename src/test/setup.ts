/**
 * 🧪 SETUP DE TESTES - Configuração global para Vitest
 */

import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

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

// Mock global do matchMedia
if (typeof window !== 'undefined') {
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