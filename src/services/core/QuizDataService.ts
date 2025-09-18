/**
 * 📊 QUIZ DATA SERVICE - STUB IMPLEMENTATION
 * 
 * Manages quiz data operations
 */

import { unifiedQuizStorage } from './UnifiedQuizStorage';

export interface QuizSession {
  id: string;
  startedAt: Date;
  currentStep: number;
  answers: Record<string, any>;
  isCompleted: boolean;
}

export class QuizDataService {
  createSession(quizId: string): QuizSession {
    const session: QuizSession = {
      id: quizId,
      startedAt: new Date(),
      currentStep: 1,
      answers: {},
      isCompleted: false
    };

    unifiedQuizStorage.saveQuizData(quizId, {
      id: quizId,
      answers: {},
      currentStep: 1,
      isCompleted: false
    });

    return session;
  }

  saveAnswer(quizId: string, questionId: string, answer: any): void {
    const existingData = unifiedQuizStorage.getQuizData(quizId);
    if (existingData) {
      const updatedAnswers = { ...existingData.answers, [questionId]: answer };
      unifiedQuizStorage.saveQuizData(quizId, { answers: updatedAnswers });
    }
  }

  getSession(quizId: string): QuizSession | null {
    const data = unifiedQuizStorage.getQuizData(quizId);
    if (!data) return null;

    return {
      id: data.id,
      startedAt: new Date(),
      currentStep: data.currentStep,
      answers: data.answers,
      isCompleted: data.isCompleted
    };
  }

  // Additional method for compatibility
  getStepData(quizId: string, stepNumber: number): any {
    const data = unifiedQuizStorage.getQuizData(quizId);
    return {
      stepNumber,
      answers: data?.answers || {},
      isCompleted: data?.currentStep ? data.currentStep > stepNumber : false
    };
  }

  // Static methods for compatibility
  static async saveResponse(stepId: string, response: any): Promise<void> {
    try {
      const existingData = JSON.parse(localStorage.getItem('quiz_responses') || '{}');
      existingData[stepId] = response;
      localStorage.setItem('quiz_responses', JSON.stringify(existingData));
    } catch (error) {
      console.error('Error saving response:', error);
      throw error;
    }
  }

  static async getAll(): Promise<any> {
    try {
      const responses = JSON.parse(localStorage.getItem('quiz_responses') || '{}');
      return { responses };
    } catch (error) {
      console.error('Error getting all data:', error);
      return { responses: {} };
    }
  }
}

export const quizDataService = new QuizDataService();
export default quizDataService;