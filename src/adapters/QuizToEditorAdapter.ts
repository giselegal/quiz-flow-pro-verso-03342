/**
 * 🎯 QUIZ TO EDITOR ADAPTER - ADAPTADOR DE QUIZ PARA EDITOR
 * 
 * Converte dados do quiz para o formato do editor unificado
 * e vice-versa, mantendo sincronização bidirecional.
 */

import { Block } from '@/types/editor';
import { QUIZ_STEPS, STEP_ORDER } from '@/data/quizSteps';
import { QuizQuestion } from '@/types/quiz';
import { QuizEditorPersistenceService } from '@/services/QuizEditorPersistenceService';
import { QUIZ_EDITOR_VERSION, QuizTemplateData } from '@/types/quizEditor';

// Tipo simples para QuizAnswer no contexto do adapter
export interface QuizAnswer {
  id: string;
  text: string;
  description?: string;
  stylePoints?: Record<string, number>;
}

// =============================================================================
// TIPOS E INTERFACES
// =============================================================================

export interface EditorQuizState {
  id: string;
  name: string;
  description: string;
  questions: QuizQuestion[];
  styles: any[];
  stepBlocks: Record<string, Block[]>; // 🔄 blocos por step (placeholder)
  scoringMatrix?: Record<string, Record<string, Record<string, number>>>; // matriz agregada
  isDirty: boolean;
  lastSaved?: string;
  version: string;
}

export interface SyncResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

export interface ChangeEvent {
  type: 'question-updated' | 'data-saved' | 'sync-error';
  payload: any;
  timestamp: string;
}

export interface QuizStepData {
  type: 'intro' | 'question' | 'strategic-question' | 'transition' | 'result' | 'offer';
  stepNumber: number;
  blocks: Block[];
  metadata: {
    isQuizStep: boolean;
    originalQuizStep: number;
  };
}

// =============================================================================
// ADAPTADOR PRINCIPAL
// =============================================================================

export class QuizToEditorAdapter {
  private isDirty = false;
  private currentState: EditorQuizState | null = null;
  private changeListeners: ((event: ChangeEvent) => void)[] = [];
  private autoSaveInterval?: NodeJS.Timeout;

  constructor() {
    console.log('🎯 QuizToEditorAdapter inicializado');
  }

  /**
   * 🔄 Converter quiz para estado do editor
   */
  async convertQuizToEditor(quizData?: any | { funnelId?: string; templateId?: string }): Promise<EditorQuizState> {
    try {
      console.log('🔄 Convertendo quiz para editor...');
      // 1) Se nenhum objeto for passado, derivar do runtime canonical (QUIZ_STEPS)
      let source: any = quizData;
      if (!source || (source && !Array.isArray(source?.questions))) {
        source = this.buildFromCanonical();
      }

      // 2) Carregar scoringMatrix já persistida (se existir)
      let scoringMatrix: EditorQuizState['scoringMatrix'];
      const persisted = await QuizEditorPersistenceService.load(source.id || 'quiz-estilo');
      if (persisted?.scoringMatrix) scoringMatrix = persisted.scoringMatrix;

      // 3) Placeholder de stepBlocks (cada step id → array vazia por enquanto)
      const stepBlocks: Record<string, Block[]> = {};
      for (const stepId of Object.keys(QUIZ_STEPS)) {
        stepBlocks[stepId] = [];
      }

      const editorState: EditorQuizState = {
        id: source.id || `quiz-${Date.now()}`,
        name: source.name || 'Quiz Personalizado',
        description: source.description || '',
        questions: this.extractQuestions(source),
        styles: this.extractStyles(source),
        stepBlocks,
        scoringMatrix,
        isDirty: false,
        version: source.version || QUIZ_EDITOR_VERSION
      };

      this.currentState = editorState;
      console.log('✅ Conversão concluída:', editorState);

      return editorState;
    } catch (error) {
      console.error('❌ Erro na conversão:', error);
      throw error;
    }
  }

  /**
   * 🔄 Converter estado do editor para quiz
   */
  async convertEditorToQuiz(editorState: EditorQuizState): Promise<any> {
    try {
      console.log('🔄 Convertendo editor para quiz...');

      const quizData = this.buildCanonicalPayload(editorState);

      console.log('✅ Conversão concluída:', quizData);
      return quizData;
    } catch (error) {
      console.error('❌ Erro na conversão:', error);
      throw error;
    }
  }

  /**
   * 🧱 Monta payload canônico para publicação / persistência remota
   */
  buildCanonicalPayload(editorState: EditorQuizState) {
    return {
      id: editorState.id,
      name: editorState.name,
      description: editorState.description,
      questions: editorState.questions,
      styles: editorState.styles,
      scoringMatrix: editorState.scoringMatrix,
      version: editorState.version,
      metadata: {
        lastModified: new Date().toISOString(),
        source: 'editor',
      }
    };
  }

  /**
   * 📋 Extrair questões do quiz
   */
  private extractQuestions(quizData: any): QuizQuestion[] {
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      return [];
    }

