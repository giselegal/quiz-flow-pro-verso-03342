/**
 * 🧭 SMART NAVIGATION - NAVEGAÇÃO INTELIGENTE COM ESTADOS
 * 
 * Sistema de navegação que:
 * - Aplica validação automática por fase do quiz
 * - Implementa auto-advance com delays configuráveis
 * - Gerencia progress bar dinâmica
 * - Persiste estado no Supabase
 * - Integra com QuizOrchestrator
 */

import { unifiedQuizStorage } from '@/services/core/UnifiedQuizStorage';
import { templateService } from '@/services/canonical/TemplateService';
import { isScoringPhase, isStrategicPhase } from '@/lib/quiz/selectionRules';
import { appLogger } from '@/lib/utils/appLogger';

export interface NavigationState {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isAutoAdvancing: boolean;
  autoAdvanceTimeLeft: number;
  progressPercentage: number;
  stepValidation: {
    isValid: boolean;
    message: string;
    requiredSelections?: number;
    currentSelections?: number;
  };
}

export interface NavigationConfig {
  totalSteps: number;
  enableAutoAdvance: boolean;
  enableValidation: boolean;
  enablePersistence: boolean;
  onStepChange?: (step: number) => void;
  onValidationChange?: (isValid: boolean, message: string) => void;
  onAutoAdvanceStart?: (timeLeft: number) => void;
  onAutoAdvanceComplete?: () => void;
}

export interface NavigationActions {
  goToStep: (step: number) => Promise<boolean>;
  goNext: () => Promise<boolean>;
  goPrevious: () => Promise<boolean>;
  validateCurrentStep: () => boolean;
  updateStepData: (data: any) => void;
  startAutoAdvance: () => void;
  cancelAutoAdvance: () => void;
  reset: () => void;
}

class SmartNavigation {
  private state: NavigationState;
  private config: NavigationConfig;
  private listeners: Set<(state: NavigationState) => void> = new Set();
  private autoAdvanceTimer: NodeJS.Timeout | null = null;
  private stepConfigs: Map<number, any> = new Map();

  constructor(config: NavigationConfig) {
    this.config = config;
    this.state = this.getInitialState();
    this.bindMethods();
  }

  private getInitialState(): NavigationState {
    const quizData = unifiedQuizStorage.loadData();
    const currentStep = quizData.metadata.currentStep || 1;
    
    return {
      currentStep,
      totalSteps: this.config.totalSteps,
      canGoNext: false,
      canGoPrevious: currentStep > 1,
      isAutoAdvancing: false,
      autoAdvanceTimeLeft: 0,
      progressPercentage: Math.round((currentStep / this.config.totalSteps) * 100),
      stepValidation: {
        isValid: false,
        message: '',
      },
    };
  }

  private bindMethods() {
    this.goToStep = this.goToStep.bind(this);
    this.goNext = this.goNext.bind(this);
    this.goPrevious = this.goPrevious.bind(this);
    this.validateCurrentStep = this.validateCurrentStep.bind(this);
    this.updateStepData = this.updateStepData.bind(this);
  }

  /**
   * 🚀 INICIALIZAR NAVEGAÇÃO
   */
  async initialize(): Promise<void> {
    appLogger.info('🧭 SmartNavigation: Inicializando...', { data: [{
            currentStep: this.state.currentStep,
            totalSteps: this.config.totalSteps,
          }] });

    // Carregar configuração da etapa atual
    await this.loadStepConfig(this.state.currentStep);
    
    // Validar etapa atual
    await this.validateAndUpdateState();
    
    appLogger.info('✅ SmartNavigation: Inicializado com sucesso');
  }

  /**
   * 🎯 NAVEGAR PARA ETAPA ESPECÍFICA
   */
  async goToStep(targetStep: number): Promise<boolean> {
    if (targetStep < 1 || targetStep > this.config.totalSteps) {
      appLogger.warn('⚠️ SmartNavigation: Etapa inválida:', { data: [targetStep] });
      return false;
    }

    if (this.state.isAutoAdvancing) {
      appLogger.info('⏸️ SmartNavigation: Navegação bloqueada (auto-advancing)');
      return false;
    }

    try {
      appLogger.info('🧭 SmartNavigation: Navegando para etapa', { data: [{
                from: this.state.currentStep,
                to: targetStep,
              }] });

      // Cancelar auto-advance se ativo
      this.cancelAutoAdvance();

      // Salvar progresso da etapa atual
      if (this.config.enablePersistence) {
        unifiedQuizStorage.updateProgress(this.state.currentStep);
      }

      // Carregar configuração da nova etapa
      await this.loadStepConfig(targetStep);

      // Atualizar estado
      this.updateState({
        currentStep: targetStep,
        canGoPrevious: targetStep > 1 && targetStep < this.config.totalSteps,
        progressPercentage: Math.round((targetStep / this.config.totalSteps) * 100),
      });

      // Atualizar progresso no storage
      if (this.config.enablePersistence) {
        unifiedQuizStorage.updateProgress(targetStep);
      }

      // Validar nova etapa
      await this.validateAndUpdateState();

      // Callback de mudança de etapa
      this.config.onStepChange?.(targetStep);

      return true;
    } catch (error) {
      appLogger.error('❌ SmartNavigation: Erro na navegação:', { data: [error] });
      return false;
    }
  }

