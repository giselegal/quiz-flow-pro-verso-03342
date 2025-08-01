
import React from 'react';
import { SchemaDrivenEditorClean } from '../editor/SchemaDrivenEditorClean';

interface EnhancedEditorProps {
  funnelId?: string;
}

const EnhancedEditor: React.FC<EnhancedEditorProps> = ({ funnelId }) => {
  return (
    <div className="h-screen w-full">
      <SchemaDrivenEditorClean funnelId={funnelId} />
    </div>
  );
};

export default EnhancedEditor;
