/* @vitest-environment jsdom */
import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import SuperUnifiedProvider from '@/contexts/providers/SuperUnifiedProvider'
import UnifiedEditorCore from '@/components/editor/UnifiedEditorCore'
import { useEditor } from '@/hooks/useEditor'
import { templateService } from '@/services/canonical/TemplateService'

const Consumer = ({ onReady }: { onReady: (ctx: ReturnType<typeof useEditor>) => void }) => {
  const ctx = useEditor()
  React.useEffect(() => { onReady(ctx) }, [ctx, onReady])
  return null
}

describe('Streaming conversion loads all steps', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    Object.defineProperty(window, 'location', {
      value: { search: '?resource=quiz21StepsComplete' },
      writable: true,
    })
    vi.spyOn(templateService, 'getStep').mockImplementation(async (stepId: string) => ({
      success: true,
      data: [
        { id: `${stepId}-block-1`, type: 'text', order: 0, properties: {}, content: {} } as any,
      ],
    } as any))
  })

  it('carrega blocos para os 21 steps progressivamente', async () => {
    let editorCtx: any
    const onReady = (ctx: any) => { editorCtx = ctx }

    render(
      <SuperUnifiedProvider>
        <UnifiedEditorCore mode="visual" />
        <Consumer onReady={onReady} />
      </SuperUnifiedProvider>
    )

    await waitFor(() => {
      const keys = Object.keys(editorCtx.state.stepBlocks || {})
      expect(keys.length).toBeGreaterThanOrEqual(21)
      const filled = keys.filter(k => (editorCtx.state.stepBlocks as any)[k]?.length > 0).length
      expect(filled).toBeGreaterThanOrEqual(21)
    }, { timeout: 8000 })
  })
})

