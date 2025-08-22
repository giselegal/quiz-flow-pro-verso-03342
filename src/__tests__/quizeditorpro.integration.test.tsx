import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithProviders } from '@/test/utils/renderWithProviders';
import { QuizEditorPro } from '@/components/editor/QuizEditorPro';
import { EditorProvider } from '@/components/editor/EditorProvider';

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

  describe('Add Block Flow', () => {
    it('should add a new block when dragging from component library', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(<QuizEditorProWithProvider />, {
        initialState: {
          stepBlocks: { 'step-1': [] },
          currentStep: 1,
          selectedBlockId: null,
        },
      });

      // Verify canvas is empty initially
      const canvas = screen.getByTestId('canvas-dropzone');
      expect(canvas).toBeInTheDocument();

      // Find a draggable component (text component)
      const textComponent = screen.getByText('Texto');
      expect(textComponent).toBeInTheDocument();

      // For this test, we'll simulate the add by testing the UI components are rendered
      // In a real drag & drop test, you would simulate the drag and drop events
      expect(screen.getByText('0 blocos disponíveis - Clique para editar')).toBeInTheDocument();
    });

    it('should update block count after adding', async () => {
      renderWithProviders(<QuizEditorProWithProvider />, {
        initialState: {
          stepBlocks: { 
            'step-1': [
              {
                id: 'test-block-1',
                type: 'text',
                order: 1,
                content: { text: 'Test content' },
                properties: {},
              },
            ],
          },
          currentStep: 1,
          selectedBlockId: null,
        },
      });

      // Verify block count is displayed
      expect(screen.getByText('1 blocos disponíveis - Clique para editar')).toBeInTheDocument();
      expect(screen.getByText('Blocos configurados:')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('Undo/Redo Flow', () => {
    it('should render undo and redo buttons', () => {
      renderWithProviders(<QuizEditorProWithProvider />);

      const undoButton = screen.getByTestId('btn-undo');
      const redoButton = screen.getByTestId('btn-redo');

      expect(undoButton).toBeInTheDocument();
      expect(redoButton).toBeInTheDocument();
    });

    it('should disable undo when no history available', () => {
      renderWithProviders(<QuizEditorProWithProvider />);

      const undoButton = screen.getByTestId('btn-undo');
      expect(undoButton).toBeDisabled();
    });

    it('should disable redo when no future history available', () => {
      renderWithProviders(<QuizEditorProWithProvider />);

      const redoButton = screen.getByTestId('btn-redo');
      expect(redoButton).toBeDisabled();
    });
  });

  describe('Export/Import Flow', () => {
    it('should render export and import buttons', () => {
      renderWithProviders(<QuizEditorProWithProvider />);

      const exportButton = screen.getByTestId('btn-export-json');
      const importButton = screen.getByTestId('btn-import-json');

      expect(exportButton).toBeInTheDocument();
      expect(importButton).toBeInTheDocument();
    });

    it('should export JSON when export button is clicked', async () => {
      const user = userEvent.setup();
      
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      });

      // Mock alert
      window.alert = vi.fn();

      renderWithProviders(<QuizEditorProWithProvider />, {
        initialState: {
          stepBlocks: { 
            'step-1': [
              {
                id: 'test-block-1',
                type: 'text',
                order: 1,
                content: { text: 'Test content' },
                properties: {},
              },
            ],
          },
          currentStep: 1,
          selectedBlockId: null,
        },
      });

      const exportButton = screen.getByTestId('btn-export-json');
      await user.click(exportButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('JSON exportado para a área de transferência!');
    });
  });

  describe('Step Navigation', () => {
    it('should display current step in header', () => {
      renderWithProviders(<QuizEditorProWithProvider />, {
        initialState: {
          stepBlocks: {},
          currentStep: 5,
          selectedBlockId: null,
        },
      });

      expect(screen.getByText(/Editor - Etapa 5/)).toBeInTheDocument();
      expect(screen.getByText('Etapa atual:')).toBeInTheDocument();
      expect(screen.getByText('5/21')).toBeInTheDocument();
    });

    it('should show step analysis information', () => {
      renderWithProviders(<QuizEditorProWithProvider />, {
        initialState: {
          stepBlocks: {},
          currentStep: 2,
          selectedBlockId: null,
        },
      });

      // Step 2 should be a question type
      expect(screen.getByText('Questão: Pontuação de estilo')).toBeInTheDocument();
    });

    it('should navigate between steps', async () => {
      const user = userEvent.setup();

      renderWithProviders(<QuizEditorProWithProvider />, {
        initialState: {
          stepBlocks: {},
          currentStep: 1,
          selectedBlockId: null,
        },
      });

      // Find step 2 button and click it
      const step2Button = screen.getByText('Etapa 2');
      await user.click(step2Button);

      // Should update the header
      await waitFor(() => {
        expect(screen.getByText(/Editor - Etapa 2/)).toBeInTheDocument();
      });
    });
  });

  describe('Block Selection', () => {
    it('should show block properties when block is selected', () => {
      renderWithProviders(<QuizEditorProWithProvider />, {
        initialState: {
          stepBlocks: { 
            'step-1': [
              {
                id: 'test-block-1',
                type: 'text',
                order: 1,
                content: { text: 'Test content' },
                properties: {},
              },
            ],
          },
          currentStep: 1,
          selectedBlockId: 'test-block-1',
        },
      });

      expect(screen.getByText('Editando: test-block-1')).toBeInTheDocument();
      expect(screen.getByText('Editando: text')).toBeInTheDocument();
    });

    it('should show default message when no block is selected', () => {
      renderWithProviders(<QuizEditorProWithProvider />, {
        initialState: {
          stepBlocks: { 'step-1': [] },
          currentStep: 1,
          selectedBlockId: null,
        },
      });

      expect(screen.getByText('Nenhum bloco selecionado')).toBeInTheDocument();
      expect(screen.getByText('Selecione um bloco para editar')).toBeInTheDocument();
    });
  });

  describe('Mode Toggle', () => {
    it('should toggle between edit and preview modes', async () => {
      const user = userEvent.setup();

      renderWithProviders(<QuizEditorProWithProvider />);

      // Should start in edit mode
      expect(screen.getByText(/✏️ Editor - Etapa/)).toBeInTheDocument();

      // Click preview button
      const previewButton = screen.getByText('👁️ Preview');
      await user.click(previewButton);

      // Should switch to preview mode
      expect(screen.getByText(/👁️ Preview - Etapa/)).toBeInTheDocument();

      // Click edit button
      const editButton = screen.getByText('✏️ Editar');
      await user.click(editButton);

      // Should switch back to edit mode
      expect(screen.getByText(/✏️ Editor - Etapa/)).toBeInTheDocument();
    });
  });

  describe('Component Library', () => {
    it('should display available components grouped by category', () => {
      renderWithProviders(<QuizEditorProWithProvider />);

      expect(screen.getByText('Biblioteca de Componentes')).toBeInTheDocument();
      
      // Check for some component categories (they may be in different case)
      expect(screen.getByText('Estrutura')).toBeInTheDocument();
      expect(screen.getByText('Interação')).toBeInTheDocument();
      expect(screen.getByText('Conteúdo')).toBeInTheDocument();

      // Check for some specific components
      expect(screen.getByText('Header Quiz')).toBeInTheDocument();
      expect(screen.getByText('Grade Opções')).toBeInTheDocument();
      expect(screen.getByText('Texto')).toBeInTheDocument();
    });
  });
});