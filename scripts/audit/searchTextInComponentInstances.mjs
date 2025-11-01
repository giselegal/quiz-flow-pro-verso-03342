#!/usr/bin/env node

/**
 * Search terms inside Supabase component_instances properties/config
 * - Usage: node scripts/audit/searchTextInComponentInstances.mjs --q testes --q teste1 [--funnel <id>] [--limit 5]
 * - If no funnel is provided, it searches recent funnels (limit default 5)
 * - Outputs a concise console summary and writes tmp/supabase_component_search.json
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

function ensureArray(x) { return Array.isArray(x) ? x : (x ? [x] : []); }

function containsAnyTerms(row, terms) {
  try {
    const props = row?.properties ? JSON.stringify(row.properties).toLowerCase() : '';
    const cfg = row?.config ? JSON.stringify(row.config).toLowerCase() : '';
    return terms.some(t => props.includes(t) || cfg.includes(t));
  } catch {
    return false;
  }
}

async function listRecentFunnels(supabase, limit) {
  const { data, error } = await supabase
    .from('funnels')
    .select('id,name,updated_at')
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(`Error fetching funnels: ${error.message}`);
  return ensureArray(data);
}

async function main() {
  const args = process.argv.slice(2);
  const funnelIdx = args.findIndex(a => a === '--funnel' || a === '-f');
  const funnelId = funnelIdx !== -1 ? args[funnelIdx + 1] : null;
  const limitIdx = args.findIndex(a => a === '--limit' || a === '-l');
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) || 5 : 5;
  const termArgs = args.filter((a, i) => a === '--q' && typeof args[i+1] === 'string').map((_, i, arr) => args[args.indexOf('--q', (arr._lastIndex = (arr._lastIndex || -1) + 1)) + 1]);
  // Alternative robust parse for multiple --q
  const terms = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--q' && args[i+1]) terms.push(args[i+1]);
  }
  if (!terms.length) {
    console.log('Usage: node scripts/audit/searchTextInComponentInstances.mjs --q <term> [--q <term2>] [--funnel <id>]');
    process.exit(2);
  }
  const q = terms.map(t => String(t).toLowerCase());

  const creds = await resolveSupabaseCreds();
  const supabase = createClient(creds.url, creds.key);

  let funnels = [];
  if (funnelId) {
    const { data, error } = await supabase.from('funnels').select('id,name,updated_at').eq('id', funnelId).limit(1);
    if (error) throw new Error(`Error fetching funnel ${funnelId}: ${error.message}`);
    funnels = ensureArray(data);
    if (!funnels.length) {
      console.log(`⚠️ Funnel ${funnelId} não encontrado.`);
      process.exit(0);
    }
  } else {
    funnels = await listRecentFunnels(supabase, limit);
    if (!funnels.length) {
      console.log('⚠️ Nenhum funnel encontrado. Tentando identificar via component_instances...');
      const { data: ci, error: ciErr } = await supabase
        .from('component_instances')
        .select('funnel_id, updated_at')
        .not('funnel_id', 'is', null);
      if (ciErr) throw new Error(`Error fetching component_instances for fallback: ${ciErr.message}`);
      const unique = new Map();
      for (const row of ensureArray(ci)) {
        if (!row.funnel_id) continue;
        const prev = unique.get(row.funnel_id);
        if (!prev || (row.updated_at && row.updated_at > prev.updated_at)) unique.set(row.funnel_id, row);
      }
      const ids = Array.from(unique.keys()).slice(0, limit);
      funnels = ids.map(id => ({ id, name: null, updated_at: unique.get(id)?.updated_at || null }));
      if (!funnels.length) {
        console.log('⚠️ Nenhum funnel_id encontrado em component_instances.');
        process.exit(0);
      }
    }
  }

  console.log(`🔎 Procurando termos ${terms.map(t => '"'+t+'"').join(', ')} em ${funnels.length} funil(is)...`);

  const output = [];
  for (const f of funnels) {
    const { data, error } = await supabase
      .from('component_instances')
      .select('id,funnel_id,step_number,order_index,instance_key,component_type_key,properties,config,updated_at')
      .eq('funnel_id', f.id)
      .order('step_number', { ascending: true })
      .order('order_index', { ascending: true });
    if (error) throw new Error(`Error fetching component_instances for funnel ${f.id}: ${error.message}`);
    const rows = ensureArray(data);
    const matches = rows.filter(r => containsAnyTerms(r, q));

    const grouped = {};
    for (const m of matches) {
      const step = m.step_number ?? 0;
      if (!grouped[step]) grouped[step] = [];
      grouped[step].push({
        id: m.id,
        order_index: m.order_index,
        instance_key: m.instance_key,
        type: m.component_type_key,
        updated_at: m.updated_at,
      });
    }

    const summary = {
      funnelId: f.id,
      name: f.name || null,
      totalComponents: rows.length,
      totalMatches: matches.length,
      steps: Object.keys(grouped).sort((a,b)=>a-b).map(k => ({ step_number: Number(k), count: grouped[k].length, items: grouped[k] })),
    };
    output.push(summary);

    console.log(`\n📦 Funnel ${f.id} - ${f.name || '(sem nome)'} | Components: ${rows.length} | Matches: ${matches.length}`);
    for (const s of summary.steps) {
      console.log(`  - step-${String(s.step_number).padStart(2,'0')}: ${s.count} match(es)`);
    }
  }

  const outDir = path.join(process.cwd(), 'tmp');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'supabase_component_search.json');
  fs.writeFileSync(outFile, JSON.stringify({ timestamp: new Date().toISOString(), terms, results: output }, null, 2));
  console.log(`\n📄 Relatório salvo em: ${outFile}`);
}

main().catch(err => {
  console.error('❌ Search failed:', err.message);
  process.exit(1);
});
