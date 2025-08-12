// @ts-nocheck
// =============================================================================
// SISTEMA DE TESTES A/B PARA QUIZZES
// Permite testar diferentes versões de quizzes para otimizar conversão
// =============================================================================

import { supabase } from '../lib/supabase';

// =============================================================================
// TIPOS
// =============================================================================

export interface ABTest {
  id: string;
  name: string;
  description: string;
  quiz_id: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  start_date: string;
  end_date?: string;
  traffic_split: number; // Porcentagem para versão A (restante vai para B)
  variants: ABVariant[];
  metrics: ABMetrics;
  settings: ABTestSettings;
  created_by: string;
  created_at: string;
}

export interface ABVariant {
  id: string;
  name: string;
  type: 'control' | 'variation';
  quiz_data: {
    title?: string;
    description?: string;
    questions?: any[];
    settings?: any;
    theme?: any;
  };
  traffic_percentage: number;
  is_active: boolean;
}

export interface ABMetrics {
  total_participants: number;
  variant_a: {
    participants: number;
    completions: number;
    conversion_rate: number;
    average_score: number;
    average_time: number;
  };
  variant_b: {
    participants: number;
    completions: number;
    conversion_rate: number;
    average_score: number;
    average_time: number;
  };
  statistical_significance: number;
  confidence_level: number;
  winner?: 'A' | 'B' | 'tie';
}

export interface ABTestSettings {
  minimum_sample_size: number;
  confidence_level: number;
  test_duration_days: number;
  auto_declare_winner: boolean;
  metrics_to_track: string[];
  exclusion_rules?: string[];
}

export interface ABTestResult {
  test: ABTest;
  analytics: {
    daily_data: {
      date: string;
      variant_a_conversions: number;
      variant_b_conversions: number;
      variant_a_participants: number;
      variant_b_participants: number;
    }[];
    conversion_funnel: {
      step: string;
      variant_a_count: number;
      variant_b_count: number;
    }[];
  };
  recommendation: {
    winner: 'A' | 'B' | 'inconclusive';
    confidence: number;
    expected_improvement: number;
    recommendation_text: string;
  };
}

// =============================================================================
// SERVIÇO DE TESTES A/B
// =============================================================================

export class ABTestService {
  // Criar novo teste A/B
  static async createTest(testData: {
    name: string;
    description: string;
    quiz_id: string;
    variants: Omit<ABVariant, 'id'>[];
    settings: ABTestSettings;
    traffic_split: number;
  }): Promise<ABTest> {
    try {
      // Validar dados
      this.validateTestData(testData);

      const test = {
        name: testData.name,
        description: testData.description,
        quiz_id: testData.quiz_id,
        status: 'draft' as const,
        traffic_split: testData.traffic_split,
        settings: testData.settings,
        metrics: {
          total_participants: 0,
          variant_a: {
            participants: 0,
            completions: 0,
            conversion_rate: 0,
            average_score: 0,
            average_time: 0,
          },
          variant_b: {
            participants: 0,
            completions: 0,
            conversion_rate: 0,
            average_score: 0,
            average_time: 0,
          },
          statistical_significance: 0,
          confidence_level: testData.settings.confidence_level,
        },
      };

      // Placeholder - AB tests table doesn't exist in current schema
      console.warn('AB tests not implemented - using quiz_sessions table as fallback');
      const newTest = {
        id: `test_${Date.now()}`,
        ...test,
        created_at: new Date().toISOString(),
      };
      console.log('Simulated AB test creation:', newTest);

      // if (error) throw error;

      // Criar variantes
      const variants = testData.variants.map((variant, index) => ({
        ...variant,
        ab_test_id: newTest.id,
        traffic_percentage: index === 0 ? testData.traffic_split : 100 - testData.traffic_split,
      }));

      // Placeholder - AB test variants table doesn't exist in current schema
      console.warn('AB test variants not implemented');
      const createdVariants = variants.map((v, i) => ({
        ...v,
        id: `variant_${newTest.id}_${i}`,
      }));
      console.log('Simulated variants creation:', createdVariants);

      // if (variantsError) throw variantsError;

      return {
        ...newTest,
        start_date: new Date().toISOString(),
        created_by: 'system',
        variants: createdVariants,
      } as any; // Type assertion for compatibility
    } catch (error) {
      console.error('Erro ao criar teste A/B:', error);
      throw error;
    }
  }

