import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Setup global test environment
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];

  constructor() {}
  observe() {}
  disconnect() {}
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};

// Desativar persistência pesada do Editor durante testes
// Os hooks e providers verificam esta flag antes de salvar grandes estados
(window as any).__DISABLE_EDITOR_PERSISTENCE__ = true;

// Mock StorageService indireto via localStorage para evitar quota/IO em CI
const memoryStore = new Map<string, string>();
vi.stubGlobal('localStorage', {
  getItem: (k: string) => (memoryStore.has(k) ? memoryStore.get(k)! : null),
  setItem: (k: string, v: string) => void memoryStore.set(k, String(v)),
  removeItem: (k: string) => void memoryStore.delete(k),
  clear: () => void memoryStore.clear(),
  key: (i: number) => Array.from(memoryStore.keys())[i] || null,
  get length() {
    return memoryStore.size;
  },
});
vi.stubGlobal('sessionStorage', {
  getItem: (k: string) => (memoryStore.has(`s:${k}`) ? memoryStore.get(`s:${k}`)! : null),
  setItem: (k: string, v: string) => void memoryStore.set(`s:${k}`, String(v)),
  removeItem: (k: string) => void memoryStore.delete(`s:${k}`),
  clear: () => {
    for (const key of Array.from(memoryStore.keys())) {
      if (key.startsWith('s:')) memoryStore.delete(key);
    }
  },
  key: (i: number) => Array.from(memoryStore.keys()).filter(k => k.startsWith('s:'))[i] || null,
  get length() {
    return Array.from(memoryStore.keys()).filter(k => k.startsWith('s:')).length;
  },
});

// Mantemos timers originais; evitar mocks que possam causar recursão em libs
