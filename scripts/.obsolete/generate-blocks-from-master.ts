#!/usr/bin/env tsx
/**
 * Gera/atualiza JSONs por etapa em public/templates/blocks/step-XX.json
 * a partir do master public/templates/quiz21-complete.json.
 *
 * Regras:
 * - Lê master.steps["step-XX"].blocks (em formato normalizado)
 * - Converte cada bloco para shape { id, type, config, properties }
 *   onde config = properties = merge(content, properties)
 * - Preserva theme e analytics de um arquivo existente (se houver)
 * - Preenche metadata básica (id, name, description, category)
 *
 * Uso:
 *   npm run blocks:from-master
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const MASTER_PATH = path.join(ROOT, 'public', 'templates', 'quiz21-complete.json');
const BLOCKS_DIR = path.join(ROOT, 'public', 'templates', 'blocks');

type MasterBlock = {
  id: string;
  type: string;
  order?: number;
  properties?: Record<string, any>;
  content?: Record<string, any>;
  parentId?: string | null;
};

type MasterStep = {
  metadata?: { name?: string; description?: string; category?: string; tags?: string[] };
  blocks?: MasterBlock[];
  sections?: any[]; // caso ainda não normalizado
  offer?: any;
  theme?: any;
};

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJsonSafe<T = any>(file: string): T | null {
  try {
    const s = fs.readFileSync(file, 'utf8');
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function writeJson(file: string, obj: any) {
  ensureDir(path.dirname(file));
  const data = JSON.stringify(obj, null, 2) + '\n';
  fs.writeFileSync(file, data, 'utf8');
}

function toBlocksJson(masterStep: MasterStep) {
  const blocks = Array.isArray(masterStep.blocks) ? masterStep.blocks : [];
  const normalized = blocks.map((b) => {
    const cfg = { ...(b.content || {}), ...(b.properties || {}) };
    return {
      id: b.id,
      type: b.type,
      config: cfg,
      properties: cfg,
    };
  });
  return normalized;
}

function inferCategory(stepNumber: number, fallback?: string) {
  if (fallback) return fallback;
  if (stepNumber === 1) return 'intro';
  if (stepNumber >= 2 && stepNumber <= 18) return 'question';
  if (stepNumber === 19) return 'transition';
  if (stepNumber === 20) return 'result-offer';
  if (stepNumber === 21) return 'offer';
  return 'generic';
}

function main() {
  console.log('🔧 Gerando public/templates/blocks a partir do master...');

  const master = readJsonSafe<{ steps?: Record<string, MasterStep> }>(MASTER_PATH);
  if (!master?.steps) {
    console.error('❌ Master inválido ou não encontrado:', MASTER_PATH);
    process.exit(1);
  }

  const stepKeys = Object.keys(master.steps).filter((k) => /^step-\d{2}$/.test(k)).sort();
  if (stepKeys.length === 0) {
    console.error('❌ Nenhum step "step-XX" encontrado no master.');
    process.exit(1);
  }

  ensureDir(BLOCKS_DIR);

  let updated = 0;
  for (const stepId of stepKeys) {
    const num = parseInt(stepId.slice(-2), 10);
    const mStep = master.steps[stepId] || {} as MasterStep;
    const existingPath = path.join(BLOCKS_DIR, `${stepId}.json`);
    const existing = readJsonSafe<any>(existingPath) || {};

    const name = mStep.metadata?.name || existing?.metadata?.name || `Step ${num}`;
    const description = mStep.metadata?.description || existing?.metadata?.description || '';
    const category = inferCategory(num, mStep.metadata?.category || existing?.metadata?.category);

    const out = {
      templateVersion: '3.1',
      metadata: {
        id: stepId,
        name,
        description,
        category,
        ...(Array.isArray(mStep.metadata?.tags) ? { tags: mStep.metadata!.tags } : {}),
      },
      theme: existing.theme || mStep.theme || undefined,
      blocks: toBlocksJson(mStep),
      analytics: existing.analytics || undefined,
    } as any;

    writeJson(existingPath, out);
    updated++;
    console.log(`✅ ${stepId} → ${path.relative(ROOT, existingPath)}`);
  }

  console.log(`\n🎉 Concluído. Arquivos atualizados: ${updated}`);
}

main();