  /**
   * ➡️ PRÓXIMA ETAPA
   */
  async goNext(): Promise<boolean> {
    if (!this.state.canGoNext) {
      appLogger.info('⛔ SmartNavigation: Não pode avançar - validação necessária');
      return false;
    }

    const nextStep = this.state.currentStep + 1;
    return await this.goToStep(nextStep);
  }

  /**
   * ⬅️ ETAPA ANTERIOR
   */
  async goPrevious(): Promise<boolean> {
    if (!this.state.canGoPrevious) {
      appLogger.info('⛔ SmartNavigation: Não pode voltar da primeira etapa');
      return false;
    }

    const previousStep = this.state.currentStep - 1;
    return await this.goToStep(previousStep);
  }

  /**
   * ✅ VALIDAR ETAPA ATUAL
   */
  validateCurrentStep(): boolean {
    const { currentStep } = this.state;
    const quizData = unifiedQuizStorage.loadData();

    try {
      const validation = this.performStepValidation(currentStep, quizData);
      
      this.updateState({
        stepValidation: validation,
        canGoNext: validation.isValid || this.isTransitionStep(currentStep),
      });

      // Callback de validação
      this.config.onValidationChange?.(validation.isValid, validation.message);

      return validation.isValid;
    } catch (error) {
      appLogger.error('❌ SmartNavigation: Erro na validação:', { data: [error] });
      return false;
    }
  }

  /**
   * 📝 ATUALIZAR DADOS DA ETAPA
   */
  updateStepData(data: any): void {
    const { currentStep } = this.state;

    try {
      // Atualizar dados no storage baseado no tipo de etapa
      if (currentStep === 1) {
        // Etapa 1: dados de formulário
        if (data.name || data.userName) {
          unifiedQuizStorage.updateFormData('userName', data.name || data.userName);
        }
      } else if (isScoringPhase(currentStep) || isStrategicPhase(currentStep)) {
        // Etapas de seleção
        if (data.selectedOptions && Array.isArray(data.selectedOptions)) {
          const questionId = `step-${currentStep}`;
          unifiedQuizStorage.updateSelections(questionId, data.selectedOptions);
        }
      }

      // Revalidar após atualização
      setTimeout(() => {
        this.validateAndUpdateState();
      }, 100); // Debounce para evitar validações excessivas

    } catch (error) {
      appLogger.error('❌ SmartNavigation: Erro ao atualizar dados:', { data: [error] });
    }
  }

  /**
   * 🚀 INICIAR AUTO-ADVANCE
   */
  startAutoAdvance(): void {
    const stepConfig = this.stepConfigs.get(this.state.currentStep);
    
    if (!stepConfig?.behavior.autoAdvance || !this.state.stepValidation.isValid) {
      appLogger.info('⚠️ SmartNavigation: Auto-advance não habilitado ou etapa inválida');
      return;
    }

    this.cancelAutoAdvance(); // Cancelar timer anterior se existir

    const delay = stepConfig.behavior.autoAdvanceDelay;
    
    appLogger.info('🚀 SmartNavigation: Iniciando auto-advance', { data: [{
            currentStep: this.state.currentStep,
            delay,
          }] });

    this.updateState({
      isAutoAdvancing: true,
      autoAdvanceTimeLeft: delay,
    });

    // Callback de início
    this.config.onAutoAdvanceStart?.(delay);

    // Timer de auto-advance
    const startTime = Date.now();
    this.autoAdvanceTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, delay - elapsed);

      this.updateState({
        autoAdvanceTimeLeft: remaining,
      });

