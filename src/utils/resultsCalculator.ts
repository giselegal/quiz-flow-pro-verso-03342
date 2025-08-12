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

/**
 * Calcula os resultados do quiz com base nas respostas do usuário
 * @param answers Respostas do usuário
 * @returns Objeto com resultados
 */
export const calculateResults = (answers: Record<string, UserAnswer[]>) => {
  // Implementação simplificada para mock
  const styles = ['Clássico', 'Romântico', 'Dramático', 'Natural', 'Criativo'];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];

  return {
    style: randomStyle,
    description: `Seu estilo predominante é ${randomStyle}. Este estilo reflete sua personalidade única e forma de expressão. Através das suas escolhas, podemos ver uma clara preferência por elementos que representam este estilo.`,
    score: 85,
    percentage: 100, // Added percentage property to match StyleResult
    colorPalette: ['#a67c52', '#d4c1a9', '#7a5c58'],
    styleAttributes: ['Elegante', 'Sofisticado', 'Atemporal'],
  };
};
