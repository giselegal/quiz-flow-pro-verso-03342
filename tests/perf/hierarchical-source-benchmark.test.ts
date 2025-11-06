import { describe, it, expect, beforeAll } from 'vitest';
import { hierarchicalTemplateSource } from '@/services/core/HierarchicalTemplateSource';

// Bench simples do getPrimary em sequência e com repetição para medir cache
const steps = Array.from({length: 21}, (_,i) => `step-${String(i+1).padStart(2,'0')}`);

function setEnvFlag(key: string, value: string) {
  (globalThis as any).import_meta_env = (globalThis as any).import_meta_env || {};
  try { (import.meta as any).env[key] = value; } catch { (globalThis as any).import_meta_env[key] = value; }
}

beforeAll(() => {
  // Forçar JSON-only e desativar Supabase
  if (typeof window !== 'undefined') {
    window.localStorage?.setItem('VITE_TEMPLATE_JSON_ONLY', 'true');
    window.localStorage?.setItem('VITE_DISABLE_SUPABASE', 'true');
    window.localStorage?.setItem('VITE_DISABLE_TEMPLATE_OVERRIDES', 'true');
  }
  setEnvFlag('VITE_TEMPLATE_JSON_ONLY','true');
  setEnvFlag('VITE_DISABLE_SUPABASE','true');
  setEnvFlag('VITE_DISABLE_TEMPLATE_OVERRIDES','true');
});

describe('HierarchicalTemplateSource getPrimary benchmark', () => {
  it('carrega todos os steps (primeira vez) e mede tempo total/médio', async () => {
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
    console.log('getPrimary first-load total(ms)=', total.toFixed(1), 'avg(ms)=', avg.toFixed(1));
  });

  it('mede cache hit (memória e IndexedDB se ativado)', async () => {
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
    console.log('getPrimary cache-load avg(ms)=', avg.toFixed(1));
  });
});
