import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QuizEditorPro } from '../QuizEditorPro';
import { EditorProvider } from '../EditorProvider';

// Mock the required dependencies
vi.mock('@/components/core/QuizRenderer', () => ({
  QuizRenderer: ({ initialStep }: { initialStep: number }) => 
    <div data-testid="quiz-renderer" data-initial-step={initialStep}>QuizRenderer Mock</div>
}));

vi.mock('@/components/ui/Notification', () => ({
  useNotification: () => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    NotificationContainer: () => <div data-testid="notification-container" />
  })
}));

vi.mock('@/components/editor/canvas/CanvasDropZone', () => ({
  default: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="canvas-dropzone">{children}</div>
}));

vi.mock('@/components/universal/EnhancedUniversalPropertiesPanelFixed', () => ({
  default: () => <div data-testid="properties-panel">Properties Panel</div>
}));

vi.mock('@/components/editor/dnd/DraggableComponentItem', () => ({
  DraggableComponentItem: ({ title }: { title: string }) => 
    <div data-testid="draggable-component">{title}</div>
}));

vi.mock('@/components/editor/SortableBlock', () => ({
  SortableBlock: () => <div data-testid="sortable-block">SortableBlock</div>
}));

describe('QuizEditorPro - Resilient Step Loading', () => {
  it('should handle different stepBlocks key formats', () => {
    // Test data with different key formats
    const testStepBlocks = {
      'step-1': [{ id: 'block1', type: 'text', content: {}, properties: {}, order: 1 }],
      'step2': [{ id: 'block2', type: 'button', content: {}, properties: {}, order: 1 }],
      '3': [{ id: 'block3', type: 'image', content: {}, properties: {}, order: 1 }],
      4: [{ id: 'block4', type: 'form', content: {}, properties: {}, order: 1 }],
      'step-5': { blocks: [{ id: 'block5', type: 'result', content: {}, properties: {}, order: 1 }] }
    };

    render(
      <EditorProvider 
        initial={{ 
          stepBlocks: testStepBlocks,
          currentStep: 1,
          selectedBlockId: null,
          isSupabaseEnabled: false,
          databaseMode: 'local',
          isLoading: false
        }}
      >
        <QuizEditorPro />
      </EditorProvider>
    );

    // Check that the component renders without errors
    expect(screen.getByTestId('quiz-renderer')).toBeInTheDocument();
    expect(screen.getByTestId('canvas-dropzone')).toBeInTheDocument();
    
    // Verify that the current step is displayed correctly
    expect(screen.getByText(/Editor - Etapa 1/)).toBeInTheDocument();
    expect(screen.getByText(/1\/21/)).toBeInTheDocument();
    
    // Check that statistics are shown
    expect(screen.getByText(/Estatísticas da Etapa 1/)).toBeInTheDocument();
  });

  it('should use safeCurrentStep when state.currentStep is undefined', () => {
    render(
      <EditorProvider 
        initial={{ 
          stepBlocks: { 'step-1': [] },
          currentStep: undefined as any, // Force undefined
          selectedBlockId: null,
          isSupabaseEnabled: false,
          databaseMode: 'local',
          isLoading: false
        }}
      >
        <QuizEditorPro />
      </EditorProvider>
    );

    // Should default to step 1 when currentStep is undefined
    expect(screen.getByText(/Editor - Etapa 1/)).toBeInTheDocument();
    expect(screen.getByTestId('quiz-renderer')).toHaveAttribute('data-initial-step', '1');
  });

  it('should handle step blocks with nested .blocks property', () => {
    const testStepBlocks = {
      'step-1': { 
        blocks: [
          { id: 'nested-block1', type: 'text', content: {}, properties: {}, order: 1 }
        ] 
      }
    };

    render(
      <EditorProvider 
        initial={{ 
          stepBlocks: testStepBlocks,
          currentStep: 1,
          selectedBlockId: null,
          isSupabaseEnabled: false,
          databaseMode: 'local',
          isLoading: false
        }}
      >
        <QuizEditorPro />
      </EditorProvider>
    );

    // Should render correctly with nested blocks
    expect(screen.getByTestId('quiz-renderer')).toBeInTheDocument();
    expect(screen.getByText(/1 blocos disponíveis/)).toBeInTheDocument();
  });
});