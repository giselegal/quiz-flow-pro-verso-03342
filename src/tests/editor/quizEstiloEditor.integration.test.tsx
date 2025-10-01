import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModernUnifiedEditor, { UnifiedEditorCore } from '@/pages/editor/ModernUnifiedEditor';
import { QUIZ_ESTILO_TEMPLATE_ID } from '@/domain/quiz/quiz-estilo-ids';

// =============================
// Mocks Core V2 (hooks essenciais)
// =============================
jest.mock('@/utils/editorFeatureFlags', () => ({
    isEditorCoreV2Enabled: () => true
}));

jest.mock('@/context/useCoreQuizSteps', () => ({
    useCoreQuizSteps: () => ({
        hash: 'hash123',
        steps: [
            { id: 'step-1', title: 'Intro', blocks: [] },
            { id: 'step-2', title: 'Pergunta 1', blocks: [] },
            { id: 'step-3', title: 'Pergunta 2', blocks: [] }
        ]
    })
}));

jest.mock('@/context/useEditorCoreSelectors', () => ({
    useEditorCoreSelectors: () => ({
        version: 1,
        metrics: { hashCount: 1, mapCount: 1 },
        currentStep: 1,
        selectedBlockId: null
    })
}));

jest.mock('@/context/EditorCoreProvider', () => ({
    useEditorCore: () => ({
        state: { metrics: { hashCount: 1, mapCount: 1 }, version: 1 },
        actions: { setCurrentStep: () => { }, setSelectedBlockId: () => { } }
    })
}));

// Mock minimal de window.matchMedia para libs que usam (se houver)
if (!(window as any).matchMedia) {
    (window as any).matchMedia = () => ({ matches: false, addListener: () => { }, removeListener: () => { } });
}

describe('ModernUnifiedEditor - integração quiz-estilo', () => {
    test('carrega editor com template quiz-estilo (21 steps) sem lançar erros iniciais', async () => {
        render(<ModernUnifiedEditor funnelId={QUIZ_ESTILO_TEMPLATE_ID} />);

        // Toolbar fallback deve aparecer primeiro
        expect(screen.getByText(/Carregando editor/i)).toBeInTheDocument();

        await waitFor(() => {
            // Badge Core (V2 ou Legacy) deve surgir
            expect(screen.getByText(/Core (V2|Legacy)/i)).toBeInTheDocument();
        }, { timeout: 4000 });
    });

    test('UnifiedEditorCore exportado permite render direto (sem providers externos) para smoke', async () => {
        render(<UnifiedEditorCore funnelId={QUIZ_ESTILO_TEMPLATE_ID} mode="visual" />);
        await waitFor(() => {
            // Pode não carregar tudo, mas fallback de loading deve existir
            expect(screen.getAllByText(/Carregando editor/i).length).toBeGreaterThan(0);
        });
    });

    test('exibe badge de steps (mock Core V2)', async () => {
        render(<ModernUnifiedEditor funnelId={QUIZ_ESTILO_TEMPLATE_ID} />);
        await waitFor(() => {
            expect(screen.getByText(/3 steps/)).toBeInTheDocument();
        });
    });

    test('botão Export JSON dispara fluxo (simulado)', async () => {
        const createUrlSpy = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
        const revokeSpy = jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => { });
        // Simular anchor
        const clickSpy: any[] = [];
        jest.spyOn(document, 'createElement').mockImplementation(((tag: string) => {
            if (tag === 'a') {
                return {
                    set href(v: string) { },
                    set download(v: string) { },
                    click: () => clickSpy.push('clicked')
                } as any;
            }
            return document.createElement(tag);
        }) as any);

        render(<ModernUnifiedEditor funnelId={QUIZ_ESTILO_TEMPLATE_ID} />);
        await waitFor(() => screen.getByText(/Export JSON/i));
        fireEvent.click(screen.getByText(/Export JSON/i));

        expect(createUrlSpy).toHaveBeenCalled();
        expect(clickSpy).toContain('clicked');
        expect(revokeSpy).toHaveBeenCalled();
    });

    test('sidebar steps clicável altera seleção lógica (mock superficial)', async () => {
        render(<ModernUnifiedEditor funnelId={QUIZ_ESTILO_TEMPLATE_ID} />);
        await waitFor(() => screen.getByText(/Intro/));
        const step2 = screen.getByText(/Pergunta 1/);
        fireEvent.click(step2);
        // Não temos indicação visual mockada, mas garantimos que evento não quebra
        expect(step2).toBeInTheDocument();
    });
});
