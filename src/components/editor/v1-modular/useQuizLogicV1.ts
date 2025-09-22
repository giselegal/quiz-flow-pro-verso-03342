/**
 * 🪝 HOOK DE INTEGRAÇÃO V1 - COMPATIBILIDADE TOTAL
 * 
 * Hook que replica a funcionalidade do useQuizLogic da V1
 * mas usando o sistema modular e dados do quiz21StepsComplete.ts
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { QuizCalculationEngine, UserAnswer, QuizResult } from './QuizCalculationEngine';
import { NoCodeConfigExtractor } from './NoCodeConfig';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';

export interface QuizQuestion {
    id: string;
    question: string;
    options: Array<{
        id: string;
        text: string;
        imageUrl?: string;
    }>;
    multiSelect: boolean;
    required: number;
    stepId: string;
}

export interface QuizLogicState {
    // 📊 Estado atual
    currentQuestion: QuizQuestion | null;
    currentQuestionIndex: number;
    currentAnswers: string[];
    isLastQuestion: boolean;
    totalQuestions: number;

    // 🧮 Engine e configurações
    quizEngine: QuizCalculationEngine;
    noCodeConfig: NoCodeConfigExtractor;

    // 📝 Dados
    questions: QuizQuestion[];
    userAnswers: Record<string, string[]>;
    strategicAnswers: Record<string, string[]>;

    // 🎯 Resultado
    result: QuizResult | null;
    isComplete: boolean;
    isInitialLoadComplete: boolean;
}

/**
 * 🪝 HOOK PRINCIPAL - useQuizLogicV1
 */
