/**
 * ✅📊 VALIDATION RESULT PROVIDER - FASE 3 CONSOLIDAÇÃO
 * 
 * Provider consolidado que unifica ValidationProvider + ResultProvider
 * para gerenciamento integrado de validação e processamento de resultados.
 * 
 * RESPONSABILIDADES UNIFICADAS:
 * - Validação de formulários e dados
 * - Processamento de resultados de quiz
 * - Cálculo de scores
 * - Validação em tempo real
 * - Geração de feedback
 * 
 * BENEFÍCIOS DA CONSOLIDAÇÃO:
 * - Redução de providers: 2 → 1
 * - Validação + resultado em pipeline único
 * - Menos duplicação de lógica
 * - API mais coesa
 * 
 * @version 3.0.0
 * @phase FASE-3
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES - VALIDATION
// ============================================================================

export interface ValidationRule {
    type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
    message: string;
    value?: any;
    validator?: (value: any) => boolean;
}

export interface ValidationError {
    field: string;
    message: string;
    type: string;
}

export interface ValidationSchema {
    [field: string]: ValidationRule[];
}

// ============================================================================
// TYPES - RESULT
// ============================================================================

export interface QuizResult {
    id: string;
    userId: string;
    funnelId: string;
    score: number;
    maxScore: number;
    percentage: number;
    answers: Record<string, any>;
    timeTaken: number;
    completedAt: Date;
    metadata?: Record<string, any>;
}

export interface ResultAnalysis {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    category: string;
}

// ============================================================================
// UNIFIED CONTEXT VALUE
// ============================================================================

export interface ValidationResultContextValue {
    // Validation properties
    errors: ValidationError[];
    isValid: boolean;
    isValidating: boolean;

    // Result properties
    currentResult: QuizResult | null;
    resultHistory: QuizResult[];
    analysis: ResultAnalysis | null;

    // Validation methods
    validate: (data: any, schema: ValidationSchema) => boolean;
    validateField: (field: string, value: any, rules: ValidationRule[]) => boolean;
    clearErrors: () => void;
    clearFieldError: (field: string) => void;
    getFieldError: (field: string) => ValidationError | null;

    // Result methods
    calculateResult: (answers: Record<string, any>, quiz: any) => QuizResult;
    saveResult: (result: QuizResult) => Promise<void>;
    loadResultHistory: (userId: string) => Promise<void>;
    analyzeResult: (result: QuizResult) => ResultAnalysis;
    clearResult: () => void;

    // Integrated methods
    validateAndCalculate: (data: any, schema: ValidationSchema, quiz: any) => QuizResult | null;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ValidationResultContext = createContext<ValidationResultContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

interface ValidationResultProviderProps {
    children: ReactNode;
}

export const ValidationResultProvider: React.FC<ValidationResultProviderProps> = ({ children }) => {
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [isValidating, setIsValidating] = useState(false);
    const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);
    const [resultHistory, setResultHistory] = useState<QuizResult[]>([]);
    const [analysis, setAnalysis] = useState<ResultAnalysis | null>(null);

    // ============================================================================
    // VALIDATION METHODS
    // ============================================================================

    const validateField = useCallback((field: string, value: any, rules: ValidationRule[]): boolean => {
        const fieldErrors: ValidationError[] = [];

        for (const rule of rules) {
            let isValid = true;

            switch (rule.type) {
                case 'required':
                    isValid = value !== null && value !== undefined && value !== '';
                    break;

                case 'minLength':
                    isValid = typeof value === 'string' && value.length >= (rule.value || 0);
                    break;

                case 'maxLength':
                    isValid = typeof value === 'string' && value.length <= (rule.value || Infinity);
                    break;

                case 'pattern':
                    isValid = typeof value === 'string' && new RegExp(rule.value).test(value);
                    break;

                case 'custom':
                    isValid = rule.validator ? rule.validator(value) : true;
                    break;
            }

            if (!isValid) {
                fieldErrors.push({
                    field,
                    message: rule.message,
                    type: rule.type,
                });
            }
        }

        // Update errors state
        setErrors(prev => [
            ...prev.filter(e => e.field !== field),
            ...fieldErrors,
        ]);

        return fieldErrors.length === 0;
    }, []);

    const validate = useCallback((data: any, schema: ValidationSchema): boolean => {
        setIsValidating(true);
        const newErrors: ValidationError[] = [];

        try {
            for (const field in schema) {
                const value = data[field];
                const rules = schema[field];

                for (const rule of rules) {
                    let isValid = true;

                    switch (rule.type) {
                        case 'required':
                            isValid = value !== null && value !== undefined && value !== '';
                            break;

                        case 'minLength':
                            isValid = typeof value === 'string' && value.length >= (rule.value || 0);
                            break;

                        case 'maxLength':
                            isValid = typeof value === 'string' && value.length <= (rule.value || Infinity);
                            break;

                        case 'pattern':
                            isValid = typeof value === 'string' && new RegExp(rule.value).test(value);
                            break;

                        case 'custom':
                            isValid = rule.validator ? rule.validator(value) : true;
                            break;
                    }

                    if (!isValid) {
                        newErrors.push({
                            field,
                            message: rule.message,
                            type: rule.type,
                        });
                    }
                }
            }

            setErrors(newErrors);
            return newErrors.length === 0;
        } finally {
            setIsValidating(false);
        }
    }, []);

    const clearErrors = useCallback(() => {
        setErrors([]);
    }, []);

    const clearFieldError = useCallback((field: string) => {
        setErrors(prev => prev.filter(e => e.field !== field));
    }, []);

    const getFieldError = useCallback((field: string): ValidationError | null => {
        return errors.find(e => e.field === field) || null;
    }, [errors]);

    // ============================================================================
    // RESULT METHODS
    // ============================================================================

    const calculateResult = useCallback((answers: Record<string, any>, quiz: any): QuizResult => {
        appLogger.info('📊 [ValidationResult] Calculando resultado...');

        // Simple scoring logic (can be customized)
        let score = 0;
        let maxScore = 0;

        // Count correct answers
        for (const questionId in answers) {
            const answer = answers[questionId];
            const question = quiz.questions?.find((q: any) => q.id === questionId);

            if (question) {
                maxScore += question.points || 1;

                if (question.correctAnswer === answer) {
                    score += question.points || 1;
                }
            }
        }

        const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

        const result: QuizResult = {
            id: `result-${Date.now()}`,
            userId: 'current-user', // TODO: Get from auth
            funnelId: quiz.id || 'unknown',
            score,
            maxScore,
            percentage,
            answers,
            timeTaken: 0, // TODO: Track time
            completedAt: new Date(),
        };

        setCurrentResult(result);
        appLogger.info(`✅ [ValidationResult] Score: ${score}/${maxScore} (${percentage.toFixed(1)}%)`);

        return result;
    }, []);

    const saveResult = useCallback(async (result: QuizResult) => {
        try {
            appLogger.info('💾 [ValidationResult] Salvando resultado...');

            // TODO: Save to Supabase
            await new Promise(resolve => setTimeout(resolve, 300));

            setResultHistory(prev => [result, ...prev]);

            appLogger.info('✅ [ValidationResult] Resultado salvo');
        } catch (err) {
            appLogger.error('❌ [ValidationResult] Erro ao salvar resultado:', err);
            throw err;
        }
    }, []);

    const loadResultHistory = useCallback(async (userId: string) => {
        try {
            appLogger.info(`📂 [ValidationResult] Carregando histórico do usuário: ${userId}`);

            // TODO: Load from Supabase
            await new Promise(resolve => setTimeout(resolve, 300));

            appLogger.info('✅ [ValidationResult] Histórico carregado');
        } catch (err) {
            appLogger.error('❌ [ValidationResult] Erro ao carregar histórico:', err);
            throw err;
        }
    }, []);

    const analyzeResult = useCallback((result: QuizResult): ResultAnalysis => {
        const { percentage } = result;

        let category = 'Iniciante';
        const strengths: string[] = [];
        const weaknesses: string[] = [];
        const recommendations: string[] = [];

        if (percentage >= 90) {
            category = 'Excelente';
            strengths.push('Domínio completo do conteúdo');
            recommendations.push('Continue praticando para manter o nível');
        } else if (percentage >= 70) {
            category = 'Bom';
            strengths.push('Boa compreensão geral');
            weaknesses.push('Algumas áreas precisam de reforço');
            recommendations.push('Revise os tópicos com menor pontuação');
        } else if (percentage >= 50) {
            category = 'Regular';
            weaknesses.push('Conhecimento básico precisa ser consolidado');
            recommendations.push('Estude mais os fundamentos');
            recommendations.push('Pratique exercícios adicionais');
        } else {
            category = 'Iniciante';
            weaknesses.push('Necessário estudo mais aprofundado');
            recommendations.push('Recomendamos revisar todo o material');
            recommendations.push('Considere aulas extras');
        }

        const analysis: ResultAnalysis = {
            strengths,
            weaknesses,
            recommendations,
            category,
        };

        setAnalysis(analysis);
        return analysis;
    }, []);

    const clearResult = useCallback(() => {
        setCurrentResult(null);
        setAnalysis(null);
    }, []);

    // ============================================================================
    // INTEGRATED METHODS
    // ============================================================================

    const validateAndCalculate = useCallback((
        data: any,
        schema: ValidationSchema,
        quiz: any
    ): QuizResult | null => {
        // First validate
        const isValid = validate(data, schema);

        if (!isValid) {
            appLogger.warn('⚠️ [ValidationResult] Validação falhou, não é possível calcular resultado');
            return null;
        }

        // Then calculate result
        const result = calculateResult(data, quiz);

        // Analyze result
        analyzeResult(result);

        return result;
    }, [validate, calculateResult, analyzeResult]);

    // ============================================================================
    // COMPUTED VALUES
    // ============================================================================

    const isValid = useMemo(() => errors.length === 0, [errors]);

    // ============================================================================
    // CONTEXT VALUE
    // ============================================================================

    const contextValue = useMemo<ValidationResultContextValue>(
        () => ({
            // Validation
            errors,
            isValid,
            isValidating,
            validate,
            validateField,
            clearErrors,
            clearFieldError,
            getFieldError,

            // Result
            currentResult,
            resultHistory,
            analysis,
            calculateResult,
            saveResult,
            loadResultHistory,
            analyzeResult,
            clearResult,

            // Integrated
            validateAndCalculate,
        }),
        [
            errors,
            isValid,
            isValidating,
            validate,
            validateField,
            clearErrors,
            clearFieldError,
            getFieldError,
            currentResult,
            resultHistory,
            analysis,
            calculateResult,
            saveResult,
            loadResultHistory,
            analyzeResult,
            clearResult,
            validateAndCalculate,
        ]
    );

    return (
        <ValidationResultContext.Provider value={contextValue}>
            {children}
        </ValidationResultContext.Provider>
    );
};

// ============================================================================
// HOOK
// ============================================================================

export const useValidationResult = (): ValidationResultContextValue => {
    const context = useContext(ValidationResultContext);

    if (!context) {
        throw new Error('useValidationResult deve ser usado dentro de ValidationResultProvider');
    }

    return context;
};

// Aliases for backward compatibility
export const useValidation = useValidationResult;
export const useResult = useValidationResult;
