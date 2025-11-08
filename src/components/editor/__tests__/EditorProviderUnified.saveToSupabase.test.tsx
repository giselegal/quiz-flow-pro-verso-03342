import React, { useEffect } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { EditorProviderCanonical, useEditor } from '@/components/editor/EditorProviderCanonical';

// Definições hoisted para evitar TDZ em fábricas de vi.mock
const m = vi.hoisted(() => {
    return {
        saveFunnel: vi.fn(async (funnel: any) => ({ success: true, data: funnel })),
        getComponents: vi.fn(async () => []),
        deleteComponent: vi.fn(async () => true),
        addComponent: vi.fn(async (input: any) => ({ id: `${input.instanceKey}` })),
    };
});

// Mock do UnifiedCRUD via contexts
vi.mock('@/contexts', async (orig) => {
    const actual = await (orig as any)();
    return {
        ...actual,
        useUnifiedCRUD: () => ({ saveFunnel: m.saveFunnel, isLoading: false, isSaving: false }),
    };
});

// Mock do serviço de componentes no Supabase
vi.mock('@/services/funnelComponentsService', () => ({
    funnelComponentsService: {
        getComponents: m.getComponents,
        deleteComponent: m.deleteComponent,
        addComponent: m.addComponent,
    },
}));

// Helper para disparar save ao montar
const TriggerSave: React.FC = () => {
    const ctx = useEditor();
    useEffect(() => {
        ctx.actions.saveToSupabase?.();
    }, []);
    return null;
};

describe('EditorProviderUnified.saveToSupabase', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('salva stages no UnifiedCRUD e sincroniza component_instances', async () => {
        const initial = {
            stepBlocks: {
                'step-01': [
                    { id: 'block-1', type: 'text', order: 0, properties: { text: 'Oi' }, content: { extra: true } },
                ],
            },
            currentStep: 1,
        } as any;

        render(
            <EditorProviderCanonical enableSupabase={true} funnelId="f-1" initial={initial}>
                <TriggerSave />
            </EditorProviderCanonical>,
        );

        await waitFor(() => {
            expect(m.saveFunnel).toHaveBeenCalledTimes(1);
        });

        const arg = m.saveFunnel.mock.calls[0][0];
        expect(arg).toBeTruthy();
        expect(arg.id).toBe('f-1');
        expect(Array.isArray(arg.stages)).toBe(true);
        expect(arg.stages.length).toBe(1);
        expect(arg.stages[0].blocks.length).toBe(1);

        // Sincronização com component_instances: limpa (0) e insere 1 componente
        await waitFor(() => {
            expect(m.getComponents).toHaveBeenCalledWith({ funnelId: 'f-1', stepNumber: 1 });
        });
        await waitFor(() => {
            expect(m.addComponent).toHaveBeenCalledTimes(1);
        });
        const addArg = m.addComponent.mock.calls[0][0];
        expect(addArg).toMatchObject({
            funnelId: 'f-1',
            stepNumber: 1,
            instanceKey: 'block-1',
            componentTypeKey: 'text',
            orderIndex: 1,
        });
        // properties merge de properties + content
        expect(addArg.properties).toMatchObject({ text: 'Oi', extra: true });
    });
});
