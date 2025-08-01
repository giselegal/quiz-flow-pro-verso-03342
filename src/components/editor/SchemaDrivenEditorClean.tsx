
import React from 'react';
import { EditorProvider } from '@/context/EditorContext';
import SchemaDrivenEditorResponsive from './SchemaDrivenEditorResponsive';

interface SchemaDrivenEditorCleanProps {
  funnelId?: string;
  className?: string;
}

export const SchemaDrivenEditorClean: React.FC<SchemaDrivenEditorCleanProps> = ({
  funnelId,
  className = ''
}) => {
  return (
    <EditorProvider>
      <div className={`h-screen w-full overflow-hidden ${className}`}>
        <SchemaDrivenEditorResponsive funnelId={funnelId} />
      </div>
    </EditorProvider>
  );
};

export default SchemaDrivenEditorClean;
