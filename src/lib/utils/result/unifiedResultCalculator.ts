/**
 * 🧮 UNIFIED RESULT CALCULATOR
 * 
 * Integra com a lógica existente de computeResult e ResultEngine
 * Mantém compatibilidade total com o sistema atual
 * 
 * LÓGICA EXISTENTE PRESERVADA:
 * - Usa styleMapping e STYLE_DEFINITIONS
 * - Suporta pesos por questão (metadata.scoring.weight)
 * - Desempate por ordem de clique
 * - Prefixos de opções (natural_, classico_, etc)
 * - Sistema de categorias de estilos
 */

import { computeResult, ComputeResultInput, ComputeResultOutputBasic } from './computeResult';
import { ResultEngine, RawScores, QuizResultPayload } from '@/services/core/ResultEngine';
import { STYLE_DEFINITIONS } from '@/services/data/styles';
import { styleMapping } from '@/services/data/styles';
import type { QuizStepV3 as QuizStep } from '@/types/quiz';

export interface UnifiedCalculationOptions {
  /** Respostas do quiz no formato atual */
  answers: Record<string, string[]>;
  
  /** Steps do template (opcional, usa TemplateService se não fornecido) */
  steps?: Record<string, QuizStep>;
  
  /** Configuração de scoring (opcional) */
  scoring?: any;
  
  /** Método de cálculo: 'prefix' (padrão atual) ou 'weighted' */
  method?: 'prefix' | 'weighted' | 'simple';
  
  /** Nome do usuário (opcional) */
  userName?: string;
}

export interface UnifiedCalculationResult {
  /** Compatível com computeResult */
  primaryStyleId: string;
  secondaryStyleIds: string[];
  scores: Record<string, number>;
  orderedStyleIds: string[];
  percentages: Record<string, number>;
  totalAnswers: number;
  
  /** Compatível com ResultEngine */
  payload: QuizResultPayload;
  
  /** Informações adicionais */
  metadata: {
    method: string;
    calculatedAt: string;
    totalQuestions: number;
    styleDetails: Array<{
      id: string;
      name: string;
      score: number;
      percentage: number;
      characteristics: string[];
      description: string;
    }>;
  };
}

/**
 * Calculadora unificada que usa a lógica existente
 */
export class UnifiedResultCalculator {
  
  /**
   * Calcula resultado usando a lógica atual do sistema
   */
  static calculate(options: UnifiedCalculationOptions): UnifiedCalculationResult {
    const { answers, steps, scoring, method = 'prefix', userName } = options;
    
    // Usar método baseado em prefixos (lógica atual)
    if (method === 'prefix') {
      return this.calculateWithPrefix(answers, steps, scoring, userName);
    }
    
    // Usar método ponderado (lógica atual com pesos)
    if (method === 'weighted') {
      return this.calculateWithWeights(answers, steps, scoring, userName);
    }
    
    // Usar método simples (sem pesos nem prefixos)
    return this.calculateSimple(answers, steps, scoring, userName);
  }
  
  /**
   * Cálculo usando prefixos (lógica atual do ResultEngine)
   */
  private static calculateWithPrefix(
    answers: Record<string, string[]>,
    steps?: Record<string, QuizStep>,
    scoring?: any,
    userName?: string
  ): UnifiedCalculationResult {
    // Usar ResultEngine (lógica atual) para calcular scores
    const { scores: rawScores, total } = ResultEngine.computeScoresFromSelections(
      answers,
      { weightQuestions: scoring?.weightQuestions }
    );
    
    // Gerar payload compatível
    const payload = ResultEngine.toPayload(rawScores, total, userName);
    
    // Extrair informações para formato unificado
    const orderedStyles = [
      payload.primaryStyle,
      ...payload.secondaryStyles
    ];
    
    const primaryStyleId = this.normalizeStyleId(payload.primaryStyle.style);
    const secondaryStyleIds = payload.secondaryStyles
      .slice(0, 2)
      .map(s => this.normalizeStyleId(s.style));
    
    // Converter para formato de percentagens
    const percentages: Record<string, number> = {};
    Object.entries(rawScores).forEach(([style, score]) => {
      const styleId = this.normalizeStyleId(style);
      percentages[styleId] = Math.round((score / (total || 1)) * 100);
    });
    
    // Scores normalizados por ID
    const scoresById: Record<string, number> = {};
    Object.entries(rawScores).forEach(([style, score]) => {
      const styleId = this.normalizeStyleId(style);
      scoresById[styleId] = score;
    });
    
    // Adicionar detalhes dos estilos
    const styleDetails = orderedStyles.map(style => {
      const styleId = this.normalizeStyleId(style.style);
      const styleDef = STYLE_DEFINITIONS[styleId] || STYLE_DEFINITIONS[style.style.toLowerCase()];
      
      return {
        id: styleId,
        name: style.style,
        score: style.score,
        percentage: style.percentage,
        characteristics: styleDef?.characteristics || [],
        description: styleDef?.description || ''
      };
    });
    
    return {
      primaryStyleId,
      secondaryStyleIds,
      scores: scoresById,
      orderedStyleIds: orderedStyles.map(s => this.normalizeStyleId(s.style)),
      percentages,
      totalAnswers: total,
      payload,
      metadata: {
        method: 'prefix',
        calculatedAt: new Date().toISOString(),
        totalQuestions: Object.keys(answers).length,
        styleDetails
      }
    };
  }
  
