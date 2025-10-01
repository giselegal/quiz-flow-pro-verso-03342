import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import QuizEstiloPessoalPage from '@/pages/QuizEstiloPessoalPage';

// Smoke test básico para garantir que a página do quiz monta sem disparar error boundary
// (O ErrorBoundary não é incluído aqui; se houver throw na renderização imediata, o teste falhará)

describe('QuizEstiloPessoalPage (smoke)', () => {
    test('monta e renderiza container principal do quiz', () => {
        const { container } = render(<QuizEstiloPessoalPage />);
        const root = container.querySelector('.quiz-estilo-page');
        expect(root).toBeTruthy();
    });
});
