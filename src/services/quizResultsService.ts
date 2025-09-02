// @ts-nocheck
import { styleConfig, type StyleConfig } from '@/config/styleConfig';
import { supabase } from '@/integrations/supabase/client';
import { StorageService } from '@/services/core/StorageService';
import { STYLE_KEYWORDS_MAPPING, STYLE_TIEBREAK_ORDER } from '@/utils/styleKeywordMap';

/**
 * 🎯 Serviço para cálculo e armazenamento de resultados do quiz
 *
 * Funcionalidades:
 * - ✅ Análise das respostas das 21 etapas
 * - ✅ Cálculo do perfil de estilo baseado no styleConfig.ts
 * - ✅ Geração de recomendações personalizadas
 * - ✅ Persistência no Supabase
 */

interface QuizSession {
  id: string;
  session_id: string;
  quiz_user_id?: string;
  responses?: Record<string, any>;
  current_step: number;
}

export interface StyleProfile {
  primaryStyle: string;
  primaryStyleConfig: StyleConfig;
  secondaryStyle?: string;
  secondaryStyleConfig?: StyleConfig;
  colorPalette: string[];
  bodyType: string;
  lifestyle: string;
  occasionPriorities: string[];
  confidence: number;
  styleScores: Record<string, number>;
}

export interface PersonalizedRecommendations {
  wardrobe: {
    essentials: string[];
    colors: string[];
    patterns: string[];
    accessories: string[];
  };
  shopping: {
    priorityItems: string[];
    budgetSuggestions: string[];
    brands: string[];
  };
  styling: {
    tips: string[];
    combinations: string[];
    occasions: Record<string, string[]>;
  };
  guide: {
    imageUrl: string;
    downloadUrl: string;
    personalizedTips: string[];
  };
}

export interface QuizResults {
  sessionId: string;
  userId?: string;
  userName?: string; // Nome do usuário capturado na etapa 1
  styleProfile: StyleProfile;
  recommendations: PersonalizedRecommendations;
  completionScore: number;
  calculatedAt: string;
  metadata: {
    totalQuestions: number;
    answeredQuestions: number;
    timeSpent: number;
    algorithm: string;
  };
}


type StyleKey = keyof typeof styleConfig;

class QuizResultsService {
  /**
   * Calcula resultados completos baseado nas respostas
   */
  async calculateResults(session: QuizSession): Promise<QuizResults> {
    console.log('🔍 Iniciando cálculo de resultados para sessão:', session.id);

    const startTime = Date.now();
    const responses = session.responses || {};

    try {
      // 1. Extrair nome do usuário da etapa 1
      const userName = this.extractUserName(responses);

      // 2. Analisar respostas por categoria
      const analysis = this.analyzeResponses(responses);

      // 3. Calcular perfil de estilo baseado no styleConfig.ts
      const styleProfile = this.calculateStyleProfile(analysis, responses);

      // 4. Gerar recomendações personalizadas
      const recommendations = this.generateRecommendations(styleProfile, analysis);

      // 5. Calcular score de completude
      const completionScore = this.calculateCompletionScore(responses);

      const results: QuizResults = {
        sessionId: session.id,
        userId: session.quiz_user_id,
        userName,
        styleProfile,
        recommendations,
        completionScore,
        calculatedAt: new Date().toISOString(),
        metadata: {
          totalQuestions: 21,
          answeredQuestions: Object.keys(responses).length,
          timeSpent: Date.now() - startTime,
          algorithm: 'style-analyzer-v3.0-integrated',
        },
      };

      // 5. Salvar resultados no banco
      await this.saveResults(results);

      console.log('✅ Resultados calculados com sucesso:', {
        sessionId: session.id,
        primaryStyle: styleProfile.primaryStyle,
        completionScore,
        timeSpent: results.metadata.timeSpent,
      });

      return results;
    } catch (error: any) {
      console.error('❌ Erro no cálculo de resultados:', error);
      throw new Error(`Falha no cálculo de resultados: ${error.message}`);
    }
  }

