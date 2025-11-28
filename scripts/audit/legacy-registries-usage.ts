#!/usr/bin/env tsx
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..', '..')

const LEGACY_IMPORTS = [
  '@/core/registry/blockRegistry',
  '@/components/editor/blocks/enhancedBlockRegistry',
  '@/components/editor/quiz/schema/blockRegistry',
  '@/editor/registry/BlockComponentMap',
  '@/editor/registry/BlockRegistry',
]

async function listFiles(dir: string): Promise<string[]> {
  const out: string[] = []
  async function walk(d: string) {
    let entries
    try { entries = await fs.readdir(d, { withFileTypes: true }) } catch { return }
    for (const e of entries) {
      const full = path.join(d, e.name)
      if (e.isDirectory()) await walk(full)
      else if (e.isFile() && (e.name.endsWith('.ts') || e.name.endsWith('.tsx') || e.name.endsWith('.js'))) out.push(full)
    }
  }
  await walk(dir)
  return out
}

async function main() {
  const checkDirs = [path.join(root, 'src')]
  const files = (await Promise.all(checkDirs.map(listFiles))).flat()

  const results: Record<string, string[]> = {}

  for (const file of files) {
    const text = await fs.readFile(file, 'utf-8')
    for (const imp of LEGACY_IMPORTS) {
      if (text.includes(`from '${imp}'`) || text.includes(`from "${imp}"`)) {
        if (!results[imp]) results[imp] = []
        results[imp].push(path.relative(root, file))
      }
    }
  }

  let md = '# Usos de Registries Legados\n\n'
  for (const imp of LEGACY_IMPORTS) {
    const list = results[imp] || []
    md += `- ${imp}: ${list.length} arquivo(s)\n`
    if (list.length) {
      for (const f of list) md += `  - ${f}\n`
    }
  }

  await fs.mkdir(path.join(root, 'reports'), { recursive: true })
  const out = path.join(root, 'reports', 'legacy-registries-usage.md')
  await fs.writeFile(out, md, 'utf-8')
  console.log('Report written to', path.relative(root, out))
}

main().catch(err => { console.error(err); process.exit(1) })
