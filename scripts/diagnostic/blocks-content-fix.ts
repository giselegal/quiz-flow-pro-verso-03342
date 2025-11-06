#!/usr/bin/env tsx
/*
 * Fixer de Conteúdo Mínimo por Step
 * - Varre steps (1..21) e garante campos mínimos para blocos conhecidos
 * - Escreve de volta no arquivo step-XX-v3.json (preferência) ou step-XX-template.json
 * - Faz backup automático do arquivo antes da escrita
 */

import fs from 'node:fs';
import path from 'node:path';
import type { Block } from '../../src/types/editor';

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

function writeJSON(p: string, data: any) {
  const json = JSON.stringify(data, null, 2) + '\n';
  fs.writeFileSync(p, json, 'utf-8');
}

function backupFile(p: string) {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const bak = p + `.bak.${stamp}`;
  fs.copyFileSync(p, bak);
  return bak;
}

function setIfMissing(obj: any, pathStr: string, value: any) {
  const parts = pathStr.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {};
    cur = cur[k];
  }
  const last = parts[parts.length - 1];
  if (cur[last] == null || (Array.isArray(value) && Array.isArray(cur[last]) && cur[last].length === 0)) {
    cur[last] = value;
    return true;
  }
  return false;
}

function ensureBlockMinimums(block: Block): string[] {
  const fixed: string[] = [];
  const type = String((block as any).type || '');
  (block as any).content ||= {};
  (block as any).properties ||= {};

  const mark = (ok: boolean, field: string) => { if (ok) fixed.push(field); };

  switch (type) {
    case 'intro-title':
      mark(setIfMissing(block as any, 'content.text', 'Bem-vindo(a)!'), 'content.text');
      break;
    case 'transition-text':
      mark(setIfMissing(block as any, 'content.text', 'Continuando...'), 'content.text');
      break;
    case 'result-description':
      mark(setIfMissing(block as any, 'content.text', 'Descrição do resultado.'), 'content.text');
      break;
    case 'result-secondary-styles':
      mark(setIfMissing(block as any, 'content.styles', ['Clássico']), 'content.styles');
      break;
    case 'result-image': {
      const placeholder = 'https://picsum.photos/800/400?blur=2';
      const ok1 = setIfMissing(block as any, 'content.imageUrl', placeholder);
      const ok2 = setIfMissing(block as any, 'content.src', placeholder);
      const ok3 = setIfMissing(block as any, 'properties.url', placeholder);
      if (ok1) fixed.push('content.imageUrl');
      if (ok2) fixed.push('content.src');
      if (ok3) fixed.push('properties.url');
      break;
    }
    case 'result-share':
      mark(setIfMissing(block as any, 'content.platforms', ['facebook', 'twitter', 'whatsapp', 'linkedin']), 'content.platforms');
      break;
    case 'question-hero':
      // Preencher pelo menos um dos campos comuns
      const o1 = setIfMissing(block as any, 'content.title', 'Pergunta');
      const o2 = setIfMissing(block as any, 'content.text', 'Escolha uma opção:');
      if (o1) fixed.push('content.title');
      if (o2) fixed.push('content.text');
      break;
    default:
      // Para outros tipos simples conhecidos: no-op
      break;
  }

  return fixed;
}

function loadStepForWrite(stepId: string): { file: string | null, data: any, blocks: Block[] | null, variant: 'v3' | 'template' | null } {
  const v3 = path.join(PUBLIC_TEMPLATES, `${stepId}-v3.json`);
  if (fileExists(v3)) {
    const data = readJSON<any>(v3);
    if (Array.isArray(data?.blocks)) return { file: v3, data, blocks: data.blocks as Block[], variant: 'v3' };
    if (Array.isArray(data)) return { file: v3, data, blocks: data as Block[], variant: 'v3' };
  }
  const legacy = path.join(PUBLIC_TEMPLATES, `${stepId}-template.json`);
  if (fileExists(legacy)) {
    const data = readJSON<any>(legacy);
    if (Array.isArray(data?.blocks)) return { file: legacy, data, blocks: data.blocks as Block[], variant: 'template' };
    if (Array.isArray(data)) return { file: legacy, data, blocks: data as Block[], variant: 'template' };
  }
  return { file: null, data: null, blocks: null, variant: null };
}

async function main() {
  const summary: Record<string, any> = {};
  let totalFiles = 0;
  let totalBlocks = 0;
  let totalFields = 0;

  for (let i = 1; i <= 21; i++) {
    const stepId = `step-${String(i).padStart(2, '0')}`;
    const { file, data, blocks, variant } = loadStepForWrite(stepId);
    if (!file || !blocks) {
      summary[stepId] = { updated: false, reason: 'sem-arquivo' };
      continue;
    }

    const fixedByBlock: Record<string, string[]> = {};
    for (const b of blocks) {
      const changes = ensureBlockMinimums(b);
      if (changes.length) {
        fixedByBlock[String(b.id || b.type)] = changes;
        totalFields += changes.length;
      }
    }

    if (Object.keys(fixedByBlock).length === 0) {
      summary[stepId] = { updated: false, reason: 'sem-alterações' };
      continue;
    }

    // Escrever mantendo o formato original
    backupFile(file);
    if (Array.isArray(data)) {
      writeJSON(file, blocks);
    } else if (data && typeof data === 'object') {
      data.blocks = blocks;
      writeJSON(file, data);
    }
    totalFiles += 1;
    totalBlocks += Object.keys(fixedByBlock).length;
    summary[stepId] = { updated: true, variant, file, fixedByBlock };
  }

  console.log('=== Fixer de Conteúdo Mínimo ===');
  console.log('Arquivos atualizados:', totalFiles);
  console.log('Blocos tocados:', totalBlocks);
  console.log('Campos preenchidos:', totalFields);
  Object.entries(summary).forEach(([step, info]) => {
    if (info.updated) {
      console.log(`- ${step}: atualizado (${info.variant}) -> ${info.file}`);
      Object.entries(info.fixedByBlock).forEach(([blk, fields]) => {
        console.log(`   · ${blk}: ${fields.join(', ')}`);
      });
    } else {
      console.log(`- ${step}: ${info.reason}`);
    }
  });
}

main().catch((err) => {
  console.error('Falha no fixer:', err);
  process.exit(1);
});
