
/**
 * Carrega overrides de templates JSON em runtime e registra no TemplateRegistry.
 * Ativado quando ENABLE_JSON_TEMPLATE_OVERRIDES=true.
 *
 * Espera um arquivo /templates/index.json com { files: string[] } e arquivos sob /templates/*.json
 * Servidos a partir de public/ em Vite.
 */
let TemplateRegistry: any = null;
async function getTemplateRegistry(): Promise<any> {
  if (TemplateRegistry) return TemplateRegistry;
  try {
    const mod: any = await import('@/services/TemplateRegistry');
    TemplateRegistry = mod?.TemplateRegistry ?? null;
  } catch {
    TemplateRegistry = null;
  }
  return TemplateRegistry;
}
import { JSONv3TemplateSchema } from '@/types/jsonv3.schema';
import { appLogger } from '@/lib/utils/appLogger';

const DEFAULT_INDEX_PATH = '/templates/index.json';

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`fetchJson: ${url} returned ${res.status}`);
  return res.json();
}

export async function loadTemplateOverrides(): Promise<void> {
  try {
    const enabled = (import.meta as any)?.env?.ENABLE_JSON_TEMPLATE_OVERRIDES || (typeof process !== 'undefined' && (process.env as any).ENABLE_JSON_TEMPLATE_OVERRIDES);
    if (!enabled) {
      appLogger.info('[TemplateOverrides] disabled by env');
      return;
    }

    let index: any;
    try {
      index = await fetchJson(DEFAULT_INDEX_PATH);
    } catch (err) {
      appLogger.warn('[TemplateOverrides] could not load index.json', { data: [err] });
      return;
    }

    if (!index || !Array.isArray(index.files)) {
      appLogger.warn('[TemplateOverrides] invalid index.json, expected { files: string[] }');
      return;
    }

    const regCls = await getTemplateRegistry();
    if (!regCls || typeof regCls.getInstance !== 'function') {
      appLogger.warn('[TemplateOverrides] TemplateRegistry indisponível — overrides ignorados');
      return;
    }
    const registry = regCls.getInstance();

    for (const relativePath of index.files) {
      const url = `/templates/${relativePath}`;
      try {
        const tmpl: any = await fetchJson(url);
        const stepId = tmpl.id ?? tmpl.stepId;
        if (!stepId) {
          appLogger.warn('[TemplateOverrides] template missing id/stepId:', { data: [url] });
          continue;
        }
        // 1) Validação suave com Zod (JSON v3) quando parecer um template completo
        //    Mantemos fail-soft: em caso de erro, apenas logamos e seguimos para registrar override mesmo assim.
        try {
          if (tmpl && typeof tmpl === 'object' && (tmpl.sections || tmpl.metadata || tmpl.navigation)) {
            const result = JSONv3TemplateSchema.safeParse(tmpl);
            if (!result.success) {
              appLogger.warn('[TemplateOverrides] JSONv3 validation failed for', { data: [stepId, result.error.issues] });
            }
          }
        } catch (zerr) {
          appLogger.warn('[TemplateOverrides] JSONv3 validation threw error for', { data: [stepId, zerr] });
        }

        // 2) Validação leve para estruturas comuns de blocos
        if (tmpl.options && !Array.isArray(tmpl.options)) {
          appLogger.warn('[TemplateOverrides] template missing valid options array:', { data: [url] });
          continue;
        }
        registry.registerOverride(stepId, tmpl);
        appLogger.info(`[TemplateOverrides] registered override for step ${stepId} from ${relativePath}`);
      } catch (err) {
        appLogger.error('[TemplateOverrides] failed to load template', { data: [relativePath, err] });
      }
    }
  } catch (err) {
    appLogger.error('[TemplateOverrides] unexpected error', { data: [err] });
  }
}
