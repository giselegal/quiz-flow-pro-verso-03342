/**
 * useQuizState Hook - State Management and Persistence
 *
 * Manages quiz state, user progress, and data persistence for the Quiz Quest application.
 * Based on the requirements from the checklist verification.
 */

import { useState, useCallback, useEffect } from 'react';
import { QuizState, QuizStateHook, UserAnswer } from '@/types/quizCore';

const STORAGE_KEY = 'quiz-quest-state';
const AUTO_SAVE_INTERVAL = 10000; // 10 seconds

const initialState: QuizState = {
  currentStepId: 'step-1',
  currentStepNumber: 1,
  totalSteps: 21,
  userName: '',
  userAnswers: [],
  scores: {},
  progress: 0,
  isCompleted: false,
  result: undefined,
  sessionData: {},
};

export const useQuizState = (): QuizStateHook => {
  const [state, setState] = useState<QuizState>(initialState);

  // Update state with partial updates
  const updateState = useCallback((updates: Partial<QuizState>) => {
    setState(prevState => {
      const newState = { ...prevState, ...updates };

      // Calculate progress automatically
      if (updates.currentStepNumber || updates.totalSteps) {
        newState.progress = Math.round((newState.currentStepNumber / newState.totalSteps) * 100);
      }

      // Auto-calculate scores if user answers are updated
      if (updates.userAnswers) {
        newState.scores = calculateScores(newState.userAnswers);
      }

      return newState;
    });
  }, []);

  // Reset state to initial values
  const resetState = useCallback(() => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Save state to localStorage
  const saveToStorage = useCallback(() => {
    try {
      const serializedState = JSON.stringify({
        ...state,
        lastSaved: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEY, serializedState);
      console.log('✅ Quiz state saved to localStorage');
    } catch (error) {
      console.error('❌ Failed to save quiz state:', error);
    }
  }, [state]);

  // Load state from localStorage
  const loadFromStorage = useCallback(() => {
    try {
      const serializedState = localStorage.getItem(STORAGE_KEY);
      if (serializedState) {
        const loadedState = JSON.parse(serializedState);
        setState({
          ...initialState,
          ...loadedState,
        });
        console.log('✅ Quiz state loaded from localStorage');
        return true;
      }
    } catch (error) {
      console.error('❌ Failed to load quiz state:', error);
    }
    return false;
  }, []);

  // Auto-save to localStorage periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.currentStepNumber > 1 || state.userAnswers.length > 0) {
        saveToStorage();
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [saveToStorage, state.currentStepNumber, state.userAnswers.length]);

  // Load from storage on initialization
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return {
    state,
    updateState,
    resetState,
    saveToStorage,
    loadFromStorage,
  };
};

// Helper function to calculate scores from user answers
function calculateScores(userAnswers: UserAnswer[]): Record<string, number> {
  const scores: Record<string, number> = {};

  userAnswers.forEach(answer => {
    answer.selectedOptionDetails.forEach(option => {
      if (option.points) {
        Object.entries(option.points).forEach(([style, points]) => {
          scores[style] = (scores[style] || 0) + points;
        });
      }
    });
  });

  return scores;
}

export default useQuizState;
