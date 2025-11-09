import { describe, it, expect } from 'vitest';
import { templateService } from '@/services/canonical/TemplateService';

// TESTES SIMPLIFICADOS: Fluxos antigos dependiam de TemplateEditorService e HybridTemplateService.
// Agora validamos apenas operações básicas do TemplateService para manter cobertura mínima.

describe('TemplateService Basic Operations', () => {
  it('carrega um step existente', async () => {
    const res = await templateService.getStep('step-01');
    expect(res.success).toBe(true);
    if (res.success) {
      expect(Array.isArray(res.data)).toBe(true);
    }
  });

  it('retorna array vazio para step inexistente', async () => {
    const res = await templateService.getStep('step-99');
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.length).toBe(0);
  });

  it('lista steps configurados (zero antes de prepareTemplate)', () => {
    const list = templateService.steps.list();
    expect(list.success).toBe(true);
    if (list.success) expect(list.data.length).toBe(0);
  });
});