  /**
   * Extrai nome do usuário da etapa 1 (lead-form)
   */
  private extractUserName(responses: Record<string, any>): string {
    // Verificar etapa 1 - formulário de nome
    const step1Response = responses['1'];
    if (step1Response && typeof step1Response === 'object') {
      // Buscar campo de nome em diferentes formatos possíveis
      const nameFields = ['name', 'nome', 'userName', 'user_name', 'fullName', 'step01-lead-form'];

      for (const field of nameFields) {
        if (step1Response[field] && typeof step1Response[field] === 'string') {
          const name = step1Response[field].trim();
          if (name.length >= 2) {
            console.log('👤 Nome extraído da etapa 1:', name);
            return name;
          }
        }
      }

      // Verificar se existe um objeto aninhado com dados do formulário
      if (
        step1Response['step01-lead-form'] &&
        typeof step1Response['step01-lead-form'] === 'object'
      ) {
        const formData = step1Response['step01-lead-form'];
        if (formData.name && typeof formData.name === 'string') {
          const name = formData.name.trim();
          if (name.length >= 2) {
            console.log('👤 Nome extraído do formulário:', name);
            // Persistir em StorageService para consumo universal (core)
            try {
              StorageService.safeSetString('userName', name);
              StorageService.safeSetString('quizUserName', name);
            } catch { }
            return name;
          }
        }
      }
    }

    // Fallback: usar StorageService (core) com compatibilidade
    try {
      const storedName =
        StorageService.safeGetString('userName') ||
        StorageService.safeGetString('quizUserName');
      if (storedName && storedName.trim().length >= 2) {
        console.log('👤 Nome recuperado do StorageService:', storedName);
        return storedName.trim();
      }
    } catch { }

    console.log('⚠️ Nome do usuário não encontrado nas respostas');
    return '';
  }

  /**
   * Analisa respostas por categoria de pergunta
   */
  private analyzeResponses(responses: Record<string, any>) {
    const analysis = {
      clothing: {} as any,
      colors: {} as any,
      occasions: {} as any,
      style: {} as any,
      personality: {} as any,
      comfort: {} as any,
      budget: {} as any,
      inspiration: {} as any,
    };

    // Mapear etapas para categorias
    const stepCategories: Record<number, keyof typeof analysis> = {
      3: 'clothing', // Roupa Favorita
      4: 'style', // Estilo Pessoal
      5: 'occasions', // Ocasiões
      6: 'colors', // Cores
      7: 'clothing', // Texturas
      8: 'clothing', // Silhuetas
      9: 'clothing', // Acessórios
      10: 'inspiration', // Inspiração
      11: 'comfort', // Conforto
      12: 'style', // Tendências
      13: 'budget', // Investimento
      14: 'personality', // Personalidade
    };

    // Analisar cada resposta
    Object.entries(responses).forEach(([stepStr, stepResponses]) => {
      const step = parseInt(stepStr);
      const category = stepCategories[step];

      if (category && stepResponses) {
        analysis[category] = {
          ...analysis[category],
          ...stepResponses,
        };
      }
    });

    return analysis;
  }

