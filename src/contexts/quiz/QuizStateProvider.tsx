/**
 * 🎯 QuizStateProvider - Gerenciamento de Estado do Quiz
 * 
 * Responsabilidades:
 * - Estado de respostas do usuário
 * - Cálculo de pontuação
 * - Progresso do quiz
 * - Validação de respostas
 * 
 * Fase 2.1 - Provider Modular Independente
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface QuizAnswer {
    questionId: string;
    stepId: string;
    value: any;
    timestamp: number;
    isCorrect?: boolean;
    points?: number;
}

export interface QuizProgress {
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    skippedQuestions: number;
    completionPercentage: number;
    currentScore: number;
    maxScore: number;
}

export interface QuizState {
    answers: Record<string, QuizAnswer>;
    progress: QuizProgress;
    isStarted: boolean;
    isCompleted: boolean;
    startedAt: number | null;
    completedAt: number | null;
    timeSpent: number; // em segundos
}

export interface QuizContextValue {
    // State
    state: QuizState;

    // Answer methods
    setAnswer: (questionId: string, stepId: string, value: any, isCorrect?: boolean, points?: number) => void;
    getAnswer: (questionId: string) => QuizAnswer | undefined;
    clearAnswer: (questionId: string) => void;
    clearAllAnswers: () => void;

    // Quiz control
    startQuiz: () => void;
    completeQuiz: () => void;
    resetQuiz: () => void;

    // Progress queries
    isQuestionAnswered: (questionId: string) => boolean;
    getAnsweredCount: () => number;
    getScore: () => number;

    // Configuration
    setTotalQuestions: (total: number) => void;
    setMaxScore: (max: number) => void;
}

interface QuizStateProviderProps {
    children: ReactNode;
    totalQuestions?: number;
    maxScore?: number;
    onQuizComplete?: (state: QuizState) => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const QuizStateContext = createContext<QuizContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export function QuizStateProvider({
    children,
    totalQuestions = 0,
    maxScore = 0,
    onQuizComplete,
}: QuizStateProviderProps) {
    // State
    const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});
    const [isStarted, setIsStarted] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [startedAt, setStartedAt] = useState<number | null>(null);
    const [completedAt, setCompletedAt] = useState<number | null>(null);
    const [totalQuestionsCount, setTotalQuestionsCount] = useState(totalQuestions);
    const [maxScoreValue, setMaxScoreValue] = useState(maxScore);

    // Calculate progress
    const progress = useMemo<QuizProgress>(() => {
        const answersArray = Object.values(answers);
        const answeredQuestions = answersArray.length;
        const correctAnswers = answersArray.filter(a => a.isCorrect === true).length;
        const incorrectAnswers = answersArray.filter(a => a.isCorrect === false).length;
        const skippedQuestions = totalQuestionsCount - answeredQuestions;
        const completionPercentage = totalQuestionsCount > 0
            ? Math.round((answeredQuestions / totalQuestionsCount) * 100)
            : 0;
        const currentScore = answersArray.reduce((sum, a) => sum + (a.points || 0), 0);

        return {
            totalQuestions: totalQuestionsCount,
            answeredQuestions,
            correctAnswers,
            incorrectAnswers,
            skippedQuestions,
            completionPercentage,
            currentScore,
            maxScore: maxScoreValue,
        };
    }, [answers, totalQuestionsCount, maxScoreValue]);

    // Calculate time spent
    const timeSpent = useMemo(() => {
        if (!startedAt) return 0;
        const endTime = completedAt || Date.now();
        return Math.floor((endTime - startedAt) / 1000);
    }, [startedAt, completedAt]);

    // Answer methods
    const setAnswer = useCallback((
        questionId: string,
        stepId: string,
        value: any,
        isCorrect?: boolean,
        points?: number
    ) => {
        const answer: QuizAnswer = {
            questionId,
            stepId,
            value,
            timestamp: Date.now(),
            isCorrect,
            points,
        };

        setAnswers(prev => ({
            ...prev,
            [questionId]: answer,
        }));

        appLogger.info('Answer recorded', 'QuizStateProvider', {
            questionId,
            isCorrect,
            points
        });
    }, []);

    const getAnswer = useCallback((questionId: string): QuizAnswer | undefined => {
        return answers[questionId];
    }, [answers]);

    const clearAnswer = useCallback((questionId: string) => {
        setAnswers(prev => {
            const newAnswers = { ...prev };
            delete newAnswers[questionId];
            return newAnswers;
        });
        appLogger.info('Answer cleared', 'QuizStateProvider', { questionId });
    }, []);

    const clearAllAnswers = useCallback(() => {
        setAnswers({});
        appLogger.info('All answers cleared', 'QuizStateProvider');
    }, []);

    // Quiz control
    const startQuiz = useCallback(() => {
        setIsStarted(true);
        setStartedAt(Date.now());
        appLogger.info('Quiz started', 'QuizStateProvider');
    }, []);

    const completeQuiz = useCallback(() => {
        if (isCompleted) return;

        setIsCompleted(true);
        setCompletedAt(Date.now());

        const finalState: QuizState = {
            answers,
            progress,
            isStarted,
            isCompleted: true,
            startedAt,
            completedAt: Date.now(),
            timeSpent: Math.floor((Date.now() - (startedAt || Date.now())) / 1000),
        };

        if (onQuizComplete) {
            onQuizComplete(finalState);
        }

        appLogger.info('Quiz completed', 'QuizStateProvider', {
            score: progress.currentScore,
            answeredQuestions: progress.answeredQuestions,
            timeSpent: finalState.timeSpent,
        });
    }, [isCompleted, answers, progress, isStarted, startedAt, onQuizComplete]);

    const resetQuiz = useCallback(() => {
        setAnswers({});
        setIsStarted(false);
        setIsCompleted(false);
        setStartedAt(null);
        setCompletedAt(null);
        appLogger.info('Quiz reset', 'QuizStateProvider');
    }, []);

    // Progress queries
    const isQuestionAnswered = useCallback((questionId: string): boolean => {
        return questionId in answers;
    }, [answers]);

    const getAnsweredCount = useCallback((): number => {
        return Object.keys(answers).length;
    }, [answers]);

    const getScore = useCallback((): number => {
        return progress.currentScore;
    }, [progress]);

    // Configuration
    const setTotalQuestions = useCallback((total: number) => {
        setTotalQuestionsCount(total);
    }, []);

    const setMaxScore = useCallback((max: number) => {
        setMaxScoreValue(max);
    }, []);

    // Build state object
    const state: QuizState = useMemo(() => ({
        answers,
        progress,
        isStarted,
        isCompleted,
        startedAt,
        completedAt,
        timeSpent,
    }), [answers, progress, isStarted, isCompleted, startedAt, completedAt, timeSpent]);

    // Context value with memoization
    const contextValue = useMemo<QuizContextValue>(() => ({
        state,
        setAnswer,
        getAnswer,
        clearAnswer,
        clearAllAnswers,
        startQuiz,
        completeQuiz,
        resetQuiz,
        isQuestionAnswered,
        getAnsweredCount,
        getScore,
        setTotalQuestions,
        setMaxScore,
    }), [
        state,
        setAnswer,
        getAnswer,
        clearAnswer,
        clearAllAnswers,
        startQuiz,
        completeQuiz,
        resetQuiz,
        isQuestionAnswered,
        getAnsweredCount,
        getScore,
        setTotalQuestions,
        setMaxScore,
    ]);

    return (
        <QuizStateContext.Provider value={contextValue}>
            {children}
        </QuizStateContext.Provider>
    );
}

// ============================================================================
// HOOK
// ============================================================================

export function useQuizState(): QuizContextValue {
    const context = useContext(QuizStateContext);

    if (!context) {
        throw new Error('useQuizState must be used within QuizStateProvider');
    }

    return context;
}

// Display name for debugging
QuizStateProvider.displayName = 'QuizStateProvider';
