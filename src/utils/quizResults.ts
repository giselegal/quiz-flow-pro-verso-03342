// Utility functions for quiz results calculation
export interface QuizAnswer {
  questionId: string;
  optionId: string;
  weights?: Record<string, number>;
}

export interface StyleResult {
  style: string;
  category: string;
  score: number;
  percentage: number;
}

export interface ComputedResult {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
  scores: Record<string, number>;
  totalQuestions: number;
  version: string;
}

/**
 * Normalizes a user name by trimming whitespace and capitalizing first letters
 */
export function normalizeUserName(name: string): string {
  if (!name || typeof name !== 'string') return '';
  
  return name
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Computes quiz results based on user answers
 */
export function computeResults(
  answers: QuizAnswer[],
  knownStyles?: string[]
): ComputedResult {
  const defaultStyles = ['Clássico', 'Romântico', 'Dramático', 'Natural', 'Criativo'];
  const styles = knownStyles || defaultStyles;
  
  // Initialize scores for each style
  const scores: Record<string, number> = {};
  styles.forEach(style => {
    scores[style] = 0;
  });

  // Calculate scores based on answers
  answers.forEach(answer => {
    if (answer.weights) {
      Object.entries(answer.weights).forEach(([style, weight]) => {
        if (scores.hasOwnProperty(style)) {
          scores[style] += weight;
        }
      });
    } else {
      // Default scoring if no weights provided
      const randomStyle = styles[Math.floor(Math.random() * styles.length)];
      scores[randomStyle] += 1;
    }
  });

  // Calculate total for percentage calculation
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  
  // Handle case where total is 0
  if (totalScore === 0) {
    const defaultStyle = styles[0];
    scores[defaultStyle] = 1;
  }

  // Convert to StyleResult array and sort by score
  const styleResults: StyleResult[] = Object.entries(scores)
    .map(([style, score]) => ({
      style,
      category: style,
      score,
      percentage: totalScore > 0 ? Math.round((score / Math.max(totalScore, 1)) * 100) : 0
    }))
    .sort((a, b) => b.score - a.score);

  // Handle ties - if top scores are equal, use first one
  const primaryStyle = styleResults[0];
  const secondaryStyles = styleResults.slice(1);

  return {
    primaryStyle,
    secondaryStyles,
    scores,
    totalQuestions: answers.length,
    version: 'v1'
  };
}

/**
 * Interpolates template strings with provided variables
 */
export function interpolateTemplate(
  template: string,
  variables: Record<string, any>
): string {
  if (!template || typeof template !== 'string') return '';
  
  let result = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    result = result.replace(placeholder, String(value || ''));
  });
  
  // Handle any remaining placeholders by replacing with empty string
  result = result.replace(/\{\{\s*\w+\s*\}\}/g, '');
  
  return result;
}

export default {
  normalizeUserName,
  computeResults,
  interpolateTemplate
};