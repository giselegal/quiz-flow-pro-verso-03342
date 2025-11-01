#!/usr/bin/env node
// Remove um funil e seus component_instances (seguro por RLS)
// Uso:
//   node scripts/audit/cleanupFunnel.mjs --funnel <UUID>
// Env opcionais para autenticar (RLS):
//   SUPABASE_URL, SUPABASE_ANON_KEY (obrigatórios)
//   SUPABASE_EMAIL, SUPABASE_PASSWORD (opcional: login por email/senha)

import { createClient } from '@supabase/supabase-js'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const argv = yargs(hideBin(process.argv))
  .option('funnel', { type: 'string', demandOption: true, describe: 'UUID do funil a remover' })
  .help()
  .parse()

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY
const SUPABASE_EMAIL = process.env.SUPABASE_EMAIL
const SUPABASE_PASSWORD = process.env.SUPABASE_PASSWORD

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórios no ambiente.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function ensureAuth() {
  if (SUPABASE_EMAIL && SUPABASE_PASSWORD) {
    const { data, error } = await supabase.auth.signInWithPassword({ email: SUPABASE_EMAIL, password: SUPABASE_PASSWORD })
    if (error) {
      console.error('Falha no login:', error.message)
      process.exit(1)
    }
    console.log('Auth OK (cleanup user):', data.user?.id)
  } else {
    console.log('Sem login por email/senha; usando ANON. Se RLS exigir usuário, defina SUPABASE_EMAIL/PASSWORD.')
  }
}

async function cleanupFunnel(funnelId) {
  // Primeiro apaga component_instances (cascata lógica para respeitar RLS)
  const delCI = await supabase
    .from('component_instances')
    .delete()
    .eq('funnel_id', funnelId)
    .select('id')

  if (delCI.error) {
    console.error('Erro ao deletar component_instances:', delCI.error.message)
    process.exit(1)
  }

  console.log(`Componentes removidos: ${delCI.data?.length ?? 0}`)

  // Depois apaga o funil
  const delF = await supabase
    .from('funnels')
    .delete()
    .eq('id', funnelId)
    .select('id')

  if (delF.error) {
    console.error('Erro ao deletar funnel:', delF.error.message)
    process.exit(1)
  }

  console.log(`Funis removidos: ${delF.data?.length ?? 0}`)
}

;(async () => {
  const funnelId = argv.funnel
  await ensureAuth()
  await cleanupFunnel(funnelId)
  console.log('Cleanup concluído com sucesso.')
})()
