/**
 * 🎯 ADAPTADOR UNIFICADO DE RESULTADOS - FASE 3
 * 
 * Cria padrão de adaptador para converter entre diferentes
 * formatos de dados de resultado, resolvendo incompatibilidades.
 */

// Definições de tipos para os diferentes formatos
export interface CategoryScore {
  category: string;
  score: number;
  count: number;
}

export interface StyleProfile {
  primaryStyle: string;
  primaryStyleConfig: any;
  secondaryStyle?: string;
  secondaryStyleConfig?: any;
  colorPalette: string[];
  bodyType: string;
  lifestyle: string;
  occasionPriorities: string[];
  confidence: number;
  styleScores: Record<string, number>;
}

export interface QuizResultPayload {
  version: string;
  primaryStyle: {
    style: string;
    category: string;
    score: number;
    percentage: number;
    rank: number;
  };
  secondaryStyles: Array<{
    style: string;
    category: string;
    score: number;
    percentage: number;
    rank: number;
  }>;
  scores: Record<string, number>;
  totalQuestions: number;
  userData: { name: string };
}

export interface AggregateResult {
  primaryStyle: any;
  secondaryStyles: any[];
  scores: Record<string, number>;
  totalQuestions: number;
  version: string;
  engineVersion: string;
  schemaHash: string;
  calculatedAt: Date;
  breakdown: any;
  quality: any;
}

// Interface unificada para todos os formatos
export interface UnifiedResult {
  primaryStyle: string;
  confidence: number;
  percentage: number;
  secondaryStyles: string[];
  allScores: Record<string, number>;
  metadata: {
    source: 'useQuizResults' | 'quizResultsService' | 'ResultEngine' | 'calcResults';
    version: string;
    timestamp: string;
    userName?: string;
  };
}

/**
 * Adaptador principal que converte entre diferentes formatos
 */
export class ResultFormatAdapter {
  /**
   * Converte CategoryScore[] (useQuizResults) para formato unificado
   */
  fromCategoryScores(scores: CategoryScore[], userName?: string): UnifiedResult {
    if (!scores || scores.length === 0) {
      return this.createFallbackResult('useQuizResults', userName);
    }

    // Ordenar por score para encontrar primário
    const sortedScores = [...scores].sort((a, b) => b.score - a.score);
    const primaryScore = sortedScores[0];
    const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
    
    const allScores: Record<string, number> = {};
    scores.forEach(score => {
      allScores[score.category] = score.score;
    });

    return {
      primaryStyle: primaryScore.category,
      confidence: totalScore > 0 ? primaryScore.score / totalScore : 0,
      percentage: Math.round((totalScore > 0 ? primaryScore.score / totalScore : 0) * 100),
      secondaryStyles: sortedScores.slice(1, 3).map(s => s.category),
      allScores,
      metadata: {
        source: 'useQuizResults',
        version: '1.0',
        timestamp: new Date().toISOString(),
        userName
      }
    };
  }

  /**
   * Converte StyleProfile (quizResultsService) para formato unificado
   */
  fromStyleProfile(profile: StyleProfile, userName?: string): UnifiedResult {
    if (!profile) {
      return this.createFallbackResult('quizResultsService', userName);
    }

    const secondaryStyles = profile.secondaryStyle ? [profile.secondaryStyle] : [];

    return {
      primaryStyle: profile.primaryStyle,
      confidence: profile.confidence,
      percentage: Math.round(profile.confidence * 100),
      secondaryStyles,
      allScores: profile.styleScores || {},
      metadata: {
        source: 'quizResultsService',
        version: '3.0',
        timestamp: new Date().toISOString(),
        userName
      }
    };
  }

  /**
   * Converte QuizResultPayload (ResultEngine) para formato unificado
   */
  fromQuizResultPayload(payload: QuizResultPayload): UnifiedResult {
    if (!payload) {
      return this.createFallbackResult('ResultEngine');
    }

    const userName = payload.userData?.name;
    const secondaryStyles = payload.secondaryStyles?.map(s => s.style) || [];

    return {
      primaryStyle: payload.primaryStyle?.style || 'Unknown',
      confidence: payload.primaryStyle?.percentage ? payload.primaryStyle.percentage / 100 : 0,
      percentage: payload.primaryStyle?.percentage || 0,
      secondaryStyles,
      allScores: payload.scores || {},
      metadata: {
        source: 'ResultEngine',
        version: payload.version || '1.0',
        timestamp: new Date().toISOString(),
        userName
      }
    };
  }

  /**
   * Converte AggregateResult (calcResults) para formato unificado
   */
  fromAggregateResult(result: AggregateResult): UnifiedResult {
    if (!result) {
      return this.createFallbackResult('calcResults');
    }

    const primaryStyle = result.primaryStyle?.style || result.primaryStyle?.category || 'Unknown';
    const confidence = result.quality?.confidence ? result.quality.confidence / 100 : 0;

    return {
      primaryStyle,
      confidence,
      percentage: result.quality?.confidence || 0,
      secondaryStyles: result.secondaryStyles?.map(s => s.style || s.category)?.slice(0, 2) || [],
      allScores: result.scores || {},
      metadata: {
        source: 'calcResults',
        version: result.version || result.engineVersion || '2.0',
        timestamp: result.calculatedAt?.toISOString() || new Date().toISOString()
      }
    };
  }

