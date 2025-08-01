
import React from 'react';
import { useSchemaEditor } from '@/hooks/useSchemaEditor';
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
      <div className={`h-full w-full ${className}`}>
        <SchemaDrivenEditorResponsive funnelId={funnelId} />
      </div>
    </EditorProvider>
  );
};

export default SchemaDrivenEditorClean;
