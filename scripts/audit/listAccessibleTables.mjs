#!/usr/bin/env node
// Lista tabelas "acessíveis" via API Supabase (PostgREST) com count/head
// - Usa SUPABASE_URL/KEY do customClient.ts ou env
// - Faz login opcional com SUPABASE_EMAIL/SUPABASE_PASSWORD para RLS
// - Para cada tabela candidata, tenta select com HEAD+count e reporta status

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

function resolveSupabaseCreds() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || null
  const key = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || null
  if (url && key) return { url, key }
  try {
    const clientTsPath = path.join(process.cwd(), 'src', 'integrations', 'supabase', 'customClient.ts')
    if (fs.existsSync(clientTsPath)) {
      const content = fs.readFileSync(clientTsPath, 'utf8')
      const urlMatch = content.match(/const\s+SUPABASE_URL\s*=\s*['\"]([^'\"]+)['\"]/)
      const keyMatch = content.match(/const\s+SUPABASE_PUBLISHABLE_KEY\s*=\s*['\"]([^'\"]+)['\"]/)
      if (urlMatch && keyMatch) return { url: urlMatch[1], key: keyMatch[1] }
    }
  } catch {}
  throw new Error('Unable to resolve Supabase credentials.')
}

const candidates = [
  'funnels',
  'component_instances',
  'component_types',
  'funnel_pages',
  'component_configurations',
  'quiz_templates',
  'quiz_sessions',
  'quiz_users',
  'quiz_step_responses',
  'quiz_results',
  'quiz_definitions',
  'user_results',
]

;(async () => {
  const { url, key } = resolveSupabaseCreds()
  const supabase = createClient(url, key)

  // Auth opcional para RLS
  const email = process.env.SUPABASE_EMAIL
  const password = process.env.SUPABASE_PASSWORD
  if (email && password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) console.warn('⚠️ Auth failed:', error.message)
    else console.log('🔑 Auth OK')
  } else {
    console.log('ℹ️ Sem SUPABASE_EMAIL/PASSWORD; RLS pode filtrar resultados')
  }

  const results = []
  for (const table of candidates) {
    let status = { table, accessible: false, count: null, note: '' }
    try {
      // Tenta HEAD com count e uma coluna padrão
      let q = supabase.from(table).select('id', { count: 'exact', head: true })
      let { count, error } = await q
      if (error) {
        // Se coluna id não existir, tenta wildcard
        const r = await supabase.from(table).select('*', { count: 'exact', head: true })
        if (r.error) throw r.error
        status.accessible = true
        status.count = r.count ?? null
      } else {
        status.accessible = true
        status.count = count ?? null
      }
    } catch (e) {
      status.note = e?.message || String(e)
    }
    results.push(status)
  }

  console.log(JSON.stringify({ project: url, results }, null, 2))
})().catch(e => {
  console.error('❌ listAccessibleTables error:', e?.message || e)
  process.exit(1)
})
