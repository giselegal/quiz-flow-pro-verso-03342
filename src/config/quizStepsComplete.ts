// utilitário para normalizar/consultar step blocks
export type EditorBlock = any;
export type RawStepBlocks = Record<string | number, unknown>;
export type StepBlocks = Record<string, EditorBlock[]>;

function parseStepKey(key: string | number): number | null {
  if (typeof key === 'number' && Number.isFinite(key)) return Number(key);
  if (typeof key !== 'string') return null;
  const m = key.match(/(\d+)/);
  if (m) return Number(m[1]);
  return null;
}

export function candidateKeysForStep(step: number | string) {
  const n = typeof step === 'number' ? step : parseInt(String(step), 10);
  const keys: Array<string | number> = [];
  if (!Number.isFinite(n) || Number.isNaN(n)) {
    keys.push(String(step));
    return keys;
  }
  keys.push(`step-${n}`);
  keys.push(`step${n}`);
  keys.push(String(n));
  keys.push(n);
  return keys;
}

export function getBlocksForStep(
  step: number | string,
  stepBlocks?: RawStepBlocks | null
): EditorBlock[] | undefined {
  if (!stepBlocks) return undefined;
  const candidates = candidateKeysForStep(step);
  for (const key of candidates) {
    const raw = (stepBlocks as any)[key] ?? (stepBlocks as any)[String(key)];
    if (!raw) continue;
    if (Array.isArray(raw)) return raw as EditorBlock[];
    if (raw && typeof raw === 'object' && 'blocks' in (raw as Record<string, any>)) {
      const maybe = (raw as Record<string, any>).blocks;
      if (Array.isArray(maybe)) return maybe as EditorBlock[];
    }
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed as EditorBlock[];
        if (parsed && typeof parsed === 'object' && Array.isArray((parsed as any).blocks))
          return (parsed as any).blocks;
      } catch (e) {}
    }
    if (raw && typeof raw === 'object') {
      const vals = Object.values(raw);
      if (vals.length > 0 && vals.every(v => typeof v === 'object')) return vals as EditorBlock[];
    }
  }
  return undefined;
}

export function normalizeStepBlocks(raw?: RawStepBlocks | null): StepBlocks {
  const out: StepBlocks = {};
  if (!raw) return out;
  for (const [k, v] of Object.entries(raw as Record<string, any>)) {
    const parsed = parseStepKey(k);
    const targetKey = parsed !== null ? `step-${parsed}` : k;
    let blocks: EditorBlock[] | undefined;
    if (Array.isArray(v)) blocks = v as EditorBlock[];
    else if (v && typeof v === 'object' && Array.isArray((v as any).blocks))
      blocks = (v as any).blocks;
    else if (typeof v === 'string') {
      try {
        const parsedJson = JSON.parse(v);
        if (Array.isArray(parsedJson)) blocks = parsedJson;
        else if (parsedJson && typeof parsedJson === 'object' && Array.isArray(parsedJson.blocks))
          blocks = parsedJson.blocks;
      } catch (e) {}
    } else if (v && typeof v === 'object') {
      const vals = Object.values(v);
      if (vals.length > 0 && vals.every(x => typeof x === 'object')) blocks = vals as EditorBlock[];
    }
    if (blocks && blocks.length > 0) out[targetKey] = blocks;
  }
  return out;
}

export function mergeStepBlocks(base: StepBlocks, incoming: RawStepBlocks): StepBlocks {
  const normalizedIncoming = normalizeStepBlocks(incoming);
  const result: StepBlocks = { ...base };

  for (const [stepKey, incomingBlocks] of Object.entries(normalizedIncoming)) {
    const existing = result[stepKey] ?? [];

    // Índice por ID para merge estável
    const byId = new Map<string, any>();
    existing.forEach(b => byId.set(String((b as any)?.id ?? ''), b));

    const merged: any[] = [...existing];

    for (const inc of incomingBlocks as any[]) {
      const incId = String(inc?.id ?? '');
      if (incId && byId.has(incId)) {
        // Merge profundo e estável (properties/content)
        const prev = byId.get(incId);
        const mergedBlock = {
          ...prev,
          ...inc,
          properties: { ...(prev?.properties || {}), ...(inc?.properties || {}) },
          content: { ...(prev?.content || {}), ...(inc?.content || {}) },
        };
        const idx = merged.findIndex(b => String(b?.id ?? '') === incId);
        if (idx >= 0) merged[idx] = mergedBlock;
        byId.set(incId, mergedBlock);
      } else {
        // Acrescentar sem remover existentes do template
        merged.push(inc);
        if (incId) byId.set(incId, inc);
      }
    }

    // Ordenar por campo 'order' se existir
    merged.sort((a, b) => {
      const ao = (a as any)?.order ?? 0;
      const bo = (b as any)?.order ?? 0;
      return ao - bo;
    });

    result[stepKey] = merged as any[];
  }

  return result;
}

export default {
  parseStepKey,
  candidateKeysForStep,
  getBlocksForStep,
  normalizeStepBlocks,
  mergeStepBlocks,
};
