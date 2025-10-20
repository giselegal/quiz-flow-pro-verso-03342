/* @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { EditorProviderUnified, useEditor } from '@/components/editor/EditorProviderUnified';
import * as loadStepTemplates from '@/utils/loadStepTemplates';

const MasterJSONFixture = {
    templateVersion: '3.0',
    steps: {
        'step-03': {
            type: 'question',
            sections: [
                { type: 'question-hero', id: 'hero-03', content: {} },
                { type: 'options-grid', id: 'grid-03', content: {} },
            ]
        },
        'step-21': {
            type: 'offer',
            sections: [
                { type: 'offer-hero', id: 'offer-hero-21', content: {} }
            ]
        }
    }
};

function TestConsumer({ onReady }: { onReady: (ctx: ReturnType<typeof useEditor>) => void }) {
    const ctx = useEditor();
    React.useEffect(() => { onReady(ctx); }, [ctx, onReady]);
    return null;
}

describe('EditorProviderUnified.ensureStepLoaded', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        // Mock global fetch para retornar o master JSON fixture
        vi.spyOn(global, 'fetch' as any).mockResolvedValue({
            ok: true,
            json: async () => MasterJSONFixture,
        } as any);
    });

    it('carrega blocos do master JSON hidratado para step-03 (question)', async () => {
        let actions: any;
        let state: any;
        const onReady = (ctx: any) => { actions = ctx.actions; state = ctx.state; };
        render(
            <EditorProviderUnified>
                <TestConsumer onReady={onReady} />
            </EditorProviderUnified>
        );

        await actions.ensureStepLoaded('step-03');

        await waitFor(() => {
            const blocks = state.stepBlocks['step-03'];
            expect(Array.isArray(blocks)).toBe(true);
            expect(blocks.length).toBeGreaterThan(0);
            // Deve conter tipos mapeados a partir de sections question-hero/options-grid
            const types = blocks.map((b: any) => String(b.type));
            expect(types.some((t: string) => t === 'quiz-question-header')).toBe(true);
            expect(types.some((t: string) => t === 'options-grid')).toBe(true);
        });
    });

    it('carrega blocos do master JSON hidratado para step-21 (offer)', async () => {
        let actions: any;
        let state: any;
        const onReady = (ctx: any) => { actions = ctx.actions; state = ctx.state; };
        render(
            <EditorProviderUnified>
                <TestConsumer onReady={onReady} />
            </EditorProviderUnified>
        );

        await actions.ensureStepLoaded('step-21');

        await waitFor(() => {
            const blocks = state.stepBlocks['step-21'];
            expect(Array.isArray(blocks)).toBe(true);
            expect(blocks.length).toBeGreaterThan(0);
            const types = blocks.map((b: any) => String(b.type));
            expect(types.some((t: string) => t === 'offer-hero')).toBe(true);
        });
    });

    it('prioriza JSON estático modular para step-20 (result) quando disponível', async () => {
        let actions: any;
        let state: any;
        const onReady = (ctx: any) => { actions = ctx.actions; state = ctx.state; };
        render(
            <EditorProviderUnified>
                <TestConsumer onReady={onReady} />
            </EditorProviderUnified>
        );

        const spy = vi.spyOn(loadStepTemplates, 'loadStepTemplate');
        await actions.ensureStepLoaded('step-20');

        await waitFor(() => {
            const blocks = state.stepBlocks['step-20'];
            expect(Array.isArray(blocks)).toBe(true);
            expect(blocks.length).toBeGreaterThan(0);
            // confirma que veio do JSON modular
            expect(spy).toHaveBeenCalledWith('step-20');
        });
    });

    it('prioriza JSON estático modular para step-12 (transition)', async () => {
        let actions: any;
        let state: any;
        const onReady = (ctx: any) => { actions = ctx.actions; state = ctx.state; };
        render(
            <EditorProviderUnified>
                <TestConsumer onReady={onReady} />
            </EditorProviderUnified>
        );

        const spy = vi.spyOn(loadStepTemplates, 'loadStepTemplate');
        await actions.ensureStepLoaded('step-12');

        await waitFor(() => {
            const blocks = state.stepBlocks['step-12'];
            expect(Array.isArray(blocks)).toBe(true);
            expect(blocks.length).toBeGreaterThan(0);
            expect(spy).toHaveBeenCalledWith('step-12');
        });
    });

    it('prioriza JSON estático modular para step-19 (strategic-question)', async () => {
        let actions: any;
        let state: any;
        const onReady = (ctx: any) => { actions = ctx.actions; state = ctx.state; };
        render(
            <EditorProviderUnified>
                <TestConsumer onReady={onReady} />
            </EditorProviderUnified>
        );

        const spy = vi.spyOn(loadStepTemplates, 'loadStepTemplate');
        await actions.ensureStepLoaded('step-19');

        await waitFor(() => {
            const blocks = state.stepBlocks['step-19'];
            expect(Array.isArray(blocks)).toBe(true);
            expect(blocks.length).toBeGreaterThan(0);
            expect(spy).toHaveBeenCalledWith('step-19');
        });
    });
});
