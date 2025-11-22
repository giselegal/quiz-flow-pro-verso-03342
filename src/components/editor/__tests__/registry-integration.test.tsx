/**
 * 🧪 TESTE DE INTEGRAÇÃO - Registry Bridge
 * 
 * Valida que o editor tem acesso aos tipos do core/quiz através do bridge.
 * Testes simplificados para validar funcionalidade essencial.
 * 
 * @group integration
 * @module components/editor
 */

import { describe, it, expect } from 'vitest';
import { getBridgeStats, initializeRegistryBridge } from '../../../core/registry/bridge';
import { BlockRegistry } from '../../../core/quiz/blocks/registry';

describe('Editor Registry Integration', () => {
    describe('Bridge Initialization', () => {
        it('should initialize bridge successfully', () => {
            const result = initializeRegistryBridge();

            expect(result).toBeDefined();
            expect(result.success).toBe(true);
            expect(result.syncedCount).toBeGreaterThan(0);
            expect(result.totalTypes).toBeGreaterThan(0);
        });

        it('should have bridge stats accessible', () => {
            const stats = getBridgeStats();

            expect(stats).toBeDefined();
            expect(stats.totalBlocks).toBeGreaterThan(0);
            expect(stats.allTypes).toBeInstanceOf(Array);
            expect(stats.allTypes.length).toBeGreaterThan(0);
        });
    });

    describe('Core/Quiz Block Registry', () => {
        it('should have access to BlockRegistry from core/quiz', () => {
            expect(BlockRegistry).toBeDefined();
            expect(typeof BlockRegistry.getAllTypes).toBe('function');
            expect(typeof BlockRegistry.getDefinition).toBe('function');
            expect(typeof BlockRegistry.hasType).toBe('function');
        });

        it('should have core/quiz types available', () => {
            const types = BlockRegistry.getAllTypes();

            expect(types).toContain('question');
            expect(types).toContain('multiple-choice');
            expect(types).toContain('intro');
            expect(types.length).toBeGreaterThan(10);
        });

        it('should get definition for core/quiz blocks', () => {
            const questionDef = BlockRegistry.getDefinition('question');

            expect(questionDef).toBeDefined();
            expect(questionDef?.type).toBe('question');
            expect(questionDef?.category).toBeDefined();
        });

        it('should resolve aliases correctly', () => {
            // 'mcq' é alias de 'multiple-choice'
            const resolvedType = BlockRegistry.resolveType('mcq');
            expect(resolvedType).toBe('multiple-choice');

            const mcqDef = BlockRegistry.getDefinition('mcq');
            expect(mcqDef).toBeDefined();
            expect(mcqDef?.type).toBe('multiple-choice');
        });

        it('should check if block types exist', () => {
            expect(BlockRegistry.hasType('question')).toBe(true);
            expect(BlockRegistry.hasType('multiple-choice')).toBe(true);
            expect(BlockRegistry.hasType('mcq')).toBe(true); // alias
            expect(BlockRegistry.hasType('non-existent-type')).toBe(false);
        });
    });

    describe('Block Categories', () => {
        it('should have definitions with categories', () => {
            const questionDef = BlockRegistry.getDefinition('question');
            expect(questionDef?.category).toBeDefined();

            const introDef = BlockRegistry.getDefinition('intro-title');
            expect(introDef?.category).toBeDefined();
        }); it('should get blocks by category', () => {
            const questionBlocks = BlockRegistry.getByCategory('question');
            expect(questionBlocks.length).toBeGreaterThan(0);

            const introBlocks = BlockRegistry.getByCategory('intro');
            expect(introBlocks.length).toBeGreaterThan(0);
        });

        it('should have blocks in different categories', () => {
            const stats = getBridgeStats();

            expect(stats.byCategory).toBeDefined();
            expect(stats.byCategory.question).toBeGreaterThan(0);
            expect(stats.byCategory.intro).toBeGreaterThan(0);
            expect(stats.byCategory.result).toBeGreaterThan(0);
        });
    });

    describe('Block Definitions', () => {
        it('should have valid structure for all blocks', () => {
            const allTypes = BlockRegistry.getAllTypes();

            allTypes.forEach(type => {
                const def = BlockRegistry.getDefinition(type);

                expect(def).toBeDefined();
                expect(def?.type).toBe(type);
                expect(def?.category).toBeDefined();
                expect(def?.defaultProperties).toBeDefined();
                expect(Array.isArray(def?.properties)).toBe(true);
            });
        });

        it('should have default properties for all blocks', () => {
            const questionDef = BlockRegistry.getDefinition('question');

            expect(questionDef?.defaultProperties).toBeDefined();
            expect(typeof questionDef?.defaultProperties).toBe('object');
        });

        it('should have properties array defined', () => {
            const questionDef = BlockRegistry.getDefinition('question');

            expect(Array.isArray(questionDef?.properties)).toBe(true);
            expect(questionDef?.properties.length).toBeGreaterThan(0);
        });
    }); describe('Block Aliases', () => {
        it('should have aliases for common blocks', () => {
            const mcqAliases = BlockRegistry.getAliases('multiple-choice');

            expect(mcqAliases).toContain('mcq');
            expect(mcqAliases.length).toBeGreaterThan(0);
        });

        it('should resolve all aliases correctly', () => {
            const allTypes = BlockRegistry.getAllTypes();

            allTypes.forEach(type => {
                const aliases = BlockRegistry.getAliases(type);

                aliases.forEach(alias => {
                    const resolved = BlockRegistry.resolveType(alias);
                    expect(resolved).toBe(type);
                });
            });
        });
    });

    describe('Integration Health Check', () => {
        it('should have all critical blocks available', () => {
            const criticalBlocks = [
                'question',
                'multiple-choice',
                'intro',
                'result',
                'text',
                'button'
            ];

            criticalBlocks.forEach(type => {
                const hasBlock = BlockRegistry.hasType(type);
                expect(hasBlock).toBe(true);
            });
        });

        it('should have bridge synchronized with core/quiz', () => {
            const bridgeStats = getBridgeStats();
            const coreTypes = BlockRegistry.getAllTypes();

            expect(bridgeStats.totalBlocks).toBe(coreTypes.length);
            expect(bridgeStats.allTypes).toEqual(coreTypes);
        });

        it('should not have errors in bridge initialization', () => {
            const result = initializeRegistryBridge();

            expect(result.error).toBeUndefined();
            expect(result.success).toBe(true);
        });
    });
});