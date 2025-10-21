/**
 * 🔧 Normalização de blocos e tipos
 * - Unifica variações como 'options-grid' → 'options grid'
 * - Pode ser expandido para outros aliases
 */

export function normalizeBlockType(type: string): string {
  if (!type) return type;
  const t = String(type).trim().toLowerCase();
  // Mapear aliases para o canônico com hífen
  if (t === 'options grid') return 'options-grid';
  return t;
}

export function normalizeTemplateBlocks(template: any): any {
  if (!template) return template;
  const clone = JSON.parse(JSON.stringify(template));
  const entries = Object.entries(clone) as [string, any][];
  entries.forEach(([stepId, step]) => {
    if (Array.isArray(step?.blocks)) {
      step.blocks = step.blocks.map((b: any) => ({
        ...b,
        type: normalizeBlockType(b?.type)
      }));
    }
    if (Array.isArray(step?.sections)) {
      step.sections = step.sections.map((s: any) => ({
        ...s,
        type: normalizeBlockType(s?.type)
      }));
    }
  });
  return clone;
}
