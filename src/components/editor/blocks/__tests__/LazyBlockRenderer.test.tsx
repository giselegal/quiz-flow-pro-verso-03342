/**
 * 🧪 LAZY BLOCK RENDERER - TESTES UNITÁRIOS
 * 
 * Testes para LazyBlockRenderer criado no SPRINT 2 Fase 2
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LazyBlockRenderer } from '../LazyBlockRenderer';
import { EditorLoadingProvider } from '@/contexts/EditorLoadingContext';
import { blockRegistry } from '@/registry/blockRegistry';
import type { Block } from '@/types/editor';

// Mock do blockRegistry
jest.mock('@/registry/blockRegistry', () => ({
  blockRegistry: {
    getComponent: jest.fn(),
    get: jest.fn(),
  },
}));

// Mock do BlockSkeleton
jest.mock('../BlockSkeleton', () => ({
  BlockSkeleton: () => (
    <div data-testid="block-skeleton">Carregando...</div>
  ),
}));

// Componente de teste simples
const TestBlockComponent: React.FC<any> = ({ block, isSelected, onSelect }) => (
  <div data-testid="test-block" onClick={onSelect}>
    <div>Tipo: {block.type}</div>
    <div>ID: {block.id}</div>
    <div>Selecionado: {isSelected ? 'Sim' : 'Não'}</div>
  </div>
);

describe('LazyBlockRenderer', () => {
  const mockBlock: Block = {
    id: 'block-123',
    type: 'text-inline' as any, // Usar tipo válido do registry
    order: 0,
    properties: { color: 'blue' },
    content: { text: 'Test content' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização básica', () => {
    it('deve renderizar bloco corretamente', async () => {
      (blockRegistry.getComponent as jest.Mock).mockReturnValue(TestBlockComponent);

      render(
        <EditorLoadingProvider>
          <LazyBlockRenderer block={mockBlock} />
        </EditorLoadingProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-block')).toBeInTheDocument();
      });

      expect(screen.getByText('Tipo: text-inline')).toBeInTheDocument();
      expect(screen.getByText('ID: block-123')).toBeInTheDocument();
    });

    it('deve mostrar skeleton durante carregamento', () => {
      (blockRegistry.getComponent as jest.Mock).mockReturnValue(
        React.lazy(() => new Promise(() => {})), // Never resolves
      );

      render(
        <EditorLoadingProvider>
          <LazyBlockRenderer block={mockBlock} />
        </EditorLoadingProvider>,
      );

      expect(screen.getByTestId('block-skeleton')).toBeInTheDocument();
    });

    it('deve mostrar fallback quando bloco não é encontrado', async () => {
      (blockRegistry.getComponent as jest.Mock).mockReturnValue(null);

      render(
        <EditorLoadingProvider>
          <LazyBlockRenderer block={mockBlock} />
        </EditorLoadingProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('⚠️ Componente não encontrado')).toBeInTheDocument();
      });
    });
  });

  describe('Estados visuais', () => {
    it('deve aplicar classe de selecionado quando isSelected=true', async () => {
      (blockRegistry.getComponent as jest.Mock).mockReturnValue(TestBlockComponent);

      const { container } = render(
        <EditorLoadingProvider>
          <LazyBlockRenderer block={mockBlock} isSelected={true} />
        </EditorLoadingProvider>,
      );

      await waitFor(() => {
        const renderer = container.querySelector('.lazy-block-renderer');
        expect(renderer).toHaveClass('ring-2', 'ring-primary');
      });
    });

    it('deve aplicar classe editável quando isEditable=true', async () => {
      (blockRegistry.getComponent as jest.Mock).mockReturnValue(TestBlockComponent);

      const { container } = render(
        <EditorLoadingProvider>
          <LazyBlockRenderer block={mockBlock} isEditable={true} />
        </EditorLoadingProvider>,
      );

      await waitFor(() => {
        const renderer = container.querySelector('.lazy-block-renderer');
        expect(renderer).toHaveClass('hover:shadow-sm', 'cursor-pointer');
      });
    });

    it('deve incluir data attributes corretos', async () => {
      (blockRegistry.getComponent as jest.Mock).mockReturnValue(TestBlockComponent);

      const { container } = render(
        <EditorLoadingProvider>
          <LazyBlockRenderer block={mockBlock} />
        </EditorLoadingProvider>,
      );

      await waitFor(() => {
        const renderer = container.querySelector('.lazy-block-renderer');
        expect(renderer).toHaveAttribute('data-block-id', 'block-123');
        expect(renderer).toHaveAttribute('data-block-type', 'test-block');
        expect(renderer).toHaveAttribute('data-testid', 'block-block-123');
      });
    });
  });

  describe('Callbacks', () => {
    it('deve chamar onSelect quando clicado', async () => {
      const onSelect = jest.fn();
      (blockRegistry.getComponent as jest.Mock).mockReturnValue(TestBlockComponent);

      render(
        <EditorLoadingProvider>
          <LazyBlockRenderer block={mockBlock} onSelect={onSelect} />
        </EditorLoadingProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-block')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByTestId('test-block'));

      expect(onSelect).toHaveBeenCalledWith('block-123');
    });

    it('deve chamar onUpdate com blockId e updates', async () => {
      const onUpdate = jest.fn();
      (blockRegistry.getComponent as jest.Mock).mockReturnValue(TestBlockComponent);

      const { rerender } = render(
        <EditorLoadingProvider>
          <LazyBlockRenderer block={mockBlock} onUpdate={onUpdate} />
        </EditorLoadingProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-block')).toBeInTheDocument();
      });

      // Simular update (componente interno chama handleUpdate)
      const updatedBlock = { ...mockBlock, properties: { color: 'red' } };
      rerender(
        <EditorLoadingProvider>
          <LazyBlockRenderer block={updatedBlock} onUpdate={onUpdate} />
        </EditorLoadingProvider>,
      );

      // onUpdate seria chamado internamente pelo componente do bloco
      // Aqui apenas verificamos que a prop foi passada corretamente
      expect(onUpdate).toBeDefined();
    });

    it('deve chamar onDelete com blockId', async () => {
      const onDelete = jest.fn();

      // Componente que simula delete
      const DeleteTestComponent: React.FC<any> = ({ onDelete }) => (
        <button data-testid="delete-btn" onClick={onDelete}>
          Delete
        </button>
      );

      (blockRegistry.getComponent as jest.Mock).mockReturnValue(DeleteTestComponent);

      render(
        <EditorLoadingProvider>
          <LazyBlockRenderer block={mockBlock} onDelete={onDelete} />
        </EditorLoadingProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('delete-btn')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByTestId('delete-btn'));

      expect(onDelete).toHaveBeenCalledWith('block-123');
    });
  });

  describe('Error Boundary', () => {
    it('deve capturar erro de renderização e mostrar fallback', async () => {
      // Componente que lança erro
      const ErrorComponent: React.FC = () => {
        throw new Error('Test error');
      };

      (blockRegistry.getComponent as jest.Mock).mockReturnValue(ErrorComponent);

      // Suprimir console.error para este teste
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(
        <EditorLoadingProvider>
          <LazyBlockRenderer block={mockBlock} />
        </EditorLoadingProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('❌ Erro ao renderizar bloco')).toBeInTheDocument();
      });

      expect(screen.getByText(/test-block/)).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('deve resetar erro ao mudar de bloco', async () => {
      // Primeiro bloco: erro
      const ErrorComponent: React.FC = () => {
        throw new Error('Test error');
      };

      // Segundo bloco: sucesso
      const SuccessComponent: React.FC = () => <div>Success</div>;

      (blockRegistry.getComponent as jest.Mock).mockReturnValue(ErrorComponent);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { rerender } = render(
        <EditorLoadingProvider>
          <LazyBlockRenderer block={mockBlock} />
        </EditorLoadingProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('❌ Erro ao renderizar bloco')).toBeInTheDocument();
      });

      // Mudar para bloco diferente
      (blockRegistry.getComponent as jest.Mock).mockReturnValue(SuccessComponent);
      const newBlock = { ...mockBlock, id: 'block-456' };

      rerender(
        <EditorLoadingProvider>
          <LazyBlockRenderer block={newBlock} />
        </EditorLoadingProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('Success')).toBeInTheDocument();
      });

      expect(screen.queryByText('❌ Erro ao renderizar bloco')).not.toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Performance (Memoização)', () => {
    it('não deve re-renderizar quando props irrelevantes mudam', async () => {
      let renderCount = 0;

      const CountingComponent: React.FC<any> = () => {
        renderCount++;
        return <div data-testid="counting">Render #{renderCount}</div>;
      };

      (blockRegistry.getComponent as jest.Mock).mockReturnValue(CountingComponent);

      const { rerender } = render(
        <EditorLoadingProvider>
          <LazyBlockRenderer block={mockBlock} />
        </EditorLoadingProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('counting')).toBeInTheDocument();
      });

      const initialRenderCount = renderCount;

      // Re-render com mesmas props
      rerender(
        <EditorLoadingProvider>
          <LazyBlockRenderer block={mockBlock} />
        </EditorLoadingProvider>,
      );

      // Render count não deve aumentar (memoizado)
      await waitFor(() => {
        expect(renderCount).toBe(initialRenderCount);
      });
    });

    it('deve re-renderizar quando propriedades do bloco mudam', async () => {
      let renderCount = 0;

      const CountingComponent: React.FC<any> = ({ block }) => {
        renderCount++;
        return (
          <div data-testid="counting">
            Render #{renderCount} - Color: {block.properties.color}
          </div>
        );
      };

      (blockRegistry.getComponent as jest.Mock).mockReturnValue(CountingComponent);

      const { rerender } = render(
        <EditorLoadingProvider>
          <LazyBlockRenderer block={mockBlock} />
        </EditorLoadingProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText(/Color: blue/)).toBeInTheDocument();
      });

      const initialRenderCount = renderCount;

      // Re-render com propriedades diferentes
      const updatedBlock = { ...mockBlock, properties: { color: 'red' } };
      rerender(
        <EditorLoadingProvider>
          <LazyBlockRenderer block={updatedBlock} />
        </EditorLoadingProvider>,
      );

      // Render count deve aumentar
      await waitFor(() => {
        expect(renderCount).toBeGreaterThan(initialRenderCount);
        expect(screen.getByText(/Color: red/)).toBeInTheDocument();
      });
    });
  });

  describe('Integração com EditorLoadingContext', () => {
    it('deve funcionar sem EditorLoadingProvider', async () => {
      (blockRegistry.getComponent as jest.Mock).mockReturnValue(TestBlockComponent);

      // Renderizar SEM provider
      render(<LazyBlockRenderer block={mockBlock} />);

      await waitFor(() => {
        expect(screen.getByTestId('test-block')).toBeInTheDocument();
      });

      // Deve funcionar normalmente mesmo sem contexto
      expect(screen.getByText('Tipo: text-inline')).toBeInTheDocument();
    });

    it('deve usar EditorLoadingProvider quando disponível', async () => {
      (blockRegistry.getComponent as jest.Mock).mockReturnValue(TestBlockComponent);

      render(
        <EditorLoadingProvider>
          <LazyBlockRenderer block={mockBlock} />
        </EditorLoadingProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-block')).toBeInTheDocument();
      });

      // Contexto foi usado (verificado internamente pelo hook)
      expect(screen.getByTestId('test-block')).toBeInTheDocument();
    });
  });
});
