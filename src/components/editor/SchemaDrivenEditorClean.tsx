
import React from 'react';
import { useSchemaEditor } from '@/hooks/useSchemaEditor';
import SchemaDrivenEditorResponsive from './SchemaDrivenEditorResponsive';

interface SchemaDrivenEditorCleanProps {
  funnelId?: string;
  className?: string;
}

export const SchemaDrivenEditorClean: React.FC<SchemaDrivenEditorCleanProps> = ({
  funnelId,
  className = ''
}) => {
  const {
    steps,
    currentStepIndex,
    selectedBlockId,
    isLoading,
    error,
    actions
  } = useSchemaEditor(funnelId);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B89B7A] mx-auto mb-4"></div>
          <p className="text-[#8F7A6A]">Carregando editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar editor:</p>
          <p className="text-[#8F7A6A]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <SchemaDrivenEditorResponsive
      funnelId={funnelId}
      className={className}
    />
  );
};

export default SchemaDrivenEditorClean;