  /**
   * Converte formato unificado para CategoryScore[] (useQuizResults)
   */
  toCategoryScores(unified: UnifiedResult): CategoryScore[] {
    const scores: CategoryScore[] = [];
    
    Object.entries(unified.allScores).forEach(([category, score]) => {
      scores.push({
        category,
        score,
        count: 1 // Aproximação, pois não temos dados originais
      });
    });

    return scores.sort((a, b) => b.score - a.score);
  }

  /**
   * Converte formato unificado para StyleProfile (quizResultsService)
   */
  toStyleProfile(unified: UnifiedResult): StyleProfile {
    const secondaryStyles = unified.secondaryStyles || [];
    
    return {
      primaryStyle: unified.primaryStyle,
      primaryStyleConfig: {}, // Precisaria ser preenchido com dados reais
      secondaryStyle: secondaryStyles[0],
      secondaryStyleConfig: secondaryStyles[0] ? {} : undefined,
      colorPalette: [], // Seria extraído dos dados reais
      bodyType: 'universal',
      lifestyle: 'equilibrado',
      occasionPriorities: ['trabalho', 'casual', 'social'],
      confidence: unified.confidence,
      styleScores: unified.allScores
    };
  }

  /**
   * Converte formato unificado para QuizResultPayload (ResultEngine)
   */
  toQuizResultPayload(unified: UnifiedResult): QuizResultPayload {
    const secondaryStyles = unified.secondaryStyles.slice(0, 2).map((style, index) => ({
      style,
      category: style,
      score: unified.allScores[style] || 0,
      percentage: Math.round((unified.allScores[style] || 0) / Math.max(1, Object.values(unified.allScores).reduce((a, b) => a + b, 0)) * 100),
      rank: index + 2
    }));

    return {
      version: unified.metadata.version,
      primaryStyle: {
        style: unified.primaryStyle,
        category: unified.primaryStyle,
        score: unified.allScores[unified.primaryStyle] || 0,
        percentage: unified.percentage,
        rank: 1
      },
      secondaryStyles,
      scores: unified.allScores,
      totalQuestions: 21, // Valor padrão
      userData: { name: unified.metadata.userName || 'Usuário' }
    };
  }

  /**
   * Detecta automaticamente o formato e converte para unificado
   */
  autoDetectAndConvert(data: any, userName?: string): UnifiedResult {
    if (!data) {
      return this.createFallbackResult('unknown', userName);
    }

    // Detectar formato baseado na estrutura
    if (Array.isArray(data) && data[0]?.category !== undefined) {
      // CategoryScore[]
      return this.fromCategoryScores(data as CategoryScore[], userName);
    }
    
    if (data.primaryStyle && data.styleScores) {
      // StyleProfile
      return this.fromStyleProfile(data as StyleProfile, userName);
    }
    
    if (data.primaryStyle?.style && data.userData) {
      // QuizResultPayload
      return this.fromQuizResultPayload(data as QuizResultPayload);
    }
    
    if (data.engineVersion && data.breakdown) {
      // AggregateResult
      return this.fromAggregateResult(data as AggregateResult);
    }

    // Se já é formato unificado, retornar como está
    if (data.metadata?.source) {
      return data as UnifiedResult;
    }

    // Fallback: tentar extrair informações básicas
    console.warn('⚠️ Formato de dados não reconhecido, criando fallback');
    return this.createFallbackResult('unknown', userName);
  }

  /**
   * Cria resultado de fallback
   */
  private createFallbackResult(source: string, userName?: string): UnifiedResult {
    return {
      primaryStyle: 'Natural',
      confidence: 0,
      percentage: 0,
      secondaryStyles: [],
      allScores: { Natural: 0 },
      metadata: {
        source: source as any,
        version: '1.0',
        timestamp: new Date().toISOString(),
        userName
      }
    };
  }

  /**
   * Valida se um resultado unificado é válido
   */
  validate(unified: UnifiedResult): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!unified.primaryStyle || typeof unified.primaryStyle !== 'string') {
      errors.push('primaryStyle deve ser uma string não vazia');
    }

    if (typeof unified.confidence !== 'number' || unified.confidence < 0 || unified.confidence > 1) {
      errors.push('confidence deve ser um número entre 0 e 1');
    }

    if (typeof unified.percentage !== 'number' || unified.percentage < 0 || unified.percentage > 100) {
      errors.push('percentage deve ser um número entre 0 e 100');
    }

    if (!Array.isArray(unified.secondaryStyles)) {
      errors.push('secondaryStyles deve ser um array');
    }

    if (typeof unified.allScores !== 'object' || unified.allScores === null) {
      errors.push('allScores deve ser um objeto');
    }

    if (!unified.metadata || typeof unified.metadata !== 'object') {
      errors.push('metadata deve ser um objeto');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Instância singleton
export const resultFormatAdapter = new ResultFormatAdapter();
export default resultFormatAdapter;