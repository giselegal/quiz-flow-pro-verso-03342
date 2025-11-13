import { describe, it, expect, vi } from 'vitest'
import { appLogger } from '@/lib/utils/appLogger'
import { useUtmParameters } from '@/hooks/useUtmParameters'
import { render } from '@testing-library/react'
import React from 'react'

describe('UTM Analytics client payload', () => {
  it('sends snake_case keys and checks ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    })
    // @ts-ignore
    global.fetch = fetchMock
    const loggerSpy = vi.spyOn(appLogger, 'info').mockImplementation(() => {})
    // @ts-ignore
    delete global.window.location
    // @ts-ignore
    global.window.location = { search: '?utm_source=fb&utm_medium=social&utm_campaign=brand&utm_content=ad&utm_term=quiz' }
    const Comp = () => { useUtmParameters(); return null }
    render(React.createElement(Comp))
    await vi.waitUntil(() => fetchMock.mock.calls.length > 0)
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.utm_source).toBe('fb')
    expect(body.utm_medium).toBe('social')
    expect(body.utm_campaign).toBe('brand')
    expect(body.utm_content).toBe('ad')
    expect(body.utm_term).toBe('quiz')
    expect(loggerSpy).toHaveBeenCalled()
  })
})
