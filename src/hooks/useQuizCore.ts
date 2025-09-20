import { useState, useCallback, useMemo, useEffect } from 'react';

/**
 * 🎯 HOOK CONSOLIDADO DE QUIZ - SINGLE SOURCE OF TRUTH
 * 
 * Consolida funcionalidades dos hooks:
 * ❌ useQuizBuilder.ts - lógica de construção
 * ❌ useQuizResultConfig.ts - configuração de resultados  
 * ❌ useQuizValidation.ts - validação de quiz
 * ❌ useQuizAnalytics.ts - analytics básicos
 * 
 * ✅ Única interface para todas as funcionalidades de quiz
 * ✅ Estado centralizado e consistente
 * ✅ Performance otimizada
 * ✅ Validação integrada
 */

export interface QuizAnswer {
    questionId: string;
    stepNumber: number;
    selectedOptions: string[];
    score: number;
    timestamp: number;
}

export interface QuizResult {
    totalScore: number;
    percentage: number;
    category: string;
    recommendation: string;
    completedSteps: number;
    timeSpent: number;
}

export interface QuizConfiguration {
    scoringMethod: 'sum' | 'average' | 'weighted';
    resultCategories: Array<{
        name: string;
        minScore: number;
        maxScore: number;
        description: string;
        recommendation: string;
    }>;
    passingScore: number;
    allowRetry: boolean;
    showScore: boolean;
}

export interface UseQuizCoreState {
    answers: Map<string, QuizAnswer>;
    currentScore: number;
    isCompleted: boolean;
    startTime: number;
    endTime: number | null;
    result: QuizResult | null;
    configuration: QuizConfiguration;

    // Analytics
    analytics: {
        totalAnswers: number;
        averageTimePerQuestion: number;
        completionRate: number;
        abandonmentPoints: number[];
    };
}

export interface UseQuizCoreActions {
    // Answer management
    addAnswer: (answer: Omit<QuizAnswer, 'timestamp'>) => void;
    updateAnswer: (questionId: string, updates: Partial<QuizAnswer>) => void;
    removeAnswer: (questionId: string) => void;
    clearAnswers: () => void;

    // Quiz flow
    startQuiz: () => void;
    completeQuiz: () => QuizResult;
    resetQuiz: () => void;

    // Configuration
    updateConfiguration: (config: Partial<QuizConfiguration>) => void;

    // Analytics
    trackEvent: (event: string, data?: any) => void;
    getAnalytics: () => UseQuizCoreState['analytics'];

    // Validation
    validateAnswer: (questionId: string, answer: QuizAnswer) => boolean;
    validateQuizCompletion: () => boolean;
}

export interface UseQuizCoreReturn extends UseQuizCoreState {
    actions: UseQuizCoreActions;
}

// Default configuration
const DEFAULT_CONFIGURATION: QuizConfiguration = {
    scoringMethod: 'sum',
    resultCategories: [
        { name: 'Iniciante', minScore: 0, maxScore: 40, description: 'Você está começando', recommendation: 'Continue praticando' },
        { name: 'Intermediário', minScore: 41, maxScore: 70, description: 'Bom conhecimento', recommendation: 'Aprofunde alguns tópicos' },
        { name: 'Avançado', minScore: 71, maxScore: 100, description: 'Excelente conhecimento', recommendation: 'Você domina o assunto' }
    ],
    passingScore: 60,
    allowRetry: true,
    showScore: true
};

