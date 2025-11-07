/**
 * BlockDataNormalizer - Corrige o conflito arquitetural entre properties vs content
 * 
 * PROBLEMA IDENTIFICADO:
 * - Templates JSON têm estrutura: { properties: {layout}, content: {dados} }
 * - Schemas esperam tudo em properties: { properties: {dados+layout} }
 * - PropertiesColumn salva em properties, mas Renderer lê de content
 * 
 * SOLUÇÃO:
 * - Normalizar = mesclar properties + content bidireccionalmente
 * - Garantir sincronização sempre que dados mudarem
 */

import { Block } from '@/types/editor';

export interface NormalizedBlock extends Block {
    properties: Record<string, any>;
    content: Record<string, any>;
}

/**
 * Normaliza um bloco garantindo que properties e content estejam sincronizados
 * 
 * @param block - Bloco original do template/editor
 * @returns Bloco normalizado com properties e content sincronizados
 */
export function normalizeBlockData(block: Block): NormalizedBlock {
    if (!block) {
        throw new Error('[BlockDataNormalizer] Bloco não pode ser null/undefined');
    }

    // Mesclar properties + content (content tem prioridade para dados editáveis)
    const merged = {
        ...block.properties,
        ...block.content,
    };

    // Garantir que ambos properties e content estejam sincronizados
    const normalized: NormalizedBlock = {
        ...block,
        properties: merged,  // ← Schema editor espera tudo aqui
        content: merged,     // ← Renderer legacy lê daqui - mantém compatibilidade
    };

    return normalized;
}

/**
 * Normaliza array de blocos
 */
export function normalizeBlocksData(blocks: Block[]): NormalizedBlock[] {
    if (!Array.isArray(blocks)) {
        return [];
    }

    return blocks.map(normalizeBlockData);
}

/**
 * Cria dados de bloco atualizados mantendo sincronização
 * 
 * @param originalBlock - Bloco original
 * @param updatedProperties - Propriedades editadas no painel
 * @returns Bloco atualizado com properties e content sincronizados
 */
export function createSynchronizedBlockUpdate(
    originalBlock: Block,
    updatedProperties: Record<string, any>
): Partial<Block> {
    // Mesclar propriedades existentes com as atualizadas
    const merged = {
        ...originalBlock.properties,
        ...originalBlock.content,
        ...updatedProperties,
    };

    return {
        properties: merged,  // ← Editor salva aqui
        content: merged,     // ← Renderer lê daqui
    };
}

/**
 * Valida se um bloco está normalizado corretamente
 */
export function isBlockNormalized(block: Block): boolean {
    if (!block?.properties || !block?.content) {
        return false;
    }

    // Verificar se properties e content têm as mesmas chaves editáveis
    const propertyKeys = Object.keys(block.properties);
    const contentKeys = Object.keys(block.content);

    // Para chaves que existem em content (dados editáveis), devem estar em properties
    for (const key of contentKeys) {
        if (!propertyKeys.includes(key)) {
            return false;
        }
        if (block.properties[key] !== block.content[key]) {
            return false;
        }
    }

    return true;
}

/**
 * Logger para debug de normalização
 */
export const normalizerLogger = {
    debug: (msg: string, data: any) => {
        if (localStorage.getItem('DEBUG_NORMALIZER') === 'true') {
            console.log(`🔄 [BlockNormalizer] ${msg}`, data);
        }
    },

    warn: (msg: string, data: any) => {
        console.warn(`⚠️ [BlockNormalizer] ${msg}`, data);
    },

    error: (msg: string, data: any) => {
        console.error(`❌ [BlockNormalizer] ${msg}`, data);
    }
};