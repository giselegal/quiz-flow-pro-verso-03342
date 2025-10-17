import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mocks modulares
vi.mock('@/components/editor/quiz-estilo/ModularTransitionStep', () => ({
  default: (props: any) => <div data-testid={`modular-transition-step-${props?.data?.id}`}>Transition {props?.data?.id}</div>
}));
vi.mock('@/components/editor/quiz-estilo/ModularResultStep', () => ({
  default: (props: any) => <div data-testid={`modular-result-step-${props?.data?.id}`}>Result {props?.data?.id}</div>
}));

// Adapter simplificado
vi.mock('@/utils/StepDataAdapter', () => ({
  adaptStepData: (step: any) => step,
  extractStepNumber: (id: string) => parseInt(id.replace('step-', '')) || 1
}));

// Mock do estado do quiz controlado
vi.mock('@/hooks/useQuizState', () => ({
  useQuizState: (funnelId?: string, externalSteps?: any) => {
    const steps = externalSteps || {
      'step-12': { id: 'step-12', type: 'transition', title: 'S12' },
      'step-19': { id: 'step-19', type: 'transition-result', title: 'S19' },
      'step-20': { id: 'step-20', type: 'result', title: 'S20' },
    };
    const [current, setCurrent] = React.useState('step-12');
    return {
      state: {
        currentStep: current,
        userProfile: { userName: 'X', resultStyle: 'natural', secondaryStyles: [] },
        answers: {}
      },
      currentStepData: steps[current],
      progress: 75,
      nextStep: () => setCurrent((prev) => prev === 'step-12' ? 'step-19' : 'step-20'),
      previousStep: () => setCurrent((prev) => prev === 'step-20' ? 'step-19' : 'step-12'),
      setUserName: vi.fn(),
      addAnswer: vi.fn(),
      addStrategicAnswer: vi.fn(),
    };
  }
}));

// UI global
vi.mock('@/hooks/core/useGlobalState', () => ({
  useGlobalUI: () => ({ ui: { propertiesPanelOpen: false }, togglePropertiesPanel: vi.fn() })
}));

// EditorProviderOptional → não provido, o container criará
vi.mock('@/components/editor/EditorProviderUnified', async (orig) => {
  const actual = await (orig as any)();
  return {
    ...actual,
    useEditorOptional: () => undefined,
  };
});

import { ModularPreviewContainer } from '@/components/editor/quiz/ModularPreviewContainer';

describe('ModularPreviewContainer (edit mode) - steps 12 → 19 → 20', () => {
  it('navega e renderiza modularmente as etapas específicas', async () => {
    render(<ModularPreviewContainer />);

    // Começa em 12
    const s12 = await screen.findByTestId('modular-transition-step-step-12');
    expect(s12).toBeInTheDocument();

    // Avança para 19
    const next = await screen.findByRole('button', { name: /próximo/i });
    next.click();
    const s19 = await screen.findByTestId('modular-transition-step-step-19');
    expect(s19).toBeInTheDocument();

    // Avança para 20
    next.click();
    const s20 = await screen.findByTestId('modular-result-step-step-20');
    expect(s20).toBeInTheDocument();
  });
});
