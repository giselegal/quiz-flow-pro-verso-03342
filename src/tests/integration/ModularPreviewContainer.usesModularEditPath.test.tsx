import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock dos steps modulares no UnifiedStepRenderer
vi.mock('@/components/editor/quiz-estilo/ModularTransitionStep', () => ({
    default: (props: any) => <div data-testid="modular-transition-step">ModularTransitionStep OK</div>
}));

vi.mock('@/components/editor/quiz-estilo/ModularResultStep', () => ({
    default: (props: any) => <div data-testid="modular-result-step">ModularResultStep OK</div>
}));

// Evitar dependências complexas do runtime
vi.mock('@/utils/StepDataAdapter', () => ({
    adaptStepData: (step: any) => step,
    extractStepNumber: (id: string) => parseInt(id.replace('step-', '')) || 1
}));

// Mock do useQuizState para controlar etapa atual
vi.mock('@/hooks/useQuizState', () => ({
    useQuizState: (funnelId?: string, externalSteps?: any) => {
        const steps = externalSteps || {
            'step-12': { id: 'step-12', type: 'transition', title: 'Transição 12' },
            'step-19': { id: 'step-19', type: 'transition', title: 'Transição 19' },
            'step-20': { id: 'step-20', type: 'result', title: 'Resultado 20' }
        };
        const [current, setCurrent] = React.useState('step-12');
        return {
            state: {
                currentStep: current,
                userProfile: { userName: 'Teste', resultStyle: 'natural', secondaryStyles: [] },
                answers: {}
            },
            currentStepData: steps[current],
            progress: 50,
            nextStep: () => setCurrent('step-20'),
            previousStep: () => setCurrent('step-12'),
            setUserName: vi.fn(),
            addAnswer: vi.fn(),
            addStrategicAnswer: vi.fn(),
        };
    }
}));

// Mock do EditorProvider para reduzir ruído (usamos o provider real quando ausente)
vi.mock('@/components/editor/EditorProviderUnified', async (orig) => {
    const actual = await (orig as any)();
    return {
        ...actual,
        useEditorOptional: () => undefined,
    };
});

// UI global
vi.mock('@/hooks/core/useGlobalState', () => ({
    useGlobalUI: () => ({ ui: { propertiesPanelOpen: false }, togglePropertiesPanel: vi.fn() })
}));

import { ModularPreviewContainer } from '@/components/editor/quiz/ModularPreviewContainer';

describe('ModularPreviewContainer', () => {
    it('usa o caminho modular em modo edição para transição e resultado', async () => {
        render(<ModularPreviewContainer />);

        // Inicialmente step-12 de transição
        const trans = await screen.findByTestId('modular-transition-step');
        expect(trans).toBeInTheDocument();

        // Simula avançar (mock do useQuizState troca para step-20)
        // Clicar no botão "Próximo →"
        const next = await screen.findByRole('button', { name: /próximo/i });
        next.click();

        const result = await screen.findByTestId('modular-result-step');
        expect(result).toBeInTheDocument();
    });
});
