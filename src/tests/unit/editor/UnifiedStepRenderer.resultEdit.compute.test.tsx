import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

// Mock ModularResultStep para capturar props
let receivedProps: any = null;
vi.mock('@/components/editor/quiz-estilo/ModularResultStep', () => ({
    default: (props: any) => {
        receivedProps = props;
        return <div data-testid="modular-result-step">ModularResultStep</div>;
    }
}));

// Mocks auxiliares
vi.mock('@/utils/StepDataAdapter', () => ({
    adaptStepData: (step: any) => step,
    extractStepNumber: (id: string) => parseInt(id.replace('step-', '')) || 1
}));

vi.mock('@/hooks/core/useGlobalState', () => ({
    useGlobalUI: () => ({ ui: { propertiesPanelOpen: false }, togglePropertiesPanel: vi.fn() })
}));

import { UnifiedStepRenderer } from '@/components/editor/quiz/components/UnifiedStepRenderer';


describe('UnifiedStepRenderer - result (edit) com computeResult', () => {
    it('calcula resultado real e injeta em ModularResultStep (resultStyle + scores)', async () => {
        // respostas artificiais: step-02 com 2 naturais e 1 classico => natural deve vencer
        const sessionData = {
            'answers_step-02': ['natural', 'natural', 'classico']
        };

        render(
            <UnifiedStepRenderer
                step={{ id: 'step-20', type: 'result', title: 'Resultado' } as any}
                mode="edit"
                sessionData={sessionData}
            />
        );

        const el = await screen.findByTestId('modular-result-step');
        expect(el).toBeInTheDocument();

        await waitFor(() => {
            expect(receivedProps).toBeTruthy();
            const profile = receivedProps.userProfile;
            expect(profile).toBeTruthy();
            // resultStyle calculado deve ser 'natural'
            expect(profile.resultStyle).toBe('natural');
            // scores deve conter chaves principais
            const names = (profile.scores || []).map((s: any) => s.name).sort();
            expect(names).toEqual(expect.arrayContaining([
                'natural', 'classico', 'contemporaneo', 'elegante', 'romantico', 'sexy', 'dramatico', 'criativo'
            ]));
        });
    });
});
