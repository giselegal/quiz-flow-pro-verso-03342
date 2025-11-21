/**
 * 🏆 ResultProvider - Gerenciamento de Resultados do Quiz
 * 
 * Responsabilidades:
 * - Cálculo de resultados finais
 * - Mapeamento de scores para categorias
 * - Personalização de mensagens
 * - Histórico de resultados
 * 
 * Fase 2.1 - Provider Modular Independente
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ResultCategory {
    id: string;
    name: string;
    minScore: number;
    maxScore: number;
    description?: string;
    image?: string;
    color?: string;
}

export interface QuizResult {
    id: string;
    score: number;
    maxScore: number;
    percentage: number;
    categoryId: string;
    categoryName: string;
    timestamp: number;
    timeSpent: number; // em segundos
    answersCount: number;
    correctCount: number;
    metadata?: Record<string, any>;
}

export interface ResultState {
    currentResult: QuizResult | null;
    resultHistory: QuizResult[];
    categories: ResultCategory[];
    isCalculating: boolean;
}

export interface ResultContextValue {
    // State
    state: ResultState;

    // Result methods
    calculateResult: (score: number, maxScore: number, metadata?: Record<string, any>) => QuizResult;
    setCurrentResult: (result: QuizResult | null) => void;
    clearCurrentResult: () => void;

    // Categories
    setCategories: (categories: ResultCategory[]) => void;
    getCategoryForScore: (score: number, maxScore: number) => ResultCategory | null;

    // History
    addToHistory: (result: QuizResult) => void;
    getHistory: () => QuizResult[];
    clearHistory: () => void;

    // Utilities
    getResultMessage: (categoryId: string) => string;
    formatScore: (score: number, maxScore: number) => string;
}

interface ResultProviderProps {
    children: ReactNode;
    categories?: ResultCategory[];
    onResultCalculated?: (result: QuizResult) => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ResultContext = createContext<ResultContextValue | undefined>(undefined);

// ============================================================================
// DEFAULT CATEGORIES
// ============================================================================

const DEFAULT_CATEGORIES: ResultCategory[] = [
    {
        id: 'excellent',
        name: 'Excelente',
        minScore: 90,
        maxScore: 100,
        description: 'Parabéns! Você domina o assunto!',
        color: '#10b981',
    },
    {
        id: 'good',
        name: 'Bom',
        minScore: 70,
        maxScore: 89,
        description: 'Muito bem! Continue assim!',
        color: '#3b82f6',
    },
    {
        id: 'average',
        name: 'Regular',
        minScore: 50,
        maxScore: 69,
        description: 'Você pode melhorar com mais estudo.',
        color: '#f59e0b',
    },
    {
        id: 'poor',
        name: 'Precisa Melhorar',
        minScore: 0,
        maxScore: 49,
        description: 'Continue estudando e tente novamente.',
        color: '#ef4444',
    },
];

// ============================================================================
// PROVIDER
// ============================================================================

export function ResultProvider({
    children,
    categories = DEFAULT_CATEGORIES,
    onResultCalculated,
}: ResultProviderProps) {
    // State
    const [currentResult, setCurrentResultState] = useState<QuizResult | null>(null);
    const [resultHistory, setResultHistory] = useState<QuizResult[]>([]);
    const [categoriesState, setCategoriesState] = useState<ResultCategory[]>(categories);
    const [isCalculating, setIsCalculating] = useState(false);

    // Calculate result
    const calculateResult = useCallback((
        score: number,
        maxScore: number,
        metadata: Record<string, any> = {}
    ): QuizResult => {
        setIsCalculating(true);

        try {
            const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
            const category = getCategoryForScore(score, maxScore);

            const result: QuizResult = {
                id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                score,
                maxScore,
                percentage,
                categoryId: category?.id || 'unknown',
                categoryName: category?.name || 'Desconhecido',
                timestamp: Date.now(),
                timeSpent: metadata.timeSpent || 0,
                answersCount: metadata.answersCount || 0,
                correctCount: metadata.correctCount || 0,
                metadata,
            };

            setCurrentResultState(result);
            addToHistory(result);

            if (onResultCalculated) {
                onResultCalculated(result);
            }

            appLogger.info('Result calculated', 'ResultProvider', {
                score,
                maxScore,
                percentage,
                category: category?.name,
            });

            return result;

        } finally {
            setIsCalculating(false);
        }
    }, [categoriesState, onResultCalculated]);

    const setCurrentResult = useCallback((result: QuizResult | null) => {
        setCurrentResultState(result);
    }, []);

    const clearCurrentResult = useCallback(() => {
        setCurrentResultState(null);
        appLogger.info('Current result cleared', 'ResultProvider');
    }, []);

    // Categories
    const setCategories = useCallback((newCategories: ResultCategory[]) => {
        setCategoriesState(newCategories);
        appLogger.info('Categories updated', 'ResultProvider', { count: newCategories.length });
    }, []);

    const getCategoryForScore = useCallback((score: number, maxScore: number): ResultCategory | null => {
        const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

        // Find matching category based on percentage
        const category = categoriesState.find(cat =>
            percentage >= cat.minScore && percentage <= cat.maxScore
        );

        return category || null;
    }, [categoriesState]);

    // History
    const addToHistory = useCallback((result: QuizResult) => {
        setResultHistory(prev => {
            // Keep last 10 results
            const newHistory = [result, ...prev].slice(0, 10);
            return newHistory;
        });
    }, []);

    const getHistory = useCallback((): QuizResult[] => {
        return [...resultHistory];
    }, [resultHistory]);

    const clearHistory = useCallback(() => {
        setResultHistory([]);
        appLogger.info('Result history cleared', 'ResultProvider');
    }, []);

    // Utilities
    const getResultMessage = useCallback((categoryId: string): string => {
        const category = categoriesState.find(cat => cat.id === categoryId);
        return category?.description || 'Resultado calculado.';
    }, [categoriesState]);

    const formatScore = useCallback((score: number, maxScore: number): string => {
        const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
        return `${score}/${maxScore} (${percentage}%)`;
    }, []);

    // Build state object
    const state: ResultState = useMemo(() => ({
        currentResult,
        resultHistory,
        categories: categoriesState,
        isCalculating,
    }), [currentResult, resultHistory, categoriesState, isCalculating]);

    // Context value with memoization
    const contextValue = useMemo<ResultContextValue>(() => ({
        state,
        calculateResult,
        setCurrentResult,
        clearCurrentResult,
        setCategories,
        getCategoryForScore,
        addToHistory,
        getHistory,
        clearHistory,
        getResultMessage,
        formatScore,
    }), [
        state,
        calculateResult,
        setCurrentResult,
        clearCurrentResult,
        setCategories,
        getCategoryForScore,
        addToHistory,
        getHistory,
        clearHistory,
        getResultMessage,
        formatScore,
    ]);

    return (
        <ResultContext.Provider value={contextValue}>
            {children}
        </ResultContext.Provider>
    );
}

// ============================================================================
// HOOK
// ============================================================================

export function useResult(): ResultContextValue {
    const context = useContext(ResultContext);

    if (!context) {
        throw new Error('useResult must be used within ResultProvider');
    }

    return context;
}

// Display name for debugging
ResultProvider.displayName = 'ResultProvider';
