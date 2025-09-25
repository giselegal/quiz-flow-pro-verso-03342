/**
 * 🎨 STYLE CALCULATION ENGINE - SISTEMA DE SCORING E RESULTADOS
 * 
 * Sistema que:
 * - Coleta pontuações por categoria em tempo real
 * - Calcula estilo predominante no Step 19
 * - Prepara dados para interpolação no Step 20
 * - Integra com fashion-ai-generator para geração visual
 * - Gera insights personalizados e recomendações
 */

import { unifiedQuizStorage } from '@/services/core/UnifiedQuizStorage';

export interface StyleCategory {
  id: string;
  name: string;
  description: string;
  personality: string[];
  colors: string[];
  fabrics: string[];
  accessories: string[];
  keywords: string[];
}

export interface CategoryScore {
  category: string;
  score: number;
  percentage: number;
  rank: number;
}

export interface StyleResult {
  // Resultado principal
  dominantStyle: StyleCategory;
  confidence: number; // 0-100
  
  // Distribuição de pontuação
  categoryScores: CategoryScore[];
  totalScore: number;
  
  // Estilos secundários
  secondaryStyles: StyleCategory[];
  
  // Dados personalizados
  userName: string;
  personalizedInsights: {
    personality: string[];
    recommendations: string[];
    colors: string[];
    fabrics: string[];
    accessories: string[];
    lookRecommendations: string[];
  };
  
  // Metadados
  calculatedAt: string;
  completionData: {
    totalSelections: number;
    completedSteps: number;
    timeSpent: number; // em minutos
  };
}

export interface CalculationOptions {
  includeSecondaryStyles: boolean;
  generatePersonalizedInsights: boolean;
  calculateConfidence: boolean;
  minDataThreshold: number;
}

class StyleCalculationEngine {
  private styleCategories: Map<string, StyleCategory> = new Map();
  private scoringRules: Map<string, Record<string, number>> = new Map();
  private calculationCache: Map<string, StyleResult> = new Map();

  constructor() {
    this.initializeStyleCategories();
    this.initializeScoringRules();
  }

  /**
   * 🚀 CALCULAR RESULTADO PRINCIPAL
   */
  async calculateStyleResult(options: Partial<CalculationOptions> = {}): Promise<StyleResult> {
    const defaultOptions: CalculationOptions = {
      includeSecondaryStyles: true,
      generatePersonalizedInsights: true,
      calculateConfidence: true,
      minDataThreshold: 8,
    };

    const config = { ...defaultOptions, ...options };
    const quizData = unifiedQuizStorage.loadData();

    // Verificar se há dados suficientes
    if (!this.hasEnoughData(quizData, config.minDataThreshold)) {
      throw new Error('Dados insuficientes para calcular resultado');
    }

    console.log('🎨 StyleCalculationEngine: Iniciando cálculo...', {
      selections: Object.keys(quizData.selections).length,
      userData: quizData.formData,
    });

    // 1. Calcular pontuações por categoria
    const categoryScores = this.calculateCategoryScores(quizData.selections);
    
    // 2. Determinar estilo predominante
    const dominantStyle = this.getDominantStyle(categoryScores);
    
    // 3. Calcular confiança do resultado
    const confidence = config.calculateConfidence 
      ? this.calculateConfidence(categoryScores) 
      : 100;
    
    // 4. Obter estilos secundários
    const secondaryStyles = config.includeSecondaryStyles 
      ? this.getSecondaryStyles(categoryScores) 
      : [];
    
    // 5. Gerar insights personalizados
    const personalizedInsights = config.generatePersonalizedInsights 
      ? this.generatePersonalizedInsights(dominantStyle, categoryScores)
      : this.getEmptyInsights();

    const result: StyleResult = {
      dominantStyle,
      confidence,
      categoryScores,
      totalScore: categoryScores.reduce((sum, score) => sum + score.score, 0),
      secondaryStyles,
      userName: quizData.formData.userName || quizData.formData.name || 'Usuário',
      personalizedInsights,
      calculatedAt: new Date().toISOString(),
      completionData: {
        totalSelections: Object.keys(quizData.selections).length,
        completedSteps: quizData.metadata.completedSteps.length,
        timeSpent: this.calculateTimeSpent(quizData.metadata.startedAt),
      },
    };

    // Cache do resultado para performance
    const cacheKey = this.generateCacheKey(quizData);
    this.calculationCache.set(cacheKey, result);

    console.log('✅ StyleCalculationEngine: Cálculo concluído', {
      dominantStyle: dominantStyle.name,
      confidence,
      totalScore: result.totalScore,
    });

    return result;
  }

