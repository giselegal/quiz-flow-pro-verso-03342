import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, act, waitFor } from '@testing-library/react';
import { EditorProvider as MigrationEditorProvider, useEditor } from '@/components/editor/EditorProviderMigrationAdapter';
import type { EditorState } from '@/components/editor/EditorProviderMigrationAdapter';
import type { Block } from '@/types/editor';

// Probes reutilizáveis
const ProviderHarness: React.FC<React.PropsWithChildren<{ initial?: Partial<EditorState> }>> = ({ initial, children }) => (
    <MigrationEditorProvider funnelId="test-funnel">
        {children}
    </MigrationEditorProvider>
);

const EditorActionsProbe: React.FC<{ onReady: (ctx: ReturnType<typeof useEditor>) => void }> = ({ onReady }) => {
    const ctx = useEditor();
    React.useEffect(() => { onReady(ctx); }, []);
    return <div data-testid="probe" />;
};

const EditorStateProbe: React.FC<{ onUpdate: (s: EditorState) => void }> = ({ onUpdate }) => {
    const editorContext = useEditor({ optional: true });
    if (!editorContext) return null;
    const { state } = editorContext;
    React.useEffect(() => { onUpdate(state); }, [state]);
    return null;
};

describe('EditorProvider: multi-step reorder/insert isolation', () => {
    it('manipula steps 2 e 3 sem interferência e mantém ordem esperada', async () => {
        let ctxRef: ReturnType<typeof useEditor> | null = null;
        let last: EditorState | null = null;

        render(
            <ProviderHarness initial={{ currentStep: 1, stepBlocks: { 'step-2': [], 'step-3': [] } }}>
                <EditorActionsProbe onReady={(c) => (ctxRef = c)} />
                <EditorStateProbe onUpdate={(s) => (last = s)} />
            </ProviderHarness>
        );

        expect(ctxRef).toBeTruthy();
        const { actions } = ctxRef!;

        const step2 = 'step-2';
        const step3 = 'step-3';

        const A2: Block = { id: 'A2', type: 'text', order: 1, content: {}, properties: {} };
        const B2: Block = { id: 'B2', type: 'text', order: 2, content: {}, properties: {} };
        await act(async () => {
            await actions.addBlock(step2, A2);
            await actions.addBlock(step2, B2);
        });
        await waitFor(() => expect((last!.stepBlocks[step2] || []).map(b => b.id)).toEqual(['A2', 'B2']));

        const C2: Block = { id: 'C2', type: 'text', order: 3, content: {}, properties: {} };
        await act(async () => { await actions.addBlockAtIndex(step2, C2, 1); });
        await waitFor(() => expect((last!.stepBlocks[step2] || []).map(b => b.id)).toEqual(['A2', 'C2', 'B2']));

        await act(async () => { await actions.reorderBlocks(step2, 1, 2); });
        await waitFor(() => expect((last!.stepBlocks[step2] || []).map(b => b.id)).toEqual(['A2', 'B2', 'C2']));

        // Step 3 ainda vazio
        expect((last!.stepBlocks[step3] || []).length).toBe(0);

        // Agora opera no step 3
        const A3: Block = { id: 'A3', type: 'text', order: 1, content: {}, properties: {} };
        const B3: Block = { id: 'B3', type: 'text', order: 2, content: {}, properties: {} };
        const C3: Block = { id: 'C3', type: 'text', order: 3, content: {}, properties: {} };
        await act(async () => {
            await actions.addBlock(step3, A3);
            await actions.addBlock(step3, B3);
            await actions.addBlockAtIndex(step3, C3, 1);
            await actions.reorderBlocks(step3, 1, 2);
        });

        await waitFor(() => expect((last!.stepBlocks[step3] || []).map(b => b.id)).toEqual(['A3', 'B3', 'C3']));
        // Confirma step 2 permanece inalterado
        expect((last!.stepBlocks[step2] || []).map(b => b.id)).toEqual(['A2', 'B2', 'C2']);
    });

    it('também funciona com step 1 e 4 ao mesmo tempo', async () => {
        let ctxRef: ReturnType<typeof useEditor> | null = null;
        let last: EditorState | null = null;

        render(
            <ProviderHarness initial={{ currentStep: 1, stepBlocks: { 'step-1': [], 'step-4': [] } }}>
                <EditorActionsProbe onReady={(c) => (ctxRef = c)} />
                <EditorStateProbe onUpdate={(s) => (last = s)} />
            </ProviderHarness>
        );

        expect(ctxRef).toBeTruthy();
        const { actions } = ctxRef!;

        const s1 = 'step-1';
        const s4 = 'step-4';

        await act(async () => {
            await actions.addBlock(s1, { id: 'A1', type: 'text', order: 1, content: {}, properties: {} });
            await actions.addBlock(s1, { id: 'B1', type: 'text', order: 2, content: {}, properties: {} });
            await actions.addBlockAtIndex(s1, { id: 'C1', type: 'text', order: 3, content: {}, properties: {} }, 1);
            await actions.reorderBlocks(s1, 1, 2);
        });
        await waitFor(() => expect((last!.stepBlocks[s1] || []).map(b => b.id)).toEqual(['A1', 'B1', 'C1']));

        await act(async () => {
            await actions.addBlock(s4, { id: 'A4', type: 'text', order: 1, content: {}, properties: {} });
            await actions.addBlock(s4, { id: 'B4', type: 'text', order: 2, content: {}, properties: {} });
            await actions.addBlockAtIndex(s4, { id: 'C4', type: 'text', order: 3, content: {}, properties: {} }, 1);
            await actions.reorderBlocks(s4, 1, 2);
        });
        await waitFor(() => expect((last!.stepBlocks[s4] || []).map(b => b.id)).toEqual(['A4', 'B4', 'C4']));

        // Isolamento
        expect((last!.stepBlocks[s1] || []).map(b => b.id)).toEqual(['A1', 'B1', 'C1']);
    });

    it('opera corretamente em steps 5, 8, 12, 16 e 20', async () => {
        let ctxRef: ReturnType<typeof useEditor> | null = null;
        let last: EditorState | null = null;

        render(
            <ProviderHarness initial={{ currentStep: 1 }}>
                <EditorActionsProbe onReady={(c) => (ctxRef = c)} />
                <EditorStateProbe onUpdate={(s) => (last = s)} />
            </ProviderHarness>
        );

        expect(ctxRef).toBeTruthy();
        const { actions } = ctxRef!;

        const steps = [5, 8, 12, 16, 20];
        for (const n of steps) {
            const key = `step-${n}`;
            await act(async () => {
                await actions.addBlock(key, { id: `A${n}`, type: 'text', order: 1, content: {}, properties: {} });
                await actions.addBlock(key, { id: `B${n}`, type: 'text', order: 2, content: {}, properties: {} });
                await actions.addBlockAtIndex(key, { id: `C${n}`, type: 'text', order: 3, content: {}, properties: {} }, 1);
                await actions.reorderBlocks(key, 1, 2);
            });

            await waitFor(() => {
                expect((last!.stepBlocks[key] || []).map(b => b.id)).toEqual([`A${n}`, `B${n}`, `C${n}`]);
            });
        }

        // Confirma que cada step mantém sua própria ordem sem interferência
        steps.forEach((n) => {
            const key = `step-${n}`;
            expect((last!.stepBlocks[key] || []).map(b => b.id)).toEqual([`A${n}`, `B${n}`, `C${n}`]);
        });
    });
});
