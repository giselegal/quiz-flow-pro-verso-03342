import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import QuizEstiloPessoalPage from '../QuizEstiloPessoalPage';

describe('QuizEstiloPessoalPage (smoke)', () => {
    test('monta e exibe container raiz do quiz', () => {
        const { container } = render(<QuizEstiloPessoalPage />);
        expect(container.querySelector('.quiz-estilo-page')).toBeTruthy();
    });
});
