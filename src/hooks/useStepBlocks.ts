/**
 * 🎯 USE STEP BLOCKS HOOK
 * 
 * Hook unificado que extrai blocks de diferentes estruturas:
 * - SuperUnified.state.editor.stepBlocks (nova arquitetura)
 * - UnifiedCRUD.currentFunnel.quizSteps (legacy QuizStep)
 * - UnifiedCRUD.currentFunnel.stages (UnifiedFunnel)
 * 
 * Resolve GARGALO #2: Abstrai diferença entre estruturas legadas e novas
 * 
 * @version 1.0.0
 * @status PRODUCTION-READY
 */

import { useMemo } from 'react';
import { useUnifiedCRUD } from '@/contexts/data/UnifiedCRUDProvider';
import { useEditorState } from '@/contexts/editor/EditorStateProvider';
import type { Block } from '@/types/editor';
import { appLogger } from '@/lib/utils/logger';

export interface StepBlocksMap {
  [stepKey: string]: Block[];
}

export interface UseStepBlocksReturn {
  /** Mapa de blocos por step (step-01, step-02, etc.) */
  stepBlocks: StepBlocksMap;

  /** Número total de steps */
  totalSteps: number;

  /** Lista de step keys disponíveis */
  stepKeys: string[];

  /** Se há dados carregados */
  hasData: boolean;

  /** Fonte dos dados ('superUnified' | 'quizSteps' | 'stages' | 'none') */
  dataSource: 'superUnified' | 'quizSteps' | 'stages' | 'none';
}

/**
 * Hook que unifica acesso a step blocks independente da estrutura
 */
export function useStepBlocks(): UseStepBlocksReturn {
  const crud = useUnifiedCRUD();
  const superUnified = useEditorState();

  const result = useMemo(() => {
    // PRIORIDADE 1: SuperUnified.state.editor.stepBlocks (nova arquitetura)
    const superStepBlocks = superUnified?.state?.editor?.stepBlocks;
    if (superStepBlocks && Object.keys(superStepBlocks).length > 0) {
      const stepKeys = Object.keys(superStepBlocks).sort();

      appLogger.debug('[useStepBlocks] Usando SuperUnified.stepBlocks', {
        totalSteps: stepKeys.length,
        stepKeys,
      });

      return {
        stepBlocks: superStepBlocks,
        totalSteps: stepKeys.length,
        stepKeys,
        hasData: true,
        dataSource: 'superUnified' as const,
      };
    }

    // PRIORIDADE 2: UnifiedCRUD.currentFunnel.stages (UnifiedFunnel)
    const currentFunnel = crud?.currentFunnel;
    if (currentFunnel && 'stages' in currentFunnel) {
      const stages = (currentFunnel as any).stages || [];
      
      const stepBlocks: StepBlocksMap = stages.reduce((acc: StepBlocksMap, stage: any) => {
        // Converter stage.id para formato step-XX
        const stepKey = stage.id.startsWith('step-') 
          ? stage.id 
          : `step-${(stage.order + 1).toString().padStart(2, '0')}`;
        
        acc[stepKey] = stage.blocks || [];
        return acc;
      }, {});

      const stepKeys = Object.keys(stepBlocks).sort();

      appLogger.debug('[useStepBlocks] Usando UnifiedFunnel.stages', {
        totalSteps: stepKeys.length,
        stepKeys,
      });

      return {
        stepBlocks,
        totalSteps: stepKeys.length,
        stepKeys,
        hasData: true,
        dataSource: 'stages' as const,
      };
    }

    // PRIORIDADE 3: UnifiedCRUD.currentFunnel.quizSteps (legacy)
    if (currentFunnel && 'quizSteps' in currentFunnel) {
      const quizSteps = (currentFunnel as any).quizSteps || [];

      const stepBlocks: StepBlocksMap = quizSteps.reduce((acc: StepBlocksMap, step: any) => {
        // Garantir formato step-XX
        const stepKey = step.id.startsWith('step-')
          ? step.id
          : `step-${(step.order || 1).toString().padStart(2, '0')}`;

        acc[stepKey] = step.blocks || [];
        return acc;
      }, {});

      const stepKeys = Object.keys(stepBlocks).sort();

      appLogger.debug('[useStepBlocks] Usando quizSteps (legacy)', {
        totalSteps: stepKeys.length,
        stepKeys,
      });

      return {
        stepBlocks,
        totalSteps: stepKeys.length,
        stepKeys,
        hasData: true,
        dataSource: 'quizSteps' as const,
      };
    }

    // SEM DADOS
    appLogger.debug('[useStepBlocks] Nenhuma fonte de dados disponível');

    return {
      stepBlocks: {},
      totalSteps: 0,
      stepKeys: [],
      hasData: false,
      dataSource: 'none' as const,
    };
  }, [
    superUnified?.state?.editor?.stepBlocks,
    crud?.currentFunnel,
  ]);

  return result;
}

/**
 * Hook auxiliar para obter blocks de um step específico
 */
export function useStepBlocksForStep(stepIndex: number): Block[] {
  const { stepBlocks } = useStepBlocks();
  const stepKey = `step-${(stepIndex + 1).toString().padStart(2, '0')}`;
  return stepBlocks[stepKey] || [];
}

/**
 * Hook auxiliar para verificar se um step existe
 */
export function useHasStep(stepIndex: number): boolean {
  const { stepKeys } = useStepBlocks();
  const stepKey = `step-${(stepIndex + 1).toString().padStart(2, '0')}`;
  return stepKeys.includes(stepKey);
}
