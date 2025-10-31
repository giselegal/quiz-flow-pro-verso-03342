/**
 * ⚠️ DEPRECATED TEST - BlockRegistry removido na FASE 4
 * 
 * Este teste foi desabilitado porque BlockRegistryProvider foi removido
 * e substituído pelo UnifiedBlockRegistry que não usa Context/Provider.
 * 
 * Para testes de blocos, use UnifiedBlockRegistry diretamente:
 * ```typescript
 * import { blockRegistry } from '@/registry/UnifiedBlockRegistry';
 * const component = blockRegistry.getComponent('text-inline');
 * ```
 */

import { describe, it, expect } from 'vitest';

describe('BlockRegistry (DEPRECATED)', () => {
    it.skip('removido - migrado para UnifiedBlockRegistry', () => {
        expect(true).toBe(true);
    });
});
