import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock dos componentes modulares para facilitar a asserção
vi.mock('@/components/editor/quiz-estilo/ModularTransitionStep', () => ({
    default: (props: any) => <div data-testid="modular-transition-step">ModularTransitionStep OK</div>
}));

vi.mock('@/components/editor/quiz-estilo/ModularResultStep', () => ({
    default: (props: any) => <div data-testid="modular-result-step">ModularResultStep OK</div>
}));

// Simplificar adaptStepData para não depender de estruturas complexas
vi.mock('@/utils/StepDataAdapter', () => ({
    adaptStepData: (step: any) => step,
    extractStepNumber: (id: string) => parseInt(id.replace('step-', '')) || 1
}));

// Mock global UI para evitar dependências de estado
vi.mock('@/hooks/core/useGlobalState', () => ({
    useGlobalUI: () => ({ ui: { propertiesPanelOpen: false }, togglePropertiesPanel: vi.fn() })
}));

import { UnifiedStepRenderer } from '@/components/editor/quiz/components/UnifiedStepRenderer';

describe('UnifiedStepRenderer (modo edição) - passos modulares', () => {
    it('renderiza ModularTransitionStep para steps de transição (ex.: step-12)', async () => {
        render(
            <UnifiedStepRenderer
                step={{ id: 'step-12', type: 'transition', title: 'Transição' } as any}
                mode="edit"
            />
        );

        const el = await screen.findByTestId('modular-transition-step');
        expect(el).toBeInTheDocument();
        expect(el).toHaveTextContent('ModularTransitionStep OK');
    });

    it('renderiza ModularResultStep para step de resultado (ex.: step-20)', async () => {
        render(
            <UnifiedStepRenderer
                step={{ id: 'step-20', type: 'result', title: 'Resultado' } as any}
                mode="edit"
            />
        );

        const el = await screen.findByTestId('modular-result-step');
        expect(el).toBeInTheDocument();
        expect(el).toHaveTextContent('ModularResultStep OK');
    });
});
