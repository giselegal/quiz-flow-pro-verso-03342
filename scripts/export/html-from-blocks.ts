/**
 * Exporta HTML estático a partir dos JSONs de blocos (v3.1) em public/templates/blocks.
 * Saída: public/templates/html-export/step-XX.html
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import Mustache from 'mustache'

type Block = {
  id: string
  type: string
  order?: number
  content?: Record<string, any>
  properties?: Record<string, any>
}

type StepFile = {
  id?: string
  title?: string
  blocks?: Block[]
}

const ROOT = process.cwd()
const PUBLIC_DIR = path.join(ROOT, 'public')
const BLOCKS_DIR = path.join(PUBLIC_DIR, 'templates', 'blocks')
const PARTIALS_DIR = path.join(PUBLIC_DIR, 'templates', 'html')
const OUTPUT_DIR = path.join(PUBLIC_DIR, 'templates', 'html-export')

const TEMPLATE_MAP: Record<string, string> = {
  'text-inline': 'text-inline.html',
  'button-inline': 'button-inline.html',
  'image-inline': 'image-inline.html',
  'image-display-inline': 'image-inline.html',
  'heading-inline': 'heading-inline.html',
  'divider-inline': 'divider-inline.html',
  'spacer-inline': 'spacer-inline.html',
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true })
}

async function readJson(filePath: string): Promise<any | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

async function loadPartials(): Promise<Record<string, string>> {
  const acc: Record<string, string> = {}
  try {
    const entries = await fs.readdir(PARTIALS_DIR)
    for (const file of entries) {
      if (file.endsWith('.html')) {
        const tpl = await fs.readFile(path.join(PARTIALS_DIR, file), 'utf-8')
        acc[file] = tpl
      }
    }
  } catch {
    // sem parciais, sem erro
  }
  return acc
}

function computeInlineStyle(content?: Record<string, any>): string {
  if (!content) return ''
  const map: Record<string, string> = {}
  const known = ['background', 'backgroundColor', 'color', 'padding', 'margin', 'fontSize', 'textAlign']
  for (const k of known) {
    if (content[k] != null) map[k] = String(content[k])
  }
  return Object.entries(map)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${v}`)
    .join('; ')
}

function mapDataForTemplate(block: Block) {
  const c = block.content || {}
  const p = (block.properties as any)?.props || {}
  const base = {
    className: c.className || '',
    style: computeInlineStyle(c),
  }

  switch (block.type) {
    case 'text-inline':
      return { ...base, content: c.html || c.text || '' }
    case 'button-inline':
      return {
        ...base,
        text: p.text || c.text || 'Continuar',
        buttonStyle: p.variant || 'btn-primary',
        buttonSize: p.size || 'btn-md',
        disabled: !!p.disabled,
      }
    case 'image-inline':
    case 'image-display-inline':
      return {
        ...base,
        src: c.src || c.url || '',
        alt: c.alt || '',
        width: c.width,
        height: c.height,
        containerPosition: c.position || '',
      }
    case 'heading-inline':
      return { ...base, text: c.text || c.title || 'Título', level: c.level || 2 }
    case 'divider-inline':
      return { ...base }
    case 'spacer-inline':
      return { ...base, height: c.height || '1rem' }
    default:
      return { ...base, __raw: JSON.stringify(block, null, 2) }
  }
}

function renderBlock(block: Block, partials: Record<string, string>): string {
  const name = TEMPLATE_MAP[block.type]
  if (name && partials[name]) {
    return Mustache.render(partials[name], mapDataForTemplate(block))
  }
  // Fallback genérico
  const raw = (mapDataForTemplate(block) as any).__raw || ''
  return `<section data-block-id="${block.id}" data-block-type="${block.type}" style="${computeInlineStyle(block.content)}">
    <pre style="white-space: pre-wrap; background:#f8fafc; padding:8px; border-radius:6px; font-size:12px;">${raw}</pre>
  </section>`
}

function renderDocument(stepId: string, title: string | undefined, bodyHtml: string) {
  return `<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title || stepId}</title>
  <style>
    body{margin:0;padding:16px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Arial}
    .container{max-width:960px;margin:0 auto}
    .btn{display:inline-flex;align-items:center;justify-content:center;border-radius:8px;padding:10px 16px;border:1px solid #0ea5e9;background:#0284c7;color:#fff}
    .prose{line-height:1.6}
    .grid{display:grid;gap:16px}
  </style>
  </head>
<body>
  <main class="container" data-step-id="${stepId}">
    ${bodyHtml}
  </main>
  </body>
  </html>`
}

async function processStep(stepId: string, partials: Record<string, string>) {
  const filePath = path.join(BLOCKS_DIR, `${stepId}.json`)
  const data = (await readJson(filePath)) as StepFile | null
  if (!data) throw new Error(`Arquivo não encontrado ou inválido: ${filePath}`)

  const blocks = Array.isArray((data as any).blocks) ? (data as any).blocks as Block[] : []
  const sorted = blocks.slice().sort((a, b) => (a.order || 0) - (b.order || 0))
  const rendered = sorted.map(b => renderBlock(b, partials)).join('\n')
  const html = renderDocument(stepId, data.title, rendered)
  const outPath = path.join(OUTPUT_DIR, `${stepId}.html`)
  await fs.writeFile(outPath, html, 'utf-8')
  return outPath
}

async function main() {
  await ensureDir(OUTPUT_DIR)
  const partials = await loadPartials()

  const results: string[] = []
  for (let i = 1; i <= 21; i++) {
    const stepId = `step-${i.toString().padStart(2, '0')}`
    const out = await processStep(stepId, partials)
    results.push(out)
  }
  console.log('✅ HTML export concluído. Arquivos gerados:')
  for (const r of results) console.log(' -', path.relative(PUBLIC_DIR, r))
}

main().catch(err => {
  console.error('❌ Falha ao exportar HTML:', err)
  process.exit(1)
})
