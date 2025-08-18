import { useAuth } from '@/context/AuthContext';
import { useMemo } from 'react';

/**
 * 🎯 Hook para buscar nome do usuário dinamicamente
 * Prioridades:
 * 1. localStorage.getItem('quizUserName') - Nome preenchido no quiz
 * 2. localStorage.getItem('userName') - Fallback geral
 * 3. AuthContext user.name - Usuário logado
 * 4. AuthContext user.email - Email como fallback
 * 5. 'Usuário' - Fallback final
 */
export const useUserName = (): string => {
  const { user } = useAuth();

  const userName = useMemo(() => {
    // Prioridade 1: Nome do quiz
    const quizUserName = localStorage.getItem('quizUserName');
    if (quizUserName && quizUserName.trim()) {
      return quizUserName.trim();
    }

    // Prioridade 2: Nome geral
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName && storedUserName.trim()) {
      return storedUserName.trim();
    }

    // Prioridade 3: Usuário autenticado - nome
    if (user?.name && user.name.trim()) {
      return user.name.trim();
    }

    // Prioridade 4: Usuário autenticado - email
    if (user?.email && user.email.trim()) {
      return user.email.split('@')[0]; // Primeira parte do email
    }

    // Fallback final
    return 'Usuário';
  }, [user?.name, user?.email]);

  return userName;
};
