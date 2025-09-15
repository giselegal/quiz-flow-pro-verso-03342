/**
 * 🎯 USE QUIZ HOOK - Presentation Layer
 * 
 * Custom hook for quiz state management and operations.
 * Provides reactive interface to QuizService operations.
 */

import { useState, useEffect, useCallback } from 'react';
import { Quiz, Question, ResultProfile } from '@/core/domains';
import { QuizService, QuizSession, QuizAnalytics } from '@/application/services/QuizService';

const quizService = new QuizService();

export interface UseQuizState {
  quiz: Quiz | null;
  questions: Question[];
  resultProfiles: ResultProfile[];
  session: QuizSession | null;
  analytics: QuizAnalytics | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseQuizActions {
  // Quiz management
  createQuiz: (name: string, description: string, options?: any) => Promise<void>;
  loadQuiz: (id: string) => Promise<void>;
  updateQuiz: (updates: Partial<Quiz>) => Promise<void>;
  deleteQuiz: () => Promise<void>;
  cloneQuiz: (newName?: string) => Promise<Quiz | null>;
  publishQuiz: () => Promise<void>;
  unpublishQuiz: () => Promise<void>;
  
  // Question management
  addQuestion: (type: string, text: string, options: any[]) => Promise<void>;
  updateQuestion: (questionId: string, updates: Partial<Question>) => Promise<void>;
  deleteQuestion: (questionId: string) => Promise<void>;
  loadQuestions: () => Promise<void>;
  
  // Result profile management
  addResultProfile: (title: string, description: string, scoreRange: any) => Promise<void>;
  updateResultProfile: (resultProfileId: string, updates: Partial<ResultProfile>) => Promise<void>;
  deleteResultProfile: (resultProfileId: string) => Promise<void>;
  loadResultProfiles: () => Promise<void>;
  
  // Session management
  startSession: (userId?: string) => Promise<void>;
  submitAnswer: (questionId: string, answer: any) => Promise<void>;
  completeSession: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  
  // Analytics
  loadAnalytics: () => Promise<void>;
  
  // Utility
  clearError: () => void;
  reset: () => void;
}

export function useQuiz(quizId?: string): UseQuizState & UseQuizActions {
  const [state, setState] = useState<UseQuizState>({
    quiz: null,
    questions: [],
    resultProfiles: [],
    session: null,
    analytics: null,
    isLoading: false,
    error: null
  });

  // 🔍 Internal state updaters
  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  }, []);

  const updateState = useCallback((updates: Partial<UseQuizState>) => {
    setState(prev => ({ ...prev, ...updates, isLoading: false }));
  }, []);

  // 🔍 Quiz Management
  const createQuiz = useCallback(async (
    name: string, 
    description: string, 
    options: any = {}
  ) => {
    try {
      setLoading(true);
      const quiz = await quizService.createQuiz(name, description, options);
      updateState({ quiz, error: null });
    } catch (error) {
      setError(`Failed to create quiz: ${error}`);
    }
  }, [setLoading, updateState, setError]);

  const loadQuiz = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const quiz = await quizService.getQuiz(id);
      if (!quiz) {
        setError('Quiz not found');
        return;
      }
      updateState({ quiz, error: null });
    } catch (error) {
      setError(`Failed to load quiz: ${error}`);
    }
  }, [setLoading, updateState, setError]);

  const updateQuiz = useCallback(async (updates: Partial<Quiz>) => {
    if (!state.quiz) {
      setError('No quiz loaded');
      return;
    }

    try {
      setLoading(true);
      const updatedQuiz = await quizService.updateQuiz(state.quiz.id, updates);
      updateState({ quiz: updatedQuiz, error: null });
    } catch (error) {
      setError(`Failed to update quiz: ${error}`);
    }
  }, [state.quiz, setLoading, updateState, setError]);

  const deleteQuiz = useCallback(async () => {
    if (!state.quiz) {
      setError('No quiz loaded');
      return;
    }

    try {
      setLoading(true);
      const success = await quizService.deleteQuiz(state.quiz.id);
      if (success) {
        updateState({ 
          quiz: null, 
          questions: [], 
          resultProfiles: [],
          error: null 
        });
      } else {
        setError('Failed to delete quiz');
      }
    } catch (error) {
      setError(`Failed to delete quiz: ${error}`);
    }
  }, [state.quiz, setLoading, updateState, setError]);

  const cloneQuiz = useCallback(async (newName?: string): Promise<Quiz | null> => {
    if (!state.quiz) {
      setError('No quiz loaded');
      return null;
    }

    try {
      setLoading(true);
      const clonedQuiz = await quizService.cloneQuiz(state.quiz.id, newName);
      updateState({ error: null });
      return clonedQuiz;
    } catch (error) {
      setError(`Failed to clone quiz: ${error}`);
      return null;
    }
  }, [state.quiz, setLoading, updateState, setError]);

  const publishQuiz = useCallback(async () => {
    if (!state.quiz) {
      setError('No quiz loaded');
      return;
    }

    try {
      setLoading(true);
      const publishedQuiz = await quizService.publishQuiz(state.quiz.id);
      updateState({ quiz: publishedQuiz, error: null });
    } catch (error) {
      setError(`Failed to publish quiz: ${error}`);
    }
  }, [state.quiz, setLoading, updateState, setError]);

  const unpublishQuiz = useCallback(async () => {
    if (!state.quiz) {
      setError('No quiz loaded');
      return;
    }

    try {
      setLoading(true);
      const unpublishedQuiz = await quizService.unpublishQuiz(state.quiz.id);
      updateState({ quiz: unpublishedQuiz, error: null });
    } catch (error) {
      setError(`Failed to unpublish quiz: ${error}`);
    }
  }, [state.quiz, setLoading, updateState, setError]);

  // 🔍 Question Management
  const addQuestion = useCallback(async (
    type: string, 
    text: string, 
    options: any[]
  ) => {
    if (!state.quiz) {
      setError('No quiz loaded');
      return;
    }

    try {
      setLoading(true);
      const question = await quizService.addQuestion(state.quiz.id, type, text, options);
      updateState({ 
        questions: [...state.questions, question],
        error: null 
      });
    } catch (error) {
      setError(`Failed to add question: ${error}`);
    }
  }, [state.quiz, state.questions, setLoading, updateState, setError]);

  const updateQuestion = useCallback(async (
    questionId: string, 
    updates: Partial<Question>
  ) => {
    if (!state.quiz) {
      setError('No quiz loaded');
      return;
    }

    try {
      setLoading(true);
      const updatedQuestion = await quizService.updateQuestion(
        state.quiz.id, 
        questionId, 
        updates
      );
      
      const updatedQuestions = state.questions.map(q => 
        q.id === questionId ? updatedQuestion : q
      );
      
      updateState({ questions: updatedQuestions, error: null });
    } catch (error) {
      setError(`Failed to update question: ${error}`);
    }
  }, [state.quiz, state.questions, setLoading, updateState, setError]);

  const deleteQuestion = useCallback(async (questionId: string) => {
    if (!state.quiz) {
      setError('No quiz loaded');
      return;
    }

    try {
      setLoading(true);
      const success = await quizService.deleteQuestion(state.quiz.id, questionId);
      if (success) {
        const filteredQuestions = state.questions.filter(q => q.id !== questionId);
        updateState({ questions: filteredQuestions, error: null });
      } else {
        setError('Failed to delete question');
      }
    } catch (error) {
      setError(`Failed to delete question: ${error}`);
    }
  }, [state.quiz, state.questions, setLoading, updateState, setError]);

  const loadQuestions = useCallback(async () => {
    if (!state.quiz) return;

    try {
      setLoading(true);
      const questions = await quizService.getQuestions(state.quiz.id);
      updateState({ questions, error: null });
    } catch (error) {
      setError(`Failed to load questions: ${error}`);
    }
  }, [state.quiz, setLoading, updateState, setError]);

  // 🔍 Result Profile Management
  const addResultProfile = useCallback(async (
    title: string,
    description: string,
    scoreRange: any
  ) => {
    if (!state.quiz) {
      setError('No quiz loaded');
      return;
    }

    try {
      setLoading(true);
      const resultProfile = await quizService.addResultProfile(
        state.quiz.id, 
        title, 
        description, 
        scoreRange
      );
      updateState({ 
        resultProfiles: [...state.resultProfiles, resultProfile],
        error: null 
      });
    } catch (error) {
      setError(`Failed to add result profile: ${error}`);
    }
  }, [state.quiz, state.resultProfiles, setLoading, updateState, setError]);

  const updateResultProfile = useCallback(async (
    resultProfileId: string,
    updates: Partial<ResultProfile>
  ) => {
    if (!state.quiz) {
      setError('No quiz loaded');
      return;
    }

    try {
      setLoading(true);
      const updatedResultProfile = await quizService.updateResultProfile(
        state.quiz.id,
        resultProfileId,
        updates
      );
      
      const updatedResultProfiles = state.resultProfiles.map(rp =>
        rp.id === resultProfileId ? updatedResultProfile : rp
      );
      
      updateState({ resultProfiles: updatedResultProfiles, error: null });
    } catch (error) {
      setError(`Failed to update result profile: ${error}`);
    }
  }, [state.quiz, state.resultProfiles, setLoading, updateState, setError]);

  const deleteResultProfile = useCallback(async (resultProfileId: string) => {
    if (!state.quiz) {
      setError('No quiz loaded');
      return;
    }

    try {
      setLoading(true);
      const success = await quizService.deleteResultProfile(state.quiz.id, resultProfileId);
      if (success) {
        const filteredResultProfiles = state.resultProfiles.filter(rp => rp.id !== resultProfileId);
        updateState({ resultProfiles: filteredResultProfiles, error: null });
      } else {
        setError('Failed to delete result profile');
      }
    } catch (error) {
      setError(`Failed to delete result profile: ${error}`);
    }
  }, [state.quiz, state.resultProfiles, setLoading, updateState, setError]);

  const loadResultProfiles = useCallback(async () => {
    if (!state.quiz) return;

    try {
      setLoading(true);
      const resultProfiles = await quizService.getResultProfiles(state.quiz.id);
      updateState({ resultProfiles, error: null });
    } catch (error) {
      setError(`Failed to load result profiles: ${error}`);
    }
  }, [state.quiz, setLoading, updateState, setError]);

  // 🔍 Session Management
  const startSession = useCallback(async (userId?: string) => {
    if (!state.quiz) {
      setError('No quiz loaded');
      return;
    }

    try {
      setLoading(true);
      const session = await quizService.startQuizSession(state.quiz.id, userId);
      updateState({ session, error: null });
    } catch (error) {
      setError(`Failed to start session: ${error}`);
    }
  }, [state.quiz, setLoading, updateState, setError]);

  const submitAnswer = useCallback(async (questionId: string, answer: any) => {
    if (!state.session) {
      setError('No active session');
      return;
    }

    try {
      setLoading(true);
      const updatedSession = await quizService.submitAnswer(
        state.session.id,
        questionId,
        answer
      );
      updateState({ session: updatedSession, error: null });
    } catch (error) {
      setError(`Failed to submit answer: ${error}`);
    }
  }, [state.session, setLoading, updateState, setError]);

  const completeSession = useCallback(async () => {
    if (!state.session) {
      setError('No active session');
      return;
    }

    try {
      setLoading(true);
      const completedSession = await quizService.completeQuizSession(state.session.id);
      updateState({ session: completedSession, error: null });
    } catch (error) {
      setError(`Failed to complete session: ${error}`);
    }
  }, [state.session, setLoading, updateState, setError]);

  const loadSession = useCallback(async (sessionId: string) => {
    try {
      setLoading(true);
      const session = await quizService.getQuizSession(sessionId);
      if (!session) {
        setError('Session not found');
        return;
      }
      updateState({ session, error: null });
    } catch (error) {
      setError(`Failed to load session: ${error}`);
    }
  }, [setLoading, updateState, setError]);

  // 🔍 Analytics
  const loadAnalytics = useCallback(async () => {
    if (!state.quiz) return;

    try {
      setLoading(true);
      const analytics = await quizService.getQuizAnalytics(state.quiz.id);
      updateState({ analytics, error: null });
    } catch (error) {
      setError(`Failed to load analytics: ${error}`);
    }
  }, [state.quiz, setLoading, updateState, setError]);

  // 🔍 Utility functions
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      quiz: null,
      questions: [],
      resultProfiles: [],
      session: null,
      analytics: null,
      isLoading: false,
      error: null
    });
  }, []);

  // 🔍 Auto-load quiz if ID provided
  useEffect(() => {
    if (quizId && !state.quiz) {
      loadQuiz(quizId);
    }
  }, [quizId, state.quiz, loadQuiz]);

  // 🔍 Auto-load related data when quiz changes
  useEffect(() => {
    if (state.quiz) {
      loadQuestions();
      loadResultProfiles();
    }
  }, [state.quiz, loadQuestions, loadResultProfiles]);

  return {
    // State
    ...state,
    
    // Actions
    createQuiz,
    loadQuiz,
    updateQuiz,
    deleteQuiz,
    cloneQuiz,
    publishQuiz,
    unpublishQuiz,
    
    addQuestion,
    updateQuestion,
    deleteQuestion,
    loadQuestions,
    
    addResultProfile,
    updateResultProfile,
    deleteResultProfile,
    loadResultProfiles,
    
    startSession,
    submitAnswer,
    completeSession,
    loadSession,
    
    loadAnalytics,
    
    clearError,
    reset
  };
}