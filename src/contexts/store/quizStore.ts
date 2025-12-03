/**
 * 🎯 QUIZ STORE - Zustand Store para Estado do Quiz
 * 
 * Gerencia todo o estado do quiz em execução:
 * - Progresso e navegação
 * - Respostas do usuário
 * - Sessão e analytics
 * - Resultados calculados
 * 
 * Substitui: QuizStateProvider, useQuizState, 20+ hooks fragmentados
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================================================
// TYPES
// ============================================================================

export interface QuizAnswer {
  questionId: string;
  value: string | string[] | number | boolean;
  timestamp: string;
  timeSpentMs?: number;
  metadata?: Record<string, any>;
}

export interface QuizSession {
  id: string;
  funnelId: string;
  startedAt: string;
  completedAt?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  deviceInfo?: {
    userAgent?: string;
    screenSize?: string;
    language?: string;
  };
}

interface QuizState {
  // Navegação
  currentStep: number;
  totalSteps: number;
  visitedSteps: number[];
  
  // Respostas
  answers: Record<string, QuizAnswer>;
  
  // Sessão
  session: QuizSession | null;
  
  // Progresso
  progress: number;
  isCompleted: boolean;
  
  // Resultado
  score: number | null;
  maxScore: number | null;
  resultType: string | null;
  resultData: Record<string, any> | null;
  
  // UI state
  isLoading: boolean;
  isTransitioning: boolean;
  error: string | null;
  
  // Metadata
  userName: string | null;
  userEmail: string | null;
}

interface QuizActions {
  // Navegação
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  setTotalSteps: (total: number) => void;
  
  // Respostas
  setAnswer: (questionId: string, value: QuizAnswer['value'], timeSpentMs?: number) => void;
  clearAnswer: (questionId: string) => void;
  clearAllAnswers: () => void;
  
  // Sessão
  startSession: (funnelId: string, deviceInfo?: QuizSession['deviceInfo']) => void;
  completeSession: () => void;
  abandonSession: () => void;
  
  // Resultado
  setResult: (score: number, maxScore: number, resultType: string, data?: Record<string, any>) => void;
  clearResult: () => void;
  
  // User info
  setUserInfo: (name?: string, email?: string) => void;
  
  // UI
  setLoading: (loading: boolean) => void;
  setTransitioning: (transitioning: boolean) => void;
  setError: (error: string | null) => void;
  
  // Reset
  reset: () => void;
}

type QuizStore = QuizState & QuizActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: QuizState = {
  currentStep: 0,
  totalSteps: 0,
  visitedSteps: [],
  answers: {},
  session: null,
  progress: 0,
  isCompleted: false,
  score: null,
  maxScore: null,
  resultType: null,
  resultData: null,
  isLoading: false,
  isTransitioning: false,
  error: null,
  userName: null,
  userEmail: null,
};

// ============================================================================
// HELPERS
// ============================================================================

const generateSessionId = () => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const calculateProgress = (currentStep: number, totalSteps: number): number => {
  if (totalSteps <= 0) return 0;
  return Math.round((currentStep / totalSteps) * 100);
};

// ============================================================================
// STORE
// ============================================================================

export const useQuizStore = create<QuizStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Navegação
        goToStep: (step) =>
          set((state) => {
            if (step < 0 || step > state.totalSteps) return;
            
            state.currentStep = step;
            if (!state.visitedSteps.includes(step)) {
              state.visitedSteps.push(step);
            }
            state.progress = calculateProgress(step, state.totalSteps);
            state.isTransitioning = false;
          }),

        nextStep: () =>
          set((state) => {
            if (state.currentStep >= state.totalSteps - 1) {
              state.isCompleted = true;
              return;
            }
            
            state.currentStep++;
            if (!state.visitedSteps.includes(state.currentStep)) {
              state.visitedSteps.push(state.currentStep);
            }
            state.progress = calculateProgress(state.currentStep, state.totalSteps);
            state.isTransitioning = false;
          }),

        previousStep: () =>
          set((state) => {
            if (state.currentStep <= 0) return;
            state.currentStep--;
            state.progress = calculateProgress(state.currentStep, state.totalSteps);
            state.isTransitioning = false;
          }),

        setTotalSteps: (total) =>
          set((state) => {
            state.totalSteps = total;
            state.progress = calculateProgress(state.currentStep, total);
          }),

        // Respostas
        setAnswer: (questionId, value, timeSpentMs) =>
          set((state) => {
            state.answers[questionId] = {
              questionId,
              value,
              timestamp: new Date().toISOString(),
              timeSpentMs,
            };
          }),

        clearAnswer: (questionId) =>
          set((state) => {
            delete state.answers[questionId];
          }),

        clearAllAnswers: () =>
          set((state) => {
            state.answers = {};
          }),

        // Sessão
        startSession: (funnelId, deviceInfo) =>
          set((state) => {
            state.session = {
              id: generateSessionId(),
              funnelId,
              startedAt: new Date().toISOString(),
              status: 'in_progress',
              deviceInfo,
            };
            state.isCompleted = false;
            state.currentStep = 0;
            state.visitedSteps = [0];
            state.progress = 0;
          }),

        completeSession: () =>
          set((state) => {
            if (state.session) {
              state.session.completedAt = new Date().toISOString();
              state.session.status = 'completed';
            }
            state.isCompleted = true;
          }),

        abandonSession: () =>
          set((state) => {
            if (state.session) {
              state.session.status = 'abandoned';
            }
          }),

        // Resultado
        setResult: (score, maxScore, resultType, data) =>
          set((state) => {
            state.score = score;
            state.maxScore = maxScore;
            state.resultType = resultType;
            state.resultData = data ?? null;
          }),

        clearResult: () =>
          set((state) => {
            state.score = null;
            state.maxScore = null;
            state.resultType = null;
            state.resultData = null;
          }),

        // User info
        setUserInfo: (name, email) =>
          set((state) => {
            if (name !== undefined) state.userName = name;
            if (email !== undefined) state.userEmail = email;
          }),

        // UI
        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        setTransitioning: (transitioning) =>
          set((state) => {
            state.isTransitioning = transitioning;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
          }),

        // Reset
        reset: () => set(initialState),
      })),
      {
        name: 'quiz-storage',
        partialize: (state) => ({
          answers: state.answers,
          currentStep: state.currentStep,
          session: state.session,
          userName: state.userName,
          userEmail: state.userEmail,
        }),
      },
    ),
    { name: 'QuizStore' },
  ),
);

// ============================================================================
// SELECTORS (Performance Optimized)
// ============================================================================

export const useQuizProgress = () =>
  useQuizStore((state) => ({
    currentStep: state.currentStep,
    totalSteps: state.totalSteps,
    progress: state.progress,
    isCompleted: state.isCompleted,
  }));

export const useCurrentStepAnswer = (questionId: string) =>
  useQuizStore((state) => state.answers[questionId] ?? null);

export const useQuizSession = () =>
  useQuizStore((state) => state.session);

export const useQuizNavigation = () =>
  useQuizStore((state) => ({
    goToStep: state.goToStep,
    nextStep: state.nextStep,
    previousStep: state.previousStep,
    canGoBack: state.currentStep > 0,
    canGoForward: state.currentStep < state.totalSteps - 1,
  }));