  /**
   * Calcula perfil de estilo baseado no styleConfig.ts
   */
  private calculateStyleProfile(analysis: any, responses: Record<string, any>): StyleProfile {
    console.log('📊 Calculando perfil de estilo...');

    // Inicializar scores para todos os estilos
    const styleScores: Record<string, number> = {};
    Object.keys(styleConfig).forEach(style => {
      styleScores[style] = 0;
    });

    // Analisar todas as respostas e mapear para estilos
    Object.values(responses).forEach(stepResponses => {
      if (typeof stepResponses === 'object' && stepResponses !== null) {
        Object.entries(stepResponses).forEach(([questionId, answer]) => {
          if (typeof answer === 'string') {
            this.analyzeAnswerForStyles(answer, styleScores);
          } else if (Array.isArray(answer)) {
            answer.forEach(item => {
              if (typeof item === 'string') {
                this.analyzeAnswerForStyles(item, styleScores);
              }
            });
          }
        });
      }
    });

    // Análises específicas por categoria
    this.analyzeClothingPreferences(analysis.clothing, styleScores);
    this.analyzeColorPreferences(analysis.colors, styleScores);
    this.analyzeOccasionPreferences(analysis.occasions, styleScores);
    this.analyzePersonalityTraits(analysis.personality, styleScores);

    console.log('📈 Scores calculados:', styleScores);

    // Determinar estilo primário e secundário
    const sortedStyles = Object.entries(styleScores)
      .sort(([, a], [, b]) => {
        const diff = b - a;
        if (diff !== 0) return diff;
        // desempate determinístico pela ordem canônica
        return (STYLE_TIEBREAK_ORDER.indexOf as any)(arguments[0]?.[0]) - (STYLE_TIEBREAK_ORDER.indexOf as any)(arguments[1]?.[0]);
      })
      .filter(([, score]) => score > 0);

    const primaryStyleName = sortedStyles[0]?.[0] || 'Natural';
    const secondaryStyleName = sortedStyles[1]?.[0];

    const primaryStyleConfig = styleConfig[primaryStyleName as StyleKey];
    const secondaryStyleConfig = secondaryStyleName
      ? styleConfig[secondaryStyleName as StyleKey]
      : undefined;

    return {
      primaryStyle: primaryStyleName,
      primaryStyleConfig,
      secondaryStyle: secondaryStyleName,
      secondaryStyleConfig,
      colorPalette: this.extractColorPalette(analysis.colors),
      bodyType: 'universal',
      lifestyle: this.extractLifestyle(analysis.occasions),
      occasionPriorities: this.extractOccasionPriorities(analysis.occasions),
      confidence: this.calculateConfidence(styleScores),
      styleScores,
    };
  }

  /**
   * Analisa uma resposta em busca de palavras-chave de estilo
   */
  private analyzeAnswerForStyles(answer: string, styleScores: Record<string, number>) {
    const lowerAnswer = answer.toLowerCase();

    // Verificar palavras-chave diretas
    Object.entries(STYLE_KEYWORDS_MAPPING).forEach(([keyword, styleName]) => {
      if (lowerAnswer.includes(keyword)) {
        styleScores[styleName] = (styleScores[styleName] || 0) + 2;
      }
    });

    // Usar função do styleConfig para busca por keywords
    Object.entries(styleConfig).forEach(([styleName, config]) => {
      config.keywords.forEach(keyword => {
        if (lowerAnswer.includes(keyword.toLowerCase())) {
          styleScores[styleName] = (styleScores[styleName] || 0) + 1;
        }
      });
    });
  }

  /**
   * Análises específicas por categoria
   */
  private analyzeClothingPreferences(clothingData: any, styleScores: Record<string, number>) {
    if (!clothingData) return;

    // Roupa favorita
    if (clothingData.roupa_favorita) {
      const pref = clothingData.roupa_favorita.toLowerCase();
      if (pref.includes('vestido')) {
        styleScores['Romântico'] += 3;
        styleScores['Elegante'] += 1;
      }
      if (pref.includes('jeans')) {
        styleScores['Natural'] += 3;
        styleScores['Contemporâneo'] += 1;
      }
      if (pref.includes('social')) {
        styleScores['Clássico'] += 3;
        styleScores['Elegante'] += 1;
      }
    }
  }

