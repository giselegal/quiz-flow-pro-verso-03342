import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';

describe('QuizAppConnected - Preview com initialConfig não deve chamar API de configuração', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    afterEach(() => {
    });

    it('usa steps do initialConfig e evita chamadas à API', async () => {
        const apiMod = await import('@/services/ConfigurationAPI');
        const getConfigSpy = vi.spyOn(apiMod.ConfigurationAPI.prototype, 'getConfiguration');

        const QuizAppConnected = (await import('@/components/quiz/QuizAppConnected')).default;

        const initialConfig = {
            steps: [
                { id: 'step-01', type: 'intro', title: 'Intro', blocks: [] },
                { id: 'step-02', type: 'question', title: 'Pergunta 1', blocks: [] },
            ],
        };

        // Renderizar em preview
        render(<QuizAppConnected previewMode initialConfig={initialConfig} initialStepId="step-01" />);

        // Aguarda um microtask para efeitos
        // aguarda microtask e mais um tick para effects
        await Promise.resolve();
        await new Promise(r => setTimeout(r, 0));

        expect(getConfigSpy).not.toHaveBeenCalled();
    });
});
