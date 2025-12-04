import { appLogger } from '@/lib/utils/appLogger';
/**
 * 🧮 FLEXIBLE RESULT CALCULATOR
 * 
 * Sistema de cálculo de resultados para funis com 1-30 etapas
 * Suporta múltiplas estratégias de pontuação e classificação
 */

export interface Category {
  id: string;
  name: string;
  weight: number;
  scoreField: string;
}

export interface Classification {
  id: string;
  name: string;
  condition: {
    type: 'score_range' | 'percentage' | 'custom_formula' | 'category_dominant';
    min?: number;
    max?: number;
    formula?: string;
    categoryId?: string;
  };
  description?: string;
  metadata?: Record<string, any>;
}

export interface ScoringConfig {
  enabled: boolean;
  method: 'simple' | 'weighted' | 'custom';
  categories?: Category[];
  classifications: Classification[];
  customFormulas?: Record<string, string>;
}

export interface QuizAnswers {
  [stepId: string]: {
    [blockId: string]: any;
  };
}

export interface CalculationResult {
  finalScore: number;
  maxScore: number;
  percentage: number;
  classification: Classification | null;
  categoryScores: Record<string, {
    score: number;
    maxScore: number;
    percentage: number;
  }>;
  metadata: {
    method: string;
    totalAnswers: number;
    calculatedAt: string;
  };
}

/**
 * Calculadora flexível de resultados
 */
export class FlexibleResultCalculator {
  private config: ScoringConfig;
  
  constructor(config: ScoringConfig) {
    this.config = config;
  }
  
  /**
   * Calcula o resultado final baseado nas respostas
   */
  calculate(answers: QuizAnswers, stages: any[]): CalculationResult {
    if (!this.config.enabled) {
      return this.createEmptyResult();
    }
    
    switch (this.config.method) {
      case 'simple':
        return this.calculateSimple(answers, stages);
      case 'weighted':
        return this.calculateWeighted(answers, stages);
      case 'custom':
        return this.calculateCustom(answers, stages);
      default:
        return this.createEmptyResult();
    }
  }
  
  /**
   * Pontuação simples - soma todos os pontos
   */
  private calculateSimple(answers: QuizAnswers, stages: any[]): CalculationResult {
    let totalScore = 0;
    let maxScore = 0;
    let answerCount = 0;
    
    // Percorrer todos os stages e somar pontos
    stages.forEach(stage => {
      const stageAnswers = answers[stage.id] || {};
      
      stage.blocks?.forEach((block: any) => {
        const answer = stageAnswers[block.id];
        
        if (answer !== undefined && answer !== null) {
          answerCount++;
          
          // Extrair pontuação do bloco ou resposta
          const score = this.extractScore(block, answer);
          const max = this.extractMaxScore(block);
          
          totalScore += score;
          maxScore += max;
        }
      });
    });
    
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const classification = this.findClassification(percentage, totalScore);
    
    return {
      finalScore: totalScore,
      maxScore,
      percentage,
      classification,
      categoryScores: {},
      metadata: {
        method: 'simple',
        totalAnswers: answerCount,
        calculatedAt: new Date().toISOString()
      }
    };
  }
  
  /**
   * Pontuação ponderada por categorias
   */
  private calculateWeighted(answers: QuizAnswers, stages: any[]): CalculationResult {
    const categories = this.config.categories || [];
    const categoryScores: Record<string, { score: number; maxScore: number; percentage: number }> = {};
    
    let totalScore = 0;
    let totalWeight = 0;
    let answerCount = 0;
    
    // Calcular pontuação por categoria
    categories.forEach(category => {
      let categoryTotal = 0;
      let categoryMax = 0;
      
      stages.forEach(stage => {
        const stageAnswers = answers[stage.id] || {};
        
        stage.blocks?.forEach((block: any) => {
          // Verificar se o bloco pertence a esta categoria
          if (block.category === category.id || block.metadata?.category === category.id) {
            const answer = stageAnswers[block.id];
            
            if (answer !== undefined && answer !== null) {
              answerCount++;
              const score = this.extractScore(block, answer);
              const max = this.extractMaxScore(block);
              
              categoryTotal += score;
              categoryMax += max;
            }
          }
        });
      });
      
      const categoryPercentage = categoryMax > 0 ? (categoryTotal / categoryMax) * 100 : 0;
      
      categoryScores[category.id] = {
        score: categoryTotal,
        maxScore: categoryMax,
        percentage: categoryPercentage
      };
      
      // Aplicar peso da categoria
      totalScore += categoryTotal * category.weight;
      totalWeight += categoryMax * category.weight;
    });
    
    const percentage = totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
    const classification = this.findClassification(percentage, totalScore, categoryScores);
    
    return {
      finalScore: totalScore,
      maxScore: totalWeight,
      percentage,
      classification,
      categoryScores,
      metadata: {
        method: 'weighted',
        totalAnswers: answerCount,
        calculatedAt: new Date().toISOString()
      }
    };
  }
  
