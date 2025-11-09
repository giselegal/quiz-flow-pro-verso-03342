import { describe, it, expect } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';

// Carrega stepBlocks do estado público (JSONs dinâmicos + master)
async function loadPublicStepBlocks(stepId: string): Promise<any[]> {
  const publicDir = path.join(process.cwd(), 'public');
  const paths = [
    path.join(publicDir, 'templates', 'blocks', `${stepId}.json`),
    path.join(publicDir, 'templates', `${stepId}-v3.json`),
  ];

  for (const p of paths) {
    try {
      const raw = await fs.readFile(p, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.blocks)) return data.blocks;
      if (Array.isArray(data?.sections)) {
        const mod = await import('@/lib/utils/sectionToBlockConverter');
        const fn = (mod as any).convertSectionsToBlocks || (mod as any).default;
        const converted = fn ? fn(data.sections) : [];
        if (converted.length) return converted;
      }
    } catch { /* ignore */ }
  }

  // fallback master
  try {
    const masterRaw = await fs.readFile(path.join(publicDir, 'templates', 'quiz21-complete.json'), 'utf-8');
    const master = JSON.parse(masterRaw);
    const step = master?.steps?.[stepId];
    if (Array.isArray(step?.blocks)) return step.blocks;
    if (Array.isArray(step?.sections)) {
      const mod = await import('@/lib/utils/sectionToBlockConverter');
      const fn = (mod as any).convertSectionsToBlocks || (mod as any).default;
      return fn ? fn(step.sections) : [];
    }
  } catch { /* ignore */ }
  return [];
}

// Simula carregamento via TemplateService (editor) sem Supabase (dev)
async function loadEditorStepBlocks(stepId: string): Promise<any[]> {
  // Usa HierarchicalTemplateSource diretamente: em dev sem funnelId → cai para TEMPLATE_DEFAULT
  try {
    const { hierarchicalTemplateSource } = await import('@/services/core/HierarchicalTemplateSource');
    const result = await hierarchicalTemplateSource.getPrimary(stepId, undefined).catch(() => null);
    if (result?.data?.length) return result.data;
  } catch { /* noop */ }

  // Se falhar, replicar a mesma lógica de jsonStepLoader
  try {
    const { loadStepFromJson } = await import('@/templates/loaders/jsonStepLoader');
    const jsonBlocks = await loadStepFromJson(stepId);
    if (jsonBlocks?.length) return jsonBlocks;
  } catch { /* noop */ }

  return [];
}

function toCanonical(blocks: any[]): { id: string; type: string }[] {
  return blocks.map(b => ({ id: String(b.id || ''), type: String(b.type || '') }));
}

describe('Alinhamento Editor (dev) vs Público (JSON)', () => {
  it('cada step (1..21) tem mesmo conjunto de tipos de blocos entre editor e público (após normalização de aliases)', async () => {
    const divergencias: string[] = [];

    for (let i = 1; i <= 21; i++) {
      const stepId = `step-${String(i).padStart(2, '0')}`;
  let publicBlocks = toCanonical(await loadPublicStepBlocks(stepId));
  let editorBlocks = toCanonical(await loadEditorStepBlocks(stepId));

  // Normalizar tipos via block-aliases.json para comparar canônicos
  const { normalizeBlockTypes } = await import('@/lib/utils/blockNormalizer');
  publicBlocks = normalizeBlockTypes(publicBlocks as any);
  editorBlocks = normalizeBlockTypes(editorBlocks as any);

      const publicTypes = new Set(publicBlocks.map(b => b.type));
      const editorTypes = new Set(editorBlocks.map(b => b.type));

      // Ignorar tipos vazios
      publicTypes.delete('');
      editorTypes.delete('');

      // Diff
      const onlyPublic = [...publicTypes].filter(t => !editorTypes.has(t));
      const onlyEditor = [...editorTypes].filter(t => !publicTypes.has(t));

      // Ignorar divergências conhecidas de alias equivalentes (ex: intro-logo vs quiz-intro-header)
      const benignPairs: Array<[string,string]> = [
        ['intro-logo','quiz-intro-header'],
        ['CTAButton','cta-inline'],
        ['pricing','offer-pricing-table']
      ];
      for (const [a,b] of benignPairs) {
        if (onlyPublic.includes(a) && editorTypes.has(b)) {
          const idx = onlyPublic.indexOf(a); if (idx >= 0) onlyPublic.splice(idx,1);
        }
        if (onlyEditor.includes(b) && publicTypes.has(a)) {
          const idx = onlyEditor.indexOf(b); if (idx >= 0) onlyEditor.splice(idx,1);
        }
      }

      if (onlyPublic.length || onlyEditor.length) {
        divergencias.push(`${stepId} → public-only: [${onlyPublic.join(', ')}] editor-only: [${onlyEditor.join(', ')}]`);
      }
    }

    expect(divergencias.join('\n')).toBe('');
  });

  it('step-20 mantém ordem relativa consistente (primeiro e último tipo iguais)', async () => {
    const stepId = 'step-20';
    const publicBlocks = toCanonical(await loadPublicStepBlocks(stepId));
    const editorBlocks = toCanonical(await loadEditorStepBlocks(stepId));
    if (publicBlocks.length && editorBlocks.length) {
      expect(editorBlocks[0].type).toBe(publicBlocks[0].type);
      expect(editorBlocks[editorBlocks.length - 1].type).toBe(publicBlocks[publicBlocks.length - 1].type);
    } else {
      expect(publicBlocks.length).toBeGreaterThan(0);
      expect(editorBlocks.length).toBeGreaterThan(0);
    }
  });
});
