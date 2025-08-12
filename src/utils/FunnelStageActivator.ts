import { FunnelStage } from '@/types/editor';
import React from 'react';

/**
 * Sistema de Ativação Automática das Etapas
 *
 * Gerencia a ativação automática das 21 etapas baseado nas regras definidas no JSON:
 * - Etapa 1: Ativa após nome preenchido
 * - Etapas 2-14: Ativa após 3 seleções; auto avanço
 * - Etapas estratégicas (16-18): Ativa após 1 seleção; avanço manual
 * - Etapas de resultado/conversão: Baseado em lógica específica
 */

export interface ActivationRules {
  intro: {
    activateOn: 'name-filled';
    requiredField: string;
  };
  questions: {
    activateOn: 'min-selections';
    minSelections: number;
    autoAdvance: boolean;
    stages: number[];
  };
  strategic: {
    activateOn: 'single-selection';
    autoAdvance: false;
    manualClick: true;
    stages: number[];
  };
  transitions: {
    activateOn: 'automatic';
    delay: number;
    stages: number[];
  };
  results: {
    activateOn: 'calculation-complete';
    stages: number[];
  };
  conversion: {
    activateOn: 'user-interaction';
    stages: number[];
  };
}

export const FUNNEL_ACTIVATION_RULES: ActivationRules = {
  intro: {
    activateOn: 'name-filled',
    requiredField: 'userName',
  },
  questions: {
    activateOn: 'min-selections',
    minSelections: 3,
    autoAdvance: true,
    stages: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  },
  strategic: {
    activateOn: 'single-selection',
    autoAdvance: false,
    manualClick: true,
    stages: [16, 17, 18],
  },
  transitions: {
    activateOn: 'automatic',
    delay: 3000,
    stages: [15, 19],
  },
  results: {
    activateOn: 'calculation-complete',
    stages: [20],
  },
  conversion: {
    activateOn: 'user-interaction',
    stages: [21],
  },
};

export class FunnelStageActivator {
  private static instance: FunnelStageActivator;
  private listeners: Map<string, (stage: FunnelStage) => void> = new Map();
  private activatedStages: Set<number> = new Set();
  private userAnswers: Record<string, any> = {};

  static getInstance(): FunnelStageActivator {
    if (!FunnelStageActivator.instance) {
      FunnelStageActivator.instance = new FunnelStageActivator();
    }
    return FunnelStageActivator.instance;
  }

  /**
   * Registra um listener para mudanças de ativação de etapas
   */
  addListener(id: string, callback: (stage: FunnelStage) => void) {
    this.listeners.set(id, callback);
  }

  /**
   * Remove um listener
   */
  removeListener(id: string) {
    this.listeners.delete(id);
  }

  /**
   * Notifica todos os listeners sobre ativação de etapa
   */
  private notifyListeners(stage: FunnelStage) {
    this.listeners.forEach(callback => {
      try {
        callback(stage);
      } catch (error) {
        console.error('Erro no listener de ativação:', error);
      }
    });
  }

  /**
   * Registra resposta do usuário e verifica ativações
   */
  registerAnswer(questionId: string, answer: any, stepNumber: number) {
    this.userAnswers[questionId] = answer;

    console.log(`📝 Resposta registrada - Q${stepNumber}:`, {
      questionId,
      answer,
      totalAnswers: Object.keys(this.userAnswers).length,
    });

    this.checkActivationRules(stepNumber);
  }

  /**
   * Registra preenchimento de campo (nome, email, etc.)
   */
  registerFieldFilled(fieldName: string, value: string) {
    this.userAnswers[fieldName] = value;

    console.log(`📝 Campo preenchido:`, { fieldName, value });

    // Verificar ativação da etapa 1 (nome preenchido)
    if (fieldName === 'userName' && value.trim().length >= 2) {
      this.activateStage(2); // Ativar primeira questão
    }
  }

  /**
   * Verifica se uma etapa deve ser ativada baseado nas regras
   */
  private checkActivationRules(currentStep: number) {
    const rules = FUNNEL_ACTIVATION_RULES;

    // Questões normais (2-14) - Ativar próxima após 3 seleções
    if (rules.questions.stages.includes(currentStep)) {
      const currentAnswers = this.getAnswersForStep(currentStep);

      if (currentAnswers.length >= rules.questions.minSelections) {
        console.log(`✅ Etapa ${currentStep} completa, ativando próxima`);

        if (rules.questions.autoAdvance) {
          this.activateStage(currentStep + 1);
        }
      }
    }

    // Questões estratégicas (16-18) - Ativar próxima após 1 seleção
    if (rules.strategic.stages.includes(currentStep)) {
      const currentAnswers = this.getAnswersForStep(currentStep);

      if (currentAnswers.length >= 1) {
        console.log(`✅ Etapa estratégica ${currentStep} completa`);
        // Não avança automaticamente - requere clique manual
      }
    }

    // Verificar ativação de transições
    this.checkTransitionActivation(currentStep);
  }

  /**
   * Verifica ativação de etapas de transição
   */
  private checkTransitionActivation(completedStep: number) {
    // Transição principal (etapa 15) - após completar todas as questões (2-14)
    if (completedStep === 14) {
      setTimeout(() => {
        this.activateStage(15);
      }, 500);
    }

    // Transição para resultado (etapa 19) - após questões estratégicas
    if (completedStep === 18) {
      setTimeout(() => {
        this.activateStage(19);
      }, 500);
    }
  }

