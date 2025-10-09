import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '@/App';
import { Router } from 'wouter';

/**
 * Garante que /home redireciona para / e renderiza o conteúdo principal da Home.
 */

describe('Redirect /home → /', () => {
    const renderAt = (path: string) => {
        window.history.pushState({}, 'Test', path);
        return render(
            <Router>
                <App />
            </Router>
        );
    };

    it('renderiza seção principal da Home quando acessa /home', async () => {
        renderAt('/home');
        // Usa um texto característico do Hero
        const heroHeading = await screen.findByRole('heading', { name: /Quizzes Interativos/i });
        expect(heroHeading).toBeInTheDocument();
    });
});
