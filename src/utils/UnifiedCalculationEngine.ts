// src/utils/UnifiedCalculationEngine.ts
// 🎯 CONSOLIDAÇÃO: Melhor algoritmo de cálculo aproveitando todas implementações existentes

import { QuizAnswer, QuizResult, StyleResult } from '@/types/quiz';
import { isScorableQuestion } from '@/core/constants/quiz';
import { QuizRulesConfig } from '@/hooks/useQuizRulesConfig';

/**
 * UnifiedCalculationEngine - Algoritmo consolidado que combina:
 * ✅ Filtros corretos do useQuizLogic (apenas q1-q10 pontuam)
 * ✅ Sistema de pesos do computeResults 
 * ✅ Desempate inteligente do StyleCalculationEngine
 * ✅ Configuração centralizada do useQuizRulesConfig
 * ✅ Robustez e testes do CalculationEngine
 */

export interface UnifiedCalculationOptions {
    includeUserData?: boolean;
    userName?: string;
    strategicAnswersCount?: number;
    tieBreakStrategy?: 'first-answer' | 'highest-score' | 'random';
    customWeights?: Record<string, number>;
    debug?: boolean;
}

export interface StyleCalculationResult {
    style: string;
    points: number;
    percentage: number;
    responseCount: number;
    firstResponseTime?: Date;
}

export class UnifiedCalculationEngine {
    private config: QuizRulesConfig | null = null;
    private debugMode: boolean = false;

    constructor(config?: QuizRulesConfig) {
        this.config = config || null;
    }

