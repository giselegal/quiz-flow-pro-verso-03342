/*
  Sanity runner: load Quiz runtime templates via QuizEditorBridge.loadForRuntime()
  - Mocks fetch to read from /public/templates/* on disk
  - Prints summary: total steps, sample keys, and source used
*/

import fs from 'node:fs/promises'
import path from 'node:path'

// Minimal Response-like object for our mocked fetch
class FileResponse {
  ok: boolean
  status: number
  private payload: any
  constructor(ok: boolean, status: number, payload?: any) {
    this.ok = ok
    this.status = status
    this.payload = payload
  }
  async json() {
    return this.payload
  }
  async text() {
    return JSON.stringify(this.payload)
  }
}

// Map URL paths to local files under /public
function resolvePublicFile(url: string): string | null {
  const clean = url.replace(/^https?:\/\/localhost(?::\d+)?/, '')
  if (!clean.startsWith('/templates/')) return null
  const publicDir = path.join(process.cwd(), 'public')
  const localPath = path.join(publicDir, clean)
  return localPath
}

// Install mock fetch that reads JSON from /public
// @ts-ignore
globalThis.fetch = (async (url: string) => {
  const file = resolvePublicFile(url)
  if (!file) {
    return new FileResponse(false, 404)
  }
  try {
    const raw = await fs.readFile(file, 'utf-8')
    const data = JSON.parse(raw)
    return new FileResponse(true, 200, data)
  } catch (err) {
    return new FileResponse(false, 500)
  }
}) as any

async function main() {
  // Lazy import after installing fetch
  const { quizEditorBridge } = await import('@/services/QuizEditorBridge')

  const steps = await quizEditorBridge.loadForRuntime()
  const keys = Object.keys(steps)
  const sample = keys.slice(0, 5)

  // Try to detect source preference by checking if step-01 has blocks-origin metadata (best-effort)
  const step01 = steps['step-01']
  const source = step01?.metadata?.source ?? step01?.source ?? 'unknown'

  console.log('[sanity] runtime load:')
  console.log(' - total steps:', keys.length)
  console.log(' - sample keys:', sample.join(', '))
  console.log(' - step-01 source:', source)

  // Quick structural checks
  if (keys.length !== 21) {
    console.error('[sanity] FAIL: expected 21 steps, got', keys.length)
    process.exit(2)
  }
  if (!steps['step-20']) {
    console.error('[sanity] FAIL: missing step-20')
    process.exit(2)
  }

  console.log('[sanity] PASS: runtime templates loaded via blocks-first fallback')
}

main().catch((err) => {
  console.error('[sanity] ERROR:', err)
  process.exit(1)
})
