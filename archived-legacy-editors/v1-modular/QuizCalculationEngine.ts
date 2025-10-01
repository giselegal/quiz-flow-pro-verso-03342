/**
 * 🎯 SISTEMA DE CÁLCULO AUTOMÁTICO - V1 EDITÁVEL
 * 
 * Baseado nos dados do quiz21StepsComplete.ts
 * Extrai automaticamente pontuações e calcula resultados
 */

import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';

// 🏷️ TIPOS DOS ESTILOS
export type StyleType =
    | 'natural'
    | 'classico'
    | 'contemporaneo'
    | 'elegante'
    | 'romantico'
    | 'sexy'
    | 'dramatico'
    | 'criativo';

// 📊 INTERFACE DE RESULTADOS
export interface QuizResult {
    primaryStyle: {
        category: StyleType;
        name: string;
        percentage: number;
        description: string;
    };
    secondaryStyles: Array<{
        category: StyleType;
        name: string;
        percentage: number;
    }>;
    totalScore: number;
    styleScores: Record<StyleType, number>;
    personalizedRecommendations: string[];
}

// 🎯 RESPOSTAS DO USUÁRIO
export interface UserAnswer {
    questionId: string;
    stepId: string;
    selectedOptions: string[];
    timestamp: number;
}

// 🔢 CONFIGURAÇÃO DE ESTILOS
const STYLE_CONFIG: Record<StyleType, { name: string; description: string }> = {
    natural: {
        name: 'Natural',
        description: 'Estilo despojado, leve e conectado com a natureza. Prioriza o conforto e a simplicidade.',
    },
    classico: {
        name: 'Clássico',
        description: 'Estilo atemporal e tradicional. Elegância discreta com peças que nunca saem de moda.',
    },
    contemporaneo: {
        name: 'Contemporâneo',
        description: 'Estilo atual e moderno. Combina tendências com praticidade do dia a dia.',
    },
    elegante: {
        name: 'Elegante',
        description: 'Estilo refinado e imponente. Transmite sofisticação e poder através das roupas.',
    },
    romantico: {
        name: 'Romântico',
        description: 'Estilo feminino e delicado. Valoriza a suavidade e elementos românticos.',
    },
    sexy: {
        name: 'Sexy',
        description: 'Estilo sensual e marcante. Destaca as curvas e a feminilidade com elegância.',
    },
    dramatico: {
        name: 'Dramático',
        description: 'Estilo marcante e urbano. Forte personalidade expressa através de peças statement.',
    },
    criativo: {
        name: 'Criativo',
        description: 'Estilo ousado e único. Experimenta cores, texturas e combinações inovadoras.',
    },
};

/**
 * 🧮 MOTOR DE CÁLCULO PRINCIPAL
 */
export class QuizCalculationEngine {
    private answers: UserAnswer[] = [];
    private scoreValues: Record<string, Record<string, number>> = {};

    constructor() {
        this.extractScoreValues();
    }

    /**
     * 📊 Extrai valores de pontuação do template
     */
    private extractScoreValues(): void {
        Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(([stepId, blocks]) => {
            blocks.forEach(block => {
                if (block.type === 'options-grid' && block.properties?.scoreValues) {
                    this.scoreValues[stepId] = block.properties.scoreValues;
                }
            });
        });

        console.log('📊 Valores de pontuação extraídos:', this.scoreValues);
    }

    /**
     * ✍️ Registra uma resposta do usuário
     */
    addAnswer(answer: UserAnswer): void {
        // Remove resposta anterior da mesma questão se existir
        this.answers = this.answers.filter(a => a.questionId !== answer.questionId);
        this.answers.push(answer);
    }

