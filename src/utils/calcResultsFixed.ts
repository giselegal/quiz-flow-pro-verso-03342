/**
 * 🎯 CALC RESULTS - Fixed version with proper TypeScript types
 */

import { QuizAnswer, StyleResult, QuizResult } from '@/types/quiz';
import { mapToStyleResult } from '@/utils/styleResultMapper';
import { AggregateResult, UserResponses, QuizEngineOptions } from '@/types/interfaces';

const DEFAULT_STYLES = [
  'natural', 'classico', 'contemporâneo', 'elegante', 
  'romântico', 'sexy', 'dramático', 'criativo'
];

export const ENGINE_VERSION = '2.0.0';

export class CalculationEngine {
  private version = ENGINE_VERSION;
  private debugMode = false;

  constructor(options: QuizEngineOptions = {}) {
    this.debugMode = options.debugMode || false;
  }

  /**
   * Calculate quiz results with proper type safety
   */
  calculateResults(
    userResponses: UserResponses,
    options: QuizEngineOptions = {}
  ): AggregateResult {
    try {
      // Initialize scores
      const scores: Record<string, number> = {};
      DEFAULT_STYLES.forEach(style => {
        scores[style] = 0;
      });

      // Process responses
      let validResponses = 0;
      const responses = userResponses.responses || [];

      responses.forEach(response => {
        if (this.isValidResponse(response)) {
          validResponses++;
          
          if (response.weight && typeof response.weight === 'object') {
            Object.entries(response.weight).forEach(([style, weight]) => {
              if (scores.hasOwnProperty(style) && typeof weight === 'number') {
                scores[style] += weight;
              }
            });
          } else {
            // Default scoring
            const randomStyle = DEFAULT_STYLES[Math.floor(Math.random() * DEFAULT_STYLES.length)];
            scores[randomStyle] += 1;
          }
        }
      });

      // Calculate total score
      const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

      // Create style results
      const styleResults = Object.entries(scores)
        .map(([style, score]) => mapToStyleResult({
          style,
          category: style,
          score,
          percentage: totalScore > 0 ? Math.round((score / totalScore) * 100) : 0,
          points: score,
          rank: 0
        }))
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .map((result, index) => ({ ...result, rank: index + 1 }));

      // Build final result
      const result: AggregateResult = {
        id: `result-${Date.now()}`,
        responses: {},
        score: totalScore,
        maxScore: 100,
        completedAt: new Date().toISOString(),
        primaryStyle: styleResults[0],
        secondaryStyles: styleResults.slice(1),
        totalQuestions: responses.length,
        engineVersion: this.version,
        schemaHash: this.generateSchemaHash(),
        calculatedAt: new Date(),
        breakdown: {
          totalResponses: responses.length,
          validResponses,
          styleDistribution: scores,
          confidenceScore: this.calculateConfidenceScore(styleResults)
        }
      };

      if (this.debugMode) {
        console.log('🎯 Calculation completed:', {
          totalScore,
          primaryStyle: result.primaryStyle?.name,
          validResponses
        });
      }

      return result;
    } catch (error) {
      console.error('❌ Calculation error:', error);
      return this.fallbackResult();
    }
  }

  private isValidResponse(response: any): boolean {
    return response && (response.weight || response.selectedOptions || response.value);
  }

  private calculateConfidenceScore(styleResults: StyleResult[]): number {
    if (styleResults.length === 0) return 0;
    const primary = styleResults[0];
    const secondary = styleResults[1];
    
    const primaryScore = primary?.percentage || 0;
    const secondaryScore = secondary?.percentage || 0;
    
    return Math.max(0, primaryScore - secondaryScore);
  }

  private generateSchemaHash(): string {
    return `schema-v${this.version}-${Date.now()}`;
  }

  private fallbackResult(): AggregateResult {
    const fallbackStyle = mapToStyleResult({
      category: 'natural',
      score: 50,
      percentage: 50,
      points: 50,
      rank: 1
    });

    return {
      id: `fallback-${Date.now()}`,
      responses: {},
      score: 50,
      maxScore: 100,
      completedAt: new Date().toISOString(),
      primaryStyle: fallbackStyle,
      secondaryStyles: [],
      totalQuestions: 1,
      engineVersion: this.version
    };
  }
}

// Factory function
export function createCalculationEngine(options: QuizEngineOptions = {}): CalculationEngine {
  return new CalculationEngine(options);
}

// Default export
export default CalculationEngine;