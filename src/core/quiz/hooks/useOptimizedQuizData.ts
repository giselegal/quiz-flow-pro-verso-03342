/**
 * Optimized Quiz Data Hook - Replaces localStorage with Supabase for critical data
 *
 * This hook provides the same interface as quizDataService but with:
 * - Supabase persistence for user data and sessions
 * - Reduced localStorage usage (only temporary/cache data)
 * - Better performance through debouncing
 * - Proper cleanup to prevent memory leaks
 */

import { useCallback, useState } from 'react';
import { StorageService } from '@/services/core/StorageService';

interface QuizDataHookReturn {
  userName: string;
  setUserName: (name: string) => Promise<void>;
  userEmail: string;
  setUserEmail: (email: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Simplified quiz data hook (stub for now)
 */
export const useOptimizedQuizData = (): QuizDataHookReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserNameState] = useState('');
  const [userEmail, setUserEmailState] = useState('');

  const setUserName = useCallback(async (name: string) => {
    setIsLoading(true);
    try {
      setUserNameState(name);
      StorageService.safeSetJSON('userName', name);
    } catch (err) {
      setError('Error setting user name');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setUserEmail = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      setUserEmailState(email);
      StorageService.safeSetJSON('userEmail', email);
    } catch (err) {
      setError('Error setting user email');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    isLoading,
    error,
  };
};

export default useOptimizedQuizData;
