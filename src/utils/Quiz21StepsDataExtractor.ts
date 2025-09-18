// src/utils/Quiz21StepsDataExtractor.ts
// 🔍 Extrator de dados reais do quiz21StepsComplete.ts para o UnifiedCalculationEngine

import QUIZ_STYLE_21_STEPS_TEMPLATE from '@/templates/quiz21StepsComplete';

export interface ExtractedQuizData {
    questions: QuestionData[];
    scoreMapping: Record<string, StyleScoreMap>;
    stepMapping: Record<number, string>; // step number -> questionId
}

export interface QuestionData {
    questionId: string;
    stepNumber: number;
    options: OptionData[];
    maxSelections: number;
    minSelections: number;
}

export interface OptionData {
    id: string;
    text: string;
    imageUrl?: string;
    styleCategory?: string;
    points: number;
}

export interface StyleScoreMap {
    [optionId: string]: {
        style: string;
        points: number;
    };
}

/**
 * Quiz21StepsDataExtractor - Extrai dados reais do template quiz21StepsComplete
 * para uso no UnifiedCalculationEngine
 */
export class Quiz21StepsDataExtractor {
    private static templateData = QUIZ_STYLE_21_STEPS_TEMPLATE;

    /**
     * Extrai todos os dados de quiz do template completo
     */
    static extractQuizData(): ExtractedQuizData {
        const questions: QuestionData[] = [];
        const scoreMapping: Record<string, StyleScoreMap> = {};
        const stepMapping: Record<number, string> = {};

        // Processar etapas 2-11 (questões pontuáveis)
        for (let step = 2; step <= 11; step++) {
            const stepKey = `step-${step}`;
            const stepData = this.templateData[stepKey];

            if (!stepData) continue;

            // Encontrar o bloco options-grid
            const optionsBlock = stepData.find(block => block.type === 'options-grid');
            if (!optionsBlock || !optionsBlock.properties) continue;

            const questionId = optionsBlock.properties.questionId || `q${step - 1}`;
            stepMapping[step] = questionId;

            // Extrair opções
            const options: OptionData[] = [];
            if (optionsBlock.content?.options) {
                optionsBlock.content.options.forEach((option: any) => {
                    // Extrair categoria de estilo do ID da opção
                    const styleCategory = this.extractStyleFromOptionId(option.id);

                    options.push({
                        id: option.id,
                        text: option.text || '',
                        imageUrl: option.imageUrl,
                        styleCategory,
                        points: 1 // Padrão: 1 ponto por opção
                    });
                });
            }

            // Criar dados da questão
            const questionData: QuestionData = {
                questionId,
                stepNumber: step,
                options,
                maxSelections: optionsBlock.properties.maxSelections || 3,
                minSelections: optionsBlock.properties.minSelections || 3
            };

            questions.push(questionData);

            // Criar mapeamento de pontuação baseado em scoreValues
            const scoreValues = optionsBlock.properties.scoreValues;
            if (scoreValues) {
                scoreMapping[questionId] = {};
                Object.entries(scoreValues).forEach(([optionId, points]) => {
                    const style = this.extractStyleFromOptionId(optionId);
                    scoreMapping[questionId][optionId] = {
                        style,
                        points: typeof points === 'number' ? points : 1
                    };
                });
            }
        }

        console.log('🔍 Quiz21StepsDataExtractor: Dados extraídos:', {
            totalQuestions: questions.length,
            totalMappings: Object.keys(scoreMapping).length,
            stepRange: `${Math.min(...Object.keys(stepMapping).map(Number))}-${Math.max(...Object.keys(stepMapping).map(Number))}`
        });

        return {
            questions,
            scoreMapping,
            stepMapping
        };
    }

