/**
 * Carrega overrides de templates JSON em runtime e registra no TemplateRegistry.
 * Ativado quando ENABLE_JSON_TEMPLATE_OVERRIDES=true.
 *
 * Espera um arquivo /templates/index.json com { files: string[] } e arquivos sob /templates/*.json
 * Servidos a partir de public/ em Vite.
 */
import { TemplateRegistry } from '@/services/TemplateRegistry';

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
      console.info('[TemplateOverrides] disabled by env');
      return;
    }

    let index: any;
    try {
      index = await fetchJson(DEFAULT_INDEX_PATH);
    } catch (err) {
      console.warn('[TemplateOverrides] could not load index.json', err);
      return;
    }

    if (!index || !Array.isArray(index.files)) {
      console.warn('[TemplateOverrides] invalid index.json, expected { files: string[] }');
      return;
    }

    const registry = TemplateRegistry.getInstance();

    for (const relativePath of index.files) {
      const url = `/templates/${relativePath}`;
      try {
        const tmpl: any = await fetchJson(url);
        const stepId = tmpl.id ?? tmpl.stepId;
        if (!stepId) {
          console.warn('[TemplateOverrides] template missing id/stepId:', url);
          continue;
        }
        // Validação suave: exigir array de options quando apropriado
        if (tmpl.options && !Array.isArray(tmpl.options)) {
          console.warn('[TemplateOverrides] template missing valid options array:', url);
          continue;
        }
        registry.registerOverride(stepId, tmpl);
        console.info(`[TemplateOverrides] registered override for step ${stepId} from ${relativePath}`);
      } catch (err) {
        console.error('[TemplateOverrides] failed to load template', relativePath, err);
      }
    }
  } catch (err) {
    console.error('[TemplateOverrides] unexpected error', err);
  }
}
