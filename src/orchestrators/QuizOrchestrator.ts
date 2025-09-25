/**
 * 🎯 QUIZ ORCHESTRATOR - COORDENADOR CENTRAL DO SISTEMA
 * 
 * Coordena e integra todos os sistemas do quiz:
 * - HybridTemplateService (configurações por etapa)
 * - UnifiedQuizStorage (persistência de dados)
 * - EditorProvider (estado e navegação)
 * - Validação (regras por fase)
 * - Scoring (cálculo de resultados)
 * - Supabase (persistência remota)
 */

import { unifiedQuizStorage, UnifiedQuizData } from '@/services/core/UnifiedQuizStorage';
import HybridTemplateService, { StepTemplate } from '@/services/HybridTemplateService';
import { ValidationResult } from '@/hooks/useStepValidation';
import { isScoringPhase, isStrategicPhase } from '@/lib/quiz/selectionRules';
import { Block } from '@/types/editor';

export interface QuizOrchestratorState {
  // Estado atual
  currentStep: number;
  currentStepConfig: StepTemplate | null;
  currentBlocks: Block[];
  
  // Dados
  quizData: UnifiedQuizData;
  
  // Validação
  isStepValid: boolean;
  validationResult: ValidationResult | null;
  
  // Navegação
  canGoNext: boolean;
  canGoPrevious: boolean; 
  isAutoAdvancing: boolean;
  
  // Estado global
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface QuizOrchestratorActions {
  // Inicialização
  initialize: (funnelId?: string) => Promise<void>;
  reset: () => void;
  
  // Navegação
  goToStep: (step: number) => Promise<void>;
  goNext: () => Promise<void>;
  goPrevious: () => Promise<void>;
  
  // Dados
  updateStepData: (data: any) => Promise<void>;
  updateSelections: (questionId: string, selections: string[]) => Promise<void>;
  updateFormData: (key: string, value: any) => Promise<void>;
  
  // Validação
  validateCurrentStep: () => ValidationResult;
  triggerAutoAdvance: () => void;
  
  // Resultado
  calculateResult: () => Promise<any>;
  saveResult: (result: any) => Promise<void>;
}

export interface QuizOrchestratorContext {
  state: QuizOrchestratorState; 
  actions: QuizOrchestratorActions;
}

class QuizOrchestrator {
  private state: QuizOrchestratorState;
  private listeners: Set<(state: QuizOrchestratorState) => void> = new Set();
  private autoAdvanceTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.state = this.getInitialState();
    this.bindMethods();
  }

  private getInitialState(): QuizOrchestratorState {
    return {
      currentStep: 1,
      currentStepConfig: null,
      currentBlocks: [],
      quizData: unifiedQuizStorage.loadData(),
      isStepValid: false,
      validationResult: null,
      canGoNext: false,
      canGoPrevious: false,
      isAutoAdvancing: false,
      isInitialized: false,
      isLoading: false,
      error: null,
    };
  }

  private bindMethods() {
    this.initialize = this.initialize.bind(this);
    this.goToStep = this.goToStep.bind(this);
    this.goNext = this.goNext.bind(this);
    this.goPrevious = this.goPrevious.bind(this);
    this.updateStepData = this.updateStepData.bind(this);
    this.updateSelections = this.updateSelections.bind(this);
    this.updateFormData = this.updateFormData.bind(this);
    this.validateCurrentStep = this.validateCurrentStep.bind(this);
    this.calculateResult = this.calculateResult.bind(this);
  }

