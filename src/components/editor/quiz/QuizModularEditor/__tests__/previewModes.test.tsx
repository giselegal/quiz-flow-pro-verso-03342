import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PreviewPanel from '../components/PreviewPanel'
import { useStepBlocksQuery } from '@/services/api/steps/hooks'

// Mock the useStepBlocksQuery hook
vi.mock('@/services/api/steps/hooks', () => ({
  useStepBlocksQuery: vi.fn()
}))

// Mock BlockTypeRenderer
vi.mock('@/components/editor/quiz/renderers/BlockTypeRenderer', () => ({
  BlockTypeRenderer: ({ block, isSelected, isEditable, onSelect }: any) => (
    <div
      data-testid={`block-${block.id}`}
      data-selected={isSelected}
      data-editable={isEditable}
      onClick={() => onSelect?.(block.id)}
    >
      {block.type}: {block.content?.text || block.content?.url || 'Block Content'}
    </div>
  )
}))

// Mock ResponsivePreviewFrame
vi.mock('@/components/editor/preview/ResponsivePreviewFrame', () => ({
  ResponsivePreviewFrame: ({ quizContent, currentStepId }: any) => (
    <div data-testid="responsive-preview" data-step-id={currentStepId}>
      <div data-testid="preview-content">{JSON.stringify(quizContent)}</div>
    </div>
  )
}))