  /**
   * Ativa uma etapa específica
   */
  activateStage(stepNumber: number) {
    if (this.activatedStages.has(stepNumber)) {
      console.log(`⚠️ Etapa ${stepNumber} já está ativada`);
      return;
    }

    this.activatedStages.add(stepNumber);

    console.log(`🚀 Ativando etapa ${stepNumber}`);

    // Criar objeto de etapa para notificação
    const stage: FunnelStage = {
      id: `step-${stepNumber}`,
      name: this.getStepName(stepNumber),
      order: stepNumber,
      type: this.getStepType(stepNumber),
      description: `Etapa ${stepNumber} ativada`,
      isActive: true,
      metadata: {
        blocksCount: 0,
        lastModified: new Date(),
        isCustom: false,
      },
    };

    this.notifyListeners(stage);
  }

  /**
   * Obtém respostas para uma etapa específica
   */
  private getAnswersForStep(stepNumber: number): any[] {
    const stepKey = `step-${stepNumber}`;
    const answers = [];

    for (const [key, value] of Object.entries(this.userAnswers)) {
      if (key.startsWith(stepKey) || key.includes(`q${stepNumber}`)) {
        answers.push(value);
      }
    }

    return answers.flat();
  }

  /**
   * Mapear nome da etapa por número
   */
  private getStepName(stepNumber: number): string {
    const names = {
      1: 'Introdução',
      2: 'Q1 - Tipo de Roupa',
      3: 'Q2 - Nome Pessoal',
      4: 'Q3 - Estilo Pessoal',
      5: 'Q4 - Ocasiões',
      6: 'Q5 - Cores',
      7: 'Q6 - Textura',
      8: 'Q7 - Silhueta',
      9: 'Q8 - Acessórios',
      10: 'Q9 - Inspiração',
      11: 'Q10 - Conforto',
      12: 'Q11 - Tendências',
      13: 'Q12 - Investimento',
      14: 'Q13 - Personalidade',
      15: 'Transição',
      16: 'Q14 - Estratégica 1',
      17: 'Q15 - Estratégica 2',
      18: 'Q16 - Estratégica 3',
      19: 'Processamento',
      20: 'Resultado',
      21: 'Oferta',
    };

    return names[stepNumber as keyof typeof names] || `Etapa ${stepNumber}`;
  }

  /**
   * Mapear tipo da etapa por número
   */
  private getStepType(
    stepNumber: number
  ): 'intro' | 'question' | 'transition' | 'processing' | 'result' | 'lead' | 'offer' | 'final' {
    if (stepNumber === 1) return 'intro';
    if (stepNumber >= 2 && stepNumber <= 14) return 'question';
    if (stepNumber === 15 || stepNumber === 19) return 'transition';
    if (stepNumber >= 16 && stepNumber <= 18) return 'question'; // Questões estratégicas são do tipo question
    if (stepNumber === 20) return 'result';
    if (stepNumber === 21) return 'offer';

    return 'question';
  }

  /**
   * Verifica se uma etapa está ativada
   */
  isStageActivated(stepNumber: number): boolean {
    return this.activatedStages.has(stepNumber);
  }

  /**
   * Obtém todas as etapas ativadas
   */
  getActivatedStages(): number[] {
    return Array.from(this.activatedStages).sort((a, b) => a - b);
  }

  /**
   * Reset do sistema (para testes)
   */
  reset() {
    this.activatedStages.clear();
    this.userAnswers = {};
    console.log('🔄 Sistema de ativação resetado');
  }

  /**
   * Obter estatísticas do progresso
   */
  getProgressStats() {
    return {
      totalStages: 21,
      activatedStages: this.activatedStages.size,
      completionRate: Math.round((this.activatedStages.size / 21) * 100),
      currentStage: Math.max(...this.activatedStages, 1),
      answers: Object.keys(this.userAnswers).length,
    };
  }
}

// Instância singleton
export const stageActivator = FunnelStageActivator.getInstance();

// Hook React para usar o sistema de ativação
export function useFunnelStageActivation() {
  const [activatedStages, setActivatedStages] = React.useState<number[]>([]);
  const [progressStats, setProgressStats] = React.useState(stageActivator.getProgressStats());

  React.useEffect(() => {
    const updateState = () => {
      setActivatedStages(stageActivator.getActivatedStages());
      setProgressStats(stageActivator.getProgressStats());
    };

    // Listener para mudanças
    stageActivator.addListener('react-hook', updateState);

    // Estado inicial
    updateState();

    return () => {
      stageActivator.removeListener('react-hook');
    };
  }, []);

  return {
    activatedStages,
    progressStats,
    registerAnswer: stageActivator.registerAnswer.bind(stageActivator),
    registerFieldFilled: stageActivator.registerFieldFilled.bind(stageActivator),
    activateStage: stageActivator.activateStage.bind(stageActivator),
    isStageActivated: stageActivator.isStageActivated.bind(stageActivator),
    reset: stageActivator.reset.bind(stageActivator),
  };
}
