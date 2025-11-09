import { describe, it, expect } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';

import { isSimpleBlock, getTemplatePath, getComponentPath, BLOCK_COMPLEXITY_MAP } from '@/config/block-complexity-map';
import { UnifiedBlockRegistry } from '@/registry/UnifiedBlockRegistry';

// Converter opcional para sections -> blocks (quando necessário)
async function convertSectionsToBlocks(sections: any[]): Promise<any[]> {
  const mod = await import('@/utils/sectionToBlockConverter');
  const fn = (mod as any).convertSectionsToBlocks || (mod as any).default;
  return fn ? fn(sections) : [];
}

async function readJson(filePath: string): Promise<any | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function loadStepBlocks(stepId: string): Promise<any[]> {
  const publicDir = path.join(process.cwd(), 'public');
  const blocksPath = path.join(publicDir, 'templates', 'blocks', `${stepId}.json`);
  const v3Path = path.join(publicDir, 'templates', `${stepId}-v3.json`);

  // 1) blocks (v3.1)
  const blocksData = await readJson(blocksPath);
  if (blocksData) {
    const blocks = Array.isArray(blocksData?.blocks)
      ? blocksData.blocks
      : Array.isArray(blocksData)
      ? blocksData
      : [];
    if (blocks.length > 0) return blocks;
  }

  // 2) v3 (sections ou blocks)
  const v3Data = await readJson(v3Path);
  if (v3Data) {
    if (Array.isArray((v3Data as any).blocks)) {
      return (v3Data as any).blocks;
    }
    if (Array.isArray((v3Data as any).sections)) {
      return await convertSectionsToBlocks((v3Data as any).sections);
    }
  }

  // 3) master fallback
  const master = await readJson(path.join(publicDir, 'templates', 'quiz21-complete.json'));
  const step = (master?.steps || {})[stepId];
  if (Array.isArray(step?.blocks)) return step.blocks;
  if (Array.isArray(step?.sections)) return await convertSectionsToBlocks(step.sections);

  return [];
}

describe('Runtime coverage: JSON sources and UnifiedBlockRegistry alignment', () => {
  it('carrega blocos de todas as 21 etapas a partir dos JSONs públicos (v3/blocks/master)', async () => {
    const results: Record<string, number> = {};
    for (let i = 1; i <= 21; i++) {
      const stepId = `step-${String(i).padStart(2, '0')}`;
      const blocks = await loadStepBlocks(stepId);
      results[stepId] = blocks.length;
      expect(blocks.length, `Esperado > 0 blocos em ${stepId}`).toBeGreaterThan(0);
    }
    // sanity extra: step-20 deve existir
    expect(results['step-20']).toBeGreaterThan(0);
  });

  it('todos os tipos de blocos usados possuem renderer disponível (SIMPLE template ou COMPLEX component)', async () => {
    const missingInMap = new Set<string>();
    const missingTemplate = new Set<string>();
    const missingComponent = new Set<string>();

    const usedTypes = new Set<string>();
    for (let i = 1; i <= 21; i++) {
      const stepId = `step-${String(i).padStart(2, '0')}`;
      const blocks = await loadStepBlocks(stepId);
      blocks.forEach((b: any) => {
        const t = String(b?.type || '').trim();
        if (t) usedTypes.add(t);
      });
    }

    // Validar cada tipo encontrado
    for (const type of usedTypes) {
      const cfg = (BLOCK_COMPLEXITY_MAP as any)[type];
      if (!cfg) {
        missingInMap.add(type);
        continue;
      }

  if (isSimpleBlock(type)) {
        const tpl = getTemplatePath(type);
        if (!tpl) {
          missingTemplate.add(`${type}:(no template path)`);
          continue;
        }
        // checar que o arquivo existe em public/templates/html
        const file = path.join(process.cwd(), 'public', 'templates', 'html', tpl);
        try {
          await fs.access(file);
        } catch {
          missingTemplate.add(`${type}:${tpl}`);
        }
      } else {
        const registry = UnifiedBlockRegistry.getInstance();
        // 1) se é crítico (registrado sincronamente), ok
        if (registry.isCritical(type)) {
          continue;
        }
        // 2) se há componente lazy disponível, ok
        const lazyComp = registry.getLazyComponent(type);
        if (lazyComp) {
          continue;
        }
        // 3) fallback: importar caminho declarado no complexity-map (se existir)
        const compPath = getComponentPath(type);
        if (!compPath) {
          missingComponent.add(`${type}:(no component path)`);
          continue;
        }
        try { await import(/* @vite-ignore */ compPath); } catch { missingComponent.add(`${type}:${compPath}`); }
      }
    }

    const problems: string[] = [];
    if (missingInMap.size) problems.push(`Tipos não mapeados: ${Array.from(missingInMap).sort().join(', ')}`);
    if (missingTemplate.size) problems.push(`SIMPLE sem template: ${Array.from(missingTemplate).sort().join(', ')}`);
    if (missingComponent.size) problems.push(`COMPLEX sem componente: ${Array.from(missingComponent).sort().join(', ')}`);

    expect(problems.join('\n')).toBe('');
  });
});
