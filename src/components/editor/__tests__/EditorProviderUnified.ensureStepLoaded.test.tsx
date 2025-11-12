/* @vitest-environment jsdom */
/**
 * @deprecated Este teste usa EditorProviderCanonical (deprecated).
 * Migrar para SuperUnifiedProvider e useEditor de @/hooks/useEditor
 */
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { EditorProviderCanonical, useEditor } from '@/components/editor/EditorProviderCanonical';
import { templateService } from '@/services/canonical/TemplateService';
import TemplateLoader from '@/services/editor/TemplateLoader';

const MasterJSONFixture = {
    templateVersion: '3.0',
    steps: {
        'step-03': {
            type: 'question',
            sections: [
                { type: 'question-hero', id: 'hero-03', content: {} },
                { type: 'options-grid', id: 'grid-03', content: {} },
            ],
        },
        'step-21': {
            type: 'offer',
            sections: [
                { type: 'offer-hero', id: 'offer-hero-21', content: {} },
            ],
        },
    },
};

function TestConsumer({ onReady }: { onReady: (ctx: ReturnType<typeof useEditor>) => void }) {
    const ctx = useEditor();
    React.useEffect(() => { onReady(ctx); }, [ctx, onReady]);
    return null;
}

describe('EditorProviderUnified.ensureStepLoaded', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        // Mock global fetch neutro (não usado diretamente após migração)
        vi.spyOn(global, 'fetch' as any).mockResolvedValue({
            ok: true,
            json: async () => ({}),
        } as any);
    });

    it('carrega blocos do master JSON hidratado para step-03 (question)', async () => {
        let actions: any;
        let state: any;
        const onReady = (ctx: any) => { actions = ctx.actions; state = ctx.state; };
        render(
            <EditorProviderCanonical>
                <TestConsumer onReady={onReady} />
            </EditorProviderCanonical>,
        );

        // Mock TemplateService para devolver blocos esperados para step-03
        vi.spyOn(templateService, 'getStep').mockResolvedValue({
            success: true,
            data: [
                { id: 'hero-03', type: 'quiz-question-header', order: 0, properties: {}, content: {} } as any,
                { id: 'grid-03', type: 'options-grid', order: 1, properties: {}, content: {} } as any,
            ],
            error: undefined,
        } as any);

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
            <EditorProviderCanonical>
                <TestConsumer onReady={onReady} />
            </EditorProviderCanonical>,
        );

        vi.spyOn(templateService, 'getStep').mockResolvedValue({
            success: true,
            data: [
                { id: 'offer-hero-21', type: 'offer-hero', order: 0, properties: {}, content: {} } as any,
            ],
            error: undefined,
        } as any);

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
            <EditorProviderCanonical>
                <TestConsumer onReady={onReady} />
            </EditorProviderCanonical>,
        );

        // Espionar TemplateLoader interno para verificar a origem detectada
        const loaderSpy = vi.spyOn(TemplateLoader.prototype as any, 'loadStep');

        vi.spyOn(templateService, 'getStep').mockResolvedValue({
            success: true,
            data: [
                { id: 'result-main', type: 'result-main', order: 0, properties: {}, content: {} } as any,
            ],
            error: undefined,
        } as any);

        await actions.ensureStepLoaded('step-20');

        await waitFor(() => {
            const blocks = state.stepBlocks['step-20'];
            expect(Array.isArray(blocks)).toBe(true);
            expect(blocks.length).toBeGreaterThan(0);
            // confirma que o loader foi consultado para detectar a source
            expect(loaderSpy).toHaveBeenCalledWith('step-20');
            expect(state.stepSources['step-20']).toBeTruthy();
        });
    });

    it('prioriza JSON estático modular para step-12 (transition)', async () => {
        let actions: any;
        let state: any;
        const onReady = (ctx: any) => { actions = ctx.actions; state = ctx.state; };
        render(
            <EditorProviderCanonical>
                <TestConsumer onReady={onReady} />
            </EditorProviderCanonical>,
        );

        const loaderSpy = vi.spyOn(TemplateLoader.prototype as any, 'loadStep');

        vi.spyOn(templateService, 'getStep').mockResolvedValue({
            success: true,
            data: [
                { id: 'transition-title', type: 'transition-title', order: 0, properties: {}, content: {} } as any,
            ],
            error: undefined,
        } as any);

        await actions.ensureStepLoaded('step-12');

        await waitFor(() => {
            const blocks = state.stepBlocks['step-12'];
            expect(Array.isArray(blocks)).toBe(true);
            expect(blocks.length).toBeGreaterThan(0);
            expect(loaderSpy).toHaveBeenCalledWith('step-12');
            expect(state.stepSources['step-12']).toBeTruthy();
        });
    });

    it('prioriza JSON estático modular para step-19 (strategic-question)', async () => {
        let actions: any;
        let state: any;
        const onReady = (ctx: any) => { actions = ctx.actions; state = ctx.state; };
        render(
            <EditorProviderCanonical>
                <TestConsumer onReady={onReady} />
            </EditorProviderCanonical>,
        );

        const loaderSpy = vi.spyOn(TemplateLoader.prototype as any, 'loadStep');

        vi.spyOn(templateService, 'getStep').mockResolvedValue({
            success: true,
            data: [
                { id: 'transition-text', type: 'transition-text', order: 0, properties: {}, content: {} } as any,
            ],
            error: undefined,
        } as any);

        await actions.ensureStepLoaded('step-19');

        await waitFor(() => {
            const blocks = state.stepBlocks['step-19'];
            expect(Array.isArray(blocks)).toBe(true);
            expect(blocks.length).toBeGreaterThan(0);
            expect(loaderSpy).toHaveBeenCalledWith('step-19');
            expect(state.stepSources['step-19']).toBeTruthy();
        });
    });
});
