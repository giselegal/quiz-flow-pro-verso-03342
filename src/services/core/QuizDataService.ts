// 📊 QUIZ DATA SERVICE (migrado para templateService canônico com cache síncrono)
import { templateService } from '@/services';

// Cache síncrono para manter API compatível
let __cachedSteps: Record<string, any[]> = {};
let __warmupStarted = false;

async function __warmupCache() {
  try {
    const result = await templateService.getTemplate('quiz21StepsComplete');
    const full = result.success ? (result.data as any) : null;
    if (full?.steps?.length) {
      const map: Record<string, any[]> = {};
      for (const s of (full.steps as any[])) {
        map[`step-${s.stepNumber}`] = s.blocks || [];
      }
      __cachedSteps = map;
      return;
    }
    // Fallback: carregar por etapa
    const map: Record<string, any[]> = {};
    for (let i = 1; i <= 21; i++) {
      try {
        const result = await templateService.getStep(`step-${i}`);
        const blocks = result.success ? (result.data as any[]) : [];
        map[`step-${i}`] = blocks || [];
      } catch {
        map[`step-${i}`] = [];
      }
    }
    __cachedSteps = map;
  } catch {
    // Se falhar, mantém cache atual (potencialmente vazio)
  }
}

function __ensureCacheWarm() {
  if (__warmupStarted) return;
  __warmupStarted = true;
  // Disparar aquecimento sem bloquear chamadas síncronas
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      __warmupCache().catch(() => { });
    }, 0);
  } else {
    // Em ambiente server, disparar sem esperar
    __warmupCache().catch(() => { });
  }
}

export class QuizDataService {
  /**
   * Buscar dados de uma etapa específica
   */
  static getStepData(stepNumber: number) {
    __ensureCacheWarm();
    const stepKey = `step-${stepNumber}`;
    return __cachedSteps[stepKey] || [];
  }

  /**
   * Buscar todas as etapas
   */
  static getAllSteps() {
    __ensureCacheWarm();
    return __cachedSteps;
  }

  /**
   * Obter configuração de uma etapa
   */
  static getStepConfig(stepNumber: number) {
    const blocks = this.getStepData(stepNumber);

    return {
      stepNumber,
      totalBlocks: blocks.length,
      hasForm: blocks.some((b: any) => b.type === 'form-container'),
      hasQuestion: blocks.some((b: any) => b.type === 'options-grid'),
      hasTransition: blocks.some((b: any) => b.type === 'hero'),
      blockTypes: [...new Set(blocks.map((b: any) => b.type))],
    };
  }

  /**
   * Validar estrutura de uma etapa
   */
  static validateStep(stepNumber: number) {
    const blocks = this.getStepData(stepNumber);

    return {
      isValid: blocks.length > 0,
      hasContent: blocks.some((b: any) => b.content && Object.keys(b.content).length > 0),
      hasProperties: blocks.some((b: any) => b.properties && Object.keys(b.properties).length > 0),
      errors: [],
    };
  }
}
