import { describe, it, expect } from 'vitest';

interface LoadResult { pathTried: string[]; blocksCount: number; durationMs: number; }

async function loadStepRaw(stepId: string): Promise<LoadResult> {
  const start = performance.now();
  const paths = [
    `/templates/${stepId}-v3.json`,
    `/templates/blocks/${stepId}.json`,
    `/templates/quiz21-steps/${stepId}.json`,
    `/templates/${stepId}-template.json`,
    `/templates/quiz21-complete.json`,
  ];
  const tried: string[] = [];
  for (const url of paths) {
    tried.push(url);
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) continue;
      const data = await res.json();
      let blocks: any[] | null = null;
      if (Array.isArray(data)) blocks = data;
      else if (data && Array.isArray((data as any).blocks)) blocks = (data as any).blocks;
      else if (data && (data as any).steps && (data as any).steps[stepId]) {
        const stepObj = (data as any).steps[stepId];
        if (Array.isArray(stepObj)) blocks = stepObj; else if (Array.isArray(stepObj?.blocks)) blocks = stepObj.blocks;
      }
      if (blocks && blocks.length > 0) {
        return { pathTried: tried, blocksCount: blocks.length, durationMs: performance.now() - start };
      }
    } catch { /* ignore */ }
  }
  return { pathTried: tried, blocksCount: 0, durationMs: performance.now() - start };
}

const sampleSteps = ['step-01','step-05','step-13','step-20','step-21'];

describe('JSON Loader Performance Benchmark', () => {
  it('mede latência de cada step e identifica primeiro path válido', async () => {
    const results: Record<string, LoadResult> = {};
    for (const step of sampleSteps) {
      results[step] = await loadStepRaw(step);
    }
    const loaded = Object.values(results).filter(r => r.blocksCount > 0);
    expect(loaded.length).toBeGreaterThan(0);
    // eslint-disable-next-line no-console
    console.table(Object.entries(results).map(([step, r]) => ({ step, blocks: r.blocksCount, ms: r.durationMs.toFixed(1), tried: r.pathTried.join(' → ') })));
  });
});