  /**
   * Cálculo usando pesos (lógica atual do computeResult)
   */
  private static calculateWithWeights(
    answers: Record<string, string[]>,
    steps?: Record<string, QuizStep>,
    scoring?: any,
    userName?: string
  ): UnifiedCalculationResult {
    // Usar computeResult (lógica atual com pesos)
    const result = computeResult({ answers, steps, scoring });
    
    // Converter para RawScores para gerar payload
    const rawScores: RawScores = {};
    Object.entries(result.scores).forEach(([styleId, score]) => {
      const styleDef = STYLE_DEFINITIONS[styleId];
      const styleName = styleDef?.name || styleId;
      rawScores[styleName] = score;
    });
    
    const total = Object.values(result.scores).reduce((a, b) => a + b, 0) || 1;
    const payload = ResultEngine.toPayload(rawScores, total, userName);
    
    // Adicionar detalhes dos estilos
    const styleDetails = result.orderedStyleIds.map(styleId => {
      const styleDef = STYLE_DEFINITIONS[styleId];
      
      return {
        id: styleId,
        name: styleDef?.name || styleId,
        score: result.scores[styleId] || 0,
        percentage: result.percentages[styleId] || 0,
        characteristics: styleDef?.characteristics || [],
        description: styleDef?.description || ''
      };
    });
    
    return {
      ...result,
      payload,
      metadata: {
        method: 'weighted',
        calculatedAt: new Date().toISOString(),
        totalQuestions: Object.keys(answers).length,
        styleDetails
      }
    };
  }
  
  /**
   * Cálculo simples (fallback)
   */
  private static calculateSimple(
    answers: Record<string, string[]>,
    steps?: Record<string, QuizStep>,
    scoring?: any,
    userName?: string
  ): UnifiedCalculationResult {
    // Usar computeResult sem pesos
    const result = computeResult({ answers, steps });
    
    // Converter para RawScores
    const rawScores: RawScores = {};
    Object.entries(result.scores).forEach(([styleId, score]) => {
      const styleDef = STYLE_DEFINITIONS[styleId];
      const styleName = styleDef?.name || styleId;
      rawScores[styleName] = score;
    });
    
    const total = Object.values(result.scores).reduce((a, b) => a + b, 0) || 1;
    const payload = ResultEngine.toPayload(rawScores, total, userName);
    
    // Adicionar detalhes
    const styleDetails = result.orderedStyleIds.map(styleId => {
      const styleDef = STYLE_DEFINITIONS[styleId];
      
      return {
        id: styleId,
        name: styleDef?.name || styleId,
        score: result.scores[styleId] || 0,
        percentage: result.percentages[styleId] || 0,
        characteristics: styleDef?.characteristics || [],
        description: styleDef?.description || ''
      };
    });
    
    return {
      ...result,
      payload,
      metadata: {
        method: 'simple',
        calculatedAt: new Date().toISOString(),
        totalQuestions: Object.keys(answers).length,
        styleDetails
      }
    };
  }
  
  /**
   * Normaliza ID de estilo (remove acentos, lowercase)
   */
  private static normalizeStyleId(styleName: string): string {
    return styleName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
  
  /**
   * Helper: Detectar método automaticamente baseado na estrutura do quiz
   */
  static detectMethod(answers: Record<string, string[]>, steps?: Record<string, QuizStep>): 'prefix' | 'weighted' | 'simple' {
    // Se há prefixos nas opções (natural_, classico_, etc), usar prefix
    const hasPrefix = Object.values(answers).some(selections =>
      selections.some(opt => opt.includes('_'))
    );
    
    if (hasPrefix) {
      return 'prefix';
    }
    
    // Se há pesos configurados nos steps, usar weighted
    const hasWeights = steps && Object.values(steps).some(
      (step: any) => step?.metadata?.scoring?.weight
    );
    
    if (hasWeights) {
      return 'weighted';
    }
    
    // Fallback para simple
    return 'simple';
  }
}

/**
 * Helper function para uso rápido com auto-detecção
 */
export function calculateQuizResult(
  answers: Record<string, string[]>,
  steps?: Record<string, QuizStep>,
  scoring?: any,
  userName?: string
): UnifiedCalculationResult {
  const method = UnifiedResultCalculator.detectMethod(answers, steps);
  
  return UnifiedResultCalculator.calculate({
    answers,
    steps,
    scoring,
    method,
    userName
  });
}

/**
 * Helper para compatibilidade com código existente
 */
export function calculateResultLegacy(
  answers: Record<string, string[]>,
  steps?: Record<string, QuizStep>
): ComputeResultOutputBasic {
  return computeResult({ answers, steps });
}