export const useQuizCore = (initialConfig?: Partial<QuizConfiguration>): UseQuizCoreReturn => {

    // Estado principal
    const [state, setState] = useState<UseQuizCoreState>(() => ({
        answers: new Map(),
        currentScore: 0,
        isCompleted: false,
        startTime: 0,
        endTime: null,
        result: null,
        configuration: { ...DEFAULT_CONFIGURATION, ...initialConfig },
        analytics: {
            totalAnswers: 0,
            averageTimePerQuestion: 0,
            completionRate: 0,
            abandonmentPoints: []
        }
    }));

    // Calcular score atual
    const currentScore = useMemo(() => {
        let total = 0;
        const answers = Array.from(state.answers.values());

        switch (state.configuration.scoringMethod) {
            case 'sum':
                total = answers.reduce((sum, answer) => sum + answer.score, 0);
                break;
            case 'average':
                total = answers.length > 0 ? answers.reduce((sum, answer) => sum + answer.score, 0) / answers.length : 0;
                break;
            case 'weighted':
                // Implementação simplificada - pode ser expandida
                total = answers.reduce((sum, answer) => sum + answer.score, 0);
                break;
        }

        return Math.round(total);
    }, [state.answers, state.configuration.scoringMethod]);

    // Determinar categoria do resultado
    const determineResultCategory = useCallback((score: number) => {
        const category = state.configuration.resultCategories.find(cat =>
            score >= cat.minScore && score <= cat.maxScore
        );
        return category || state.configuration.resultCategories[0];
    }, [state.configuration.resultCategories]);

    // Actions
    const actions: UseQuizCoreActions = {

        addAnswer: useCallback((answerData: Omit<QuizAnswer, 'timestamp'>) => {
            setState(prev => {
                const newAnswers = new Map(prev.answers);
                const fullAnswer: QuizAnswer = {
                    ...answerData,
                    timestamp: Date.now()
                };
                newAnswers.set(answerData.questionId, fullAnswer);

                // Atualizar analytics
                const newAnalytics = {
                    ...prev.analytics,
                    totalAnswers: newAnswers.size
                };

                return {
                    ...prev,
                    answers: newAnswers,
                    analytics: newAnalytics
                };
            });
        }, []),

        updateAnswer: useCallback((questionId: string, updates: Partial<QuizAnswer>) => {
            setState(prev => {
                const newAnswers = new Map(prev.answers);
                const existing = newAnswers.get(questionId);

                if (existing) {
                    newAnswers.set(questionId, { ...existing, ...updates });
                }

                return { ...prev, answers: newAnswers };
            });
        }, []),

        removeAnswer: useCallback((questionId: string) => {
            setState(prev => {
                const newAnswers = new Map(prev.answers);
                newAnswers.delete(questionId);

                return {
                    ...prev,
                    answers: newAnswers,
                    analytics: {
                        ...prev.analytics,
                        totalAnswers: newAnswers.size
                    }
                };
            });
        }, []),

        clearAnswers: useCallback(() => {
            setState(prev => ({
                ...prev,
                answers: new Map(),
                currentScore: 0,
                result: null,
                analytics: {
                    ...prev.analytics,
                    totalAnswers: 0
                }
            }));
        }, []),

        startQuiz: useCallback(() => {
            setState(prev => ({
                ...prev,
                startTime: Date.now(),
                endTime: null,
                isCompleted: false,
                result: null,
                answers: new Map()
            }));
        }, []),

        completeQuiz: useCallback((): QuizResult => {
            const endTime = Date.now();
            const timeSpent = state.startTime > 0 ? endTime - state.startTime : 0;
            const category = determineResultCategory(currentScore);

            const result: QuizResult = {
                totalScore: currentScore,
                percentage: Math.round((currentScore / 100) * 100), // Assuming max score of 100
                category: category.name,
                recommendation: category.recommendation,
                completedSteps: state.answers.size,
                timeSpent: Math.round(timeSpent / 1000) // Convert to seconds
            };

            setState(prev => ({
                ...prev,
                endTime,
                isCompleted: true,
                result,
                analytics: {
                    ...prev.analytics,
                    completionRate: 100,
                    averageTimePerQuestion: prev.answers.size > 0 ? timeSpent / prev.answers.size / 1000 : 0
                }
            }));

            return result;
        }, [state.startTime, state.answers.size, currentScore, determineResultCategory]),

        resetQuiz: useCallback(() => {
            setState(prev => ({
                ...prev,
                answers: new Map(),
                currentScore: 0,
                isCompleted: false,
                startTime: 0,
                endTime: null,
                result: null,
                analytics: {
                    totalAnswers: 0,
                    averageTimePerQuestion: 0,
                    completionRate: 0,
                    abandonmentPoints: []
                }
            }));
        }, []),

        updateConfiguration: useCallback((config: Partial<QuizConfiguration>) => {
            setState(prev => ({
                ...prev,
                configuration: { ...prev.configuration, ...config }
            }));
        }, []),

        trackEvent: useCallback((event: string, data?: any) => {
            if (process.env.NODE_ENV === 'development') {
                console.log(`📊 Quiz Event: ${event}`, data);
            }
            // Em produção, enviar para serviço de analytics
        }, []),

        getAnalytics: useCallback(() => {
            return state.analytics;
        }, [state.analytics]),

        validateAnswer: useCallback((questionId: string, answer: QuizAnswer) => {
            // Validação básica
            return (
                questionId.length > 0 &&
                answer.selectedOptions.length > 0 &&
                answer.stepNumber > 0 &&
                answer.score >= 0
            );
        }, []),

        validateQuizCompletion: useCallback(() => {
            // Validar se todas as etapas obrigatórias foram respondidas
            // Por agora, validação simples
            return state.answers.size >= 1; // Pelo menos 1 resposta
        }, [state.answers.size])
    };

    // Atualizar score derivado no estado
    useEffect(() => {
        setState(prev => ({ ...prev, currentScore }));
    }, [currentScore]); return {
        ...state,
        actions
    };
};

export default useQuizCore;