describe('PreviewPanel Visualization Modes', () => {
  const mockBlocks = [
    {
      id: 'block-1',
      type: 'headline' as const,
      properties: { text: 'Test Headline' },
      content: { text: 'Test Headline' },
      order: 0
    },
    {
      id: 'block-2',
      type: 'text' as const,
      properties: { text: 'Test paragraph content' },
      content: { text: 'Test paragraph content' },
      order: 1
    },
    {
      id: 'block-3',
      type: 'button' as const,
      properties: { text: 'Continue' },
      content: { text: 'Continue' },
      order: 2
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock implementation
    vi.mocked(useStepBlocksQuery).mockReturnValue({
      data: null,
      isLoading: false,
      error: null
    } as any)
  })

  describe('Editar (Edit) Mode', () => {
    it('should show toggle button when not visible in edit mode', () => {
      // In edit mode, PreviewPanel is typically not visible, showing only the toggle button
      render(
        <PreviewPanel
          currentStepKey={null}
          blocks={[]}
          selectedBlockId={null}
          isVisible={false}
          previewMode={'live'}
        />
      )

      expect(screen.getByText('Mostrar Preview')).toBeInTheDocument()
    })
  })

  describe('Preview (Editor) Mode', () => {
    it('should display editor preview banner', () => {
      render(
        <PreviewPanel
          currentStepKey={'step-01'}
          blocks={mockBlocks}
          selectedBlockId={null}
          isVisible={true}
          previewMode={'live'}
        />
      )

      expect(screen.getByText(/🛠 Visualização do Editor \(Dados em edição\)/i)).toBeInTheDocument()
    })

    it('should render blocks directly without fetching from backend', () => {
      render(
        <PreviewPanel
          currentStepKey={'step-01'}
          blocks={mockBlocks}
          selectedBlockId={null}
          isVisible={true}
          previewMode={'live'}
        />
      )

      // Verify blocks are rendered
      expect(screen.getByTestId('block-block-1')).toBeInTheDocument()
      expect(screen.getByTestId('block-block-2')).toBeInTheDocument()
      expect(screen.getByTestId('block-block-3')).toBeInTheDocument()

      // Verify content
      expect(screen.getByText('headline: Test Headline')).toBeInTheDocument()
      expect(screen.getByText('text: Test paragraph content')).toBeInTheDocument()
      expect(screen.getByText('button: Continue')).toBeInTheDocument()
    })

    it('should handle block selection in editor preview mode', () => {
      const mockOnBlockSelect = vi.fn()

      render(
        <PreviewPanel
          currentStepKey={'step-01'}
          blocks={mockBlocks}
          selectedBlockId={'block-1'}
          onBlockSelect={mockOnBlockSelect}
          isVisible={true}
          previewMode={'live'}
        />
      )

      const blockElement = screen.getByTestId('block-block-1')
      expect(blockElement).toHaveAttribute('data-selected', 'true')

      fireEvent.click(blockElement)
      expect(mockOnBlockSelect).toHaveBeenCalledWith('block-1')
    })

    it('should show empty state when no step is selected', () => {
      render(
        <PreviewPanel
          currentStepKey={null}
          blocks={[]}
          selectedBlockId={null}
          isVisible={true}
          previewMode={'live'}
        />
      )

      expect(screen.getByText('Selecione uma etapa para visualizar')).toBeInTheDocument()
      // When no step is selected, blocks should not be rendered
      expect(screen.queryByTestId('block-block-1')).not.toBeInTheDocument()
    })

    it('should handle loading state gracefully', () => {
      vi.mocked(useStepBlocksQuery).mockReturnValue({
        data: null,
        isLoading: true,
        error: null
      } as any)

      render(
        <PreviewPanel
          currentStepKey={'step-01'}
          blocks={null}
          selectedBlockId={null}
          isVisible={true}
          previewMode={'live'}
        />
      )

      expect(screen.getByText('Carregando preview…')).toBeInTheDocument()
    })

    it('should handle error state', () => {
      const errorMessage = 'Failed to load blocks'
      vi.mocked(useStepBlocksQuery).mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error(errorMessage)
      } as any)

      render(
        <PreviewPanel
          currentStepKey={'step-01'}
          blocks={null}
          selectedBlockId={null}
          isVisible={true}
          previewMode={'live'}
        />
      )

      expect(screen.getByText(`Erro ao carregar blocos: ${errorMessage}`)).toBeInTheDocument()
    })
  })

  describe('Preview (Produção) Mode', () => {
    it('should display production preview banner', () => {
      render(
        <PreviewPanel
          currentStepKey={'step-01'}
          blocks={mockBlocks}
          selectedBlockId={null}
          isVisible={true}
          previewMode={'production'}
        />
      )

      expect(screen.getByText(/🚀 Modo Production \(Dados Publicados\)/i)).toBeInTheDocument()
    })

    it('should fetch data from backend in production mode', () => {
      render(
        <PreviewPanel
          currentStepKey={'step-01'}
          blocks={mockBlocks}
          selectedBlockId={null}
          isVisible={true}
          previewMode={'production'}
          funnelId={'test-funnel-id'}
        />
      )

      // Verify that useStepBlocksQuery was called with production-specific parameters
      expect(vi.mocked(useStepBlocksQuery)).toHaveBeenCalledWith({
        stepId: 'step-01',
        funnelId: 'test-funnel-id',
        enabled: true,
        staleTimeMs: 0 // Should be 0 for production mode to force refetch
      })
    })

    it('should use ResponsivePreviewFrame in production mode', () => {
      render(
        <PreviewPanel
          currentStepKey={'step-01'}
          blocks={mockBlocks}
          selectedBlockId={null}
          isVisible={true}
          previewMode={'production'}
        />
      )

      expect(screen.getByTestId('responsive-preview')).toBeInTheDocument()
      expect(screen.getByTestId('responsive-preview')).toHaveAttribute('data-step-id', 'step-01')
    })

    it('should show production-specific empty state', () => {
      render(
        <PreviewPanel
          currentStepKey={null}
          blocks={[]}
          selectedBlockId={null}
          isVisible={true}
          previewMode={'production'}
        />
      )

      expect(screen.getByText('Selecione uma etapa para visualizar')).toBeInTheDocument()
      expect(screen.getByText('Modo Production: mostrando dados publicados')).toBeInTheDocument()
    })

    it('should handle step change in production mode', () => {
      const mockOnStepChange = vi.fn()

      render(
        <PreviewPanel
          currentStepKey={'step-01'}
          blocks={mockBlocks}
          selectedBlockId={null}
          isVisible={true}
          previewMode={'production'}
          onStepChange={mockOnStepChange}
        />
      )

      // The ResponsivePreviewFrame should be configured to handle step changes
      const previewFrame = screen.getByTestId('responsive-preview')
      expect(previewFrame).toBeInTheDocument()
    })
  })

  describe('Visibility Toggle', () => {
    it('should show toggle button when visibility can be changed', () => {
      const mockOnToggleVisibility = vi.fn()

      render(
        <PreviewPanel
          currentStepKey={'step-01'}
          blocks={mockBlocks}
          selectedBlockId={null}
          isVisible={true}
          onToggleVisibility={mockOnToggleVisibility}
          previewMode={'live'}
        />
      )

      const toggleButton = screen.getByTitle('Ocultar preview')
      expect(toggleButton).toBeInTheDocument()

      fireEvent.click(toggleButton)
      expect(mockOnToggleVisibility).toHaveBeenCalledTimes(1)
    })

    it('should show minimized state when not visible', () => {
      const mockOnToggleVisibility = vi.fn()

      render(
        <PreviewPanel
          currentStepKey={'step-01'}
          blocks={mockBlocks}
          selectedBlockId={null}
          isVisible={false}
          onToggleVisibility={mockOnToggleVisibility}
          previewMode={'live'}
        />
      )

      expect(screen.getByText('Mostrar Preview')).toBeInTheDocument()
      expect(screen.queryByText('🛠 Visualização do Editor')).not.toBeInTheDocument()
    })
  })

  describe('Block Type Normalization', () => {
    it('should normalize different block types correctly', () => {
      const mixedBlocks = [
        { id: 'block-1', type: 'headline' as const, properties: { text: 'Heading' }, content: {}, order: 0 },
        { id: 'block-2', type: 'button' as const, properties: { text: 'Button' }, content: {}, order: 1 },
        { id: 'block-3', type: 'cta' as const, properties: { text: 'CTA' }, content: {}, order: 2 },
        { id: 'block-4', type: 'multiple-choice' as const, properties: { options: [{ text: 'Option 1' }] }, content: {}, order: 3 },
        { id: 'block-5', type: 'quiz-header' as const, properties: { currentStep: 1, totalSteps: 21 }, content: {}, order: 4 }
      ]

      render(
        <PreviewPanel
          currentStepKey={'step-01'}
          blocks={mixedBlocks}
          selectedBlockId={null}
          isVisible={true}
          previewMode={'live'}
        />
      )

      // Check that blocks are rendered with their normalized types
      expect(screen.getByTestId('block-block-1')).toHaveTextContent('headline')
      expect(screen.getByTestId('block-block-2')).toHaveTextContent('button')
      expect(screen.getByTestId('block-block-3')).toHaveTextContent('cta')
      expect(screen.getByTestId('block-block-4')).toHaveTextContent('multiple-choice')
      expect(screen.getByTestId('block-block-5')).toHaveTextContent('quiz-header')
    })
  })
})