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
import { useFunnelFacade } from '@/pages/editor/ModernUnifiedEditor';
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
    const facade = useFunnelFacade();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updateTrigger, setUpdateTrigger] = useState(0);

    // ========================================================================
    // DERIVAR STEP DO SNAPSHOT
    // ========================================================================

    const step = useMemo<StepData | null>(() => {
        try {
            const steps = facade.getSteps();

            // Logs reduzidos: manter apenas metadados leves (evitar serialização profunda)
            appLogger.debug('🔍 useStepBlocks meta', { data: [`idx:${stepIndex}`, `total:${steps.length}`] });

            if (stepIndex < 0 || stepIndex >= steps.length) {
                appLogger.warn(`⚠️ stepIndex ${stepIndex} fora do range. Total de steps: ${steps.length}`);
                return null;
            }

            const funnelStep = steps[stepIndex];
            appLogger.debug('🔍 useStepBlocks stepCore', { data: [funnelStep.id, funnelStep.blocks?.length || 0] });

            // Normalizar blocos (garantir que todos têm propriedades necessárias)
            const normalizedBlocks = (funnelStep.blocks || []).map((block: any, idx: number) => ({
                id: block.id || `block-${idx}`,
                type: block.type || 'text',
                order: idx, // Usar índice como order
                content: block.data || {},
                properties: block.data || {},
            }));

            appLogger.debug('🔍 useStepBlocks normalizedCount', { data: [normalizedBlocks.length] });

            return {
                id: funnelStep.id || `step-${stepIndex + 1}`,
                type: 'step', // Tipo genérico
                order: funnelStep.order || stepIndex + 1,
                title: funnelStep.title || `Etapa ${stepIndex + 1}`,
                blocks: normalizedBlocks,
            };
        } catch (err) {
            appLogger.error('❌ Erro ao derivar step:', { data: [err] });
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            return null;
        }
    }, [facade, stepIndex, updateTrigger]);

    const blocks = useMemo(() => step?.blocks || [], [step]);

    // ========================================================================
    // CRUD DE BLOCOS
    // ========================================================================

    /**
     * Atualizar bloco específico
     */
    const updateBlock = useCallback((blockId: string, updates: Partial<BlockData>) => {
        if (!step) {
            appLogger.warn('⚠️ Step não encontrado para atualizar bloco');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            appLogger.debug(`🔄 updateBlock ${blockId}`, { data: [Object.keys(updates)] });

            // Atualizar via Facade
            facade.updateBlock(step.id, blockId, updates);

            // Forçar re-render
            setUpdateTrigger(prev => prev + 1);

            appLogger.debug(`✅ updateBlock OK ${blockId}`);
        } catch (err) {
            appLogger.error('❌ Erro ao atualizar bloco:', { data: [err] });
            setError(err instanceof Error ? err.message : 'Erro ao atualizar bloco');
        } finally {
            setIsLoading(false);
        }
    }, [facade, step]);

    /**
     * Adicionar novo bloco
     */
    const addBlock = useCallback((
        type: string,
        properties: Record<string, any> = {},
        content: Record<string, any> = {},
    ) => {
        if (!step) {
            appLogger.warn('⚠️ Step não encontrado para adicionar bloco');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const newBlock = {
                id: `block-${type}-${Date.now()}`,
                type,
                data: {
                    ...content,
                    ...properties,
                },
            };

            appLogger.debug(`➕ addBlock ${newBlock.id}`, { data: [type] });

            facade.addBlock(step.id, newBlock);

            // Forçar re-render
            setUpdateTrigger(prev => prev + 1);

            appLogger.debug(`✅ addBlock OK ${newBlock.id}`);
        } catch (err) {
            appLogger.error('❌ Erro ao adicionar bloco:', { data: [err] });
            setError(err instanceof Error ? err.message : 'Erro ao adicionar bloco');
        } finally {
            setIsLoading(false);
        }
    }, [facade, step]);

    /**
     * Deletar bloco
     */
    const deleteBlock = useCallback((blockId: string) => {
        if (!step) {
            appLogger.warn('⚠️ Step não encontrado para deletar bloco');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            appLogger.debug(`🗑️ deleteBlock ${blockId}`);

            facade.removeBlock(step.id, blockId);

            // Forçar re-render
            setUpdateTrigger(prev => prev + 1);

            appLogger.debug(`✅ deleteBlock OK ${blockId}`);
        } catch (err) {
            appLogger.error('❌ Erro ao deletar bloco:', { data: [err] });
            setError(err instanceof Error ? err.message : 'Erro ao deletar bloco');
        } finally {
            setIsLoading(false);
        }
    }, [facade, step]);

    /**
     * Duplicar bloco
     */
    const duplicateBlock = useCallback((blockId: string) => {
        if (!step) {
            appLogger.warn('⚠️ Step não encontrado para duplicar bloco');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const original = step.blocks.find(b => b.id === blockId);
            if (!original) {
                throw new Error(`Bloco ${blockId} não encontrado`);
            }

            const duplicate = {
                id: `block-${original.type}-${Date.now()}`,
                type: original.type,
                data: {
                    ...original.content,
                    ...original.properties,
                },
            };

            appLogger.debug(`📋 duplicateBlock ${blockId} -> ${duplicate.id}`);

            facade.addBlock(step.id, duplicate);

            // Forçar re-render
            setUpdateTrigger(prev => prev + 1);

            appLogger.debug(`✅ duplicateBlock OK ${duplicate.id}`);
        } catch (err) {
            appLogger.error('❌ Erro ao duplicar bloco:', { data: [err] });
            setError(err instanceof Error ? err.message : 'Erro ao duplicar bloco');
        } finally {
            setIsLoading(false);
        }
    }, [facade, step]);

    // ========================================================================
    // REORDENAÇÃO
    // ========================================================================

    /**
     * Reordenar blocos (drag and drop)
     */
    const reorderBlocks = useCallback((fromIndex: number, toIndex: number) => {
        if (!step) {
            appLogger.warn('⚠️ Step não encontrado para reordenar blocos');
            return;
        }

        if (fromIndex === toIndex) return;

        try {
            setIsLoading(true);
            setError(null);

            appLogger.debug(`🔄 reorderBlocks ${fromIndex}->${toIndex}`);

            const reordered = [...step.blocks];
            const [moved] = reordered.splice(fromIndex, 1);
            reordered.splice(toIndex, 0, moved);

            // Usar API de reorderBlocks da facade (passa array de IDs na nova ordem)
            const newOrder = reordered.map(b => b.id);
            facade.reorderBlocks(step.id, newOrder);

            // Forçar re-render
            setUpdateTrigger(prev => prev + 1);

            appLogger.debug('✅ reorderBlocks OK');
        } catch (err) {
            appLogger.error('❌ Erro ao reordenar blocos:', { data: [err] });
            setError(err instanceof Error ? err.message : 'Erro ao reordenar blocos');
        } finally {
            setIsLoading(false);
        }
    }, [facade, step]);

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
        if (!facade) return;

        // Escutar mudanças nos blocos
        const unsubscribeBlocks = facade.on('blocks/changed', (payload: any) => {
            appLogger.debug('📡 evt blocks/changed', { data: [`len:${payload.blocks.length}`, `reason:${payload.reason}`] });
            setUpdateTrigger(prev => prev + 1);
        });

        // Escutar mudanças nos steps
        const unsubscribeSteps = facade.on('steps/changed', (payload: any) => {
            appLogger.debug('📡 evt steps/changed', { data: [`len:${payload.steps.length}`, `reason:${payload.reason}`] });
            setUpdateTrigger(prev => prev + 1);
        });

        return () => {
            unsubscribeBlocks();
            unsubscribeSteps();
        };
    }, [facade]);

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
