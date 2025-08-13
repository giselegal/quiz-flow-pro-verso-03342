import { useLocation } from 'wouter';
import { useCallback } from 'react';

/**
 * Hook para navegação segura que evita problemas com tela branca
 * Inclui tratamento de erro e fallbacks
 */
export const useNavigationSafe = () => {
  const [, setLocation] = useLocation();

  const navigateTo = useCallback((path: string) => {
    try {
      // Log para debugging
      console.log('Navegando para:', path);
      
      // Navegação interna segura
      setLocation(path);
    } catch (error) {
      console.error('Erro na navegação:', error);
      
      // Fallback para navegação direta
      try {
        window.location.href = path;
      } catch (fallbackError) {
        console.error('Erro no fallback de navegação:', fallbackError);
        alert('Erro na navegação. Por favor, recarregue a página.');
      }
    }
  }, [setLocation]);

  const navigateToEditor = useCallback(() => {
    navigateTo('/admin/editor');
  }, [navigateTo]);

  const navigateToStep21 = useCallback(() => {
    navigateTo('/step/21');
  }, [navigateTo]);

  const navigateToAnalytics = useCallback(() => {
    navigateTo('/admin/analytics');
  }, [navigateTo]);

  const navigateToQuiz = useCallback(() => {
    navigateTo('/admin/quiz');
  }, [navigateTo]);

  const navigateToSettings = useCallback(() => {
    navigateTo('/admin/settings');
  }, [navigateTo]);

  // Função para abrir em nova aba de forma segura
  const openInNewTab = useCallback((path: string) => {
    try {
      const newTab = window.open(path, '_blank', 'noopener,noreferrer');
      if (!newTab) {
        // Se popup foi bloqueado, navegar na mesma aba
        navigateTo(path);
      }
    } catch (error) {
      console.error('Erro ao abrir nova aba:', error);
      navigateTo(path);
    }
  }, [navigateTo]);

  return {
    navigateTo,
    navigateToEditor,
    navigateToStep21,
    navigateToAnalytics,
    navigateToQuiz,
    navigateToSettings,
    openInNewTab
  };
};