    /**
     * Extrai o estilo da categoria do ID da opção
     * Exemplos: 'natural_q1' -> 'Natural', 'classico_q2' -> 'Clássico'
     */
    private static extractStyleFromOptionId(optionId: string): string {
        const styleMappings: Record<string, string> = {
            'natural': 'Natural',
            'classico': 'Clássico',
            'contemporaneo': 'Contemporâneo',
            'elegante': 'Elegante',
            'romantico': 'Romântico',
            'sexy': 'Sexy',
            'dramatico': 'Dramático',
            'criativo': 'Criativo'
        };

        // Tentar extrair do prefixo (ex: natural_q1)
        const prefix = optionId.split('_')[0].toLowerCase();
        if (styleMappings[prefix]) {
            return styleMappings[prefix];
        }

        // Fallback: tentar encontrar em qualquer parte do ID
        for (const [key, value] of Object.entries(styleMappings)) {
            if (optionId.toLowerCase().includes(key)) {
                return value;
            }
        }

        // Fallback final: distribuição baseada em hash
        const styles = Object.values(styleMappings);
        const hash = optionId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        return styles[hash % styles.length];
    }

    /**
     * Busca dados de uma questão específica
     */
    static getQuestionData(questionId: string): QuestionData | null {
        const allData = this.extractQuizData();
        return allData.questions.find(q => q.questionId === questionId) || null;
    }

    /**
     * Busca mapping de pontuação para uma questão
     */
    static getScoreMapping(questionId: string): StyleScoreMap | null {
        const allData = this.extractQuizData();
        return allData.scoreMapping[questionId] || null;
    }

    /**
     * Converte resposta do usuário em pontuação por estilo
     */
    static calculateStylePointsFromAnswer(questionId: string, selectedOptionIds: string[]): Record<string, number> {
        const scoreMap = this.getScoreMapping(questionId);
        if (!scoreMap) {
            console.warn(`⚠️ Quiz21StepsDataExtractor: Sem mapeamento de pontuação para ${questionId}`);
            return {};
        }

        const stylePoints: Record<string, number> = {};

        selectedOptionIds.forEach(optionId => {
            const scoreData = scoreMap[optionId];
            if (scoreData) {
                const style = scoreData.style;
                stylePoints[style] = (stylePoints[style] || 0) + scoreData.points;
            }
        });

        return stylePoints;
    }

    /**
     * Valida se um questionId é pontuável (q1-q10)
     */
    static isScorableQuestion(questionId: string): boolean {
        // Questões pontuáveis: q1 até q10 (correspondem às etapas 2-11)
        const scorableQuestions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];
        return scorableQuestions.includes(questionId);
    }

    /**
     * Obtém todas as categorias de estilo disponíveis
     */
    static getAvailableStyles(): string[] {
        return [
            'Natural',
            'Clássico',
            'Contemporâneo',
            'Elegante',
            'Romântico',
            'Sexy',
            'Dramático',
            'Criativo'
        ];
    }

    /**
     * Debug: mostra estrutura completa extraída
     */
    static debugExtractedData(): void {
        const data = this.extractQuizData();

        console.log('🔍 ESTRUTURA EXTRAÍDA DO QUIZ21STEPS:');
        console.log('='.repeat(50));

        console.log('\n📊 QUESTÕES PONTUÁVEIS:');
        data.questions.forEach(q => {
            console.log(`- ${q.questionId} (Step ${q.stepNumber}): ${q.options.length} opções, ${q.minSelections}-${q.maxSelections} seleções`);
        });

        console.log('\n🎯 MAPEAMENTO DE PONTUAÇÃO:');
        Object.entries(data.scoreMapping).forEach(([questionId, mapping]) => {
            console.log(`\n${questionId}:`);
            Object.entries(mapping).forEach(([optionId, { style, points }]) => {
                console.log(`  ${optionId} → ${style} (${points} pts)`);
            });
        });

        console.log('\n📍 MAPEAMENTO STEP→QUESTION:');
        Object.entries(data.stepMapping).forEach(([step, questionId]) => {
            console.log(`Step ${step} → ${questionId}`);
        });
    }
}

export default Quiz21StepsDataExtractor;