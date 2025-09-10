import React from 'react';
import { EditorPro } from '@/components/editor/EditorPro';
import { EditorProvider } from '@/components/editor/EditorProvider';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';

/**
 * 🎯 EDITOR UNIFICADO - PONTO DE ENTRADA PRINCIPAL
 *
 * Editor consolidado com todas as funcionalidades:
 * - Drag & drop funcional via @dnd-kit
 * - 21 etapas carregando automaticamente  
 * - Interface responsiva de 4 colunas
 * - Supabase para persistência de dados
 * - Painel de propriedades unificado
 * - Auto-save e histórico (Ctrl+Z/Y)
 */
const MainEditorUnified: React.FC = () => {
  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      <ErrorBoundary>
        <EditorProvider enableSupabase={true} storageKey="main-editor-unified">
          <EditorPro />
        </EditorProvider>
      </ErrorBoundary>
    </div>
  );
};

export default MainEditorUnified;