import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { StorageService } from '@/services/core/StorageService';

/**
 * 🚀 OPTIMIZED QUIZ ENGINE - FASE 2
 * 
 * Performance otimizada para 21 etapas
 */

export interface OptimizedQuizState {
  answers: Record<string, any>;
  intermediateScores: Record<string, number>;
  currentStep: number;
  isDirty: boolean;
  lastCalculation: number;
  cachedResult: any | null;
}

export interface UseOptimizedQuizEngineOptions {
  enableIncremental: boolean;
  enableWorker: boolean;
  debounceMs: number;
  cacheTimeout: number;
  autoSave: boolean;
}

const DEFAULT_OPTIONS: UseOptimizedQuizEngineOptions = {
  enableIncremental: true,
  enableWorker: false,
  debounceMs: 300,
  cacheTimeout: 60000,
  autoSave: true
};

// Style weights para cálculo otimizado
const STYLE_WEIGHTS: Record<string, { base: number; multipliers: Record<string, number> }> = {
  'clássico': { base: 1, multipliers: { elegance: 1.2, formality: 1.1 } },
  'romântico': { base: 1, multipliers: { softness: 1.3, femininity: 1.2 } },
  'dramático': { base: 1, multipliers: { boldness: 1.4, contrast: 1.2 } },
  'natural': { base: 1, multipliers: { comfort: 1.2, simplicity: 1.1 } },
  'criativo': { base: 1, multipliers: { uniqueness: 1.5, artistic: 1.3 } }
};

export const useOptimizedQuizEngine = (options = DEFAULT_OPTIONS) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const [state, setState] = useState<OptimizedQuizState>({
    answers: {},
    intermediateScores: {},
    currentStep: 1,
    isDirty: false,
    lastCalculation: 0,
    cachedResult: null
  });

  const debounceRef = useRef<NodeJS.Timeout>();
  const calculationCache = useRef(new Map<string, any>());

  const cacheKey = useMemo(() => {
    const sortedAnswers = Object.keys(state.answers).sort();
    return sortedAnswers.map(key => `${key}:${JSON.stringify(state.answers[key])}`).join('|');
  }, [state.answers]);

  const isCacheValid = useMemo(() => {
    if (!state.cachedResult) return false;
    const age = Date.now() - state.lastCalculation;
    return age < opts.cacheTimeout && !state.isDirty;
  }, [state.cachedResult, state.lastCalculation, state.isDirty, opts.cacheTimeout]);

  const getAnswerScore = useCallback((answer: any, style: string): number => {
    if (!answer) return 0;

    const styleConfig = STYLE_WEIGHTS[style.toLowerCase()];
    if (!styleConfig) return 0;

    let score = styleConfig.base;

    if (answer.attributes) {
      Object.entries(styleConfig.multipliers).forEach(([attr, multiplier]) => {
        if (answer.attributes[attr]) {
          score *= multiplier as number;
        }
      });
    }

    if (answer.weight) {
      score *= answer.weight;
    }

    return score;
  }, []);

  const calculateResult = useCallback(async (): Promise<any | null> => {
    if (isCacheValid && state.cachedResult) {
      return state.cachedResult;
    }

    const cached = calculationCache.current.get(cacheKey);
    if (cached) {
      setState(prev => ({ ...prev, cachedResult: cached, isDirty: false }));
      return cached;
    }

    try {
      const finalScores: Record<string, number> = {};
      Object.entries(state.answers).forEach(([, answer]) => {
        Object.keys(STYLE_WEIGHTS).forEach(style => {
          finalScores[style] = (finalScores[style] || 0) + getAnswerScore(answer, style);
        });
      });

      const sortedStyles = Object.entries(finalScores)
        .filter(([, score]) => score > 0)
        .sort(([, a], [, b]) => b - a);

      if (sortedStyles.length === 0) {
        return null;
      }

      const [predominantStyle, predominantScore] = sortedStyles[0];
      const totalScore = Object.values(finalScores).reduce((sum, score) => sum + score, 0);

      const result = {
        predominantStyle,
        predominantScore,
        totalScore,
        scores: finalScores,
        completedAt: new Date().toISOString(),
      };

      calculationCache.current.set(cacheKey, result);
      setState(prev => ({
        ...prev,
        cachedResult: result,
        isDirty: false,
        lastCalculation: Date.now()
      }));

      if (opts.autoSave) {
        StorageService.safeSetJSON('quizResult', result);
      }

      return result;
    } catch (error) {
      console.error('Calculation failed:', error);
      return null;
    }
  }, [
    isCacheValid,
    state.cachedResult,
    state.answers,
    cacheKey,
    opts.autoSave,
    getAnswerScore
  ]);

  const updateAnswer = useCallback((questionId: string, answer: any) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer },
      isDirty: true
    }));
  }, []);

  const clearCache = useCallback(() => {
    calculationCache.current.clear();
    setState(prev => ({
      ...prev,
      cachedResult: null,
      isDirty: true,
      lastCalculation: 0
    }));
  }, []);

  const getStats = useCallback(() => {
    return {
      answersCount: Object.keys(state.answers).length,
      cacheSize: calculationCache.current.size,
      lastCalculation: state.lastCalculation,
      isDirty: state.isDirty,
      isCacheValid,
    };
  }, [state, isCacheValid]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    answers: state.answers,
    currentResult: state.cachedResult,
    isCalculating: state.isDirty,
    updateAnswer,
    calculateResult,
    clearCache,
    getStats,
  };
};
