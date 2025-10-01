import { useMemo } from 'react';
import { useEditorCore } from './EditorCoreProvider';
import { useEditorCoreSelectors } from './useEditorCoreSelectors';

/**
 * useCoreStepBlocks
 * Acesso memoizado aos blocos de uma etapa, usando hash/stepKey como dependências.
 * Fase atual: ainda delega ao EditorProvider até migração completa.
 */
export function useCoreStepBlocks(step: number) {
    const { hash } = useEditorCoreSelectors();
    const { state } = useEditorCore();
    return useMemo(() => {
        // Ainda não expomos coreStepBlocks diretamente fora do provider, mas quizSteps é derivado;
        // para acesso granular continuamos derivando do mirror interno (future: fornecer seletor direto).
        // Como fallback, reconstituímos a partir de quizSteps se disponível.
        // Aqui assumimos que stepKeys está ordenada e cada step-* representa uma etapa sequencial.
        // Nota: Melhorar fornecendo state.coreStepBlocks no futuro (quando estabilizado o ownership completo).
        const k = `step-${step}`;
        const core = state.stepBlocks || {};
        return (core[k] || []) as any[];
    }, [hash, state.stepBlocks, step]);
}
