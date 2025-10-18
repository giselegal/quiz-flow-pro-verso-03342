import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '@/App';

describe('Rota /editor - smoke render', () => {
    it('renderiza QuizModularProductionEditor dentro do container esperado', async () => {
        window.history.pushState({}, 'Editor', '/editor?template=quiz21StepsComplete');
        render(<App />);

        const editorContainer = await screen.findByTestId('quiz-modular-production-editor-page-optimized');
        expect(editorContainer).toBeInTheDocument();
    });
});
