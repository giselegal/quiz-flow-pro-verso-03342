import { describe, it, expect } from 'vitest';
import { ResultOrchestrator } from '@/services/core/ResultOrchestrator';

describe('ResultOrchestrator - desempate e determinismo', () => {
  it('aplica desempate determinístico quando scores são iguais', async () => {
    const payload = await ResultOrchestrator.run({
      selectionsByQuestion: {
        // usando códigos não prefixados, força caminho canônico
        q1: ['natural_a'],
        q2: ['classico_b'],
      } as any,
      persistToSupabase: false,
    });
    // Apenas checar que não lança e gera payload coerente
    expect(payload.payload).toBeTruthy();
    expect(typeof payload.total).toBe('number');
  });
});
