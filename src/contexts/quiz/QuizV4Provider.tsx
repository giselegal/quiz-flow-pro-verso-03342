/**
 * 🎯 QUIZ V4 PROVIDER - INTEGRAÇÃO COMPLETA
 * 
 * Provider que integra:
 * - Carregamento de quiz21-v4.json
 * - Validação com Zod schemas
 * - Logic Engine para navegação
 * - Estado de respostas e progresso
 * 
 * FASE 4: Integração E2E
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { useQuizV4Loader } from '@/hooks/useQuizV4Loader';
import { LogicEngine } from '@/lib/logic-engine';
import { appLogger } from '@/lib/utils/appLogger';
import type { QuizSchema, QuizStep, QuizBlock, NavigationCondition } from '@/schemas/quiz-schema.zod';
import type { Condition } from '@/lib/logic-engine';

// ============================================================================
// TYPES
// ============================================================================

export interface QuizV4Answer {
    questionId: string;
    stepId: string;
    value: any;
    timestamp: number;
    blockId?: string;
}

export interface QuizV4Progress {
    currentStepId: string;
    currentStepOrder: number;
    totalSteps: number;
    completedSteps: string[];
    answeredQuestions: number;
    completionPercentage: number;
}

export interface QuizV4State {
    // Quiz data
    quiz: QuizSchema | null;
    currentStep: QuizStep | null;

    // Progress
    progress: QuizV4Progress;

    // Answers
    answers: Record<string, QuizV4Answer>;

    // Status
    isLoading: boolean;
    isStarted: boolean;
    isCompleted: boolean;
    error: Error | null;

    // Timestamps
    startedAt: number | null;
    completedAt: number | null;
}

export interface QuizV4ContextValue {
    // State
    state: QuizV4State;

    // Quiz data accessors
    getStep: (stepId: string) => QuizStep | undefined;
    getBlock: (stepId: string, blockId: string) => QuizBlock | undefined;
    getAllSteps: () => QuizStep[];

    // Navigation
    goToStep: (stepId: string) => void;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    canGoBack: () => boolean;
    canGoNext: () => boolean;

    // Answers
    setAnswer: (questionId: string, value: any, blockId?: string) => void;
    getAnswer: (questionId: string) => QuizV4Answer | undefined;
    clearAnswer: (questionId: string) => void;

    // Quiz control
    startQuiz: () => void;
    completeQuiz: () => void;
    resetQuiz: () => void;

    // Logic Engine
    logicEngine: LogicEngine;
    evaluateNavigation: (conditions: NavigationCondition[]) => string | null;
}

interface QuizV4ProviderProps {
    children: ReactNode;
    templatePath?: string;
    onQuizComplete?: (state: QuizV4State) => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const QuizV4Context = createContext<QuizV4ContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export function QuizV4Provider({
    children,
    templatePath,
    onQuizComplete,
}: QuizV4ProviderProps) {
    // Load quiz v4
    const {
        quiz,
        steps,
        currentStep: initialStep,
        isLoading,
        error,
    } = useQuizV4Loader({ templatePath, autoLoad: true });

    // State
    const [currentStepId, setCurrentStepId] = useState<string>('step-01');
    const [answers, setAnswers] = useState<Record<string, QuizV4Answer>>({});
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    const [isStarted, setIsStarted] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [startedAt, setStartedAt] = useState<number | null>(null);
    const [completedAt, setCompletedAt] = useState<number | null>(null);

    // Get current step from quiz
    const currentStep = useMemo(() => {
        if (!quiz) return null;
        return quiz.steps.find(s => s.id === currentStepId) || null;
    }, [quiz, currentStepId]);

    // Calculate progress
    const progress = useMemo<QuizV4Progress>(() => {
        const currentOrder = currentStep?.order || 1;
        const totalSteps = steps.length;
        const answeredQuestions = Object.keys(answers).length;
        const completionPercentage = totalSteps > 0
            ? Math.round((completedSteps.length / totalSteps) * 100)
            : 0;

        return {
            currentStepId,
            currentStepOrder: currentOrder,
            totalSteps,
            completedSteps,
            answeredQuestions,
            completionPercentage,
        };
    }, [currentStepId, currentStep, steps, answers, completedSteps]);

    // Logic Engine instance
    const logicEngine = useMemo(() => {
        return new LogicEngine({
            currentStep: currentStepId,
            answers,
            completedSteps,
            progress: progress.completionPercentage,
        });
    }, [currentStepId, answers, completedSteps, progress.completionPercentage]);

    // Update logic engine context when state changes
    useEffect(() => {
        if (logicEngine) {
            logicEngine.updateContext('currentStep', currentStepId);
            logicEngine.updateContext('answers', answers);
            logicEngine.updateContext('completedSteps', completedSteps);
            logicEngine.updateContext('progress', progress.completionPercentage);
        }
    }, [logicEngine, currentStepId, answers, completedSteps, progress.completionPercentage]);

    // ============================================================================
    // QUIZ DATA ACCESSORS
    // ============================================================================

    const getStep = useCallback((stepId: string): QuizStep | undefined => {
        return steps.find(s => s.id === stepId);
    }, [steps]);

    const getBlock = useCallback((stepId: string, blockId: string): QuizBlock | undefined => {
        const step = getStep(stepId);
        return step?.blocks.find(b => b.id === blockId);
    }, [getStep]);

    const getAllSteps = useCallback((): QuizStep[] => {
        return steps;
    }, [steps]);

    // ============================================================================
    // NAVIGATION
    // ============================================================================

    const goToStep = useCallback((stepId: string) => {
        const targetStep = getStep(stepId);
        if (!targetStep) {
            appLogger.warn('⚠️ Step não encontrado:', { data: [stepId] });
            return;
        }

        // Mark current step as completed
        if (currentStepId && !completedSteps.includes(currentStepId)) {
            setCompletedSteps(prev => [...prev, currentStepId]);
        }

        setCurrentStepId(stepId);

        appLogger.info('📍 Navegando para step:', {
            data: [stepId, `Order: ${targetStep.order}`]
        });
    }, [currentStepId, completedSteps, getStep]);

    const goToNextStep = useCallback(() => {
        if (!currentStep || !quiz) return;

        // Check navigation conditions
        const conditions = currentStep.navigation.conditions || [];
        let nextStepId = currentStep.navigation.nextStep;

        if (conditions.length > 0) {
            // Convert NavigationCondition to Condition format
            const engineConditions: Condition[] = conditions.map(c => ({
                id: c.id,
                if: {
                    operator: c.if.operator,
                    field: c.if.field,
                    value: c.if.value
                },
                then: {
                    action: c.then.action,
                    target: c.then.target
                }
            }));

            // Evaluate with logic engine
            const evaluatedNext = logicEngine.getNextStep(
                currentStepId,
                engineConditions,
                nextStepId || ''
            );

            if (evaluatedNext) {
                nextStepId = evaluatedNext;
            }
        }

        if (nextStepId) {
            goToStep(nextStepId);
        } else {
            // No next step - quiz completed
            completeQuiz();
        }
    }, [currentStep, currentStepId, quiz, logicEngine, goToStep]);

    const goToPreviousStep = useCallback(() => {
        if (!currentStep || !quiz) return;

        const currentOrder = currentStep.order;
        if (currentOrder <= 1) return;

        const previousStep = steps.find(s => s.order === currentOrder - 1);
        if (previousStep) {
            goToStep(previousStep.id);
        }
    }, [currentStep, quiz, steps, goToStep]);

    const canGoBack = useCallback((): boolean => {
        if (!quiz?.settings.navigation.allowBack) return false;
        return currentStep?.order ? currentStep.order > 1 : false;
    }, [currentStep, quiz]);

    const canGoNext = useCallback((): boolean => {
        if (!currentStep) return false;

        // Check if step has validation requirements
        const validation = currentStep.validation;
        if (!validation?.required) return true;

        // Check if required blocks are answered
        const requiredBlocks = currentStep.blocks.filter(b =>
            b.type === 'form-input' || b.type === 'options-grid'
        );

        return requiredBlocks.every(block => {
            const answer = answers[block.id];
            return answer && answer.value !== null && answer.value !== undefined;
        });
    }, [currentStep, answers]);

    // ============================================================================
    // ANSWERS
    // ============================================================================

    const setAnswer = useCallback((questionId: string, value: any, blockId?: string) => {
        const answer: QuizV4Answer = {
            questionId,
            stepId: currentStepId,
            value,
            timestamp: Date.now(),
            blockId,
        };

        setAnswers(prev => ({
            ...prev,
            [questionId]: answer,
        }));

        // Update logic engine context
        logicEngine.updateContext(questionId, value);

        appLogger.info('✅ Resposta registrada:', {
            data: [questionId, typeof value === 'object' ? JSON.stringify(value).slice(0, 50) : value]
        });
    }, [currentStepId, logicEngine]);

    const getAnswer = useCallback((questionId: string): QuizV4Answer | undefined => {
        return answers[questionId];
    }, [answers]);

    const clearAnswer = useCallback((questionId: string) => {
        setAnswers(prev => {
            const newAnswers = { ...prev };
            delete newAnswers[questionId];
            return newAnswers;
        });

        appLogger.info('🗑️ Resposta removida:', { data: [questionId] });
    }, []);

    // ============================================================================
    // QUIZ CONTROL
    // ============================================================================

    const startQuiz = useCallback(() => {
        setIsStarted(true);
        setStartedAt(Date.now());
        appLogger.info('🚀 Quiz iniciado');
    }, []);

    const completeQuiz = useCallback(() => {
        if (isCompleted) return;

        setIsCompleted(true);
        setCompletedAt(Date.now());

        const finalState: QuizV4State = {
            quiz,
            currentStep,
            progress,
            answers,
            isLoading: false,
            isStarted: true,
            isCompleted: true,
            error: null,
            startedAt,
            completedAt: Date.now(),
        };

        if (onQuizComplete) {
            onQuizComplete(finalState);
        }

        appLogger.info('✅ Quiz completado:', {
            data: [
                `Steps: ${progress.completedSteps.length}/${progress.totalSteps}`,
                `Respostas: ${progress.answeredQuestions}`,
            ],
        });
    }, [isCompleted, quiz, currentStep, progress, answers, startedAt, onQuizComplete]);

    const resetQuiz = useCallback(() => {
        setCurrentStepId('step-01');
        setAnswers({});
        setCompletedSteps([]);
        setIsStarted(false);
        setIsCompleted(false);
        setStartedAt(null);
        setCompletedAt(null);

        appLogger.info('🔄 Quiz resetado');
    }, []);

    // ============================================================================
    // LOGIC ENGINE
    // ============================================================================

    const evaluateNavigation = useCallback((conditions: NavigationCondition[]): string | null => {
        if (conditions.length === 0) return null;

        // Convert to engine format
        const engineConditions: Condition[] = conditions.map(c => ({
            id: c.id,
            if: {
                operator: c.if.operator,
                field: c.if.field,
                value: c.if.value
            },
            then: {
                action: c.then.action,
                target: c.then.target
            }
        }));

        const matched = logicEngine.evaluateConditions(engineConditions);
        return matched?.then.target || null;
    }, [logicEngine]);

    // ============================================================================
    // STATE & CONTEXT VALUE
    // ============================================================================

    const state: QuizV4State = useMemo(() => ({
        quiz,
        currentStep,
        progress,
        answers,
        isLoading,
        isStarted,
        isCompleted,
        error,
        startedAt,
        completedAt,
    }), [quiz, currentStep, progress, answers, isLoading, isStarted, isCompleted, error, startedAt, completedAt]);

    const contextValue = useMemo<QuizV4ContextValue>(() => ({
        state,
        getStep,
        getBlock,
        getAllSteps,
        goToStep,
        goToNextStep,
        goToPreviousStep,
        canGoBack,
        canGoNext,
        setAnswer,
        getAnswer,
        clearAnswer,
        startQuiz,
        completeQuiz,
        resetQuiz,
        logicEngine,
        evaluateNavigation,
    }), [
        state,
        getStep,
        getBlock,
        getAllSteps,
        goToStep,
        goToNextStep,
        goToPreviousStep,
        canGoBack,
        canGoNext,
        setAnswer,
        getAnswer,
        clearAnswer,
        startQuiz,
        completeQuiz,
        resetQuiz,
        logicEngine,
        evaluateNavigation,
    ]);

    return (
        <QuizV4Context.Provider value={contextValue}>
            {children}
        </QuizV4Context.Provider>
    );
}

// ============================================================================
// HOOK
// ============================================================================

export function useQuizV4(): QuizV4ContextValue {
    const context = useContext(QuizV4Context);

    if (!context) {
        throw new Error('useQuizV4 must be used within QuizV4Provider');
    }

    return context;
}

// Display name
QuizV4Provider.displayName = 'QuizV4Provider';
