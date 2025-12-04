/**
 * 🎯 USE QUIZ CANONICAL - HOOK UNIFICADO PARA QUIZ
 * 
 * Consolida 25+ hooks useQuiz* em uma única interface canônica:
 * - useQuizState → state management
 * - useQuizNavigation → navigation
 * - useQuizCore → core logic
 * - useQuizResults → result calculation
 * - useQuizValidation → validation
 * - useQuizTracking → analytics
 * - useQuizLogic → business logic
 * 
 * @example
 * const quiz = useQuizCanonical({ totalSteps: 21 });
 * quiz.navigation.next();
 * quiz.answers.add('step-01', ['option-a']);
 * quiz.result.calculate();
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES
// ============================================================================

export interface QuizAnswer {
  stepId: string;
  selections: string[];
  timestamp: number;
  score?: number;
}

export interface QuizScores {
  [category: string]: number;
}

export interface QuizResult {
  primaryStyle: string;
  secondaryStyles: string[];
  scores: QuizScores;
  percentage: number;
  completedAt: number;
}

export interface QuizUserProfile {
  userName: string;
  email?: string;
  resultStyle?: string;
  secondaryStyles: string[];
}

export interface QuizAnalytics {
  startTime: number;
  endTime?: number;
  totalAnswers: number;
  timePerStep: Record<string, number>;
  abandonmentStep?: string;
}

export interface QuizCanonicalConfig {
  totalSteps?: number;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
  persistState?: boolean;
  onStepChange?: (step: number) => void;
  onComplete?: (result: QuizResult) => void;
}

export interface QuizCanonicalState {
  currentStep: number;
  answers: Record<string, QuizAnswer>;
  scores: QuizScores;
  userProfile: QuizUserProfile;
  isCompleted: boolean;
  isLoading: boolean;
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

const DEFAULT_CONFIG: Required<QuizCanonicalConfig> = {
  totalSteps: 21,
  autoAdvance: false,
  autoAdvanceDelay: 500,
  persistState: false,
  onStepChange: () => {},
  onComplete: () => {},
};

const INITIAL_SCORES: QuizScores = {
  natural: 0,
  classico: 0,
  contemporaneo: 0,
  elegante: 0,
  romantico: 0,
  sexy: 0,
  dramatico: 0,
  criativo: 0,
};

const INITIAL_USER_PROFILE: QuizUserProfile = {
  userName: '',
  secondaryStyles: [],
};

const INITIAL_STATE: QuizCanonicalState = {
  currentStep: 1,
  answers: {},
  scores: { ...INITIAL_SCORES },
  userProfile: { ...INITIAL_USER_PROFILE },
  isCompleted: false,
  isLoading: false,
};

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export function useQuizCanonical(config?: QuizCanonicalConfig) {
  const cfg = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);
  
  // State
  const [state, setState] = useState<QuizCanonicalState>(INITIAL_STATE);
  const analyticsRef = useRef<QuizAnalytics>({
    startTime: Date.now(),
    totalAnswers: 0,
    timePerStep: {},
  });
  const stepStartTimeRef = useRef<number>(Date.now());
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Track step time
  useEffect(() => {
    const stepKey = `step-${state.currentStep}`;
    const elapsed = Date.now() - stepStartTimeRef.current;
    
    if (elapsed > 100) { // Only track meaningful time
      analyticsRef.current.timePerStep[stepKey] = elapsed;
    }
    
    stepStartTimeRef.current = Date.now();
    cfg.onStepChange(state.currentStep);
  }, [state.currentStep, cfg]);

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  const navigation = useMemo(() => ({
    current: state.currentStep,
    total: cfg.totalSteps,
    
    canGoNext: state.currentStep < cfg.totalSteps,
    canGoPrevious: state.currentStep > 1,
    
    progress: Math.round((state.currentStep / cfg.totalSteps) * 100),
    
    next: () => {
      if (state.currentStep < cfg.totalSteps) {
        setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
      }
    },
    
    previous: () => {
      if (state.currentStep > 1) {
        setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
      }
    },
    
    goTo: (step: number) => {
      if (step >= 1 && step <= cfg.totalSteps) {
        setState(prev => ({ ...prev, currentStep: step }));
      }
    },
    
    reset: () => {
      setState(prev => ({ ...prev, currentStep: 1 }));
    },
  }), [state.currentStep, cfg.totalSteps]);

  // ============================================================================
  // ANSWERS
  // ============================================================================

  const answers = useMemo(() => ({
    all: state.answers,
    
    get: (stepId: string) => state.answers[stepId],
    
    has: (stepId: string) => !!state.answers[stepId],
    
    count: Object.keys(state.answers).length,
    
    add: (stepId: string, selections: string[], score?: number) => {
      // Cancel pending auto-advance
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = null;
      }
      
      const answer: QuizAnswer = {
        stepId,
        selections,
        timestamp: Date.now(),
        score,
      };
      
      setState(prev => ({
        ...prev,
        answers: { ...prev.answers, [stepId]: answer },
      }));
      
      analyticsRef.current.totalAnswers++;
      
      // Auto-advance if enabled
      if (cfg.autoAdvance && selections.length > 0) {
        autoAdvanceTimerRef.current = setTimeout(() => {
          navigation.next();
          autoAdvanceTimerRef.current = null;
        }, cfg.autoAdvanceDelay);
      }
      
      appLogger.info(`[QuizCanonical] Answer added for ${stepId}`, { data: selections });
    },
    
    update: (stepId: string, selections: string[]) => {
      setState(prev => ({
        ...prev,
        answers: {
          ...prev.answers,
          [stepId]: { ...prev.answers[stepId], selections, timestamp: Date.now() },
        },
      }));
    },
    
    remove: (stepId: string) => {
      setState(prev => {
        const { [stepId]: _, ...rest } = prev.answers;
        return { ...prev, answers: rest };
      });
    },
    
    clear: () => {
      setState(prev => ({ ...prev, answers: {} }));
      analyticsRef.current.totalAnswers = 0;
    },
  }), [state.answers, cfg.autoAdvance, cfg.autoAdvanceDelay, navigation]);

  // ============================================================================
  // USER PROFILE
  // ============================================================================

  const userProfile = useMemo(() => ({
    data: state.userProfile,
    
    setName: (name: string) => {
      setState(prev => ({
        ...prev,
        userProfile: { ...prev.userProfile, userName: name.trim() },
      }));
    },
    
    setEmail: (email: string) => {
      setState(prev => ({
        ...prev,
        userProfile: { ...prev.userProfile, email },
      }));
    },
    
    update: (updates: Partial<QuizUserProfile>) => {
      setState(prev => ({
        ...prev,
        userProfile: { ...prev.userProfile, ...updates },
      }));
    },
    
    reset: () => {
      setState(prev => ({ ...prev, userProfile: { ...INITIAL_USER_PROFILE } }));
    },
  }), [state.userProfile]);

  // ============================================================================
  // SCORES & RESULTS
  // ============================================================================

  const calculateScores = useCallback((): QuizScores => {
    const scores = { ...INITIAL_SCORES };
    
    Object.values(state.answers).forEach(answer => {
      if (answer.score) {
        // Distribute score to categories based on selections
        answer.selections.forEach(selection => {
          const category = selection.split('-')[0];
          if (category in scores) {
            scores[category] += answer.score || 1;
          }
        });
      }
    });
    
    return scores;
  }, [state.answers]);

  const result = useMemo(() => ({
    scores: state.scores,
    isCompleted: state.isCompleted,
    
    calculate: (): QuizResult => {
      const scores = calculateScores();
      
      // Find primary and secondary styles
      const sorted = Object.entries(scores)
        .sort(([, a], [, b]) => b - a);
      
      const primaryStyle = sorted[0]?.[0] || 'natural';
      const secondaryStyles = sorted.slice(1, 3).map(([style]) => style);
      
      const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0);
      const maxPossible = cfg.totalSteps * 10; // Assuming max 10 points per step
      const percentage = Math.round((totalScore / maxPossible) * 100);
      
      const quizResult: QuizResult = {
        primaryStyle,
        secondaryStyles,
        scores,
        percentage,
        completedAt: Date.now(),
      };
      
      setState(prev => ({
        ...prev,
        scores,
        isCompleted: true,
        userProfile: {
          ...prev.userProfile,
          resultStyle: primaryStyle,
          secondaryStyles,
        },
      }));
      
      analyticsRef.current.endTime = Date.now();
      cfg.onComplete(quizResult);
      
      appLogger.info('[QuizCanonical] Result calculated', { data: quizResult });
      
      return quizResult;
    },
    
    reset: () => {
      setState(prev => ({
        ...prev,
        scores: { ...INITIAL_SCORES },
        isCompleted: false,
      }));
    },
  }), [state.scores, state.isCompleted, calculateScores, cfg]);

  // ============================================================================
  // VALIDATION
  // ============================================================================

  const validation = useMemo(() => ({
    isStepComplete: (stepId: string, requiredSelections = 1) => {
      const answer = state.answers[stepId];
      return answer && answer.selections.length >= requiredSelections;
    },
    
    isCurrentStepComplete: (requiredSelections = 1) => {
      const stepKey = `step-${String(state.currentStep).padStart(2, '0')}`;
      const answer = state.answers[stepKey];
      return answer && answer.selections.length >= requiredSelections;
    },
    
    canProceed: () => {
      // Check if current step has required answers
      const stepKey = `step-${String(state.currentStep).padStart(2, '0')}`;
      return !!state.answers[stepKey];
    },
    
    getIncompleteSteps: () => {
      const incomplete: number[] = [];
      for (let i = 1; i <= state.currentStep; i++) {
        const stepKey = `step-${String(i).padStart(2, '0')}`;
        if (!state.answers[stepKey]) {
          incomplete.push(i);
        }
      }
      return incomplete;
    },
  }), [state.answers, state.currentStep]);

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  const analytics = useMemo(() => ({
    data: analyticsRef.current,
    
    getTimeSpent: () => {
      const endTime = analyticsRef.current.endTime || Date.now();
      return endTime - analyticsRef.current.startTime;
    },
    
    getAverageTimePerStep: () => {
      const times = Object.values(analyticsRef.current.timePerStep);
      if (times.length === 0) return 0;
      return times.reduce((sum, t) => sum + t, 0) / times.length;
    },
    
    trackEvent: (event: string, data?: Record<string, unknown>) => {
      appLogger.info(`[QuizCanonical] Event: ${event}`, { data });
    },
    
    markAbandonment: () => {
      analyticsRef.current.abandonmentStep = `step-${state.currentStep}`;
      analyticsRef.current.endTime = Date.now();
    },
  }), [state.currentStep]);

  // ============================================================================
  // GLOBAL ACTIONS
  // ============================================================================

  const reset = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    
    setState(INITIAL_STATE);
    analyticsRef.current = {
      startTime: Date.now(),
      totalAnswers: 0,
      timePerStep: {},
    };
    stepStartTimeRef.current = Date.now();
    
    appLogger.info('[QuizCanonical] Quiz reset');
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // State
    state,
    isLoading: state.isLoading,
    isCompleted: state.isCompleted,
    
    // Grouped APIs
    navigation,
    answers,
    userProfile,
    result,
    validation,
    analytics,
    
    // Global actions
    reset,
    setLoading,
    
    // Direct accessors (convenience)
    currentStep: state.currentStep,
    userName: state.userProfile.userName,
    scores: state.scores,
  };
}

export type UseQuizCanonicalReturn = ReturnType<typeof useQuizCanonical>;

export default useQuizCanonical;
