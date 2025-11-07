import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import App from '@/App';
import { renderAppAt } from '@/tests/utils/renderWithProviders';

describe('Rota /editor - smoke render', () => {
    it('renderiza QuizModularProductionEditor dentro do container esperado', async () => {
        window.history.pushState({}, 'Editor', '/editor?template=quiz21StepsComplete');
        renderAppAt('/editor?template=quiz21StepsComplete', <App />);

        const editorContainer = await screen.findByTestId('quiz-modular-production-editor-page-optimized');
        expect(editorContainer).toBeInTheDocument();
    });
});
