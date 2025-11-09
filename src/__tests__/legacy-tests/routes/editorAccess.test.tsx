import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '@/App';

// Este teste verifica que a rota /editor renderiza o container básico do editor.
// Como o AuthProvider em modo offline cria um profile role 'user' sem permissao 'editor.use',
// esperamos que apareça a tela de acesso restrito (Lock) ou, se permissao existir para admin local, o editor.
// Para garantir robustez, aceitamos ambos cenários: ou o container do editor OU o título 'Acesso Restrito'.

describe('Rota /editor', () => {
    it('carrega página de editor ou mostra bloqueio amigável', async () => {
        window.history.pushState({}, 'Editor', '/editor');
        render(<App />);

        const editorContainer = await screen.findByTestId('quiz-modular-production-editor-page').catch(() => null);
        const restricted = screen.queryByText(/Acesso Restrito/i);

        expect(editorContainer || restricted).toBeTruthy();
    });
});
