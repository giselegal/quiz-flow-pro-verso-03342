/**
 * 🔄 QUIZ DATA PIPELINE - FLUXO END-TO-END DE DADOS
 * 
 * Pipeline unificado que conecta:
 * Templates → Renderização → Coleta → Validação → Supabase → Resultado
 */

import { Block } from '@/types/editor';
import { unifiedQuizStorage } from '@/services/core/UnifiedQuizStorage';
import HybridTemplateService from '@/services/HybridTemplateService'; // ainda usado para stepConfig
import { quizEstiloLoaderGateway, mapStepsToStepBlocks } from '@/domain/quiz/gateway';
import type { CanonicalStep } from '@/domain/quiz/gateway/QuizEstiloLoaderGateway';

export interface DataPipelineStage {
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  data?: any;
  error?: string;
  timestamp: string;
}

export interface PipelineContext {
  sessionId: string;
  funnelId?: string;
  userId?: string;
  metadata: {
    startedAt: string;
    lastUpdated: string;
    version: string;
  };
}

export interface DataTransformation {
  input: any;
  output: any;
  stage: string;
  transformedAt: string;
}

class QuizDataPipeline {
  private context: PipelineContext | null = null;
  private stages: Map<string, DataPipelineStage> = new Map();
  private transformations: DataTransformation[] = [];

  /**
   * 🚀 INICIALIZAR PIPELINE
   */
  async initialize(funnelId?: string, userId?: string): Promise<void> {
    const sessionId = this.generateSessionId();

    this.context = {
      sessionId,
      funnelId,
      userId,
      metadata: {
        startedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        version: '1.0',
      },
    };

    console.log('🔄 QuizDataPipeline: Pipeline inicializado', {
      sessionId,
      funnelId,
      userId,
    });

    await this.initializeStage('initialization', 'completed', this.context);
  }

  /**
   * 📄 STAGE 1: CARREGAR TEMPLATE
   * Templates → Configuração de etapas
   */
  async loadTemplate(templateId: string = 'quiz-estilo-21-steps'): Promise<any> {
    await this.initializeStage('template-loading', 'processing');

    try {
      const canonical = await quizEstiloLoaderGateway.load();
      const mapped = mapStepsToStepBlocks(canonical.steps as CanonicalStep[]);

      const transformation: DataTransformation = {
        input: { templateId },
        output: {
          template: mapped,
          stepsCount: Object.keys(mapped).length,
          hasBlocks: Object.values(mapped).some((step: any) => Array.isArray(step) && step.length > 0),
        },
        stage: 'template-loading',
        transformedAt: new Date().toISOString(),
      };

      this.transformations.push(transformation);
      await this.completeStage('template-loading', transformation.output);

      console.log('📄 Pipeline: Template carregado', {
        templateId,
        stepsCount: transformation.output.stepsCount,
      });

      return mapped;
    } catch (error) {
      await this.errorStage('template-loading', error);
      throw error;
    }
  }

  /**
   * 🎨 STAGE 2: RENDERIZAR BLOCOS
   * Template → Blocos renderizáveis por etapa
   */
  async renderStepBlocks(step: number, template: any): Promise<Block[]> {
    await this.initializeStage('block-rendering', 'processing');

    try {
      const stepKey = `step-${step}`;
      const stepBlocks = template[stepKey] || [];

      // Aplicar configurações dinâmicas baseadas na etapa
      const stepConfig = await HybridTemplateService.getStepConfig(step);
      const renderedBlocks = this.applyStepConfiguration(stepBlocks, stepConfig);

      const transformation: DataTransformation = {
        input: { step, templateStepBlocks: stepBlocks, stepConfig },
        output: {
          renderedBlocks,
          blocksCount: renderedBlocks.length,
          hasValidation: stepConfig.validation.required,
          autoAdvance: stepConfig.behavior.autoAdvance,
        },
        stage: 'block-rendering',
        transformedAt: new Date().toISOString(),
      };

      this.transformations.push(transformation);
      await this.completeStage('block-rendering', transformation.output);

      console.log('🎨 Pipeline: Blocos renderizados', {
        step,
        blocksCount: renderedBlocks.length,
        autoAdvance: stepConfig.behavior.autoAdvance,
      });

      return renderedBlocks;
    } catch (error) {
      await this.errorStage('block-rendering', error);
      throw error;
    }
  }

