import type {
  CalculationBreakdown,
  CalculationConfig,
  CalculationResult,
  ConfidenceMetrics,
  QualityMetrics,
  QuizAnswer,
  QuizResults,
  StyleCalculationInput,
  StyleCalculationResult,
  StyleCategory,
  StyleDistribution,
  StyleProfile,
} from './types';

// ===== STYLE DEFINITIONS =====

const PERSONA_STYLES = ['Analista', 'Diretor', 'Relacional', 'Expressivo'] as const;
type PersonaStyle = (typeof PERSONA_STYLES)[number];

const PERSONA_CHARACTERISTICS = {
  Analista: {
    strengths: ['Precisão', 'Análise detalhada', 'Planejamento', 'Qualidade'],
    challenges: ['Perfeccionismo', 'Lentidão em decisões', 'Resistência a mudanças'],
    communication: 'Dados e fatos',
    motivation: 'Precisão e qualidade',
    fears: 'Críticas ao trabalho',
  },
  Diretor: {
    strengths: ['Liderança', 'Decisões rápidas', 'Orientação a resultados', 'Controle'],
    challenges: ['Impaciência', 'Falta de empatia', 'Autoritarismo'],
    communication: 'Direto e objetivo',
    motivation: 'Poder e controle',
    fears: 'Perda de controle',
  },
  Relacional: {
    strengths: ['Empatia', 'Trabalho em equipe', 'Estabilidade', 'Apoio'],
    challenges: ['Dificuldade em dizer não', 'Evita conflitos', 'Resistência a mudanças'],
    communication: 'Pessoal e empático',
    motivation: 'Harmonia e segurança',
    fears: 'Conflitos e confrontos',
  },
  Expressivo: {
    strengths: ['Criatividade', 'Comunicação', 'Entusiasmo', 'Inovação'],
    challenges: ['Falta de foco', 'Desorganização', 'Impaciência com detalhes'],
    communication: 'Emocional e persuasivo',
    motivation: 'Reconhecimento e variedade',
    fears: 'Rejeição social',
  },
} as const;

// ===== SIMPLIFIED CALCULATION ENGINE =====

export class UnifiedCalculationEngine {
  private config: CalculationConfig;

  constructor(config: Partial<CalculationConfig> = {}) {
    this.config = {
      enableDebug: false,
      confidenceThreshold: 0.6,
      minAnswersRequired: 10,
      weightingAlgorithm: 'adaptive',
      normalizationMethod: 'zscore',
      ...config,
    };
  }

  // ===== MAIN CALCULATION METHOD =====

