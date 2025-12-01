/**
 * 📊 Scoring Migration Helpers - V4.0 → V4.1-SaaS
 * 
 * Utilitários para migrar sistema de scoring de weight/weights (v4.0)
 * para option.score.category (v4.1-saas).
 * 
 * @migration
 * V4.0: response.weight = { natural: 10, classico: 5 }
 * V4.1: option.score = { category: "natural", points: 10 }
 */

import type { QuizAnswer } from '@/types/quiz';
import type { SaaSOption } from '@/lib/quiz-v4-saas-adapter';
import { normalizeOption } from '@/lib/quiz-v4-saas-adapter';

/**
 * Converte weight/weights (v4.0) para normalizedOptions (v4.1-saas)
 * 
 * Esta função tenta reconstruir as options normalizadas a partir
 * das respostas legadas com weights.
 */
export function migrateAnswerToV41(answer: QuizAnswer): QuizAnswer {
    // Se já tem normalizedOptions, retornar direto
    if (answer.normalizedOptions && answer.normalizedOptions.length > 0) {
        return answer;
    }

    // Tentar migrar de weights
    if (answer.weights) {
        const normalizedOptions: SaaSOption[] = [];

        // Para cada categoria/peso, criar uma option fictícia
        Object.entries(answer.weights).forEach(([category, points], index) => {
            normalizedOptions.push({
                id: `${answer.questionId}-opt-${index}`,
                label: `Option ${category}`,
                value: `${answer.questionId}-opt-${index}`,
                imageUrl: null,
                score: {
                    category,
                    points,
                },
            });
        });

        return {
            ...answer,
            normalizedOptions,
        };
    }

    // Tentar migrar de weight (singular)
    if (answer.weight && typeof answer.weight === 'number') {
        // Assumir que há apenas uma option com esse peso
        // Precisamos inferir a categoria (não temos essa info no v4.0)
        const normalizedOptions: SaaSOption[] = [{
            id: answer.optionId || `${answer.questionId}-opt-0`,
            label: 'Selected option',
            value: answer.optionId || `${answer.questionId}-opt-0`,
            imageUrl: null,
            score: {
                category: 'unknown', // Não conseguimos inferir
                points: answer.weight,
            },
        }];

        return {
            ...answer,
            normalizedOptions,
        };
    }

    // Fallback: retornar sem modificações
    return answer;
}

/**
 * Converte array de respostas legadas para v4.1
 */
export function migrateAnswersArrayToV41(answers: QuizAnswer[]): QuizAnswer[] {
    return answers.map(migrateAnswerToV41);
}

/**
 * Calcula scores a partir de normalizedOptions (v4.1-saas)
 * 
 * Esta é a função principal que deve ser usada pelos engines.
 */
export function calculateScoresFromNormalizedOptions(
    answers: QuizAnswer[]
): Record<string, number> {
    const scores: Record<string, number> = {};

    answers.forEach((answer) => {
        if (answer.normalizedOptions) {
            // V4.1-SaaS: usar option.score.category
            answer.normalizedOptions.forEach((option) => {
                const { category, points } = option.score;
                scores[category] = (scores[category] || 0) + points;
            });
        } else if (answer.weights) {
            // Fallback v4.0: weights
            Object.entries(answer.weights).forEach(([category, points]) => {
                scores[category] = (scores[category] || 0) + points;
            });
        }
    });

    return scores;
}

/**
 * Extrai categoria predominante
 */
export function getPredominantCategory(scores: Record<string, number>): {
    category: string;
    points: number;
    percentage: number;
} | null {
    const entries = Object.entries(scores);
    
    if (entries.length === 0) {
        return null;
    }

    // Ordenar por pontuação
    entries.sort((a, b) => b[1] - a[1]);

    const [category, points] = entries[0];
    const total = entries.reduce((sum, [, p]) => sum + p, 0);

    return {
        category,
        points,
        percentage: total > 0 ? (points / total) * 100 : 0,
    };
}

/**
 * Compatibilidade: converte options de componente para normalizedOptions
 * 
 * Usado quando o componente seleciona options, mas ainda não está
 * salvando no formato v4.1-saas.
 */
export function convertSelectionToNormalizedOptions(
    selectedOptionIds: string[],
    allOptions: any[]
): SaaSOption[] {
    return selectedOptionIds
        .map((id) => {
            const option = allOptions.find((opt) => opt.id === id);
            if (!option) return null;
            return normalizeOption(option);
        })
        .filter(Boolean) as SaaSOption[];
}

/**
 * Hook para migração gradual
 * 
 * Permite que engines usem tanto v4.0 quanto v4.1 simultaneamente
 * durante o período de migração.
 */
export function useBackwardCompatibleScoring(answers: QuizAnswer[]): {
    scores: Record<string, number>;
    predominant: ReturnType<typeof getPredominantCategory>;
    isV41: boolean;
} {
    // Detectar se alguma resposta usa v4.1
    const hasV41 = answers.some((a) => a.normalizedOptions && a.normalizedOptions.length > 0);

    // Calcular scores
    const scores = calculateScoresFromNormalizedOptions(answers);
    const predominant = getPredominantCategory(scores);

    return {
        scores,
        predominant,
        isV41: hasV41,
    };
}

/**
 * Validação de migração
 * 
 * Verifica se uma resposta está no formato correto
 */
export function validateAnswerFormat(answer: QuizAnswer): {
    isValid: boolean;
    format: 'v4.0-weight' | 'v4.0-weights' | 'v4.1-saas' | 'invalid';
    errors: string[];
} {
    const errors: string[] = [];

    // Verificar formato v4.1-saas
    if (answer.normalizedOptions && answer.normalizedOptions.length > 0) {
        const hasValidScores = answer.normalizedOptions.every(
            (opt) => opt.score && opt.score.category && typeof opt.score.points === 'number'
        );

        if (!hasValidScores) {
            errors.push('normalizedOptions possui scores inválidos');
        }

        return {
            isValid: hasValidScores,
            format: 'v4.1-saas',
            errors,
        };
    }

    // Verificar formato v4.0-weights
    if (answer.weights && Object.keys(answer.weights).length > 0) {
        return {
            isValid: true,
            format: 'v4.0-weights',
            errors: [],
        };
    }

    // Verificar formato v4.0-weight
    if (answer.weight !== undefined) {
        return {
            isValid: true,
            format: 'v4.0-weight',
            errors: [],
        };
    }

    return {
        isValid: false,
        format: 'invalid',
        errors: ['Nenhum formato de scoring detectado'],
    };
}

export default {
    migrateAnswerToV41,
    migrateAnswersArrayToV41,
    calculateScoresFromNormalizedOptions,
    getPredominantCategory,
    convertSelectionToNormalizedOptions,
    useBackwardCompatibleScoring,
    validateAnswerFormat,
};
