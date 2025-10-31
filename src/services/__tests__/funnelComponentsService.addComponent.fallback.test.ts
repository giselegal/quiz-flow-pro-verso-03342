import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do cliente Supabase
vi.mock('@/integrations/supabase/customClient', () => {
  // estado interno para controlar respostas por tabela
  const handlers: Record<string, any> = {
    component_types: {
      select: () => ({ data: [], error: null }),
    },
    component_instances: {
      // Primeiro insert falha com schema antigo (coluna desconhecida)
      insert: vi
        .fn()
        .mockImplementationOnce((_payload: any) => ({
          select: () => ({ single: () => Promise.resolve({ data: null, error: { code: '42703', message: 'column properties does not exist' } }) }),
        }))
        .mockImplementationOnce((payload: any) => ({
          select: () => ({ single: () => Promise.resolve({ data: { id: 'legacy-1', ...payload }, error: null }) }),
        })),
    },
  };

  const supabase = {
    from: (table: string) => ({
      select: (_cols?: string) => handlers[table].select(),
      insert: (payload: any) => handlers[table].insert(payload),
      delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
      update: () => ({ eq: () => Promise.resolve({ data: {}, error: null }) }),
      eq: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
      order: () => Promise.resolve({ data: [], error: null }),
    }),
    rpc: vi.fn(),
  } as any;

  return { supabase };
});

import { funnelComponentsService } from '../funnelComponentsService';

describe('funnelComponentsService.addComponent - fallback legado', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('usa payload legado quando schema novo falha (42703)', async () => {
    const result = await funnelComponentsService.addComponent({
      funnelId: 'f1',
      stepNumber: 1,
      instanceKey: 'inst-1',
      componentTypeKey: 'unknown-type',
      orderIndex: 1,
      properties: { text: 'hello' },
    });

    expect(result).toBeTruthy();
    expect(result.id).toBe('legacy-1');
  });
});