  private analyzeColorPreferences(colorData: any, styleScores: Record<string, number>) {
    if (!colorData) return;

    if (colorData.cores_favoritas) {
      const cores = Array.isArray(colorData.cores_favoritas)
        ? colorData.cores_favoritas
        : [colorData.cores_favoritas];

      cores.forEach(cor => {
        const corLower = cor.toLowerCase();
        if (
          corLower.includes('neutro') ||
          corLower.includes('bege') ||
          corLower.includes('branco')
        ) {
          styleScores['Clássico'] += 2;
          styleScores['Elegante'] += 1;
        }
        if (corLower.includes('rosa') || corLower.includes('pastel')) {
          styleScores['Romântico'] += 2;
        }
        if (corLower.includes('preto') || corLower.includes('escuro')) {
          styleScores['Dramático'] += 2;
          styleScores['Sexy'] += 1;
        }
        if (corLower.includes('colorido') || corLower.includes('vibrante')) {
          styleScores['Criativo'] += 2;
        }
      });
    }
  }

  private analyzeOccasionPreferences(occasionData: any, styleScores: Record<string, number>) {
    if (!occasionData) return;

    Object.values(occasionData).forEach(occasion => {
      if (typeof occasion === 'string') {
        const occ = occasion.toLowerCase();
        if (occ.includes('trabalho') || occ.includes('formal')) {
          styleScores['Clássico'] += 2;
          styleScores['Elegante'] += 1;
        }
        if (occ.includes('casual') || occ.includes('dia a dia')) {
          styleScores['Natural'] += 2;
          styleScores['Contemporâneo'] += 1;
        }
        if (occ.includes('festa') || occ.includes('noite')) {
          styleScores['Sexy'] += 2;
          styleScores['Dramático'] += 1;
        }
      }
    });
  }

  private analyzePersonalityTraits(personalityData: any, styleScores: Record<string, number>) {
    if (!personalityData) return;

    Object.values(personalityData).forEach(trait => {
      if (typeof trait === 'string') {
        const traitLower = trait.toLowerCase();
        if (traitLower.includes('conservador') || traitLower.includes('tradicional')) {
          styleScores['Clássico'] += 2;
        }
        if (traitLower.includes('ousado') || traitLower.includes('aventureiro')) {
          styleScores['Criativo'] += 2;
          styleScores['Dramático'] += 1;
        }
        if (traitLower.includes('romantico') || traitLower.includes('sonhador')) {
          styleScores['Romântico'] += 2;
        }
        if (traitLower.includes('confiante') || traitLower.includes('determinado')) {
          styleScores['Sexy'] += 2;
          styleScores['Dramático'] += 1;
        }
      }
    });
  }

  /**
   * Gera recomendações personalizadas baseadas no estilo
   */
  private generateRecommendations(
    profile: StyleProfile,
    analysis: any
  ): PersonalizedRecommendations {
    console.log('🎨 Gerando recomendações para:', profile.primaryStyle);

    const recommendations = {
      wardrobe: {
        essentials: this.getEssentialsByStyle(profile.primaryStyle),
        colors: this.getColorsByStyle(profile.primaryStyle),
        patterns: this.getPatternsByStyle(profile.primaryStyle),
        accessories: this.getAccessoriesByStyle(profile.primaryStyle),
      },
      shopping: {
        priorityItems: this.getPriorityItems(profile, analysis),
        budgetSuggestions: this.getBudgetSuggestions(analysis.budget),
        brands: this.getBrandsByStyle(profile.primaryStyle),
      },
      styling: {
        tips: this.getStyleTips(profile.primaryStyle),
        combinations: this.getCombinations(profile.primaryStyle),
        occasions: this.getOccasionOutfits(profile.primaryStyle),
      },
      guide: {
        imageUrl: profile.primaryStyleConfig.guideImage,
        downloadUrl: profile.primaryStyleConfig.guideImage, // Mesmo link por enquanto
        personalizedTips: this.getPersonalizedTips(profile),
      },
    };

    return recommendations;
  }

