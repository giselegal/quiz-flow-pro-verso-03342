/*
  Sanity runner: carregar 21 steps diretamente dos JSONs públicos.
  - Lê /public/templates/blocks/step-XX.json (fonte preferida v3.1)
  - Fallback: /public/templates/step-XX-v3.json
  - Imprime resumo e valida 21 etapas.
*/

import fs from 'node:fs/promises'
import path from 'node:path'

type StepEntry = { id: string; blocks: any[] }

async function readJson(filePath: string): Promise<any | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

async function loadStep(stepId: string, publicDir: string): Promise<StepEntry | null> {
  // 1) Fonte principal: /templates/blocks/step-XX.json
  const blocksPath = path.join(publicDir, 'templates', 'blocks', `${stepId}.json`)
  const dataBlocks = await readJson(blocksPath)
  if (dataBlocks) {
    const blocks = Array.isArray(dataBlocks?.blocks) ? dataBlocks.blocks : (Array.isArray(dataBlocks) ? dataBlocks : [])
    if (blocks.length > 0) return { id: stepId, blocks }
  }

  // 2) Fallback: /templates/step-XX-v3.json (estrutura JSON v3)
  const v3Path = path.join(publicDir, 'templates', `${stepId}-v3.json`)
  const dataV3 = await readJson(v3Path)
  if (dataV3) {
    // aceitar estruturas { sections: [...] } (v3) ou { blocks: [...] }
    const blocks = Array.isArray((dataV3 as any).blocks)
      ? (dataV3 as any).blocks
      : Array.isArray((dataV3 as any).sections)
        ? (dataV3 as any).sections
        : []
    if (blocks.length > 0) return { id: stepId, blocks }
  }

  return null
}

async function main() {
  const publicDir = path.join(process.cwd(), 'public')
  const steps: Record<string, StepEntry> = {}

  for (let i = 1; i <= 21; i++) {
    const stepId = `step-${i.toString().padStart(2, '0')}`
    const entry = await loadStep(stepId, publicDir)
    if (entry) {
      steps[stepId] = entry
    } else {
      console.warn(`[sanity] aviso: não foi possível carregar ${stepId} de JSON público`)
    }
  }

  const keys = Object.keys(steps)
  const sample = keys.slice(0, 5)
  console.log('[sanity] runtime load (public JSON):')
  console.log(' - total steps:', keys.length)
  console.log(' - sample keys:', sample.join(', '))
  console.log(' - step-01 source: public/templates/blocks')

  if (keys.length !== 21) {
    console.error('[sanity] FAIL: esperado 21 steps, obtido', keys.length)
    process.exit(2)
  }
  if (!steps['step-20']) {
    console.error('[sanity] FAIL: faltando step-20')
    process.exit(2)
  }

  console.log('[sanity] PASS: 21 steps carregados de JSON público (blocks/v3)')
}

main().catch((err) => {
  console.error('[sanity] ERROR]:', err)
  process.exit(1)
})
