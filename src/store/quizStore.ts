/**
 * 🎯 QUIZ STORE - Zustand Store para Quiz Runtime
 * 
 * Store para gerenciar estado do quiz em execução:
 * - Navegação entre steps
 * - Respostas do usuário
 * - Sessão e progresso
 * - Cálculo de resultados
 * 
 * Substitui: QuizContext, useQuizFlow, useOptimizedQuizFlow
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================================================
// TYPES
// ============================================================================

export interface QuizAnswer {
  stepId: string;
  questionId: string;
  questionText: string;
  answerValue: string;
  answerText: string;
  scoreEarned?: number;
  respondedAt: Date;
}

export interface QuizSession {
  sessionId: string;
  funnelId: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  startedAt: Date;
  completedAt?: Date;
  currentStep: number;
  totalSteps: number;
  answers: QuizAnswer[];
  score: number;
  maxScore: number;
  metadata: Record<string, any>;
}

interface QuizState {
  // Sessão
  session: QuizSession | null;
  
  // Navegação
  currentStep: number;
  totalSteps: number;
  
  // Respostas
  answers: Record<string, QuizAnswer>;
  
  // Status
  isStarted: boolean;
  isCompleted: boolean;
  isLoading: boolean;
  
  // Validação
  canProceed: boolean;
  validationErrors: string[];
}

interface QuizActions {
  // Sessão
  startSession: (funnelId: string, totalSteps: number, userData?: Partial<QuizSession>) => void;
  endSession: () => void;
  updateSessionMetadata: (metadata: Record<string, any>) => void;
  
  // Navegação
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  
  // Respostas
  saveAnswer: (answer: Omit<QuizAnswer, 'respondedAt'>) => void;
  updateAnswer: (stepId: string, updates: Partial<QuizAnswer>) => void;
  clearAnswer: (stepId: string) => void;
  
  // Validação
  validateCurrentStep: () => boolean;
  setCanProceed: (canProceed: boolean) => void;
  
  // Estado
  setLoading: (isLoading: boolean) => void;
  
  // Reset
  reset: () => void;
}

type QuizStore = QuizState & QuizActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: QuizState = {
  session: null,
  currentStep: 1,
  totalSteps: 0,
  answers: {},
  isStarted: false,
  isCompleted: false,
  isLoading: false,
  canProceed: false,
  validationErrors: [],
};

// ============================================================================
// STORE
// ============================================================================

export const useQuizStore = create<QuizStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Sessão
        startSession: (funnelId, totalSteps, userData = {}) =>
          set((state) => {
            state.session = {
              sessionId: `session-${Date.now()}`,
              funnelId,
              userId: userData.userId,
              userName: userData.userName,
              userEmail: userData.userEmail,
              startedAt: new Date(),
              currentStep: 1,
              totalSteps,
              answers: [],
              score: 0,
              maxScore: 0,
              metadata: userData.metadata ?? {},
            };
            state.currentStep = 1;
            state.totalSteps = totalSteps;
            state.isStarted = true;
            state.isCompleted = false;
          }),

        endSession: () =>
          set((state) => {
            if (state.session) {
              state.session.completedAt = new Date();
              state.session.answers = Object.values(state.answers);
            }
            state.isCompleted = true;
          }),

        updateSessionMetadata: (metadata) =>
          set((state) => {
            if (state.session) {
              state.session.metadata = { ...state.session.metadata, ...metadata };
            }
          }),

        // Navegação
        nextStep: () =>
          set((state) => {
            if (state.currentStep < state.totalSteps) {
              state.currentStep++;
              state.canProceed = false;
              state.validationErrors = [];
              
              if (state.session) {
                state.session.currentStep = state.currentStep;
              }
            } else {
              // Último step - completar
              if (state.session) {
                state.session.completedAt = new Date();
              }
              state.isCompleted = true;
            }
          }),

        previousStep: () =>
          set((state) => {
            if (state.currentStep > 1) {
              state.currentStep--;
              state.validationErrors = [];
              
              if (state.session) {
                state.session.currentStep = state.currentStep;
              }
            }
          }),

        goToStep: (step) =>
          set((state) => {
            if (step >= 1 && step <= state.totalSteps) {
              state.currentStep = step;
              state.validationErrors = [];
              
              if (state.session) {
                state.session.currentStep = step;
              }
            }
          }),

        // Respostas
        saveAnswer: (answer) =>
          set((state) => {
            const fullAnswer: QuizAnswer = {
              ...answer,
              respondedAt: new Date(),
            };
            
            state.answers[answer.stepId] = fullAnswer;
            
            // Atualizar score da sessão
            if (state.session && fullAnswer.scoreEarned) {
              state.session.score += fullAnswer.scoreEarned;
            }
            
            // Auto-validar após salvar resposta
            const hasAnswer = !!state.answers[`step-${state.currentStep}`];
            state.canProceed = hasAnswer;
          }),

        updateAnswer: (stepId, updates) =>
          set((state) => {
            const existingAnswer = state.answers[stepId];
            if (existingAnswer) {
              state.answers[stepId] = { ...existingAnswer, ...updates };
            }
          }),

        clearAnswer: (stepId) =>
          set((state) => {
            delete state.answers[stepId];
            state.canProceed = false;
          }),

        // Validação
        validateCurrentStep: () => {
          const state = get();
          const currentStepId = `step-${state.currentStep}`;
          const hasAnswer = !!state.answers[currentStepId];
          
          set((draft) => {
            draft.canProceed = hasAnswer;
            draft.validationErrors = hasAnswer ? [] : ['Por favor, responda a pergunta'];
          });
          
          return hasAnswer;
        },

        setCanProceed: (canProceed) =>
          set((state) => {
            state.canProceed = canProceed;
          }),

        // Estado
        setLoading: (isLoading) =>
          set((state) => {
            state.isLoading = isLoading;
          }),

        // Reset
        reset: () => set(initialState),
      })),
      {
        name: 'quiz-storage',
        partialize: (state) => ({
          session: state.session,
          currentStep: state.currentStep,
          answers: state.answers,
          isStarted: state.isStarted,
        }),
      }
    ),
    { name: 'QuizStore' }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const useQuizProgress = () =>
  useQuizStore((state) => ({
    currentStep: state.currentStep,
    totalSteps: state.totalSteps,
    percentage: state.totalSteps > 0 ? (state.currentStep / state.totalSteps) * 100 : 0,
  }));

export const useCurrentStepAnswer = () =>
  useQuizStore((state) => state.answers[`step-${state.currentStep}`] ?? null);

export const useQuizSession = () => useQuizStore((state) => state.session);

export const useQuizNavigation = () =>
  useQuizStore((state) => ({
    canGoNext: state.canProceed && state.currentStep < state.totalSteps,
    canGoBack: state.currentStep > 1,
    isLastStep: state.currentStep === state.totalSteps,
    isFirstStep: state.currentStep === 1,
  }));
