/**
 * 🔧 SUPABASE INTEGRATION SERVICE
 *
 * Serviço completo para integração com Supabase
 * - Gerenciamento de quizzes
 * - Cálculo de resultados
 * - Integração com CalculationEngine
 */

import { CalculationResult, QuizDefinition, QuizResponse } from '@/types/quiz';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CalculationEngine } from './calculationService';

// Configuração Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export class SupabaseIntegrationService {
  private supabase: SupabaseClient;
  private calculationEngine: CalculationEngine;
  private isInitialized: boolean = false;

  constructor() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      const missingVars = [];
      if (!SUPABASE_URL) missingVars.push('VITE_SUPABASE_URL');
      if (!SUPABASE_ANON_KEY) missingVars.push('VITE_SUPABASE_ANON_KEY');
      throw new Error(
        `Supabase configuration error: Missing environment variable(s): ${missingVars.join(', ')}.\n` +
          `Please set the required variable(s) in your .env file or build tool configuration:\n` +
          `  VITE_SUPABASE_URL=<your-supabase-url>\n` +
          `  VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>\n` +
          `Current values:\n` +
          `  VITE_SUPABASE_URL: ${SUPABASE_URL ?? 'undefined'}\n` +
          `  VITE_SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ?? 'undefined'}`
      );
    }

    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    this.calculationEngine = new CalculationEngine();
  }

  // ===== INITIALIZATION =====

  async initialize(): Promise<void> {
    try {
      // Test connection
      const { error } = await this.supabase.from('quizzes').select('id').limit(1);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      this.isInitialized = true;
      console.log('✅ Supabase Integration Service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Supabase Integration Service:', error);
      throw error;
    }
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('SupabaseIntegrationService not initialized. Call initialize() first.');
    }
  }

  // ===== QUIZ MANAGEMENT =====

  async saveQuizDefinition(
    quizId: string,
    definition: QuizDefinition,
    metadata?: Record<string, any>
  ): Promise<void> {
    this.ensureInitialized();

    try {
      const { error } = await this.supabase.from('quizzes').upsert({
        id: quizId,
        definition,
        metadata: metadata || {},
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      console.log(`✅ Quiz definition saved: ${quizId}`);
    } catch (error) {
      console.error('❌ Failed to save quiz definition:', error);
      throw error;
    }
  }

  async loadQuizDefinition(quizId: string): Promise<QuizDefinition | null> {
    this.ensureInitialized();

    try {
      const { data, error } = await this.supabase
        .from('quizzes')
        .select('definition')
        .eq('id', quizId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Quiz not found
        }
        throw error;
      }

      return data.definition;
    } catch (error) {
      console.error('❌ Failed to load quiz definition:', error);
      throw error;
    }
  }

  // ===== RESPONSE MANAGEMENT =====

  async saveQuizResponse(
    quizId: string,
    responseId: string,
    response: QuizResponse
  ): Promise<void> {
    this.ensureInitialized();

    try {
      const { error } = await this.supabase.from('quiz_responses').upsert({
        quiz_id: quizId,
        response_id: responseId,
        response_data: response,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      console.log(`✅ Quiz response saved: ${responseId}`);
    } catch (error) {
      console.error('❌ Failed to save quiz response:', error);
      throw error;
    }
  }

  // ===== CALCULATION INTEGRATION =====

  async calculateAndSaveResults(
    quizId: string,
    responseId: string,
    response: QuizResponse
  ): Promise<CalculationResult> {
    this.ensureInitialized();

    try {
      // Load quiz definition
      const definition = await this.loadQuizDefinition(quizId);
      if (!definition) {
        throw new Error(`Quiz definition not found: ${quizId}`);
      }

      // Calculate results
      const results = this.calculationEngine.calculateResults(definition, response);

      // Save response with results
      await this.saveQuizResponse(quizId, responseId, {
        ...response,
        calculationResults: results,
      });

      return results;
    } catch (error) {
      console.error('❌ Failed to calculate and save results:', error);
      throw error;
    }
  }

  // ===== ANALYTICS =====

  async getQuizAnalytics(quizId: string): Promise<{
    totalResponses: number;
    averageScore: number;
    responsesByDay: Record<string, number>;
  }> {
    this.ensureInitialized();

    try {
      const { data: responses, error } = await this.supabase
        .from('quiz_responses')
        .select('response_data, created_at')
        .eq('quiz_id', quizId);

      if (error) throw error;

      if (!responses || responses.length === 0) {
        return {
          totalResponses: 0,
          averageScore: 0,
          responsesByDay: {},
        };
      }

      // Calculate analytics
      const totalResponses = responses.length;

      let totalScore = 0;
      const responsesByDay: Record<string, number> = {};

      responses.forEach(response => {
        const results = response.response_data?.calculationResults;
        if (results?.score) {
          totalScore += results.score;
        }

        const day = new Date(response.created_at).toISOString().split('T')[0];
        responsesByDay[day] = (responsesByDay[day] || 0) + 1;
      });

      const averageScore = totalResponses > 0 ? totalScore / totalResponses : 0;

      return {
        totalResponses,
        averageScore,
        responsesByDay,
      };
    } catch (error) {
      console.error('❌ Failed to get quiz analytics:', error);
      throw error;
    }
  }
}

// Singleton instance
export const supabaseIntegration = new SupabaseIntegrationService();
