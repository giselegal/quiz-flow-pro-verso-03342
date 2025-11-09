import { describe, it, expect, beforeAll } from 'vitest';
import { hierarchicalTemplateSource } from '@/services/core/HierarchicalTemplateSource';

const steps = Array.from({length: 21}, (_,i) => `step-${String(i+1).padStart(2,'0')}`);

beforeAll(() => {
  if (typeof window !== 'undefined') {
    window.localStorage?.setItem('VITE_TEMPLATE_JSON_ONLY', 'true');
    window.localStorage?.setItem('VITE_DISABLE_SUPABASE', 'true');
    window.localStorage?.setItem('VITE_DISABLE_TEMPLATE_OVERRIDES', 'true');
  }
});

describe('HierarchicalTemplateSource getPrimary benchmark', () => {
  it('first load (frio)', async () => {
    const t0 = performance.now();
    const times: number[] = [];
    for (const step of steps) {
      const s = performance.now();
      const res = await hierarchicalTemplateSource.getPrimary(step);
      expect(Array.isArray(res.data)).toBe(true);
      times.push(performance.now() - s);
    }
    const total = performance.now() - t0;
    const avg = times.reduce((a,b)=>a+b,0)/times.length;
    // eslint-disable-next-line no-console
    console.log('[BENCH] first-load total(ms)=', total.toFixed(1), 'avg(ms)=', avg.toFixed(1));
  });

  it('cache load (memória + IndexedDB se ativo)', async () => {
    if (typeof window !== 'undefined') {
      window.localStorage?.setItem('VITE_ENABLE_INDEXEDDB_CACHE','true');
    }
    const times: number[] = [];
    for (const step of steps) {
      const s = performance.now();
      const res = await hierarchicalTemplateSource.getPrimary(step);
      expect(Array.isArray(res.data)).toBe(true);
      times.push(performance.now() - s);
    }
    const avg = times.reduce((a,b)=>a+b,0)/times.length;
    // eslint-disable-next-line no-console
    console.log('[BENCH] cache-load avg(ms)=', avg.toFixed(1));
  });
});
