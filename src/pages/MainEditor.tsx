import { EditorPro } from '@/components/editor/EditorPro';
import { EditorProvider } from '@/components/editor/EditorProvider';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import { LovablePreviewPanel } from '@/components/lovable/LovablePreviewPanel';
import { useLovablePreview } from '@/hooks/useLovablePreview';
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
  // 🎯 Ativa preview no Lovable automaticamente
  const { isPreviewActive, previewMode } = useLovablePreview();

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
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isPreviewActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isPreviewActive ? '✅ Painel Lovable Ativo' : '⏳ Carregando Preview'}
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    👁️ Preview Integrado
                  </div>
                  <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    🚀 {previewMode} ON
                  </div>
                </div>
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