  /**
   * 📊 CALCULAR PONTUAÇÕES EM TEMPO REAL
   */
  calculateRealTimeScores(selections: Record<string, string[]>): CategoryScore[] {
    return this.calculateCategoryScores(selections);
  }

  /**
   * 🎯 OBTER PREVIEW DO RESULTADO
   */
  getResultPreview(): { 
    topStyle: string; 
    confidence: number; 
    progress: number;
    missingData: string[];
  } {
    const quizData = unifiedQuizStorage.loadData();
    const scores = this.calculateCategoryScores(quizData.selections);
    
    const topScore = scores[0];
    const totalSelections = Object.keys(quizData.selections).length;
    const expectedSelections = 16; // 10 scoring + 6 strategic
    
    const missingData: string[] = [];
    
    if (!quizData.formData.userName) {
      missingData.push('Nome do usuário');
    }
    
    if (totalSelections < 10) {
      missingData.push(`${10 - totalSelections} questões de estilo`);
    }
    
    if (totalSelections < 16) {
      missingData.push(`${16 - totalSelections} questões estratégicas`);
    }

    return {
      topStyle: topScore ? this.styleCategories.get(topScore.category)?.name || 'Indefinido' : 'Indefinido',
      confidence: topScore ? Math.round(topScore.percentage) : 0,
      progress: Math.round((totalSelections / expectedSelections) * 100),
      missingData,
    };
  }

  /**
   * 🔄 LIMPAR CACHE
   */
  clearCache(): void {
    this.calculationCache.clear();
    console.log('🔄 StyleCalculationEngine: Cache limpo');
  }

  // Métodos privados

