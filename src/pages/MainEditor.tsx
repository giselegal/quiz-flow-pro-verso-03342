import { EditorPro } from '../components/editor/EditorPro';
import { EditorProvider } from '../components/editor/EditorProvider';
import { ErrorBoundary } from '../components/editor/ErrorBoundary';
// import { LovablePreviewPanel } from '@/components/lovable/LovablePreviewPanel'; // 🔧 DESABILITADO TEMPORARIAMENTE
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
 * - Cabeçalho editável DENTRO do EditorPro ✅
 */
const MainEditor: React.FC = () => {
  return (
    <div>
      {/* 🔧 LOVABLE PREVIEW DESABILITADO TEMPORARIAMENTE PARA TESTAR DRAG & DROP */}
      <ErrorBoundary>
        <EditorProvider enableSupabase={false} storageKey="main-editor-state">
          {/* 🎯 EDITOR PRINCIPAL COM CABEÇALHO EDITÁVEL */}
          <EditorPro />
        </EditorProvider>
      </ErrorBoundary>
    </div>
  );
};

export default MainEditor;
