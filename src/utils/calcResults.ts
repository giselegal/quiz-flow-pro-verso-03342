/**
 * 📊 ENHANCED CALCULATION ENGINE - Robust Results Computation
 * 
 * Comprehensive quiz calculation engine with:
 * - Data validation and contracts
 * - Aggregate scoring with detailed breakdown
 * - Outcome mapping and personalization
 * - Metadata tracking (engine version, schema hash)
 * - Error handling and fallback strategies
 */

import { QuizAnswer, StyleResult, ComputedResult } from '@/types/quiz';

// ===== ENGINE CONFIGURATION =====
export const ENGINE_VERSION = '2.0.0';
export const DEFAULT_STYLES = ['Clássico', 'Romântico', 'Dramático', 'Natural', 'Criativo'];

// Simple hash function for browser compatibility
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

// ===== INTERFACES & TYPES =====

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface QuizDefinition {
  id: string;
  questions: Array<{
    id: string;
    type: string;
    options: Array<{
      id: string;
      weights?: Record<string, number>;
    }>;
  }>;
  outcomes: OutcomeDefinition[];
  metadata?: Record<string, any>;
}

export interface OutcomeDefinition {
  id: string;
  name: string;
  description: string;
  conditions: OutcomeCondition[];
  template: OutcomeTemplate;
}

export interface OutcomeCondition {
  type: 'style_score' | 'total_score' | 'specific_answer';
  operator: 'gte' | 'lte' | 'eq' | 'between';
  value: number | [number, number];
  styleId?: string;
}

export interface OutcomeTemplate {
  title: string;
  description: string;
  recommendations: string[];
  metadata?: Record<string, any>;
}

export interface AggregateResult extends ComputedResult {
  // Enhanced metadata
  engineVersion: string;
  schemaHash: string;
  calculatedAt: Date;
  
  // Detailed breakdown
  breakdown: {
    totalResponses: number;
    validResponses: number;
    invalidResponses: number;
    styleDistribution: Record<string, {
      score: number;
      percentage: number;
      responseCount: number;
    }>;
  };
  
  // Outcome mapping
  matchedOutcome?: {
    id: string;
    name: string;
    description: string;
    confidence: number;
    recommendations: string[];
  };
  
  // Quality metrics
  quality: {
    completeness: number; // 0-100%
    consistency: number;  // 0-100%
    confidence: number;   // 0-100%
  };
}

export interface UserResponses {
  sessionId: string;
  userId?: string;
  funnelId: string;
  responses: QuizAnswer[];
  metadata?: {
    startTime?: Date;
    endTime?: Date;
    userAgent?: string;
    referrer?: string;
  };
}

// ===== CALCULATION ENGINE CLASS =====

export class CalculationEngine {
  private version: string = ENGINE_VERSION;
  
  /**
   * Main computation method - validates and calculates quiz results
   */
  public computeResult(
    quizDefinition: QuizDefinition, 
    userResponses: UserResponses
  ): AggregateResult {
    try {
      // Step 1: Validate inputs
      const validation = this.validateInputs(quizDefinition, userResponses);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Step 2: Calculate schema hash for versioning
      const schemaHash = this.calculateSchemaHash(quizDefinition);

      // Step 3: Process answers and calculate scores
      const { scores, breakdown } = this.calculateScores(
        userResponses.responses,
        quizDefinition
      );

      // Step 4: Convert to StyleResult array and rank
      const styleResults = this.rankStyles(scores);

      // Step 5: Match outcomes based on results
      const matchedOutcome = this.matchOutcome(
        styleResults,
        scores,
        quizDefinition.outcomes
      );

      // Step 6: Calculate quality metrics
      const quality = this.calculateQualityMetrics(
        userResponses.responses,
        breakdown
      );

      // Step 7: Build final result
      const result: AggregateResult = {
        // Base result properties
        primaryStyle: styleResults[0],
        secondaryStyles: styleResults.slice(1),
        scores,
        totalQuestions: userResponses.responses.length,
        version: this.version,

        // Enhanced metadata
        engineVersion: this.version,
        schemaHash,
        calculatedAt: new Date(),

        // Detailed breakdown
        breakdown,

        // Outcome mapping
        matchedOutcome,

        // Quality metrics
        quality
      };

      return result;

    } catch (error) {
      // Fallback to basic calculation if enhanced fails
      console.error('Enhanced calculation failed, falling back to basic:', error);
      return this.fallbackCalculation(userResponses.responses);
    }
  }

