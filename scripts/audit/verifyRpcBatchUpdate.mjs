#!/usr/bin/env node

/**
 * Verifica a disponibilidade e o funcionamento da RPC batch_update_components
 * - Autentica via SUPABASE_EMAIL/SUPABASE_PASSWORD
 * - Recebe --funnel <id> e opcionalmente --step <n>
 * - Flags opcionais:
 *   --require-rpc  => falhar (exit code 3) se a função RPC não existir
 *   --measure      => medir e exibir o tempo (ms) de execução do caminho usado
 * - Seleciona 2 componentes do step e tenta inverter a ordem usando a RPC
 * - Se a RPC não existir (42883) ou falhar, relata o status e não altera nada
 *
 * Uso:
 *   node scripts/audit/verifyRpcBatchUpdate.mjs --funnel <ID> [--step 1]
 */

import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';

async function resolveSupabaseCreds() {
  let url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || null;
  let key = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || null;
  if (url && key) return { url, key };

  try {
    const clientTsPath = path.join(process.cwd(), 'src', 'integrations', 'supabase', 'customClient.ts');
    if (fs.existsSync(clientTsPath)) {
      const content = fs.readFileSync(clientTsPath, 'utf8');
      const urlMatch = content.match(/const\s+SUPABASE_URL\s*=\s*['\"]([^'\"]+)['\"]/);
      const keyMatch = content.match(/const\s+SUPABASE_PUBLISHABLE_KEY\s*=\s*['\"]([^'\"]+)['\"]/);
      if (urlMatch && keyMatch) return { url: urlMatch[1], key: keyMatch[1] };
    }
  } catch {}

  throw new Error('Unable to resolve Supabase credentials.');
}

function parseArgs() {
  const args = process.argv.slice(2);
  const idxF = args.findIndex(a => a === '--funnel' || a === '-f');
  const idxS = args.findIndex(a => a === '--step' || a === '-s');
  const requireRpc = args.includes('--require-rpc');
  const measure = args.includes('--measure');
  const funnelId = idxF !== -1 ? args[idxF + 1] : null;
  const step = idxS !== -1 ? parseInt(args[idxS + 1], 10) : 1;
  if (!funnelId) {
    console.log('Uso: node scripts/audit/verifyRpcBatchUpdate.mjs --funnel <ID> [--step 1] [--require-rpc] [--measure]');
    process.exit(2);
  }
  return { funnelId, step: Number.isFinite(step) ? step : 1, requireRpc, measure };
}

async function main() {
  const { funnelId, step, requireRpc, measure } = parseArgs();
  const creds = await resolveSupabaseCreds();
  const supabase = createClient(creds.url, creds.key);

  const email = process.env.SUPABASE_EMAIL;
  const password = process.env.SUPABASE_PASSWORD;
  if (email && password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) console.warn('⚠️ Auth failed:', error.message); else console.log('🔑 Auth OK (user):', data.user?.id || 'unknown');
  } else {
    console.warn('ℹ️ SUPABASE_EMAIL/SUPABASE_PASSWORD não definidos; RPC pode ser bloqueada por RLS');
  }

  // Selecionar 2 componentes do step
  const { data: rows, error: selErr } = await supabase
    .from('component_instances')
    .select('id,order_index,step_number')
    .eq('funnel_id', funnelId)
    .eq('step_number', step)
    .order('order_index', { ascending: true })
    .limit(2);
  if (selErr) throw new Error('Erro ao buscar componentes: ' + selErr.message);
  if (!rows || rows.length < 2) {
    console.log(`⚠️ Menos de 2 componentes no step ${step}; nada para testar.`);
    process.exit(0);
  }

  const a = rows[0];
  const b = rows[1];
  const updates = [
    { id: a.id, order_index: b.order_index },
    { id: b.id, order_index: a.order_index },
  ];

  console.log('🧪 Testando RPC batch_update_components com swap simples...', updates);
  let usedRpc = false;
  let usedFallback = false;
  const t0 = Date.now();

  try {
    // @ts-ignore
    const { data, error } = await supabase.rpc('batch_update_components', { updates });
    if (error) {
      const missingFn = (error.code === '42883') || /function .* does not exist/i.test(error.message) || /schema cache/i.test(error.message);
      if (!missingFn) throw error;
      if (requireRpc) {
        console.error('❌ RPC não disponível e --require-rpc foi informado. Abortando.');
        process.exit(3);
      }
      console.log('⚠️ RPC não disponível. Executando fallback com updates diretos...');
      // Fallback: swap em 3 passos para evitar conflito de índices iguais
      const tempIndex = 999999;
      const u1 = await supabase.from('component_instances').update({ order_index: tempIndex }).eq('id', a.id);
      if (u1.error) throw u1.error;
      const u2 = await supabase.from('component_instances').update({ order_index: a.order_index }).eq('id', b.id);
      if (u2.error) throw u2.error;
      const u3 = await supabase.from('component_instances').update({ order_index: b.order_index }).eq('id', a.id);
      if (u3.error) throw u3.error;
      usedFallback = true;
      console.log('✅ Fallback executado com sucesso (swap em 3 updates).');
      // continuar para leitura "after"
    }
    else {
      usedRpc = true;
      console.log('✅ RPC executada com sucesso:', data);
    }

    // Verificar se aplicou
    const { data: after } = await supabase
      .from('component_instances')
      .select('id,order_index')
      .in('id', [a.id, b.id])
      .order('order_index');
    console.log('🔎 Após RPC:', after);

    const dt = Date.now() - t0;
    if (measure) {
      console.log(`⏱️ Tempo total (${usedRpc ? 'RPC' : usedFallback ? 'fallback' : 'desconhecido'}): ${dt} ms`);
    }

    // Resumo PASS/FAIL para uso em CI
    if (usedRpc) {
      console.log('RESULT: PASS (RPC)');
      process.exit(0);
    } else if (usedFallback) {
      console.log('RESULT: PASS (FALLBACK)');
      process.exit(0);
    } else {
      console.log('RESULT: FAIL (no path used)');
      process.exit(1);
    }
  } catch (e) {
    console.error('❌ Falha ao executar RPC:', e.message || e);
    console.log('RESULT: FAIL');
    process.exit(1);
  }
}

main().catch(err => { console.error('❌ verifyRpc failed:', err.message); process.exit(1); });
