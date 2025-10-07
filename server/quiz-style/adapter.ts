import { promises as fs } from 'fs';
import path from 'path';
import { TemplateDraft, genId, timestamp } from '../templates/models';
import { ComponentKind } from '../templates/components';
import { recordConversion, recordDelta, recordFallback } from './metrics';

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

// --------------------------- MANIFEST SUPPORT ---------------------------
interface AdapterManifest {
  metaOverrides?: { name?: string; description?: string };
  order?: string[]; // lista de step ids (ex: 'etapa-01')
  updatedAt: string;
  version: string; // versão do formato do manifest
}

const MANIFEST_FILENAME = 'manifest.adapter.json';

async function readManifest(baseDir: string): Promise<AdapterManifest | null> {
  const manifestPath = path.join(baseDir, MANIFEST_FILENAME);
  try {
    const raw = await fs.readFile(manifestPath, 'utf-8');
    const json = JSON.parse(raw);
    if (json && typeof json === 'object') return json as AdapterManifest;
  } catch {
    return null;
  }
  return null;
}

async function writeManifest(baseDir: string, manifest: AdapterManifest): Promise<void> {
  const manifestPath = path.join(baseDir, MANIFEST_FILENAME);
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
}

export async function loadLegacyStepsFromJson(): Promise<LegacyLoadResult & { manifest: AdapterManifest | null; baseDir: string }> {
  const baseDir = path.join(process.cwd(), 'public', 'templates', 'quiz-steps');
  let files: string[] = [];
  try {
    files = (await fs.readdir(baseDir)).filter(f => f.endsWith('.json') && f !== MANIFEST_FILENAME);
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
  // Ordena por metadata.stepNumber default
  steps.sort((a, b) => (a.metadata?.stepNumber || 0) - (b.metadata?.stepNumber || 0));

  // Manifest reorder
  const manifest = await readManifest(baseDir);
  if (manifest?.order && manifest.order.length === steps.length) {
    const byId = new Map(steps.map(s => [s.id, s] as const));
    const allIncluded = manifest.order.every(id => byId.has(id));
    if (allIncluded) {
      const reordered: LegacyStepFile[] = [];
      for (const id of manifest.order) reordered.push(byId.get(id)!);
      // Preserva nova ordem
      reordered.forEach((s, idx) => { if (s.metadata) s.metadata.stepNumber = idx + 1; else s.metadata = { stepNumber: idx + 1 }; });
      return { steps: reordered, source: 'json-files+manifest', manifest, baseDir };
    }
  }
  return { steps, source: 'json-files', manifest, baseDir };
}

export interface AdapterOptions {
  slug: string;
  name?: string;
}

export async function toTemplateDraft(opts: AdapterOptions): Promise<TemplateDraft> {
  const start = Date.now();
  const { steps, manifest } = await loadLegacyStepsFromJson();
  if (!steps.length) {
    throw new Error('Nenhum step legacy encontrado para montar draft');
  }

  const createdAt = timestamp();
  const draftId = genId('tpl_legacy');

  const split = process.env.ADAPTER_COMPONENT_SPLIT === 'true';
  // Construir stages + components sintéticos (modo legacy ou split tipado)
  const components: TemplateDraft['components'] = {};
  const stages: TemplateDraft['stages'] = steps.map((step, idx) => {
    const stageId = `stage_${idx + 1}`;
    const cmpId = genId(`cmp_${stageId}`);
    if (!split) {
      components[cmpId] = {
        id: cmpId,
        type: 'legacyBlocksBundle',
        props: { blocks: step.blocks, legacyStepId: step.id, legacyMeta: step.metadata }
      };
    } else {
      // Tentar decompor blocos básicos
      // Heurística simples: mapear por type do legacy block
      const generatedIds: string[] = [];
      for (const block of step.blocks) {
        const baseId = genId('cmp');
        let kind: ComponentKind | null = null;
        let props: any = {};
        switch (block.type) {
          case 'QuizHeaderBlock':
            kind = ComponentKind.Header;
            props = {
              title: block.properties?.title,
              subtitle: block.properties?.subtitle,
              description: block.properties?.description,
              showProgress: block.properties?.showProgress
            };
            break;
          case 'QuizNavigationIntegration':
            kind = ComponentKind.Navigation;
            props = {
              showNext: block.properties?.showNext ?? true,
              showPrevious: block.properties?.showPrevious ?? false,
              nextButtonText: block.properties?.nextButtonText
            };
            break;
          case 'QuizContentIntegration': {
            const multi = !!block.properties?.multiSelect || !!block.properties?.maxSelections && block.properties?.maxSelections > 1;
            const options = (block.data?.options || []).map((o: any) => ({ id: o.id || genId('opt'), label: o.label || o.text || 'Option', description: o.description, value: o.value, points: o.points }));
            if (multi) {
              kind = ComponentKind.QuestionMulti;
              props = { title: block.properties?.title, subtitle: block.properties?.subtitle, required: block.properties?.required, options, maxSelections: block.properties?.maxSelections };
            } else {
              kind = ComponentKind.QuestionSingle;
              props = { title: block.properties?.title, subtitle: block.properties?.subtitle, required: block.properties?.required, options };
            }
            break;
          }
          case 'QuizTransition':
            kind = ComponentKind.Transition;
            props = { message: block.properties?.message, variant: block.properties?.variant, showDivider: block.properties?.showDivider, showButton: block.properties?.showButton, buttonText: block.properties?.buttonText };
            break;
          default:
            // Fallback: mantém bloco dentro de um RawLegacyBundle para não perder informação
            kind = ComponentKind.RawLegacyBundle;
            props = { blocks: [block], legacyStepId: step.id, legacyMeta: step.metadata };
        }
        const newId = baseId;
        components[newId] = { id: newId, kind, version: '1.0.0', createdAt: timestamp(), updatedAt: timestamp(), props, meta: { source: 'legacy', legacyBlockId: block.id } } as any;
        generatedIds.push(newId);
      }
      // Para compatibilidade imediata, manter também bundle se nenhum componente foi gerado
      if (!generatedIds.length) {
        components[cmpId] = { id: cmpId, kind: ComponentKind.RawLegacyBundle, version: '1.0.0', createdAt: timestamp(), updatedAt: timestamp(), props: { blocks: step.blocks, legacyStepId: step.id, legacyMeta: step.metadata } } as any;
        generatedIds.push(cmpId);
      }
      // Substituir componente único por lista gerada
      return {
        id: stageId,
        type: idx === 0 ? 'intro' : (idx === steps.length - 1 ? 'result' : 'question'),
        order: idx,
        enabled: true,
        componentIds: generatedIds,
        meta: { stageSlug: step.id, description: step.description }
      };
    }
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
    schemaVersion: split ? '1.1.0-adapter-legacy-split' : '1.0.0-adapter-legacy',
    meta: {
      name: manifest?.metaOverrides?.name || opts.name || 'Quiz Estilo (Legacy Adapter)',
      slug: opts.slug,
      description: manifest?.metaOverrides?.description || 'Draft sintético gerado via adapter legacy (read-only)',
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

  const duration = Date.now() - start;
  try { recordConversion(duration); } catch { /* noop */ }
  return draft;
}

// Wrapper seguro: se falhar e flag LEGACY_ADAPTER_FALLBACK estiver ativa, retorna objeto fallback
export async function safeToTemplateDraft(opts: AdapterOptions): Promise<{ draft?: TemplateDraft; fallback?: any }> {
  try {
    // Usar referência dinâmica ao export para permitir que testes possam mockar via vi.spyOn
    // Sem isso, o binding interno da função permanece fechado e não é interceptado.
    // @ts-ignore
    const draft = await (exports as any).toTemplateDraft(opts);
    return { draft };
  } catch (e: any) {
    const enable = process.env.LEGACY_ADAPTER_FALLBACK === 'true';
    if (!enable) throw e;
    try { recordFallback(); } catch { /* noop */ }
    // tenta carregar apenas lista crua de steps para retorno
    let raw: any = null;
    try { raw = await loadLegacyStepsFromJson(); } catch { /* ignore nested */ }
    return { fallback: { reason: e.message, rawSteps: raw?.steps || [], manifest: raw?.manifest || null } };
  }
}

// --------------------------- ROUND-TRIP (Esqueleto) ---------------------------
// Delta simples por enquanto: apenas meta (name, description) e reorder de stages
export interface DraftDeltaPatch {
  meta?: { name?: string; description?: string };
  stagesReorder?: string[]; // stage ids (ex: stage_1, stage_2,...)
}

export async function applyDraftDelta(slug: string, delta: DraftDeltaPatch): Promise<{ ok: boolean; message: string; manifest: AdapterManifest }> {
  const start = Date.now();
  // Carrega info atual
  const { steps, manifest, baseDir } = await loadLegacyStepsFromJson();
  if (!steps.length) throw new Error('Nenhum step legacy disponível');
  const currentDraft = await toTemplateDraft({ slug });
  // Base manifest
  const nextManifest: AdapterManifest = manifest || {
    metaOverrides: {},
    order: steps.map(s => s.id),
    updatedAt: timestamp(),
    version: '1.0.0'
  };

  // Meta
  if (delta.meta) {
    nextManifest.metaOverrides = {
      ...(nextManifest.metaOverrides || {}),
      ...delta.meta
    };
  }

  // Reorder
  if (delta.stagesReorder) {
    // Map stageId -> legacy step id (stage.meta.stageSlug)
    const stageIdToSlug = new Map(currentDraft.stages.map(st => [st.id, st.meta?.stageSlug] as const));
    const legacyOrder: string[] = [];
    for (const stageId of delta.stagesReorder) {
      const stepSlug = stageIdToSlug.get(stageId);
      if (!stepSlug) throw new Error(`Stage id desconhecido no reorder: ${stageId}`);
      legacyOrder.push(stepSlug);
    }
    // Validar integridade do set
    const unique = new Set(legacyOrder);
    if (unique.size !== steps.length || unique.size !== legacyOrder.length) {
      throw new Error('Reorder inválido: duplicado ou faltando step');
    }
    // Verificar se todos do conjunto original estão presentes
    const originalSet = new Set(steps.map(s => s.id));
    for (const id of legacyOrder) {
      if (!originalSet.has(id)) throw new Error(`Step id ausente no dataset original: ${id}`);
    }
    nextManifest.order = legacyOrder;
  }

  nextManifest.updatedAt = timestamp();
  await writeManifest(baseDir, nextManifest);
  const duration = Date.now() - start;
  try { recordDelta(duration); } catch { /* noop */ }
  return { ok: true, message: 'Delta aplicado e manifest persistido', manifest: nextManifest };
}
