/**
 * 🎯 CONFIGURAÇÃO DOS TESTES DE RENDERIZAÇÃO
 * 
 * Setup e utilitários para testes de componentes React
 */

require('@testing-library/jest-dom');
const { cleanup } = require('@testing-library/react');

// Configurações globais para os testes
beforeEach(() => {
    // Limpar localStorage e sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Resetar mocks
    jest.clearAllMocks();

    // Suprimir warnings desnecessários durante testes
    const originalError = console.error;
    beforeAll(() => {
        console.error = (...args) => {
            if (
                typeof args[0] === 'string' &&
                args[0].includes('Warning: ReactDOM.render is no longer supported')
            ) {
                return;
            }
            originalError.call(console, ...args);
        };
    });

    afterAll(() => {
        console.error = originalError;
    });
});

afterEach(() => {
    cleanup();
});

// Mock global do ResizeObserver (usado em alguns componentes)
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock global do matchMedia (para testes de responsividade)
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock do IntersectionObserver (usado em lazy loading)
global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
}));

// Timeout personalizado para testes assíncronos
jest.setTimeout(10000);