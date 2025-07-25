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
            average_time: 0
          },
          variant_b: {
            participants: 0,
            completions: 0,
            conversion_rate: 0,
            average_score: 0,
            average_time: 0
          },
          statistical_significance: 0,
          confidence_level: testData.settings.confidence_level
        }
      };

      const { data: newTest, error } = await supabase
        .from('ab_tests')
        .insert([test])
        .select()
        .single();

      if (error) throw error;

      // Criar variantes
      const variants = testData.variants.map((variant, index) => ({
        ...variant,
        ab_test_id: newTest.id,
        traffic_percentage: index === 0 ? testData.traffic_split : (100 - testData.traffic_split)
      }));

      const { data: createdVariants, error: variantsError } = await supabase
        .from('ab_test_variants')
        .insert(variants)
        .select();

      if (variantsError) throw variantsError;

      return {
        ...newTest,
        variants: createdVariants
      } as ABTest;

    } catch (error) {
      console.error('Erro ao criar teste A/B:', error);
      throw error;
    }
  }

  // Iniciar teste
  static async startTest(testId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('ab_tests')
        .update({
          status: 'running',
          start_date: new Date().toISOString()
        })
        .eq('id', testId);

      if (error) throw error;

    } catch (error) {
      console.error('Erro ao iniciar teste:', error);
      throw error;
    }
  }

  // Pausar teste
  static async pauseTest(testId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('ab_tests')
        .update({ status: 'paused' })
        .eq('id', testId);

      if (error) throw error;

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
        end_date: new Date().toISOString()
      };

      if (winner) {
        updateData['metrics.winner'] = winner;
      }

      const { error } = await supabase
        .from('ab_tests')
        .update(updateData)
        .eq('id', testId);

      if (error) throw error;

    } catch (error) {
      console.error('Erro ao finalizar teste:', error);
      throw error;
    }
  }

  // Buscar testes A/B
  static async getTests(quizId?: string): Promise<ABTest[]> {
    try {
      let query = supabase
        .from('ab_tests')
        .select(`
          *,
          variants:ab_test_variants(*)
        `)
        .order('created_at', { ascending: false });

      if (quizId) {
        query = query.eq('quiz_id', quizId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ABTest[];

    } catch (error) {
      console.error('Erro ao buscar testes:', error);
      throw error;
    }
  }

  // Buscar teste específico
  static async getTest(testId: string): Promise<ABTest> {
    try {
      const { data, error } = await supabase
        .from('ab_tests')
        .select(`
          *,
          variants:ab_test_variants(*)
        `)
        .eq('id', testId)
        .single();

      if (error) throw error;
      return data as ABTest;

    } catch (error) {
      console.error('Erro ao buscar teste:', error);
      throw error;
    }
  }

  // Atribuir usuário a uma variante
  static async assignUserToVariant(testId: string, userId: string): Promise<string> {
    try {
      // Verificar se usuário já tem atribuição
      const { data: existing } = await supabase
        .from('ab_test_assignments')
        .select('variant_id')
        .eq('test_id', testId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        return existing.variant_id;
      }

      // Buscar teste e variantes
      const test = await this.getTest(testId);
      
      if (test.status !== 'running') {
        throw new Error('Teste não está rodando');
      }

      // Determinar variante baseada no hash do usuário
      const variant = this.determineVariant(userId, test.variants);

      // Salvar atribuição
      const { error } = await supabase
        .from('ab_test_assignments')
        .insert([{
          test_id: testId,
          user_id: userId,
          variant_id: variant.id,
          assigned_at: new Date().toISOString()
        }]);

      if (error) throw error;

      // Incrementar contador de participantes
      await this.incrementParticipants(testId, variant.id);

      return variant.id;

    } catch (error) {
      console.error('Erro ao atribuir variante:', error);
      throw error;
    }
  }

  // Registrar conversão
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
      // Buscar atribuição do usuário
      const { data: assignment, error: assignmentError } = await supabase
        .from('ab_test_assignments')
        .select('variant_id')
        .eq('test_id', testId)
        .eq('user_id', userId)
        .single();

      if (assignmentError) throw assignmentError;

      // Registrar conversão
      const { error } = await supabase
        .from('ab_test_conversions')
        .insert([{
          test_id: testId,
          user_id: userId,
          variant_id: assignment.variant_id,
          score: conversionData.score,
          completion_time: conversionData.completion_time,
          additional_metrics: conversionData.additional_metrics,
          converted_at: new Date().toISOString()
        }]);

      if (error) throw error;

      // Atualizar métricas do teste
      await this.updateTestMetrics(testId);

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
        recommendation
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
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Incrementar participantes
  private static async incrementParticipants(testId: string, variantId: string): Promise<void> {
    // Em produção, isso seria feito com uma função SQL para evitar race conditions
    const { error } = await supabase.rpc('increment_ab_test_participants', {
      test_id: testId,
      variant_id: variantId
    });

    if (error) {
      console.warn('Erro ao incrementar participantes (função RPC pode não existir):', error);
    }
  }

  // Atualizar métricas do teste
  private static async updateTestMetrics(testId: string): Promise<void> {
    try {
      // Buscar conversões e participantes
      const [conversionsResult, participantsResult] = await Promise.all([
        supabase
          .from('ab_test_conversions')
          .select('variant_id, score, completion_time')
          .eq('test_id', testId),
        supabase
          .from('ab_test_assignments')
          .select('variant_id')
          .eq('test_id', testId)
      ]);

      if (conversionsResult.error) throw conversionsResult.error;
      if (participantsResult.error) throw participantsResult.error;

      const conversions = conversionsResult.data || [];
      const participants = participantsResult.data || [];

      // Calcular métricas por variante
      const variants = ['variant_a', 'variant_b'];
      const metrics: any = { total_participants: participants.length };

      variants.forEach((variantKey, index) => {
        const variantConversions = conversions.filter((_, i) => i % 2 === index);
        const variantParticipants = participants.filter((_, i) => i % 2 === index);

        metrics[variantKey] = {
          participants: variantParticipants.length,
          completions: variantConversions.length,
          conversion_rate: variantParticipants.length > 0 
            ? (variantConversions.length / variantParticipants.length) * 100 
            : 0,
          average_score: variantConversions.length > 0 
            ? variantConversions.reduce((sum, c) => sum + (c.score || 0), 0) / variantConversions.length 
            : 0,
          average_time: variantConversions.length > 0 
            ? variantConversions.reduce((sum, c) => sum + (c.completion_time || 0), 0) / variantConversions.length 
            : 0
        };
      });

      // Atualizar no banco
      const { error } = await supabase
        .from('ab_tests')
        .update({ metrics })
        .eq('id', testId);

      if (error) throw error;

    } catch (error) {
      console.error('Erro ao atualizar métricas:', error);
    }
  }

  // Buscar analytics do teste
  private static async getTestAnalytics(testId: string) {
    // Simular dados de analytics
    return {
      daily_data: [
        { date: '2025-01-20', variant_a_conversions: 25, variant_b_conversions: 28, variant_a_participants: 50, variant_b_participants: 52 },
        { date: '2025-01-21', variant_a_conversions: 32, variant_b_conversions: 35, variant_a_participants: 48, variant_b_participants: 51 },
        { date: '2025-01-22', variant_a_conversions: 28, variant_b_conversions: 42, variant_a_participants: 55, variant_b_participants: 58 },
      ],
      conversion_funnel: [
        { step: 'Visualização', variant_a_count: 500, variant_b_count: 520 },
        { step: 'Início do Quiz', variant_a_count: 380, variant_b_count: 410 },
        { step: 'Meio do Quiz', variant_a_count: 290, variant_b_count: 325 },
        { step: 'Conclusão', variant_a_count: 235, variant_b_count: 275 }
      ]
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
    const improvement = ((variantB.conversion_rate - variantA.conversion_rate) / variantA.conversion_rate) * 100;
    
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
      recommendation_text: recommendationText
    };
  }

  // Duplicar quiz para teste A/B
  static async duplicateQuizForTesting(originalQuizId: string, modifications: any): Promise<string> {
    try {
      // Buscar quiz original
      const { data: originalQuiz, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', originalQuizId)
        .single();

      if (quizError) throw quizError;

      // Buscar perguntas originais
      const { data: originalQuestions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', originalQuizId)
        .order('order_index');

      if (questionsError) throw questionsError;

      // Criar novo quiz com modificações
      const newQuiz = {
        ...originalQuiz,
        id: undefined,
        title: modifications.title || originalQuiz.title,
        description: modifications.description || originalQuiz.description,
        is_published: false,
        created_at: new Date().toISOString()
      };

      const { data: createdQuiz, error: createError } = await supabase
        .from('quizzes')
        .insert([newQuiz])
        .select()
        .single();

      if (createError) throw createError;

      // Criar perguntas modificadas
      const newQuestions = originalQuestions.map(q => ({
        ...q,
        id: undefined,
        quiz_id: createdQuiz.id,
        // Aplicar modificações nas perguntas se necessário
        ...modifications.questions?.[q.order_index] || {}
      }));

      const { error: questionsCreateError } = await supabase
        .from('questions')
        .insert(newQuestions);

      if (questionsCreateError) throw questionsCreateError;

      return createdQuiz.id;

    } catch (error) {
      console.error('Erro ao duplicar quiz:', error);
      throw error;
    }
  }
}
