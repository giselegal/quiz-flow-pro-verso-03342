import React from 'react';
import { EditorPro } from '../components/editor/EditorPro';
import { EditorProvider } from '../components/editor/EditorProvider';
import { ErrorBoundary } from '../components/editor/ErrorBoundary';
import { QuizFlowProvider } from '@/context/QuizFlowProvider';

/**
 * 🎯 EDITOR PRINCIPAL - ÚNICO E LIMPO
 *
 * Editor consolidado sem aninhamento excessivo
 * - Drag & drop funcional
 * - 21 etapas carregando automaticamente
 * - Interface limpa e responsiva
 * - Sem conflitos entre múltiplos editores
 * - Preview Lovable removido para evitar interferência no DnD
 * - Cabeçalho editável DENTRO do EditorPro ✅
 */
const MainEditor: React.FC = () => {
  return (
    <div>
      <ErrorBoundary>
        <QuizFlowProvider>
          <EditorProvider enableSupabase={false} storageKey="main-editor-state">
            {/* 🎯 EDITOR PRINCIPAL COM CABEÇALHO EDITÁVEL */}
            <EditorPro />
          </EditorProvider>
        </QuizFlowProvider>
      </ErrorBoundary>
    </div>
  );
};

export default MainEditor;