  private initializeStyleCategories(): void {
    const categories: StyleCategory[] = [
      {
        id: 'natural',
        name: 'Natural',
        description: 'Estilo autêntico e despojado, priorizando conforto e naturalidade.',
        personality: ['Autêntica', 'Espontânea', 'Confortável', 'Descomplicada'],
        colors: ['#8B7355', '#A0956B', '#D2B48C', '#F5E6D3'],
        fabrics: ['Algodão', 'Linho', 'Malha', 'Seda natural'],
        accessories: ['Acessórios de madeira', 'Bijuterias artesanais', 'Bolsas de couro'],
        keywords: ['conforto', 'naturalidade', 'autenticidade', 'simplicidade'],
      },
      {
        id: 'classico',
        name: 'Clássico',
        description: 'Estilo elegante e atemporal, baseado em peças tradicionais e sofisticadas.',
        personality: ['Elegante', 'Sofisticada', 'Atemporal', 'Refinada'],
        colors: ['#2C3E50', '#34495E', '#95A5A6', '#ECF0F1'],
        fabrics: ['Lã', 'Seda', 'Tweed', 'Cashmere'],
        accessories: ['Pérolas', 'Relógio clássico', 'Bolsa estruturada'],
        keywords: ['elegância', 'sofisticação', 'tradição', 'qualidade'],
      },
      {
        id: 'contemporaneo',
        name: 'Contemporâneo',
        description: 'Estilo moderno e atual, seguindo tendências sem perder a funcionalidade.',
        personality: ['Moderna', 'Versátil', 'Atualizada', 'Dinâmica'],
        colors: ['#3498DB', '#E74C3C', '#F39C12', '#2ECC71'],
        fabrics: ['Poliéster', 'Viscose', 'Elastano', 'Misturas tecnológicas'],
        accessories: ['Acessórios modernos', 'Bolsas funcionais', 'Óculos diferenciados'],
        keywords: ['modernidade', 'versatilidade', 'tendência', 'funcionalidade'],
      },
      {
        id: 'elegante',
        name: 'Elegante',
        description: 'Estilo refinado e luxuoso, com foco em peças de alta qualidade.',
        personality: ['Refinada', 'Luxuosa', 'Imponente', 'Distinta'],
        colors: ['#1A1A1A', '#FFFFFF', '#C0392B', '#F1C40F'],
        fabrics: ['Seda', 'Cetim', 'Veludo', 'Crepe'],
        accessories: ['Joias refinadas', 'Bolsas de grife', 'Sapatos de salto'],
        keywords: ['refinamento', 'luxo', 'distinção', 'exclusividade'],
      },
      {
        id: 'romantico',
        name: 'Romântico',
        description: 'Estilo feminino e delicado, com detalhes suaves e formas fluidas.',
        personality: ['Feminina', 'Delicada', 'Sonhadora', 'Carinhosa'],
        colors: ['#FFB6C1', '#F8BBD9', '#E6E6FA', '#FFF8DC'],
        fabrics: ['Chiffon', 'Renda', 'Tule', 'Seda fluida'],
        accessories: ['Flores', 'Laços', 'Bijuterias delicadas', 'Bolsas pequenas'],
        keywords: ['feminilidade', 'delicadeza', 'romantismo', 'suavidade'],
      },
      {
        id: 'sexy',
        name: 'Sexy',
        description: 'Estilo sensual e confiante, destacando a silhueta de forma marcante.',
        personality: ['Sensual', 'Confiante', 'Ousada', 'Magnética'],
        colors: ['#8B0000', '#000000', '#800080', '#FF69B4'],
        fabrics: ['Couro', 'Látex', 'Rendas transparentes', 'Jersey'],
        accessories: ['Saltos altos', 'Acessórios chamativos', 'Maquiagem marcante'],
        keywords: ['sensualidade', 'confiança', 'ousadia', 'magnetismo'],
      },
      {
        id: 'dramatico',
        name: 'Dramático',
        description: 'Estilo impactante e marcante, com contrastes fortes e peças statement.',
        personality: ['Ousada', 'Impactante', 'Confiante', 'Teatral'],
        colors: ['#000000', '#FFFFFF', '#FF0000', '#4B0082'],
        fabrics: ['Couro', 'Metallic', 'Estruturados', 'Brocados'],
        accessories: ['Acessórios statement', 'Maquiagem marcante', 'Peças geométricas'],
        keywords: ['impacto', 'contraste', 'dramaticidade', 'presença'],
      },
      {
        id: 'criativo',
        name: 'Criativo',
        description: 'Estilo único e expressivo, misturando elementos de forma original.',
        personality: ['Criativa', 'Original', 'Expressiva', 'Única'],
        colors: ['#FF6347', '#9370DB', '#20B2AA', '#FFD700'],
        fabrics: ['Estampados únicos', 'Misturas inusitadas', 'Texturas especiais'],
        accessories: ['Arte wearable', 'Peças autorais', 'Mix de estilos'],
        keywords: ['criatividade', 'originalidade', 'expressão', 'individualidade'],
      },
    ];

    categories.forEach(category => {
      this.styleCategories.set(category.id, category);
    });
  }

  private initializeScoringRules(): void {
    // Regras de pontuação para cada questão
    // Formato: questionId -> { optionId: score }
    
    // Esta é uma implementação simplificada
    // Em produção, estas regras viriam do template ou configuração
    const rules = {
      'step-2': {
        'natural_q2_1': 3, 'classico_q2_1': 1, 'contemporaneo_q2_1': 1,
        'natural_q2_2': 2, 'elegante_q2_2': 3, 'romantico_q2_2': 1,
        'natural_q2_3': 1, 'sexy_q2_3': 3, 'dramatico_q2_3': 2,
      },
      // ... outras questões
    };

    Object.entries(rules).forEach(([questionId, scores]) => {
      this.scoringRules.set(questionId, scores);
    });
  }

  private calculateCategoryScores(selections: Record<string, string[]>): CategoryScore[] {
    const scores: Record<string, number> = {};

    // Inicializar todas as categorias com 0
    this.styleCategories.forEach((_, categoryId) => {
      scores[categoryId] = 0;
    });

    // Calcular pontuações baseadas nas seleções
    Object.entries(selections).forEach(([questionId, options]) => {
      const questionRules = this.scoringRules.get(questionId);
      
      if (questionRules) {
        options.forEach(optionId => {
          const score = questionRules[optionId] || 0;
          if (score > 0) {
            // Extrair categoria do optionId (formato: categoria_questao_opcao)
            const [category] = optionId.split('_');
            if (scores[category] !== undefined) {
              scores[category] += score;
            }
          }
        });
      } else {
        // Fallback: inferir categoria do optionId
        options.forEach(optionId => {
          const [category] = optionId.split('_');
          if (scores[category] !== undefined) {
            scores[category] += 1; // Pontuação padrão
          }
        });
      }
    });

    // Converter para array e calcular percentuais
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    const categoryScores: CategoryScore[] = Object.entries(scores)
      .map(([category, score]) => ({
        category,
        score,
        percentage: totalScore > 0 ? Math.round((score / totalScore) * 100) : 0,
        rank: 0, // Será calculado abaixo
      }))
      .sort((a, b) => b.score - a.score);

    // Atribuir ranks
    categoryScores.forEach((item, index) => {
      item.rank = index + 1;
    });

    return categoryScores;
  }

