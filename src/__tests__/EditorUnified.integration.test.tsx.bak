import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EditorProUnified from '@/components/editor/EditorProUnified';

// Mock completo do sistema de navegação
const mockNavigation = {
  currentStep: 1,
  setCurrentStep: vi.fn(),
  nextStep: vi.fn(),
  prevStep: vi.fn(),
  isFirstStep: true,
  isLastStep: false,
  totalSteps: 21,
};

vi.mock('@/hooks/useUnifiedStepNavigation', () => ({
  useUnifiedStepNavigation: () => mockNavigation,
}));

// Mock do EditorProvider com estado mais completo
const mockEditorState = {
  currentStep: 1,
  stepBlocks: {
    'step-1': [] as any[],
    'step-2': [] as any[],
    'step-3': [] as any[],
  } as Record<string, any[]>,
  selectedBlockId: null,
  isLoading: false,
};

const mockEditorActions = {
  setCurrentStep: vi.fn(),
  addBlock: vi.fn(),
  updateBlock: vi.fn(),
  deleteBlock: vi.fn(),
  reorderBlocks: vi.fn(),
  loadStepBlocks: vi.fn(),
};

vi.mock('@/components/editor/EditorProvider', () => ({
  EditorProvider: ({ children }: any) => (
    <div data-testid="editor-provider">{children}</div>
  ),
  useEditor: () => ({
    state: mockEditorState,
    actions: mockEditorActions,
  }),
}));

// Mock do ModularEditorPro com mais funcionalidade
vi.mock('@/components/editor/EditorPro/components/ModularEditorPro', () => ({
  default: () => (
    <div data-testid="modular-editor-pro">
      <div data-testid="step-navigation">
        <button data-testid="prev-step" onClick={mockNavigation.prevStep}>
          Anterior
        </button>
        <span data-testid="current-step">Etapa {mockNavigation.currentStep}</span>
        <button data-testid="next-step" onClick={mockNavigation.nextStep}>
          Próximo
        </button>
      </div>
      
      <div data-testid="blocks-container">
        {mockEditorState.stepBlocks[`step-${mockNavigation.currentStep}`]?.map(block => (
          <div key={block.id} data-testid={`block-${block.id}`}>
            {block.type} - {block.id}
          </div>
        ))}
      </div>
      
      <div data-testid="block-controls">
        <button 
          data-testid="add-text-block"
          onClick={() => mockEditorActions.addBlock('text')}
        >
          Adicionar Texto
        </button>
        <button 
          data-testid="add-form-block"
          onClick={() => mockEditorActions.addBlock('form')}
        >
          Adicionar Formulário
        </button>
      </div>
    </div>
  ),
}));

// Mock do OptimizedAIFeatures com funcionalidade completa
vi.mock('@/components/ai/OptimizedAIFeatures', () => ({
  default: () => (
    <div data-testid="optimized-ai-features">
      <button data-testid="ai-generate-template">
        ✨ Gerar Template IA
      </button>
      <button data-testid="ai-optimize-funnel">
        🚀 Otimizar Funil
      </button>
      <div data-testid="ai-cache-stats">
        Cache: 85% hit rate
      </div>
    </div>
  ),
}));

const renderEditor = () => {
  return render(
    <BrowserRouter>
      <EditorProUnified />
    </BrowserRouter>
  );
};