export const useQuizLogicV1 = () => {
    // 🧮 Instâncias dos engines
    const quizEngine = useMemo(() => new QuizCalculationEngine(), []);
    const noCodeConfig = useMemo(() => new NoCodeConfigExtractor(), []);

    // 📊 Estados principais
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
    const [strategicAnswers, setStrategicAnswers] = useState<Record<string, string[]>>({});
    const [result, setResult] = useState<QuizResult | null>(null);
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

    // 📝 Dados das questões (extraídos do template)
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);

    /**
     * 🚀 Inicialização - Extrai questões do template
     */
    useEffect(() => {
        extractQuestions();
    }, []);

    const extractQuestions = useCallback(() => {
        const extractedQuestions: QuizQuestion[] = [];

        Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(([stepId, blocks]) => {
            blocks.forEach(block => {
                if (block.type === 'options-grid' && block.content.question) {
                    const question: QuizQuestion = {
                        id: block.id,
                        question: block.content.question,
                        options: block.content.options || [],
                        multiSelect: block.properties?.multipleSelection || false,
                        required: block.properties?.requiredSelections || 1,
                        stepId,
                    };
                    extractedQuestions.push(question);
                }
            });
        });

        setQuestions(extractedQuestions);
        setIsInitialLoadComplete(true);

        console.log(`📊 ${extractedQuestions.length} questões extraídas do template`);
    }, []);

    /**
     * 📊 Estados calculados
     */
    const currentQuestion = questions[currentQuestionIndex] || null;
    const currentAnswers = currentQuestion ? (userAnswers[currentQuestion.id] || []) : [];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const totalQuestions = questions.length;
    const isComplete = Object.keys(userAnswers).length === totalQuestions;

    /**
     * ✍️ Manipulação de respostas
     */
    const handleAnswer = useCallback((questionId: string, selectedOptions: string[]) => {
        if (!currentQuestion) return;

        // Atualiza estado local
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: selectedOptions,
        }));

        // Registra no engine de cálculo
        const answer: UserAnswer = {
            questionId,
            stepId: currentQuestion.stepId,
            selectedOptions,
            timestamp: Date.now(),
        };

        quizEngine.addAnswer(answer);

        console.log(`✅ Resposta registrada: ${questionId}`, selectedOptions);
    }, [currentQuestion, quizEngine]);

    /**
     * ➡️ Próxima questão
     */
    const handleNext = useCallback(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    }, [currentQuestionIndex, questions.length]);

    /**
     * ⬅️ Questão anterior
     */
    const handlePrevious = useCallback(() => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    }, [currentQuestionIndex]);

    /**
     * 🎯 Calcula resultados
     */
    const calculateResults = useCallback(() => {
        const calculatedResult = quizEngine.calculateResults();
        setResult(calculatedResult);
        return calculatedResult;
    }, [quizEngine]);

    /**
     * ✍️ Resposta estratégica (compatibilidade V1)
     */
    const handleStrategicAnswer = useCallback((questionId: string, selectedOptions: string[]) => {
        setStrategicAnswers(prev => ({
            ...prev,
            [questionId]: selectedOptions,
        }));

        // Também registra no engine principal
        const answer: UserAnswer = {
            questionId,
            stepId: `strategic_${questionId}`,
            selectedOptions,
            timestamp: Date.now(),
        };

        quizEngine.addAnswer(answer);
    }, [quizEngine]);

    /**
     * 🏁 Submete quiz completo
     */
    const submitQuizIfComplete = useCallback(() => {
        if (isComplete) {
            return calculateResults();
        }
        return null;
    }, [isComplete, calculateResults]);

    /**
     * � Gestão do nome do usuário (para etapa 1)
     */
    const handleNameInput = useCallback((name: string) => {
        // Salva no localStorage para persistência
        localStorage.setItem('userName', name);

        // Dispara evento global para outros componentes
        window.dispatchEvent(new CustomEvent('quiz-name-change', {
            detail: { name, valid: name.trim().length >= 2 }
        }));

        console.log(`👤 Nome do usuário atualizado: "${name}"`);
    }, []);

    /**
     * �🔄 Reset do quiz
     */
    const resetQuiz = useCallback(() => {
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setStrategicAnswers({});
        setResult(null);
        localStorage.removeItem('userName');
        quizEngine.reset();
    }, [quizEngine]);

    /**
     * 📈 Estatísticas
     */
    const getQuizStats = useCallback(() => {
        return quizEngine.getStats();
    }, [quizEngine]);

    /**
     * 💾 Persistência
     */
    const saveToLocalStorage = useCallback(() => {
        const data = {
            currentQuestionIndex,
            userAnswers,
            strategicAnswers,
            result,
            quizEngineData: quizEngine.serialize(),
            timestamp: Date.now(),
        };

        localStorage.setItem('quiz_v1_modular_state', JSON.stringify(data));
    }, [currentQuestionIndex, userAnswers, strategicAnswers, result, quizEngine]);

    const loadFromLocalStorage = useCallback(() => {
        try {
            const saved = localStorage.getItem('quiz_v1_modular_state');
            if (saved) {
                const data = JSON.parse(saved);

                setCurrentQuestionIndex(data.currentQuestionIndex || 0);
                setUserAnswers(data.userAnswers || {});
                setStrategicAnswers(data.strategicAnswers || {});
                setResult(data.result || null);

                if (data.quizEngineData) {
                    quizEngine.deserialize(data.quizEngineData);
                }

                return true;
            }
        } catch (error) {
            console.error('Erro ao carregar estado do localStorage:', error);
        }
        return false;
    }, [quizEngine]);

    // 💾 Auto-save
    useEffect(() => {
        if (isInitialLoadComplete) {
            saveToLocalStorage();
        }
    }, [userAnswers, strategicAnswers, currentQuestionIndex, isInitialLoadComplete, saveToLocalStorage]);

    /**
     * 🚀 Retorna interface compatível com V1
     */
    return {
        // Estados principais (compatibilidade V1)
        currentQuestion,
        currentQuestionIndex,
        currentAnswers,
        isLastQuestion,
        totalQuestions,
        isInitialLoadComplete,

        // Funções principais (compatibilidade V1)
        handleAnswer,
        handleNext,
        handlePrevious,
        calculateResults,
        handleStrategicAnswer,
        submitQuizIfComplete,
        handleNameInput, // ✅ Nova função para gerenciar nome

        // Dados completos
        questions,
        userAnswers,
        strategicAnswers,
        result,
        isComplete,

        // Utilitários
        quizEngine,
        noCodeConfig,
        resetQuiz,
        getQuizStats,
        saveToLocalStorage,
        loadFromLocalStorage,

        // Estados calculados adicionais
        progress: totalQuestions > 0 ? Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100) : 0,
        canProceed: (() => {
            // 🎯 VALIDAÇÃO ESPECÍFICA POR ETAPA
            const currentStep = (window as any)?.__quizCurrentStep ?? currentQuestionIndex + 1;

            // Etapa 1: Validação de input de nome
            if (currentStep === 1) {
                // Verifica se há um nome válido nos dados do usuário
                const storedName = localStorage.getItem('userName') || '';
                return storedName.trim().length >= 2;
            }

            // Outras etapas: Validação de seleções (lógica original)
            return currentAnswers.length >= (currentQuestion?.required || 1);
        })(),
        answeredQuestions: Object.keys(userAnswers).length,
        completionPercentage: totalQuestions > 0 ? Math.round((Object.keys(userAnswers).length / totalQuestions) * 100) : 0,
    };
};

/**
 * 🪝 HOOK SIMPLIFICADO - useModularQuiz
 * 
 * Versão simplificada para casos específicos
 */
export const useModularQuiz = (autoLoad = true) => {
    const quizLogic = useQuizLogicV1();

    useEffect(() => {
        if (autoLoad && quizLogic.isInitialLoadComplete) {
            quizLogic.loadFromLocalStorage();
        }
    }, [autoLoad, quizLogic.isInitialLoadComplete]);

    return {
        ...quizLogic,
        // Funções simplificadas
        answerAndNext: (questionId: string, options: string[]) => {
            quizLogic.handleAnswer(questionId, options);
            if (!quizLogic.isLastQuestion) {
                setTimeout(() => quizLogic.handleNext(), 500);
            }
        },

        jumpToQuestion: (index: number) => {
            if (index >= 0 && index < quizLogic.totalQuestions) {
                // Implementar navegação direta
                console.log(`Navegando para questão ${index + 1}`);
            }
        },
    };
};

export default useQuizLogicV1;