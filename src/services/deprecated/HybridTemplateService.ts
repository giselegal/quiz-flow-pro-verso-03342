/**
 * 🎯 HYBRID TEMPLATE SERVICE (LEGADO) — Wrapper deprecatado para TemplateService canônico
 * Mantemos a API estática mínima usada pelos chamadores e delegamos para o serviço canônico.
 */

import { templateService } from '@/services/canonical/TemplateService';
import { CanonicalServicesMonitor } from '@/services/canonical/monitoring';

export interface StepBehaviorConfig {
  autoAdvance: boolean;
  autoAdvanceDelay: number;
  showProgress: boolean;
  allowBack: boolean;
}

export interface StepValidationConfig {
  type: 'input' | 'selection' | 'none' | 'transition';
  required: boolean;
  requiredSelections?: number;
  maxSelections?: number;
  minLength?: number;
  message: string;
}

export interface StepTemplate {
  metadata: {
    name: string;
    description: string;
    type: string;
    category: string;
    questionNumber?: number;
    totalQuestions?: number;
  };
  behavior: StepBehaviorConfig;
  validation: StepValidationConfig;
  blocks?: any[];
}

export interface MasterTemplate {
  templateVersion: string;
  templateId?: string;
  metadata: any;
  globalConfig: {
    navigation: {
      autoAdvanceSteps: number[];
      manualAdvanceSteps: number[];
      autoAdvanceDelay: number;
    };
    validation: {
      rules: Record<string, any>;
    };
  };
  steps: Record<string, StepTemplate>;
}

class HybridTemplateService {
  private static warned = false;

  private static warnOnce() {
    if (!this.warned && typeof console !== 'undefined') {
      this.warned = true;
      // Aviso de depreciação padronizado
      console.warn('\n⚠️ DEPRECATED: HybridTemplateService está descontinuado.\nUse: import { templateService } from \'@/services/canonical/TemplateService\'\nSerá removido em: v2.0.0\n');
    }
  }

  static async getTemplate(templateId: string): Promise<any | null> {
    this.warnOnce();
    CanonicalServicesMonitor.trackLegacyBridge('HybridTemplateService', 'getTemplate');
    // Delegar: step-XX → templateService.getStep, quiz21StepsComplete → lista de steps
    if (/^step-?\d{1,2}$/i.test(templateId)) {
      const id = templateId.toLowerCase().replace('step', 'step').replace(/step-?(\d{1,2})/i, (_, n) => `step-${String(n).padStart(2, '0')}`);
      const res = await templateService.getStep(id);
      if (res.success) return res.data;
      return null;
    }

  if (templateId === 'quiz21StepsComplete') {
      // Retorna um objeto com todos os ids de step mapeados para blocos
      const stepsResult = templateService.steps.list();
      if (!stepsResult.success) return null;
      const entries = await Promise.all(
        stepsResult.data.map(async (s) => {
          const r = await templateService.getStep(s.id);
          return [s.id, r.success ? r.data : []] as const;
        }),
      );
      const obj = Object.fromEntries(entries) as any;
      // Anexar metadado de origem para compatibilidade com testes e depuração
      Object.defineProperty(obj, '_source', { value: 'ts', enumerable: false, configurable: true });
      return obj;
    }

    return null;
  }

