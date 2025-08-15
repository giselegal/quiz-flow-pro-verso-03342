/**
 * User Data Context - Replaces critical localStorage usage with Supabase
 * 
 * This context manages user-specific data that was previously stored in localStorage,
 * now properly persisted in Supabase for reliability and consistency.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import { QuizUser, QuizSession, InsertQuizUser, InsertQuizSession } from '../types/unified-schema';

interface UserDataContextType {
  // User information (previously in localStorage as userName, userEmail)
  currentUser: QuizUser | null;
  setCurrentUser: (user: QuizUser | null) => void;
  
  // Current quiz session (previously in localStorage as current_quiz_session)
  currentSession: QuizSession | null;
  setCurrentSession: (session: QuizSession | null) => void;
  
  // UTM parameters (previously in localStorage as quiz_utm_parameters)
  utmParameters: Record<string, string> | null;
  setUtmParameters: (params: Record<string, string> | null) => void;
  
  // Helper functions
  createUser: (userData: Partial<InsertQuizUser>) => Promise<QuizUser | null>;
  createSession: (sessionData: Partial<InsertQuizSession>) => Promise<QuizSession | null>;
  updateSession: (sessionId: string, updates: Partial<QuizSession>) => Promise<boolean>;
  clearUserData: () => void;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

interface UserDataProviderProps {
  children: ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<QuizUser | null>(null);
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);
  const [utmParameters, setUtmParameters] = useState<Record<string, string> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize from URL parameters and existing data
  useEffect(() => {
    initializeUserData();
  }, []);

  const initializeUserData = async () => {
    setIsLoading(true);
    try {
      // Extract UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const utm = {
        utm_source: urlParams.get('utm_source') || '',
        utm_medium: urlParams.get('utm_medium') || '',
        utm_campaign: urlParams.get('utm_campaign') || '',
        utm_content: urlParams.get('utm_content') || '',
        utm_term: urlParams.get('utm_term') || '',
      };

      // Only set UTM if there are actual values
      const hasUtmData = Object.values(utm).some(value => value !== '');
      if (hasUtmData) {
        setUtmParameters(utm);
      }

      // Try to recover user from localStorage as fallback (migration period)
      const storedUserName = localStorage.getItem('userName');
      const storedUserEmail = localStorage.getItem('userEmail');
      
      if (storedUserName || storedUserEmail) {
        const userData: Partial<InsertQuizUser> = {
          name: storedUserName || undefined,
          email: storedUserEmail || undefined,
          ...utm,
        };
        
        const user = await createUser(userData);
        if (user) {
          setCurrentUser(user);
          // Clean up localStorage after successful migration
          localStorage.removeItem('userName');
          localStorage.removeItem('userEmail');
        }
      }

    } catch (err) {
      setError('Erro ao inicializar dados do usuário');
      console.error('Error initializing user data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: Partial<InsertQuizUser>): Promise<QuizUser | null> => {
    try {
      const { data, error } = await supabase
        .from('quiz_users')
        .insert([{
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...userData,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating user:', err);
      return null;
    }
  };

  const createSession = async (sessionData: Partial<InsertQuizSession>): Promise<QuizSession | null> => {
    try {
      if (!currentUser) {
        throw new Error('No current user for session creation');
      }

      const { data, error } = await supabase
        .from('quiz_sessions')
        .insert([{
          id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          quiz_user_id: currentUser.id,
          last_activity: new Date().toISOString(),
          ...sessionData,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating session:', err);
      return null;
    }
  };

  const updateSession = async (sessionId: string, updates: Partial<QuizSession>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('quiz_sessions')
        .update({
          ...updates,
          last_activity: new Date().toISOString(),
        })
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error updating session:', err);
      return false;
    }
  };

  const clearUserData = () => {
    setCurrentUser(null);
    setCurrentSession(null);
    setUtmParameters(null);
    
    // Clean up any remaining localStorage items (migration period)
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('current_quiz_session');
    localStorage.removeItem('quiz_utm_parameters');
  };

  const value: UserDataContextType = {
    currentUser,
    setCurrentUser,
    currentSession,
    setCurrentSession,
    utmParameters,
    setUtmParameters,
    createUser,
    createSession,
    updateSession,
    clearUserData,
    isLoading,
    error,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

// Helper hook for backward compatibility
export const useUserName = () => {
  const { currentUser, setCurrentUser, createUser } = useUserData();
  
  return {
    userName: currentUser?.name || '',
    setUserName: async (name: string) => {
      if (currentUser) {
        // Update existing user
        const { error } = await supabase
          .from('quiz_users')
          .update({ name })
          .eq('id', currentUser.id);
          
        if (!error) {
          setCurrentUser({ ...currentUser, name });
        }
      } else {
        // Create new user
        const user = await createUser({ name });
        if (user) {
          setCurrentUser(user);
        }
      }
    }
  };
};

export default UserDataProvider;