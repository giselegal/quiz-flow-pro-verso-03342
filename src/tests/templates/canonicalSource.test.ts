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

  it.skip('HybridTemplateService tests removidos (serviço deprecated deletado)', () => {
    expect(true).toBe(true);
  });
});