  /**
   * Métodos de recomendações específicas por estilo
   */
  private getEssentialsByStyle(style: string): string[] {
    const essentials = {
      Natural: [
        'Jeans de qualidade',
        'Camiseta básica',
        'Tênis confortável',
        'Cardigã leve',
        'Bolsa prática',
      ],
      Clássico: [
        'Blazer estruturado',
        'Camisa branca',
        'Calça alfaiataria',
        'Sapato oxford',
        'Bolsa de couro',
      ],
      Contemporâneo: [
        'Peças versáteis',
        'Mix básico-moderno',
        'Acessórios funcionais',
        'Cores neutras',
        'Tecidos tecnológicos',
      ],
      Elegante: [
        'Peças de investimento',
        'Tecidos nobres',
        'Corte impecável',
        'Acessórios refinados',
        'Paleta sofisticada',
      ],
      Romântico: [
        'Vestidos fluidos',
        'Blusas delicadas',
        'Saias midi',
        'Acessórios femininos',
        'Cores suaves',
      ],
      Sexy: [
        'Peças que valorizam',
        'Decotes estratégicos',
        'Cintura marcada',
        'Salto alto',
        'Cores intensas',
      ],
      Dramático: [
        'Statement pieces',
        'Contrastes marcantes',
        'Silhuetas geométricas',
        'Acessórios impactantes',
        'Cores fortes',
      ],
      Criativo: [
        'Peças únicas',
        'Mix de texturas',
        'Estampas autorais',
        'Acessórios artísticos',
        'Combinações inusitadas',
      ],
    };

    return essentials[style] || essentials['Natural'];
  }

  private getColorsByStyle(style: string): string[] {
    const colors = {
      Natural: ['Bege', 'Marrom', 'Verde oliva', 'Off-white', 'Terracota'],
      Clássico: ['Navy', 'Branco', 'Camel', 'Cinza', 'Bordô'],
      Contemporâneo: ['Cinza', 'Preto', 'Branco', 'Azul', 'Tons neutros'],
      Elegante: ['Preto', 'Branco', 'Nude', 'Dourado', 'Prata'],
      Romântico: ['Rosa', 'Lavanda', 'Pêssego', 'Creme', 'Tons pastéis'],
      Sexy: ['Vermelho', 'Preto', 'Dourado', 'Rosa choque', 'Animal print'],
      Dramático: ['Preto', 'Branco', 'Vermelho', 'Roxo', 'Contrastes fortes'],
      Criativo: ['Cores vibrantes', 'Combinações inusitadas', 'Neon', 'Metálicos', 'Tie-dye'],
    };

    return colors[style] || colors['Natural'];
  }

  private getPatternsByStyle(style: string): string[] {
    const patterns = {
      Natural: ['Liso', 'Listras simples', 'Xadrez suave', 'Textura natural'],
      Clássico: ['Listras navy', 'Xadrez inglês', 'Poá discreto', 'Tweed'],
      Contemporâneo: ['Geométrico', 'Minimalista', 'Assimétrico', 'Clean'],
      Elegante: ['Sólidos nobres', 'Brocado', 'Jacquard', 'Rendas finas'],
      Romântico: ['Floral delicado', 'Poá', 'Rendas', 'Bordados'],
      Sexy: ['Animal print', 'Couro', 'Renda', 'Transparências'],
      Dramático: ['Geométrico bold', 'Contrastes', 'Assimétrico', 'Metalizado'],
      Criativo: ['Estampas autorais', 'Mix de padrões', 'Tie-dye', 'Patchwork'],
    };

    return patterns[style] || patterns['Natural'];
  }

  private getAccessoriesByStyle(style: string): string[] {
    const accessories = {
      Natural: ['Relógio simples', 'Bolsa de lona', 'Scarpin baixo', 'Bijuterias discretas'],
      Clássico: ['Relógio clássico', 'Pérolas', 'Bolsa estruturada', 'Lenço de seda'],
      Contemporâneo: [
        'Acessórios funcionais',
        'Tecnológicos',
        'Linhas limpas',
        'Materiais inovadores',
      ],
      Elegante: ['Joias finas', 'Bolsas de grife', 'Relógio luxo', 'Óculos de sol premium'],
      Romântico: ['Tiaras delicadas', 'Brincos de pérola', 'Bolsas pequenas', 'Sapatos femininos'],
      Sexy: ['Salto alto', 'Joias statement', 'Bolsa pequena', 'Óculos gatinho'],
      Dramático: [
        'Acessórios grandes',
        'Joias statement',
        'Óculos arquitetônicos',
        'Bolsas geométricas',
      ],
      Criativo: ['Peças autorais', 'Vintage', 'Artesanais', 'Combinações únicas'],
    };

    return accessories[style] || accessories['Natural'];
  }

