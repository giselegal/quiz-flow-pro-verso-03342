import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import QuizModularEditor from '@/components/editor/quiz/QuizModularEditor'
import { SuperUnifiedProviderV4 as SuperUnifiedProvider } from '@/contexts/providers/SuperUnifiedProviderV4'

vi.mock('@/services/canonical/TemplateService', () => {
  const steps = Array.from({ length: 21 }, (_, i) => ({ id: `step-${String(i + 1).padStart(2, '0')}`, order: i + 1, name: `Etapa ${i + 1}` }))
  return {
    templateService: {
      prepareTemplate: vi.fn().mockResolvedValue(undefined),
      setActiveTemplate: vi.fn(),
      setActiveFunnel: vi.fn(),
      steps: { list: vi.fn(() => ({ success: true, data: steps })) },
      getStep: vi.fn(async () => ({ success: true, data: [] })),
      invalidateTemplate: vi.fn(),
    }
  }
})

describe('Editor TTI', () => {
  it('renderiza canvas rapidamente e mostra progresso quando parcial', async () => {
    const start = performance.now()
    const editorResource = {
      id: 'funnel-x',
      type: 'funnel',
      name: 'Funnel Teste',
      source: 'local',
      isReadOnly: false,
      canClone: true,
      metadata: { progress: 0.2 }
    } as any

    render(
      <SuperUnifiedProvider>
        <QuizModularEditor resourceId="quiz21StepsComplete" editorResource={editorResource} />
      </SuperUnifiedProvider>
    )
    const progressEl = await screen.findByTestId('editor-loading-progress')
    expect(progressEl).toBeDefined()
    const tti = performance.now() - start
    expect(tti).toBeLessThan(1000)
  })
})