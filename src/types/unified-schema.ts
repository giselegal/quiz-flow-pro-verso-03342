export type UnifiedQuizData = any;
export type UnifiedFunnelPage = any;
export type UnifiedProfile = any;
export type QuizUser = any;
export type QuizSession = any;
export type InsertQuizUser = any;
export type InsertQuizSession = any;

export function generateId() {
  return Math.random().toString(36).substring(7);
}
