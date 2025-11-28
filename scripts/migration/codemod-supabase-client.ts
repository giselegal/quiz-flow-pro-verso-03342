#!/usr/bin/env tsx
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..', '..')

const targets = [
  path.join(root, 'server'),
  path.join(root, 'src'),
]

async function listFiles(dir: string): Promise<string[]> {
  const out: string[] = []
  async function walk(d: string) {
    let entries
    try {
      entries = await fs.readdir(d, { withFileTypes: true })
    } catch {
      return
    }
    for (const e of entries) {
      const full = path.join(d, e.name)
      if (e.isDirectory()) await walk(full)
      else if (e.isFile() && (e.name.endsWith('.ts') || e.name.endsWith('.tsx') || e.name.endsWith('.js'))) {
        out.push(full)
      }
    }
  }
  await walk(dir)
  return out
}

function isServerPath(p: string): boolean {
  return p.includes('/server/')
}

async function processFile(file: string) {
  const src = await fs.readFile(file, 'utf-8')
  if (!src.includes("@supabase/supabase-js")) return

  let changed = src
  // Replace direct createClient import with our wrapper usage
  // Server-side -> supabaseServiceClient
  if (isServerPath(file)) {
    changed = changed
      .replace(/import\s*\{[^}]*createClient[^}]*\}\s*from\s*['"]@supabase\/supabase-js['"];?/g, "import { getSupabaseServiceClient } from '@/services/supabaseServiceClient';")
      .replace(/const\s+([a-zA-Z_$][\w$]*)\s*=\s*createClient\([^\)]*\);?/g, 'const $1 = getSupabaseServiceClient();')
  } else {
    // Client-side -> supabaseClient
    changed = changed
      .replace(/import\s*\{[^}]*createClient[^}]*\}\s*from\s*['"]@supabase\/supabase-js['"];?/g, "import { getSupabaseClient } from '@/services/supabaseClient';")
      .replace(/const\s+([a-zA-Z_$][\w$]*)\s*=\s*createClient\([^\)]*\);?/g, 'const $1 = getSupabaseClient();')
  }

  if (changed !== src) {
    await fs.writeFile(file, changed, 'utf-8')
    console.log(`✔️  Codemod aplicado: ${path.relative(root, file)}`)
  }
}

async function main() {
  for (const dir of targets) {
    const files = await listFiles(dir)
    for (const f of files) {
      await processFile(f)
    }
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
