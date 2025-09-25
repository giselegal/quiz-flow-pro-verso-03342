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
import HybridTemplateService, { StepTemplate } from '@/services/HybridTemplateService';
import { isScoringPhase, isStrategicPhase } from '@/lib/quiz/selectionRules';

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
  private stepConfigs: Map<number, StepTemplate> = new Map();

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
    console.log('🧭 SmartNavigation: Inicializando...', {
      currentStep: this.state.currentStep,
      totalSteps: this.config.totalSteps,
    });

    // Carregar configuração da etapa atual
    await this.loadStepConfig(this.state.currentStep);
    
    // Validar etapa atual
    await this.validateAndUpdateState();
    
    console.log('✅ SmartNavigation: Inicializado com sucesso');
  }

  /**
   * 🎯 NAVEGAR PARA ETAPA ESPECÍFICA
   */
  async goToStep(targetStep: number): Promise<boolean> {
    if (targetStep < 1 || targetStep > this.config.totalSteps) {
      console.warn('⚠️ SmartNavigation: Etapa inválida:', targetStep);
      return false;
    }

    if (this.state.isAutoAdvancing) {
      console.log('⏸️ SmartNavigation: Navegação bloqueada (auto-advancing)');
      return false;
    }

    try {
      console.log('🧭 SmartNavigation: Navegando para etapa', {
        from: this.state.currentStep,
        to: targetStep,
      });

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
      console.error('❌ SmartNavigation: Erro na navegação:', error);
      return false;
    }
  }

  /**
   * ➡️ PRÓXIMA ETAPA
   */
  async goNext(): Promise<boolean> {
    if (!this.state.canGoNext) {
      console.log('⛔ SmartNavigation: Não pode avançar - validação necessária');
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
      console.log('⛔ SmartNavigation: Não pode voltar da primeira etapa');
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
      console.error('❌ SmartNavigation: Erro na validação:', error);
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
      console.error('❌ SmartNavigation: Erro ao atualizar dados:', error);
    }
  }

  /**
   * 🚀 INICIAR AUTO-ADVANCE
   */
  startAutoAdvance(): void {
    const stepConfig = this.stepConfigs.get(this.state.currentStep);
    
    if (!stepConfig?.behavior.autoAdvance || !this.state.stepValidation.isValid) {
      console.log('⚠️ SmartNavigation: Auto-advance não habilitado ou etapa inválida');
      return;
    }

    this.cancelAutoAdvance(); // Cancelar timer anterior se existir

    const delay = stepConfig.behavior.autoAdvanceDelay;
    
    console.log('🚀 SmartNavigation: Iniciando auto-advance', {
      currentStep: this.state.currentStep,
      delay,
    });

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
      const config = await HybridTemplateService.getStepConfig(step);
      this.stepConfigs.set(step, config);
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

    if (isScoringPhase(step)) {
      // Etapas 2-11: validar 3 seleções
      const selections = quizData.selections[`step-${step}`] || [];
      return {
        isValid: selections.length === 3,
        message: selections.length === 3 
          ? 'Seleções válidas' 
          : `Selecione 3 opções (${selections.length}/3)`,
        requiredSelections: 3,
        currentSelections: selections.length,
      };
    }

    if (isStrategicPhase(step)) {
      // Etapas 13-18: validar 1 seleção
      const selections = quizData.selections[`step-${step}`] || [];
      return {
        isValid: selections.length === 1,
        message: selections.length === 1 
          ? 'Seleção válida' 
          : `Selecione 1 opção (${selections.length}/1)`,
        requiredSelections: 1,
        currentSelections: selections.length,
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
    
    console.log('✅ SmartNavigation: Auto-advance completo');
    
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