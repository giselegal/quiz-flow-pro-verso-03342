/**
 * 🎯 UNIFIED QUIZ STORAGE - STUB IMPLEMENTATION
 * 
 * Basic quiz storage service to maintain compatibility
 */

import { storageService } from './StorageService';

export interface QuizData {
  id: string;
  answers: Record<string, any>;
  currentStep: number;
  isCompleted: boolean;
  result?: any;
}

export class UnifiedQuizStorage {
  private readonly storageKey = 'quiz-data';

  saveQuizData(quizId: string, data: Partial<QuizData>): void {
    const existingData = this.getQuizData(quizId) || {};
    const updatedData = { ...existingData, ...data, id: quizId };
    storageService.setItem(`${this.storageKey}-${quizId}`, updatedData);
  }

  getQuizData(quizId: string): QuizData | null {
    return storageService.getItem<QuizData>(`${this.storageKey}-${quizId}`);
  }

  clearQuizData(quizId: string): void {
    storageService.removeItem(`${this.storageKey}-${quizId}`);
  }

  getAllQuizData(): Record<string, QuizData> {
    // Simple implementation - in real app, would iterate through storage
    return {};
  }

  // Additional methods for compatibility
  clearAll(): void {
    storageService.clear();
  }

  updateFormData(quizId: string, formData: any): void {
    const data = this.getQuizData(quizId) || { id: quizId, answers: {}, currentStep: 1, isCompleted: false };
    this.saveQuizData(quizId, { ...data, answers: { ...data.answers, ...formData } });
  }

  updateSelections(quizId: string, selections: any): void {
    this.updateFormData(quizId, selections);
  }

  updateProgress(quizId: string, step: number): void {
    const data = this.getQuizData(quizId) || { id: quizId, answers: {}, currentStep: 1, isCompleted: false };
    this.saveQuizData(quizId, { ...data, currentStep: step });
  }

  loadData(quizId: string): any {
    return this.getQuizData(quizId);
  }

  getDataStats(quizId: string): any {
    const data = this.getQuizData(quizId);
    return {
      totalAnswers: Object.keys(data?.answers || {}).length,
      currentStep: data?.currentStep || 1,
      isCompleted: data?.isCompleted || false
    };
  }

  saveResult(quizId: string, result: any): void {
    const data = this.getQuizData(quizId) || { id: quizId, answers: {}, currentStep: 1, isCompleted: false };
    this.saveQuizData(quizId, { ...data, result, isCompleted: true });
  }

  // Static methods for compatibility
  static async getQuizData(): Promise<any> {
    try {
      const data = localStorage.getItem('unified_quiz_data');
      return data ? JSON.parse(data) : {
        currentStep: 1,
        responses: {},
        calculatedStyles: [],
        userName: ''
      };
    } catch (error) {
      console.error('Error getting quiz data:', error);
      return {
        currentStep: 1,
        responses: {},
        calculatedStyles: [],
        userName: ''
      };
    }
  }

  static async saveQuizData(quizData: any): Promise<void> {
    try {
      localStorage.setItem('unified_quiz_data', JSON.stringify(quizData));
    } catch (error) {
      console.error('Error saving quiz data:', error);
    }
  }
}

export const unifiedQuizStorage = new UnifiedQuizStorage();
export default unifiedQuizStorage;