/**
 * 🔄 HOOK: useAutoProgress
 * Atualiza automaticamente progressValue em blocos quiz-intro-header
 * quando steps são carregados, reordenados ou modificados
 */

import { useEffect, useCallback } from 'react';
import type { Block } from '@/types/editor';
import { calculateProgressValue, updateProgressInBlocks } from '@/lib/utils/progressCalculator';
import { appLogger } from '@/lib/utils/appLogger';

export interface UseAutoProgressOptions {
    currentStepIndex: number;
    totalSteps: number;
    blocks: Block[] | null;
    onUpdateBlocks?: (blocks: Block[]) => void;
    enabled?: boolean;
}

export function useAutoProgress(options: UseAutoProgressOptions) {
    const {
        currentStepIndex,
        totalSteps,
        blocks,
        onUpdateBlocks,
        enabled = true
    } = options;

    // Calcular progresso esperado
    const expectedProgress = calculateProgressValue(currentStepIndex, totalSteps);

    // Verificar se algum bloco quiz-intro-header precisa de atualização
    const needsUpdate = useCallback(() => {
        if (!blocks || !enabled) return false;

        const headerBlock = blocks.find(b => b.type === 'quiz-intro-header');
        if (!headerBlock) return false;

        const currentProgress = (headerBlock.properties as any)?.progressValue ?? 0;
        return currentProgress !== expectedProgress;
    }, [blocks, expectedProgress, enabled]);

    // Atualizar blocos automaticamente se necessário
    useEffect(() => {
        if (!enabled || !blocks || !onUpdateBlocks) return;

        if (needsUpdate()) {
            const updatedBlocks = updateProgressInBlocks(blocks, currentStepIndex, totalSteps);
            onUpdateBlocks(updatedBlocks);

            appLogger.info(`🔄 [useAutoProgress] Progresso atualizado: ${expectedProgress}%`);
        }
    }, [enabled, blocks, currentStepIndex, totalSteps, expectedProgress, needsUpdate, onUpdateBlocks]);

    return {
        expectedProgress,
        needsUpdate: needsUpdate()
    };
}
