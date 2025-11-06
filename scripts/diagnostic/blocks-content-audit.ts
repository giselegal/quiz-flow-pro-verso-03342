#!/usr/bin/env tsx
/*
 * Auditoria de Conteúdo de Blocos por Step
 * - Verifica campos mínimos esperados por tipo
 * - Lista problemas por step e por blockId
 */

import fs from 'node:fs';
import path from 'node:path';

interface Block { id: string; type: string; content?: any; properties?: any; }

const ROOT = process.cwd();
const PUBLIC_TEMPLATES = path.join(ROOT, 'public', 'templates');

function fileExists(p: string) { try { fs.accessSync(p, fs.constants.F_OK); return true; } catch { return false; } }
function readJSON<T = any>(p: string): T | null {
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')) as T; } catch { return null; }
}

async function loadStepBlocks(stepId: string): Promise<Block[] | null> {
  const perStep = path.join(PUBLIC_TEMPLATES, `${stepId}-v3.json`);
  if (fileExists(perStep)) {
    const data = readJSON<{ blocks?: Block[] }>(perStep);
    if (Array.isArray(data?.blocks)) return data!.blocks!;
    if (Array.isArray((data as any))) return (data as any as Block[]);
  }
  const perStepLegacy = path.join(PUBLIC_TEMPLATES, `${stepId}-template.json`);
  if (fileExists(perStepLegacy)) {
    const data = readJSON<{ blocks?: Block[] }>(perStepLegacy);
    if (Array.isArray(data?.blocks)) return data!.blocks!;
  }
  const master = path.join(PUBLIC_TEMPLATES, 'quiz21-complete.json');
  if (fileExists(master)) {
    const data = readJSON<any>(master);
    const step = data?.steps?.[stepId];
    if (Array.isArray(step)) return step as Block[];
    if (Array.isArray(step?.blocks)) return step.blocks as Block[];
  }
  return null;
}

function missingFieldsFor(block: Block): string[] {
  const t = String(block.type);
  const c = block.content || {};
  const p = block.properties || {};
  const miss: string[] = [];

  // Targets principais
  if (t === 'result-image') {
    if (!(c.imageUrl || c.src || p.url)) miss.push('content.imageUrl|content.src|properties.url');
  }
  if (t === 'result-description') {
    if (!c.text) miss.push('content.text');
  }
  if (t === 'result-secondary-styles') {
    if (!Array.isArray(c.styles) || c.styles.length === 0) miss.push('content.styles[]');
  }
  if (t === 'result-share') {
    if (!Array.isArray(c.platforms) || c.platforms.length === 0) miss.push('content.platforms[]');
    // message é opcional
  }
  if (t === 'question-hero') {
    if (!(c.questionText || c.text)) miss.push('content.questionText|content.text');
  }

  // Heurísticas genéricas
  if (/question-(title|text)/.test(t)) {
    if (!c.text) miss.push('content.text');
  }
  if (t === 'options-grid') {
    if (!Array.isArray(c.options) || c.options.length === 0) miss.push('content.options[]');
  }
  if (/intro-(title|description)/.test(t)) {
    if (!c.text) miss.push('content.text');
  }
  if (t === 'intro-image') {
    if (!(c.src || c.imageUrl || p.url)) miss.push('content.src|content.imageUrl|properties.url');
  }
  if (/transition-(title|text)/.test(t)) {
    if (!c.text) miss.push('content.text');
  }

  return miss;
}

async function main() {
  const problemsByStep: Record<string, Array<{ id: string; type: string; missing: string[] }>> = {};
  const counters: Record<string, number> = {};

  for (let i = 1; i <= 21; i++) {
    const stepId = `step-${String(i).padStart(2, '0')}`;
    const blocks = (await loadStepBlocks(stepId)) || [];
    for (const b of blocks) {
      const missing = missingFieldsFor(b);
      if (missing.length) {
        problemsByStep[stepId] ||= [];
        problemsByStep[stepId].push({ id: b.id, type: b.type, missing });
        counters[b.type] = (counters[b.type] || 0) + 1;
      }
    }
  }

  console.log('=== Auditoria de Conteúdo (mínimos por tipo) ===');
  const steps = Object.keys(problemsByStep);
  if (steps.length === 0) {
    console.log('Sem problemas encontrados.');
  } else {
    for (const stepId of steps.sort()) {
      console.log(`\n${stepId}`);
      for (const item of problemsByStep[stepId]) {
        console.log(`- ${item.id} [${item.type}] → faltando: ${item.missing.join(', ')}`);
      }
    }
  }

  console.log('\n=== Resumo ===');
  const totalIssues = Object.values(problemsByStep).reduce((acc, arr) => acc + arr.length, 0);
  console.log('Total de blocos com pendências:', totalIssues);
  if (totalIssues > 0) {
    console.log('Top tipos com pendências:');
    const sorted = Object.entries(counters).sort((a, b) => b[1] - a[1]).slice(0, 15);
    for (const [type, count] of sorted) console.log(`  - ${type}: ${count}`);
  }
}

main().catch(err => { console.error('Falha na auditoria de conteúdo:', err); process.exit(1); });
