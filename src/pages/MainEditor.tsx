import { QuizFlowProvider } from '@/context/QuizFlowProvider';
import React from 'react';
import { EditorPro } from '../components/editor/EditorPro';
import { EditorProvider } from '../components/editor/EditorProvider';
import { ErrorBoundary } from '../components/editor/ErrorBoundary';

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
          <EditorProvider
            enableSupabase={(import.meta as any)?.env?.VITE_ENABLE_SUPABASE === 'true'}
            funnelId={(import.meta as any)?.env?.VITE_SUPABASE_FUNNEL_ID}
            quizId={(import.meta as any)?.env?.VITE_SUPABASE_QUIZ_ID}
            storageKey="main-editor-state"
          >
            {/* 🎯 EDITOR PRINCIPAL COM CABEÇALHO EDITÁVEL */}
            <EditorPro />
          </EditorProvider>
        </QuizFlowProvider>
      </ErrorBoundary>
    </div>
  );
};

export default MainEditor;
