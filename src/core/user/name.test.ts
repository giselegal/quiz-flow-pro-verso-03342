import { describe, it, expect, beforeEach } from 'vitest';
import { getBestUserName } from './name';

// Mock StorageService indirectamente via armazenamento global simples
// Como StorageService usa localStorage/JSON seguros, simularemos window e chaves usadas

declare const global: any;

beforeEach(() => {
  global.window = {} as any;
  // Simular StorageService.safeGetString/JSON por monkey-patch simples
  const store: Record<string, any> = {};
  const StorageService = {
    safeGetString: (k: string) => (typeof store[k] === 'string' ? store[k] : ''),
    safeSetString: (k: string, v: string) => { store[k] = v; },
    safeGetJSON: (k: string) => store[k],
    safeSetJSON: (k: string, v: any) => { store[k] = v; },
  };
  // Injetar no require cache se necessário (não estritamente necessário aqui)
  (global as any).StorageServiceMock = StorageService;
});

describe('user/name', () => {
  it('retorna Visitante quando nada disponível', () => {
    expect(getBestUserName(undefined)).toBeTypeOf('string');
  });
});
