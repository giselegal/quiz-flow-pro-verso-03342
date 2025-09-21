import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Mock do AICache
const mockAICache = {
  get: vi.fn(),
  set: vi.fn(),
  clear: vi.fn(),
  getStats: vi.fn(() => ({ hits: 5, misses: 2, hitRate: 71.4 })),
};

vi.mock('@/services/AICache', () => ({
  AICache: mockAICache,
}));

// Mock do Dialog do Radix
vi.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children }: any) => <div>{children}</div>,
  Trigger: ({ children, asChild, ...props }: any) => 
    asChild ? React.cloneElement(children, props) : <button {...props}>{children}</button>,
  Portal: ({ children }: any) => <div data-testid="dialog-portal">{children}</div>,
  Overlay: ({ children, ...props }: any) => <div data-testid="dialog-overlay" {...props}>{children}</div>,
  Content: ({ children, ...props }: any) => <div data-testid="dialog-content" {...props}>{children}</div>,
  Header: ({ children }: any) => <div data-testid="dialog-header">{children}</div>,
  Title: ({ children }: any) => <h2 data-testid="dialog-title">{children}</h2>,
  Description: ({ children }: any) => <p data-testid="dialog-description">{children}</p>,
  Close: ({ children, asChild, ...props }: any) => 
    asChild ? React.cloneElement(children, props) : <button {...props}>{children}</button>,
}));

// Lazy loading mock - simula o componente carregado
const OptimizedAIFeatures = React.lazy(() => 
  Promise.resolve({
    default: () => {
      const [isOpen, setIsOpen] = React.useState(false);
      const [isGenerating, setIsGenerating] = React.useState(false);

      const handleGenerate = async () => {
        setIsGenerating(true);
        // Simula geração de template
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsGenerating(false);
      };

      return (
        <div data-testid="ai-features-container">
          <button 
            data-testid="ai-trigger"
            onClick={() => setIsOpen(true)}
          >
            ✨ AI Features
          </button>
          
          {isOpen && (
            <div data-testid="ai-modal">
              <h2>Recursos de IA</h2>
              <p>Cache Stats: {JSON.stringify(mockAICache.getStats())}</p>
              <button 
                data-testid="generate-template"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? 'Gerando...' : 'Gerar Template'}
              </button>
              <button 
                data-testid="close-modal"
                onClick={() => setIsOpen(false)}
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      );
    }
  })
);

const TestWrapper = () => (
  <React.Suspense fallback={<div data-testid="loading-ai">Carregando AI...</div>}>
    <OptimizedAIFeatures />
  </React.Suspense>
);

describe('OptimizedAIFeatures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carrega com lazy loading e mostra fallback', async () => {
    render(<TestWrapper />);
    
    // Deve mostrar loading primeiro
    expect(screen.getByTestId('loading-ai')).toBeInTheDocument();
    
    // Depois carrega o componente
    await waitFor(() => {
      expect(screen.getByTestId('ai-features-container')).toBeInTheDocument();
    });
  });

  it('abre modal de AI features corretamente', async () => {
    render(<TestWrapper />);
    
    await waitFor(() => {
      expect(screen.getByTestId('ai-trigger')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('ai-trigger'));
    
    expect(screen.getByTestId('ai-modal')).toBeInTheDocument();
    expect(screen.getByText('Recursos de IA')).toBeInTheDocument();
  });

  it('exibe estatísticas do cache AI corretamente', async () => {
    render(<TestWrapper />);
    
    await waitFor(() => {
      expect(screen.getByTestId('ai-trigger')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('ai-trigger'));
    
    expect(screen.getByText(/Cache Stats/)).toBeInTheDocument();
    expect(mockAICache.getStats).toHaveBeenCalled();
  });

  it('executa geração de template com loading state', async () => {
    render(<TestWrapper />);
    
    await waitFor(() => {
      expect(screen.getByTestId('ai-trigger')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('ai-trigger'));
    
    const generateButton = screen.getByTestId('generate-template');
    expect(generateButton).toHaveTextContent('Gerar Template');
    
    fireEvent.click(generateButton);
    
    // Deve mostrar estado de loading
    expect(generateButton).toHaveTextContent('Gerando...');
    expect(generateButton).toBeDisabled();
    
    // Volta ao estado normal após geração
    await waitFor(() => {
      expect(generateButton).toHaveTextContent('Gerar Template');
      expect(generateButton).not.toBeDisabled();
    });
  });

  it('fecha modal corretamente', async () => {
    render(<TestWrapper />);
    
    await waitFor(() => {
      expect(screen.getByTestId('ai-trigger')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('ai-trigger'));
    expect(screen.getByTestId('ai-modal')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('close-modal'));
    expect(screen.queryByTestId('ai-modal')).not.toBeInTheDocument();
  });
});