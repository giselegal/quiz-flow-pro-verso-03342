/**
 * Migration Adapter - FASE 5 SIMPLIFICADO
 */

import React, { ReactNode } from 'react';
import { OptimizedEditorProvider, useEditor as useOptimizedEditor } from './OptimizedEditorProvider';
import { UnifiedCRUDProvider } from '@/context/UnifiedCRUDProvider';

export type UnifiedEditorContextType = ReturnType<typeof useOptimizedEditor>;

export const MigrationEditorProvider: React.FC<{
  children: ReactNode;
  funnelId?: string;
  quizId?: string;
  enableSupabase?: boolean;
  legacyMode?: boolean;
}> = ({ children }) => {
  return (
    <UnifiedCRUDProvider>
      <OptimizedEditorProvider>
        {children}
      </OptimizedEditorProvider>
    </UnifiedCRUDProvider>
  );
};

export const useUnifiedEditor = (): UnifiedEditorContextType => {
  const context = useOptimizedEditor();

  if (!context) {
    throw new Error('useUnifiedEditor deve ser usado dentro de MigrationEditorProvider');
  }

  return context;
};

export const useEditor = useUnifiedEditor;
export const EditorProvider = MigrationEditorProvider;
export default MigrationEditorProvider;

export type { UnifiedEditorContextType as EditorContextValue };