  private getDominantStyle(categoryScores: CategoryScore[]): StyleCategory {
    const topScore = categoryScores[0];
    const dominantCategory = this.styleCategories.get(topScore.category);
    
    if (!dominantCategory) {
      throw new Error(`Categoria não encontrada: ${topScore.category}`);
    }

    return dominantCategory;
  }

  private getSecondaryStyles(categoryScores: CategoryScore[]): StyleCategory[] {
    return categoryScores
      .slice(1, 3) // Top 2 secundários
      .map(score => this.styleCategories.get(score.category))
      .filter((category): category is StyleCategory => category !== undefined);
  }

  private calculateConfidence(categoryScores: CategoryScore[]): number {
    if (categoryScores.length < 2) return 100;
    
    const [first, second] = categoryScores;
    const gap = first.score - second.score;
    const totalScore = categoryScores.reduce((sum, score) => sum + score.score, 0);
    
    // Confiança baseada na diferença entre 1º e 2º lugar
    const confidenceRatio = totalScore > 0 ? gap / totalScore : 0;
    return Math.min(100, Math.max(60, Math.round(confidenceRatio * 100 + 60)));
  }

  private generatePersonalizedInsights(
    dominantStyle: StyleCategory,
    categoryScores: CategoryScore[]
  ): StyleResult['personalizedInsights'] {
    const secondaryCategories = categoryScores.slice(1, 3);
    
    return {
      personality: [
        ...dominantStyle.personality,
        ...secondaryCategories.flatMap(score => {
          const category = this.styleCategories.get(score.category);
          return category ? category.personality.slice(0, 1) : [];
        }),
      ].slice(0, 5),
      
      recommendations: [
        `Invista em peças ${dominantStyle.keywords[0]} que reflitam sua personalidade`,
        `Combine ${dominantStyle.fabrics[0]} com acessórios ${dominantStyle.accessories[0]}`,
        `Sua paleta ideal inclui tons ${dominantStyle.colors[0]}`,
      ],
      
      colors: dominantStyle.colors,
      fabrics: dominantStyle.fabrics,
      accessories: dominantStyle.accessories,
      
      lookRecommendations: this.generateLookRecommendations(dominantStyle, secondaryCategories),
    };
  }

  private generateLookRecommendations(
    dominantStyle: StyleCategory,
    secondaryStyles: CategoryScore[]
  ): string[] {
    const recommendations = [
      `Look ${dominantStyle.name} para o dia a dia`,
      `Combinação ${dominantStyle.name} para ocasiões especiais`,
    ];

    secondaryStyles.forEach(score => {
      const category = this.styleCategories.get(score.category);
      if (category) {
        recommendations.push(`Mix ${dominantStyle.name} + ${category.name}`);
      }
    });

    return recommendations.slice(0, 4);
  }

  private hasEnoughData(quizData: any, minThreshold: number): boolean {
    const selectionsCount = Object.keys(quizData.selections).length;
    const hasUserName = Boolean(quizData.formData.userName || quizData.formData.name);
    
    return selectionsCount >= minThreshold && hasUserName;
  }

  private calculateTimeSpent(startedAt: string): number {
    const start = new Date(startedAt).getTime();
    const now = Date.now();
    return Math.round((now - start) / (1000 * 60)); // em minutos
  }

  private generateCacheKey(quizData: any): string {
    const selectionsKey = Object.keys(quizData.selections).sort().join('-');
    const userKey = quizData.formData.userName || 'anonymous';
    return `${userKey}-${selectionsKey}`;
  }

  private getEmptyInsights(): StyleResult['personalizedInsights'] {
    return {
      personality: [],
      recommendations: [],
      colors: [],
      fabrics: [],
      accessories: [],
      lookRecommendations: [],
    };
  }
}

// Singleton instance
export const styleCalculationEngine = new StyleCalculationEngine();
export default StyleCalculationEngine;