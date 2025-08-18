import React from 'react';
import { EditorProvider } from '@/context/EditorContext';
import { FunnelsProvider } from '@/context/FunnelsContext';
import { EditorQuizProvider } from '@/context/EditorQuizContext';
import SchemaDrivenEditorResponsive from '@/components/editor/SchemaDrivenEditorResponsive';

/**
 * 🎯 PÁGINA PRINCIPAL DO EDITOR
 * 
 * Integra todos os contextos necessários e o layout responsivo
 * com as 21 etapas do quiz de estilo pessoal
 */
const EditorPage: React.FC = () => {
  return (
    <FunnelsProvider debug={true}>
      <EditorProvider>
        <EditorQuizProvider>
          <div className="h-screen w-full overflow-hidden bg-background">
            <SchemaDrivenEditorResponsive />
          </div>
        </EditorQuizProvider>
      </EditorProvider>
    </FunnelsProvider>
  );
};

export default EditorPage;