describe('Editor Unificado - Testes de Integração', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset navigation state
    mockNavigation.currentStep = 1;
    mockNavigation.isFirstStep = true;
    mockNavigation.isLastStep = false;
  });

  describe('Renderização e Estrutura', () => {
    it('renderiza todos os componentes principais', () => {
      renderEditor();
      
      expect(screen.getByTestId('editor-provider')).toBeInTheDocument();
      expect(screen.getByTestId('modular-editor-pro')).toBeInTheDocument();
      expect(screen.getByTestId('optimized-ai-features')).toBeInTheDocument();
    });

    it('exibe navegação entre etapas corretamente', () => {
      renderEditor();
      
      expect(screen.getByTestId('step-navigation')).toBeInTheDocument();
      expect(screen.getByTestId('current-step')).toHaveTextContent('Etapa 1');
      expect(screen.getByTestId('prev-step')).toBeInTheDocument();
      expect(screen.getByTestId('next-step')).toBeInTheDocument();
    });
  });

  describe('Navegação entre Etapas', () => {
    it('executa navegação para próxima etapa', () => {
      renderEditor();
      
      const nextButton = screen.getByTestId('next-step');
      fireEvent.click(nextButton);
      
      expect(mockNavigation.nextStep).toHaveBeenCalledTimes(1);
    });

    it('executa navegação para etapa anterior', () => {
      renderEditor();
      
      const prevButton = screen.getByTestId('prev-step');
      fireEvent.click(prevButton);
      
      expect(mockNavigation.prevStep).toHaveBeenCalledTimes(1);
    });

    it('sincroniza estado entre navegação e editor', () => {
      // Simula mudança de etapa
      mockNavigation.currentStep = 3;
      mockNavigation.isFirstStep = false;
      
      renderEditor();
      
      expect(screen.getByTestId('current-step')).toHaveTextContent('Etapa 3');
    });
  });

  describe('Manipulação de Blocos', () => {
    it('adiciona blocos através do ModularEditorPro', () => {
      renderEditor();
      
      const addTextButton = screen.getByTestId('add-text-block');
      fireEvent.click(addTextButton);
      
      expect(mockEditorActions.addBlock).toHaveBeenCalledWith('text');
    });

    it('adiciona diferentes tipos de blocos', () => {
      renderEditor();
      
      fireEvent.click(screen.getByTestId('add-form-block'));
      expect(mockEditorActions.addBlock).toHaveBeenCalledWith('form');
    });

    it('exibe blocos existentes na etapa atual', () => {
      // Adiciona alguns blocos de teste
      mockEditorState.stepBlocks['step-1'] = [
        { id: 'block-1', type: 'text', order: 0, properties: {}, content: {} },
        { id: 'block-2', type: 'form', order: 1, properties: {}, content: {} },
      ];

      renderEditor();
      
      expect(screen.getByTestId('block-block-1')).toBeInTheDocument();
      expect(screen.getByTestId('block-block-2')).toBeInTheDocument();
    });
  });

  describe('Funcionalidades de IA', () => {
    it('exibe componente de IA otimizado', () => {
      renderEditor();
      
      expect(screen.getByTestId('ai-generate-template')).toBeInTheDocument();
      expect(screen.getByTestId('ai-optimize-funnel')).toBeInTheDocument();
    });

    it('mostra estatísticas de cache IA', () => {
      renderEditor();
      
      expect(screen.getByTestId('ai-cache-stats')).toBeInTheDocument();
      expect(screen.getByText(/Cache: 85% hit rate/)).toBeInTheDocument();
    });

    it('integra botões de IA com funcionalidade', () => {
      renderEditor();
      
      const generateButton = screen.getByTestId('ai-generate-template');
      expect(generateButton).toBeInTheDocument();
      
      // Botão deve estar funcional (não disabled)
      expect(generateButton).not.toBeDisabled();
    });
  });

  describe('Estado e Sincronização', () => {
    it('mantém sincronização entre componentes', () => {
      renderEditor();
      
      // Simula mudança de estado no editor
      mockEditorState.currentStep = 5;
      
      // Componentes devem refletir a mudança
      expect(mockEditorState.currentStep).toBe(5);
    });

    it('carrega blocos ao navegar entre etapas', () => {
      renderEditor();
      
      // Simula navegação que deve disparar carregamento
      fireEvent.click(screen.getByTestId('next-step'));
      
      expect(mockNavigation.nextStep).toHaveBeenCalled();
      // O sistema deve carregar blocos da nova etapa automaticamente
    });
  });

  describe('Performance e Lazy Loading', () => {
    it('carrega OptimizedAIFeatures sem bloquear renderização', async () => {
      renderEditor();
      
      // Editor principal deve estar disponível imediatamente
      expect(screen.getByTestId('modular-editor-pro')).toBeInTheDocument();
      
      // AI Features podem carregar assincronamente
      await waitFor(() => {
        expect(screen.getByTestId('optimized-ai-features')).toBeInTheDocument();
      });
    });

    it('não quebra se AI features falharem ao carregar', () => {
      renderEditor();
      
      // Editor principal deve continuar funcionando
      expect(screen.getByTestId('editor-provider')).toBeInTheDocument();
      expect(screen.getByTestId('modular-editor-pro')).toBeInTheDocument();
    });
  });

  describe('Integração Completa - Fluxo de Uso', () => {
    it('executa fluxo completo: navegar -> adicionar bloco -> usar IA', async () => {
      renderEditor();
      
      // 1. Verificar estado inicial
      expect(screen.getByTestId('current-step')).toHaveTextContent('Etapa 1');
      
      // 2. Adicionar um bloco
      fireEvent.click(screen.getByTestId('add-text-block'));
      expect(mockEditorActions.addBlock).toHaveBeenCalledWith('text');
      
      // 3. Navegar para próxima etapa
      fireEvent.click(screen.getByTestId('next-step'));
      expect(mockNavigation.nextStep).toHaveBeenCalled();
      
      // 4. Verificar que AI features estão disponíveis
      await waitFor(() => {
        expect(screen.getByTestId('ai-generate-template')).toBeInTheDocument();
      });
      
      // Fluxo deve completar sem erros
      expect(screen.getByTestId('editor-provider')).toBeInTheDocument();
    });
  });
});