import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ResultEngine } from '@/services/core/ResultEngine';

// Simula localStorage/sessionStorage no ambiente de teste
beforeEach(() => {
  const store: Record<string, string> = {};
  const makeStorage = () => ({
    getItem: vi.fn((k: string) => (k in store ? store[k] : null)),
    setItem: vi.fn((k: string, v: string) => (store[k] = v)),
    removeItem: vi.fn((k: string) => delete store[k]),
    clear: vi.fn(() => Object.keys(store).forEach((k) => delete store[k])),
    key: vi.fn(),
    length: 0,
  }) as unknown as Storage;

  (globalThis as any).localStorage = makeStorage();
  (globalThis as any).sessionStorage = makeStorage();
});

describe('ResultEngine', () => {
  it('computeScoresFromSelections soma por prefixo e aplica peso', () => {
    const selections = {
      q1: ['natural_a', 'classico_b'],
      q2: ['natural_c'],
      q3: ['criativo_x', 'criativo_y'],
    } as Record<string, string[]>;

    const { scores, total } = ResultEngine.computeScoresFromSelections(selections, {
      weightQuestions: 2,
    });

    expect(scores['Natural']).toBe(2 * 2); // duas escolhas "natural_*" com peso 2
    expect(scores['Clássico']).toBe(1 * 2);
    expect(scores['Criativo']).toBe(2 * 2);
    // Estilos não mencionados ficam 0
    expect(scores['Elegante']).toBe(0);
    expect(total).toBe(Object.values(scores).reduce((a, b) => a + b, 0));
  });

  it('toPayload ordena por score e preenche userData', () => {
    const scores = { Natural: 5, 'Clássico': 3, Criativo: 2 } as any;
    const payload = ResultEngine.toPayload(scores, 10, 'Maria');

    expect(payload.version).toBe('v1');
    expect(payload.primaryStyle.style).toBe('Natural');
    expect(payload.secondaryStyles[0].style).toBe('Clássico');
    expect(payload.totalQuestions).toBe(10);
    expect(payload.userData?.name).toBe('Maria');
    // Percentuais coerentes
    expect(payload.primaryStyle.percentage).toBe(Math.round((5 / 10) * 100));
  });

  it('persist salva no StorageService.quizResult', () => {
    const ok = ResultEngine.persist({
      version: 'v1',
      primaryStyle: { style: 'Natural', category: 'Natural', score: 5, percentage: 50 },
      secondaryStyles: [],
      scores: { Natural: 5 } as any,
      totalQuestions: 10,
      userData: { name: 'Ana' },
    });
    expect(ok).toBe(true);
    const raw = localStorage.getItem('quizResult');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(String(raw));
    expect(parsed?.userData?.name).toBe('Ana');
  });
});
