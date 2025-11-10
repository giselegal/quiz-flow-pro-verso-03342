/**
 * ⚠️ DEPRECATED: MIGRATION ADAPTER
 * 
 * @deprecated Este adapter foi consolidado em EditorProviderCanonical.
 * Use: import { EditorProviderCanonical } from '@/components/editor/EditorProviderCanonical';
 * 
 * Este arquivo será removido em versão futura.
 */

import React, { ReactNode, useEffect } from 'react';
import { EditorProviderCanonical, useEditor as useEditorCanonical, EditorState } from './EditorProviderCanonical';
// ❌ DEPRECATED: MigrationEditorProvider
// Mantido apenas temporariamente para evitar quebra abrupta. Será removido após confirmação de zero imports.
import { UnifiedCRUDProvider } from '@/contexts';
import { appLogger } from '@/lib/utils/appLogger';

export type UnifiedEditorContextType = ReturnType<typeof useEditorCanonical>;

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
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      appLogger.warn('[DEPRECATED] MigrationEditorProvider - use EditorProviderCanonical diretamente.');
    }
  }, []);
  return <EditorProviderCanonical>{children}</EditorProviderCanonical>;
};

export function useUnifiedEditor(): UnifiedEditorContextType;
export function useUnifiedEditor(options: { optional: true }): UnifiedEditorContextType | undefined;
export function useUnifiedEditor(options?: { optional?: boolean }): UnifiedEditorContextType | undefined {
  // Se optional for true, passar como { optional: true }, senão não passar nada
  const context = options?.optional
    ? useEditorCanonical({ optional: true })
    : useEditorCanonical();

  if (!context && !options?.optional) {
    throw new Error('useUnifiedEditor deve ser usado dentro de MigrationEditorProvider');
  }

  return context;
}

export const useEditor = useUnifiedEditor;
export const EditorProvider = EditorProviderCanonical;
export default MigrationEditorProvider;

export type { UnifiedEditorContextType as EditorContextValue };