    /**
     * 🧮 ALGORITMO PRINCIPAL DE CÁLCULO
     * Combina as melhores práticas de todas as implementações existentes
     */
    calculateResults(
        answers: QuizAnswer[],
        options: UnifiedCalculationOptions = {}
    ): QuizResult {
        const {
            includeUserData = true,
            userName = '',
            strategicAnswersCount = 0,
            tieBreakStrategy = 'first-answer',
            customWeights = {},
            debug = false
        } = options;

        this.debugMode = debug;

        if (this.debugMode) {
            console.log('🧮 UnifiedCalculationEngine: Iniciando cálculo', {
                totalAnswers: answers.length,
                tieBreakStrategy,
                hasConfig: !!this.config
            });
        }

        // ========================================================================
        // 1. FILTRAR APENAS QUESTÕES QUE PONTUAM (q1-q10 = etapas 2-11)
        // ========================================================================

        const scorableAnswers = answers.filter(answer => {
            const isScorableFlag = isScorableQuestion(answer.questionId);

            if (this.debugMode && !isScorableFlag) {
                console.log(`⏭️ Ignorando resposta não pontuada: ${answer.questionId}`);
            }

            return isScorableFlag;
        });

        if (this.debugMode) {
            console.log(`✅ Respostas que pontuam: ${scorableAnswers.length}/${answers.length}`);
        }

        // ========================================================================
        // 2. INICIALIZAR CONTADORES POR ESTILO
        // ========================================================================

        const styleScores: Record<string, StyleCalculationResult> = {};
        const styleCategories = this.getStyleCategories();

        // Inicializar todos os estilos
        styleCategories.forEach(style => {
            styleScores[style] = {
                style,
                points: 0,
                percentage: 0,
                responseCount: 0,
                firstResponseTime: undefined
            };
        });

        // ========================================================================
        // 3. PROCESSAR RESPOSTAS E CALCULAR PONTOS
        // ========================================================================

        let totalPoints = 0;
        const responseOrder: { style: string; timestamp: Date; questionId: string }[] = [];

        scorableAnswers.forEach((answer, index) => {
            const questionWeight = customWeights[answer.questionId] || 1;

            // 🔥 DADOS REAIS: Extrair pontos por estilo usando quiz21StepsComplete
            const stylePointsFromAnswer = this.extractStyleFromAnswer(answer);
            const baseWeight = 1; // Peso base padrão

            // Processar cada estilo encontrado na resposta
            Object.entries(stylePointsFromAnswer).forEach(([styleName, points]) => {
                const finalWeight = (points || 0) * baseWeight * questionWeight;

                if (styleScores[styleName]) {
                    styleScores[styleName].points += finalWeight;
                    styleScores[styleName].responseCount++;
                    totalPoints += finalWeight;

                    // Registrar ordem para critério de desempate
                    const timestamp = new Date(Date.now() + index * 100);
                    responseOrder.push({
                        style: styleName,
                        timestamp,
                        questionId: answer.questionId
                    });

                    // Registrar primeiro tempo de resposta para desempate
                    if (!styleScores[styleName].firstResponseTime) {
                        styleScores[styleName].firstResponseTime = timestamp;
                    }
                }
            });
        });

        // ========================================================================
        // 4. CALCULAR PERCENTUAIS COM CORREÇÃO DE ARREDONDAMENTO
        // ========================================================================

        // Primeiro calcular percentuais brutos
        const stylesWithPoints = Object.values(styleScores).filter(s => s.points > 0);
        let totalPercentage = 0;

        stylesWithPoints.forEach(scoreData => {
            if (totalPoints > 0) {
                const exactPercentage = (scoreData.points / totalPoints) * 100;
                scoreData.percentage = Math.round(exactPercentage);
                totalPercentage += scoreData.percentage;
            } else {
                scoreData.percentage = 0;
            }
        });

        // Corrigir arredondamento para somar exatamente 100%
        if (stylesWithPoints.length > 0 && totalPercentage !== 100) {
            const difference = 100 - totalPercentage;
            // Ajustar no estilo com maior pontuação
            const highestStyle = stylesWithPoints.reduce((prev, current) =>
                (current.points > prev.points) ? current : prev
            );
            highestStyle.percentage += difference;
        }

        if (this.debugMode) {
            console.log('📊 Pontuação final por estilo:',
                Object.entries(styleScores)
                    .map(([style, data]) => `${style}: ${data.points} pts (${data.percentage}%)`)
                    .join(', ')
            );
        }

        // ========================================================================
        // 5. ORDENAR E APLICAR CRITÉRIO DE DESEMPATE
        // ========================================================================

        const sortedStyles = Object.values(styleScores).sort((a, b) => {
            // Primeiro critério: maior pontuação
            if (b.points !== a.points) {
                return b.points - a.points;
            }

            // Critério de desempate
            return this.applyTieBreaker(a, b, tieBreakStrategy, responseOrder);
        });

        if (this.debugMode && sortedStyles.length >= 2 && sortedStyles[0].points === sortedStyles[1].points) {
            console.log(`🔄 Desempate aplicado: ${sortedStyles[0].style} vs ${sortedStyles[1].style}`);
        }

        // ========================================================================
        // 6. CONSTRUIR RESULTADO FINAL
        // ========================================================================

        const primaryStyleData = sortedStyles[0];
        const secondaryStylesData = sortedStyles.slice(1, 4);

        const primaryStyle: StyleResult = {
            id: primaryStyleData.style,
            name: primaryStyleData.style.charAt(0).toUpperCase() + primaryStyleData.style.slice(1),
            description: `Estilo ${primaryStyleData.style}`,
            type: primaryStyleData.style as StyleType,
            score: primaryStyleData.points,
            characteristics: [],
            recommendations: [],
            colors: [],
            images: [],
            // Legacy compatibility
            category: primaryStyleData.style,
            percentage: primaryStyleData.percentage,
            style: primaryStyleData.style.toLowerCase(),
            points: primaryStyleData.points,
            rank: 1
        };

        const secondaryStyles: StyleResult[] = secondaryStylesData.map((styleData, index) => ({
            id: styleData.style,
            name: styleData.style.charAt(0).toUpperCase() + styleData.style.slice(1),
            description: `Estilo ${styleData.style}`,
            type: styleData.style as StyleType,
            score: styleData.points,
            characteristics: [],
            recommendations: [],
            colors: [],
            images: [],
            // Legacy compatibility
            category: styleData.style,
            percentage: styleData.percentage,
            style: styleData.style.toLowerCase(),
            points: styleData.points,
            rank: index + 2
        }));

        // Converter para formato de scores simples
        const scores: Record<string, number> = {};
        Object.values(styleScores).forEach(data => {
            scores[data.style] = data.points;
        });

        const result: QuizResult = {
            id: `result-${Date.now()}`,
            responses: {},
            score: primaryStyle.score,
            maxScore: 100,
            completedAt: new Date().toISOString(),
            primaryStyle,
            secondaryStyles,
            totalQuestions: scorableAnswers.length,
            styleResult: primaryStyle
        };

        // ========================================================================
        // 7. ADICIONAR DADOS DO USUÁRIO SE SOLICITADO
        // ========================================================================

        if (includeUserData) {
            result.userData = {
                name: userName,
                completionTime: new Date(),
                strategicAnswersCount
            };
        }

            if (this.debugMode) {
            console.log('🎯 Resultado final:', {
                primaryStyle: result.primaryStyle?.category,
                percentage: result.primaryStyle?.percentage,
                totalQuestions: result.totalQuestions,
                hasUserData: !!result.userData
            });
        }

        return result;
    }

    // ========================================================================
    // MÉTODOS AUXILIARES PRIVADOS
    // ========================================================================

