#!/usr/bin/env node

/**
 * Audit Supabase component_instances consistency per funnel
 * - Lists recent funnels (or a provided --funnel <id>)
 * - For each funnel, groups component_instances by step_number
 * - Checks ordering (order_index starts at 1, contiguous), duplicate instance_key per step,
 *   and unknown component_type_key compared to component_types
 * - Outputs a concise summary to console and saves a JSON report to tmp/supabase_component_audit.json
 *
 * Read-only by default. No writes performed.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to resolve Supabase credentials from env; if missing, parse from repo files with known constants
async function resolveSupabaseCreds() {
  let url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || null;
  let key = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || null;

  if (url && key) return { url, key };

  // Fallback 1: parse src/integrations/supabase/customClient.ts
  try {
    const clientTsPath = path.join(process.cwd(), 'src', 'integrations', 'supabase', 'customClient.ts');
    if (fs.existsSync(clientTsPath)) {
      const content = fs.readFileSync(clientTsPath, 'utf8');
      const urlMatch = content.match(/const\s+SUPABASE_URL\s*=\s*['"]([^'"]+)['"]/);
      const keyMatch = content.match(/const\s+SUPABASE_PUBLISHABLE_KEY\s*=\s*['"]([^'"]+)['"]/);
      if (urlMatch && keyMatch) {
        url = urlMatch[1];
        key = keyMatch[1];
        return { url, key };
      }
    }
  } catch (e) {
    // ignore
  }

  // Fallback 2: parse public/apply-migration-web.html
  try {
    const htmlPath = path.join(process.cwd(), 'apply-migration-web.html');
    if (fs.existsSync(htmlPath)) {
      const content = fs.readFileSync(htmlPath, 'utf8');
      const urlMatch = content.match(/const\s+SUPABASE_URL\s*=\s*['"]([^'"]+)['"]/);
      const keyMatch = content.match(/const\s+SUPABASE_ANON_KEY\s*=\s*['"]([^'"]+)['"]/);
      if (urlMatch && keyMatch) {
        url = urlMatch[1];
        key = keyMatch[1];
        return { url, key };
      }
    }
  } catch (e) {
    // ignore
  }

  throw new Error('Unable to resolve Supabase credentials. Set SUPABASE_URL and SUPABASE_KEY env vars.');
}

// Small util
function ensureArray(x) { return Array.isArray(x) ? x : (x ? [x] : []); }

async function fetchComponentTypes(supabase) {
  const { data, error } = await supabase.from('component_types').select('type_key');
  if (error) throw new Error(`Error fetching component_types: ${error.message}`);
  return new Set(ensureArray(data).map(row => row.type_key));
}

function analyzeStep(stepInstances) {
  const issues = { ordering: [], duplicateInstanceKeys: [], unknownTypes: [] };

  // Validate order_index contiguous starting at 1
  const ordered = [...stepInstances].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  for (let i = 0; i < ordered.length; i++) {
    const expected = i + 1;
    const got = ordered[i].order_index ?? null;
    if (got !== expected) {
      issues.ordering.push({ id: ordered[i].id, got, expected });
    }
  }

  // Duplicate instance_key within the step
  const byKey = new Map();
  for (const inst of stepInstances) {
    const k = inst.instance_key ?? null;
    if (!k) continue;
    byKey.set(k, (byKey.get(k) || 0) + 1);
  }
  for (const [k, cnt] of byKey.entries()) {
    if (cnt > 1) issues.duplicateInstanceKeys.push({ instance_key: k, count: cnt });
  }

  return issues;
}

async function auditFunnel(supabase, funnelId, knownTypes) {
  const { data, error } = await supabase
    .from('component_instances')
    .select('*')
    .eq('funnel_id', funnelId)
    .order('step_number', { ascending: true })
    .order('order_index', { ascending: true });

  if (error) throw new Error(`Error fetching component_instances for funnel ${funnelId}: ${error.message}`);
  const instances = ensureArray(data);

  // Group by step_number
  const byStep = new Map();
  for (const inst of instances) {
    const step = inst.step_number ?? 0;
    if (!byStep.has(step)) byStep.set(step, []);
    byStep.get(step).push(inst);
  }

  const stepSummaries = [];
  let totalIssues = 0;
  for (const [step, arr] of byStep.entries()) {
    const issues = analyzeStep(arr);
    // Unknown types vs knownTypes
    const unknownTypes = [];
    for (const inst of arr) {
      const t = inst.component_type_key ?? inst.component_type_id ?? null;
      if (t && knownTypes && !knownTypes.has(t)) unknownTypes.push(t);
    }
    const uniqueUnknown = Array.from(new Set(unknownTypes));
    if (uniqueUnknown.length) issues.unknownTypes = uniqueUnknown;

    const issueCount = issues.ordering.length + issues.duplicateInstanceKeys.length + (issues.unknownTypes?.length || 0);
    totalIssues += issueCount;
    stepSummaries.push({ step_number: step, count: arr.length, issues, issueCount });
  }

  // Sort steps ascending
  stepSummaries.sort((a, b) => a.step_number - b.step_number);

  return {
    funnelId,
    totalComponents: instances.length,
    steps: stepSummaries,
    totalSteps: stepSummaries.length,
    totalIssues,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const funnelArgIndex = args.findIndex(a => a === '--funnel' || a === '-f');
  const funnelId = funnelArgIndex !== -1 ? args[funnelArgIndex + 1] : null;
  const writeTest = args.includes('--write-test');

  const creds = await resolveSupabaseCreds();
  const supabase = createClient(creds.url, creds.key);

  // Fetch recent funnels (or specific funnel)
  let funnels = [];
  if (funnelId) {
    const { data, error } = await supabase.from('funnels').select('id,name,updated_at').eq('id', funnelId).limit(1);
    if (error) throw new Error(`Error fetching funnel ${funnelId}: ${error.message}`);
    funnels = ensureArray(data);
    if (!funnels.length) {
      console.log(`⚠️ Funnel ${funnelId} não encontrado.`);
      process.exit(2);
    }
  } else {
    const { data, error } = await supabase
      .from('funnels')
      .select('id,name,updated_at')
      .order('updated_at', { ascending: false })
      .limit(5);
    if (error) throw new Error(`Error fetching funnels: ${error.message}`);
    funnels = ensureArray(data);
  }

  if (!funnels.length) {
    console.log('⚠️ Nenhum funnel encontrado na tabela funnels. Tentando identificar via component_instances...');
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
    const ids = Array.from(unique.keys()).slice(0, 5);
    if (ids.length === 0) {
      console.log('⚠️ Nenhum funnel_id encontrado em component_instances.');
      process.exit(0);
    }
    funnels = ids.map(id => ({ id, name: null, updated_at: unique.get(id)?.updated_at || null }));
  }

  console.log(`🔗 Supabase: ${creds.url}`);
  console.log(`🧪 Auditando ${funnels.length} funnel(s)...`);

  const knownTypes = await fetchComponentTypes(supabase).catch(() => null);
  if (!knownTypes) console.log('⚠️ Não foi possível carregar component_types. Pular validação de tipos.');

  const reports = [];
  for (const f of funnels) {
    console.log(`\n📦 Funnel: ${f.id} - ${f.name || '(sem nome)'} (updated_at=${f.updated_at})`);
    const report = await auditFunnel(supabase, f.id, knownTypes);
    reports.push(report);
    console.log(`  • Steps: ${report.totalSteps} | Components: ${report.totalComponents} | Issues: ${report.totalIssues}`);
    // Print steps with issues
    for (const s of report.steps.filter(s => s.issueCount > 0)) {
      console.log(`    - step-${String(s.step_number).padStart(2, '0')}: ${s.issueCount} issue(s)`);
      if (s.issues.ordering.length) console.log(`      · ordering: ${s.issues.ordering.length} problemas`);
      if (s.issues.duplicateInstanceKeys.length) console.log(`      · duplicate instance_key: ${s.issues.duplicateInstanceKeys.length}`);
      if (s.issues.unknownTypes?.length) console.log(`      · unknown types: ${s.issues.unknownTypes.join(', ')}`);
    }
  }

  // Save JSON report
  const outDir = path.join(process.cwd(), 'tmp');
  const outFile = path.join(outDir, 'supabase_component_audit.json');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify({ timestamp: new Date().toISOString(), reports }, null, 2));
  console.log(`\n📄 Relatório salvo em: ${outFile}`);

  // Optional: write test (create+verify+cleanup)
  if (writeTest) {
    console.log('\n✍️  Iniciando write-test (criar, ler e limpar registro de teste)...');
    const testFunnelId = `audit-test-${Date.now()}`;
    // Create funnel
    const { error: fErr } = await supabase.from('funnels').insert({
      id: testFunnelId,
      name: 'Audit Test Funnel',
      status: 'draft',
      user_id: 'audit',
      type: 'quiz',
      category: 'quiz',
      context: 'editor',
    });
    if (fErr) {
      console.log('❌ Falha ao criar funil de teste:', fErr.message);
      return;
    }
    // Insert one component
    const payload = {
      funnel_id: testFunnelId,
      step_number: 1,
      order_index: 1,
      instance_key: `inst-${Date.now()}`,
      component_type_key: knownTypes && knownTypes.size ? Array.from(knownTypes)[0] : 'text-inline',
      properties: { text: 'Audit component' },
    };
    const { data: cData, error: cErr } = await supabase.from('component_instances').insert(payload).select('*').single();
    if (cErr) {
      console.log('❌ Falha ao inserir component_instance:', cErr.message);
    } else {
      console.log('✅ Insert OK, id:', cData.id);
      const { data: check, error: rErr } = await supabase
        .from('component_instances')
        .select('id')
        .eq('funnel_id', testFunnelId)
        .eq('step_number', 1)
        .eq('order_index', 1);
      if (rErr) console.log('❌ Falha ao ler registro inserido:', rErr.message);
      else console.log(`🔎 Read-back OK: ${check?.length || 0} registro(s)`);
    }
    // Cleanup
    await supabase.from('component_instances').delete().eq('funnel_id', testFunnelId);
    await supabase.from('funnels').delete().eq('id', testFunnelId);
    console.log('🧹 Cleanup concluído.');
  }
}

main().catch(err => {
  console.error('❌ Audit failed:', err.message);
  process.exit(1);
});
