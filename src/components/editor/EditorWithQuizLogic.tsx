/**
 * EDITOR INTEGRADO COM LÓGICA DE CÁLCULO REAL
 * Wrapper que adiciona o EditorQuizProvider ao SchemaDrivenEditorResponsive
 */

import React from 'react';
import { EditorQuizProvider } from '../../contexts/EditorQuizContext';
import SchemaDrivenEditorResponsive from './SchemaDrivenEditorResponsive';

interface EditorWithQuizLogicProps {
  funnelId?: string;
  initialBlocks?: any[];
  onSave?: (project: any) => void;
}

/**
 * Editor que conecta os componentes com a lógica real de cálculo do quiz
 */
export const EditorWithQuizLogic: React.FC<EditorWithQuizLogicProps> = (props) => {
  return (
    <EditorQuizProvider>
      <SchemaDrivenEditorResponsive {...props} />
    </EditorQuizProvider>
  );
};

export default EditorWithQuizLogic;