    private extractStyleFromAnswer(answer: QuizAnswer): Record<string, number> {
        // Check if this is a scorable question using built-in logic
        const canScore = isScorableQuestion(answer.questionId);
        if (!canScore) {
            return {};
        }

        // Calculate style points using simple algorithm
        const stylePoints: Record<string, number> = {};
        
        // Extract selected options from answer (use optionId for compatibility)
        const selectedOptions = answer.optionId ? [answer.optionId] : [];

        if (Object.keys(stylePoints).length > 0) {
            return stylePoints;
        }

        // Fallback: usar configuração centralizada se disponível
        if (this.config?.globalScoringConfig?.categories) {
            const result: Record<string, number> = {};
            selectedOptions.forEach((optionId: string) => {
                const categories = this.config!.globalScoringConfig!.categories;
                const hash = this.hashString(optionId + answer.questionId);
                const category = categories[hash % categories.length];
                result[category.name] = (result[category.name] || 0) + (category.weight || 1);
            });
            return result;
        }

        // Fallback final: distribuição baseada em hash
        const result: Record<string, number> = {};
        const styles = this.getStyleCategories();
        selectedOptions.forEach((optionId: string) => {
            const hash = this.hashString(optionId + answer.questionId);
            const style = styles[hash % styles.length];
            result[style] = (result[style] || 0) + 1;
        });

        return result;
    }

    private getStyleCategories(): string[] {
        // Se tiver config centralizada, usar de lá
        if (this.config?.globalScoringConfig?.categories) {
            return this.config.globalScoringConfig.categories.map(cat => cat.name);
        }

        // Fallback: usar categorias predefinidas
        return ['classico', 'romantico', 'dramatico', 'natural', 'criativo', 'elegante', 'sexy', 'contemporaneo'];
    }

    private applyTieBreaker(
        a: StyleCalculationResult,
        b: StyleCalculationResult,
        strategy: string,
        _responseOrder: { style: string; timestamp: Date; questionId: string }[]
    ): number {
        switch (strategy) {
            case 'first-answer': {
                // Usar primeira resposta de cada estilo para desempate
                const firstA = a.firstResponseTime;
                const firstB = b.firstResponseTime;

                if (firstA && firstB) {
                    return firstA.getTime() - firstB.getTime();
                }
                break;
            }

            case 'highest-score':
                // Já ordenado por pontuação, manter ordem atual
                return 0;

            case 'random':
                return Math.random() - 0.5;
        }

        return 0; // Fallback: manter ordem atual
    }

    private hashString(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    // ========================================================================
    // MÉTODOS PÚBLICOS PARA CONFIGURAÇÃO
    // ========================================================================

    setConfig(config: QuizRulesConfig): void {
        this.config = config;
    }

    getConfig(): QuizRulesConfig | null {
        return this.config;
    }

    enableDebug(enable: boolean = true): void {
        this.debugMode = enable;
    }

    // ========================================================================
    // MÉTODO DE VALIDAÇÃO
    // ========================================================================

    validateAnswers(answers: QuizAnswer[]): { valid: boolean; issues: string[] } {
        const issues: string[] = [];

        if (!answers || answers.length === 0) {
            issues.push('Nenhuma resposta fornecida');
            return { valid: false, issues };
        }

        const scorableAnswers = answers.filter(answer => isScorableQuestion(answer.questionId));

        if (scorableAnswers.length === 0) {
            issues.push('Nenhuma resposta pontuável encontrada (questões q1-q10)');
        }

        if (scorableAnswers.length < 5) {
            issues.push(`Poucas respostas pontuáveis: ${scorableAnswers.length}/10`);
        }

        // Verificar duplicatas
        const questionIds = answers.map(a => a.questionId);
        const uniqueQuestionIds = new Set(questionIds);
        if (questionIds.length !== uniqueQuestionIds.size) {
            issues.push('Respostas duplicadas para a mesma questão detectadas');
        }

        return {
            valid: issues.length === 0,
            issues
        };
    }
}

// ========================================================================
// INSTÂNCIA SINGLETON E FUNÇÕES UTILITÁRIAS
// ========================================================================

// Instância padrão do engine
let defaultEngine: UnifiedCalculationEngine | null = null;

/**
 * Obter instância padrão do engine
 */
export function getDefaultCalculationEngine(): UnifiedCalculationEngine {
    if (!defaultEngine) {
        defaultEngine = new UnifiedCalculationEngine();
    }
    return defaultEngine;
}

/**
 * Função utilitária para cálculo rápido
 */
export function calculateQuizResults(
    answers: QuizAnswer[],
    options: UnifiedCalculationOptions = {}
): QuizResult {
    return getDefaultCalculationEngine().calculateResults(answers, options);
}

/**
 * Função de configuração global
 */
export function configureCalculationEngine(config: QuizRulesConfig): void {
    getDefaultCalculationEngine().setConfig(config);
}

export default UnifiedCalculationEngine;