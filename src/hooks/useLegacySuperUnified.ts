/**
 * 🔄 HOOK DE COMPATIBILIDADE - useLegacySuperUnified
 * 
 * Hook temporário para manter compatibilidade durante migração V1 → V2
 * 
 * USO: Substitua imports de V1 por este hook durante migração incremental
 * 
 * ANTES (V1):
 * ```typescript
 * import { useSuperUnified } from 'LEGACY_SUPER_UNIFIED_PROVIDER_PATH';
 * const { auth, theme, editor } = useSuperUnified();
 * ```
 * 
 * DURANTE MIGRAÇÃO:
 * ```typescript
 * import { useLegacySuperUnified } from '@/hooks/useLegacySuperUnified';
 * const { auth, theme, editor } = useLegacySuperUnified();
 * ```
 * 
 * DEPOIS (V2 - Meta final):
 * ```typescript
 * import { useAuth } from '@/contexts/auth/AuthProvider';
 * import { useTheme } from '@/contexts/theme/ThemeProvider';
 * import { useEditorState } from '@/contexts/editor/EditorStateProvider';
 * 
 * const auth = useAuth();
 * const theme = useTheme();
 * const editor = useEditorState();
 * ```
 * 
 * ⚠️ Este hook será removido após migração completa para V2
 */

import { useAuth } from '@/contexts/auth/AuthProvider';
import { useTheme } from '@/contexts/theme/ThemeProvider';
import { useEditorState } from '@/contexts/editor/EditorStateProvider';
import { useFunnelData } from '@/contexts/funnel/FunnelDataProvider';
import { useNavigation } from '@/contexts/navigation/NavigationProvider';
import { useQuizState } from '@/contexts/quiz/QuizStateProvider';
import { useResult } from '@/contexts/result/ResultProvider';
import { useStorage } from '@/contexts/storage/StorageProvider';
import { useSync } from '@/contexts/sync/SyncProvider';
import { useValidation } from '@/contexts/validation/ValidationProvider';
import { useCollaboration } from '@/contexts/collaboration/CollaborationProvider';
import { useVersioning } from '@/contexts/versioning/VersioningProvider';
import { appLogger } from '@/lib/utils/appLogger';
import { useEffect } from 'react';

/**
 * Interface que mimetiza o retorno do useSuperUnified V1
 * mas usando providers V2 modulares por baixo
 */
export interface LegacySuperUnifiedContext {
  auth: ReturnType<typeof useAuth>;
  theme: ReturnType<typeof useTheme>;
  editor: ReturnType<typeof useEditorState>;
  funnel: ReturnType<typeof useFunnelData>;
  navigation: ReturnType<typeof useNavigation>;
  quiz: ReturnType<typeof useQuizState>;
  result: ReturnType<typeof useResult>;
  storage: ReturnType<typeof useStorage>;
  sync: ReturnType<typeof useSync>;
  validation: ReturnType<typeof useValidation>;
  collaboration: ReturnType<typeof useCollaboration>;
  versioning: ReturnType<typeof useVersioning>;
}

/**
 * Hook de compatibilidade que agrega todos os hooks V2 modulares
 * mantendo interface similar ao V1 monolítico
 * 
 * @deprecated Este é um hook temporário. Migre para hooks individuais (useAuth, useTheme, etc)
 */
export function useLegacySuperUnified(): LegacySuperUnifiedContext {
  useEffect(() => {
    appLogger.warn(
      '[useLegacySuperUnified] ⚠️ Usando hook de compatibilidade. ' +
      'Migre para hooks individuais (useAuth, useTheme, etc) para melhor performance.'
    );
  }, []);

  const auth = useAuth();
  const theme = useTheme();
  const editor = useEditorState();
  const funnel = useFunnelData();
  const navigation = useNavigation();
  const quiz = useQuizState();
  const result = useResult();
  const storage = useStorage();
  const sync = useSync();
  const validation = useValidation();
  const collaboration = useCollaboration();
  const versioning = useVersioning();

  return {
    auth,
    theme,
    editor,
    funnel,
    navigation,
    quiz,
    result,
    storage,
    sync,
    validation,
    collaboration,
    versioning,
  };
}

/**
 * Hook de migração específico para Auth
 * Mais performático que useLegacySuperUnified quando só precisa de auth
 */
export function useMigrateAuth() {
  useEffect(() => {
    appLogger.info('[useMigrateAuth] ✅ Usando hook migrado (auth only)');
  }, []);
  
  return useAuth();
}

/**
 * Hook de migração específico para Theme
 */
export function useMigrateTheme() {
  useEffect(() => {
    appLogger.info('[useMigrateTheme] ✅ Usando hook migrado (theme only)');
  }, []);
  
  return useTheme();
}

/**
 * Hook de migração específico para Editor
 */
export function useMigrateEditor() {
  useEffect(() => {
    appLogger.info('[useMigrateEditor] ✅ Usando hook migrado (editor only)');
  }, []);
  
  return useEditorState();
}

/**
 * Guia de migração inline para desenvolvedores
 */
export const MIGRATION_GUIDE = {
  from: 'useSuperUnified',
  to: {
    auth: 'useAuth from @/contexts/auth/AuthProvider',
    theme: 'useTheme from @/contexts/theme/ThemeProvider',
    editor: 'useEditorState from @/contexts/editor/EditorStateProvider',
    funnel: 'useFunnelData from @/contexts/funnel/FunnelDataProvider',
    navigation: 'useNavigation from @/contexts/navigation/NavigationProvider',
    quiz: 'useQuizState from @/contexts/quiz/QuizStateProvider',
    result: 'useResult from @/contexts/result/ResultProvider',
    storage: 'useStorage from @/contexts/storage/StorageProvider',
    sync: 'useSync from @/contexts/sync/SyncProvider',
    validation: 'useValidation from @/contexts/validation/ValidationProvider',
    collaboration: 'useCollaboration from @/contexts/collaboration/CollaborationProvider',
    versioning: 'useVersioning from @/contexts/versioning/VersioningProvider',
  },
  performance: {
    v1: 'Re-render de TODOS os consumers quando qualquer state muda',
    v2: 'Re-render apenas dos consumers do hook específico modificado',
    improvement: '~85% redução de re-renders desnecessários',
  },
};