  static async getStepConfig(stepNumber: number): Promise<StepTemplate> {
    this.warnOnce();
    CanonicalServicesMonitor.trackLegacyBridge('HybridTemplateService', 'getStepConfig');
    const stepId = `step-${String(stepNumber).padStart(2, '0')}`;
    const r = await templateService.getStep(stepId);
    const blocks = r.success ? r.data : [];
    // Monta estrutura mínima esperada pelos chamadores legados
    const type = stepNumber === 1 ? 'intro' : stepNumber === 20 ? 'result' : stepNumber === 21 ? 'offer' : (stepNumber === 12 || stepNumber === 19) ? 'transition' : (stepNumber >= 13 && stepNumber <= 18) ? 'strategic' : 'question';
    const totalQuestions = 16;
    let questionNumber: number | undefined = undefined;
    if (stepNumber >= 2 && stepNumber <= 11) questionNumber = stepNumber - 1;
    if (stepNumber >= 13 && stepNumber <= 18) questionNumber = 10 + (stepNumber - 12);

    const cfg: StepTemplate & { _source?: string } = {
      metadata: {
        name: `Step ${stepNumber}`,
        description: `Etapa ${stepNumber}`,
        type,
        category: 'quiz',
        ...(questionNumber ? { questionNumber, totalQuestions } : {}),
      },
      behavior: {
        autoAdvance: stepNumber >= 2 && stepNumber <= 11,
        autoAdvanceDelay: stepNumber >= 2 && stepNumber <= 11 ? 1500 : 0,
        showProgress: stepNumber !== 1,
        allowBack: stepNumber !== 1,
      },
      validation: {
        type: stepNumber === 1 ? 'input' : (stepNumber === 12 || stepNumber === 19) ? 'transition' : stepNumber >= 2 && stepNumber <= 18 ? 'selection' : 'none',
        required: stepNumber === 1 || (stepNumber >= 2 && stepNumber <= 18),
        requiredSelections: (stepNumber >= 2 && stepNumber <= 11) ? 3 : (stepNumber >= 13 && stepNumber <= 18) ? 1 : undefined,
        maxSelections: (stepNumber >= 2 && stepNumber <= 11) ? 3 : (stepNumber >= 13 && stepNumber <= 18) ? 1 : undefined,
        minLength: stepNumber === 1 ? 2 : undefined,
        message: '',
      },
      blocks,
    };
    // compat: indicar que a origem é o fonte TS
    Object.defineProperty(cfg, '_source', { value: 'ts', enumerable: false, configurable: true });
    return cfg;
  }

  static async getMasterTemplate(): Promise<MasterTemplate | null> {
    this.warnOnce();
    CanonicalServicesMonitor.trackLegacyBridge('HybridTemplateService', 'getMasterTemplate');
    // Construir estrutura simples com todos os steps
    const stepsList = templateService.steps.list();
    if (!stepsList.success) return null;
    const entries = await Promise.all(
      stepsList.data.map(async (s) => {
        const n = parseInt(s.id.replace(/\D/g, ''), 10);
        const cfg = await this.getStepConfig(n);
        return [s.id, cfg] as const;
      }),
    );
    const master: MasterTemplate & { _source?: string } = {
      templateVersion: '3.0',
      metadata: {},
      templateId: 'quiz21StepsComplete',
      globalConfig: {
        navigation: { autoAdvanceSteps: [], manualAdvanceSteps: [], autoAdvanceDelay: 0 },
        validation: { rules: {} },
      },
      steps: Object.fromEntries(entries),
    };
    Object.defineProperty(master, '_source', { value: 'ts', enumerable: false, configurable: true });
    return master;
  }

  static clearCache(): void {
    this.warnOnce();
    CanonicalServicesMonitor.trackLegacyBridge('HybridTemplateService', 'clearCache');
    templateService.clearCache();
  }

  static async reload(): Promise<void> {
    this.warnOnce();
    CanonicalServicesMonitor.trackLegacyBridge('HybridTemplateService', 'reload');
    templateService.clearCache();
  }

  static getGlobalConfig(): MasterTemplate['globalConfig'] | { navigation: any; validation: any } {
    this.warnOnce();
    CanonicalServicesMonitor.trackLegacyBridge('HybridTemplateService', 'getGlobalConfig');
    return {
      navigation: { autoAdvanceSteps: [], manualAdvanceSteps: [], autoAdvanceDelay: 0 },
      validation: { rules: {} },
    };
  }

  static async saveStepOverride(_stepNumber: number, _changes: Partial<StepTemplate>): Promise<void> {
    this.warnOnce();
    CanonicalServicesMonitor.trackLegacyBridge('HybridTemplateService', 'saveStepOverride');
    // No-op neste wrapper
  }
}

export default HybridTemplateService;