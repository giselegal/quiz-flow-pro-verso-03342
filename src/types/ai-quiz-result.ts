export interface QuizStyleInfo {
  name: string;
  category: string;
  percentage: number;
  description: string;
}

export interface QuizResult {
  primaryStyle: QuizStyleInfo;
  secondaryStyles?: Array<Pick<QuizStyleInfo, 'name' | 'percentage'>>;
  totalScore: number;
}


