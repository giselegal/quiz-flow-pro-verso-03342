/**
 * 🎯 USE STEP BLOCKS HOOK
 * 
 * Hook que conecta componentes modulares ao JSON do funil via FunnelEditingFacade.
 * - Consome 100% do JSON (pages[].blocks[])
 * - Expõe métodos CRUD para blocos
 * - Auto-atualização via eventos da Facade
 * - Suporte a drag-and-drop e reordenação
 */

import { useMemo, useCallback, useEffect, useState } from 'react';
import { useSuperUnified } from '@/contexts/providers/SuperUnifiedProvider';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BlockData {
    id: string;
    type: string;
    order: number;
    content?: Record<string, any>;
    properties?: Record<string, any>;
}

export interface StepData {
    id: string;
    type: string;
    order: number;
    title?: string;
    blocks: BlockData[];
}

export interface UseStepBlocksResult {
    // Estado
    step: StepData | null;
    blocks: BlockData[];
    isLoading: boolean;
    error: string | null;

    // CRUD de blocos
    updateBlock: (blockId: string, updates: Partial<BlockData>) => void;
    addBlock: (type: string, properties?: Record<string, any>, content?: Record<string, any>) => void;
    deleteBlock: (blockId: string) => void;
    duplicateBlock: (blockId: string) => void;

    // Reordenação
    reorderBlocks: (fromIndex: number, toIndex: number) => void;
    moveBlockUp: (blockId: string) => void;
    moveBlockDown: (blockId: string) => void;

    // Utilitários
    getBlock: (blockId: string) => BlockData | undefined;
    getBlockIndex: (blockId: string) => number;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export function useStepBlocks(stepIndex: number): UseStepBlocksResult {
    // 🔁 LEGACY FACADE SUBSTITUÍDA: usamos SuperUnifiedProvider como fonte única
    const unified = useSuperUnified();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updateTrigger, setUpdateTrigger] = useState(0);

    // ========================================================================
    // DERIVAR STEP DO SNAPSHOT
    // ========================================================================

    const step = useMemo<StepData | null>(() => {
        try {
            const rawStepBlocks = unified.state.editor.stepBlocks;
            const totalSteps = unified.state.editor.totalSteps || Object.keys(rawStepBlocks).length;
            const idx = stepIndex + 1;
            if (idx < 1 || idx > totalSteps) {
                appLogger.warn(`⚠️ stepIndex ${stepIndex} fora do range. Total de steps: ${totalSteps}`);
                return null;
            }

            // Chave interna numeric → precisamos ordenar e mapear para string step-XX
            const blockArray = rawStepBlocks[idx] || [];
            appLogger.debug('🔍 useStepBlocks(SuperUnified) meta', { data: [`idx:${stepIndex}`, `len:${blockArray.length}`] });

            const normalizedBlocks = blockArray.map((block: any, i: number) => ({
                id: block.id || `block-${i}`,
                type: block.type || 'text',
                order: i,
                content: block.data || {},
                properties: block.data || {},
            }));
            // Inferir título de um bloco de heading/title se existir
            const inferredTitle = (() => {
                try {
                    const candidate = blockArray.find((b: any) => {
                        const t = (b?.type || '').toLowerCase();
                        return t.includes('title') || t.includes('heading') || t === 'h1' || t === 'h2';
                    });
                    const text = candidate?.data?.text || candidate?.data?.content || candidate?.data?.label;
                    if (typeof text === 'string' && text.trim().length > 0) return text.trim();
                } catch { /* noop */ }
                return `Etapa ${idx}`;
            })();

            return {
                id: `step-${idx.toString().padStart(2, '0')}`,
                type: 'step',
                order: idx,
                title: inferredTitle,
                blocks: normalizedBlocks,
            };
        } catch (err) {
            appLogger.error('❌ Erro ao derivar step (SuperUnified):', { data: [err] });
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            return null;
        }
    }, [unified.state.editor.stepBlocks, unified.state.editor.totalSteps, stepIndex, updateTrigger]);

    const blocks = useMemo(() => step?.blocks || [], [step]);

    // ========================================================================
    // CRUD DE BLOCOS
    // ========================================================================

    /**
     * Atualizar bloco específico
     */
    const updateBlock = useCallback((blockId: string, updates: Partial<BlockData>) => {
        if (!step) return appLogger.warn('⚠️ Step não encontrado para atualizar bloco');
        try {
            setIsLoading(true); setError(null);
            unified.updateBlock(step.order, blockId, updates);
            setUpdateTrigger(p => p + 1);
        } catch (err) {
            appLogger.error('❌ Erro updateBlock:', { data: [err] });
            setError(err instanceof Error ? err.message : 'Erro ao atualizar bloco');
        } finally { setIsLoading(false); }
    }, [step, unified]);

