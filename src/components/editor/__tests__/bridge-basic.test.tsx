/**
 * 🧪 TESTE BÁSICO DE INTEGRAÇÃO - Registry Bridge
 * 
 * Testa apenas a funcionalidade essencial do bridge para garantir que
 * o editor tem acesso ao core/quiz.
 * 
 * @group integration
 * @module components/editor
 */

import { describe, it, expect } from 'vitest';
import { getBridgeStats, initializeRegistryBridge } from '../../../core/registry/bridge';
import { BlockRegistry } from '../../../core/quiz/blocks/registry';

describe('Editor -> Core/Quiz Integration (Essential)', () => {
    describe('Bridge Works', () => {
        it('✅ Bridge initializes successfully', () => {
            const result = initializeRegistryBridge();

            expect(result.success).toBe(true);
            expect(result.syncedCount).toBeGreaterThan(0);
        });

        it('✅ Bridge provides stats', () => {
            const stats = getBridgeStats();

            expect(stats.totalBlocks).toBeGreaterThan(0);
            expect(Array.isArray(stats.allTypes)).toBe(true);
        });
    });

    describe('BlockRegistry Access', () => {
        it('✅ BlockRegistry is accessible', () => {
            expect(BlockRegistry).toBeDefined();
            expect(typeof BlockRegistry.getAllTypes).toBe('function');
        });

        it('✅ Can list block types', () => {
            const types = BlockRegistry.getAllTypes();

            expect(Array.isArray(types)).toBe(true);
            expect(types.length).toBeGreaterThan(0);
        });

        it('✅ Can get block definitions', () => {
            const types = BlockRegistry.getAllTypes();
            const firstType = types[0];
            const def = BlockRegistry.getDefinition(firstType);

            expect(def).toBeDefined();
            expect(def?.type).toBe(firstType);
        });
    });

    describe('Integration Complete', () => {
        it('✅ Editor can use core/quiz blocks', () => {
            // Simula o fluxo que o editor usaria:
            // 1. Inicializa bridge
            const initResult = initializeRegistryBridge();
            expect(initResult.success).toBe(true);

            // 2. Lista tipos disponíveis
            const types = BlockRegistry.getAllTypes();
            expect(types.length).toBeGreaterThan(0);

            // 3. Busca definição de um bloco
            if (types.length > 0) {
                const def = BlockRegistry.getDefinition(types[0]);
                expect(def).toBeDefined();
            }

            // 4. Verifica stats
            const stats = getBridgeStats();
            expect(stats.totalBlocks).toBe(types.length);
        });
    });
});
