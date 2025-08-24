import { LovablePreviewPanel } from '@/components/lovable/LovablePreviewPanel';
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
 * - Preview integrado no painel do Lovable ✅
 * - Cabeçalho editável DENTRO do EditorPro ✅
 */
const MainEditor: React.FC = () => {
  const enableLovablePreview = (import.meta as any)?.env?.VITE_LOVABLE_PREVIEW === 'true';
  // Desabilita qualquer auto-scroll/sync no editor
  React.useEffect(() => {
    (window as any).__DISABLE_AUTO_SCROLL = true;
    (window as any).__DISABLE_SCROLL_SYNC = true;
    return () => {
      (window as any).__DISABLE_AUTO_SCROLL = false;
      (window as any).__DISABLE_SCROLL_SYNC = false;
    };
  }, []);
  return (
    <div>
      <ErrorBoundary>
        {enableLovablePreview ? (
          <LovablePreviewPanel>
            <EditorProvider enableSupabase={false} storageKey="main-editor-state">
              {/* 🎯 EDITOR PRINCIPAL COM CABEÇALHO EDITÁVEL */}
              <EditorPro />
            </EditorProvider>
          </LovablePreviewPanel>
        ) : (
          <EditorProvider enableSupabase={false} storageKey="main-editor-state">
            {/* 🎯 EDITOR PRINCIPAL COM CABEÇALHO EDITÁVEL */}
            <EditorPro />
          </EditorProvider>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default MainEditor;