  /**
   * 🚀 INICIALIZAÇÃO COMPLETA DO SISTEMA
   */
  async initialize(funnelId?: string): Promise<void> {
    try {
      this.updateState({ isLoading: true, error: null });

      console.log('🎯 QuizOrchestrator: Iniciando sistema completo...', { funnelId });

      // 1. Carregar dados persistidos
      const quizData = unifiedQuizStorage.loadData();
      const currentStep = quizData.metadata.currentStep || 1;

      // 2. Carregar configuração da etapa atual
      const stepConfig = await HybridTemplateService.getStepConfig(currentStep);
      
      // 3. Carregar template/blocos da etapa
      const template = await HybridTemplateService.getTemplate('quiz21StepsComplete');
      const currentBlocks = this.getBlocksForStep(template, currentStep);

      // 4. Validar estado inicial
      const validationResult = this.validateStepData(currentStep, quizData);

      // 5. Configurar estado inicial
      this.updateState({
        currentStep,
        currentStepConfig: stepConfig,
        currentBlocks,
        quizData,
        validationResult,
        isStepValid: validationResult.isValid,
        canGoNext: this.canNavigateNext(currentStep, validationResult),
        canGoPrevious: this.canNavigatePrevious(currentStep),
        isInitialized: true,
        isLoading: false,
      });

      // 6. Setup listeners para mudanças externas
      this.setupEventListeners();

      console.log('✅ QuizOrchestrator: Sistema inicializado com sucesso', {
        currentStep,
        hasStepConfig: !!stepConfig,
        blocksCount: currentBlocks.length,
        isValid: validationResult.isValid,
      });

    } catch (error) {
      console.error('❌ QuizOrchestrator: Erro na inicialização:', error);
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  /**
   * 🧭 NAVEGAÇÃO PARA ETAPA ESPECÍFICA
   */
  async goToStep(targetStep: number): Promise<void> {
    if (this.state.isLoading || this.state.isAutoAdvancing) {
      console.log('⏸️ QuizOrchestrator: Navegação bloqueada (loading/auto-advancing)');
      return;
    }

    try {
      this.updateState({ isLoading: true });

      console.log('🧭 QuizOrchestrator: Navegando para etapa', { 
        from: this.state.currentStep, 
        to: targetStep 
      });

      // 1. Validar se pode navegar
      if (!this.canNavigateToStep(targetStep)) {
        throw new Error(`Não é possível navegar para a etapa ${targetStep}`);
      }

      // 2. Salvar progresso da etapa atual
      await this.saveCurrentStepProgress();

      // 3. Carregar configuração da nova etapa
      const stepConfig = await HybridTemplateService.getStepConfig(targetStep);
      const template = await HybridTemplateService.getTemplate('quiz21StepsComplete');
      const newBlocks = this.getBlocksForStep(template, targetStep);

      // 4. Atualizar progresso no storage
      unifiedQuizStorage.updateProgress(targetStep);
      const updatedData = unifiedQuizStorage.loadData();

      // 5. Validar nova etapa
      const validationResult = this.validateStepData(targetStep, updatedData);

      // 6. Atualizar estado
      this.updateState({
        currentStep: targetStep,
        currentStepConfig: stepConfig,
        currentBlocks: newBlocks,
        quizData: updatedData,
        validationResult,
        isStepValid: validationResult.isValid,
        canGoNext: this.canNavigateNext(targetStep, validationResult),
        canGoPrevious: this.canNavigatePrevious(targetStep),
        isLoading: false,
      });

      // 7. Configurar auto-advance se necessário
      this.setupAutoAdvance(stepConfig, validationResult);

    } catch (error) {
      console.error('❌ QuizOrchestrator: Erro na navegação:', error);
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro de navegação',
      });
    }
  }

  /**
   * ➡️ AVANÇAR PARA PRÓXIMA ETAPA
   */
  async goNext(): Promise<void> {
    if (this.state.canGoNext) {
      await this.goToStep(this.state.currentStep + 1);
    }
  }

  /**
   * ⬅️ VOLTAR PARA ETAPA ANTERIOR
   */
  async goPrevious(): Promise<void> {
    if (this.state.canGoPrevious) {
      await this.goToStep(this.state.currentStep - 1);
    }
  }