  // Iniciar teste
  static async startTest(testId: string): Promise<void> {
    try {
      // Placeholder implementation - table doesn't exist
      console.log('Would start test:', testId);
      return Promise.resolve();
    } catch (error) {
      console.error('Erro ao iniciar teste:', error);
      throw error;
    }
  }

  // Pausar teste
  static async pauseTest(testId: string): Promise<void> {
    try {
      // Placeholder implementation
      console.log('Would pause test:', testId);
      return Promise.resolve();
    } catch (error) {
      console.error('Erro ao pausar teste:', error);
      throw error;
    }
  }

  // Finalizar teste
  static async completeTest(testId: string, winner?: 'A' | 'B'): Promise<void> {
    try {
      const updateData: any = {
        status: 'completed',
        end_date: new Date().toISOString(),
      };

      if (winner) {
        updateData['metrics.winner'] = winner;
      }

      // Placeholder implementation
      console.log('Would complete test:', testId, 'winner:', winner);
      return Promise.resolve();
    } catch (error) {
      console.error('Erro ao finalizar teste:', error);
      throw error;
    }
  }

  // Buscar testes A/B
  static async getTests(quizId?: string): Promise<ABTest[]> {
    try {
      // Placeholder implementation - return empty array
      console.log('Would get tests for quiz:', quizId);
      return [];
    } catch (error) {
      console.error('Erro ao buscar testes:', error);
      throw error;
    }
  }

  // Buscar teste específico
  static async getTest(testId: string): Promise<ABTest> {
    try {
      // Placeholder implementation
      console.log('Would get test:', testId);
      throw new Error('Test not found (placeholder implementation)');
    } catch (error) {
      console.error('Erro ao buscar teste:', error);
      throw error;
    }
  }

  // Atribuir usuário a uma variante - PLACEHOLDER
  static async assignUserToVariant(testId: string, userId: string): Promise<string> {
    try {
      console.log('Would assign user to variant:', testId, userId);
      // Return mock variant ID
      return `variant_${testId}_${Math.random() > 0.5 ? 'A' : 'B'}`;
    } catch (error) {
      console.error('Erro ao atribuir variante:', error);
      throw error;
    }
  }

  // Registrar conversão - PLACEHOLDER
  static async recordConversion(
    testId: string,
    userId: string,
    conversionData: {
      score?: number;
      completion_time?: number;
      additional_metrics?: Record<string, any>;
    }
  ): Promise<void> {
    try {
      console.log('Would record conversion:', testId, userId, conversionData);
      // Placeholder implementation
      return Promise.resolve();
    } catch (error) {
      console.error('Erro ao registrar conversão:', error);
      throw error;
    }
  }

  // Calcular resultados do teste
  static async calculateResults(testId: string): Promise<ABTestResult> {
    try {
      const test = await this.getTest(testId);

      // Buscar dados de analytics
      const analytics = await this.getTestAnalytics(testId);

      // Calcular significância estatística
      const significance = this.calculateStatisticalSignificance(
        test.metrics.variant_a,
        test.metrics.variant_b
      );

      // Determinar vencedor
      const recommendation = this.generateRecommendation(
        test.metrics.variant_a,
        test.metrics.variant_b,
        significance
      );

      return {
        test,
        analytics,
        recommendation,
      };
    } catch (error) {
      console.error('Erro ao calcular resultados:', error);
      throw error;
    }
  }

  // Validar dados do teste
  private static validateTestData(testData: any): void {
    if (!testData.name || testData.name.trim().length === 0) {
      throw new Error('Nome do teste é obrigatório');
    }

    if (!testData.quiz_id) {
      throw new Error('ID do quiz é obrigatório');
    }

    if (!testData.variants || testData.variants.length !== 2) {
      throw new Error('Teste A/B deve ter exatamente 2 variantes');
    }

    if (testData.traffic_split < 10 || testData.traffic_split > 90) {
      throw new Error('Divisão de tráfego deve estar entre 10% e 90%');
    }

    if (!testData.settings.minimum_sample_size || testData.settings.minimum_sample_size < 100) {
      throw new Error('Tamanho mínimo da amostra deve ser pelo menos 100');
    }
  }