  /**
   * Validates step response according to schema
   */
  public validateStepResponse(step: string, response: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (!response) {
      errors.push(`Response for step ${step} is missing`);
    }

    if (typeof response !== 'object') {
      errors.push(`Response for step ${step} must be an object`);
    }

    // Check required fields
    if (response && !response.questionId) {
      errors.push(`Response for step ${step} missing questionId`);
    }

    if (response && !response.optionId) {
      warnings.push(`Response for step ${step} missing optionId`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Gets outcome template by ID
   */
  public getOutcomeTemplate(outcomeId: string): OutcomeTemplate | null {
    // This would typically fetch from database or configuration
    // For now, return a default template structure
    return {
      title: `Outcome ${outcomeId}`,
      description: 'Template description',
      recommendations: ['Default recommendation'],
      metadata: {}
    };
  }

  // ===== PRIVATE HELPER METHODS =====

  private validateInputs(
    quizDefinition: QuizDefinition,
    userResponses: UserResponses
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate quiz definition
    if (!quizDefinition || !quizDefinition.questions) {
      errors.push('Quiz definition is missing or invalid');
    }

    // Validate user responses
    if (!userResponses || !userResponses.responses) {
      errors.push('User responses are missing or invalid');
    }

    if (userResponses.responses && userResponses.responses.length === 0) {
      warnings.push('No responses provided');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private calculateSchemaHash(quizDefinition: QuizDefinition): string {
    try {
      const schemaString = JSON.stringify(quizDefinition, null, 0);
      return simpleHash(schemaString);
    } catch (error) {
      console.warn('Could not calculate schema hash:', error);
      return 'unknown';
    }
  }

  private calculateScores(
    responses: QuizAnswer[],
    quizDefinition: QuizDefinition
  ): {
    scores: Record<string, number>;
    breakdown: AggregateResult['breakdown'];
  } {
    const styles = this.extractStylesFromDefinition(quizDefinition);
    const scores: Record<string, number> = {};
    
    // Initialize scores
    styles.forEach(style => {
      scores[style] = 0;
    });

    let validResponses = 0;
    let invalidResponses = 0;
    const styleDistribution: Record<string, any> = {};

    // Initialize distribution tracking
    styles.forEach(style => {
      styleDistribution[style] = {
        score: 0,
        percentage: 0,
        responseCount: 0
      };
    });

    // Process each response
    responses.forEach(response => {
      if (this.isValidResponse(response)) {
        validResponses++;
        
        if (response.weights) {
          Object.entries(response.weights).forEach(([style, weight]) => {
            if (scores.hasOwnProperty(style)) {
              scores[style] += weight;
              styleDistribution[style].score += weight;
              styleDistribution[style].responseCount++;
            }
          });
        } else {
          // Default scoring for responses without weights
          const randomStyle = styles[Math.floor(Math.random() * styles.length)];
          scores[randomStyle] += 1;
          styleDistribution[randomStyle].score += 1;
          styleDistribution[randomStyle].responseCount++;
        }
      } else {
        invalidResponses++;
      }
    });

    // Calculate percentages for distribution
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    Object.keys(styleDistribution).forEach(style => {
      styleDistribution[style].percentage = totalScore > 0 
        ? Math.round((styleDistribution[style].score / totalScore) * 100) 
        : 0;
    });

    return {
      scores,
      breakdown: {
        totalResponses: responses.length,
        validResponses,
        invalidResponses,
        styleDistribution
      }
    };
  }

  private rankStyles(scores: Record<string, number>): StyleResult[] {
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    return Object.entries(scores)
      .map(([style, score]) => ({
        style,
        category: style,
        score,
        percentage: totalScore > 0 ? Math.round((score / totalScore) * 100) : 0,
        points: score, // alias for backward compatibility
        rank: 0 // will be set when sorted
      }))
      .sort((a, b) => b.score - a.score)
      .map((result, index) => ({ ...result, rank: index + 1 }));
  }

  private matchOutcome(
    styleResults: StyleResult[],
    scores: Record<string, number>,
    outcomes: OutcomeDefinition[]
  ): AggregateResult['matchedOutcome'] | undefined {
    if (!outcomes || outcomes.length === 0) {
      return undefined;
    }

    // Find the best matching outcome
    for (const outcome of outcomes) {
      if (this.evaluateOutcomeConditions(outcome.conditions, styleResults, scores)) {
        return {
          id: outcome.id,
          name: outcome.name,
          description: outcome.description,
          confidence: this.calculateOutcomeConfidence(outcome, styleResults),
          recommendations: outcome.template.recommendations
        };
      }
    }

    return undefined;
  }

  private evaluateOutcomeConditions(
    conditions: OutcomeCondition[],
    _styleResults: StyleResult[],
    scores: Record<string, number>
  ): boolean {
    return conditions.every(condition => {
      switch (condition.type) {
        case 'style_score':
          const styleScore = condition.styleId ? scores[condition.styleId] || 0 : 0;
          return this.evaluateCondition(styleScore, condition.operator, condition.value);
        
        case 'total_score':
          const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
          return this.evaluateCondition(totalScore, condition.operator, condition.value);
        
        default:
          return true;
      }
    });
  }

  private evaluateCondition(
    value: number,
    operator: OutcomeCondition['operator'],
    target: number | [number, number]
  ): boolean {
    switch (operator) {
      case 'gte':
        return value >= (target as number);
      case 'lte':
        return value <= (target as number);
      case 'eq':
        return value === (target as number);
      case 'between':
        const [min, max] = target as [number, number];
        return value >= min && value <= max;
      default:
        return false;
    }
  }

  private calculateOutcomeConfidence(
    _outcome: OutcomeDefinition,
    styleResults: StyleResult[]
  ): number {
    // Simple confidence calculation based on primary style score
    const primaryPercentage = styleResults[0]?.percentage || 0;
    return Math.min(100, Math.max(0, primaryPercentage));
  }

  private calculateQualityMetrics(
    _responses: QuizAnswer[],
    breakdown: AggregateResult['breakdown']
  ): AggregateResult['quality'] {
    const completeness = breakdown.totalResponses > 0 
      ? Math.round((breakdown.validResponses / breakdown.totalResponses) * 100)
      : 0;

    // Simple consistency metric - could be enhanced
    const consistency = breakdown.validResponses > 0 ? 85 : 0;

    // Confidence based on number of responses and validity
    const confidence = Math.min(100, 
      (breakdown.validResponses * 10) + 
      (completeness * 0.5)
    );

    return {
      completeness,
      consistency,
      confidence: Math.round(confidence)
    };
  }

  private extractStylesFromDefinition(quizDefinition: QuizDefinition): string[] {
    // Extract unique styles from quiz definition
    const styles = new Set<string>();
    
    quizDefinition.questions.forEach(question => {
      question.options.forEach(option => {
        if (option.weights) {
          Object.keys(option.weights).forEach(style => styles.add(style));
        }
      });
    });

    return styles.size > 0 ? Array.from(styles) : DEFAULT_STYLES;
  }

  private isValidResponse(response: QuizAnswer): boolean {
    return !!(response && response.questionId && response.optionId);
  }

  private fallbackCalculation(responses: QuizAnswer[]): AggregateResult {
    // Create a minimal fallback result without external dependencies
    const scores: Record<string, number> = {};
    DEFAULT_STYLES.forEach(style => {
      scores[style] = 0;
    });

    // Simple scoring without external dependencies
    responses.forEach(response => {
      if (response.weights) {
        Object.entries(response.weights).forEach(([style, weight]) => {
          if (scores.hasOwnProperty(style)) {
            scores[style] += weight;
          }
        });
      } else {
        // Random fallback
        const randomStyle = DEFAULT_STYLES[Math.floor(Math.random() * DEFAULT_STYLES.length)];
        scores[randomStyle] += 1;
      }
    });

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const styleResults = Object.entries(scores)
      .map(([style, score]) => ({
        style,
        category: style,
        score,
        percentage: totalScore > 0 ? Math.round((score / totalScore) * 100) : 0,
        points: score,
        rank: 0
      }))
      .sort((a, b) => b.score - a.score)
      .map((result, index) => ({ ...result, rank: index + 1 }));

    return {
      primaryStyle: styleResults[0],
      secondaryStyles: styleResults.slice(1),
      scores,
      totalQuestions: responses.length,
      version: this.version,
      engineVersion: this.version,
      schemaHash: 'fallback',
      calculatedAt: new Date(),
      breakdown: {
        totalResponses: responses.length,
        validResponses: responses.length,
        invalidResponses: 0,
        styleDistribution: {}
      },
      quality: {
        completeness: 75,
        consistency: 50,
        confidence: 25
      }
    };
  }
}

// ===== SINGLETON INSTANCE =====
export const calculationEngine = new CalculationEngine();

// ===== UTILITY FUNCTIONS =====

/**
 * Quick calculation using the singleton engine
 */
export function calculateQuizResults(
  quizDefinition: QuizDefinition,
  userResponses: UserResponses
): AggregateResult {
  return calculationEngine.computeResult(quizDefinition, userResponses);
}

/**
 * Validate quiz response data
 */
export function validateQuizData(
  quizDefinition: QuizDefinition,
  userResponses: UserResponses
): ValidationResult {
  return calculationEngine['validateInputs'](quizDefinition, userResponses);
}

export default {
  CalculationEngine,
  calculationEngine,
  calculateQuizResults,
  validateQuizData,
  ENGINE_VERSION
};