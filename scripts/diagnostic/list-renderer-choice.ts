import fs from 'node:fs/promises';
import path from 'node:path';

import { isSimpleBlock, getTemplatePath, getComponentPath } from '@/config/block-complexity-map';
import { UnifiedBlockRegistry } from '@/registry/UnifiedBlockRegistry';

type Canonical = { id: string; type: string };

async function loadJson(filePath: string): Promise<any | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function loadPublicStepBlocks(stepId: string): Promise<Canonical[]> {
  const publicDir = path.join(process.cwd(), 'public');
  const blocksPath = path.join(publicDir, 'templates', 'blocks', `${stepId}.json`);
  const v3Path = path.join(publicDir, 'templates', `${stepId}-v3.json`);

  const fromBlocks = await loadJson(blocksPath);
  if (fromBlocks) {
    const arr = Array.isArray(fromBlocks?.blocks) ? fromBlocks.blocks : Array.isArray(fromBlocks) ? fromBlocks : [];
    if (arr.length) return arr.map((b: any) => ({ id: String(b?.id ?? ''), type: String(b?.type ?? '') }));
  }

  const fromV3 = await loadJson(v3Path);
  if (fromV3) {
    if (Array.isArray(fromV3?.blocks)) {
      return (fromV3.blocks as any[]).map((b: any) => ({ id: String(b?.id ?? ''), type: String(b?.type ?? '') }));
    }
    if (Array.isArray(fromV3?.sections)) {
      const mod = await import('@/utils/sectionToBlockConverter');
      const fn = (mod as any).convertSectionsToBlocks || (mod as any).default;
      const converted = fn ? fn(fromV3.sections) : [];
      return converted.map((b: any) => ({ id: String(b?.id ?? ''), type: String(b?.type ?? '') }));
    }
  }

  const master = await loadJson(path.join(publicDir, 'templates', 'quiz21-complete.json'));
  const step = master?.steps?.[stepId];
  if (Array.isArray(step?.blocks)) return step.blocks.map((b: any) => ({ id: String(b?.id ?? ''), type: String(b?.type ?? '') }));
  if (Array.isArray(step?.sections)) {
    const mod = await import('@/utils/sectionToBlockConverter');
    const fn = (mod as any).convertSectionsToBlocks || (mod as any).default;
    const converted = fn ? fn(step.sections) : [];
    return converted.map((b: any) => ({ id: String(b?.id ?? ''), type: String(b?.type ?? '') }));
  }
  return [];
}

async function fileExists(p: string) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function main() {
  const registry = UnifiedBlockRegistry.getInstance();
  const summary: Record<string, any[]> = {};

  for (let i = 1; i <= 21; i++) {
    const stepId = `step-${String(i).padStart(2, '0')}`;
    const blocks = await loadPublicStepBlocks(stepId);
    const rows: any[] = [];

    for (const b of blocks) {
      const type = String(b.type || '').trim();
      if (!type) continue;
      const row: any = { type, renderer: '', details: {} };

      if (isSimpleBlock(type)) {
        const tpl = getTemplatePath(type);
        const tplFile = tpl ? path.join(process.cwd(), 'public', 'templates', 'html', tpl) : null;
        const exists = tplFile ? await fileExists(tplFile) : false;
        row.renderer = 'SIMPLE';
        row.details = { template: tpl || null, exists };
      } else {
        const isCritical = registry.isCritical(type);
        const lazy = registry.getLazyComponent(type) ? true : false;
        const compPath = getComponentPath(type);
        row.renderer = 'COMPLEX';
        row.details = { critical: isCritical, lazy, componentPath: compPath || null };
      }

      rows.push(row);
    }

    summary[stepId] = rows;
  }

  // Output humano
  for (const sid of Object.keys(summary)) {
    console.log(`\n=== ${sid} ===`);
    for (const r of summary[sid]) {
      if (r.renderer === 'SIMPLE') {
        console.log(`- ${r.type} → SIMPLE (template: ${r.details.template} ${r.details.exists ? '✓' : '✗'})`);
      } else {
        const flags = [r.details.critical ? 'critical' : null, r.details.lazy ? 'lazy' : null].filter(Boolean).join(', ');
        console.log(`- ${r.type} → COMPLEX (${flags || 'no-flags'}) path: ${r.details.componentPath ?? 'registry/lazy'}`);
      }
    }
  }

  // Salvar JSON em coverage
  const outDir = path.join(process.cwd(), 'coverage');
  try { await fs.mkdir(outDir, { recursive: true }); } catch { /* noop */ }
  await fs.writeFile(path.join(outDir, 'renderer-choice.json'), JSON.stringify(summary, null, 2), 'utf-8');
  console.log(`\n💾 Salvo em: coverage/renderer-choice.json`);
}

main().catch((err) => {
  console.error('Erro no diagnóstico de renderer:', err);
  process.exitCode = 1;
});
