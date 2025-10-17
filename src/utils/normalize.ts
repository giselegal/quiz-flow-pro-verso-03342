// src/utils/normalize.ts
export const genId = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export function slugify(text = '') {
  // Normaliza acentos (NFD) e remove diacríticos, mantendo apenas a-z 0-9 e '-'
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacríticos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // espaços -> '-'
    .replace(/[^a-z0-9-]/g, '') // remove caracteres não permitidos
    .replace(/--+/g, '-') // condensa múltiplos '-'
    .replace(/^-+|-+$/g, ''); // remove '-' nas extremidades
}

export function normalizeOption(opt: any, stepId: string, idx: number) {
  const id = opt.id || `${stepId}-opt-${idx}`;
  const value = opt.value || slugify(opt.label || opt.text || id);
  return {
    ...opt,
    id,
    value,
    text: opt.text || opt.label || value,
    points: Number(opt.points || opt.score || 0),
    image: opt.image || opt.imageUrl || null,
    imageUrl: opt.imageUrl || opt.image || null,
    metadata: opt.metadata || {},
  };
}

export function normalizeOptions(options: any[] = [], stepId: string) {
  return options.map((o, i) => normalizeOption(o, stepId, i));
}

export function normalizeOfferEntry(key: string, entry: any) {
  const id = entry.id || key || genId('offer');
  return {
    ...entry,
    id,
    title: entry.title,
    description: entry.description || '',
    price: entry.price == null ? null : Number(entry.price),
    currency: entry.currency || 'BRL',
    image: entry.image || null,
    ctaLabel: entry.ctaLabel || 'Aproveitar',
    ctaUrl: entry.ctaUrl || null,
    metadata: entry.metadata || {},
  };
}

export function normalizeOfferMap(map: Record<string, any> = {}) {
  const out: Record<string, any> = {};
  Object.entries(map).forEach(([k, v]) => {
    const entry = normalizeOfferEntry(k, v);
    out[entry.id] = { ...entry };
  });
  return out;
}
