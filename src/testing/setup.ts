/**
 * 🧪 TEST SETUP - COMPREHENSIVE TESTING ENVIRONMENT
 * 
 * FASE 6: Configuração global para ambiente de testes:
 * ✅ Mocks globais e utilities
 * ✅ Setup do DOM e React Testing Library
 * ✅ Configuração de performance monitoring
 * ✅ Error handling e cleanup automático
 */

import { vi, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// === GLOBAL SETUP ===

// Performance monitoring para testes
global.testStartTime = performance.now();

// Extends expect matchers
expect.extend({
    toBeWithinRange(received: number, floor: number, ceiling: number) {
        const pass = received >= floor && received <= ceiling;
        if (pass) {
            return {
                message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
                pass: false,
            };
        }
    },
    toBePerformant(received: number, maxTime: number = 100) {
        const pass = received <= maxTime;
        if (pass) {
            return {
                message: () => `expected ${received}ms not to be performant (>${maxTime}ms)`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received}ms to be performant (<=${maxTime}ms)`,
                pass: false,
            };
        }
    }
});

// === DOM SETUP ===

// Mock do IntersectionObserver para testes de lazy loading
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock do ResizeObserver
const mockResizeObserver = vi.fn();
mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
});
window.ResizeObserver = mockResizeObserver;

// Mock do requestAnimationFrame
global.requestAnimationFrame = vi.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = vi.fn(id => clearTimeout(id));

// Mock do localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
        length: Object.keys(store).length,
        key: (index: number) => Object.keys(store)[index] || null
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock do sessionStorage
const sessionStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
        length: Object.keys(store).length,
        key: (index: number) => Object.keys(store)[index] || null
    };
})();
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// === CLEANUP AND PERFORMANCE ===

beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Clear storages
    localStorage.clear();
    sessionStorage.clear();

    // Reset performance timers
    global.testStartTime = performance.now();

    // Reset any global state
    if (global.gc) {
        global.gc(); // Force garbage collection in Node
    }
});

afterEach(() => {
    // Cleanup DOM após cada teste
    cleanup();

    // Log performance metrics
    const testDuration = performance.now() - global.testStartTime;
    if (testDuration > 1000) { // Log only slow tests
        console.warn(`⚠️ Slow test detected: ${testDuration.toFixed(2)}ms`);
    }

    // Clear timers
    vi.useRealTimers();

    // Force cleanup of any pending promises
    return new Promise(resolve => setTimeout(resolve, 0));
});

// === ERROR HANDLING ===

// Global error handler para testes
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
    // Ignora alguns erros esperados nos testes
    const errorMessage = args[0];
    if (typeof errorMessage === 'string') {
        // Ignora warnings do React durante testes
        if (errorMessage.includes('Warning: ReactDOM.render is deprecated')) return;
        if (errorMessage.includes('Warning: componentWillReceiveProps')) return;
        if (errorMessage.includes('act() warning')) return;
    }

    originalConsoleError(...args);
};

// Captura uncaught exceptions nos testes
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection in test:', reason);
    // Não falha o teste, apenas reporta
});

// === PERFORMANCE UTILITIES ===

export const measurePerformance = <T>(fn: () => T | Promise<T>, name?: string): Promise<{ result: T; duration: number }> => {
    return new Promise((resolve) => {
        const start = performance.now();

        const result = fn();

        if (result instanceof Promise) {
            result.then(res => {
                const duration = performance.now() - start;
                if (name) console.log(`📊 ${name}: ${duration.toFixed(2)}ms`);
                resolve({ result: res, duration });
            });
        } else {
            const duration = performance.now() - start;
            if (name) console.log(`📊 ${name}: ${duration.toFixed(2)}ms`);
            resolve({ result, duration });
        }
    });
};

export const expectPerformant = (actualTime: number, expectedMaxTime: number, operation: string) => {
    if (actualTime > expectedMaxTime) {
        console.warn(`⚡ Performance warning: ${operation} took ${actualTime.toFixed(2)}ms (expected <${expectedMaxTime}ms)`);
    }
    expect(actualTime).toBeLessThanOrEqual(expectedMaxTime);
};

// === MEMORY UTILITIES ===

export const measureMemory = <T>(fn: () => T | Promise<T>): Promise<{ result: T; memoryDelta: NodeJS.MemoryUsage }> => {
    return new Promise((resolve) => {
        const startMemory = process.memoryUsage();

        const result = fn();

        if (result instanceof Promise) {
            result.then(res => {
                const endMemory = process.memoryUsage();
                const memoryDelta = {
                    rss: endMemory.rss - startMemory.rss,
                    heapTotal: endMemory.heapTotal - startMemory.heapTotal,
                    heapUsed: endMemory.heapUsed - startMemory.heapUsed,
                    external: endMemory.external - startMemory.external,
                    arrayBuffers: endMemory.arrayBuffers - startMemory.arrayBuffers
                };
                resolve({ result: res, memoryDelta });
            });
        } else {
            const endMemory = process.memoryUsage();
            const memoryDelta = {
                rss: endMemory.rss - startMemory.rss,
                heapTotal: endMemory.heapTotal - startMemory.heapTotal,
                heapUsed: endMemory.heapUsed - startMemory.heapUsed,
                external: endMemory.external - startMemory.external,
                arrayBuffers: endMemory.arrayBuffers - startMemory.arrayBuffers
            };
            resolve({ result, memoryDelta });
        }
    });
};

// === TYPE EXTENSIONS ===

declare global {
    var testStartTime: number;

    namespace jest {
        interface Matchers<R> {
            toBeWithinRange(floor: number, ceiling: number): R;
            toBePerformant(maxTime?: number): R;
        }
    }
}

export { };