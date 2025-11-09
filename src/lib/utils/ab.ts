/**
 * Simple A/B assignment utility with deterministic localStorage persistence.
 */
export interface ABVariant { key: string; weight: number }

export function assignVariant(experimentKey: string, variants: ABVariant[], forceVariant?: string): string {
  try {
    if (forceVariant) return forceVariant;
    const storageKey = `ab:${experimentKey}`;
    if (typeof window !== 'undefined') {
      const existing = window.localStorage.getItem(storageKey);
      if (existing) return existing;
    }
    const total = variants.reduce((sum, v) => sum + (v.weight || 0), 0) || 1;
    const rnd = Math.random() * total;
    let acc = 0;
    let chosen = variants[0]?.key || 'A';
    for (const v of variants) {
      acc += (v.weight || 0);
      if (rnd <= acc) { chosen = v.key; break; }
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, chosen);
    }
    return chosen;
  } catch {
    return variants[0]?.key || 'A';
  }
}
