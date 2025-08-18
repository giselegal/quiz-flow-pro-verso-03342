import { useCallback } from 'react';
import { useLocation } from 'wouter';

/**
 * Hook para navegação segura que evita problemas com tela branca
 * Inclui tratamento de erro e fallbacks
 */
export const useNavigationSafe = () => {
  const [, setLocation] = useLocation();

  const navigateTo = useCallback(
    (path: string) => {
      try {
        // Log detalhado para debugging
        console.log('🚀 [NavigationSafe] Navegando para:', path);
        console.log('🚀 [NavigationSafe] Estado atual da página:', window.location.href);

        // Validação da rota
        if (!path || path.length === 0) {
          throw new Error('Caminho de navegação inválido');
        }

        // Navegação interna segura
        setLocation(path);

        console.log('✅ [NavigationSafe] Navegação bem-sucedida');
      } catch (error) {
        console.error('❌ [NavigationSafe] Erro na navegação:', error);
        console.log('🔄 [NavigationSafe] Tentando fallback...');

        // Fallback para navegação direta
        try {
          window.location.href = path;
          console.log('✅ [NavigationSafe] Fallback bem-sucedido');
        } catch (fallbackError) {
          console.error('❌ [NavigationSafe] Erro no fallback:', fallbackError);
          alert(`Erro na navegação para ${path}. Por favor, recarregue a página.`);
        }
      }
    },
    [setLocation]
  );

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
  const openInNewTab = useCallback(
    (path: string) => {
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
    },
    [navigateTo]
  );

  return {
    navigateTo,
    navigateToEditor,
    navigateToStep21,
    navigateToAnalytics,
    navigateToQuiz,
    navigateToSettings,
    openInNewTab,
  };
};
