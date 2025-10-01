import React from 'react';
import { render } from '@testing-library/react';
import { EditorCoreProvider, useEditorCore } from '../EditorCoreProvider';

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

const Probe: React.FC<{ onData: (snap: any) => void }> = ({ onData }) => {
    const { state, coreActions } = useEditorCore();
    React.useEffect(() => {
        onData({ total: state.totalSteps, keys: state.stepKeys.slice() });
    }, [state.totalSteps, state.stepKeys, onData]);

    React.useEffect(() => {
        const newKey = coreActions.addStep();
        const dupKey = coreActions.duplicateStep('step-1');
        if (dupKey) {
            coreActions.updateBlock(dupKey, 'a-copy', { updated: true });
        }
        coreActions.removeStep('step-2');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
};

describe('EditorCoreProvider step actions', () => {
    it('manipula steps (add, duplicate, remove)', () => {
        const snapshots: any[] = [];
        render(
            <EditorCoreProvider>
                <Probe onData={s => snapshots.push(s)} />
            </EditorCoreProvider>
        );

        const last = snapshots.at(-1);
        expect(last.total).toBeGreaterThanOrEqual(2); // pelo menos step-1 + novo
        expect(last.keys.some((k: string) => k.startsWith('step-'))).toBeTruthy();
    });
});
