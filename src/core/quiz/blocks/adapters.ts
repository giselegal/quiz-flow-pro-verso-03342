/**
 * 🔄 BLOCK ADAPTERS - Conversão v3 ↔ v4
 * 
 * Adaptadores bidirecionais para migração gradual entre versões
 * de estrutura de blocos.
 * 
 * @version 1.0.0
 * @status PRODUCTION
 */

import type { QuizBlock } from '@/schemas/quiz-schema.zod';
import type { Block } from '@/types/editor';
import type { BlockInstance } from './types';
import { BlockRegistry } from './registry';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Verifica se é um bloco v4
 */
export function isV4Block(block: any): block is QuizBlock {
    return (
        block &&
        typeof block === 'object' &&
        'id' in block &&
        'type' in block &&
        'order' in block &&
        'properties' in block &&
        'metadata' in block
    );
}

/**
 * Verifica se é um bloco v3
 */
export function isV3Block(block: any): block is Block {
    return (
        block &&
        typeof block === 'object' &&
        'id' in block &&
        'type' in block &&
        ('content' in block || 'properties' in block)
    );
}

// ============================================================================
// V3 → V4 ADAPTER
// ============================================================================

/**
 * Converte um bloco v3 para v4
 */
export class BlockV3ToV4Adapter {
    /**
     * Converte um único bloco v3 para v4
     */
    static convert(v3Block: Block, order: number = 0): QuizBlock {
        appLogger.debug('Converting v3 → v4:', { v3Block, order });

        // Resolve tipo oficial via registry (pode ter alias)
        const officialType = BlockRegistry.resolveType(v3Block.type);
        const definition = BlockRegistry.getDefinition(officialType);

        // Mescla properties e content em um único objeto properties
        const mergedProperties = {
            ...(v3Block.properties || {}),
            ...(v3Block.content || {}),
        };

        // Adiciona valores padrão para propriedades faltantes
        const propertiesWithDefaults = definition
            ? { ...definition.defaultProperties, ...mergedProperties }
            : mergedProperties;

        const v4Block: QuizBlock = {
            id: v3Block.id,
            type: officialType,
            order,
            properties: propertiesWithDefaults,
            parentId: null,
            metadata: {
                component: v3Block.metadata?.component,
                editable: v3Block.metadata?.editable ?? true,
                reorderable: v3Block.metadata?.reorderable ?? true,
                reusable: v3Block.metadata?.reusable ?? true,
                deletable: v3Block.metadata?.deletable ?? true,
            },
        };

        appLogger.debug('Converted to v4:', v4Block);
        return v4Block;
    }

    /**
     * Converte array de blocos v3 para v4
     */
    static convertMany(v3Blocks: Block[]): QuizBlock[] {
        return v3Blocks.map((block, index) => this.convert(block, index));
    }

    /**
     * Converte mantendo a ordem especificada
     */
    static convertWithOrder(v3Blocks: Block[]): QuizBlock[] {
        return v3Blocks.map((block, index) => {
            const order = typeof block.order === 'number' ? block.order : index;
            return this.convert(block, order);
        });
    }
}

// ============================================================================
// V4 → V3 ADAPTER
// ============================================================================

/**
 * Converte um bloco v4 para v3
 */
export class BlockV4ToV3Adapter {
    /**
     * Converte um único bloco v4 para v3
     */
    static convert(v4Block: QuizBlock): Block {
        appLogger.debug('Converting v4 → v3:', v4Block);

        const definition = BlockRegistry.getDefinition(v4Block.type);

        // Separa properties em properties e content baseado na definição
        const { properties, content } = this.splitPropertiesAndContent(
            v4Block.properties,
            definition?.properties || []
        );

        const v3Block: Block = {
            id: v4Block.id,
            type: v4Block.type,
            order: v4Block.order,
            properties,
            content,
            metadata: {
                component: v4Block.metadata?.component,
                editable: v4Block.metadata?.editable,
                reorderable: v4Block.metadata?.reorderable,
                reusable: v4Block.metadata?.reusable,
                deletable: v4Block.metadata?.deletable,
            },
        };

        appLogger.debug('Converted to v3:', v3Block);
        return v3Block;
    }

    /**
     * Converte array de blocos v4 para v3
     */
    static convertMany(v4Blocks: QuizBlock[]): Block[] {
        return v4Blocks.map(block => this.convert(block));
    }

    /**
     * Separa properties em properties e content
     * 
     * Estratégia:
     * - Properties conhecidas vão para properties
     * - Propriedades não conhecidas vão para content
     * - 'content', 'text', 'html' sempre vão para content
     */
    private static splitPropertiesAndContent(
        allProperties: Record<string, any>,
        propertyDefinitions: any[]
    ): { properties: Record<string, any>; content: Record<string, any> } {
        const properties: Record<string, any> = {};
        const content: Record<string, any> = {};

        // Lista de keys conhecidas como properties
        const knownPropertyKeys = new Set(
            propertyDefinitions.map(def => def.key)
        );

        // Keys que sempre vão para content
        const contentKeys = new Set(['content', 'text', 'html', 'body', 'markdown']);

        for (const [key, value] of Object.entries(allProperties)) {
            if (contentKeys.has(key)) {
                content[key] = value;
            } else if (knownPropertyKeys.has(key)) {
                properties[key] = value;
            } else {
                // Heurística: strings longas vão para content
                if (typeof value === 'string' && value.length > 100) {
                    content[key] = value;
                } else {
                    properties[key] = value;
                }
            }
        }

        return { properties, content };
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Detecta automaticamente a versão e converte para v4
 */
export function ensureV4Block(block: Block | QuizBlock, order?: number): QuizBlock {
    if (isV4Block(block)) {
        return block;
    }
    return BlockV3ToV4Adapter.convert(block as Block, order);
}

/**
 * Detecta automaticamente a versão e converte para v3
 */
export function ensureV3Block(block: Block | QuizBlock): Block {
    if (isV3Block(block)) {
        return block;
    }
    return BlockV4ToV3Adapter.convert(block as QuizBlock);
}

/**
 * Converte array de blocos para v4, independente da versão original
 */
export function normalizeToV4(blocks: (Block | QuizBlock)[]): QuizBlock[] {
    return blocks.map((block, index) => ensureV4Block(block, index));
}

/**
 * Converte array de blocos para v3, independente da versão original
 */
export function normalizeToV3(blocks: (Block | QuizBlock)[]): Block[] {
    return blocks.map(block => ensureV3Block(block));
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    v3ToV4: BlockV3ToV4Adapter,
    v4ToV3: BlockV4ToV3Adapter,
    ensureV4Block,
    ensureV3Block,
    normalizeToV4,
    normalizeToV3,
    isV4Block,
    isV3Block,
};
