import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';

describe('QuizAppConnected - EditorMode não deve baixar normalized JSON', () => {
    let fetchSpy: any;

    beforeEach(() => {
        vi.resetModules();
        fetchSpy = vi.spyOn(global as any, 'fetch');
    });

    afterEach(() => {
        fetchSpy.mockRestore();
    });

    it('não chama fetch para /templates/normalized em editorMode', async () => {
        const QuizAppConnected = (await import('@/components/quiz/QuizAppConnected')).default;

        const initialConfig = {
            steps: [
                { id: 'step-01', type: 'intro', title: 'Intro', blocks: [] },
                { id: 'step-02', type: 'question', title: 'Pergunta 1', blocks: [] },
            ]
        };

        render(<QuizAppConnected editorMode initialConfig={initialConfig} initialStepId="step-01" />);

        // Aguarda microtasks
        await Promise.resolve();
        await new Promise(r => setTimeout(r, 0));

        const calls: Array<RequestInfo | URL> = fetchSpy.mock.calls.map((c: [RequestInfo | URL, RequestInit?]) => c[0]);
        const normalizedCalls = calls.filter((url) => typeof url === 'string' && url.includes('/templates/normalized/'));
        expect(normalizedCalls.length).toBe(0);
    });
});
