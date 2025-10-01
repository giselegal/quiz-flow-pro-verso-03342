import React from 'react';
import { render, act } from '@testing-library/react';
import { EditorCoreProvider, useEditorCore } from '../EditorCoreProvider';

// Mock useEditor (legacy) para isolar core
jest.mock('@/components/editor/provider-alias', () => ({
    useEditor: () => ({
        state: {
            stepBlocks: {
                'step-1': [{ id: 'a', type: 'text' }],
                'step-2': [{ id: 'b', type: 'image' }]
            },
            currentStep: 1,
            selectedBlockId: null
        },
        actions: {}
    })
}));

const Probe: React.FC<{ onData: (data: any) => void }> = ({ onData }) => {
    const { state, coreActions } = useEditorCore();
    React.useEffect(() => {
        onData({ state });
    }, [state, onData]);

    // Executa batch apenas uma vez
    React.useEffect(() => {
        coreActions.batch(draft => {
            // add
            draft['step-1'] = [...(draft['step-1'] || []), { id: 'c', type: 'video' }];
            // update
            draft['step-2'] = (draft['step-2'] || []).map(b => b.id === 'b' ? { ...b, type: 'image-updated' } : b);
            // reorder (noop simples testado alterando ordem manualmente)
            const s1 = draft['step-1'];
            if (s1.length > 1) {
                const moved = s1.pop();
                s1.unshift(moved!);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};

describe('EditorCoreProvider batch', () => {
    it('aplica múltiplas mutações em uma única atualização', () => {
        const snapshots: any[] = [];
        render(
            <EditorCoreProvider>
                <Probe onData={(d) => snapshots.push(d)} />
            </EditorCoreProvider>
        );

        // Esperar efeitos
        expect(snapshots.length).toBeGreaterThanOrEqual(1);

        const last = snapshots.at(-1);
        const step1 = last.state.stepBlocks['step-1'];
        const step2 = last.state.stepBlocks['step-2'];

        // Validações
        expect(step1.find((b: any) => b.id === 'c')).toBeTruthy(); // add
        expect(step2.find((b: any) => b.id === 'b')?.type).toBe('image-updated'); // update
        // reorder: novo bloco 'c' foi movido para frente
        expect(step1[0].id).toBe('c');
    });
});