  /**
   * Pontuação com fórmulas customizadas
   */
  private calculateCustom(answers: QuizAnswers, stages: any[]): CalculationResult {
    // Primeiro calcular pontuação simples como base
    const baseResult = this.calculateSimple(answers, stages);
    
    // Aplicar fórmulas customizadas se definidas
    const formulas = this.config.customFormulas || {};
    
    if (formulas.finalScore) {
      try {
        // Criar contexto para avaliação da fórmula
        const context = {
          totalScore: baseResult.finalScore,
          maxScore: baseResult.maxScore,
          percentage: baseResult.percentage,
          stageCount: stages.length
        };
        
        // Avaliar fórmula (simplificado - em produção usar biblioteca como mathjs)
        const finalScore = this.evaluateFormula(formulas.finalScore, context);
        
        return {
          ...baseResult,
          finalScore,
          percentage: baseResult.maxScore > 0 ? (finalScore / baseResult.maxScore) * 100 : 0,
          metadata: {
            method: 'custom',
            totalAnswers: baseResult.metadata.totalAnswers,
            calculatedAt: new Date().toISOString()
          }
        };
      } catch (error) {
        appLogger.error('Erro ao avaliar fórmula customizada:', { data: [error] });
        return baseResult;
      }
    }
    
    return baseResult;
  }
  
  /**
   * Extrai pontuação de um bloco/resposta
   */
  private extractScore(block: any, answer: any): number {
    // Tentar extrair de diferentes locais
    if (typeof answer === 'number') return answer;
    if (answer?.score !== undefined) return Number(answer.score);
    if (answer?.value !== undefined && typeof answer.value === 'number') return answer.value;
    if (block.score !== undefined) return Number(block.score);
    if (block.properties?.score !== undefined) return Number(block.properties?.score);
    if (block.metadata?.score !== undefined) return Number(block.metadata.score);
    
    return 0;
  }
  
  /**
   * Extrai pontuação máxima de um bloco
   */
  private extractMaxScore(block: any): number {
    if (block.maxScore !== undefined) return Number(block.maxScore);
    if (block.properties?.maxScore !== undefined) return Number(block.properties?.maxScore);
    if (block.metadata?.maxScore !== undefined) return Number(block.metadata.maxScore);
    
    // Default: se tem opções, max é o número de opções
    if (block.options?.length) return block.options.length;
    
    // Default: 1 ponto por resposta
    return 1;
  }
  
  /**
   * Encontra classificação baseada na pontuação
   */
  private findClassification(
    percentage: number, 
    score: number,
    categoryScores?: Record<string, any>
  ): Classification | null {
    for (const classification of this.config.classifications) {
      if (this.matchesCondition(classification.condition, percentage, score, categoryScores)) {
        return classification;
      }
    }
    
    return null;
  }
  
  /**
   * Verifica se a condição é satisfeita
   */
  private matchesCondition(
    condition: Classification['condition'],
    percentage: number,
    score: number,
    categoryScores?: Record<string, any>
  ): boolean {
    switch (condition.type) {
      case 'score_range':
        const min = condition.min ?? -Infinity;
        const max = condition.max ?? Infinity;
        return percentage >= min && percentage <= max;
        
      case 'percentage':
        const pMin = condition.min ?? -Infinity;
        const pMax = condition.max ?? Infinity;
        return percentage >= pMin && percentage <= pMax;
        
      case 'category_dominant':
        if (!categoryScores || !condition.categoryId) return false;
        const targetCategory = categoryScores[condition.categoryId];
        if (!targetCategory) return false;
        
        // Verifica se esta categoria tem a maior pontuação
        const isDominant = Object.values(categoryScores).every(
          (cat: any) => targetCategory.percentage >= cat.percentage
        );
        return isDominant;
        
      case 'custom_formula':
        if (!condition.formula) return false;
        try {
          const context = { percentage, score, categoryScores };
          return this.evaluateFormula(condition.formula, context) === true;
        } catch {
          return false;
        }
        
      default:
        return false;
    }
  }
  
  /**
   * Avalia uma fórmula usando avaliador seguro (sem eval)
   * @security Replaced eval() with safe expression evaluator to prevent code injection
   */
  private evaluateFormula(formula: string, context: Record<string, any>): any {
    try {
      // Import safe evaluator dynamically to avoid circular dependencies
      const { safeEvaluate, isExpressionSafe } = require('@/lib/utils/security/safeExpressionEvaluator');
      
      // Validate expression safety first
      if (!isExpressionSafe(formula)) {
        appLogger.warn('Unsafe expression blocked:', { formula });
        return 0;
      }
      
      return safeEvaluate(formula, context);
    } catch (error) {
      appLogger.error('Erro ao avaliar fórmula:', { data: [error] });
      return 0;
    }
  }
  
  /**
   * Cria resultado vazio
   */
  private createEmptyResult(): CalculationResult {
    return {
      finalScore: 0,
      maxScore: 0,
      percentage: 0,
      classification: null,
      categoryScores: {},
      metadata: {
        method: 'none',
        totalAnswers: 0,
        calculatedAt: new Date().toISOString()
      }
    };
  }
}

/**
 * Helper para criar calculadora a partir de um template
 */
export function createCalculatorFromTemplate(template: any): FlexibleResultCalculator {
  const scoring: ScoringConfig = template.scoring || {
    enabled: false,
    method: 'simple',
    classifications: []
  };
  
  return new FlexibleResultCalculator(scoring);
}
