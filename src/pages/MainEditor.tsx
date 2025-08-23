import React from 'react';
import { EditorProvider } from '../components/editor/EditorProvider';
import { ErrorBoundary } from '../components/editor/ErrorBoundary';
import SchemaDrivenEditorResponsive from '../components/editor/SchemaDrivenEditorResponsive';

/**
 * 🎯 EDITOR PRINCIPAL CONSOLIDADO
 *
 * Usando SchemaDrivenEditorResponsive que é comprovadamente funcional:
 * ✅ Layout 4 colunas responsivo
 * ✅ Drag & drop com @dnd-kit
 * ✅ Canvas CanvasDropZone.simple
 * ✅ EditorContext integrado
 * ✅ Biblioteca de componentes
 * ✅ Painel de propriedades
 */
const MainEditor: React.FC = () => {
  return (
    <ErrorBoundary>
      <EditorProvider enableSupabase={false} storageKey="main-editor-state">
        <div className="h-screen w-full overflow-hidden bg-gray-50">
          <SchemaDrivenEditorResponsive mode="editor" className="h-full" />
        </div>
      </EditorProvider>
    </ErrorBoundary>
  );
};

export default MainEditor;
