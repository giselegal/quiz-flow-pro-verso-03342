import React from 'react';
import { render } from '@testing-library/react';
import { EditorCoreProvider, useEditorCore } from '../EditorCoreProvider';

jest.mock('@/components/editor/provider-alias', () => ({
    useEditor: () => ({
        state: {
            stepBlocks: {
                'step-1': [
                    { id: 'a', type: 'text', content: 'Hello' },
                    { id: 'b', type: 'image' }
                ]
            },
            currentStep: 1,
            selectedBlockId: null
        },
        actions: {}
    })
}));

const Probe: React.FC<{ onDone: (snapshot: any) => void }> = ({ onDone }) => {
    const { state, coreActions } = useEditorCore();
    React.useEffect(() => {
        const newId = coreActions.duplicateBlock('step-1', 'a');
        onDone({ newId, blocks: state.stepBlocks?.['step-1'] || [] });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
};

describe('duplicateBlock core action', () => {
    it('duplica bloco e insere após original', () => {
        let snapshot: any = null;
        render(
            <EditorCoreProvider>
                <Probe onDone={(s) => (snapshot = s)} />
            </EditorCoreProvider>
        );
        expect(snapshot).toBeTruthy();
        const ids = snapshot.blocks.map((b: any) => b.id);
        const aIndex = ids.indexOf('a');
        expect(aIndex).toBeGreaterThanOrEqual(0);
        expect(ids[aIndex + 1]).toContain('a-copy-');
    });
});
