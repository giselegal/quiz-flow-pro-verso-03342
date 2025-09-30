// 📊 QUIZ DATA SERVICE (refatorado para usar gateway canônico)
import { quizEstiloLoaderGateway, mapStepsToStepBlocks } from '@/domain/quiz/gateway';
import type { CanonicalStep } from '@/domain/quiz/gateway/QuizEstiloLoaderGateway';

interface CachedData { stepBlocks: Record<string, any[]>; loadedAt: number }
const CACHE_TTL = 60_000; // 1 min
let _cache: CachedData | null = null;

async function ensureCache() {
  const now = Date.now();
  if (_cache && (now - _cache.loadedAt) < CACHE_TTL) return _cache.stepBlocks;
  const def = await quizEstiloLoaderGateway.load();
  const mapped = mapStepsToStepBlocks(def.steps as CanonicalStep[]);
  _cache = { stepBlocks: mapped, loadedAt: now };
  return mapped;
}

export class QuizDataService {
  /**
   * Buscar dados de uma etapa específica
   */
  static async getStepData(stepNumber: number) {
    const stepKey = `step-${stepNumber}`;
    const blocks = await ensureCache();
    return blocks[stepKey] || [];
  }

  /**
   * Buscar todas as etapas
   */
  static async getAllSteps() {
    return ensureCache();
  }

  /**
   * Obter configuração de uma etapa
   */
  static async getStepConfig(stepNumber: number) {
    const blocks = await this.getStepData(stepNumber);

    return {
      stepNumber,
      totalBlocks: blocks.length,
      hasForm: blocks.some(b => b.type === 'form-container'),
      hasQuestion: blocks.some(b => b.type === 'options-grid'),
      hasTransition: blocks.some(b => b.type === 'hero'),
      blockTypes: [...new Set(blocks.map(b => b.type))],
    };
  }

  /**
   * Validar estrutura de uma etapa
   */
  static async validateStep(stepNumber: number) {
    const blocks = await this.getStepData(stepNumber);

    return {
      isValid: blocks.length > 0,
      hasContent: blocks.some(b => b.content && Object.keys(b.content).length > 0),
      hasProperties: blocks.some(b => b.properties && Object.keys(b.properties).length > 0),
      errors: [],
    };
  }
}
