// @ts-nocheck
/**
 * Optimized Quiz Data Hook - Replaces localStorage with Supabase for critical data
 * 
 * This hook provides the same interface as quizDataService but with:
 * - Supabase persistence for user data and sessions
 * - Reduced localStorage usage (only temporary/cache data)
 * - Better performance through debouncing
 * - Proper cleanup to prevent memory leaks
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useUserData } from '../context/UserDataContext';
import { supabase } from '../integrations/supabase/client';
import { QuizSession, QuizUser } from '../types/unified-schema';

interface QuizAnswer {
  questionId: string;
  questionText: string;
  selectedOptions: string[];
  optionTexts: string[];
  timestamp: Date;
  responseTime: number;
  stylePoints: Record<string, number>;
}

interface ClickEvent {
  eventId: string;
  timestamp: Date;
  elementType: string;
  elementId?: string;
  elementText?: string;
  position: { x: number; y: number };
  pageUrl: string;
  questionIndex?: number;
  actionType: 'click' | 'hover' | 'focus' | 'submit';
  metadata?: Record<string, any>;
}

interface QuizDataHookReturn {
  // User data (migrated from localStorage)
  userName: string;
  setUserName: (name: string) => Promise<void>;
  userEmail: string;
  setUserEmail: (email: string) => Promise<void>;
  
  // Session management (migrated to Supabase)
  currentSession: QuizSession | null;
  startSession: (funnelId: string) => Promise<void>;
  endSession: () => Promise<void>;
  
  // Quiz responses (stored in Supabase)
  addAnswer: (answer: QuizAnswer) => Promise<void>;
  
  // Click tracking (reduced localStorage usage)
  trackClick: (event: ClickEvent) => void;
  
  // Analytics (optimized)
  getSessionStats: () => any;
  
  // UTM parameters (from context)
  utmParameters: Record<string, string> | null;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

export const useOptimizedQuizData = (): QuizDataHookReturn => {
  const {
    currentUser,
    setCurrentUser,
    currentSession,
    setCurrentSession,
    createUser,
    createSession,
    updateSession,
    utmParameters,
  } = useUserData();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clickBuffer, setClickBuffer] = useState<ClickEvent[]>([]);
  
  // Refs for cleanup
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Debounced save function to prevent excessive Supabase calls
  const debouncedSave = useCallback((sessionId: string, updates: any) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    
    saveTimerRef.current = setTimeout(async () => {
      try {
        await updateSession(sessionId, updates);
      } catch (err) {
        console.error('Error saving session:', err);
        setError('Erro ao salvar sessão');
      }
    }, 2000); // 2 second debounce
  }, [updateSession]);

  // Optimized click tracking with reduced localStorage usage
  const trackClick = useCallback((event: ClickEvent) => {
    setClickBuffer(prev => {
      const newBuffer = [...prev, event];
      
      // Only save to localStorage every 10 clicks or when buffer gets large
      if (newBuffer.length >= 10) {
        if (clickTimerRef.current) {
          clearTimeout(clickTimerRef.current);
        }
        
        clickTimerRef.current = setTimeout(() => {
          // Only store recent clicks in localStorage (max 50)
          const recentClicks = newBuffer.slice(-50);
          localStorage.setItem('recent_clicks', JSON.stringify(recentClicks));
          setClickBuffer([]);
        }, 1000);
        
        return [];
      }
      
      return newBuffer;
    });
  }, []);

  // User name management
  const setUserName = useCallback(async (name: string) => {
    setIsLoading(true);
    try {
      if (currentUser) {
        const { error } = await supabase
          .from('quiz_users')
          .update({ name })
          .eq('id', currentUser.id);
          
        if (error) throw error;
        setCurrentUser({ ...currentUser, name });
      } else {
        const user = await createUser({ name });
        if (user) {
          setCurrentUser(user);
        } else {
          throw new Error('Failed to create user');
        }
      }
    } catch (err) {
      setError('Erro ao salvar nome do usuário');
      console.error('Error setting user name:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, setCurrentUser, createUser]);

  // User email management
  const setUserEmail = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      if (currentUser) {
        const { error } = await supabase
          .from('quiz_users')
          .update({ email })
          .eq('id', currentUser.id);
          
        if (error) throw error;
        setCurrentUser({ ...currentUser, email });
      } else {
        const user = await createUser({ email });
        if (user) {
          setCurrentUser(user);
        } else {
          throw new Error('Failed to create user');
        }
      }
    } catch (err) {
      setError('Erro ao salvar email do usuário');
      console.error('Error setting user email:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, setCurrentUser, createUser]);

  // Session management
  const startSession = useCallback(async (funnelId: string) => {
    setIsLoading(true);
    try {
      let user = currentUser;
      
      // Ensure we have a user
      if (!user) {
        user = await createUser({});
        if (!user) throw new Error('Failed to create user');
        setCurrentUser(user);
      }
      
      // Create session
      const session = await createSession({
        funnel_id: funnelId,
        status: 'active',
        current_step: 0,
      });
      
      if (!session) throw new Error('Failed to create session');
      
      setCurrentSession(session);
      
      // Clean up old localStorage data
      localStorage.removeItem('current_quiz_session');
      localStorage.removeItem('quiz_start_time');
      
    } catch (err) {
      setError('Erro ao iniciar sessão');
      console.error('Error starting session:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, setCurrentUser, createUser, createSession, setCurrentSession]);

  const endSession = useCallback(async () => {
    if (!currentSession) return;
    
    try {
      await updateSession(currentSession.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
      });
      
      setCurrentSession(null);
      
      // Clear any remaining localStorage
      localStorage.removeItem('recent_clicks');
      
    } catch (err) {
      console.error('Error ending session:', err);
    }
  }, [currentSession, updateSession, setCurrentSession]);

  // Add quiz answer
  const addAnswer = useCallback(async (answer: QuizAnswer) => {
    if (!currentSession) return;
    
    try {
      // Save to quiz_step_responses table
      await supabase.from('quiz_step_responses').insert({
        id: `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        session_id: currentSession.id,
        step_number: answer.questionId,
        response_data: {
          selectedOptions: answer.selectedOptions,
          optionTexts: answer.optionTexts,
          responseTime: answer.responseTime,
          stylePoints: answer.stylePoints,
        },
      });
      
      // Update session with debouncing
      debouncedSave(currentSession.id, {
        current_step: parseInt(answer.questionId) + 1,
      });
      
    } catch (err) {
      console.error('Error saving answer:', err);
    }
  }, [currentSession, debouncedSave]);

  // Get session statistics
  const getSessionStats = useCallback(() => {
    if (!currentSession) return null;
    
    return {
      sessionId: currentSession.id,
      userId: currentSession.quiz_user_id,
      startTime: currentSession.last_activity,
      currentStep: currentSession.current_step,
      status: currentSession.status,
      funnelId: currentSession.funnel_id,
    };
  }, [currentSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  return {
    userName: currentUser?.name || '',
    setUserName,
    userEmail: currentUser?.email || '',
    setUserEmail,
    currentSession,
    startSession,
    endSession,
    addAnswer,
    trackClick,
    getSessionStats,
    utmParameters,
    isLoading,
    error,
  };
};

export default useOptimizedQuizData;