  async calculate(answers: QuizAnswer[]): Promise<CalculationResult> {
    try {
      this.validateInputs(answers);

      // Step 1: Calculate persona distributions
      const distributions = this.calculatePersonaDistributions(answers);

      // Step 2: Create style profile
      const styleProfile = this.createStyleProfile(distributions);

      // Step 3: Calculate confidence metrics
      const confidence = this.calculateConfidence(distributions, answers);

      // Step 4: Generate insights
      const insights = this.generateInsights(styleProfile, confidence);

      // Step 5: Create quiz results
      const quizResults = this.createQuizResults(answers, styleProfile, insights);

      // Create minimal required fields for CalculationResult
      const result: CalculationResult = {
        styleProfile,
        distributions,
        confidence,
        insights,
        quizResults,
        rawScores: this.createRawScores(distributions),
        normalizedScores: this.createNormalizedScores(distributions),
        quality: this.createQualityMetrics(answers, confidence),
        breakdown: this.createBreakdown(answers, distributions),
        metadata: {
          calculatedAt: new Date(),
          version: '2.0.0',
          engine: 'unified',
          totalAnswers: answers.length,
          processingTime: 0,
        },
      };

      if (this.config.enableDebug) {
        console.log('Calculation completed:', result);
      }

      return result;
    } catch (error) {
      console.error('Calculation error:', error);
      throw new Error(
        `Falha no cálculo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      );
    }
  }

  // ===== PERSONA DISTRIBUTION CALCULATION =====

  private calculatePersonaDistributions(answers: QuizAnswer[]): StyleDistribution {
    const distributions: StyleDistribution = {
      Analista: 0,
      Diretor: 0,
      Relacional: 0,
      Expressivo: 0,
    };

    answers.forEach(answer => {
      const step = answer.step || 1;
      const questionWeight = this.getQuestionWeight(answer.questionId, step);
      const responseIntensity = this.getResponseIntensity(answer.value, answer.type || 'choice');

      const styleMappings = this.mapAnswerToPersonas(answer);

      Object.entries(styleMappings).forEach(([style, weight]) => {
        if (style in distributions) {
          distributions[style as keyof StyleDistribution] +=
            questionWeight * responseIntensity * weight;
        }
      });
    });

    return this.normalizeDistributions(distributions);
  }

  private getQuestionWeight(questionId: string, step: number): number {
    const stepWeight = Math.min(step / 21, 1) * 0.5 + 0.5;
    const questionWeights: Record<string, number> = {
      decision_making: 1.2,
      leadership_style: 1.3,
      communication_preference: 1.1,
      conflict_resolution: 1.2,
      work_environment: 1.0,
      stress_response: 1.1,
    };

    const baseWeight = questionWeights[questionId] || 1.0;
    return baseWeight * stepWeight;
  }

  private getResponseIntensity(value: any, type: string): number {
    switch (type) {
      case 'scale':
        const numValue = typeof value === 'number' ? value : parseInt(value, 10);
        return Math.max(0, Math.min(1, (numValue - 1) / 4));
      case 'choice':
        return 1.0;
      case 'ranking':
        const rank = Array.isArray(value) ? value.indexOf(true) + 1 : 1;
        return Math.max(0, 1 - (rank - 1) / 4);
      default:
        return 0.8;
    }
  }

  private mapAnswerToPersonas(answer: QuizAnswer): Record<string, number> {
    const mappings: Record<string, Record<string, number>> = {
      prefer_data_decisions: { Analista: 0.9, Diretor: 0.3 },
      like_leading_teams: { Diretor: 0.9, Expressivo: 0.4 },
      enjoy_helping_others: { Relacional: 0.9, Expressivo: 0.3 },
      creative_solutions: { Expressivo: 0.9, Analista: 0.2 },
      detailed_planning: { Analista: 0.8, Diretor: 0.4 },
      quick_decisions: { Diretor: 0.8, Expressivo: 0.3 },
    };

    return (
      mappings[answer.questionId] || {
        Analista: 0.25,
        Diretor: 0.25,
        Relacional: 0.25,
        Expressivo: 0.25,
      }
    );
  }

  private normalizeDistributions(distributions: StyleDistribution): StyleDistribution {
    const total = Object.values(distributions).reduce(
      (sum: number, value: number) => sum + value,
      0
    );

    if (total === 0) {
      return { Analista: 0.25, Diretor: 0.25, Relacional: 0.25, Expressivo: 0.25 };
    }

    return {
      Analista: distributions.Analista / total,
      Diretor: distributions.Diretor / total,
      Relacional: distributions.Relacional / total,
      Expressivo: distributions.Expressivo / total,
    };
  }

  // ===== STYLE PROFILE CREATION =====

  private createStyleProfile(distributions: StyleDistribution): StyleProfile {
    const personaEntries = Object.entries(distributions)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .map(([style, percentage]) => ({
        style: style as StyleCategory,
        category: style as StyleCategory,
        score: percentage * 100,
        percentage: percentage,
        points: percentage * 100,
        rank: 0,
      }));

    // Set ranks
    personaEntries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    const [primary, ...secondary] = personaEntries;

    return {
      primaryStyle: primary,
      secondaryStyles: secondary,
      totalScore: personaEntries.reduce((sum, entry) => sum + entry.score, 0),
      distribution: distributions as Record<StyleCategory, number>,
      confidence: 0, // Will be calculated separately
      metadata: {
        algorithm: 'unified',
        version: '2.0.0',
        calculatedAt: new Date(),
      },
    };
  }

  // ===== CONFIDENCE CALCULATION =====

  private calculateConfidence(
    distributions: StyleDistribution,
    answers: QuizAnswer[]
  ): ConfidenceMetrics {
    const values = Object.values(distributions).sort((a, b) => b - a);
    const [highest, secondHighest] = values;

    const separation = highest - secondHighest;
    const separationConfidence = Math.min(separation * 2, 1);

    const consistency = this.calculateAnswerConsistency(answers);
    const consistencyConfidence = consistency;

    const sampleSize = answers.length;
    const sampleConfidence = Math.min(sampleSize / this.config.minAnswersRequired, 1);

    const overall =
      separationConfidence * 0.4 + consistencyConfidence * 0.4 + sampleConfidence * 0.2;

    return {
      overall,
      separation: separationConfidence,
      consistency: consistencyConfidence,
      sampleSize: sampleConfidence,
      factors: {
        dataQuality:
          consistencyConfidence > 0.7 ? 'high' : consistencyConfidence > 0.4 ? 'medium' : 'low',
        sampleAdequacy: sampleConfidence > 0.8 ? 'sufficient' : 'limited',
        styleClarity:
          separationConfidence > 0.6
            ? 'clear'
            : separationConfidence > 0.3
              ? 'moderate'
              : 'unclear',
      },
    };
  }

  private calculateAnswerConsistency(answers: QuizAnswer[]): number {
    const styleScores: Record<string, number[]> = {
      Analista: [],
      Diretor: [],
      Relacional: [],
      Expressivo: [],
    };

    answers.forEach(answer => {
      const styleMappings = this.mapAnswerToPersonas(answer);
      const intensity = this.getResponseIntensity(answer.value, answer.type || 'choice');

      Object.entries(styleMappings).forEach(([style, weight]) => {
        if (style in styleScores) {
          styleScores[style].push(weight * intensity);
        }
      });
    });

    const variances = Object.values(styleScores).map(scores => {
      if (scores.length < 2) return 0;

      const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      const variance =
        scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;

      return 1 - Math.min(variance, 1);
    });

    return variances.reduce((sum, v) => sum + v, 0) / variances.length;
  }

  // ===== INSIGHTS GENERATION =====

  private generateInsights(profile: StyleProfile, confidence: ConfidenceMetrics): string[] {
    const insights: string[] = [];

    insights.push(
      `Seu perfil predominante é ${profile.primaryStyle.style} (${profile.primaryStyle.percentage.toFixed(1)}%)`
    );

    if (profile.secondaryStyles.length > 0 && profile.secondaryStyles[0].percentage > 0.2) {
      insights.push(
        `Você demonstra características secundárias do perfil ${profile.secondaryStyles[0].style} (${profile.secondaryStyles[0].percentage.toFixed(1)}%)`
      );
    }

    if (confidence.overall > 0.8) {
      insights.push('Este resultado tem alta confiabilidade baseado nas suas respostas');
    } else if (confidence.overall > 0.6) {
      insights.push(
        'Este resultado tem confiabilidade moderada - algumas respostas foram inconsistentes'
      );
    } else {
      insights.push(
        'Este resultado tem baixa confiabilidade - considere refazer o teste com mais atenção'
      );
    }

    const personaStyle = profile.primaryStyle.style as PersonaStyle;
    if (personaStyle in PERSONA_CHARACTERISTICS) {
      const characteristics = PERSONA_CHARACTERISTICS[personaStyle];
      insights.push(
        `Seus pontos fortes incluem: ${characteristics.strengths.slice(0, 2).join(' e ')}`
      );
      insights.push(`Áreas de atenção: ${characteristics.challenges[0]}`);
    }

    return insights;
  }

  // ===== QUIZ RESULTS CREATION =====

  private createQuizResults(
    answers: QuizAnswer[],
    profile: StyleProfile,
    insights: string[]
  ): QuizResults {
    return {
      userId: '',
      quizId: '',
      answers,
      primaryStyle: profile.primaryStyle.style,
      secondaryStyle: profile.secondaryStyles.length > 0 ? profile.secondaryStyles[0].style : null,
      styleScores: profile.distribution as StyleDistribution,
      confidence: profile.confidence,
      insights,
      completedAt: new Date(),
      metadata: {
        version: '2.0.0',
        engine: 'unified',
        processingTime: 0,
      },
    };
  }

  // ===== HELPER METHODS FOR CALCULATION RESULT =====

  private createRawScores(distributions: StyleDistribution): Record<StyleCategory, number> {
    // Map persona styles to style categories
    return distributions as Record<StyleCategory, number>;
  }

  private createNormalizedScores(distributions: StyleDistribution): Record<StyleCategory, number> {
    return distributions as Record<StyleCategory, number>;
  }

  private createQualityMetrics(
    answers: QuizAnswer[],
    confidence: ConfidenceMetrics
  ): QualityMetrics {
    return {
      completeness: Math.min(answers.length / this.config.minAnswersRequired, 1),
      consistency: confidence.consistency,
      confidence: confidence.overall,
      reliability: confidence.overall,
    };
  }

  private createBreakdown(
    answers: QuizAnswer[],
    distributions: StyleDistribution
  ): CalculationBreakdown {
    const validAnswers = answers.filter(answer => answer.value !== undefined);

    return {
      totalQuestions: 21,
      answeredQuestions: answers.length,
      scoringQuestions: validAnswers.length,
      totalResponses: answers.length,
      validResponses: validAnswers.length,
      invalidResponses: answers.length - validAnswers.length,
      styleDistribution: Object.entries(distributions).reduce(
        (acc, [style, percentage]) => {
          acc[style as StyleCategory] = {
            score: percentage * 100,
            percentage,
            responseCount: Math.floor(validAnswers.length * percentage),
          };
          return acc;
        },
        {} as Record<StyleCategory, { score: number; percentage: number; responseCount: number }>
      ),
    };
  }

  // ===== VALIDATION =====

  private validateInputs(answers: QuizAnswer[]): void {
    if (!Array.isArray(answers) || answers.length === 0) {
      throw new Error('Respostas não fornecidas ou inválidas');
    }

    if (answers.length < this.config.minAnswersRequired) {
      throw new Error(`Mínimo de ${this.config.minAnswersRequired} respostas necessárias`);
    }

    answers.forEach((answer, index) => {
      if (!answer.questionId || answer.value === undefined) {
        throw new Error(`Resposta ${index + 1} tem formato inválido`);
      }
    });
  }

  // ===== LEGACY COMPATIBILITY =====

  async calculateStyle(input: StyleCalculationInput): Promise<StyleCalculationResult> {
    const answers: QuizAnswer[] = input.answers.map((answer, index) => ({
      questionId: `question_${index + 1}`,
      optionId: `option_${index + 1}`,
      step: Math.floor(index / 3) + 1,
      value: answer.value,
      type: answer.type || 'choice',
      timestamp: new Date(),
      answeredAt: new Date(),
    }));

    const result = await this.calculate(answers);

    return {
      primaryStyle: result.styleProfile.primaryStyle.style,
      percentage: result.styleProfile.primaryStyle.percentage,
      confidence: result.confidence?.overall || 0,
      distribution: result.distributions || {
        Analista: 0,
        Diretor: 0,
        Relacional: 0,
        Expressivo: 0,
      },
    };
  }

  // ===== CONFIGURATION =====

  updateConfig(newConfig: Partial<CalculationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): CalculationConfig {
    return { ...this.config };
  }
}

// ===== FACTORY FUNCTION =====

export const createCalculationEngine = (
  config?: Partial<CalculationConfig>
): UnifiedCalculationEngine => {
  return new UnifiedCalculationEngine(config);
};

// ===== DEFAULT EXPORT =====

export default UnifiedCalculationEngine;
