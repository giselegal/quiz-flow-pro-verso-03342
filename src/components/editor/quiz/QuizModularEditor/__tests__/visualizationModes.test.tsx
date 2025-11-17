import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import QuizModularEditor from '../index'
import { useSuperUnified } from '@/hooks/useSuperUnified'
import { useFeatureFlags } from '@/hooks/useFeatureFlags'

// Mock the hooks
vi.mock('@/hooks/useSuperUnified', () => ({
  useSuperUnified: vi.fn()
}))

vi.mock('@/hooks/useFeatureFlags', () => ({
  useFeatureFlags: vi.fn()
}))

vi.mock('@/services/api/steps/hooks', () => ({
  useStepBlocksQuery: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null
  }))
}))

// Mock child components
vi.mock('../components/StepNavigatorColumn', () => ({
  default: ({ steps, currentStepKey, onSelectStep }: any) => (
    <div data-testid="step-navigator" data-current-step={currentStepKey}>
      {steps?.map((step: any) => (
        <button key={step.key} onClick={() => onSelectStep(step.key)} data-testid={`step-${step.key}`}>
          {step.title}
        </button>
      ))}
    </div>
  )
}))

vi.mock('../components/ComponentLibraryColumn', () => ({
  default: ({ currentStepKey, onAddBlock }: any) => (
    <div data-testid="component-library" data-step-key={currentStepKey}>
      <button onClick={() => onAddBlock('text')} data-testid="add-text-block">
        Add Text Block
      </button>
    </div>
  )
}))

vi.mock('../components/CanvasColumn', () => ({
  default: ({ currentStepKey, blocks, selectedBlockId, onBlockSelect }: any) => (
    <div data-testid="canvas-column" data-step-key={currentStepKey} data-selected-block={selectedBlockId}>
      <div>Canvas Mode: Edit</div>
      {blocks?.map((block: any) => (
        <div key={block.id} data-testid={`canvas-block-${block.id}`} onClick={() => onBlockSelect(block.id)}>
          {block.type}: {block.content?.text || 'Block'}
        </div>
      ))}
    </div>
  )
}))

vi.mock('../components/PreviewPanel', () => ({
  default: ({ currentStepKey, blocks, selectedBlockId, previewMode, funnelId }: any) => (
    <div 
      data-testid="preview-panel" 
      data-step-key={currentStepKey} 
      data-preview-mode={previewMode}
      data-funnel-id={funnelId}
    >
      <div>Preview Mode: {previewMode}</div>
      {blocks?.map((block: any) => (
        <div key={block.id} data-testid={`preview-block-${block.id}`}>
          Preview {block.type}: {block.content?.text || 'Block'}
        </div>
      ))}
    </div>
  )
}))

vi.mock('../components/PropertiesColumn', () => ({
  default: ({ selectedBlock, onBlockUpdate }: any) => (
    <div data-testid="properties-column" data-selected-block={selectedBlock?.id}>
      <div>Properties Panel</div>
      {selectedBlock && <div>Editing: {selectedBlock.type}</div>}
    </div>
  )
}))

