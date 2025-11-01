#!/usr/bin/env node
// Lista a quantidade de componentes por step para um funnel, ajudando a escolher um step para o verificador RPC
// Uso:
//   node scripts/audit/listStepCounts.mjs --funnel <UUID>
// Opcional: SUPABASE_EMAIL/SUPABASE_PASSWORD para autenticar sob RLS

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

function resolveSupabaseCreds() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || null
  const key = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || null
  if (url && key) return { url, key }
  const p = path.join(process.cwd(), 'src', 'integrations', 'supabase', 'customClient.ts')
  if (fs.existsSync(p)) {
    const c = fs.readFileSync(p, 'utf8')
    const u = c.match(/const\s+SUPABASE_URL\s*=\s*['\"]([^'\"]+)['\"]/)
    const k = c.match(/const\s+SUPABASE_PUBLISHABLE_KEY\s*=\s*['\"]([^'\"]+)['\"]/)
    if (u && k) return { url: u[1], key: k[1] }
  }
  throw new Error('Credenciais do Supabase não encontradas.')
}

function parseArgs() {
  const args = process.argv.slice(2)
  const idx = args.findIndex(a => a === '--funnel' || a === '-f')
  const funnelId = idx !== -1 ? args[idx+1] : null
  if (!funnelId) {
    console.log('Uso: node scripts/audit/listStepCounts.mjs --funnel <UUID>')
    process.exit(2)
  }
  return { funnelId }
}

;(async () => {
  const { funnelId } = parseArgs()
  const { url, key } = resolveSupabaseCreds()
  const supabase = createClient(url, key)

  const email = process.env.SUPABASE_EMAIL
  const password = process.env.SUPABASE_PASSWORD
  if (email && password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) console.warn('⚠️ Auth failed:', error.message)
    else console.log('🔑 Auth OK')
  } else {
    console.log('ℹ️ Sem SUPABASE_EMAIL/PASSWORD; RLS pode ocultar registros')
  }

  const { data, error } = await supabase
    .from('component_instances')
    .select('id, step_number', { head: false })
    .eq('funnel_id', funnelId)

  if (error) {
    console.error('❌ Erro ao buscar component_instances:', error.message)
    process.exit(1)
  }

  const counts = new Map()
  for (const r of data || []) {
    const k = r.step_number ?? 0
    counts.set(k, (counts.get(k) || 0) + 1)
  }

  const items = Array.from(counts.entries()).sort((a,b)=>a[0]-b[0]).map(([step, count])=>({ step_number: step, count }))
  console.log('Resumo por step:', items)

  const best = items.filter(i=>i.count>=2).sort((a,b)=>b.count-a.count)[0]
  if (best) console.log(`Sugerido: step ${best.step_number} (count=${best.count})`)
  else console.log('Nenhum step com >=2 componentes encontrado.')
})().catch(e => { console.error('❌ listStepCounts error:', e?.message || e); process.exit(1) })
