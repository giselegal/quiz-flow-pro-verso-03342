import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { EditorProvider, useEditor } from '@/components/editor/EditorProvider';
import { createBlockFromComponent } from '@/utils/editorUtils';

// Harness para executar ações e expor a ordem dos tipos no DOM
const Harness: React.FC = () => {
    const { state, actions } = useEditor();

    const [phase, setPhase] = React.useState<'idle' | 'done'>('idle');

    React.useEffect(() => {
        let mounted = true;
        (async () => {
            // Etapa-alvo
            const stepKey = 'step-1';

            // 1) Adiciona 3 blocos na ordem A, B, C
            const A = createBlockFromComponent('text-a' as any, []);
            const B = createBlockFromComponent('text-b' as any, []);
            const C = createBlockFromComponent('text-c' as any, []);
            await actions.addBlock(stepKey, A);
            await actions.addBlock(stepKey, B);
            await actions.addBlock(stepKey, C);

            // 2) Reordena: mover índice 0 para 2 (A vai ao fim) -> B, C, A
            await actions.reorderBlocks(stepKey, 0, 2);

            // 3) Inserir novo bloco X no índice 1 -> B, X, C, A
            const X = createBlockFromComponent('text-x' as any, []);
            await actions.addBlockAtIndex(stepKey, X, 1);

            if (mounted) setPhase('done');
        })();
        return () => {
            mounted = false;
        };
    }, [actions]);

    const list = (state.stepBlocks['step-1'] || []).map((b: any) => b.type).join(',');
    return (
        <div>
            <div data-testid="phase">{phase}</div>
            <div data-testid="order">{list}</div>
        </div>
    );
};

describe('EditorProvider actions: reorder and insert-at-index', () => {
    it('reorders blocks and inserts between existing ones', async () => {
        const { getByTestId } = render(
            <EditorProvider initial={{ currentStep: 1 }}>
                <Harness />
            </EditorProvider>
        );

        // Espera o fluxo completar
        await waitFor(() => expect(getByTestId('phase').textContent).toBe('done'));

        // Verifica ordem final: B, X, C, A
        await waitFor(() => {
            const order = getByTestId('order').textContent;
            expect(order).toBe('text-b,text-x,text-c,text-a');
        });
    });
});