  private getBrandsByStyle(style: string): string[] {
    const brands = {
      Natural: ['Farm', 'Osklen', 'Reserva', 'Amaro'],
      Clássico: ['Ralph Lauren', 'Brooks Brothers', 'Banana Republic', 'Zara'],
      Contemporâneo: ['COS', 'Uniqlo', 'Everlane', 'Mango'],
      Elegante: ['Tory Burch', 'Michael Kors', 'Coach', 'Hugo Boss'],
      Romântico: ['Zimmermann', 'Ulla Johnson', 'Clube Bossa', 'Maria Filó'],
      Sexy: ['Versace', 'Dolce & Gabbana', 'Agent Provocateur', 'La Perla'],
      Dramático: ['Alexander McQueen', 'Balenciaga', 'Givenchy', 'Balmain'],
      Criativo: ['Vivienne Westwood', 'Issey Miyake', 'Comme des Garçons', 'Jacquemus'],
    };

    return brands[style] || brands['Natural'];
  }

  private getStyleTips(style: string): string[] {
    const tips = {
      Natural: ['Priorize o conforto', 'Use tecidos naturais', 'Mantenha a simplicidade'],
      Clássico: ['Invista em qualidade', 'Mantenha proporções', 'Use cores neutras'],
      Contemporâneo: [
        'Balance tendência e atemporalidade',
        'Foque na funcionalidade',
        'Seja versátil',
      ],
      Elegante: ['Escolha tecidos nobres', 'Cuidado com os detalhes', 'Menos é mais'],
      Romântico: ['Valorize a feminilidade', 'Use texturas delicadas', 'Adicione detalhes suaves'],
      Sexy: ['Valorize pontos fortes', 'Use com confiança', 'Equilibre sensualidade'],
      Dramático: ['Ouse nas proporções', 'Crie contrastes', 'Seja statement'],
      Criativo: ['Expresse personalidade', 'Mix texturas e cores', 'Seja autêntica'],
    };

    return tips[style] || tips['Natural'];
  }

  private getCombinations(style: string): string[] {
    return [
      `Look dia: combinação ${style.toLowerCase()}`,
      `Look trabalho: elegante e ${style.toLowerCase()}`,
      `Look festa: sofisticado ${style.toLowerCase()}`,
    ];
  }

  private getOccasionOutfits(style: string): Record<string, string[]> {
    return {
      trabalho: [`Look profissional ${style.toLowerCase()}`],
      casual: [`Look casual ${style.toLowerCase()}`],
      festa: [`Look festa ${style.toLowerCase()}`],
    };
  }

  private getPersonalizedTips(profile: StyleProfile): string[] {
    const tips = [
      `Seu estilo ${profile.primaryStyle} combina perfeitamente com sua personalidade!`,
      `${profile.primaryStyleConfig.description}`,
      'Foque em peças que reflitam sua essência pessoal',
    ];

    if (profile.secondaryStyle) {
      tips.push(
        `Complemente com elementos do estilo ${profile.secondaryStyle} para mais versatilidade`
      );
    }

    return tips;
  }

  /**
   * Métodos auxiliares
   */
  private getPriorityItems(profile: StyleProfile, analysis: any): string[] {
    const base = this.getEssentialsByStyle(profile.primaryStyle);
    const budget = analysis.budget?.investimento || 'medio';

    if (budget === 'baixo') {
      return base.slice(0, 3);
    } else if (budget === 'alto') {
      return [...base, 'Peça de investimento premium'];
    }

    return base;
  }

