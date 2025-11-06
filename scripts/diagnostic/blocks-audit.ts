#!/usr/bin/env tsx
/*
 * Auditoria de Blocos por Step e Registro
 * - Lista blocos por step (1..21) a partir de public/templates
 * - Para cada tipo, informa: registrado (sim/não), modo (SIMPLE json/html vs COMPLEX tsx),
 *   template HTML existente (se SIMPLE), carregamento lazy (ok/erro), e tentativa de SSR opcional
 */

import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Block } from '../../src/types/editor';
import { isSimpleBlock, isComplexBlock, getTemplatePath, getComponentPath } from '../../src/config/block-complexity-map';
import { blockRegistry } from '../../src/registry/UnifiedBlockRegistry';

const ROOT = process.cwd();
const PUBLIC_TEMPLATES = path.join(ROOT, 'public', 'templates');

function fileExists(p: string) {
  try { fs.accessSync(p, fs.constants.F_OK); return true; } catch { return false; }
}

function readJSON<T = any>(p: string): T | null {
  try {
    const raw = fs.readFileSync(p, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function loadStepBlocks(stepId: string): Promise<Block[] | null> {
  // 1) Preferir step-XX-v3.json
  const perStep = path.join(PUBLIC_TEMPLATES, `${stepId}-v3.json`);
  if (fileExists(perStep)) {
    const data = readJSON<{ blocks?: Block[] }>(perStep);
    if (Array.isArray(data?.blocks)) return data!.blocks!;
    if (Array.isArray((data as any))) return (data as any as Block[]);
  }

  // 2) step-XX-template.json
  const perStepLegacy = path.join(PUBLIC_TEMPLATES, `${stepId}-template.json`);
  if (fileExists(perStepLegacy)) {
    const data = readJSON<{ blocks?: Block[] }>(perStepLegacy);
    if (Array.isArray(data?.blocks)) return data!.blocks!;
  }

  // 3) Master quiz21-complete.json
  const master = path.join(PUBLIC_TEMPLATES, 'quiz21-complete.json');
  if (fileExists(master)) {
    const data = readJSON<any>(master);
    const step = data?.steps?.[stepId];
    if (Array.isArray(step)) return step as Block[];
    if (Array.isArray(step?.blocks)) return step.blocks as Block[];
  }

  return null;
}

function blockStub(type: string): Block {
  return {
    id: `${type}-stub`,
    type: type as any,
    content: {},
    properties: {},
  } as any;
}

async function auditType(type: string) {
  const simple = isSimpleBlock(type);
  const complex = isComplexBlock(type);
  const has = blockRegistry.has(type);
  const isCritical = (blockRegistry as any).isCritical?.(type) || false;
  const template = simple ? getTemplatePath(type) : null;
  const templatePath = template ? path.join(PUBLIC_TEMPLATES, 'html', template) : null;
  const templateExists = templatePath ? fileExists(templatePath) : false;
  const componentPath = complex ? getComponentPath(type) : null;

  let lazyLoad: 'ok' | 'skip' | 'error' = 'skip';
  let render: 'ok' | 'skip' | 'error' = 'skip';
  let errorMsg: string | undefined;

  try {
    if (has) {
      // Forçar resolução (inclusive lazy)
      const Comp = await blockRegistry.getComponentAsync(type);
      lazyLoad = 'ok';

      // Apenas tentar SSR para componentes complexos; blocos simples usam JSONTemplateRenderer no runtime, mantemos como skip
      if (!simple && typeof Comp === 'function') {
        try {
          const element = React.createElement(Comp as any, { block: blockStub(type), isPreviewing: true });
          renderToStaticMarkup(element);
          render = 'ok';
        } catch (err: any) {
          render = 'error';
          errorMsg = `[render] ${err?.message || String(err)}`;
        }
      }
    }
  } catch (err: any) {
    lazyLoad = 'error';
    errorMsg = `[load] ${err?.message || String(err)}`;
  }

  return {
    type,
    registered: has,
    critical: isCritical,
    mode: simple ? 'SIMPLE(json/html)' : 'COMPLEX(tsx)',
    template,
    templateExists,
    componentPath,
    lazyLoad,
    render,
    error: errorMsg,
  };
}

async function main() {
  const results: any = { steps: {}, types: {} };

  // Passo 1: varrer steps 1..21
  const allTypes = new Set<string>();
  for (let i = 1; i <= 21; i++) {
    const stepId = `step-${String(i).padStart(2, '0')}`;
    const blocks = await loadStepBlocks(stepId);
    const types = Array.from(new Set((blocks || []).map(b => String(b.type))));
    results.steps[stepId] = {
      count: blocks?.length || 0,
      types,
      missing: (blocks || []).filter(b => !b.type).length,
    };
    types.forEach(t => allTypes.add(t));
  }

  // Passo 2: auditar cada tipo encontrado (e incluir alguns críticos do registry)
  const registryTypes = (blockRegistry.getAllTypes?.() || []) as string[];
  registryTypes.forEach(t => allTypes.add(t));

  const typesArray = Array.from(allTypes).sort();
  const audits = await Promise.all(typesArray.map(t => auditType(t)));
  for (const a of audits) {
    results.types[a.type] = a;
  }

  // Resumo
  const totals = {
    stepsWithBlocks: Object.values(results.steps).filter((s: any) => s.count > 0).length,
    totalTypes: typesArray.length,
    notRegistered: audits.filter(a => !a.registered).map(a => a.type),
    lazyErrors: audits.filter(a => a.lazyLoad === 'error').map(a => ({ type: a.type, error: a.error })),
    renderErrors: audits.filter(a => a.render === 'error').map(a => ({ type: a.type, error: a.error })),
    missingTemplates: audits.filter(a => a.mode.startsWith('SIMPLE') && a.template && !a.templateExists).map(a => ({ type: a.type, template: a.template })),
  };

  console.log('=== Blocos por Step (1..21) ===');
  for (const [stepId, info] of Object.entries(results.steps) as [string, any][]) {
    console.log(stepId, `→ ${info.count} blocos`, (info.types && info.types.length) ? `| tipos: ${info.types.join(', ')}` : '| (vazio)');
  }

  console.log('\n=== Auditoria de Tipos ===');
  audits.forEach(a => {
    const flags = [
      a.registered ? 'reg' : 'NO-REG',
      a.critical ? 'critical' : 'lazy',
      a.mode,
      a.mode.startsWith('SIMPLE') ? (a.templateExists ? 'html:ok' : `html:MISS(${a.template})`) : (a.componentPath ? `tsx:${a.componentPath}` : 'tsx:auto'),
      `load:${a.lazyLoad}`,
      `render:${a.render}`,
    ].join(' | ');
    console.log(`- ${a.type} → ${flags}${a.error ? ` | ${a.error}` : ''}`);
  });

  console.log('\n=== Resumo ===');
  console.log('Steps com blocos:', totals.stepsWithBlocks);
  console.log('Total de tipos:', totals.totalTypes);
  console.log('Tipos NÃO registrados:', totals.notRegistered.length ? totals.notRegistered.join(', ') : '(nenhum)');
  if (totals.missingTemplates.length) {
    console.log('HTML faltando (SIMPLE):');
    totals.missingTemplates.forEach((t) => console.log(`  - ${t.type}: ${t.template}`));
  }
  if (totals.lazyErrors.length) {
    console.log('Erros de carregamento lazy:');
    totals.lazyErrors.forEach((e) => console.log(`  - ${e.type}: ${e.error}`));
  }
  if (totals.renderErrors.length) {
    console.log('Erros de render SSR:');
    totals.renderErrors.forEach((e) => console.log(`  - ${e.type}: ${e.error}`));
  }

  // Expor JSON bruto opcionalmente
  if (process.env.JSON === '1') {
    console.log('\n=== JSON ===');
    console.log(JSON.stringify(results, null, 2));
  }
}

main().catch(err => {
  console.error('Falha na auditoria:', err);
  process.exit(1);
});
