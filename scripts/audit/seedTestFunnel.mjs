#!/usr/bin/env node

/**
 * Seed a test funnel with 21 steps into Supabase.
 * - Creates a funnel
 * - Inserts component_instances for steps 1..21
 * - New schema first; falls back to legacy if needed
 * - Prints the funnelId at the end
 *
 * Usage: node scripts/audit/seedTestFunnel.mjs [--name "Nome do Funil"]
 */

import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';
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

  try {
    const htmlPath = path.join(process.cwd(), 'apply-migration-web.html');
    if (fs.existsSync(htmlPath)) {
      const content = fs.readFileSync(htmlPath, 'utf8');
      const urlMatch = content.match(/const\s+SUPABASE_URL\s*=\s*['\"]([^'\"]+)['\"]/);
      const keyMatch = content.match(/const\s+SUPABASE_ANON_KEY\s*=\s*['\"]([^'\"]+)['\"]/);
      if (urlMatch && keyMatch) return { url: urlMatch[1], key: keyMatch[1] };
    }
  } catch {}

  throw new Error('Unable to resolve Supabase credentials. Set SUPABASE_URL and SUPABASE_KEY env vars.');
}

function uuid() {
  try { return crypto.randomUUID(); } catch { return 'funnel-' + Date.now().toString(36); }
}

function buildInstancesNew(funnelId, userId) {
  const rows = [];
  for (let step = 1; step <= 21; step++) {
    for (let i = 0; i < 2; i++) {
      const idx = i + 1;
      rows.push({
        funnel_id: funnelId,
        step_number: step,
        order_index: idx,
        instance_key: `step-${String(step).padStart(2,'0')}-blk-${idx}`,
        component_type_key: 'text-inline',
        properties: {
          text: step % 2 === 0 ? 'testes' : 'teste1',
          note: `Seed auto s${step} i${idx}`,
        },
        is_active: true,
        created_by: userId,
      });
    }
  }
  return rows;
}

function buildInstancesLegacy(funnelId, userId) {
  const rows = [];
  for (let step = 1; step <= 21; step++) {
    for (let i = 0; i < 2; i++) {
      rows.push({
        funnel_id: funnelId,
        component_type_id: null,
        config: {
          text: step % 2 === 0 ? 'testes' : 'teste1',
          stepNumber: step,
          blockType: 'text-inline',
        },
        position: i,
        is_active: true,
        created_by: userId,
      });
    }
  }
  return rows;
}

async function main() {
  const args = process.argv.slice(2);
  const nameIdx = args.findIndex(a => a === '--name');
  const funnelName = nameIdx !== -1 ? args[nameIdx + 1] : 'Funnel Seed Test';

  const creds = await resolveSupabaseCreds();
  const supabase = createClient(creds.url, creds.key);

  // Try auth using env to satisfy RLS
  let authedUserId = null;
  try {
    const email = process.env.SUPABASE_EMAIL;
    const password = process.env.SUPABASE_PASSWORD;
    if (email && password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.warn('⚠️ Auth failed for seed:', error.message);
      } else {
        authedUserId = data.user?.id || null;
        console.log('🔑 Auth OK (seed user):', authedUserId || 'unknown');
      }
    } else {
      console.warn('ℹ️ SUPABASE_EMAIL/SUPABASE_PASSWORD not set; seed may fail due to RLS.');
    }
  } catch (e) {
    console.warn('⚠️ Auth exception (seed):', e?.message || e);
  }

  const funnelId = uuid();
  const userId = authedUserId || 'seed-script';

  // Create funnel (minimal payload)
  const { error: fErr } = await supabase.from('funnels').insert({ id: funnelId, name: funnelName, user_id: userId });
  if (fErr) {
    console.error('❌ Failed to create funnel:', fErr.message);
    process.exit(1);
  }

  // Insert instances (new schema first, fallback to legacy)
  const rowsNew = buildInstancesNew(funnelId, userId);
  const { error: iErrNew } = await supabase.from('component_instances').insert(rowsNew);
  if (iErrNew) {
    console.warn('⚠️ New schema insert failed, trying legacy...', iErrNew.message);
    const rowsLegacy = buildInstancesLegacy(funnelId, userId);
    const { error: iErrLegacy } = await supabase.from('component_instances').insert(rowsLegacy);
    if (iErrLegacy) {
      console.error('❌ Legacy insert also failed:', iErrLegacy.message);
      process.exit(1);
    }
  }

  console.log('✅ Seed OK. FunnelId:', funnelId);
}

main().catch(err => { console.error('❌ Seed failed:', err.message); process.exit(1); });
