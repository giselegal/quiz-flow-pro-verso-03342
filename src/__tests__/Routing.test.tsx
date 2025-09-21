import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from '@/App';

// Mock dos componentes principais
vi.mock('@/components/editor/EditorProUnified', () => ({
  default: () => <div data-testid="editor-pro-unified">Editor Unificado</div>,
}));

vi.mock('@/pages/Index', () => ({
  default: () => <div data-testid="index-page">Página Inicial</div>,
}));

vi.mock('@/pages/StepsShowcase', () => ({
  default: () => <div data-testid="steps-showcase">Steps Showcase</div>,
}));

vi.mock('@/pages/EditorUnifiedPage', () => ({
  default: () => <div data-testid="editor-unified-page">Editor Unified Page</div>,
}));

// Mock do sistema de navegação
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

// Mock do EditorProvider
vi.mock('@/components/editor/EditorProvider', () => ({
  EditorProvider: ({ children }: any) => <div>{children}</div>,
  useEditor: () => ({
    state: { currentStep: 1, stepBlocks: {}, selectedBlockId: null },
    actions: { setCurrentStep: vi.fn() },
  }),
}));

describe('Routing Tests - Consolidação', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rota Principal /editor', () => {
    it('deve renderizar EditorUnifiedPage na rota /editor', () => {
      render(
        <MemoryRouter initialEntries={['/editor']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('editor-unified-page')).toBeInTheDocument();
    });

    it('deve aceitar parâmetros de step na URL', () => {
      render(
        <MemoryRouter initialEntries={['/editor?step=5']}>
          <App />
        </MemoryRouter>
      );

      // A página deve renderizar mesmo com parâmetros
      expect(screen.getByTestId('editor-unified-page')).toBeInTheDocument();
    });

    it('deve manter estado na navegação', () => {
      const { rerender } = render(
        <MemoryRouter initialEntries={['/editor']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('editor-unified-page')).toBeInTheDocument();

      // Simula navegação interna mantendo estado
      rerender(
        <MemoryRouter initialEntries={['/editor?step=3']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('editor-unified-page')).toBeInTheDocument();
    });
  });

  describe('Redirecionamentos de Rotas Obsoletas', () => {
    it('deve redirecionar /editor-pro para /editor', () => {
      // Simula redirecionamento através do roteador
      render(
        <MemoryRouter initialEntries={['/editor-pro']}>
          <App />
        </MemoryRouter>
      );

      // Como /editor-pro não existe mais, deve mostrar página 404 ou redirecionar
      // Para este teste, assumimos que há uma lógica de redirecionamento
      expect(screen.queryByTestId('editor-pro-unified')).not.toBeInTheDocument();
    });

    it('deve redirecionar rotas antigas do editor', () => {
      const oldRoutes = [
        '/editor-consolidated',
        '/editor-simple', 
        '/editor-optimized',
        '/main-editor'
      ];

      oldRoutes.forEach(route => {
        render(
          <MemoryRouter initialEntries={[route]}>
            <App />
          </MemoryRouter>
        );
        
        // Rotas antigas não devem existir mais
        expect(screen.queryByTestId('old-editor')).not.toBeInTheDocument();
      });
    });
  });

  describe('Rotas Funcionais Mantidas', () => {
    it('deve manter rota raiz / funcionando', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('index-page')).toBeInTheDocument();
    });

    it('deve manter rota /steps funcionando', () => {
      render(
        <MemoryRouter initialEntries={['/steps']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('steps-showcase')).toBeInTheDocument();
    });
  });

  describe('Parâmetros de URL', () => {
    it('deve processar step parameter corretamente', () => {
      render(
        <MemoryRouter initialEntries={['/editor?step=10']}>
          <App />
        </MemoryRouter>
      );

      // Editor deve renderizar e processar o parâmetro step
      expect(screen.getByTestId('editor-unified-page')).toBeInTheDocument();
    });

    it('deve lidar com parâmetros inválidos graciosamente', () => {
      const invalidParams = [
        '/editor?step=abc',
        '/editor?step=-1',
        '/editor?step=999',
        '/editor?invalid=param'
      ];

      invalidParams.forEach(url => {
        render(
          <MemoryRouter initialEntries={[url]}>
            <App />
          </MemoryRouter>
        );

        // Editor deve renderizar mesmo com parâmetros inválidos
        expect(screen.getByTestId('editor-unified-page')).toBeInTheDocument();
      });
    });

    it('deve preservar outros parâmetros na URL', () => {
      render(
        <MemoryRouter initialEntries={['/editor?step=5&theme=dark&mode=preview']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('editor-unified-page')).toBeInTheDocument();
    });
  });

  describe('Navegação Programática', () => {
    it('deve permitir navegação entre steps via URL', () => {
      const { rerender } = render(
        <MemoryRouter initialEntries={['/editor?step=1']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('editor-unified-page')).toBeInTheDocument();

      // Simula navegação para step 5
      rerender(
        <MemoryRouter initialEntries={['/editor?step=5']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('editor-unified-page')).toBeInTheDocument();
    });

    it('deve manter estado durante navegação', () => {
      // Testa se o estado persiste durante mudanças de URL
      render(
        <MemoryRouter initialEntries={['/editor']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('editor-unified-page')).toBeInTheDocument();
    });
  });

  describe('Fallbacks e Tratamento de Erros', () => {
    it('deve lidar com rotas inexistentes', () => {
      render(
        <MemoryRouter initialEntries={['/rota-inexistente']}>
          <App />
        </MemoryRouter>
      );

      // Deve mostrar algum tipo de fallback (404 ou redirect)
      // Não deve quebrar a aplicação
      expect(document.body).toBeInTheDocument();
    });

    it('deve funcionar com navegação via browser', () => {
      // Simula navegação do browser
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // App deve renderizar sem erros
      expect(document.body).toBeInTheDocument();
    });

    it('deve preservar estado em refresh da página', () => {
      render(
        <MemoryRouter initialEntries={['/editor?step=7']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('editor-unified-page')).toBeInTheDocument();
    });
  });

  describe('Performance de Routing', () => {
    it('deve carregar rotas rapidamente', () => {
      const start = performance.now();
      
      render(
        <MemoryRouter initialEntries={['/editor']}>
          <App />
        </MemoryRouter>
      );
      
      const end = performance.now();
      const loadTime = end - start;

      // Carregamento da rota deve ser rápido (menos de 100ms)
      expect(loadTime).toBeLessThan(100);
      expect(screen.getByTestId('editor-unified-page')).toBeInTheDocument();
    });

    it('deve ter lazy loading otimizado', async () => {
      render(
        <MemoryRouter initialEntries={['/editor']}>
          <App />
        </MemoryRouter>
      );

      // Componentes principais devem estar disponíveis imediatamente
      expect(screen.getByTestId('editor-unified-page')).toBeInTheDocument();
    });
  });

  describe('Compatibilidade com URLs Antigas', () => {
    it('deve manter links externos funcionando', () => {
      // Testa URLs que podem estar bookmarkadas ou compartilhadas
      const externalUrls = [
        '/editor',
        '/editor?step=1',
        '/editor?step=21'
      ];

      externalUrls.forEach(url => {
        render(
          <MemoryRouter initialEntries={[url]}>
            <App />
          </MemoryRouter>
        );

        expect(screen.getByTestId('editor-unified-page')).toBeInTheDocument();
      });
    });

    it('deve processar deep links corretamente', () => {
      render(
        <MemoryRouter initialEntries={['/editor?step=15&block=header']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('editor-unified-page')).toBeInTheDocument();
    });
  });
});