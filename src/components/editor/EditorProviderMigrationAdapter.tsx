/**
 * Migration Adapter - SPRINT 1 ATUALIZADO
 * 
 * Agora usa EditorProviderUnified consolidado
 */

import React, { ReactNode } from 'react';
import { EditorProviderUnified, useEditor as useEditorUnified } from './EditorProviderUnified';
import { UnifiedCRUDProvider } from '@/contexts';

export type UnifiedEditorContextType = ReturnType<typeof useEditorUnified>;

export const MigrationEditorProvider: React.FC<{
  children: ReactNode;
  funnelId?: string;
  quizId?: string;
  enableSupabase?: boolean;
  legacyMode?: boolean;
}> = ({ children, funnelId, quizId, enableSupabase = false }) => {
  return (
    <UnifiedCRUDProvider>
      <EditorProviderUnified
        funnelId={funnelId}
        quizId={quizId}
        enableSupabase={enableSupabase}
      >
        {children}
      </EditorProviderUnified>
    </UnifiedCRUDProvider>
  );
};

export const useUnifiedEditor = (): UnifiedEditorContextType => {
  const context = useEditorUnified();

  if (!context) {
    throw new Error('useUnifiedEditor deve ser usado dentro de MigrationEditorProvider');
  }

  return context;
};

export const useEditor = useUnifiedEditor;
export const EditorProvider = MigrationEditorProvider;
export default MigrationEditorProvider;

export type { UnifiedEditorContextType as EditorContextValue };
