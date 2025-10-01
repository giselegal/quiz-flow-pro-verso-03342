import { useMemo } from 'react';
import { useEditor } from '@/components/editor/provider-alias';
import { useEditorCoreSelectors } from './useEditorCoreSelectors';

/**
 * useCoreStepBlocks
 * Acesso memoizado aos blocos de uma etapa, usando hash/stepKey como dependências.
 * Fase atual: ainda delega ao EditorProvider até migração completa.
 */
export function useCoreStepBlocks(step: number) {
    const { hash } = useEditorCoreSelectors();
    const { state } = useEditor();
    return useMemo(() => {
        const key = `step-${step}`;
        return (state.stepBlocks?.[key] || []) as any[];
        // Dependências: hash garante atualização quando estrutura muda,
        // step tira proveito do parâmetro, state.stepBlocks acessa atual.
    }, [hash, state.stepBlocks, step]);
}
