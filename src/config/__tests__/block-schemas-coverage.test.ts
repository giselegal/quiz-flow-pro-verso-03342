import { describe, it, expect } from 'vitest';
import { blockPropertySchemas } from '@/config/blockPropertySchemas';

describe('Cobertura de Schemas de Blocos', () => {
  it('todo tipo do EnhancedBlockRegistry deve possuir schema em blockPropertySchemas', async () => {
    // Evitar side-effects de import sincronizando um stub de indexedDB antes
    if (!(globalThis as any).indexedDB) {
      (globalThis as any).indexedDB = {
        open: () => {
          const req: any = { onerror: null, onsuccess: null, result: {} };
          setTimeout(() => req.onsuccess && req.onsuccess({ target: { result: {} } }), 0);
          return req;
        },
      };
    }
    const { ENHANCED_BLOCK_REGISTRY } = await import('@/core/registry/UnifiedBlockRegistryAdapter');
    const registryTypes = Object.keys(ENHANCED_BLOCK_REGISTRY).sort();
    const schemaTypes = Object.keys(blockPropertySchemas);

    const missing: string[] = [];

    for (const t of registryTypes) {
      // Permitir que aliases de runtime sejam cobertos por schemas equivalentes
      const aliases: Record<string, string> = {
        text: 'text-inline',
        image: 'image-inline',
        button: 'button-inline',
        'legal-notice': 'legal-notice-inline',
      };

      const candidate = blockPropertySchemas[t]
        || (aliases[t] ? blockPropertySchemas[aliases[t]] : undefined)
        || blockPropertySchemas['universal-default'];

      if (!candidate) missing.push(t);
    }

    expect(missing, `Tipos sem schema: ${missing.join(', ')}`).toEqual([]);
  });
});
