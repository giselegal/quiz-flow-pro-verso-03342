/**
 * 🧪 TESTES - Block Adapters v3 ↔ v4
 * 
 * Testes para conversão bidirecional entre versões de blocos
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
    BlockV3ToV4Adapter,
    BlockV4ToV3Adapter,
    ensureV4Block,
    ensureV3Block,
    normalizeToV4,
    normalizeToV3,
    isV4Block,
    isV3Block,
} from '../adapters';
import type { Block } from '@/types/editor';
import type { QuizBlock } from '@/schemas/quiz-schema.zod';
import { BlockRegistry } from '../registry';

describe('BlockV3ToV4Adapter', () => {
    it('deve converter bloco v3 simples para v4', () => {
        const v3Block: Block = {
            id: 'block-1',
            type: 'text',
            order: 0,
            properties: {},
            content: {
                text: 'Hello World',
            },
        };

        const v4Block = BlockV3ToV4Adapter.convert(v3Block);

        expect(v4Block).toMatchObject({
            id: 'block-1',
            type: 'text',
            order: 0,
            properties: {
                text: 'Hello World', // content mesclado em properties
            },
            parentId: null,
        });
        expect(v4Block.metadata).toBeDefined();
    });

    it('deve mesclar properties e content em properties unificado', () => {
        const v3Block: Block = {
            id: 'block-2',
            type: 'heading' as any,
            order: 1,
            properties: {
                level: 2,
            },
            content: {
                text: 'Título',
            },
        };

        const v4Block = BlockV3ToV4Adapter.convert(v3Block);

        expect(v4Block.properties).toEqual({
            level: 2,
            text: 'Título',
        });
    });

    it('deve adicionar valores padrão da definição do registry', () => {
        const v3Block: Block = {
            id: 'block-3',
            type: 'button',
            order: 0,
            properties: {},
            content: {},
        };

        const v4Block = BlockV3ToV4Adapter.convert(v3Block);
        const definition = BlockRegistry.getDefinition('button');

        // Deve ter valores padrão da definição
        expect(v4Block.properties).toMatchObject(definition?.defaultProperties || {});
    });

    it('deve converter array de blocos', () => {
        const v3Blocks: Block[] = [
            { id: 'b1', type: 'text', order: 0, properties: {}, content: {} },
            { id: 'b2', type: 'heading' as any, order: 1, properties: {}, content: {} },
        ];

        const v4Blocks = BlockV3ToV4Adapter.convertMany(v3Blocks);

        expect(v4Blocks).toHaveLength(2);
        expect(v4Blocks[0].id).toBe('b1');
        expect(v4Blocks[1].id).toBe('b2');
    });

    it('deve preservar ordem dos blocos', () => {
        const v3Blocks: Block[] = [
            { id: 'b1', type: 'text', order: 5, properties: {}, content: {} },
            { id: 'b2', type: 'text', order: 10, properties: {}, content: {} },
        ];

        const v4Blocks = BlockV3ToV4Adapter.convertWithOrder(v3Blocks);

        expect(v4Blocks[0].order).toBe(5);
        expect(v4Blocks[1].order).toBe(10);
    });

    it('deve resolver aliases via registry', () => {
        const v3Block: Block = {
            id: 'block-4',
            type: 'img' as any, // alias para 'image'
            order: 0,
            properties: {},
            content: {},
        };

        const v4Block = BlockV3ToV4Adapter.convert(v3Block);

        expect(v4Block.type).toBe('image'); // tipo oficial
    });
});

describe('BlockV4ToV3Adapter', () => {
    it('deve converter bloco v4 para v3', () => {
        const v4Block: QuizBlock = {
            id: 'block-1',
            type: 'text',
            order: 0,
            properties: {
                content: 'Hello World',
            },
            parentId: null,
            metadata: {
                editable: true,
                reorderable: true,
                reusable: true,
                deletable: true,
            },
        };

        const v3Block = BlockV4ToV3Adapter.convert(v4Block);

        expect(v3Block).toMatchObject({
            id: 'block-1',
            type: 'text',
            order: 0,
        });
        expect(v3Block.content).toBeDefined();
        expect(v3Block.properties).toBeDefined();
    });

    it('deve separar properties em properties e content', () => {
        const v4Block: QuizBlock = {
            id: 'block-2',
            type: 'heading' as any,
            order: 0,
            properties: {
                level: 2,
                text: 'Título muito longo que deveria ir para content porque é uma string grande',
            },
            parentId: null,
            metadata: {
                editable: true,
                reorderable: true,
                reusable: true,
                deletable: true,
            },
        };

        const v3Block = BlockV4ToV3Adapter.convert(v4Block);

        // Level deve estar em properties
        expect(v3Block.properties).toBeDefined();
        expect(v3Block.properties?.level).toBe(2);

        // Text longo pode estar em content ou properties dependendo da heurística
        expect(v3Block.content).toBeDefined();
    });

    it('deve converter array de blocos v4 para v3', () => {
        const v4Blocks: QuizBlock[] = [
            { id: 'b1', type: 'text', order: 0, properties: {}, parentId: null, metadata: { editable: true, reorderable: true, reusable: true, deletable: true } },
            { id: 'b2', type: 'heading' as any, order: 1, properties: {}, parentId: null, metadata: { editable: true, reorderable: true, reusable: true, deletable: true } },
        ];

        const v3Blocks = BlockV4ToV3Adapter.convertMany(v4Blocks);

        expect(v3Blocks).toHaveLength(2);
        expect(v3Blocks[0].id).toBe('b1');
        expect(v3Blocks[1].id).toBe('b2');
    });
});

describe('Type Guards', () => {
    it('isV4Block deve identificar blocos v4', () => {
        const v4Block: QuizBlock = {
            id: 'block-1',
            type: 'text',
            order: 0,
            properties: {},
            parentId: null,
            metadata: {
                editable: true,
                reorderable: true,
                reusable: true,
                deletable: true,
            },
        };

        expect(isV4Block(v4Block)).toBe(true);
    });

    it('isV3Block deve identificar blocos v3', () => {
        const v3Block: Block = {
            id: 'block-1',
            type: 'text',
            order: 0,
            properties: {},
            content: {},
        };

        expect(isV3Block(v3Block)).toBe(true);
    });

    it('deve retornar false para objetos inválidos', () => {
        expect(isV4Block(null)).toBe(false);
        expect(isV4Block(undefined)).toBe(false);
        expect(isV4Block({})).toBe(false);
        expect(isV4Block({ id: 'test' })).toBe(false);

        expect(isV3Block(null)).toBe(false);
        expect(isV3Block(undefined)).toBe(false);
        expect(isV3Block({})).toBe(false);
    });
});

describe('Utility Functions', () => {
    it('ensureV4Block deve converter v3 para v4', () => {
        const v3Block: Block = {
            id: 'block-1',
            type: 'text',
            order: 0,
            properties: {},
            content: {},
        };

        const result = ensureV4Block(v3Block);

        expect(isV4Block(result)).toBe(true);
        expect(result.id).toBe('block-1');
    });

    it('ensureV4Block deve retornar v4 inalterado', () => {
        const v4Block: QuizBlock = {
            id: 'block-1',
            type: 'text',
            order: 0,
            properties: {},
            parentId: null,
            metadata: {
                editable: true,
                reorderable: true,
                reusable: true,
                deletable: true,
            },
        };

        const result = ensureV4Block(v4Block);

        expect(result).toBe(v4Block); // Deve ser o mesmo objeto
    });

    it('ensureV3Block deve converter v4 para v3', () => {
        const v4Block: QuizBlock = {
            id: 'block-1',
            type: 'text',
            order: 0,
            properties: {},
            parentId: null,
            metadata: {
                editable: true,
                reorderable: true,
                reusable: true,
                deletable: true,
            },
        };

        const result = ensureV3Block(v4Block);

        expect(isV3Block(result)).toBe(true);
        expect(result.id).toBe('block-1');
    });

    it('normalizeToV4 deve converter array misto', () => {
        const v3Block: Block = {
            id: 'b1',
            type: 'text',
            order: 0,
            properties: {},
            content: {},
        };

        const v4Block: QuizBlock = {
            id: 'b2',
            type: 'heading' as any,
            order: 1,
            properties: {},
            parentId: null,
            metadata: {
                editable: true,
                reorderable: true,
                reusable: true,
                deletable: true,
            },
        };

        const mixed = [v3Block, v4Block];
        const result = normalizeToV4(mixed);

        expect(result).toHaveLength(2);
        expect(isV4Block(result[0])).toBe(true);
        expect(isV4Block(result[1])).toBe(true);
    });

    it('normalizeToV3 deve converter array misto', () => {
        const v3Block: Block = {
            id: 'b1',
            type: 'text',
            order: 0,
            properties: {},
            content: {},
        };

        const v4Block: QuizBlock = {
            id: 'b2',
            type: 'heading' as any,
            order: 1,
            properties: {},
            parentId: null,
            metadata: {
                editable: true,
                reorderable: true,
                reusable: true,
                deletable: true,
            },
        };

        const mixed = [v3Block, v4Block];
        const result = normalizeToV3(mixed);

        expect(result).toHaveLength(2);
        expect(isV3Block(result[0])).toBe(true);
        expect(isV3Block(result[1])).toBe(true);
    });
});

describe('Conversão Bidirecional', () => {
    it('deve manter dados após conversão v3 → v4 → v3', () => {
        const original: Block = {
            id: 'block-test',
            type: 'heading' as any,
            order: 5,
            properties: {
                level: 2,
            },
            content: {
                text: 'Test',
            },
            metadata: {
                editable: true,
                reorderable: true,
                reusable: true,
                deletable: true,
            },
        };

        // v3 → v4
        const v4 = BlockV3ToV4Adapter.convert(original);

        // v4 → v3
        const back = BlockV4ToV3Adapter.convert(v4);

        // Deve preservar dados essenciais
        expect(back.id).toBe(original.id);
        expect(back.type).toBe(original.type);
        expect(back.order).toBe(original.order);
        expect(back.metadata?.editable).toBe(true);
    });

    it('deve manter dados após conversão v4 → v3 → v4', () => {
        const original: QuizBlock = {
            id: 'block-test',
            type: 'text',
            order: 3,
            properties: {
                content: 'Test content',
            },
            parentId: null,
            metadata: {
                editable: false,
                reorderable: true,
                reusable: true,
                deletable: true,
            },
        };

        // v4 → v3
        const v3 = BlockV4ToV3Adapter.convert(original);

        // v3 → v4
        const back = BlockV3ToV4Adapter.convert(v3);

        // Deve preservar dados essenciais
        expect(back.id).toBe(original.id);
        expect(back.type).toBe(original.type);
        expect(back.order).toBe(original.order);
    });
});
