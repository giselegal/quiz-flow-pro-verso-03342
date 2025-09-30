import { quizEstiloLoaderGateway } from '@/domain/quiz/gateway';
import type { CanonicalStep } from '@/domain/quiz/gateway/QuizEstiloLoaderGateway';
import { mapStepsToStepBlocks } from '@/domain/quiz/gateway';
import type { Block } from '@/types/editor';

/**
 * QuizLegacyTemplateAdapter
 * Fornece uma interface semelhante ao antigo QUIZ_STYLE_21_STEPS_TEMPLATE
 * porém baseada no gateway canônico. Objetivo: retirar imports diretos
 * de quiz21StepsComplete sem quebrar componentes até refactor completo.
 */
class QuizLegacyTemplateAdapter {
  private cache: { steps: Record<string, Block[]>; loadedAt: number } | null = null;
  private ttl = 60_000; // 1 minuto (curto para facilitar migração)

  async ensureLoaded() {
    const now = Date.now();
    if (this.cache && (now - this.cache.loadedAt) < this.ttl) return this.cache.steps;
    const def = await quizEstiloLoaderGateway.load();
    const stepBlocks = mapStepsToStepBlocks(def.steps as CanonicalStep[]);
    this.cache = { steps: stepBlocks, loadedAt: now };
    return stepBlocks;
  }

  async getAll(): Promise<Record<string, Block[]>> {
    return this.ensureLoaded();
  }

  async getStep(stepKey: string): Promise<Block[]> {
    const all = await this.ensureLoaded();
    return all[stepKey] || [];
  }
}

export const quizLegacyTemplateAdapter = new QuizLegacyTemplateAdapter();