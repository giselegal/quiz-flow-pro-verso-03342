/**
 * 🎯 INTERFACES - Additional type definitions for missing interfaces
 */

import { StyleResult, QuizResult } from './quiz';

export interface AggregateResult {
  id: string;
  responses: Record<string, any>;
  score: number;
  maxScore: number;
  completedAt: string;
  primaryStyle?: StyleResult;
  secondaryStyles?: StyleResult[];
  totalQuestions?: number;
  engineVersion?: string;
  schemaHash?: string;
  calculatedAt?: Date;
  breakdown?: any;
  matchedOutcome?: any;
  quality?: any;
}

export interface QuizEngineOptions {
  includeUserData?: boolean;
  userName?: string;
  debugMode?: boolean;
  version?: string;
}

export interface StyleScoreData {
  style: string;
  category: string;
  score: number;
  percentage: number;
  points: number;
  rank: number;
}

export interface UserResponses {
  responses: any[];
  metadata?: any;
}

export interface CalculationBreakdown {
  totalResponses: number;
  validResponses: number;
  styleDistribution: any;
  confidenceScore: number;
}