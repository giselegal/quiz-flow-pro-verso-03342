
import React from 'react';
import { EditorWorkspace } from './layouts/EditorWorkspace';

interface SchemaDrivenEditorResponsiveProps {
  funnelId?: string;
  className?: string;
}

const SchemaDrivenEditorResponsive: React.FC<SchemaDrivenEditorResponsiveProps> = ({
  funnelId,
  className
}) => {
  return (
    <div className={className}>
      <EditorWorkspace />
    </div>
  );
};

export default SchemaDrivenEditorResponsive;
