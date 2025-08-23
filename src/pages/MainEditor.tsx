import { EditorPro } from '@/components/editor/EditorPro';
import { EditorProvider } from '@/components/editor/EditorProvider';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import React from 'react';

/**
 * 🎯 EDITOR PRINCIPAL - ÚNICO E LIMPO
 *
 * Editor consolidado sem aninhamento excessivo
 * - Drag & drop funcional
 * - 21 etapas carregando automaticamente
 * - Interface limpa e responsiva
 * - Sem conflitos entre múltiplos editores
 */
const MainEditor: React.FC = () => {
  return (
    <ErrorBoundary>
      <EditorProvider enableSupabase={false} storageKey="main-editor-state">
        <EditorPro />
      </EditorProvider>
    </ErrorBoundary>
  );
};

export default MainEditor;