  /**
   * 💾 ATUALIZAR DADOS DA ETAPA ATUAL
   */
  async updateStepData(data: any): Promise<void> {
    try {
      const { currentStep } = this.state;

      // Determinar tipo de dados baseado na etapa
      if (currentStep === 1) {
        // Etapa 1: dados de formulário (nome)
        if (data.name || data.userName) {
          const success = unifiedQuizStorage.updateFormData('userName', data.name || data.userName);
          if (!success) throw new Error('Falha ao salvar nome');
        }
      } else if (isScoringPhase(currentStep) || isStrategicPhase(currentStep)) {
        // Etapas 2-11 e 13-18: seleções de múltipla escolha
        if (data.selectedOptions && Array.isArray(data.selectedOptions)) {
          const success = unifiedQuizStorage.updateSelections(`step-${currentStep}`, data.selectedOptions);
          if (!success) throw new Error('Falha ao salvar seleções');
        }
      }

      // Recarregar dados e revalidar
      const updatedData = unifiedQuizStorage.loadData();
      const validationResult = this.validateStepData(currentStep, updatedData);

      this.updateState({
        quizData: updatedData,
        validationResult,
        isStepValid: validationResult.isValid,
        canGoNext: this.canNavigateNext(currentStep, validationResult),
      });

      // Configurar auto-advance se necessário
      if (this.state.currentStepConfig) {
        this.setupAutoAdvance(this.state.currentStepConfig, validationResult);
      }

    } catch (error) {
      console.error('❌ QuizOrchestrator: Erro ao atualizar dados:', error);
      this.updateState({
        error: error instanceof Error ? error.message : 'Erro ao salvar dados',
      });
    }
  }

  /**
   * 🎯 ATUALIZAR SELEÇÕES DE MÚLTIPLA ESCOLHA
   */
  async updateSelections(questionId: string, selections: string[]): Promise<void> {
    const success = unifiedQuizStorage.updateSelections(questionId, selections);
    if (success) {
      await this.updateStepData({ selectedOptions: selections });
    }
  }

  /**
   * 📝 ATUALIZAR DADOS DE FORMULÁRIO
   */
  async updateFormData(key: string, value: any): Promise<void> {
    const success = unifiedQuizStorage.updateFormData(key, value);
    if (success) {
      await this.updateStepData({ [key]: value });
    }
  }

  /**
   * ✅ VALIDAR ETAPA ATUAL
   */
  validateCurrentStep(): ValidationResult {
    return this.validateStepData(this.state.currentStep, this.state.quizData);
  }

  /**
   * 🎨 CALCULAR RESULTADO FINAL
   */
  async calculateResult(): Promise<any> {
    try {
      const { quizData } = this.state;
      
      // Verificar se há dados suficientes
      if (!unifiedQuizStorage.hasEnoughDataForResult()) {
        throw new Error('Dados insuficientes para calcular resultado');
      }

      console.log('🎨 QuizOrchestrator: Calculando resultado...', {
        selections: Object.keys(quizData.selections).length,
        formData: Object.keys(quizData.formData).length,
      });

      // Calcular pontuações por categoria
      const scores = this.calculateCategoryScores(quizData.selections);
      
      // Determinar estilo predominante
      const dominantStyle = this.getDominantStyle(scores);
      
      // Gerar dados complementares
      const result = {
        dominantStyle,
        scores,
        userName: quizData.formData.userName || quizData.formData.name || 'Usuário',
        timestamp: new Date().toISOString(),
        completionData: {
          totalSelections: Object.keys(quizData.selections).length,
          completedSteps: quizData.metadata.completedSteps.length,
          timeSpent: Date.now() - new Date(quizData.metadata.startedAt).getTime(),
        },
      };

      // Salvar resultado
      await this.saveResult(result);

      return result;
    } catch (error) {
      console.error('❌ QuizOrchestrator: Erro ao calcular resultado:', error);
      throw error;
    }
  }

  /**
   * 💾 SALVAR RESULTADO
   */
  async saveResult(result: any): Promise<void> {
    const success = unifiedQuizStorage.saveResult(result);
    if (success) {
      const updatedData = unifiedQuizStorage.loadData();
      this.updateState({ quizData: updatedData });
    }
  }

  // Métodos auxiliares privados

  private validateStepData(step: number, data: UnifiedQuizData): ValidationResult {
    try {
      if (step === 1) {
        // Validar nome
        const name = data.formData.userName || data.formData.name;
        if (!name || name.length < 2) {
          return {
            isValid: false,
            state: 'invalid',
            message: 'Digite seu nome para continuar',
            errors: ['Nome obrigatório'],
          };
        }
      } else if (isScoringPhase(step)) {
        // Validar 3 seleções obrigatórias
        const selections = data.selections[`step-${step}`] || [];
        if (selections.length !== 3) {
          return {
            isValid: false,
            state: 'invalid',
            message: 'Selecione exatamente 3 opções',
            errors: [`Esperado 3 seleções, encontrado ${selections.length}`],
          };
        }
      } else if (isStrategicPhase(step)) {
        // Validar 1 seleção obrigatória
        const selections = data.selections[`step-${step}`] || [];
        if (selections.length !== 1) {
          return {
            isValid: false,
            state: 'invalid',
            message: 'Selecione uma opção',
            errors: [`Esperado 1 seleção, encontrado ${selections.length}`],
          };
        }
      }

      return {
        isValid: true,
        state: 'valid',
        errors: [],
      };
    } catch (error) {
      return {
        isValid: false,
        state: 'invalid',
        message: 'Erro de validação',
        errors: [error instanceof Error ? error.message : 'Erro desconhecido'],
      };
    }
  }

