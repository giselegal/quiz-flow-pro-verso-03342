import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModernUnifiedEditor, { UnifiedEditorCore } from '@/pages/editor/ModernUnifiedEditor';
import { QUIZ_ESTILO_TEMPLATE_ID } from '@/domain/quiz/quiz-estilo-ids';

// Mock minimal de window.matchMedia para libs que usam (se houver)
if (!(window as any).matchMedia) {
    (window as any).matchMedia = () => ({ matches: false, addListener: () => { }, removeListener: () => { } });
}

describe('ModernUnifiedEditor - integração quiz-estilo', () => {
    test('carrega editor com template quiz-estilo (21 steps) sem lançar erros iniciais', async () => {
        render(<ModernUnifiedEditor funnelId={QUIZ_ESTILO_TEMPLATE_ID} />);

        // Toolbar fallback deve aparecer primeiro
        expect(screen.getByText(/Carregando editor/i)).toBeInTheDocument();

        await waitFor(() => {
            // Badge Core (V2 ou Legacy) deve surgir
            expect(screen.getByText(/Core (V2|Legacy)/i)).toBeInTheDocument();
        }, { timeout: 4000 });
    });

    test('UnifiedEditorCore exportado permite render direto (sem providers externos) para smoke', async () => {
        render(<UnifiedEditorCore funnelId={QUIZ_ESTILO_TEMPLATE_ID} mode="visual" />);
        await waitFor(() => {
            // Pode não carregar tudo, mas fallback de loading deve existir
            expect(screen.getAllByText(/Carregando editor/i).length).toBeGreaterThan(0);
        });
    });
});
