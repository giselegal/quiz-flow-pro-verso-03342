import { StorageService } from './StorageService';
import { StyleResult } from '@/types/quiz';

export interface RawScores {
  [style: string]: number;
}

export interface QuizResultPayload {
  version: string;
  primaryStyle: StyleResult | { style: string; category: string; score: number; percentage: number };
  secondaryStyles: Array<StyleResult | { style: string; category: string; score: number; percentage: number }>;
  scores: RawScores;
  totalQuestions: number;
  userData?: { name?: string };
}

// Mapeamento canônico de prefixos → nome amigável
const STYLE_MAP: Record<string, string> = {
  natural: 'Natural',
  classico: 'Clássico',
  contemporaneo: 'Contemporâneo',
  elegante: 'Elegante',
  romantico: 'Romântico',
  sexy: 'Sexy',
  dramatico: 'Dramático',
  criativo: 'Criativo',
};

// Ordem determinística para desempate entre estilos com mesma pontuação
export const STYLES_ORDER: string[] = [
  'Natural',
  'Clássico',
  'Contemporâneo',
  'Elegante',
  'Romântico',
  'Sexy',
  'Dramático',
  'Criativo',
];

export const ResultEngine = {
  // Calcula pontuação a partir de selections (por questão) usando prefixos de optionId
  computeScoresFromSelections(
    selectionsByQuestion: Record<string, string[]>,
    options?: { weightQuestions?: number }
  ): { scores: RawScores; total: number } {
    const scores: RawScores = {};
    Object.values(STYLE_MAP).forEach(name => (scores[name] = 0));

    const weightQ = typeof options?.weightQuestions === 'number' && options.weightQuestions > 0
      ? options.weightQuestions
      : 1;

    const entries = Object.entries(selectionsByQuestion);
    for (const [, selection] of entries) {
      for (const optId of selection || []) {
        const key = String(optId).toLowerCase();
        const prefix = Object.keys(STYLE_MAP).find(p => key.startsWith(p + '_'));
        if (prefix) {
          const name = STYLE_MAP[prefix];
          scores[name] = (scores[name] || 0) + 1 * weightQ;
        }
      }
    }
    const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
    return { scores, total };
  },

  // Normaliza objeto de resultado para consumo pelos blocos de resultado
  toPayload(scores: RawScores, total: number, userName?: string): QuizResultPayload {
    const ordered = Object.entries(scores)
      .map(([style, score]) => ({
        style,
        category: style,
        score,
        percentage: Math.round((score / (total || 1)) * 100),
      }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        // Desempate estável pela ordem de STYLES_ORDER
        const ai = STYLES_ORDER.indexOf(a.style);
        const bi = STYLES_ORDER.indexOf(b.style);
        if (ai !== -1 && bi !== -1) return ai - bi;
        if (ai !== -1) return -1;
        if (bi !== -1) return 1;
        return String(a.style).localeCompare(String(b.style));
      });

    const primary = ordered[0] || {
      style: 'Natural',
      category: 'Natural',
      score: 0,
      percentage: 0,
    };
    const secondary = ordered.slice(1);

    return {
      version: 'v1',
      primaryStyle: primary,
      secondaryStyles: secondary,
      scores,
      totalQuestions: total,
      userData: { name: userName },
    };
  },

  // Persiste com fallback seguro
  persist(payload: QuizResultPayload): boolean {
    const ok = StorageService.safeSetJSON('quizResult', payload);
    // Notificar UI para reagir (hooks escutam estes eventos)
    try {
      window.dispatchEvent(new Event('quiz-result-updated'));
      window.dispatchEvent(new Event('quiz-result-refresh'));
    } catch { }
    return ok;
  },
};
