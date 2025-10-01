import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModernUnifiedEditor from '../ModernUnifiedEditor';

// Mocks para isolar teste de inserção (simulada) sem DnD completo
jest.mock('@/pages/editor/modern/hooks/useFunnelSync', () => () => ({ active: false }));
jest.mock('@/pages/editor/modern/hooks/useQuizSyncBridge', () => () => ({ active: false, steps: [] }));
jest.mock('../modern/logic/crudOperations', () => ({ useEditorCrudOperations: () => ({ currentFunnel: { id: 'f-1' } }) }));

// Simular BlockPalette substituindo onInsert por um botão simples
jest.mock('@/components/editor/palette/BlockPalette', () => ({ onInsert }: any) => {
    return <button onClick={() => onInsert('text')} data-testid="insert-text-btn">Inserir Texto</button>;
});

describe('ModernUnifiedEditor - Inserção de Bloco (simulada)', () => {
    it('executa callback de inserção de bloco sem erros', () => {
        render(<ModernUnifiedEditor funnelId="funnel-abc" />);
        const btn = screen.getByTestId('insert-text-btn');
        fireEvent.click(btn);
        // Sem assert de estado por enquanto (Core V2 integração parcial)
        // Teste garante que não ocorre crash ao acionar onInsert
    });
});
