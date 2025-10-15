// Importa do caminho compatível com os testes, que mockam '@/context/AuthContext'
import { useAuth } from '@/context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { StorageService } from '@/services/core/StorageService';

/**
 * 🎯 Hook para buscar nome do usuário dinamicamente
 * Prioridades:
 * 1. StorageService.safeGetString('quizUserName') - Nome preenchido no quiz
 * 2. StorageService.safeGetString('userName') - Fallback geral
 * 3. AuthContext user.name - Usuário logado
 * 4. AuthContext user.email - Email como fallback
 * 5. 'Usuário' - Fallback final
 */
export const useUserName = (): string => {
  const { user } = useAuth();
  const [name, setName] = useState<string>('Usuário');

  const compute = useMemo(() => {
    return () => {
      // Prioridade 1: Nome do quiz
      const quizUserName = StorageService.safeGetString('quizUserName');
      if (quizUserName && quizUserName.trim()) return quizUserName.trim();
      // Prioridade 2: Nome geral
      const storedUserName = StorageService.safeGetString('userName');
      if (storedUserName && storedUserName.trim()) return storedUserName.trim();
      // Prioridade 3: Usuário autenticado
      if (user?.name && user.name.trim()) return user.name.trim();
      // Prioridade 4: Email
      if (user?.email && user.email.trim()) return user.email.split('@')[0];
      return 'Usuário';
    };
  }, [user?.name, user?.email]);

  // Inicializa
  useEffect(() => {
    try { setName(compute()); } catch { }
  }, [compute]);

  // Reagir a eventos do quiz e mudanças de storage
  useEffect(() => {
    const onUpdated = () => {
      try { setName(compute()); } catch { }
    };
    const onStorage = (e: StorageEvent) => {
      if (!e) return;
      if (e.key === 'userName' || e.key === 'quizUserName') {
        try { setName(compute()); } catch { }
      }
    };
    window.addEventListener('quiz-user-name-updated', onUpdated as EventListener);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('quiz-user-name-updated', onUpdated as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, [compute]);

  return name;
};