  private canNavigateNext(step: number, validation: ValidationResult): boolean {
    // Etapas de transição (12, 19) sempre podem avançar
    if (step === 12 || step === 19) return true;
    
    // Outras etapas precisam de validação
    return validation.isValid;
  }

  private canNavigatePrevious(step: number): boolean {
    return step > 1 && step < 21; // Não pode voltar da primeira ou da última
  }

  private canNavigateToStep(targetStep: number): boolean {
    return targetStep >= 1 && targetStep <= 21;
  }

  private async saveCurrentStepProgress(): Promise<void> {
    // Salvar progresso atual se necessário
    const { currentStep } = this.state;
    unifiedQuizStorage.updateProgress(currentStep);
  }

  private setupAutoAdvance(stepConfig: StepTemplate, validation: ValidationResult): void {
    // Limpar timer anterior
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }

    // Configurar auto-advance se habilitado e válido
    if (stepConfig.behavior.autoAdvance && validation.isValid) {
      this.updateState({ isAutoAdvancing: true });

      this.autoAdvanceTimer = setTimeout(() => {
        this.updateState({ isAutoAdvancing: false });
        this.goNext();
      }, stepConfig.behavior.autoAdvanceDelay);
    }
  }

  private getBlocksForStep(template: any, step: number): Block[] {
    const stepKey = `step-${step}`;
    return template[stepKey] || [];
  }

  private calculateCategoryScores(selections: Record<string, string[]>): Record<string, number> {
    const scores: Record<string, number> = {};
    
    // Implementar lógica de scoring baseada nas seleções
    // Esta é uma implementação simplificada
    Object.entries(selections).forEach(([questionId, options]) => {
      options.forEach(option => {
        // Extrair categoria do option (assumindo formato "categoria_opcao")
        const [category] = option.split('_');
        if (category) {
          scores[category] = (scores[category] || 0) + 1;
        }
      });
    });

    return scores;
  }

  private getDominantStyle(scores: Record<string, number>): string {
    let maxScore = 0;
    let dominantStyle = 'natural'; // fallback

    Object.entries(scores).forEach(([style, score]) => {
      if (score > maxScore) {
        maxScore = score;
        dominantStyle = style;
      }
    });

    return dominantStyle;
  }

  private setupEventListeners(): void {
    // Escutar mudanças no storage
    if (typeof window !== 'undefined') {
      window.addEventListener('unified-quiz-data-updated', () => {
        const updatedData = unifiedQuizStorage.loadData();
        this.updateState({ quizData: updatedData });
      });
    }
  }

  private updateState(updates: Partial<QuizOrchestratorState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  // API pública para hooks/componentes
  subscribe(listener: (state: QuizOrchestratorState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState(): QuizOrchestratorState {
    return { ...this.state };
  }

  getActions(): QuizOrchestratorActions {
    return {
      initialize: this.initialize,
      reset: () => this.updateState(this.getInitialState()),
      goToStep: this.goToStep,
      goNext: this.goNext,
      goPrevious: this.goPrevious,
      updateStepData: this.updateStepData,
      updateSelections: this.updateSelections,
      updateFormData: this.updateFormData,
      validateCurrentStep: this.validateCurrentStep,
      triggerAutoAdvance: () => {
        if (this.state.currentStepConfig?.behavior.autoAdvance && this.state.isStepValid) {
          this.goNext();
        }
      },
      calculateResult: this.calculateResult,
      saveResult: this.saveResult,
    };
  }
}

// Singleton instance
export const quizOrchestrator = new QuizOrchestrator();
export default QuizOrchestrator;