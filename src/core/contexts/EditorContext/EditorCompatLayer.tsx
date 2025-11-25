/**
 * 🔄 CAMADA DE COMPATIBILIDADE - Editor Context Legacy API
 * 
 * Wrapper que estende EditorStateProvider com a API legada
 * para manter compatibilidade com componentes antigos durante migração gradual.
 * 
 * MÉTODOS LEGADOS ADAPTADOS:
 * - setSelectedBlockId → selectBlock
 * - deleteBlock → removeBlock
 * - ensureStepLoaded → no-op (já carregado em EditorStateProvider)
 * - addBlockAtIndex → addBlock com índice
 * - blockActions → objeto com ações de bloco
 * - activeStageId → derivado de currentStep
 * 
 * @deprecated Use EditorStateProvider diretamente quando possível
 */

import React, { useMemo } from 'react';
import { useEditor as useEditorCanonical } from './EditorStateProvider';
import type { Block } from '@/types/editor';

export interface EditorCompatAPI extends ReturnType<typeof useEditorCanonical> {
    // API legada
    setSelectedBlockId: (id: string | null) => void;
    deleteBlock: (blockId: string) => Promise<void>;
    ensureStepLoaded: (step: number) => Promise<void>;
    addBlockAtIndex: (step: number, block: Block, index: number) => void;
    activeStageId: string;
    blockActions: {
        addBlock: (step: number, block: Block, index?: number) => void;
        updateBlock: (step: number, blockId: string, updates: Partial<Block>) => void;
        removeBlock: (step: number, blockId: string) => void;
        duplicateBlock: (step: number, blockId: string) => void;
    };
}

/**
 * Hook que adiciona camada de compatibilidade sobre o EditorStateProvider
 */
export function useEditorCompat(): EditorCompatAPI {
    const editor = useEditorCanonical();

    const compat = useMemo(() => {
        // Derivar activeStageId do currentStep
        const activeStageId = `step-${String(editor.currentStep).padStart(2, '0')}`;

        // Adapter: setSelectedBlockId → selectBlock
        const setSelectedBlockId = (id: string | null) => {
            editor.selectBlock(id);
        };

        // Adapter: deleteBlock → removeBlock
        const deleteBlock = async (blockId: string) => {
            editor.removeBlock(editor.currentStep, blockId);
        };

        // Adapter: ensureStepLoaded (no-op, EditorStateProvider já gerencia)
        const ensureStepLoaded = async (_step: number) => {
            // No-op: EditorStateProvider mantém todos os steps em stepBlocks
            return Promise.resolve();
        };

        // Adapter: addBlockAtIndex → addBlock
        const addBlockAtIndex = (step: number, block: Block, index: number) => {
            editor.addBlock(step, block, index);
        };

        // Adapter: blockActions object
        const blockActions = {
            addBlock: (step: number, block: Block, index?: number) => {
                editor.addBlock(step, block, index);
            },
            updateBlock: (step: number, blockId: string, updates: Partial<Block>) => {
                editor.updateBlock(step, blockId, updates);
            },
            removeBlock: (step: number, blockId: string) => {
                editor.removeBlock(step, blockId);
            },
            duplicateBlock: (step: number, blockId: string) => {
                const blocks = editor.getStepBlocks(step);
                const block = blocks.find(b => b.id === blockId);
                if (block) {
                    const duplicate = {
                        ...block,
                        id: `${block.id}-copy-${Date.now()}`,
                    };
                    const index = blocks.findIndex(b => b.id === blockId);
                    editor.addBlock(step, duplicate, index + 1);
                }
            },
        };

        return {
            ...editor,
            setSelectedBlockId,
            deleteBlock,
            ensureStepLoaded,
            addBlockAtIndex,
            activeStageId,
            blockActions,
        };
    }, [editor]);

    return compat;
}
