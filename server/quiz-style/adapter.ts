import { promises as fs } from 'fs';
import path from 'path';
import { TemplateDraft, genId, timestamp } from '../templates/models';

// Tipos simplificados do legacy (apenas campos usados no nível 1)
interface LegacyBlock {
  id: string;
  type: string;
  properties?: any;
  config?: any;
  data?: any;
}

interface LegacyStepFile {
  id: string;
  name?: string;
  description?: string;
  metadata?: { stepNumber?: number; totalSteps?: number };
  blocks: LegacyBlock[];
}

interface LegacyLoadResult {
  steps: LegacyStepFile[];
  source: string;
}

async function loadLegacyStepsFromJson(): Promise<LegacyLoadResult> {
  const baseDir = path.join(process.cwd(), 'public', 'templates', 'quiz-steps');
  let files: string[] = [];
  try {
    files = (await fs.readdir(baseDir)).filter(f => f.endsWith('.json'));
  } catch (e) {
    throw new Error(`Legacy steps directory not found: ${baseDir}`);
  }
  const steps: LegacyStepFile[] = [];
  for (const file of files) {
    const full = path.join(baseDir, file);
    try {
      const raw = await fs.readFile(full, 'utf-8');
      const json = JSON.parse(raw);
      if (json && Array.isArray(json.blocks)) {
        steps.push(json as LegacyStepFile);
      }
    } catch (e) {
      console.warn(`[adapter][legacy] Failed to parse ${file}: ${(e as any).message}`);
    }
  }
  // Ordena por metadata.stepNumber se existir
  steps.sort((a, b) => (a.metadata?.stepNumber || 0) - (b.metadata?.stepNumber || 0));
  return { steps, source: 'json-files' };
}

export interface AdapterOptions {
  slug: string;
  name?: string;
}

export async function toTemplateDraft(opts: AdapterOptions): Promise<TemplateDraft> {
  const { steps } = await loadLegacyStepsFromJson();
  if (!steps.length) {
    throw new Error('Nenhum step legacy encontrado para montar draft');
  }

  const createdAt = timestamp();
  const draftId = genId('tpl_legacy');

  // Construir stages + components sintéticos
  const components: TemplateDraft['components'] = {};
  const stages: TemplateDraft['stages'] = steps.map((step, idx) => {
    const stageId = `stage_${idx + 1}`;
    const cmpId = genId(`cmp_${stageId}`);
    components[cmpId] = {
      id: cmpId,
      type: 'legacyBlocksBundle',
      props: { blocks: step.blocks, legacyStepId: step.id, legacyMeta: step.metadata }
    };
    let type: any = 'question';
    if (idx === 0) type = 'intro';
    else if (idx === steps.length - 1) type = 'result';
    return {
      id: stageId,
      type,
      order: idx,
      enabled: true,
      componentIds: [cmpId],
      meta: { stageSlug: step.id, description: step.description }
    };
  });

  const draft: TemplateDraft = {
    id: draftId,
    schemaVersion: '1.0.0-adapter-legacy',
    meta: {
      name: opts.name || 'Quiz Estilo (Legacy Adapter)',
      slug: opts.slug,
      description: 'Draft sintético gerado via adapter legacy (read-only)',
      tags: ['legacy', 'quiz-style'],
      seo: {},
      tracking: {}
    },
    stages,
    components,
    logic: {
      scoring: { mode: 'sum', weights: {}, normalization: { percent: true } },
      branching: []
    },
    outcomes: [
      { id: 'out_default', minScore: 0, maxScore: 9999, template: 'Resultado placeholder (score {{score}})' }
    ],
    status: 'draft',
    history: [],
    createdAt,
    updatedAt: createdAt,
    draftVersion: 1
  };

  return draft;
}
