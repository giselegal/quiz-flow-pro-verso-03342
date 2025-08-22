import { EditorProvider } from '@/components/editor/EditorProvider';
import { QuizEditorPro } from '@/components/editor/QuizEditorPro';
import { renderWithProviders } from '@/test/utils/renderWithProviders';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Helper component that wraps QuizEditorPro with EditorProvider
const QuizEditorProWithProvider = () => (
  <EditorProvider>
    <QuizEditorPro />
  </EditorProvider>
);

describe('QuizEditorPro Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Core UI Components', () => {
    it('should render all essential UI elements', () => {
      renderWithProviders(<QuizEditorProWithProvider />);

      // Essential UI sections
      expect(screen.getByText('Etapas do Quiz')).toBeInTheDocument();
      expect(screen.getByText('Biblioteca de Componentes')).toBeInTheDocument();
      expect(screen.getByText('Painel de Propriedades')).toBeInTheDocument();
    });

    it('should render required action buttons with correct data-testids', () => {
      renderWithProviders(<QuizEditorProWithProvider />);

      // Required buttons with data-testids
      expect(screen.getByTestId('btn-undo')).toBeInTheDocument();
      expect(screen.getByTestId('btn-redo')).toBeInTheDocument();
      expect(screen.getByTestId('btn-export-json')).toBeInTheDocument();
      expect(screen.getByTestId('btn-import-json')).toBeInTheDocument();
    });

    it('should render canvas dropzone with correct data-testid', () => {
      renderWithProviders(<QuizEditorProWithProvider />);

      expect(screen.getByTestId('canvas-dropzone')).toBeInTheDocument();
    });

    it('should start with undo/redo disabled', () => {
      renderWithProviders(<QuizEditorProWithProvider />);

      expect(screen.getByTestId('btn-undo')).toBeDisabled();
      expect(screen.getByTestId('btn-redo')).toBeDisabled();
    });
  });

  describe('History State Management', () => {
    it('should enable undo after state changes', async () => {
      const user = userEvent.setup();

      renderWithProviders(<QuizEditorProWithProvider />, {
        initialState: {
          stepBlocks: {},
          currentStep: 1,
          selectedBlockId: null,
        },
      });

      // Change step to create history
      await user.click(screen.getByText('Etapa 2'));

      await waitFor(() => {
        expect(screen.getByTestId('btn-undo')).not.toBeDisabled();
      });
    });
  });

  describe('Export Functionality', () => {
    it('should call export when export button clicked', async () => {
      const user = userEvent.setup();

      // Mock clipboard and alert
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
      });
      window.alert = vi.fn();

      renderWithProviders(<QuizEditorProWithProvider />);

      await user.click(screen.getByTestId('btn-export-json'));

      expect(writeTextMock).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('JSON exportado para a área de transferência!');
    });
  });

  describe('Mode Toggle', () => {
    it('should have edit and preview mode buttons', () => {
      renderWithProviders(<QuizEditorProWithProvider />);

      expect(screen.getByText('✏️ Editar')).toBeInTheDocument();
      expect(screen.getByText('👁️ Preview')).toBeInTheDocument();
    });
  });

  describe('Step Navigation', () => {
    it('should display all 21 steps', () => {
      renderWithProviders(<QuizEditorProWithProvider />);

      // Check for presence of multiple steps
      expect(screen.getByText('Etapa 1')).toBeInTheDocument();
      expect(screen.getByText('Etapa 2')).toBeInTheDocument();
      expect(screen.getByText('Etapa 21')).toBeInTheDocument();
    });
  });

  describe('Component Library', () => {
    it('should display component categories and components', () => {
      renderWithProviders(<QuizEditorProWithProvider />);

      // Check for specific components
      expect(screen.getByText('Header Quiz')).toBeInTheDocument();
      expect(screen.getByText('Grade Opções')).toBeInTheDocument();
      expect(screen.getByText('Texto')).toBeInTheDocument();
    });
  });
});
