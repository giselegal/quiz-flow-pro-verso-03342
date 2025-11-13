import { describe, it, expect, vi } from 'vitest'
import structuredLogger from '@/core/observability/StructuredLogger'

describe('StructuredLogger remote payload', () => {
  it('maps level and timestamp to server schema', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ ok: true }) })
    // @ts-ignore
    global.fetch = fetchMock
    structuredLogger.setRemoteEnabled(true)
    structuredLogger.clearBuffer()
    structuredLogger.info('msg', { a: 1 })
    await structuredLogger.flush()
    expect(fetchMock).toHaveBeenCalled()
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.level).toBe('info')
    expect(typeof body.timestamp).toBe('string')
    expect(body.message).toBe('msg')
    expect(body.context.a).toBe(1)
  })
  it('maps CRITICAL to error', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ ok: true }) })
    // @ts-ignore
    global.fetch = fetchMock
    structuredLogger.setRemoteEnabled(true)
    structuredLogger.clearBuffer()
    structuredLogger.critical('boom', {})
    await structuredLogger.flush()
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.level).toBe('error')
    expect(body.message).toBe('boom')
  })
})
