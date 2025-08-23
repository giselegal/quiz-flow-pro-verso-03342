import { EditorPro } from '@/components/editor/EditorPro';
import { EditorProvider } from '@/components/editor/EditorProvider';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import { LovablePreviewPanel } from '@/components/lovable/LovablePreviewPanel';
import React from 'react';

/**
 * 🎯 EDITOR PRINCIPAL - ÚNICO E LIMPO
 *
 * Editor consolidado sem aninhamento excessivo
 * - Drag & drop funcional
 * - 21 etapas carregando automaticamente
 * - Interface limpa e responsiva
 * - Sem conflitos entre múltiplos editores
 * - Preview integrado no painel do Lovable ✅
 */
const MainEditor: React.FC = () => {
  return (
    <LovablePreviewPanel>
      <ErrorBoundary>
        <EditorProvider enableSupabase={false} storageKey="main-editor-state">
          <div className="min-h-screen bg-gray-50">
            {/* 🎯 CABEÇALHO PRINCIPAL */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  🎯 Quiz Quest - Editor Principal
                </h1>
              </div>
            </div>

            {/* 🎯 EDITOR COM PREVIEW INTEGRADO */}
            <EditorPro />
          </div>
        </EditorProvider>
      </ErrorBoundary>
    </LovablePreviewPanel>
  );
};

export default MainEditor;
