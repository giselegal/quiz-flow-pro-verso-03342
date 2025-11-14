import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useEditorResource } from '../useEditorResource'
import * as CanonicalTemplateService from '@/services/canonical/TemplateService'

vi.mock('@/editor/adapters/TemplateToFunnelAdapter', () => ({
  templateToFunnelAdapter: {
    convertTemplateToFunnelStream: vi.fn(async function* () {
      yield {
        funnel: {
          id: 'funnel-1',
          name: 'Funnel - quiz21StepsComplete',
          stages: [
            {
              id: 'step-01',
              name: 'Introdução',
              blocks: [{ id: 'b1', type: 'heading', content: {}, order: 0 }],
              order: 0,
              isRequired: true,
              metadata: { blocksCount: 1, isValid: true },
            },
          ],
          settings: {},
          status: 'draft',
          version: '1.0.0',
          createdAt: new Date(),
          updatedAt: new Date(),
          metadata: { totalBlocks: 1, completedStages: 1, isValid: true },
        },
        progress: 1 / 21,
        isComplete: false,
      }
      yield {
        funnel: {
          id: 'funnel-1',
          name: 'Funnel - quiz21StepsComplete',
          stages: [
            {
              id: 'step-01',
              name: 'Introdução',
              blocks: [{ id: 'b1', type: 'heading', content: {}, order: 0 }],
              order: 0,
              isRequired: true,
              metadata: { blocksCount: 1, isValid: true },
            },
            {
              id: 'step-02',
              name: 'Etapa 2',
              blocks: [{ id: 'b2', type: 'text', content: {}, order: 0 }],
              order: 1,
              isRequired: true,
              metadata: { blocksCount: 1, isValid: true },
            },
          ],
          settings: {},
          status: 'draft',
          version: '1.0.0',
          createdAt: new Date(),
          updatedAt: new Date(),
          metadata: { totalBlocks: 2, completedStages: 2, isValid: true },
        },
        progress: 2 / 21,
        isComplete: false,
      }
      yield {
        funnel: {
          id: 'funnel-1',
          name: 'Funnel - quiz21StepsComplete',
          stages: Array.from({ length: 21 }, (_, i) => ({
            id: `step-${String(i + 1).padStart(2, '0')}`,
            name: `Etapa ${i + 1}`,
            blocks: [],
            order: i,
            isRequired: true,
            metadata: { blocksCount: 0, isValid: true },
          })),
          settings: {},
          status: 'draft',
          version: '1.0.0',
          createdAt: new Date(),
          updatedAt: new Date(),
          metadata: { totalBlocks: 2, completedStages: 21, isValid: true },
        },
        progress: 1,
        isComplete: true,
      }
    }),
  },
}))

describe('useEditorResource - Streaming Integration', () => {
  it('atualiza recurso progressivamente e marca isReadOnly=false', async () => {
    const templateId = 'quiz21StepsComplete'
    const { result } = renderHook(() =>
      useEditorResource({ resourceId: templateId, autoLoad: true, hasSupabaseAccess: false })
    )

    await waitFor(() => {
      expect(result.current.resource).not.toBeNull()
      expect(result.current.resource?.metadata?.progress).toBeGreaterThan(0)
      expect(result.current.resource?.isReadOnly).toBe(false)
    })

    await waitFor(() => {
      expect(result.current.resource?.metadata?.progress).toBe(1)
    })
  })

  it('chama prepareTemplate antes do stream (spy na instância singleton)', async () => {
    const spy = vi.spyOn(CanonicalTemplateService.templateService, 'prepareTemplate').mockResolvedValue({ success: true }) as any
    const templateId = 'quiz21StepsComplete'
    renderHook(() => useEditorResource({ resourceId: templateId, autoLoad: true, hasSupabaseAccess: false }))

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith(templateId)
    })
  })
})

