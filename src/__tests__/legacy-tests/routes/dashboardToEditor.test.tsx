import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '@/App';

// Testa que no dashboard existe CTA para abrir o editor e que a navegação renderiza o container do editor

describe('Dashboard -> Editor access', () => {
    it('exibe botão Abrir Editor e navega para /editor', async () => {
        window.history.pushState({}, 'Dashboard', '/admin/dashboard');
        render(<App />);

        // Botão foi adicionado no UnifiedAdminLayout
        const openEditorBtn = await screen.findByRole('button', { name: /Abrir Editor/i });
        expect(openEditorBtn).toBeInTheDocument();

        fireEvent.click(openEditorBtn);

        // O editor principal tem este test id
        const editorContainer = await screen.findByTestId('quiz-modular-production-editor-page');
        expect(editorContainer).toBeInTheDocument();
    });
});