    return quizData.questions.map((question: any, index: number) => ({
      id: question.id || `q${index + 1}`,
      type: question.type || 'single-choice',
      title: question.title || question.text || `Questão ${index + 1}`,
      description: question.description || '',
      required: question.required !== false,
      answers: this.extractAnswers(question.answers || question.options || []),
      order: question.order || index + 1
    }));
  }

  /**
   * 📋 Extrair respostas de uma questão
   */
  private extractAnswers(answers: any[]): QuizAnswer[] {
    if (!Array.isArray(answers)) return [];

    return answers.map((answer: any, index: number) => ({
      id: answer.id || `a${index + 1}`,
      text: answer.text || answer.label || `Opção ${index + 1}`,
      description: answer.description || '',
      stylePoints: answer.stylePoints || answer.weights || {}
    }));
  }

  /**
   * 🎨 Extrair estilos do quiz
   */
  private extractStyles(quizData: any): any[] {
    if (!quizData.styles || !Array.isArray(quizData.styles)) {
      return [];
    }

    return quizData.styles.map((style: any) => ({
      id: style.id || `style-${Date.now()}`,
      name: style.name || 'Estilo',
      description: style.description || '',
      properties: style.properties || {},
      isActive: style.isActive || false
    }));
  }

  /**
   * 📦 Construir estrutura base a partir de QUIZ_STEPS canonical
   */
  private buildFromCanonical() {
    const questions: any[] = [];
    const styles: any[] = []; // Estilos podem ser resolvidos em outra camada; manter vazio por ora
    STEP_ORDER.forEach((stepId, index) => {
      const step: any = (QUIZ_STEPS as any)[stepId];
      if (!step) return;
      if (['question', 'strategic-question', 'offer', 'result', 'intro', 'transition', 'transition-result'].includes(step.type)) {
        questions.push({
          id: stepId,
          type: step.type === 'question' ? 'multiple-choice' : step.type,
          title: step.questionText || step.title || `Step ${index + 1}`,
          description: step.text || '',
          required: step.requiredSelections ? step.requiredSelections > 0 : false,
          answers: (step.options || []).map((opt: any) => ({
            id: opt.id,
            text: opt.text,
            stylePoints: {},
          })),
          order: index + 1,
          variants: step.offerMap ? Object.entries(step.offerMap).map(([matchValue, v]: any) => ({
            id: matchValue,
            matchValue,
            title: v.title,
            description: v.description,
            buttonText: v.buttonText,
            testimonial: v.testimonial
          })) : undefined
        });
      }
    });
    return { id: 'quiz-estilo', name: 'Quiz Estilo Pessoal', questions, styles, version: QUIZ_EDITOR_VERSION };
  }

  /**
   * 💾 Salvar alterações no quiz
   */
  async saveChangesToQuiz(editorState: EditorQuizState): Promise<SyncResult> {
    try {
      console.log('💾 Salvando alterações do editor...');

      // Marcar como limpo
      this.isDirty = false;
      this.currentState = {
        ...editorState,
        isDirty: false,
        lastSaved: new Date().toISOString()
      };

      // Notificar listeners
      this.notifyListeners({
        type: 'data-saved',
        payload: this.currentState,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data: this.currentState,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * ⏰ Iniciar auto-save
   */
  startAutoSave(intervalMs = 30000): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }

    this.autoSaveInterval = setInterval(() => {
      if (this.isDirty && this.currentState) {
        console.log('⏰ Auto-save triggered');
        this.saveChangesToQuiz(this.currentState);
      }
    }, intervalMs);

    console.log(`⏰ Auto-save iniciado (${intervalMs}ms)`);
  }

  /**
   * ⏹️ Parar auto-save
   */
  stopAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = undefined;
      console.log('⏹️ Auto-save parado');
    }
  }

  /**
   * 👂 Adicionar listener para mudanças
   */
  addChangeListener(listener: (event: ChangeEvent) => void): void {
    this.changeListeners.push(listener);
  }

  /**
   * 🗑️ Remover listener
   */
  removeChangeListener(listener: (event: ChangeEvent) => void): void {
    this.changeListeners = this.changeListeners.filter(l => l !== listener);
  }

  /**
   * 📢 Notificar listeners sobre mudanças
   */
  private notifyListeners(event: ChangeEvent): void {
    this.changeListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Erro ao notificar listener:', error);
      }
    });
  }

  /**
   * 🏷️ Marcar estado como alterado
   */
  markDirty(state: EditorQuizState): void {
    this.isDirty = true;
    this.currentState = { ...state, isDirty: true };

    this.notifyListeners({
      type: 'question-updated',
      payload: state,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * ✅ Validar dados do quiz
   */
  static validateQuizData(data: any): boolean {
    if (!data || typeof data !== 'object') return false;

    const required = ['questions', 'styles'];
    return required.every(key => key in data && Array.isArray(data[key]));
  }

  /**
   * 🎯 Obter configuração específica para uma etapa
   */
  static async getStepConfiguration(stepNumber: number): Promise<QuizStepData | null> {
    const stepId = `step-${stepNumber}`;

    // Determinar tipo da etapa baseado no número
    let type: QuizStepData['type'];
    if (stepNumber === 1) type = 'intro';
    else if (stepNumber >= 2 && stepNumber <= 11) type = 'question';
    else if (stepNumber === 12 || stepNumber === 19) type = 'transition';
    else if (stepNumber >= 13 && stepNumber <= 18) type = 'strategic-question';
    else if (stepNumber === 20) type = 'result';
    else if (stepNumber === 21) type = 'offer';
    else type = 'question';

    return {
      type,
      stepNumber,
      blocks: [], // TODO: Implementar geração de blocos
      metadata: {
        isQuizStep: true,
        originalQuizStep: stepNumber
      }
    };
  }

}

export default QuizToEditorAdapter;