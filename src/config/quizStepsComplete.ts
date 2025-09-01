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

export function getBlocksForStep(step: number | string, stepBlocks?: RawStepBlocks | null): EditorBlock[] | undefined {
  // 🔍 INVESTIGAÇÃO #3: Enhanced block loading diagnostics
  const debugInfo = {
    step,
    stepType: typeof step,
    hasStepBlocks: !!stepBlocks,
    stepBlocksKeys: stepBlocks ? Object.keys(stepBlocks) : [],
    candidates: candidateKeysForStep(step),
    timestamp: new Date().toISOString()
  };

  if (!stepBlocks) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('🔍 getBlocksForStep: stepBlocks is null/undefined', debugInfo);
    }
    return undefined;
  }

  const candidates = candidateKeysForStep(step);

  for (const key of candidates) {
    const raw = (stepBlocks as any)[key] ?? (stepBlocks as any)[String(key)];
    if (!raw) continue;

    // Enhanced logging for successful lookups
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ getBlocksForStep: Found blocks', {
        ...debugInfo,
        foundKey: key,
        blocksCount: Array.isArray(raw) ? raw.length : 0,
        blocksType: typeof raw
      });
    }

    if (Array.isArray(raw)) {
      if (process.env.NODE_ENV === 'development' && Number(step) <= 3) { // Log first 3 steps for debugging
        console.log('🔍 getBlocksForStep SUCCESS:', {
          ...debugInfo,
          foundKey: key,
          blocksCount: raw.length,
          blockTypes: raw.map(b => b?.type || 'unknown')
        });
      }
      return raw as EditorBlock[];
    }

    if (raw && typeof raw === 'object' && 'blocks' in (raw as Record<string, any>)) {
      const maybe = (raw as Record<string, any>).blocks;
      if (Array.isArray(maybe)) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 getBlocksForStep SUCCESS (nested blocks):', {
            ...debugInfo,
            foundKey: key,
            blocksCount: maybe.length
          });
        }
        return maybe as EditorBlock[];
      }
    }

    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed as EditorBlock[];
        if (parsed && typeof parsed === 'object' && Array.isArray((parsed as any).blocks)) return (parsed as any).blocks;
      } catch (e) { }
    }

    if (raw && typeof raw === 'object') {
      const vals = Object.values(raw);
      if (vals.length > 0 && vals.every(v => typeof v === 'object')) return vals as EditorBlock[];
    }
  }

  // 🔍 INVESTIGAÇÃO #3: Log failed lookups for debugging
  if (process.env.NODE_ENV === 'development') {
    console.warn('🔍 getBlocksForStep: No blocks found', {
      ...debugInfo,
      availableKeys: stepBlocks ? Object.keys(stepBlocks).slice(0, 10) : [], // Limit output
      firstKeyContent: stepBlocks ? (stepBlocks as any)[Object.keys(stepBlocks)[0]] : null
    });

    // Add failed lookups to window for debugging  
    window.__EDITOR_FAILED_BLOCK_LOOKUPS__ = window.__EDITOR_FAILED_BLOCK_LOOKUPS__ || [];
    window.__EDITOR_FAILED_BLOCK_LOOKUPS__.push(debugInfo);
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
    else if (v && typeof v === 'object' && Array.isArray((v as any).blocks)) blocks = (v as any).blocks;
    else if (typeof v === 'string') {
      try {
        const parsedJson = JSON.parse(v);
        if (Array.isArray(parsedJson)) blocks = parsedJson;
        else if (parsedJson && typeof parsedJson === 'object' && Array.isArray(parsedJson.blocks)) blocks = parsedJson.blocks;
      } catch (e) { }
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
    const existing = base[stepKey] ?? [];

    const existingById = new Map<string, any>();
    existing.forEach(b => existingById.set(String((b as any)?.id ?? ''), b));

    const mergedForStep: any[] = [];
    for (const inc of incomingBlocks as any[]) {
      const incId = String(inc?.id ?? '');
      const prev = incId ? existingById.get(incId) : undefined;
      const mergedBlock = prev
        ? {
          ...prev,
          ...inc,
          properties: { ...(prev?.properties || {}), ...(inc?.properties || {}) },
          content: { ...(prev?.content || {}), ...(inc?.content || {}) },
        }
        : inc;
      mergedForStep.push(mergedBlock);
    }

    mergedForStep.sort((a, b) => {
      const ao = (a as any)?.order ?? 0;
      const bo = (b as any)?.order ?? 0;
      return ao - bo;
    });

    result[stepKey] = mergedForStep as any[];
  }

  return result;
}

export default { parseStepKey, candidateKeysForStep, getBlocksForStep, normalizeStepBlocks, mergeStepBlocks };
