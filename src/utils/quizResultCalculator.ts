// Quiz Result Calculator
// Calculates style recommendations based on user responses

export interface StyleResult {
  id: string;
  name: string;
  description: string;
  score: number;
  characteristics: string[];
  colors: string[];
  patterns: string[];
  pieces: string[];
}

export interface QuizResponse {
  stepId: string;
  value: any;
  weight?: number;
}

export class QuizResultCalculator {
  private styleProfiles: StyleResult[] = [
    {
      id: 'romantic',
      name: 'Romântico',
      description: 'Estilo feminino e delicado',
      score: 0,
      characteristics: ['Feminino', 'Delicado', 'Suave'],
      colors: ['Rosa', 'Branco', 'Nude'],
      patterns: ['Floral', 'Renda', 'Babados'],
      pieces: ['Vestidos', 'Saias', 'Blusas fluidas']
    },
    {
      id: 'classic',
      name: 'Clássico',
      description: 'Estilo elegante e atemporal',
      score: 0,
      characteristics: ['Elegante', 'Atemporal', 'Sofisticado'],
      colors: ['Preto', 'Branco', 'Bege', 'Azul marinho'],
      patterns: ['Liso', 'Listras', 'Xadrez'],
      pieces: ['Blazer', 'Calças de alfaiataria', 'Camisas']
    },
    {
      id: 'casual',
      name: 'Casual',
      description: 'Estilo confortável e despojado',
      score: 0,
      characteristics: ['Confortável', 'Despojado', 'Prático'],
      colors: ['Jeans', 'Branco', 'Cinza'],
      patterns: ['Liso', 'Estampas simples'],
      pieces: ['Jeans', 'T-shirts', 'Tênis']
    }
  ];

  calculate(responses: QuizResponse[]): StyleResult[] {
    // Reset scores
    this.styleProfiles.forEach(style => style.score = 0);

    // Calculate scores based on responses
    responses.forEach(response => {
      this.processResponse(response);
    });

    // Sort by score (highest first)
    return [...this.styleProfiles].sort((a, b) => b.score - a.score);
  }

  private processResponse(response: QuizResponse): void {
    const weight = response.weight || 1;
    
    // Simple scoring logic - can be expanded
    switch (response.stepId) {
      case 'style-preference':
        this.scoreStylePreference(response.value, weight);
        break;
      case 'color-preference':
        this.scoreColorPreference(response.value, weight);
        break;
      case 'lifestyle':
        this.scoreLifestyle(response.value, weight);
        break;
      default:
        // Generic scoring
        this.scoreGeneric(response.value, weight);
    }
  }

  private scoreStylePreference(value: string, weight: number): void {
    switch (value) {
      case 'feminine':
        this.styleProfiles[0].score += 3 * weight; // Romantic
        break;
      case 'elegant':
        this.styleProfiles[1].score += 3 * weight; // Classic
        break;
      case 'comfortable':
        this.styleProfiles[2].score += 3 * weight; // Casual
        break;
    }
  }

  private scoreColorPreference(value: string[], weight: number): void {
    if (Array.isArray(value)) {
      value.forEach(color => {
        if (['pink', 'white', 'nude'].includes(color)) {
          this.styleProfiles[0].score += 1 * weight;
        }
        if (['black', 'navy', 'beige'].includes(color)) {
          this.styleProfiles[1].score += 1 * weight;
        }
        if (['denim', 'gray', 'casual'].includes(color)) {
          this.styleProfiles[2].score += 1 * weight;
        }
      });
    }
  }

  private scoreLifestyle(value: string, weight: number): void {
    switch (value) {
      case 'formal':
        this.styleProfiles[1].score += 2 * weight; // Classic
        break;
      case 'relaxed':
        this.styleProfiles[2].score += 2 * weight; // Casual
        break;
      case 'social':
        this.styleProfiles[0].score += 2 * weight; // Romantic
        break;
    }
  }

  private scoreGeneric(_value: any, _weight: number): void {
    // Add small random scoring for engagement
    this.styleProfiles.forEach(style => {
      style.score += Math.random() * 0.5;
    });
  }

  getPrimaryStyle(responses: QuizResponse[]): StyleResult {
    const results = this.calculate(responses);
    return results[0];
  }

  getSecondaryStyles(responses: QuizResponse[]): StyleResult[] {
    const results = this.calculate(responses);
    return results.slice(1);
  }
}

// Singleton instance
export const quizResultCalculator = new QuizResultCalculator();

// Legacy export for compatibility
export const calculateAndSaveQuizResult = async (responses: QuizResponse[]) => {
  const results = quizResultCalculator.calculate(responses);
  return {
    primaryStyle: results[0],
    secondaryStyles: results.slice(1),
    allStyles: results
  };
};