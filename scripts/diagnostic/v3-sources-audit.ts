#!/usr/bin/env tsx
/*
 * Auditoria de fontes v3 por step
 * - Lista, por step-01..21, quais fontes existem: v3, blocks, template, master
 * - Quando v3 e template coexistem, compara hash/igualdade
 * - Mostra qual fonte será usada com a prioridade atual do loader
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const TEMPLATES = path.join(ROOT, 'public', 'templates');
const BLOCKS = path.join(TEMPLATES, 'blocks');

function exists(p: string) { try { fs.accessSync(p, fs.constants.F_OK); return true; } catch { return false; } }
function read(p: string) { return fs.readFileSync(p, 'utf-8'); }
function sha1(str: string) { return crypto.createHash('sha1').update(str).digest('hex'); }

function stepPaths(stepId: string) {
  return {
    v3: path.join(TEMPLATES, `${stepId}-v3.json`),
    blocks: path.join(BLOCKS, `${stepId}.json`),
    template: path.join(TEMPLATES, `${stepId}-template.json`),
    master: path.join(TEMPLATES, 'quiz21-complete.json'),
  };
}

function choosePrimary(stepId: string) {
  const p = stepPaths(stepId);
  if (exists(p.v3)) return { source: 'v3', file: p.v3 };
  if (exists(p.blocks)) return { source: 'blocks', file: p.blocks };
  if (exists(p.template)) return { source: 'template', file: p.template };
  if (exists(p.master)) return { source: 'master', file: p.master };
  return { source: 'none', file: null as any };
}

async function main() {
  const summary: any = { steps: {}, totals: { both_v3_and_template: 0, only_v3: 0, only_template: 0, only_blocks: 0, none: 0 } };

  for (let i = 1; i <= 21; i++) {
    const stepId = `step-${String(i).padStart(2, '0')}`;
    const p = stepPaths(stepId);
    const has = {
      v3: exists(p.v3),
      blocks: exists(p.blocks),
      template: exists(p.template),
      master: exists(p.master),
    };

    let dup: null | { equal: boolean; v3Hash?: string; templateHash?: string } = null;
    if (has.v3 && has.template) {
      const v3c = read(p.v3);
      const tc = read(p.template);
      dup = { equal: sha1(v3c) === sha1(tc), v3Hash: sha1(v3c), templateHash: sha1(tc) };
      summary.totals.both_v3_and_template++;
    } else if (has.v3) {
      summary.totals.only_v3++;
    } else if (!has.v3 && has.template && !has.blocks) {
      summary.totals.only_template++;
    } else if (has.blocks && !has.v3 && !has.template) {
      summary.totals.only_blocks++;
    } else if (!has.v3 && !has.template && !has.blocks) {
      summary.totals.none++;
    }

    const primary = choosePrimary(stepId);

    summary.steps[stepId] = {
      exists: has,
      duplicate_v3_template: dup,
      primary,
    };
  }

  console.log('=== Auditoria v3 vs outras fontes ===');
  for (const [step, info] of Object.entries(summary.steps) as [string, any][]) {
    const e = info.exists;
    const tags = [
      e.v3 ? 'v3' : '-',
      e.blocks ? 'blocks' : '-',
      e.template ? 'template' : '-',
      e.master ? 'master' : '-',
    ].join(' | ');
    const dup = info.duplicate_v3_template;
    const dupTag = dup ? (dup.equal ? 'dup:equal' : 'dup:diff') : '';
    console.log(`${step} → ${tags} | primary: ${info.primary.source}${dupTag ? ` | ${dupTag}` : ''}`);
  }

  console.log('\n=== Totais ===');
  console.log('v3 e template (ambos):', summary.totals.both_v3_and_template);
  console.log('somente v3:', summary.totals.only_v3);
  console.log('somente template:', summary.totals.only_template);
  console.log('somente blocks:', summary.totals.only_blocks);
  console.log('nenhuma fonte local:', summary.totals.none);
}

main().catch(err => { console.error('Falha na auditoria v3:', err); process.exit(1); });
