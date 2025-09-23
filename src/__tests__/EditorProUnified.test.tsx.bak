import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EditorProUnified from '@/components/editor/EditorProUnified';

// Mock do EditorProvider
vi.mock('@/components/editor/EditorProvider', () => ({
  EditorProvider: ({ children }: any) => <div data-testid="editor-provider">{children}</div>,
  useEditor: () => ({
    state: {
      currentStep: 1,
      stepBlocks: { 'step-1': [] },
      selectedBlockId: null,
    },
    actions: {
      setCurrentStep: vi.fn(),
      addBlock: vi.fn(),
      updateBlock: vi.fn(),
      deleteBlock: vi.fn(),
    },
  }),
}));

// Mock do OptimizedAIFeatures
vi.mock('@/components/ai/OptimizedAIFeatures', () => ({
  default: () => <div data-testid="optimized-ai-features">AI Features</div>,
}));

// Mock do ModularEditorPro
vi.mock('@/components/editor/EditorPro/components/ModularEditorPro', () => ({
  default: () => <div data-testid="modular-editor-pro">Modular Editor</div>,
}));

// Mock do useUnifiedStepNavigation
vi.mock('@/hooks/useUnifiedStepNavigation', () => ({
  useUnifiedStepNavigation: () => ({
    currentStep: 1,
    setCurrentStep: vi.fn(),
    nextStep: vi.fn(),
    prevStep: vi.fn(),
    isFirstStep: true,
    isLastStep: false,
    totalSteps: 21,
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('EditorProUnified', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza o componente principal sem erros', () => {
    renderWithRouter(<EditorProUnified />);
    
    expect(screen.getByTestId('editor-provider')).toBeInTheDocument();
    expect(screen.getByTestId('modular-editor-pro')).toBeInTheDocument();
  });

  it('carrega OptimizedAIFeatures corretamente', async () => {
    renderWithRouter(<EditorProUnified />);
    
    await waitFor(() => {
      expect(screen.getByTestId('optimized-ai-features')).toBeInTheDocument();
    });
  });

  it('mantém estrutura unificada com todos os componentes', () => {
    renderWithRouter(<EditorProUnified />);
    
    // Verifica se todos os componentes principais estão presentes
    expect(screen.getByTestId('editor-provider')).toBeInTheDocument();
    expect(screen.getByTestId('modular-editor-pro')).toBeInTheDocument();
    expect(screen.getByTestId('optimized-ai-features')).toBeInTheDocument();
  });

  it('integra corretamente com sistema de navegação', () => {
    const { container } = renderWithRouter(<EditorProUnified />);
    
    // Verifica se o componente renderiza sem erros
    expect(container.firstChild).toBeTruthy();
  });
});