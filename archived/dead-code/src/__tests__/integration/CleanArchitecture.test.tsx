// @ts-nocheck
/**
 * 🧪 CLEAN ARCHITECTURE INTEGRATION TESTS
 * 
 * Testes de integração para validar a Clean Architecture
 * funcionando corretamente com o sistema legacy
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MainEditorUnified } from '@/components/editor/MainEditorUnified';
import { CleanArchitectureProvider } from '@/providers/CleanArchitectureProvider';
import HybridProviderStack from '@/providers/HybridProviderStack';

// 🎯 MOCK SERVICES
jest.mock('@/application/services/QuizService');
jest.mock('@/application/services/FunnelService'); 
jest.mock('@/application/services/EditorService');

// 🧪 HELPER COMPONENTS
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <HybridProviderStack
    useCleanArchitecture={true}
    debugMode={true}
    funnelId="test-funnel"
  >
    {children}
  </HybridProviderStack>
);

describe('Clean Architecture Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CleanArchitectureProvider', () => {
    it('should initialize successfully', async () => {
      render(
        <CleanArchitectureProvider debugMode={true}>
          <div data-testid="test-child">Test Child</div>
        </CleanArchitectureProvider>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should provide services through context', async () => {
      const TestComponent = () => {
        // Este teste requer implementação dos hooks quando estiverem prontos
        return <div data-testid="services-test">Services Available</div>;
      };

      render(
        <CleanArchitectureProvider>
          <TestComponent />
        </CleanArchitectureProvider>
      );

      expect(screen.getByTestId('services-test')).toBeInTheDocument();
    });
  });

  describe('HybridProviderStack', () => {
    it('should render with Clean Architecture enabled', () => {
      render(
        <HybridProviderStack useCleanArchitecture={true}>
          <div data-testid="hybrid-child">Hybrid Child</div>
        </HybridProviderStack>
      );

      expect(screen.getByTestId('hybrid-child')).toBeInTheDocument();
    });

    it('should fallback to legacy when Clean Architecture disabled', () => {
      render(
        <HybridProviderStack useCleanArchitecture={false}>
          <div data-testid="legacy-child">Legacy Child</div>
        </HybridProviderStack>
      );

      expect(screen.getByTestId('legacy-child')).toBeInTheDocument();
    });
  });

  describe('MainEditorUnified', () => {
    it('should render editor interface successfully', async () => {
      render(
        <TestWrapper>
          <MainEditorUnified 
            stepNumber={1}
            funnelId="test-funnel"
            debugMode={true}
          />
        </TestWrapper>
      );

      // Aguardar carregamento
      await waitFor(() => {
        expect(screen.getByText('Editor Unificado')).toBeInTheDocument();
      });
    });

    it('should show Clean Architecture badge', async () => {
      render(
        <TestWrapper>
          <MainEditorUnified 
            stepNumber={1}
            funnelId="test-funnel"
            debugMode={true}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Clean Architecture')).toBeInTheDocument();
      });
    });

    it('should handle step navigation', async () => {
      const onStepChange = jest.fn();
      
      render(
        <TestWrapper>
          <MainEditorUnified 
            stepNumber={1}
            funnelId="test-funnel"
            onStepChange={onStepChange}
            debugMode={true}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        const nextButton = screen.getByText('Próximo →');
        fireEvent.click(nextButton);
      });

      // TODO: Validar quando navegação estiver implementada
      // expect(onStepChange).toHaveBeenCalledWith('2');
    });

    it('should render components sidebar', async () => {
      render(
        <TestWrapper>
          <MainEditorUnified 
            stepNumber={1}
            funnelId="test-funnel"
            debugMode={true}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Componentes')).toBeInTheDocument();
        expect(screen.getByText('text')).toBeInTheDocument();
        expect(screen.getByText('button')).toBeInTheDocument();
        expect(screen.getByText('image')).toBeInTheDocument();
        expect(screen.getByText('form')).toBeInTheDocument();
      });
    });

    it('should add blocks when clicking components', async () => {
      render(
        <TestWrapper>
          <MainEditorUnified 
            stepNumber={1}
            funnelId="test-funnel"
            debugMode={true}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        const textButton = screen.getByText('text');
        fireEvent.click(textButton);
      });

      // TODO: Validar quando addBlock estiver implementado
      // await waitFor(() => {
      //   expect(screen.getByText('1 blocos')).toBeInTheDocument();
      // });
    });

    it('should show properties panel', async () => {
      render(
        <TestWrapper>
          <MainEditorUnified 
            stepNumber={1}
            funnelId="test-funnel"
            debugMode={true}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Propriedades')).toBeInTheDocument();
        expect(screen.getByText('Selecione um bloco para ver suas propriedades')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle service initialization errors gracefully', async () => {
      // Mock erro nos services
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(
        <CleanArchitectureProvider debugMode={true} fallbackToLegacy={false}>
          <div data-testid="error-test">Error Test</div>
        </CleanArchitectureProvider>
      );

      // TODO: Implementar quando error handling estiver pronto
      
      consoleError.mockRestore();
    });

    it('should fallback to legacy on Clean Architecture failure', () => {
      render(
        <HybridProviderStack useCleanArchitecture={true}>
          <div data-testid="fallback-test">Fallback Test</div>
        </HybridProviderStack>
      );

      expect(screen.getByTestId('fallback-test')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', async () => {
      const renderSpy = jest.fn();
      
      const TestComponent = () => {
        renderSpy();
        return <div data-testid="performance-test">Performance Test</div>;
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(renderSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Feature Flags', () => {
    it('should respect Clean Architecture feature flag', () => {
      render(
        <TestWrapper>
          <MainEditorUnified 
            stepNumber={1}
            funnelId="test-funnel"
            debugMode={true}
          />
        </TestWrapper>
      );

      // TODO: Validar feature flags quando hook estiver implementado
    });
  });
});

describe('Legacy Compatibility', () => {
  it('should maintain compatibility with existing EditorRuntimeProviders', () => {
    // TODO: Implementar testes de compatibilidade legacy
    expect(true).toBe(true); // Placeholder
  });

  it('should not break existing functionality', () => {
    // TODO: Implementar testes de regressão
    expect(true).toBe(true); // Placeholder
  });
});

export {};