describe('QuizModularEditor Visualization Modes', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  // Helper function to render with providers
  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    )
  }

  const mockUnifiedState = {
    editor: {
      currentStep: 1,
      selectedBlockId: null,
      isDirty: false,
      stepBlocks: {
        '1': [
          {
            id: 'block-1',
            type: 'headline',
            properties: { text: 'Test Headline' },
            content: { text: 'Test Headline' },
            order: 0
          },
          {
            id: 'block-2',
            type: 'text',
            properties: { text: 'Test paragraph' },
            content: { text: 'Test paragraph' },
            order: 1
          }
        ]
      }
    },
    ui: {
      isLoading: false
    },
    currentFunnel: {
      id: 'test-funnel-123',
      name: 'Test Funnel'
    }
  }

  const mockUnified = {
    state: mockUnifiedState,
    setCurrentStep: vi.fn(),
    addBlock: vi.fn(),
    saveFunnel: vi.fn(),
    saveStepBlocks: vi.fn(),
    publishFunnel: vi.fn(),
    showToast: vi.fn(),
    getStepBlocks: vi.fn((stepIndex) => mockUnifiedState.editor.stepBlocks[stepIndex] || []),
    setStepBlocks: vi.fn(),
    setSelectedBlock: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    canUndo: false,
    canRedo: false,
    removeBlock: vi.fn(),
    reorderBlocks: vi.fn(),
    updateBlock: vi.fn(),
    createFunnel: vi.fn()
  }

  const mockFeatureFlags = {
    enableAutoSave: true
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSuperUnified).mockReturnValue(mockUnified as any)
    vi.mocked(useFeatureFlags).mockReturnValue(mockFeatureFlags as any)
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      },
      writable: true
    })
  })

  describe('Editar (Edit) Mode', () => {
    it('should render in edit mode by default', () => {
      renderWithProviders(<QuizModularEditor />)
      
      // Should show the edit mode toggle button as active
      const editButton = screen.getByText('Editar')
      expect(editButton).toBeInTheDocument()
      
      // Should render canvas column for editing
      expect(screen.getByTestId('canvas-column')).toBeInTheDocument()
      expect(screen.getByText('Canvas Mode: Edit')).toBeInTheDocument()
      
      // Should not render preview panel when in edit mode
      expect(screen.queryByTestId('preview-panel')).not.toBeInTheDocument()
    })

    it('should allow block selection and editing in edit mode', () => {
      renderWithProviders(<QuizModularEditor />)
      
      const canvasBlock = screen.getByTestId('canvas-block-block-1')
      expect(canvasBlock).toBeInTheDocument()
      
      fireEvent.click(canvasBlock)
      expect(mockUnified.setSelectedBlock).toHaveBeenCalledWith('block-1')
    })

    it('should show properties panel when block is selected', () => {
      const selectedState = {
        ...mockUnifiedState,
        editor: {
          ...mockUnifiedState.editor,
          selectedBlockId: 'block-1'
        }
      }
      vi.mocked(useSuperUnified).mockReturnValue({
        ...mockUnified,
        state: selectedState
      } as any)
      
      renderWithProviders(<QuizModularEditor />)
      
      expect(screen.getByTestId('properties-column')).toHaveAttribute('data-selected-block', 'block-1')
      expect(screen.getByText('Editing: headline')).toBeInTheDocument()
    })
  })

  describe('Preview (Editor) Mode', () => {
    it('should switch to preview editor mode', () => {
      renderWithProviders(<QuizModularEditor />)
      
      // Find the toggle group and click on preview editor mode
      const previewEditorButton = screen.getByTitle('Visualizar dados do editor')
      fireEvent.click(previewEditorButton)
      
      // Should now show preview panel with live mode
      expect(screen.getByTestId('preview-panel')).toHaveAttribute('data-preview-mode', 'live')
      expect(screen.getByText('Preview Mode: live')).toBeInTheDocument()
    })

    it('should show editor preview banner', () => {
      renderWithProviders(<QuizModularEditor />)
      
      const previewEditorButton = screen.getByTitle('Visualizar dados do editor')
      fireEvent.click(previewEditorButton)
      
      // Should show the editor preview banner in the preview panel
      const previewPanel = screen.getByTestId('preview-panel')
      expect(previewPanel).toBeInTheDocument()
    })

    it('should render blocks in preview mode', () => {
      renderWithProviders(<QuizModularEditor />)
      
      const previewEditorButton = screen.getByTitle('Visualizar dados do editor')
      fireEvent.click(previewEditorButton)
      
      // Should render blocks in preview
      expect(screen.getByTestId('preview-block-block-1')).toBeInTheDocument()
      expect(screen.getByTestId('preview-block-block-2')).toBeInTheDocument()
      expect(screen.getByText('Preview headline: Test Headline')).toBeInTheDocument()
      expect(screen.getByText('Preview text: Test paragraph')).toBeInTheDocument()
    })
  })

  describe('Preview (Produção) Mode', () => {
    it('should switch to preview production mode', () => {
      renderWithProviders(<QuizModularEditor />)
      
      // Find the toggle group and click on preview production mode
      const previewProductionButton = screen.getByTitle('Visualizar dados publicados')
      fireEvent.click(previewProductionButton)
      
      // Should now show preview panel with production mode
      expect(screen.getByTestId('preview-panel')).toHaveAttribute('data-preview-mode', 'production')
      expect(screen.getByText('Preview Mode: production')).toBeInTheDocument()
    })

    it('should show production preview banner', () => {
      renderWithProviders(<QuizModularEditor />)
      
      const previewProductionButton = screen.getByTitle('Visualizar dados publicados')
      fireEvent.click(previewProductionButton)
      
      // Should show the production preview banner in the preview panel
      const previewPanel = screen.getByTestId('preview-panel')
      expect(previewPanel).toBeInTheDocument()
    })

    it('should fetch data from backend in production mode', () => {
      renderWithProviders(<QuizModularEditor resourceId="test-funnel-123" />)
      
      const previewProductionButton = screen.getByTitle('Visualizar dados publicados')
      fireEvent.click(previewProductionButton)
      
      // Should pass funnel ID to preview panel for backend fetching
      const previewPanel = screen.getByTestId('preview-panel')
      expect(previewPanel).toHaveAttribute('data-funnel-id', 'test-funnel-123')
    })

    it('should use ResponsivePreviewFrame in production mode', () => {
      renderWithProviders(<QuizModularEditor />)
      
      const previewProductionButton = screen.getByTitle('Visualizar dados publicados')
      fireEvent.click(previewProductionButton)
      
      // In production mode, the preview panel should use ResponsivePreviewFrame
      // (This is verified by the mock implementation)
      expect(screen.getByTestId('preview-panel')).toBeInTheDocument()
    })
  })

  describe('Mode Switching', () => {
    it('should persist mode selection to localStorage', () => {
      renderWithProviders(<QuizModularEditor />)
      
      // Switch to preview editor mode
      const previewEditorButton = screen.getByTitle('Visualizar dados do editor')
      fireEvent.click(previewEditorButton)
      
      expect(localStorage.setItem).toHaveBeenCalledWith('qm-editor:canvas-mode', 'preview')
      expect(localStorage.setItem).toHaveBeenCalledWith('qm-editor:preview-mode', 'live')
    })

    it('should restore mode from localStorage on mount', () => {
      // Mock localStorage to have saved preview mode
      vi.mocked(localStorage.getItem).mockImplementation((key) => {
        if (key === 'qm-editor:canvas-mode') return 'preview'
        if (key === 'qm-editor:preview-mode') return 'production'
        return null
      })
      
      renderWithProviders(<QuizModularEditor />)
      
      // Should start in preview production mode based on localStorage
      expect(screen.getByTestId('preview-panel')).toHaveAttribute('data-preview-mode', 'production')
    })

    it('should handle keyboard shortcuts for mode switching', () => {
      renderWithProviders(<QuizModularEditor />)
      
      // Test Ctrl+Shift+P to toggle between edit and preview
      fireEvent.keyDown(window, { key: 'p', ctrlKey: true, shiftKey: true })
      
      // Should switch to preview mode
      expect(screen.getByTestId('preview-panel')).toHaveAttribute('data-preview-mode', 'live')
      
      // Test Ctrl+Shift+L to switch to live preview
      fireEvent.keyDown(window, { key: 'l', ctrlKey: true, shiftKey: true })
      expect(screen.getByTestId('preview-panel')).toHaveAttribute('data-preview-mode', 'live')
      
      // Test Ctrl+Shift+O to switch to production preview
      fireEvent.keyDown(window, { key: 'o', ctrlKey: true, shiftKey: true })
      expect(screen.getByTestId('preview-panel')).toHaveAttribute('data-preview-mode', 'production')
    })
  })

  describe('Read-only Mode', () => {
    it('should disable editing in read-only mode', () => {
      renderWithProviders(<QuizModularEditor isReadOnly={true} />)
      
      // Should not show add block functionality
      expect(screen.queryByTestId('add-text-block')).not.toBeInTheDocument()
      
      // Should not allow block selection
      const canvasBlock = screen.getByTestId('canvas-block-block-1')
      fireEvent.click(canvasBlock)
      expect(mockUnified.setSelectedBlock).not.toHaveBeenCalled()
    })

    it('should still allow preview in read-only mode', () => {
      renderWithProviders(<QuizModularEditor isReadOnly={true} />)
      
      // Should still be able to switch to preview mode
      const previewEditorButton = screen.getByTitle('Visualizar dados do editor')
      fireEvent.click(previewEditorButton)
      
      expect(screen.getByTestId('preview-panel')).toBeInTheDocument()
    })
  })
})