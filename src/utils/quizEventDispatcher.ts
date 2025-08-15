// Quiz Event Dispatcher - Permite integração entre templates e hooks sem dependência direta
// Usado pelos templates JSON para comunicar eventos de quiz de volta ao sistema

export interface QuizEventData {
  questionId: string;
  optionId: string;
  category?: string;
  strategicType?: string;
  stepNumber: number;
  timestamp: number;
}

export interface QuizEventDispatcher {
  // Event listeners
  onQuizAnswer: ((data: QuizEventData) => Promise<void>) | null;
  onStrategicAnswer: ((data: QuizEventData) => Promise<void>) | null;
  onStepNavigation: ((stepNumber: number) => void) | null;
  
  // Event emitters
  emitQuizAnswer: (data: QuizEventData) => Promise<void>;
  emitStrategicAnswer: (data: QuizEventData) => Promise<void>;
  emitStepNavigation: (stepNumber: number) => void;
  
  // State getters (para templates JSON acessarem state sem hooks)
  getCurrentAnswers: () => Array<{ questionId: string; optionId: string }>;
  getStrategicAnswers: () => Array<{ questionId: string; optionId: string; category: string }>;
  getUserName: () => string;
}

// ✅ SINGLETON DISPATCHER GLOBAL
class GlobalQuizEventDispatcher implements QuizEventDispatcher {
  // Listeners
  onQuizAnswer: ((data: QuizEventData) => Promise<void>) | null = null;
  onStrategicAnswer: ((data: QuizEventData) => Promise<void>) | null = null;
  onStepNavigation: ((stepNumber: number) => void) | null = null;
  
  // Cache de state (preenchido pelos hooks)
  private currentAnswers: Array<{ questionId: string; optionId: string }> = [];
  private strategicAnswers: Array<{ questionId: string; optionId: string; category: string }> = [];
  private userName: string = '';

  // ✅ EMITTERS - USADOS PELOS TEMPLATES JSON
  async emitQuizAnswer(data: QuizEventData): Promise<void> {
    try {
      console.log('📤 QuizEventDispatcher: Emitindo quiz answer', data);
      
      if (this.onQuizAnswer) {
        await this.onQuizAnswer(data);
        console.log('✅ QuizEventDispatcher: Quiz answer processado');
      } else {
        console.warn('⚠️ QuizEventDispatcher: onQuizAnswer listener não configurado');
      }
    } catch (error) {
      console.error('❌ QuizEventDispatcher: Erro ao processar quiz answer', error);
    }
  }

  async emitStrategicAnswer(data: QuizEventData): Promise<void> {
    try {
      console.log('📤 QuizEventDispatcher: Emitindo strategic answer', data);
      
      if (this.onStrategicAnswer) {
        await this.onStrategicAnswer(data);
        console.log('✅ QuizEventDispatcher: Strategic answer processado');
      } else {
        console.warn('⚠️ QuizEventDispatcher: onStrategicAnswer listener não configurado');
      }
    } catch (error) {
      console.error('❌ QuizEventDispatcher: Erro ao processar strategic answer', error);
    }
  }

  emitStepNavigation(stepNumber: number): void {
    console.log('📤 QuizEventDispatcher: Emitindo step navigation', stepNumber);
    
    if (this.onStepNavigation) {
      this.onStepNavigation(stepNumber);
      console.log('✅ QuizEventDispatcher: Step navigation processado');
    } else {
      console.warn('⚠️ QuizEventDispatcher: onStepNavigation listener não configurado');
    }
  }

  // ✅ STATE GETTERS - USADOS PELOS TEMPLATES JSON
  getCurrentAnswers(): Array<{ questionId: string; optionId: string }> {
    return [...this.currentAnswers];
  }

  getStrategicAnswers(): Array<{ questionId: string; optionId: string; category: string }> {
    return [...this.strategicAnswers];
  }

  getUserName(): string {
    return this.userName;
  }

  // ✅ STATE SETTERS - USADOS PELOS HOOKS PARA SYNC
  setCurrentAnswers(answers: Array<{ questionId: string; optionId: string }>): void {
    this.currentAnswers = [...answers];
    console.log('🔄 QuizEventDispatcher: currentAnswers atualizado', answers.length);
  }

  setStrategicAnswers(answers: Array<{ questionId: string; optionId: string; category: string }>): void {
    this.strategicAnswers = [...answers];
    console.log('🔄 QuizEventDispatcher: strategicAnswers atualizado', answers.length);
  }

  setUserName(name: string): void {
    this.userName = name;
    console.log('🔄 QuizEventDispatcher: userName atualizado', name);
  }

  // ✅ SETUP - USADO PELOS HOOKS PARA CONFIGURAR LISTENERS
  setupListeners(listeners: {
    onQuizAnswer?: (data: QuizEventData) => Promise<void>;
    onStrategicAnswer?: (data: QuizEventData) => Promise<void>;
    onStepNavigation?: (stepNumber: number) => void;
  }): void {
    if (listeners.onQuizAnswer) this.onQuizAnswer = listeners.onQuizAnswer;
    if (listeners.onStrategicAnswer) this.onStrategicAnswer = listeners.onStrategicAnswer;
    if (listeners.onStepNavigation) this.onStepNavigation = listeners.onStepNavigation;
    
    console.log('🔧 QuizEventDispatcher: Listeners configurados', {
      hasQuizListener: !!this.onQuizAnswer,
      hasStrategicListener: !!this.onStrategicAnswer,
      hasNavigationListener: !!this.onStepNavigation,
    });
  }

  // ✅ CLEANUP
  cleanup(): void {
    this.onQuizAnswer = null;
    this.onStrategicAnswer = null;
    this.onStepNavigation = null;
    this.currentAnswers = [];
    this.strategicAnswers = [];
    this.userName = '';
    console.log('🧹 QuizEventDispatcher: Cleanup realizado');
  }
}

// ✅ EXPORT SINGLETON INSTANCE
export const quizEventDispatcher = new GlobalQuizEventDispatcher();

// ✅ HELPER FUNCTIONS PARA USO NOS TEMPLATES
export const createQuizAnswerEvent = (
  questionId: string,
  optionId: string,
  stepNumber: number,
  category?: string
): QuizEventData => ({
  questionId,
  optionId,
  category,
  stepNumber,
  timestamp: Date.now(),
});

export const createStrategicAnswerEvent = (
  questionId: string,
  optionId: string,
  stepNumber: number,
  category: string,
  strategicType?: string
): QuizEventData => ({
  questionId,
  optionId,
  category,
  strategicType,
  stepNumber,
  timestamp: Date.now(),
});

// ✅ DEBUGGING FUNCTIONS
export const getQuizEventDispatcherStatus = () => ({
  hasQuizListener: !!quizEventDispatcher.onQuizAnswer,
  hasStrategicListener: !!quizEventDispatcher.onStrategicAnswer,
  hasNavigationListener: !!quizEventDispatcher.onStepNavigation,
  currentAnswersCount: quizEventDispatcher.getCurrentAnswers().length,
  strategicAnswersCount: quizEventDispatcher.getStrategicAnswers().length,
  userName: quizEventDispatcher.getUserName(),
});

export default quizEventDispatcher;