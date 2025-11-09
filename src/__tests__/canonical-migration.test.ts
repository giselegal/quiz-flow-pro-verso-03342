import { describe, it, expect } from 'vitest';

// DEPRECATED: HybridTemplateService removido – teste ajustado para canônico
import { templateService } from '@/services/canonical/TemplateService';

describe('Canonical Services Migration Shims', () => {
  it.skip('HybridTemplateService.getStepConfig delega para templateService e retorna estrutura mínima', async () => {
    const res = await templateService.getStep('step-01');
    expect(res.success).toBe(true);
  });

  it('templateService.steps.list retorna 21 steps', () => {
    const res = templateService.steps.list();
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.length).toBe(21);
  });
});
