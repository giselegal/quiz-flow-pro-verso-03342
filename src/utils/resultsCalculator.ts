import { StyleResult } from '../types/quiz';

/**
 * Representa a resposta de um usuário para uma pergunta
 */
export interface UserAnswer {
  optionId: string;
  value?: string;
  points?: number;
  stylePoints?: Record<string, number>;
}

export interface CalculatedResults extends Partial<StyleResult> {
  style: string;
  description: string;
  score: number;
  percentage: number;
  colorPalette: string[];
  styleAttributes: string[];
}

/**
 * Calcula os resultados do quiz com base nas respostas do usuário
 * @param answers Respostas do usuário (Mapeadas por questionId)
 * @returns Objeto com resultados calculados
 * TODO: Refinar algoritmo real e alinhar completamente com StyleResult
 */
export const calculateResults = (answers: Record<string, UserAnswer[]>): CalculatedResults => {
  // Uso mínimo para evitar remoção pelo lint enquanto implementação real não chega
  const totalQuestions = Object.keys(answers || {}).length;
  // FIXME: Implementação mock - substituir por cálculo real de distribuição de pontos
  const styles = ['Clássico', 'Romântico', 'Dramático', 'Natural', 'Criativo'];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];

  return {
    style: randomStyle,
    description: `Seu estilo predominante é ${randomStyle}. (${totalQuestions} perguntas analisadas) Este estilo reflete sua personalidade única e forma de expressão.`,
    score: 85,
    percentage: 100,
    colorPalette: ['#a67c52', '#d4c1a9', '#7a5c58'],
    styleAttributes: ['Elegante', 'Sofisticado', 'Atemporal'],
  };
};
