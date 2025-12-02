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

export interface EditorCompatAPI {
    // ===== STATE =====
    state: {
        currentStep: number;
        selectedBlockId: string | null;
        isPreviewMode: boolean;
        isEditing: boolean;
        dragEnabled: boolean;
        clipboardData: Block | null;
        stepBlocks: Record<number, Block[]>;
        dirtySteps: Record<number, boolean>;
        isDirty: boolean;
        lastSaved: number | null;
        lastModified: number | null;
        modifiedSteps: Record<string, number>;
        validationErrors: any[];
        blocks: Block[];
        totalSteps: number;
    };

    // ===== CORE PROPERTIES =====
    currentStep: number;
    selectedBlockId: string | null;
    isPreviewMode: boolean;

    // ===== ACTIONS (flat API) =====
    setCurrentStep: (step: number) => void;
    selectBlock: (blockId: string | null) => void;
    togglePreview: (enabled?: boolean) => void;
    toggleEditing: (enabled?: boolean) => void;
    toggleDrag: (enabled?: boolean) => void;
    copyBlock: (block: Block) => void;
    pasteBlock: (step: number, index?: number) => void;
    setStepBlocks: (step: number, blocks: Block[]) => void;
    updateBlock: (step: number, blockId: string, updates: Partial<Block>) => void;
    addBlock: (step: number, block: Block, index?: number) => void;
    removeBlock: (step: number, blockId: string) => void;
    reorderBlocks: (step: number, blocks: Block[]) => void;
    markSaved: () => void;
    markModified: (step: string) => void;
    addValidationError: (error: any) => void;
    clearValidationErrors: (blockId?: string) => void;
    resetEditor: () => void;
    getStepBlocks: (step: number) => Block[];
    isStepDirty: (step: number) => boolean;
    loadStepBlocks: (stepId: string) => Promise<Block[] | null>;

    // ===== LEGACY ALIASES =====
    setSelectedBlockId: (id: string | null) => void;
    deleteBlock: (blockId: string) => Promise<void>;
    ensureStepLoaded: (step: number) => Promise<void>;
    addBlockAtIndex: (step: number, block: Block, index: number) => void;
    activeStageId: string;
    isPreviewing: boolean;
    isLoading: boolean;
    save: () => void;

    // ===== ACTIONS (grouped API) =====
    actions: {
        setCurrentStep: (step: number) => void;
        selectBlock: (blockId: string | null) => void;
        togglePreview: (enabled?: boolean) => void;
        toggleEditing: (enabled?: boolean) => void;
        toggleDrag: (enabled?: boolean) => void;
        copyBlock: (block: Block) => void;
        pasteBlock: (step: number, index?: number) => void;
        setStepBlocks: (step: number, blocks: Block[]) => void;
        updateBlock: (step: number, blockId: string, updates: Partial<Block>) => void;
        addBlock: (step: number, block: Block, index?: number) => void;
        removeBlock: (step: number, blockId: string) => void;
        reorderBlocks: (step: number, blocks: Block[]) => void;
        markSaved: () => void;
        markModified: (step: string) => void;
        addValidationError: (error: any) => void;
        clearValidationErrors: (blockId?: string) => void;
        resetEditor: () => void;
        getStepBlocks: (step: number) => Block[];
        isStepDirty: (step: number) => boolean;
        loadStepBlocks: (stepId: string) => Promise<Block[] | null>;
    };

    blockActions: {
        addBlock: (step: number, block: Block, index?: number) => void;
        updateBlock: (step: number, blockId: string, updates: Partial<Block>) => void;
        removeBlock: (step: number, blockId: string) => void;
        duplicateBlock: (step: number, blockId: string) => void;
    };

    // API legada - Stages (multi-step)
    stages: Array<{
        id: string;
        metadata: {
            blocks: Block[];
        };
    }>;

    stageActions: {
        setActiveStage: (stageId: string) => Promise<void>;
    };

    // Undo/Redo
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

/**
 * Hook que adiciona camada de compatibilidade sobre o EditorStateProvider
 */
export function useEditorCompat(): EditorCompatAPI {
    const editor = useEditorCanonical();

    const compat = useMemo(() => {
        // Derivar activeStageId do currentStep
        const activeStageId = `step-${String(editor.currentStep).padStart(2, '0')}`;

        // Adapter: state.blocks (flat list do step atual)
        const currentStepBlocks = editor.getStepBlocks(editor.currentStep);
        const compatState = {
            ...editor.state,
            blocks: currentStepBlocks,
            totalSteps: 21, // Default para quiz de 21 steps
        };

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

        // Adapter: stages array (compatibilidade com código legado multi-step)
        const stages = Object.keys(editor.state.stepBlocks).map(stepNum => {
            const num = parseInt(stepNum);
            const stepKey = `step-${String(num).padStart(2, '0')}`;
            return {
                id: stepKey,
                metadata: {
                    blocks: editor.getStepBlocks(num),
                },
            };
        });

        // Adapter: stageActions
        const stageActions = {
            setActiveStage: async (stageId: string) => {
                const match = stageId.match(/step-(\d+)/);
                if (match) {
                    const stepNum = parseInt(match[1]);
                    editor.setCurrentStep(stepNum);
                }
            },
        };

        return {
            ...editor,
            state: compatState, // State com blocks
            setSelectedBlockId,
            deleteBlock,
            ensureStepLoaded,
            addBlockAtIndex,
            activeStageId,
            blockActions,
            stages,
            stageActions,
            isPreviewing: editor.isPreviewMode,
            isLoading: false, // EditorStateProvider não tem isLoading
            save: editor.markSaved, // Adapter: save → markSaved
            // Undo/Redo (from EditorStateProvider)
            undo: () => { }, // TODO: Implement undo
            redo: () => { }, // TODO: Implement redo
            canUndo: false, // TODO: Implement undo state
            canRedo: false, // TODO: Implement redo state
        };
    }, [editor]);

    return compat;
}