  // Determinar variante para usuário
  private static determineVariant(userId: string, variants: ABVariant[]): ABVariant {
    // Usar hash simples do userId para determinar variante
    const hash = this.simpleHash(userId);
    const percentage = hash % 100;

    // Primeira variante recebe a porcentagem definida, segunda recebe o resto
    if (percentage < variants[0].traffic_percentage) {
      return variants[0];
    } else {
      return variants[1];
    }
  }

  // Hash simples para distribuição
  private static simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Incrementar participantes - PLACEHOLDER
  private static async incrementParticipants(testId: string, variantId: string): Promise<void> {
    console.log('Would increment participants:', testId, variantId);
  }

  // Atualizar métricas do teste - PLACEHOLDER
  private static async updateTestMetrics(testId: string): Promise<void> {
    console.log('Would update test metrics:', testId);
  }

  // Buscar analytics do teste
  private static async getTestAnalytics(testId: string) {
    // Simular dados de analytics
    return {
      daily_data: [
        {
          date: '2025-01-20',
          variant_a_conversions: 25,
          variant_b_conversions: 28,
          variant_a_participants: 50,
          variant_b_participants: 52,
        },
        {
          date: '2025-01-21',
          variant_a_conversions: 32,
          variant_b_conversions: 35,
          variant_a_participants: 48,
          variant_b_participants: 51,
        },
        {
          date: '2025-01-22',
          variant_a_conversions: 28,
          variant_b_conversions: 42,
          variant_a_participants: 55,
          variant_b_participants: 58,
        },
      ],
      conversion_funnel: [
        { step: 'Visualização', variant_a_count: 500, variant_b_count: 520 },
        { step: 'Início do Quiz', variant_a_count: 380, variant_b_count: 410 },
        { step: 'Meio do Quiz', variant_a_count: 290, variant_b_count: 325 },
        { step: 'Conclusão', variant_a_count: 235, variant_b_count: 275 },
      ],
    };
  }

  // Calcular significância estatística
  private static calculateStatisticalSignificance(variantA: any, variantB: any): number {
    // Simulação de cálculo de significância estatística
    // Em produção, usaria uma biblioteca estatística apropriada

    const diff = Math.abs(variantA.conversion_rate - variantB.conversion_rate);
    const avgRate = (variantA.conversion_rate + variantB.conversion_rate) / 2;

    // Fórmula simplificada para demonstração
    const sampleSize = variantA.participants + variantB.participants;
    const significance = Math.min(95, (diff / avgRate) * Math.sqrt(sampleSize) * 10);

    return Math.max(0, significance);
  }

  // Gerar recomendação
  private static generateRecommendation(variantA: any, variantB: any, significance: number) {
    const improvement =
      ((variantB.conversion_rate - variantA.conversion_rate) / variantA.conversion_rate) * 100;

    let winner: 'A' | 'B' | 'inconclusive' = 'inconclusive';
    let recommendationText = '';

    if (significance >= 95) {
      if (variantB.conversion_rate > variantA.conversion_rate) {
        winner = 'B';
        recommendationText = `Variante B é estatisticamente superior com ${improvement.toFixed(1)}% de melhoria na conversão.`;
      } else {
        winner = 'A';
        recommendationText = `Variante A é estatisticamente superior com ${Math.abs(improvement).toFixed(1)}% de melhoria na conversão.`;
      }
    } else {
      recommendationText = `Resultados inconclusivos. Significância estatística de ${significance.toFixed(1)}% (necessário ≥95%). Continue o teste ou aumente o tamanho da amostra.`;
    }

    return {
      winner,
      confidence: significance,
      expected_improvement: Math.abs(improvement),
      recommendation_text: recommendationText,
    };
  }

  // Duplicar quiz para teste A/B - PLACEHOLDER
  static async duplicateQuizForTesting(
    originalQuizId: string,
    modifications: any
  ): Promise<string> {
    try {
      console.log('Would duplicate quiz for testing:', originalQuizId, modifications);
      return `quiz_${Date.now()}`;
    } catch (error) {
      console.error('Erro ao duplicar quiz:', error);
      throw error;
    }
  }
}