    /**
     * 🧮 Calcula o resultado final
     */
    calculateResults(): QuizResult {
        const styleScores: Record<StyleType, number> = {
            natural: 0,
            classico: 0,
            contemporaneo: 0,
            elegante: 0,
            romantico: 0,
            sexy: 0,
            dramatico: 0,
            criativo: 0,
        };

        let totalQuestions = 0;

        // Calcula pontuações por resposta
        this.answers.forEach(answer => {
            const stepScores = this.scoreValues[answer.stepId];
            if (stepScores) {
                totalQuestions++;
                answer.selectedOptions.forEach(optionId => {
                    const score = stepScores[optionId] || 0;

                    // Identifica o estilo pela parte inicial do ID da opção
                    const styleMatch = optionId.match(/^(natural|classico|contemporaneo|elegante|romantico|sexy|dramatico|criativo)/);
                    if (styleMatch) {
                        const style = styleMatch[1] as StyleType;
                        styleScores[style] += score;
                    }
                });
            }
        });

        // Calcula percentuais
        const totalScore = Object.values(styleScores).reduce((sum, score) => sum + score, 0);

        const stylesWithPercentages = Object.entries(styleScores)
            .map(([style, score]) => ({
                category: style as StyleType,
                name: STYLE_CONFIG[style as StyleType].name,
                percentage: totalScore > 0 ? Math.round((score / totalScore) * 100) : 0,
                score
            }))
            .sort((a, b) => b.score - a.score);

        // Estilo primário
        const primaryStyle = stylesWithPercentages[0];

        // Estilos secundários (2º e 3º places com pelo menos 10%)
        const secondaryStyles = stylesWithPercentages
            .slice(1, 3)
            .filter(style => style.percentage >= 10)
            .map(style => ({
                category: style.category,
                name: style.name,
                percentage: style.percentage
            }));

        // Recomendações personalizadas
        const personalizedRecommendations = this.generateRecommendations(
            primaryStyle.category,
            secondaryStyles.map(s => s.category)
        );

        return {
            primaryStyle: {
                category: primaryStyle.category,
                name: primaryStyle.name,
                percentage: primaryStyle.percentage,
                description: STYLE_CONFIG[primaryStyle.category].description,
            },
            secondaryStyles,
            totalScore,
            styleScores,
            personalizedRecommendations,
        };
    }

    /**
     * 💡 Gera recomendações personalizadas
     */
    private generateRecommendations(primary: StyleType, secondary: StyleType[]): string[] {
        const baseRecommendations: Record<StyleType, string[]> = {
            natural: [
                'Invista em tecidos naturais como algodão e linho',
                'Cores neutras e terrosas são suas aliadas',
                'Peças confortáveis e práticas para o dia a dia'
            ],
            classico: [
                'Blazers bem estruturados são essenciais',
                'Cores neutras como preto, azul marinho e bege',
                'Peças atemporais que durem muitos anos'
            ],
            contemporaneo: [
                'Combine peças básicas com elementos modernos',
                'Experimente cortes diferenciados',
                'Acessórios modernos completam o look'
            ],
            elegante: [
                'Invista em peças de qualidade superior',
                'Cortes impecáveis e modelagens perfeitas',
                'Menos é mais: prefira qualidade à quantidade'
            ],
            romantico: [
                'Babados, rendas e detalhes delicados',
                'Cores suaves como rosa, lavanda e pêssego',
                'Acessórios femininos e delicados'
            ],
            sexy: [
                'Valorize suas curvas com cortes estratégicos',
                'Decotes e fendas com elegância',
                'Cores intensas como vermelho e preto'
            ],
            dramatico: [
                'Peças statement são suas protagonistas',
                'Contraste forte entre cores e texturas',
                'Acessórios marcantes completam o visual'
            ],
            criativo: [
                'Experimente combinações inusitadas',
                'Cores vibrantes e estampas ousadas',
                'Misture texturas e elementos únicos'
            ],
        };

        const recommendations = [...baseRecommendations[primary]];

        // Adiciona recomendações dos estilos secundários
        secondary.forEach(style => {
            recommendations.push(`Incorpore elementos ${STYLE_CONFIG[style].name.toLowerCase()} para criar looks únicos`);
        });

        return recommendations.slice(0, 5); // Máximo 5 recomendações
    }

    /**
     * 📈 Obtém estatísticas do quiz
     */
    getStats(): { totalAnswers: number; completionPercentage: number; styleDistribution: Record<StyleType, number> } {
        const totalPossibleQuestions = Object.keys(this.scoreValues).length;
        const completionPercentage = totalPossibleQuestions > 0
            ? Math.round((this.answers.length / totalPossibleQuestions) * 100)
            : 0;

        const results = this.calculateResults();

        return {
            totalAnswers: this.answers.length,
            completionPercentage,
            styleDistribution: results.styleScores,
        };
    }

    /**
     * 🔄 Reset do quiz
     */
    reset(): void {
        this.answers = [];
    }

    /**
     * 💾 Serialização para armazenamento
     */
    serialize(): string {
        return JSON.stringify({
            answers: this.answers,
            timestamp: Date.now(),
        });
    }

    /**
     * 📂 Desserialização do armazenamento
     */
    deserialize(data: string): void {
        try {
            const parsed = JSON.parse(data);
            this.answers = parsed.answers || [];
        } catch (error) {
            console.error('Erro ao desserializar dados do quiz:', error);
        }
    }
}

// 🏭 Instância singleton
export const quizEngine = new QuizCalculationEngine();