import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mocks dos componentes modulares com testids específicos
vi.mock('@/components/editor/quiz-estilo/ModularTransitionStep', () => ({
    default: (props: any) => <div data-testid="modular-transition-step">Transition OK ({props?.data?.id})</div>
}));

vi.mock('@/components/editor/quiz-estilo/ModularResultStep', () => ({
    default: (props: any) => <div data-testid="modular-result-step">Result OK ({props?.data?.id})</div>
}));

// Adapter simplificado
vi.mock('@/utils/StepDataAdapter', () => ({
    adaptStepData: (step: any) => step,
    extractStepNumber: (id: string) => parseInt(id.replace('step-', '')) || 1
}));

// UI global
vi.mock('@/hooks/core/useGlobalState', () => ({
    useGlobalUI: () => ({ ui: { propertiesPanelOpen: false }, togglePropertiesPanel: vi.fn() })
}));

import { UnifiedStepRenderer } from '@/components/editor/quiz/components/UnifiedStepRenderer';

describe('UnifiedStepRenderer (edit) - steps 12, 19, 20', () => {
    it('step-12 (transition) → usa ModularTransitionStep', async () => {
        render(
            <UnifiedStepRenderer
                step={{ id: 'step-12', type: 'transition', title: 'S12' } as any}
                mode="edit"
            />
        );
        const el = await screen.findByTestId('modular-transition-step');
        expect(el).toBeInTheDocument();
        expect(el.textContent).toContain('step-12');
    });

    it('step-19 (transition-result) → usa ModularTransitionStep', async () => {
        render(
            <UnifiedStepRenderer
                step={{ id: 'step-19', type: 'transition-result', title: 'S19' } as any}
                mode="edit"
            />
        );
        const el = await screen.findByTestId('modular-transition-step');
        expect(el).toBeInTheDocument();
        expect(el.textContent).toContain('step-19');
    });

    it('step-20 (result) → usa ModularResultStep', async () => {
        render(
            <UnifiedStepRenderer
                step={{ id: 'step-20', type: 'result', title: 'S20' } as any}
                mode="edit"
            />
        );
        const el = await screen.findByTestId('modular-result-step');
        expect(el).toBeInTheDocument();
        expect(el.textContent).toContain('step-20');
    });
});