  /**
   * 📥 STAGE 3: COLETAR DADOS DO USUÁRIO
   * Interação → Dados estruturados
   */
  async collectUserData(step: number, rawData: any): Promise<any> {
    await this.initializeStage('data-collection', 'processing');

    try {
      // Normalizar dados baseado no tipo de etapa
      const normalizedData = this.normalizeStepData(step, rawData);

      // Validar estrutura dos dados
      this.validateDataStructure(step, normalizedData);

      const transformation: DataTransformation = {
        input: { step, rawData },
        output: {
          normalizedData,
          dataType: this.getStepDataType(step),
          isValid: true,
        },
        stage: 'data-collection',
        transformedAt: new Date().toISOString(),
      };

      this.transformations.push(transformation);
      await this.completeStage('data-collection', transformation.output);

      console.log('📥 Pipeline: Dados coletados', {
        step,
        dataType: transformation.output.dataType,
        dataSize: JSON.stringify(normalizedData).length,
      });

      return normalizedData;
    } catch (error) {
      await this.errorStage('data-collection', error);
      throw error;
    }
  }

  /**
   * ✅ STAGE 4: VALIDAR DADOS
   * Dados → Dados validados + resultado de validação
   */
  async validateData(step: number, data: any): Promise<{ isValid: boolean; data: any; errors: string[] }> {
    await this.initializeStage('data-validation', 'processing');

    try {
      const validation = this.performStepValidation(step, data);

      const transformation: DataTransformation = {
        input: { step, data },
        output: validation,
        stage: 'data-validation',
        transformedAt: new Date().toISOString(),
      };

      this.transformations.push(transformation);
      await this.completeStage('data-validation', transformation.output);

      console.log('✅ Pipeline: Dados validados', {
        step,
        isValid: validation.isValid,
        errorsCount: validation.errors.length,
      });

      return validation;
    } catch (error) {
      await this.errorStage('data-validation', error);
      throw error;
    }
  }

  /**
   * 💾 STAGE 5: PERSISTIR DADOS
   * Dados validados → Storage local + Supabase
   */
  async persistData(step: number, validatedData: any): Promise<{ local: boolean; remote: boolean }> {
    await this.initializeStage('data-persistence', 'processing');

    try {
      // 1. Salvar localmente
      const localSuccess = this.saveToLocalStorage(step, validatedData);

      // 2. Tentar salvar remotamente
      let remoteSuccess = false;
      try {
        if (this.context?.userId) {
          await this.saveToSupabase(step, validatedData);
          remoteSuccess = true;
        }
      } catch (supabaseError) {
        console.warn('⚠️ Pipeline: Falha no Supabase, continuando com dados locais:', supabaseError);
      }

      const result = { local: localSuccess, remote: remoteSuccess };

      const transformation: DataTransformation = {
        input: { step, validatedData },
        output: result,
        stage: 'data-persistence',
        transformedAt: new Date().toISOString(),
      };

      this.transformations.push(transformation);
      await this.completeStage('data-persistence', transformation.output);

      console.log('💾 Pipeline: Dados persistidos', {
        step,
        local: localSuccess,
        remote: remoteSuccess,
      });

      return result;
    } catch (error) {
      await this.errorStage('data-persistence', error);
      throw error;
    }
  }

  /**
   * 🎯 STAGE 6: CALCULAR RESULTADO
   * Dados completos → Resultado personalizado
   */
  async calculateResult(): Promise<any> {
    await this.initializeStage('result-calculation', 'processing');

    try {
      const quizData = unifiedQuizStorage.loadData();

      // Verificar se há dados suficientes
      if (!unifiedQuizStorage.hasEnoughDataForResult()) {
        throw new Error('Dados insuficientes para calcular resultado');
      }

      // Calcular pontuações por categoria
      const categoryScores = this.calculateCategoryScores(quizData.selections);

      // Determinar estilo predominante
      const dominantStyle = this.getDominantStyle(categoryScores);

      // Gerar insights personalizados
      const personalizedInsights = this.generatePersonalizedInsights(
        dominantStyle,
        categoryScores
      );

      const result = {
        dominantStyle,
        categoryScores,
        personalizedInsights,
        userName: quizData.formData.userName || 'Usuário',
        metadata: {
          calculatedAt: new Date().toISOString(),
          totalSelections: Object.keys(quizData.selections).length,
          completedSteps: quizData.metadata.completedSteps.length,
          sessionId: this.context?.sessionId,
        },
      };

      const transformation: DataTransformation = {
        input: { quizData, dataStats: unifiedQuizStorage.getDataStats() },
        output: result,
        stage: 'result-calculation',
        transformedAt: new Date().toISOString(),
      };

      this.transformations.push(transformation);
      await this.completeStage('result-calculation', transformation.output);

      console.log('🎯 Pipeline: Resultado calculado', {
        dominantStyle,
        categoriesCount: Object.keys(categoryScores).length,
        totalScore: Object.values(categoryScores).reduce((a, b) => a + b, 0),
      });

      return result;
    } catch (error) {
      await this.errorStage('result-calculation', error);
      throw error;
    }
  }