  private getBudgetSuggestions(budgetData: any): string[] {
    const budget = budgetData?.investimento || 'medio';

    const suggestions = {
      baixo: ['Foque em básicos versáteis', 'Invista em qualidade nos essenciais'],
      medio: ['Balance quantidade e qualidade', 'Invista em peças-chave'],
      alto: ['Priorize peças de investimento', 'Consultoria personalizada'],
    };

    return suggestions[budget as keyof typeof suggestions] || suggestions['medio'];
  }

  private extractColorPalette(colorData: any): string[] {
    return colorData?.cores_favoritas || ['neutros', 'terrosos'];
  }

  private extractLifestyle(_occasionData: any): string {
    return 'equilibrado';
  }

  private extractOccasionPriorities(_occasionData: any): string[] {
    return ['trabalho', 'casual', 'social'];
  }

  private calculateConfidence(scores: Record<string, number>): number {
    const values = Object.values(scores);
    const total = values.reduce((sum, score) => sum + score, 0);
    const max = Math.max(...values);

    return total > 0 ? max / total : 0.5;
  }

  private calculateCompletionScore(responses: Record<string, any>): number {
    const totalQuestions = 21;
    const answeredQuestions = Object.keys(responses).length;

    return (answeredQuestions / totalQuestions) * 100;
  }

  /**
   * Salva resultados no Supabase
   */
  private async saveResults(results: QuizResults): Promise<void> {
    try {
      const { error } = await supabase.from('quiz_results').upsert({
        session_id: results.sessionId,
        predominant_style: results.styleProfile.primaryStyle,
        predominant_percentage: results.styleProfile.confidence * 100,
        complementary_styles: results.styleProfile.secondaryStyle
          ? [results.styleProfile.secondaryStyle]
          : [],
        style_scores: results.styleProfile.styleScores,
        calculation_details: results.metadata,
        created_at: results.calculatedAt,
      });

      if (error) throw error;

      console.log('✅ Resultados salvos no Supabase');
    } catch (error: any) {
      console.error('❌ Erro ao salvar resultados:', error);
      throw error;
    }
  }

  /**
   * Carrega resultados salvos
   */
  async getResults(sessionId: string): Promise<QuizResults | null> {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error) throw error;

      return data ? this.transformDbResultsToQuizResults(data) : null;
    } catch (error: any) {
      console.error('❌ Erro ao carregar resultados:', error);
      return null;
    }
  }

  private transformDbResultsToQuizResults(data: any): QuizResults {
    const styleName = data.predominant_style || 'Natural';
    const styleConf = styleConfig[styleName as StyleKey] || styleConfig['Natural'];

    return {
      sessionId: data.session_id,
      userId: undefined,
      styleProfile: {
        primaryStyle: styleName,
        primaryStyleConfig: styleConf,
        secondaryStyle: data.complementary_styles?.[0],
        secondaryStyleConfig: data.complementary_styles?.[0]
          ? styleConfig[data.complementary_styles[0] as StyleKey]
          : undefined,
        colorPalette: this.getColorsByStyle(styleName),
        bodyType: 'universal',
        lifestyle: 'equilibrado',
        occasionPriorities: ['trabalho', 'casual', 'social'],
        confidence: data.predominant_percentage / 100,
        styleScores: data.style_scores || {},
      },
      recommendations: this.generateRecommendations(
        {
          primaryStyle: styleName,
          primaryStyleConfig: styleConf,
          colorPalette: this.getColorsByStyle(styleName),
          bodyType: 'universal',
          lifestyle: 'equilibrado',
          occasionPriorities: ['trabalho', 'casual', 'social'],
          confidence: data.predominant_percentage / 100,
          styleScores: data.style_scores || {},
        },
        {}
      ),
      completionScore: 100,
      calculatedAt: data.created_at,
      metadata: data.calculation_details || {
        totalQuestions: 21,
        answeredQuestions: 21,
        timeSpent: 0,
        algorithm: 'style-analyzer-v3.0-integrated',
      },
    };
  }
}

export const quizResultsService = new QuizResultsService();
