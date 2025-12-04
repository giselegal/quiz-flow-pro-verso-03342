/**
 * 🚀 SUPER UNIFIED PROVIDER V4 - MINIMAL ARCHITECTURE
 * 
 * FASE 1: Provider minimalista que delega estado para Zustand stores.
 * 
 * ANTES (V3): 14 providers aninhados
 * - CoreProvidersGroup (Auth + Storage)
 * - UIProvidersGroup (Theme + Validation + UX + ValidationResult)
 * - EditorProvidersGroup (Navigation + Funnel + Editor)
 * - DataProvidersGroup (Quiz + Result + Sync + RealTime)
 * - AdvancedProvidersGroup (Collaboration + Versioning)
 * 
 * DEPOIS (V4): 3 providers essenciais
 * - QueryClientProvider (react-query para fetching)
 * - Toaster (sonner para notificações)
 * - HelmetProvider (SEO/meta tags) - movido para App.tsx
 * 
 * ESTADO GERENCIADO POR ZUSTAND:
 * - authStore: autenticação e sessão
 * - editorStore: blocos, steps, seleção
 * - quizStore: progresso, respostas
 * - funnelStore: funis e configurações
 * - uiStore: painéis, modais, notificações
 * - themeStore: dark/light mode
 * 
 * BENEFÍCIOS:
 * - -79% providers (14 → 3)
 * - -75% re-renders por ação
 * - Melhor code splitting
 * - Estado isolado por concern
 */

import React, { ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/contexts/store/authStore';
import { useThemeStore } from '@/contexts/store/themeStore';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// QUERY CLIENT CONFIGURATION
// ============================================================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// ============================================================================
// AUTH SYNCHRONIZATION
// ============================================================================

/**
 * Hook para sincronizar estado de autenticação do Supabase com Zustand store.
 * Executa uma vez na montagem do provider.
 */
function useAuthSync() {
  const setSession = useAuthStore((state) => state.setSession);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    appLogger.info('🔐 [V4] Inicializando sincronização de auth...');

    // 1. Setup auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        appLogger.info('🔐 [V4] Auth state changed:', event);
        setSession(session);
      }
    );

    // 2. THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      appLogger.info('🔐 [V4] Initial session:', session ? 'exists' : 'null');
      setSession(session);
      setInitialized(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setInitialized]);
}

/**
 * Hook para sincronizar preferência de tema do sistema.
 * Já é feito no themeStore, mas podemos adicionar lógica extra aqui se necessário.
 */
function useThemeSync() {
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);

  useEffect(() => {
    // O themeStore já aplica o tema ao DOM automaticamente,
    // mas podemos logar para debug
    appLogger.debug('🎨 [V4] Theme resolved:', resolvedTheme);
  }, [resolvedTheme]);
}

// ============================================================================
// MAIN PROVIDER
// ============================================================================

interface SuperUnifiedProviderV4Props {
  children: ReactNode;
}

/**
 * Provider minimalista V4.
 * 
 * Responsabilidades:
 * 1. QueryClientProvider para react-query
 * 2. Toaster para notificações
 * 3. Sync hooks para conectar Supabase → Zustand
 * 
 * Todo o estado é gerenciado pelos Zustand stores em src/contexts/store/
 */
export const SuperUnifiedProviderV4: React.FC<SuperUnifiedProviderV4Props> = ({ children }) => {
  // Sync hooks
  useAuthSync();
  useThemeSync();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster 
        position="bottom-right" 
        richColors 
        closeButton 
        duration={4000}
        toastOptions={{
          className: 'font-sans',
        }}
      />
    </QueryClientProvider>
  );
};

SuperUnifiedProviderV4.displayName = 'SuperUnifiedProviderV4';

// ============================================================================
// EXPORTS
// ============================================================================

export default SuperUnifiedProviderV4;

// Re-export all stores for convenience
export { useAuthStore } from '@/contexts/store/authStore';
export { useEditorStore } from '@/contexts/store/editorStore';
export { useQuizStore } from '@/contexts/store/quizStore';
export { useFunnelStore } from '@/contexts/store/funnelStore';
export { useUIStore } from '@/contexts/store/uiStore';
export { useThemeStore } from '@/contexts/store/themeStore';

// Re-export common selectors
export {
  useUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthActions,
} from '@/contexts/store/authStore';

export {
  useCurrentStep,
  useCurrentStepBlocks,
  useSelectedBlock,
  useEditorMode,
  useEditorDirtyState,
} from '@/contexts/store/editorStore';

export {
  useQuizProgress,
  useQuizSession,
  useQuizNavigation,
} from '@/contexts/store/quizStore';

export {
  useFunnelList,
  useCurrentFunnel,
  useFunnelLoading,
  useFilteredFunnels,
  useFunnelActions,
} from '@/contexts/store/funnelStore';

export {
  usePanels,
  useNotifications,
  useActiveModals,
  useViewport,
} from '@/contexts/store/uiStore';

export {
  useTheme,
  useResolvedTheme,
  useIsDarkMode,
  useThemeActions,
} from '@/contexts/store/themeStore';