  /**
   * 📊 OBTER PIPELINE STATUS
   */
  getPipelineStatus(): {
    stages: DataPipelineStage[];
    transformations: DataTransformation[];
    context: PipelineContext | null;
    isComplete: boolean;
    hasErrors: boolean;
  } {
    const stages = Array.from(this.stages.values());
    const isComplete = stages.every(stage =>
      stage.status === 'completed' || stage.status === 'error'
    );
    const hasErrors = stages.some(stage => stage.status === 'error');

    return {
      stages,
      transformations: this.transformations,
      context: this.context,
      isComplete,
      hasErrors,
    };
  }

  // Métodos auxiliares privados

  private async initializeStage(name: string, status: DataPipelineStage['status'], data?: any): Promise<void> {
    const stage: DataPipelineStage = {
      name,
      status,
      data,
      timestamp: new Date().toISOString(),
    };

    this.stages.set(name, stage);
    this.updateContext();
  }

  private async completeStage(name: string, data: any): Promise<void> {
    const stage = this.stages.get(name);
    if (stage) {
      stage.status = 'completed';
      stage.data = data;
      stage.timestamp = new Date().toISOString();
      this.updateContext();
    }
  }

  private async errorStage(name: string, error: any): Promise<void> {
    const stage = this.stages.get(name);
    if (stage) {
      stage.status = 'error';
      stage.error = error instanceof Error ? error.message : String(error);
      stage.timestamp = new Date().toISOString();
      this.updateContext();
    }
  }

  private updateContext(): void {
    if (this.context) {
      this.context.metadata.lastUpdated = new Date().toISOString();
    }
  }

