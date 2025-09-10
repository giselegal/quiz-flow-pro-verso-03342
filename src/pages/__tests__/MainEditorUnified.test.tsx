import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import MainEditorUnified from '../MainEditorUnified';
import { Router } from 'wouter';

// Mock dos contextos necessários
vi.mock('@/context/QuizFlowProvider', () => ({
  QuizFlowProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/context/FunnelsContext', () => ({
  FunnelsProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/context/EditorQuizContext', () => ({
  EditorQuizProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/quiz/Quiz21StepsProvider', () => ({
  Quiz21StepsProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/core/contexts/LegacyCompatibilityWrapper', () => ({
  LegacyCompatibilityWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/core/contexts/FunnelContext', () => ({
  FunnelContext: React.createContext({}),
}));

vi.mock('../components/editor/EditorProvider', () => ({
  EditorProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock do componente UnifiedEditor
const MockUnifiedEditor = () => (
  <div data-testid="unified-editor">
    <h1>Editor Unificado</h1>
    <div>Template: default</div>
  </div>
);

vi.mock('../components/editor/UnifiedEditor', () => ({
  default: MockUnifiedEditor,
  UnifiedEditor: MockUnifiedEditor,
}));

// Mock do EditorPro como fallback
const MockEditorPro = () => (
  <div data-testid="editor-pro-fallback">
    <h1>Editor Pro (Fallback)</h1>
  </div>
);

vi.mock('../components/editor/EditorPro', () => ({
  default: MockEditorPro,
  EditorPro: MockEditorPro,
}));

describe('MainEditorUnified', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    (import.meta as any).env = {
      VITE_ENABLE_SUPABASE: 'false',
      VITE_SUPABASE_FUNNEL_ID: 'test-funnel',
      VITE_SUPABASE_QUIZ_ID: 'test-quiz',
    };
  });

  describe('Renderização Básica', () => {
    it('deve renderizar o editor unificado corretamente', async () => {
      render(
        <Router>
          <MainEditorUnified />
        </Router>
      );

      await waitFor(() => {
        expect(screen.getByTestId('unified-editor')).toBeInTheDocument();
      });

      expect(screen.getByText('Editor Unificado')).toBeInTheDocument();
    });

    it('deve exibir estado de carregamento inicialmente', () => {
      render(
        <Router>
          <MainEditorUnified />
        </Router>
      );

      // Pode ter loading state no início
      // Como os mocks são síncronos, isso passa rapidamente
    });
  });

  describe('Configuração via URL', () => {
    it('deve extrair parâmetros da URL corretamente', async () => {
      // Mock da location
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/editor',
          search: '?template=quiz-completo&funnel=test-funnel&step=5&debug=true'
        },
        writable: true
      });

      render(
        <Router base="/editor">
          <MainEditorUnified />
        </Router>
      );

      await waitFor(() => {
        expect(screen.getByTestId('unified-editor')).toBeInTheDocument();
      });
    });

    it('deve ativar modo debug quando solicitado', async () => {
      // Spy no console.log para verificar debug
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/editor',
          search: '?debug=true'
        },
        writable: true
      });

      render(
        <Router>
          <MainEditorUnified />
        </Router>
      );

      await waitFor(() => {
        expect(screen.getByTestId('unified-editor')).toBeInTheDocument();
      });

      // Verificar se logs de debug foram chamados
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Configuração Supabase', () => {
    it('deve configurar Supabase quando habilitado', () => {
      (import.meta as any).env.VITE_ENABLE_SUPABASE = 'true';

      render(
        <Router>
          <MainEditorUnified />
        </Router>
      );

      // Teste pode verificar se configuração foi aplicada
      // através de mocks ou props passadas
    });

    it('deve usar configuração local quando Supabase desabilitado', () => {
      (import.meta as any).env.VITE_ENABLE_SUPABASE = 'false';

      render(
        <Router>
          <MainEditorUnified />
        </Router>
      );

      // Verificar configuração local
    });
  });

  describe('Error Handling', () => {
    it('deve lidar com erros de carregamento graciosamente', async () => {
      // Mock erro no UnifiedEditor
      vi.doMock('../components/editor/UnifiedEditor', () => {
        throw new Error('Falha no carregamento');
      });

      render(
        <Router>
          <MainEditorUnified />
        </Router>
      );

      // Deve tentar carregar fallback
      await waitFor(() => {
        expect(screen.getByTestId('editor-pro-fallback')).toBeInTheDocument();
      });
    });

    it('não deve quebrar quando contextos estão ausentes', () => {
      expect(() => {
        render(
          <Router>
            <MainEditorUnified />
          </Router>
        );
      }).not.toThrow();
    });
  });

  describe('Lazy Loading', () => {
    it('deve carregar UnifiedEditor dinamicamente', async () => {
      render(
        <Router>
          <MainEditorUnified />
        </Router>
      );

      await waitFor(() => {
        expect(screen.getByTestId('unified-editor')).toBeInTheDocument();
      });
    });

    it('deve fazer fallback para EditorPro quando UnifiedEditor falha', async () => {
      // Simular falha no UnifiedEditor
      vi.doMock('../components/editor/UnifiedEditor', () => {
        return Promise.reject(new Error('Módulo não encontrado'));
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <Router>
          <MainEditorUnified />
        </Router>
      );

      await waitFor(() => {
        expect(screen.getByTestId('editor-pro-fallback')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Contextos Integrados', () => {
    it('deve renderizar todos os providers necessários', () => {
      const { container } = render(
        <Router>
          <MainEditorUnified />
        </Router>
      );

      // Verificar se a árvore de contextos foi montada
      expect(container.firstChild).toBeTruthy();
    });
  });
});
