
import React from 'react';
import { EditorQuizProvider } from '../context/EditorQuizContext';
import SchemaDrivenEditorResponsive from '../components/editor/SchemaDrivenEditorResponsive';

interface EnhancedEditorPageProps {
  funnelId?: string;
}

const EnhancedEditorPage: React.FC<EnhancedEditorPageProps> = ({ funnelId }) => {
  return (
    <EditorQuizProvider>
      <div className="h-screen w-full">
        <SchemaDrivenEditorResponsive funnelId={funnelId} />
      </div>
    </EditorQuizProvider>
  );
};

export default EnhancedEditorPage;
