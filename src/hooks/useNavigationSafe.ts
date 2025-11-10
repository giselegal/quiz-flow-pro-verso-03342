import { useCallback } from 'react';
import { notify } from '@/lib/utils/notify';
import { useLocation } from 'wouter';
import { appLogger } from '@/lib/utils/appLogger';

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
        appLogger.info('🚀 [NavigationSafe] Navegando para:', { data: [path] });
        appLogger.info('🚀 [NavigationSafe] Estado atual da página:', { data: [window.location.href] });

        // Validação da rota
        if (!path || path.length === 0) {
          throw new Error('Caminho de navegação inválido');
        }

        // Navegação interna segura
        setLocation(path);

        appLogger.info('✅ [NavigationSafe] Navegação bem-sucedida');
      } catch (error) {
        appLogger.error('❌ [NavigationSafe] Erro na navegação:', { data: [error] });
        appLogger.info('🔄 [NavigationSafe] Tentando fallback...');

        // Fallback para navegação direta
        try {
          window.location.href = path;
          appLogger.info('✅ [NavigationSafe] Fallback bem-sucedido');
        } catch (fallbackError) {
          appLogger.error('❌ [NavigationSafe] Erro no fallback:', { data: [fallbackError] });
          notify(`Erro na navegação para ${path}. Por favor, recarregue a página.`, 'error', 'Navegação falhou');
        }
      }
    },
    [setLocation],
  );

  const navigateToEditor = useCallback(() => {
    navigateTo('/editor');
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
        appLogger.error('Erro ao abrir nova aba:', { data: [error] });
        navigateTo(path);
      }
    },
    [navigateTo],
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
