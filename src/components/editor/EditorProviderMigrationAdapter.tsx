/**
 * Migration Adapter - SPRINT 1 ATUALIZADO
 * 
 * Agora usa EditorProviderUnified consolidado
 */

import React, { ReactNode } from 'react';
import { EditorProviderUnified, useEditor as useEditorUnified, EditorState } from './EditorProviderUnified';
import { UnifiedCRUDProvider } from '@/contexts';

export type UnifiedEditorContextType = ReturnType<typeof useEditorUnified>;

// Re-export EditorState for compatibility
export type { EditorState };

export const MigrationEditorProvider: React.FC<{
  children: ReactNode;
  funnelId?: string;
  quizId?: string;
  storageKey?: string;
  enableSupabase?: boolean;
  legacyMode?: boolean;
}> = ({ children, funnelId, quizId, storageKey, enableSupabase = false }) => {
  return (
    <UnifiedCRUDProvider>
      <EditorProviderUnified
        funnelId={funnelId}
        quizId={quizId}
        storageKey={storageKey}
        enableSupabase={enableSupabase}
      >
        {children}
      </EditorProviderUnified>
    </UnifiedCRUDProvider>
  );
};

export function useUnifiedEditor(): UnifiedEditorContextType;
export function useUnifiedEditor(options: { optional: true }): UnifiedEditorContextType | undefined;
export function useUnifiedEditor(options?: { optional?: boolean }): UnifiedEditorContextType | undefined {
  const context = useEditorUnified();

  if (!context && !options?.optional) {
    throw new Error('useUnifiedEditor deve ser usado dentro de MigrationEditorProvider');
  }

  return context;
}

export const useEditor = useUnifiedEditor;
export const EditorProvider = MigrationEditorProvider;
export default MigrationEditorProvider;

export type { UnifiedEditorContextType as EditorContextValue };
