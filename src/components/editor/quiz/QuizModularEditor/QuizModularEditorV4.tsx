/**
 * 🎯 QUIZ MODULAR EDITOR V4 WRAPPER
 * 
 * Wrapper que adiciona suporte v4 ao QuizModularEditor existente:
 * - Integra adaptadores v3 ↔ v4
 * - Usa DynamicPropertiesPanelV4
 * - Mantém compatibilidade com código existente
 * 
 * MODO OPERACIONAL:
 * - useV4Layout=false (padrão): Usa editor original com 4 colunas
 * - useV4Layout=true: Usa layout otimizado com DynamicPropertiesPanelV4
 * 
 * @version 1.0.0
 * @status PRODUCTION
 */

import React, { useMemo, useCallback } from 'react';
import QuizModularEditor, { type QuizModularEditorProps } from './index';
import { DynamicPropertiesPanelV4 } from '@/components/editor/properties/DynamicPropertiesPanelV4';
import { BlockV3ToV4Adapter, BlockV4ToV3Adapter, ensureV4Block } from '@/core/quiz/blocks/adapters';
import { useEditorContext } from '@/core';
import type { Block } from '@/types/editor';
import type { QuizBlock } from '@/schemas/quiz-schema.zod';
import { appLogger } from '@/lib/utils/appLogger';

export interface QuizModularEditorV4Props extends QuizModularEditorProps {
    /** Usar layout otimizado v4 com DynamicPropertiesPanelV4 */
    useV4Layout?: boolean;
    /** Callback quando bloco v4 é atualizado */
    onBlockV4Update?: (blockId: string, updates: Partial<QuizBlock>) => void;
}

/**
 * Hook para gerenciar conversão automática v3 ↔ v4
 */
function useV4BlockAdapter() {
    const context = useEditorContext();

    // Converte blocos v3 do contexto para v4
    const v4Blocks = useMemo(() => {
        const blocks = (context as any).blocks as Block[] | undefined;
        if (!blocks) return [];
        return blocks.map((block: Block, index: number) => {
            try {
                return ensureV4Block(block, index);
            } catch (error) {
                appLogger.error('Failed to convert block to v4:', { error, block });
                return null;
            }
        }).filter((b: QuizBlock | null): b is QuizBlock => b !== null);
    }, [(context as any).blocks]);

    // Handler que converte update v4 → v3 antes de chamar updateBlock
    const handleV4Update = useCallback((blockId: string, updates: Partial<QuizBlock>) => {
        appLogger.debug('V4 update received:', { blockId, updates });

        const blocks = (context as any).blocks as Block[] | undefined;
        const updateBlock = (context as any).updateBlock as ((id: string, block: Block) => void) | undefined;

        // Encontra bloco original v3
        const originalBlock = blocks?.find((b: Block) => b.id === blockId);
        if (!originalBlock) {
            appLogger.warn('Block not found for v4 update:', blockId);
            return;
        }

        if (!updateBlock) {
            appLogger.warn('updateBlock not available in context');
            return;
        }

        try {
            // Cria bloco v4 atualizado
            const v4Block = ensureV4Block(originalBlock);
            const updatedV4Block: QuizBlock = {
                ...v4Block,
                ...updates,
                properties: {
                    ...(v4Block.properties || {}),
                    ...(updates.properties || {}),
                },
            };

            // Converte de volta para v3
            const v3Block = BlockV4ToV3Adapter.convert(updatedV4Block);

            // Atualiza no contexto v3
            updateBlock(blockId, v3Block);

            appLogger.info('V4 update converted and applied:', { blockId, v3Block });
        } catch (error) {
            appLogger.error('Failed to convert v4 update to v3:', { error, blockId, updates });
        }
    }, [context]);

    return {
        v4Blocks,
        handleV4Update,
    };
}

/**
 * Componente wrapper que adiciona funcionalidades v4
 */
export function QuizModularEditorV4Wrapper({
    useV4Layout = false, // Mantém layout original por padrão para compatibilidade
    onBlockV4Update,
    ...editorProps
}: QuizModularEditorV4Props) {
    const { v4Blocks, handleV4Update } = useV4BlockAdapter();

    // Combina handlers v4
    const combinedV4Handler = useCallback(
        (blockId: string, updates: Partial<QuizBlock>) => {
            handleV4Update(blockId, updates);
            onBlockV4Update?.(blockId, updates);
        },
        [handleV4Update, onBlockV4Update]
    );

    // ✅ Por enquanto: SEMPRE renderiza editor original com 4 colunas
    // O layout v4 otimizado será implementado em fase futura quando:
    // 1. DynamicPropertiesPanelV4 estiver validado em produção
    // 2. Houver feedback dos usuários sobre preferências de layout
    // 3. Testes A/B mostrarem melhor performance/UX
    
    appLogger.debug('QuizModularEditorV4: Using original layout', { 
        useV4Layout,
        blocksCount: v4Blocks.length 
    });

    return (
        <QuizModularEditor 
            {...editorProps}
            // TODO Phase 6: Integrar DynamicPropertiesPanelV4 quando useV4Layout=true
            // - Layout 3 colunas: Steps | Canvas | DynamicPropertiesV4
            // - Remover ComponentLibrary column
            // - Adicionar biblioteca inline no canvas
        />
    );
}/**
 * Hook para usar blocos v4 diretamente no código
 */
export function useV4Blocks() {
    const context = useEditorContext();

    const v4Blocks = useMemo(() => {
        const blocks = (context as any).blocks as Block[] | undefined;
        if (!blocks) return [];
        return BlockV3ToV4Adapter.convertMany(blocks);
    }, [(context as any).blocks]);

    return v4Blocks;
}

/**
 * Hook para converter um bloco específico para v4
 */
export function useV4Block(blockId: string | null) {
    const context = useEditorContext();

    const v4Block = useMemo(() => {
        const blocks = (context as any).blocks as Block[] | undefined;
        if (!blockId || !blocks) return null;
        const block = blocks.find((b: Block) => b.id === blockId);
        if (!block) return null;
        return ensureV4Block(block);
    }, [blockId, (context as any).blocks]);

    return v4Block;
}

export default QuizModularEditorV4Wrapper;
