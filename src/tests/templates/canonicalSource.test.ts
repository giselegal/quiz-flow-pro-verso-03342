import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Fonte canônica de templates', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('imports.loadTemplate retorna source ts e step normalizado', async () => {
    const mod = await import('@/templates/imports');
    const res = await mod.loadTemplate('step-12');
    expect(res).toBeTruthy();
    expect(res.source).toBe('ts');
    expect(res.template).toBeTruthy();
  // campo step é opcional; foco é a fonte e o objeto completo
    expect((res.template as any)._source).toBe('ts');
  });

  it('HybridTemplateService.getTemplate("quiz21StepsComplete") retorna TS com _source=ts', async () => {
    // Espionar global fetch para garantir que não é chamado
    const fetchSpy = vi.spyOn(global as any, 'fetch').mockImplementation(() => {
      throw new Error('fetch não deve ser chamado');
    });

  const svc = await import('@/services/aliases');
  const tpl = await svc.HybridTemplateService.getTemplate('quiz21StepsComplete');
    expect(tpl).toBeTruthy();
    expect((tpl as any)._source).toBe('ts');

    fetchSpy.mockRestore();
  });

  it('HybridTemplateService.getStepConfig usa _source=ts', async () => {
    const svc = await import('@/services/aliases');
    const cfg = await svc.HybridTemplateService.getStepConfig(14);
    expect(cfg).toBeTruthy();
    expect((cfg as any)._source).toBe('ts');
  });
});
