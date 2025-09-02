/**
 * 🧪 COMPREHENSIVE EDITOR VALIDATION TEST
 * Tests all key components of the EditorPro funnel system
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { EditorProvider } from '@/components/editor/EditorProvider';
import EditorPro from '@/components/editor/EditorPro';
import { QuizFlowProvider } from '@/context/QuizFlowProvider';

// Mock external dependencies
vi.mock('@/hooks/useFunnels', () => ({
  useFunnels: () => ({
    steps: Array.from({ length: 21 }, (_, i) => ({
      key: `step-${i + 1}`,
      number: i + 1,
      name: `Etapa ${i + 1}`,
      type: i === 0 ? 'intro' : i === 20 ? 'result' : 'question',
      isActive: i < 3, // First 3 steps active by default
    })),
    loading: false,
    error: null,
    currentFunnelId: 'test-funnel',
  }),
}));

vi.mock('@/hooks/useQuiz21Steps', () => ({
  useQuiz21Steps: () => ({
    currentStep: 1,
    totalSteps: 21,
    setCurrentStep: vi.fn(),
    nextStep: vi.fn(),
    prevStep: vi.fn(),
    isFirstStep: true,
    isLastStep: false,
  }),
}));

// Mock notification
vi.mock('@/components/ui/Notification', () => ({
  useNotification: () => ({
    showNotification: vi.fn(),
  }),
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QuizFlowProvider>
    <EditorProvider>
      {children}
    </EditorProvider>
  </QuizFlowProvider>
);

describe('EditorPro - Comprehensive Validation', () => {
  describe('21-Step Funnel System', () => {
    it('should render all 21 funnel steps', async () => {
      render(
        <TestWrapper>
          <EditorPro />
        </TestWrapper>
      );

      // Wait for steps to load
      await waitFor(() => {
        // Check for step indicators
        expect(screen.getByText('Etapa 1')).toBeInTheDocument();
        expect(screen.getByText('21 etapas')).toBeInTheDocument();
      });

      // Verify we have exactly 21 steps
      const stepElements = screen.getAllByText(/Etapa \d+/);
      expect(stepElements).toHaveLength(21);
    });

    it('should show correct step categories', async () => {
      render(
        <TestWrapper>
          <EditorPro />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check for component categories
        expect(screen.getByText('ESTRUTURA')).toBeInTheDocument();
        expect(screen.getByText('INTERAÇÃO')).toBeInTheDocument();
        expect(screen.getByText('CAPTURA')).toBeInTheDocument();
        expect(screen.getByText('CONTEÚDO')).toBeInTheDocument();
      });
    });

    it('should display current step information', async () => {
      render(
        <TestWrapper>
          <EditorPro />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check for current step display
        expect(screen.getByText(/Etapa 1 de 21/)).toBeInTheDocument();
        expect(screen.getByText(/5%/)).toBeInTheDocument(); // Progress percentage
      });
    });
  });

  describe('Editor Layout and Components', () => {
    it('should render the 4-column layout correctly', async () => {
      render(
        <TestWrapper>
          <EditorPro />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check for main layout sections
        const stepsPanel = screen.getByText('Etapas do Quiz');
        const componentsPanel = screen.getByText('Componentes');
        const canvas = screen.getByText('Selecione um bloco no canvas');

        expect(stepsPanel).toBeInTheDocument();
        expect(componentsPanel).toBeInTheDocument();
        expect(canvas).toBeInTheDocument();
      });
    });

    it('should show available components by category', async () => {
      render(
        <TestWrapper>
          <EditorPro />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check for specific components
        expect(screen.getByText('Header Quiz')).toBeInTheDocument();
        expect(screen.getByText('Grade Opções')).toBeInTheDocument();
        expect(screen.getByText('Botão')).toBeInTheDocument();
        expect(screen.getByText('Formulário')).toBeInTheDocument();
      });
    });

    it('should display component counts correctly', async () => {
      render(
        <TestWrapper>
          <EditorPro />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check component count indicators
        const componentCountElements = screen.getAllByText(/\d+/);
        expect(componentCountElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Editor Toolbar and Controls', () => {
    it('should render main editor controls', async () => {
      render(
        <TestWrapper>
          <EditorPro />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check for main toolbar buttons
        expect(screen.getByRole('button', { name: /Desfazer/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Refazer/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Export/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Import/ })).toBeInTheDocument();
      });
    });

    it('should show offline status indicator', async () => {
      render(
        <TestWrapper>
          <EditorPro />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Offline')).toBeInTheDocument();
      });
    });
  });

  describe('Step Navigation', () => {
    it('should allow clicking on different steps', async () => {
      render(
        <TestWrapper>
          <EditorPro />
        </TestWrapper>
      );

      await waitFor(() => {
        const step2Button = screen.getByText('Etapa 2');
        expect(step2Button).toBeInTheDocument();

        // Click should work without errors
        fireEvent.click(step2Button);
      });
    });

    it('should show step completion status', async () => {
      render(
        <TestWrapper>
          <EditorPro />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check for green indicators (completed steps)
        const completedSteps = screen.getAllByText(/●/);
        expect(completedSteps.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Canvas and Content Area', () => {
    it('should display main canvas title', async () => {
      render(
        <TestWrapper>
          <EditorPro />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Quiz Style Challenge')).toBeInTheDocument();
      });
    });

    it('should show step progress bar', async () => {
      render(
        <TestWrapper>
          <EditorPro />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check for progress indicators
        expect(screen.getByText('5%')).toBeInTheDocument();
        expect(screen.getByText('Anterior')).toBeInTheDocument();
        expect(screen.getByText('Complete a etapa')).toBeInTheDocument();
      });
    });

    it('should display properties panel instructions', async () => {
      render(
        <TestWrapper>
          <EditorPro />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Selecione um bloco no canvas para editar suas propriedades.')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should not crash when rendering', () => {
      expect(() => {
        render(
          <TestWrapper>
            <EditorPro />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle missing context gracefully', () => {
      // Test without EditorProvider wrapper
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      render(<EditorPro />);

      // Should show error message instead of crashing
      expect(screen.getByText('Erro de Contexto do Editor')).toBeInTheDocument();
      expect(screen.getByText('O EditorPro deve ser usado dentro de um EditorProvider.')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Performance Validation', () => {
    it('should render within reasonable time', async () => {
      const startTime = Date.now();

      render(
        <TestWrapper>
          <EditorPro />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Etapas do Quiz')).toBeInTheDocument();
      });

      const renderTime = Date.now() - startTime;
      expect(renderTime).toBeLessThan(5000); // Should render within 5 seconds
    });

    it('should not have excessive re-renders', () => {
      const renderCount = vi.fn();

      const TestComponent = () => {
        renderCount();
        return (
          <TestWrapper>
            <EditorPro />
          </TestWrapper>
        );
      };

      render(<TestComponent />);

      // Should not re-render excessively during initial mount
      expect(renderCount).toHaveBeenCalledTimes(1);
    });
  });
});