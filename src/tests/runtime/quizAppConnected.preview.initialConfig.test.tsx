import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';

describe('QuizAppConnected - Preview com initialConfig não deve chamar API de configuração', () => {
    let fetchSpy: any;

    beforeEach(() => {
        vi.resetModules();
        fetchSpy = vi.spyOn(global as any, 'fetch');
    });

    afterEach(() => {
        fetchSpy.mockRestore();
    });

    it('usa steps do initialConfig e evita chamadas à API', async () => {
        const apiMod = await import('@/services/ConfigurationAPI');
        const getConfigSpy = vi.spyOn(apiMod.ConfigurationAPI.prototype, 'getConfiguration');

        const QuizAppConnected = (await import('@/components/quiz/QuizAppConnected')).default;

        const initialConfig = {
            steps: [
                { id: 'step-01', type: 'intro', title: 'Intro', blocks: [] },
                { id: 'step-02', type: 'question', title: 'Pergunta 1', blocks: [] },
            ]
        };

        // Renderizar em preview
        render(<QuizAppConnected previewMode initialConfig={initialConfig} initialStepId="step-01" />);

        // Aguarda um microtask para efeitos
        await Promise.resolve();

        expect(getConfigSpy).not.toHaveBeenCalled();
        expect(fetchSpy).not.toHaveBeenCalled();
    });
});
