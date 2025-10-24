import { describe, it, expect } from 'vitest';

import { HybridTemplateService } from '@/services/aliases';
import { templateService } from '@/services/canonical/TemplateService';

describe('Canonical Services Migration Shims', () => {
  it('HybridTemplateService.getStepConfig delega para templateService e retorna estrutura mínima', async () => {
    const cfg = await HybridTemplateService.getStepConfig(1);
    expect(cfg).toBeTruthy();
    expect(cfg.metadata).toBeTruthy();
    expect(Array.isArray(cfg.blocks)).toBe(true);
  });

  it('templateService.steps.list retorna 21 steps', () => {
    const res = templateService.steps.list();
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.length).toBe(21);
  });
});