  private generateSessionId(): string {
    return `quiz-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private applyStepConfiguration(blocks: Block[], stepConfig: any): Block[] {
    // Aplicar configurações dinâmicas aos blocos
    return blocks.map(block => ({
      ...block,
      properties: {
        ...block.properties,
        // Injetar configurações da etapa
        requiredSelections: stepConfig.validation.requiredSelections,
        autoAdvance: stepConfig.behavior.autoAdvance,
        autoAdvanceDelay: stepConfig.behavior.autoAdvanceDelay,
      },
    }));
  }

  private normalizeStepData(step: number, rawData: any): any {
    if (step === 1) {
      // Etapa 1: nome
      return {
        userName: rawData.name || rawData.userName || '',
      };
    } else if (step >= 2 && step <= 18) {
      // Etapas de seleção
      return {
        selectedOptions: Array.isArray(rawData.selectedOptions)
          ? rawData.selectedOptions
          : rawData.selections || [],
      };
    }

    return rawData;
  }

  private getStepDataType(step: number): string {
    if (step === 1) return 'form';
    if (step >= 2 && step <= 11) return 'scoring-selection';
    if (step === 12 || step === 19) return 'transition';
    if (step >= 13 && step <= 18) return 'strategic-selection';
    if (step === 20) return 'result';
    if (step === 21) return 'offer';
    return 'unknown';
  }

  private validateDataStructure(step: number, data: any): void {
    if (step === 1) {
      if (!data.userName || data.userName.length < 2) {
        throw new Error('Nome deve ter pelo menos 2 caracteres');
      }
    } else if (step >= 2 && step <= 11) {
      if (!Array.isArray(data.selectedOptions) || data.selectedOptions.length !== 3) {
        throw new Error('Selecione exatamente 3 opções');
      }
    } else if (step >= 13 && step <= 18) {
      if (!Array.isArray(data.selectedOptions) || data.selectedOptions.length !== 1) {
        throw new Error('Selecione uma opção');
      }
    }
  }

  private performStepValidation(step: number, data: any): { isValid: boolean; data: any; errors: string[] } {
    const errors: string[] = [];

    try {
      this.validateDataStructure(step, data);
      return { isValid: true, data, errors: [] };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Erro de validação');
      return { isValid: false, data, errors };
    }
  }

  private saveToLocalStorage(step: number, data: any): boolean {
    try {
      if (step === 1) {
        return unifiedQuizStorage.updateFormData('userName', data.userName);
      } else {
        return unifiedQuizStorage.updateSelections(`step-${step}`, data.selectedOptions);
      }
    } catch (error) {
      console.error('❌ Pipeline: Erro ao salvar localmente:', error);
      return false;
    }
  }

  private async saveToSupabase(step: number, data: any): Promise<void> {
    if (!this.context?.userId) {
      throw new Error('User ID não disponível para salvar no Supabase');
    }

    // Implementar salvamento no Supabase baseado no tipo de dados
    const payload = {
      user_id: this.context.userId,
      session_id: this.context.sessionId,
      step_number: step,
      step_data: data,
      created_at: new Date().toISOString(),
    };

    // Temporariamente comentado até implementar tabela quiz_responses
    // const { error } = await supabase
    //   .from('quiz_responses')
    //   .upsert(payload);

    // if (error) {
    //   throw new Error(`Erro do Supabase: ${error.message}`);
    // }

    console.log('💾 Dados salvos (simulado):', payload);
  }

  private calculateCategoryScores(selections: Record<string, string[]>): Record<string, number> {
    const scores: Record<string, number> = {};

    Object.entries(selections).forEach(([, options]) => {
      options.forEach(option => {
        // Assumindo formato "categoria_opcao" ou similar
        const [category] = option.split('_');
        if (category) {
          scores[category] = (scores[category] || 0) + 1;
        }
      });
    });

    return scores;
  }

  private getDominantStyle(scores: Record<string, number>): string {
    let maxScore = 0;
    let dominantStyle = 'natural';

    Object.entries(scores).forEach(([style, score]) => {
      if (score > maxScore) {
        maxScore = score;
        dominantStyle = style;
      }
    });

    return dominantStyle;
  }

  private generatePersonalizedInsights(
    dominantStyle: string,
    scores: Record<string, number>
  ): any {
    return {
      primaryStyle: dominantStyle,
      secondaryStyles: Object.entries(scores)
        .sort(([, a], [, b]) => b - a)
        .slice(1, 3)
        .map(([style]) => style),
      personalityTraits: this.getPersonalityTraits(dominantStyle),
      recommendations: this.getStyleRecommendations(dominantStyle),
      confidenceLevel: this.calculateConfidenceLevel(scores),
    };
  }

  private getPersonalityTraits(style: string): string[] {
    const traits: Record<string, string[]> = {
      natural: ['Autêntica', 'Espontânea', 'Confortável'],
      classico: ['Elegante', 'Sofisticada', 'Atemporal'],
      dramatico: ['Ousada', 'Impactante', 'Confiante'],
      romantico: ['Feminina', 'Delicada', 'Sonhadora'],
    };

    return traits[style] || ['Única', 'Especial', 'Autêntica'];
  }

  private getStyleRecommendations(style: string): string[] {
    const recommendations: Record<string, string[]> = {
      natural: ['Tecidos naturais', 'Cores terrosas', 'Silhuetas relaxadas'],
      classico: ['Peças atemporais', 'Cores neutras', 'Cortes estruturados'],
      dramatico: ['Contrastes marcantes', 'Peças statement', 'Silhuetas geométricas'],
      romantico: ['Tecidos fluidos', 'Detalhes delicados', 'Cores suaves'],
    };

    return recommendations[style] || ['Peças que refletem sua personalidade'];
  }

  private calculateConfidenceLevel(scores: Record<string, number>): number {
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const maxScore = Math.max(...Object.values(scores));

    return total > 0 ? Math.round((maxScore / total) * 100) : 0;
  }
}

// Singleton instance
export const quizDataPipeline = new QuizDataPipeline();
export default QuizDataPipeline;