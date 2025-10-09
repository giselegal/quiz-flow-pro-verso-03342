import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '@/App';
import { Router } from 'wouter';

/**
 * Teste de smoke para rota /auth garantindo que a página monta
 * e renderiza elementos principais de autenticação.
 */

describe('Rota /auth', () => {
    const renderAt = (path: string) => {
        window.history.pushState({}, 'Test', path);
        return render(
            <Router>
                <App />
            </Router>
        );
    };

    it('renderiza formulário de login (campos email e senha)', async () => {
        renderAt('/auth');

        // Campo de email
        const emailInput = await screen.findByPlaceholderText(/seu@email.com/i);
        expect(emailInput).toBeInTheDocument();

        // Campo de senha
        const passwordInput = screen.getByPlaceholderText(/Sua senha/i);
        expect(passwordInput).toBeInTheDocument();

        // Botão principal (Entrar ou Criar conta)
        const actionButton = screen.getByRole('button', { name: /entrar|criar conta/i });
        expect(actionButton).toBeInTheDocument();
    });

    it('exibe botão de login com Google (placeholder)', async () => {
        renderAt('/auth');
        const googleButton = await screen.findByRole('button', { name: /Continuar com Google/i });
        expect(googleButton).toBeInTheDocument();
    });
});
