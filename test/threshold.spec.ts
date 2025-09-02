import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock StorageService localStorage/sessionStorage em ambiente de teste
const store: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: (k: string) => store[k] ?? null,
  setItem: (k: string, v: string) => { store[k] = v; },
  removeItem: (k: string) => { delete store[k]; },
});
vi.stubGlobal('sessionStorage', {
  getItem: (k: string) => store[k] ?? null,
  setItem: (k: string, v: string) => { store[k] = v; },
  removeItem: (k: string) => { delete store[k]; },
});

describe('UnifiedQuizStorage threshold', () => {
  beforeEach(() => {
    for (const k of Object.keys(store)) delete store[k];
  });

  it('requires at least 8 selections and a name', async () => {
    const mod = await import('@/services/core/UnifiedQuizStorage');
    const { unifiedQuizStorage } = mod as any;
    // save minimal data
    const data = unifiedQuizStorage.loadData();
    data.selections = { a: ['1'], b: ['2'], c: ['3'] } as any;
    data.formData = { userName: '' } as any;
    unifiedQuizStorage.saveData(data);
    expect(unifiedQuizStorage.hasEnoughDataForResult()).toBe(false);

    data.selections = { s1: ['1'], s2: ['2'], s3: ['3'], s4: ['4'], s5: ['5'], s6: ['6'], s7: ['7'], s8: ['8'] } as any;
    data.formData = { userName: 'Ana' } as any;
    unifiedQuizStorage.saveData(data);
    expect(unifiedQuizStorage.hasEnoughDataForResult()).toBe(true);
  });
});
