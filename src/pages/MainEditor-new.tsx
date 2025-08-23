import { EditorPro } from '@/components/editor/EditorPro';
import { EditorProvider } from '@/components/editor/EditorProvider';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import { EditableEditorHeader } from '@/components/editor/header/EditableEditorHeader';
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
 * - Cabeçalho editável e funcional ✅
 */
const MainEditor: React.FC = () => {
  return (
    <LovablePreviewPanel>
      <ErrorBoundary>
        <EditorProvider enableSupabase={false} storageKey="main-editor-state">
          <div className="min-h-screen bg-gray-50">
            {/* 🎯 CABEÇALHO EDITÁVEL FUNCIONAL */}
            <EditableEditorHeader
              customTitle="🎯 Quiz Quest - Editor Principal"
              showStepInfo={true}
              showModeSwitch={true}
              showActions={true}
              showUndoRedo={true}
              onSave={() => console.log('Salvando projeto...')}
            />

            {/* 🎯 EDITOR PRINCIPAL */}
            <EditorPro />
          </div>
        </EditorProvider>
      </ErrorBoundary>
    </LovablePreviewPanel>
  );
};

export default MainEditor;