    /**
     * Adicionar novo bloco
     */
    const addBlock = useCallback((type: string, properties: Record<string, any> = {}, content: Record<string, any> = {}) => {
        if (!step) return appLogger.warn('⚠️ Step não encontrado para adicionar bloco');
        try {
            setIsLoading(true); setError(null);
            const newBlock = { id: `block-${type}-${Date.now()}`, type, data: { ...content, ...properties } };
            unified.addBlock(step.order, newBlock);
            setUpdateTrigger(p => p + 1);
        } catch (err) {
            appLogger.error('❌ Erro addBlock:', { data: [err] });
            setError(err instanceof Error ? err.message : 'Erro ao adicionar bloco');
        } finally { setIsLoading(false); }
    }, [step, unified]);

    /**
     * Deletar bloco
     */
    const deleteBlock = useCallback((blockId: string) => {
        if (!step) return appLogger.warn('⚠️ Step não encontrado para deletar bloco');
        try {
            setIsLoading(true); setError(null);
            unified.removeBlock(step.order, blockId);
            setUpdateTrigger(p => p + 1);
        } catch (err) {
            appLogger.error('❌ Erro deleteBlock:', { data: [err] });
            setError(err instanceof Error ? err.message : 'Erro ao deletar bloco');
        } finally { setIsLoading(false); }
    }, [step, unified]);

    /**
     * Duplicar bloco
     */
    const duplicateBlock = useCallback((blockId: string) => {
        if (!step) return appLogger.warn('⚠️ Step não encontrado para duplicar bloco');
        try {
            setIsLoading(true); setError(null);
            const original = step.blocks.find(b => b.id === blockId); if (!original) throw new Error('Bloco não encontrado');
            const duplicate = { id: `block-${original.type}-${Date.now()}`, type: original.type, data: { ...original.content, ...original.properties } };
            unified.addBlock(step.order, duplicate);
            setUpdateTrigger(p => p + 1);
        } catch (err) {
            appLogger.error('❌ Erro duplicateBlock:', { data: [err] });
            setError(err instanceof Error ? err.message : 'Erro ao duplicar bloco');
        } finally { setIsLoading(false); }
    }, [step, unified]);

    // ========================================================================
    // REORDENAÇÃO
    // ========================================================================

    /**
     * Reordenar blocos (drag and drop)
     */
    const reorderBlocks = useCallback((fromIndex: number, toIndex: number) => {
        if (!step) return appLogger.warn('⚠️ Step não encontrado para reordenar blocos');
        if (fromIndex === toIndex) return;
        try {
            setIsLoading(true); setError(null);
            const arr = [...step.blocks];
            const [moved] = arr.splice(fromIndex, 1); arr.splice(toIndex, 0, moved);
            const reordered = arr.map(b => ({ id: b.id, type: b.type, data: { ...b.content, ...b.properties } }));
            unified.reorderBlocks(step.order, reordered as any[]);
            setUpdateTrigger(p => p + 1);
        } catch (err) {
            appLogger.error('❌ Erro reorderBlocks:', { data: [err] });
            setError(err instanceof Error ? err.message : 'Erro ao reordenar blocos');
        } finally { setIsLoading(false); }
    }, [step, unified]);

    /**
     * Mover bloco para cima
     */
    const moveBlockUp = useCallback((blockId: string) => {
        if (!step) return;

        const index = step.blocks.findIndex(b => b.id === blockId);
        if (index > 0) {
            reorderBlocks(index, index - 1);
        }
    }, [step, reorderBlocks]);

    /**
     * Mover bloco para baixo
     */
    const moveBlockDown = useCallback((blockId: string) => {
        if (!step) return;

        const index = step.blocks.findIndex(b => b.id === blockId);
        if (index >= 0 && index < step.blocks.length - 1) {
            reorderBlocks(index, index + 1);
        }
    }, [step, reorderBlocks]);

    // ========================================================================
    // UTILITÁRIOS
    // ========================================================================

    const getBlock = useCallback((blockId: string) => {
        return step?.blocks.find(b => b.id === blockId);
    }, [step]);

    const getBlockIndex = useCallback((blockId: string) => {
        return step?.blocks.findIndex(b => b.id === blockId) ?? -1;
    }, [step]);

    // ========================================================================
    // EVENT LISTENERS (Live Preview)
    // ========================================================================

    useEffect(() => {
        // Reagir às alterações no estado global do editor (SuperUnified)
        // A cada mudança de stepBlocks provocamos updateTrigger para recalcular memo
        setUpdateTrigger(p => p + 1);
    }, [unified.state.editor.stepBlocks]);

    // ========================================================================
    // RETURN
    // ========================================================================

    return {
        step,
        blocks,
        isLoading,
        error,
        updateBlock,
        addBlock,
        deleteBlock,
        duplicateBlock,
        reorderBlocks,
        moveBlockUp,
        moveBlockDown,
        getBlock,
        getBlockIndex,
    };
}
