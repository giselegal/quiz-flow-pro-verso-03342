/**
 * 🔧 USE EDITOR INTEGRATION - STUB
 * Stub temporário para desbloquear build
 */

import { useCallback } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

export interface EditorIntegrationHook {
  saveChanges: () => Promise<void>;
  loadTemplate: (templateId: string) => Promise<void>;
  isReady: boolean;
}

export const useEditorIntegration = (): EditorIntegrationHook => {
  const saveChanges = useCallback(async () => {
    appLogger.warn('[useEditorIntegration] Stub - saveChanges não implementado');
  }, []);

  const loadTemplate = useCallback(async (templateId: string) => {
    appLogger.warn('[useEditorIntegration] Stub - loadTemplate não implementado', { templateId });
  }, []);

  return {
    saveChanges,
    loadTemplate,
    isReady: true,
  };
};

export default useEditorIntegration;
