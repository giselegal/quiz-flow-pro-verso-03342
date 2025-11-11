import { describe, it, expect } from 'vitest';
import { loadStepFromJson } from '@/templates/loaders/jsonStepLoader';

/**
 * Teste básico de verificação da migração v3.2:
 * - Confirma que step-01 do template quiz21StepsComplete carrega blocos
 * - Garante compatibilidade com formato { blocks: [] } e Array<Block>
 */

describe('jsonStepLoader v3.2', () => {
  it('carrega blocos do step-01', async () => {
    const blocks = await loadStepFromJson('step-01', 'quiz21StepsComplete');
    expect(blocks).toBeTruthy();
    expect(Array.isArray(blocks)).toBe(true);
    expect(blocks!.length).toBeGreaterThan(0);

    // Verifica estrutura mínima dos blocos
    const first = blocks![0] as any;
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('type');
  });
});
