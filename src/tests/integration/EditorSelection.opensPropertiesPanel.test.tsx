import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// 1) Mock UI global para capturar abertura do painel de propriedades
const toggleSpy = vi.fn();
vi.mock('@/hooks/core/useGlobalState', () => ({
    useGlobalUI: () => ({ ui: { propertiesPanelOpen: false }, togglePropertiesPanel: toggleSpy })
}));

// 2) Mock do EditorProviderUnified: fornecer state.stepBlocks e actions.setSelectedBlockId
const setSelectedBlockIdSpy = vi.fn();
vi.mock('@/components/editor/EditorProviderUnified', async (orig) => {
    const actual = await (orig as any)();
    return {
        ...actual,
        useEditor: () => ({
            state: {
                // stepKey normalizado vira 'step-01' a partir de 'step-1'
                stepBlocks: {
                    'step-01': [
                        { id: 'real-opt', type: 'quiz-options', order: 0, properties: {}, content: {} },
                    ],
                },
                selectedBlockId: null,
                currentStep: 1,
            },
            actions: {
                setSelectedBlockId: setSelectedBlockIdSpy,
                reorderBlocks: vi.fn(),
            },
        }),
    };
});

// 3) Mock dos componentes modulares usados dentro do UnifiedStepContent
//    Vamos simular um step de pergunta que expõe um botão que chama onOpenProperties('question-options')
vi.mock('@/components/quiz-modular', () => ({
    ModularQuestionStep: (props: any) => (
        <button data-testid="open-props" onClick={() => props.onOpenProperties?.('question-options')}>
            Abrir Propriedades
        </button>
    ),
    ModularIntroStep: (props: any) => <div data-testid="intro-step" />,
    ModularStrategicQuestionStep: (props: any) => <div data-testid="strategic-step" />,
    ModularTransitionStep: (props: any) => <div data-testid="transition-step" />,
    ModularResultStep: (props: any) => <div data-testid="result-step" />,
    ModularOfferStep: (props: any) => <div data-testid="offer-step" />,
}));

// 4) Mock helpers de adaptação para reduzir dependências
vi.mock('@/utils/StepDataAdapter', () => ({
    adaptStepData: (step: any) => step,
}));

// 5) Importar o conteúdo unificado do step (que chama os componentes acima)
import { UnifiedStepContent } from '@/components/editor/renderers/common/UnifiedStepContent';

// Utilitário: construir um step mínimo de pergunta
const makeQuestionStep = () => ({
    id: 'step-1',
    type: 'question',
    order: 1,
    blocks: [
        { id: 'real-opt', type: 'quiz-options', order: 0, properties: {}, content: {} },
    ],
});

describe('Seleção de bloco abre Painel de Propriedades', () => {
    beforeEach(() => {
        setSelectedBlockIdSpy.mockClear();
        toggleSpy.mockClear();
    });

    it('ao clicar para abrir propriedades de question-options, seleciona bloco real e aciona toggle do painel', async () => {
        render(
            <UnifiedStepContent
                step={makeQuestionStep() as any}
                isEditMode
                isPreviewMode={false}
                sessionData={{}}
                productionParityInEdit
                autoAdvanceInEdit={false}
            />
        );

        const btn = await screen.findByTestId('open-props');
        fireEvent.click(btn);

        // Deve mapear 'question-options' para o bloco real 'real-opt' e selecionar via provider
        expect(setSelectedBlockIdSpy).toHaveBeenCalledTimes(1);
        expect(setSelectedBlockIdSpy).toHaveBeenCalledWith('real-opt');

        // E deve pedir abertura do painel de propriedades
        expect(toggleSpy).toHaveBeenCalledTimes(1);
    });
});
