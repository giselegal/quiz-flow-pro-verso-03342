import { describe, test, expect, vi, beforeEach } from 'vitest';

// Import alvo (lazy) – vamos mockar loader antes de puxar runtime

describe('quiz runtime resilience', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  test('retorna null e loga erro quando loader lança exceção', async () => {
    const error = new Error('Boom');
    vi.doMock('../loader', () => ({
      loadQuizDefinition: () => { throw error; }
    }));
    const spyError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { getQuizDefinition } = await import('../runtime');
    const def = getQuizDefinition();
    expect(def).toBeNull();
    expect(spyError).toHaveBeenCalledWith(
      expect.stringContaining('[quiz-runtime] falha ao carregar definição canônica. Usando fallback QUIZ_STEPS.'),
      error.message
    );
  });

  test('retorna definição quando loader funciona', async () => {
    vi.doMock('../loader', () => ({
      loadQuizDefinition: () => ({ definition: { id: 'x', version: '1', status: 'draft', createdAt: '2025-01-01', updatedAt: '2025-01-01', steps: [], scoring: { styles: [], defaultWeight: 1 }, progress: { countedStepIds: [] }, seo: { title: '', description: '', keywords: [], ogTitle: '', ogDescription: '' }, tracking: { events: [] }, offerMapping: { strategicFinalStepId: '' }, integrity: { hash: 'abc12345' } }, warnings: [] })
    }));
    const { getQuizDefinition } = await import('../runtime');
    const def = getQuizDefinition();
    expect(def).not.toBeNull();
    expect(def?.id).toBe('x');
  });
});
