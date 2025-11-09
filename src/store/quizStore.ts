/**
 * 🎯 QUIZ STORE - Zustand Store para Quiz Runtime
 * 
 * Store para gerenciar estado do quiz em execução:
 * - Navegação entre steps
 * - Respostas do usuário
 * - Sessão e progresso
 * - Cálculo de resultados
 * - 🆕 Sistema de pontuação com badges e níveis
 * 
 * Substitui: QuizContext, useQuizFlow, useOptimizedQuizFlow
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { calculateScore } from '@/lib/utils/scoreCalculator';
import type { Answer as ScoreAnswer, ScoringRules } from '@/lib/utils/scoreCalculator';

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
  timeSpent?: number;           // 🆕 Tempo em segundos para speed bonus
  isCorrect?: boolean;          // 🆕 Para cálculo de pontuação
  respondedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: Date;
}

export interface ScoreSystem {
  currentScore: number;
  maxScore: number;
  percentage: number;
  level: {
    current: number;
    name: string;
    nextLevelAt: number;
  };
  badges: Badge[];
  streak: number;                // Sequência de acertos
  breakdown: Array<{
    questionId: string;
    basePoints: number;
    bonusPoints: number;
    penalties: number;
    totalPoints: number;
    notes: string[];
  }>;
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
  scoreSystem?: ScoreSystem;     // 🆕 Sistema de pontuação avançado
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
  
  // 🆕 Pontuação (Sistema de Scoring v2.0)
  updateScore: (config?: any) => void;
  calculateFinalScore: () => void;
  addBadge: (badge: Omit<Badge, 'earnedAt'>) => void;
  
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

        // 🆕 Pontuação (Sistema de Scoring v2.0)
        updateScore: (config?: Partial<ScoringRules>) =>
          set((state) => {
            if (!state.session) return;

            // Converter answers do store para formato do scoreCalculator
            const answersArray: ScoreAnswer[] = Object.values(state.answers).map(ans => ({
              questionId: ans.stepId,
              selectedOptions: ans.answerValue ? [ans.answerValue] : [],
              timeSpent: ans.timeSpent || 0,
              isCorrect: ans.isCorrect,
              confidence: 100,
            }));

            // Se não tem respostas ainda, inicializar scoreSystem vazio
            if (answersArray.length === 0) {
              state.session.scoreSystem = {
                currentScore: 0,
                maxScore: 0,
                percentage: 0,
                level: { current: 1, name: 'Iniciante', nextLevelAt: 100 },
                badges: [],
                streak: 0,
                breakdown: [],
              };
              return;
            }

            try {
              // Calcular com scoreCalculator.ts
              const result = calculateScore(answersArray, config);
              
              // Converter badges de string[] para Badge[]
              const badgesWithDetails: Badge[] = result.badges.map((badgeStr, idx) => ({
                id: `badge-${idx}`,
                name: badgeStr,
                icon: badgeStr.split(' ')[0], // Emoji do início
                description: badgeStr,
                earnedAt: new Date(),
              }));
              
              state.session.scoreSystem = {
                currentScore: result.totalScore,
                maxScore: result.maxPossibleScore,
                percentage: result.percentage,
                level: result.level,
                badges: badgesWithDetails,
                streak: answersArray.filter((a, idx) => 
                  a.isCorrect !== false && 
                  (idx === 0 || answersArray[idx - 1].isCorrect !== false)
                ).length,
                breakdown: result.breakdown,
              };
              
              state.session.score = result.totalScore;
              state.session.maxScore = result.maxPossibleScore;
            } catch (error) {
              console.error('Error calculating score:', error);
              
              // Fallback simplificado
              const totalAnswered = answersArray.filter(a => a.selectedOptions.length > 0).length;
              const currentScore = totalAnswered * 10;
              const maxScore = answersArray.length * 10;
              const percentage = Math.round((currentScore / maxScore) * 100);
              
              state.session.scoreSystem = {
                currentScore,
                maxScore,
                percentage,
                level: {
                  current: Math.floor(currentScore / 100) + 1,
                  name: currentScore > 200 ? 'Mestre' : currentScore > 100 ? 'Explorador' : 'Iniciante',
                  nextLevelAt: (Math.floor(currentScore / 100) + 1) * 100,
                },
                badges: [],
                streak: 0,
                breakdown: [],
              };
              
              state.session.score = currentScore;
              state.session.maxScore = maxScore;
            }
          }),

        calculateFinalScore: () =>
          set((state) => {
            // Chamar updateScore com config final
            if (state.session) {
              // Trigger final calculation
              get().updateScore();
            }
          }),

        addBadge: (badge) =>
          set((state) => {
            if (!state.session?.scoreSystem) return;
            
            const fullBadge: Badge = {
              ...badge,
              earnedAt: new Date(),
            };
            
            // Adicionar badge se não existir
            const exists = state.session.scoreSystem.badges.some(b => b.id === fullBadge.id);
            if (!exists) {
              state.session.scoreSystem.badges.push(fullBadge);
            }
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
      },
    ),
    { name: 'QuizStore' },
  ),
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