      if (remaining <= 0) {
        this.completeAutoAdvance();
      }
    }, 100);
  }

  /**
   * ⏹️ CANCELAR AUTO-ADVANCE
   */
  cancelAutoAdvance(): void {
    if (this.autoAdvanceTimer) {
      clearInterval(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }

    if (this.state.isAutoAdvancing) {
      this.updateState({
        isAutoAdvancing: false,
        autoAdvanceTimeLeft: 0,
      });
    }
  }

  /**
   * 🔄 RESETAR NAVEGAÇÃO
   */
  reset(): void {
    this.cancelAutoAdvance();
    this.stepConfigs.clear();
    this.state = this.getInitialState();
    this.notifyListeners();
  }

  /**
   * 📊 OBTER ESTADO ATUAL
   */
  getState(): NavigationState {
    return { ...this.state };
  }

  /**
   * 🎮 OBTER AÇÕES
   */
  getActions(): NavigationActions {
    return {
      goToStep: this.goToStep,
      goNext: this.goNext,
      goPrevious: this.goPrevious,
      validateCurrentStep: this.validateCurrentStep,
      updateStepData: this.updateStepData,
      startAutoAdvance: this.startAutoAdvance,
      cancelAutoAdvance: this.cancelAutoAdvance,
      reset: this.reset,
    };
  }

  /**
   * 🔔 SUBSCREVER MUDANÇAS
   */
  subscribe(listener: (state: NavigationState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Métodos privados

  private async loadStepConfig(step: number): Promise<void> {
    if (!this.stepConfigs.has(step)) {
      const stepId = `step-${String(step).padStart(2, '0')}`;
      const stepResult = await templateService.getStep(stepId);
      
      if (stepResult.success && stepResult.data) {
        // Criar uma configuração simplificada compatível
        const config = {
          metadata: { name: `Step ${step}`, description: '' },
          behavior: { autoAdvance: false, autoAdvanceDelay: 0 },
          validation: { type: 'presence', required: true, message: 'Obrigatório' },
          blocks: stepResult.data,
        };
        this.stepConfigs.set(step, config as any);
      }
    }
  }

  private async validateAndUpdateState(): Promise<void> {
    const isValid = this.validateCurrentStep();
    const stepConfig = this.stepConfigs.get(this.state.currentStep);

    // Configurar auto-advance se necessário
    if (this.config.enableAutoAdvance && stepConfig?.behavior.autoAdvance && isValid) {
      // Aguardar um pouco antes de iniciar auto-advance para melhor UX
      setTimeout(() => {
        if (this.state.stepValidation.isValid && !this.state.isAutoAdvancing) {
          this.startAutoAdvance();
        }
      }, 500);
    }
  }

  private performStepValidation(step: number, quizData: any): NavigationState['stepValidation'] {
    if (step === 1) {
      // Etapa 1: validar nome
      const name = quizData.formData.userName || quizData.formData.name;
      if (!name || name.length < 2) {
        return {
          isValid: false,
          message: 'Digite seu nome para continuar',
        };
      }
      return {
        isValid: true,
        message: 'Nome válido',
      };
    }

    // Usar configuração do template para determinar regras de seleção
    const templateConfig = this.stepConfigs.get(step);
    const selections = quizData.selections[`step-${step}`] || [];

    // Fallback seguro para tipo de etapa
    const isSelectionPhase = templateConfig?.validation?.type === 'selection'
      || isScoringPhase(step)
      || isStrategicPhase(step);

    if (isSelectionPhase) {
      // 1) Preferir regras vindas do HybridTemplateService
      let required = templateConfig?.validation?.requiredSelections;
      let maxSel = templateConfig?.validation?.maxSelections;
      let baseMessage = templateConfig?.validation?.message || '';

      // 2) Fallback: inspecionar blocos para options-grid (minSelections/maxSelections)
      if (!required || !maxSel) {
        try {
          const blocks = templateConfig?.blocks || [];
          const og = Array.isArray(blocks)
            ? blocks.find((b: any) => (b?.type === 'options-grid' || b?.type === 'options grid'))
            : null;
          const contentMin = og?.content?.minSelections ?? og?.properties?.minSelections;
          const contentMax = og?.content?.maxSelections ?? og?.properties?.maxSelections;
          required = required ?? contentMin ?? (isStrategicPhase(step) ? 1 : 3);
          maxSel = maxSel ?? contentMax ?? required;
          // Mensagem prioritária do bloco, se existir
          baseMessage = baseMessage || og?.content?.validationMessage || og?.properties?.validationMessage || '';
        } catch {
          // ignore
        }
      }

      // 3) Defaults por fase (mantém comportamento atual quando nada informado)
      if (!required) required = isStrategicPhase(step) ? 1 : 3;
      if (!maxSel) maxSel = required;

      const count = selections.length;
      const isValid = count >= required && count <= maxSel;

      // Mensagem amigável com contador dinâmico
      const singular = required === 1;
      const defaultPrompt = singular
        ? `Selecione 1 opção (${count}/1)`
        : `Selecione ${required} opções (${count}/${required})`;

      // Se o template forneceu mensagem base, anexar contador para clareza
      const message = isValid
        ? (singular ? 'Seleção válida' : 'Seleções válidas')
        : (baseMessage ? `${baseMessage} (${count}/${required})` : defaultPrompt);

      return {
        isValid,
        message,
        requiredSelections: required,
        currentSelections: count,
      };
    }

    // Etapas de transição ou outras sempre válidas
    return {
      isValid: true,
      message: 'Etapa válida',
    };
  }

  private isTransitionStep(step: number): boolean {
    return step === 12 || step === 19;
  }

  private completeAutoAdvance(): void {
    this.cancelAutoAdvance();
    
    appLogger.info('✅ SmartNavigation: Auto-advance completo');
    
    // Callback de conclusão
    this.config.onAutoAdvanceComplete?.();
    
    // Avançar para próxima etapa
    this.goNext();
  }

  private updateState(updates: Partial<NavigationState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}

export default SmartNavigation;